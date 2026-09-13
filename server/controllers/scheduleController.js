/**
 * SCHEDULE CONTROLLER
 * REST API endpoints for scheduled publishing, unpublishing, revisions, and automation.
 */
const ScheduledAction = require('../models/ScheduledAction');
const Revision = require('../models/Revision');
const { localToUTC, formatInTimezone, isValidTimezone, DEFAULT_TIMEZONE } = require('../utils/timezoneHelper');
const { detectScheduleConflicts } = require('../utils/scheduleConflict');
const {
  runDueScheduledActions,
  getSchedulerHealthStats,
  recordSchedulerActivity,
  sendSchedulerNotification,
} = require('../services/schedulerService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const { IN_MEMORY_SCHEDULES } = require('../utils/scheduleStore');

function isDbActive() {
  return Boolean(ScheduledAction.db && ScheduledAction.db.readyState === 1);
}

async function dbCreateSchedule(data) {
  if (isDbActive()) {
    try {
      return await ScheduledAction.create(data);
    } catch (e) {
      console.warn('[ScheduleController] DB create failed, falling back to memory store:', e.message);
    }
  }
  const id = 'sched-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  const memDoc = {
    _id: id,
    id,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
    retryCount: 0,
    maxRetries: data.maxRetries || 3,
    save: async function () {
      this.updatedAt = new Date();
      return this;
    },
  };
  IN_MEMORY_SCHEDULES.push(memDoc);
  return memDoc;
}

async function dbFindScheduleById(id) {
  if (isDbActive()) {
    try {
      const doc = await ScheduledAction.findById(id).populate('revisionId');
      if (doc) return doc;
    } catch (e) {}
  }
  return IN_MEMORY_SCHEDULES.find((s) => String(s._id) === String(id) || String(s.id) === String(id)) || null;
}

async function dbDeleteScheduleById(id) {
  if (isDbActive()) {
    try {
      return await ScheduledAction.findByIdAndDelete(id);
    } catch (e) {}
  }
  const idx = IN_MEMORY_SCHEDULES.findIndex((s) => String(s._id) === String(id) || String(s.id) === String(id));
  if (idx !== -1) {
    return IN_MEMORY_SCHEDULES.splice(idx, 1)[0];
  }
  return null;
}

/**
 * Format schedule document for API response with human-readable timezone string
 */
function enrichScheduleDoc(doc, targetTz) {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  const tz = targetTz || obj.timezone || DEFAULT_TIMEZONE;
  obj.timeDetails = formatInTimezone(obj.scheduledFor, tz);
  if (obj.executedAt) {
    obj.executedTimeDetails = formatInTimezone(obj.executedAt, tz);
  }
  return obj;
}

/**
 * POST /api/admin/schedules
 * Create a new scheduled action
 */
const createSchedule = async (req, res, next) => {
  try {
    const {
      entityType,
      entityId,
      entityTitle,
      actionType,
      revisionId,
      revisionVersion,
      scheduledFor,
      scheduledDate,
      scheduledTime,
      timezone = DEFAULT_TIMEZONE,
      notes = '',
      metadata = {},
      force = false,
    } = req.body;

    if (!entityType || !entityId || !actionType) {
      return sendError(res, 'entityType, entityId, and actionType are required.', 400);
    }

    // Determine target execution Date in UTC
    let targetUtcDate;
    try {
      if (scheduledDate && scheduledTime) {
        targetUtcDate = localToUTC(scheduledDate, scheduledTime, timezone);
      } else if (scheduledFor) {
        targetUtcDate = typeof scheduledFor === 'string' && !scheduledFor.endsWith('Z') && !scheduledFor.includes('+')
          ? localToUTC(scheduledFor, '00:00', timezone)
          : new Date(scheduledFor);
      } else {
        return sendError(res, 'scheduledFor or scheduledDate+scheduledTime is required.', 400);
      }
    } catch (dateErr) {
      return sendError(res, `Invalid date/time specification: ${dateErr.message}`, 400);
    }

    if (isNaN(targetUtcDate.getTime())) {
      return sendError(res, 'Invalid scheduled execution timestamp.', 400);
    }

    // Validate revision if provided
    let revVersionNum = revisionVersion ? Number(revisionVersion) : null;
    let validRevId = revisionId || null;

    if (revisionId && !revVersionNum && Revision.db && Revision.db.readyState === 1) {
      const rev = await Revision.findById(revisionId);
      if (rev) {
        revVersionNum = rev.version;
      }
    }

    // Run conflict detection
    const conflictResult = await detectScheduleConflicts({
      entityType,
      entityId,
      actionType,
      scheduledFor: targetUtcDate,
      revisionVersion: revVersionNum,
    });

    if (conflictResult.hasConflict && !force) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'SCHEDULE_CONFLICT',
          message: 'Schedule conflict or warning detected. Review conflicts or confirm with force: true.',
          warnings: conflictResult.warnings,
        },
      });
    }

    const newSchedule = await dbCreateSchedule({
      entityType,
      entityId: String(entityId),
      entityTitle: entityTitle || `${entityType} Action`,
      actionType,
      revisionId: validRevId,
      revisionVersion: revVersionNum,
      scheduledFor: targetUtcDate,
      timezone: isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE,
      status: 'SCHEDULED',
      notes,
      metadata: {
        ...metadata,
        conflictWarnings: conflictResult.warnings,
      },
      createdBy: {
        id: req.user?.id || 'admin',
        email: req.user?.email || 'anuragsahu@anuragsahu.dev',
        name: req.user?.name || 'Anurag Sahu',
      },
    });

    await recordSchedulerActivity(
      'SCHEDULE_CREATED',
      entityType,
      entityId,
      {
        scheduleId: newSchedule._id,
        actionType,
        scheduledFor: targetUtcDate,
        timezone,
        revisionVersion: revVersionNum,
      },
      req.user
    );

    const enriched = enrichScheduleDoc(newSchedule, timezone);
    return sendSuccess(res, { schedule: enriched }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/schedules
 * List schedules with filtering, search, pagination
 */
const getSchedules = async (req, res, next) => {
  try {
    const {
      status,
      entityType,
      actionType,
      search,
      startDate,
      endDate,
      timezone = DEFAULT_TIMEZONE,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (status && status !== 'ALL') {
      if (status === 'UPCOMING') {
        filter.status = 'SCHEDULED';
      } else {
        filter.status = status;
      }
    }

    if (entityType && entityType !== 'ALL') {
      filter.entityType = entityType;
    }

    if (actionType && actionType !== 'ALL') {
      filter.actionType = actionType;
    }

    if (startDate || endDate) {
      filter.scheduledFor = {};
      if (startDate) filter.scheduledFor.$gte = new Date(startDate);
      if (endDate) filter.scheduledFor.$lte = new Date(endDate);
    }

    if (search && search.trim()) {
      filter.$or = [
        { entityTitle: { $regex: search.trim(), $options: 'i' } },
        { entityId: { $regex: search.trim(), $options: 'i' } },
        { notes: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    let total = 0;
    let schedules = [];

    if (ScheduledAction.db && ScheduledAction.db.readyState === 1) {
      try {
        [total, schedules] = await Promise.all([
          ScheduledAction.countDocuments(filter),
          ScheduledAction.find(filter)
            .sort({ scheduledFor: filter.status === 'COMPLETED' ? -1 : 1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum),
        ]);
      } catch (e) {}
    }

    if (schedules.length === 0 && IN_MEMORY_SCHEDULES.length > 0) {
      let filtered = [...IN_MEMORY_SCHEDULES];
      if (filter.status) filtered = filtered.filter((s) => s.status === filter.status);
      if (filter.entityType) filtered = filtered.filter((s) => s.entityType === filter.entityType);
      if (filter.actionType) filtered = filtered.filter((s) => s.actionType === filter.actionType);
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (s) =>
            (s.entityTitle && s.entityTitle.toLowerCase().includes(q)) ||
            (s.entityId && s.entityId.toLowerCase().includes(q)) ||
            (s.notes && s.notes.toLowerCase().includes(q))
        );
      }
      total = filtered.length;
      filtered.sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
      schedules = filtered.slice(skip, skip + limitNum);
    }

    const enriched = schedules.map((s) => enrichScheduleDoc(s, timezone));

    return sendSuccess(res, {
      count: enriched.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      schedules: enriched,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/schedules/:id
 * Retrieve single schedule details
 */
const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await dbFindScheduleById(id);
    if (!schedule) {
      return sendError(res, 'Scheduled action not found.', 404);
    }

    const enriched = enrichScheduleDoc(schedule, req.query.timezone);
    return sendSuccess(res, { schedule: enriched });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/schedules/:id
 * Reschedule or update notes / revision
 */
const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await dbFindScheduleById(id);
    if (!schedule) {
      return sendError(res, 'Scheduled action not found.', 404);
    }

    if (schedule.status !== 'SCHEDULED' && schedule.status !== 'FAILED') {
      return sendError(res, `Cannot modify action with status "${schedule.status}".`, 400);
    }

    const { scheduledFor, scheduledDate, scheduledTime, timezone, notes, revisionVersion, force = false } = req.body;

    let newScheduledFor = schedule.scheduledFor;
    const targetTz = timezone || schedule.timezone;

    if (scheduledDate && scheduledTime) {
      newScheduledFor = localToUTC(scheduledDate, scheduledTime, targetTz);
    } else if (scheduledFor) {
      newScheduledFor = new Date(scheduledFor);
    }

    const newRevVersion = revisionVersion !== undefined ? Number(revisionVersion) : schedule.revisionVersion;

    // Detect conflicts for updated schedule
    const conflictResult = await detectScheduleConflicts({
      entityType: schedule.entityType,
      entityId: schedule.entityId,
      actionType: schedule.actionType,
      scheduledFor: newScheduledFor,
      revisionVersion: newRevVersion,
      excludeId: schedule._id,
    });

    if (conflictResult.hasConflict && !force) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'SCHEDULE_CONFLICT',
          message: 'Conflict detected during reschedule. Confirm with force: true.',
          warnings: conflictResult.warnings,
        },
      });
    }

    schedule.scheduledFor = newScheduledFor;
    if (timezone) schedule.timezone = targetTz;
    if (notes !== undefined) schedule.notes = notes;
    if (revisionVersion !== undefined) schedule.revisionVersion = newRevVersion;
    if (schedule.status === 'FAILED') schedule.status = 'SCHEDULED';

    await schedule.save();

    await recordSchedulerActivity(
      'SCHEDULE_UPDATED',
      schedule.entityType,
      schedule.entityId,
      { scheduleId: schedule._id, scheduledFor: newScheduledFor },
      req.user
    );

    const enriched = enrichScheduleDoc(schedule, targetTz);
    return sendSuccess(res, { schedule: enriched });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/schedules/:id/cancel
 * Cancel a scheduled action
 */
const cancelSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by administrator' } = req.body;

    const schedule = await dbFindScheduleById(id);
    if (!schedule) {
      return sendError(res, 'Scheduled action not found.', 404);
    }

    if (schedule.status === 'COMPLETED') {
      return sendError(res, 'Cannot cancel an action that has already completed.', 400);
    }

    schedule.status = 'CANCELLED';
    schedule.cancelledAt = new Date();
    schedule.notes = schedule.notes ? `${schedule.notes} | Cancellation: ${reason}` : `Cancelled: ${reason}`;
    await schedule.save();

    await recordSchedulerActivity(
      'SCHEDULE_CANCELLED',
      schedule.entityType,
      schedule.entityId,
      { scheduleId: schedule._id, reason },
      req.user
    );

    await sendSchedulerNotification(
      'SCHEDULE',
      `Schedule Cancelled: ${schedule.entityType}`,
      `Scheduled "${schedule.actionType}" for ${schedule.entityTitle || schedule.entityType} was cancelled.`,
      { resourceType: schedule.entityType, resourceId: schedule.entityId }
    );

    const enriched = enrichScheduleDoc(schedule);
    return sendSuccess(res, { message: 'Schedule cancelled successfully.', schedule: enriched });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/schedules/:id/retry
 * Retry a failed or cancelled action immediately or re-queue
 */
const retrySchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { runImmediately = false } = req.body;

    const schedule = await dbFindScheduleById(id);
    if (!schedule) {
      return sendError(res, 'Scheduled action not found.', 404);
    }

    schedule.status = 'SCHEDULED';
    schedule.processingStartedAt = null;
    schedule.failureReason = '';
    if (runImmediately) {
      schedule.scheduledFor = new Date();
    }
    await schedule.save();

    await recordSchedulerActivity(
      'SCHEDULE_RETRIED',
      schedule.entityType,
      schedule.entityId,
      { scheduleId: schedule._id, runImmediately },
      req.user
    );

    let executionResult = null;
    if (runImmediately) {
      executionResult = await runDueScheduledActions();
    }

    const updated = await dbFindScheduleById(id);
    const enriched = enrichScheduleDoc(updated || schedule);

    return sendSuccess(res, {
      message: runImmediately ? 'Schedule retried and executed.' : 'Schedule re-queued for execution.',
      schedule: enriched,
      executionResult,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/schedules/:id
 * Delete a cancelled or completed schedule record
 */
const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;
    const schedule = await dbFindScheduleById(id);
    if (!schedule) {
      return sendError(res, 'Scheduled action not found.', 404);
    }

    if (schedule.status === 'SCHEDULED' || schedule.status === 'PROCESSING') {
      return sendError(res, 'Cannot delete an active or processing schedule. Cancel it first.', 400);
    }

    await dbDeleteScheduleById(id);

    await recordSchedulerActivity(
      'SCHEDULE_DELETED',
      schedule.entityType,
      schedule.entityId,
      { scheduleId: id },
      req.user
    );

    return sendSuccess(res, { message: 'Schedule record deleted.' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/schedules/calendar
 * Calendar view aggregated by year, month, or range
 */
const getCalendarEvents = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear(), month, timezone = DEFAULT_TIMEZONE } = req.query;

    let startDate, endDate;
    if (month) {
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      startDate = new Date(Date.UTC(y, m - 1, 1));
      endDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
    } else {
      const y = parseInt(year, 10);
      startDate = new Date(Date.UTC(y, 0, 1));
      endDate = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
    }

    let items = [];
    if (ScheduledAction.db && ScheduledAction.db.readyState === 1) {
      try {
        items = await ScheduledAction.find({
          scheduledFor: { $gte: startDate, $lte: endDate },
        }).sort({ scheduledFor: 1 });
      } catch (e) {}
    }
    if (items.length === 0 && IN_MEMORY_SCHEDULES.length > 0) {
      items = IN_MEMORY_SCHEDULES.filter((s) => {
        const t = new Date(s.scheduledFor);
        return t >= startDate && t <= endDate;
      }).sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));
    }

    const events = items.map((item) => {
      const enriched = enrichScheduleDoc(item, timezone);
      const isoDate = new Date(item.scheduledFor).toISOString().split('T')[0];
      return {
        id: item._id,
        title: `${item.actionType}: ${item.entityTitle || item.entityType}`,
        entityType: item.entityType,
        actionType: item.actionType,
        status: item.status,
        date: isoDate,
        scheduledFor: item.scheduledFor,
        timeDetails: enriched.timeDetails,
      };
    });

    return sendSuccess(res, {
      year: parseInt(year, 10),
      month: month ? parseInt(month, 10) : null,
      count: events.length,
      events,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/schedules/health
 * Automation & Scheduler Health Indicator
 */
const getSchedulerHealth = async (req, res, next) => {
  try {
    const health = await getSchedulerHealthStats();
    return sendSuccess(res, health);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/internal/scheduler/run & POST /api/admin/scheduler/run
 * Protected worker execution trigger
 */
const runSchedulerNow = async (req, res, next) => {
  try {
    // Check auth: Admin Bearer token OR CRON_SECRET header
    const cronSecret = process.env.CRON_SECRET || 'anuragsahu-scheduler-cron-secret-2026';
    const authHeader = req.headers['authorization'] || '';
    const cronHeader = req.headers['x-cron-secret'] || '';

    const isCronAuthorized = cronHeader === cronSecret || authHeader === `Bearer ${cronSecret}`;
    const isAdminAuthorized = Boolean(req.user && (req.user.role === 'admin' || req.user.email));

    if (!isCronAuthorized && !isAdminAuthorized) {
      return sendError(res, 'Unauthorized scheduler trigger.', 401);
    }

    const outcome = await runDueScheduledActions();
    return sendSuccess(res, {
      message: 'Scheduler execution complete.',
      timestamp: new Date().toISOString(),
      outcome,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/schedules/bulk
 * Bulk schedule actions for multiple items
 */
const bulkSchedule = async (req, res, next) => {
  try {
    const { items, actionType, scheduledDate, scheduledTime, timezone = DEFAULT_TIMEZONE, notes = '' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(res, 'Items array is required for bulk scheduling.', 400);
    }

    const targetUtcDate = localToUTC(scheduledDate, scheduledTime, timezone);
    const createdSchedules = [];
    const skipped = [];

    for (const item of items) {
      if (!item.entityType || !item.entityId) {
        skipped.push({ item, reason: 'Missing entityType or entityId' });
        continue;
      }

      const schedule = await dbCreateSchedule({
        entityType: item.entityType,
        entityId: String(item.entityId),
        entityTitle: item.entityTitle || `${item.entityType} ${item.entityId}`,
        actionType: actionType || item.actionType || 'PUBLISH',
        scheduledFor: targetUtcDate,
        timezone,
        status: 'SCHEDULED',
        notes: notes || 'Created via bulk schedule',
        createdBy: {
          id: req.user?.id || 'admin',
          email: req.user?.email || 'anuragsahu@anuragsahu.dev',
          name: req.user?.name || 'Anurag Sahu',
        },
      });

      createdSchedules.push(schedule);
    }

    await recordSchedulerActivity(
      'SCHEDULE_BULK_CREATED',
      'Multiple',
      `${createdSchedules.length} items`,
      { count: createdSchedules.length, actionType },
      req.user
    );

    return sendSuccess(res, {
      createdCount: createdSchedules.length,
      skippedCount: skipped.length,
      schedules: createdSchedules.map((s) => enrichScheduleDoc(s, timezone)),
    }, 201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  cancelSchedule,
  retrySchedule,
  deleteSchedule,
  getCalendarEvents,
  getSchedulerHealth,
  runSchedulerNow,
  bulkSchedule,
};
