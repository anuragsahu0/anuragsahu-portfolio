/**
 * SCHEDULE CONFLICT DETECTION ENGINE
 * Detects dangerous or contradictory scheduling states before committing to DB.
 */
const ScheduledAction = require('../models/ScheduledAction');
const Revision = require('../models/Revision');

/**
 * Check for scheduling conflicts for an entity action
 * @param {Object} params
 * @param {string} params.entityType
 * @param {string} params.entityId
 * @param {string} params.actionType
 * @param {Date} params.scheduledFor
 * @param {number} [params.revisionVersion]
 * @param {string} [params.excludeId] - ID of schedule being updated
 * @returns {Promise<{ hasConflict: boolean, warnings: Array<{ code: string, message: string, severity: 'warning'|'caution'|'info', conflictingScheduleId?: string }> }>}
 */
async function detectScheduleConflicts({
  entityType,
  entityId,
  actionType,
  scheduledFor,
  revisionVersion = null,
  excludeId = null,
}) {
  const warnings = [];
  const targetTime = scheduledFor instanceof Date ? scheduledFor.getTime() : new Date(scheduledFor).getTime();

  // 1. Check if newer revision exists in database or memory
  if (revisionVersion) {
    try {
      if (Revision.db && Revision.db.readyState === 1) {
        const latestRev = await Revision.findOne({ entityType, entityId })
          .sort({ version: -1 })
          .select('version')
          .lean();

        if (latestRev && latestRev.version > revisionVersion) {
          warnings.push({
            code: 'NEWER_REVISION_EXISTS',
            severity: 'caution',
            message: `A newer revision (v${latestRev.version}) exists for this content. You are scheduling older revision v${revisionVersion}.`,
          });
        }
      } else {
        const { IN_MEMORY_REVISIONS } = require('./revisionHelper');
        const entityRevs = IN_MEMORY_REVISIONS.filter(
          r => r.entityType === entityType && String(r.entityId) === String(entityId)
        ).sort((a, b) => b.version - a.version);
        if (entityRevs.length > 0 && entityRevs[0].version > revisionVersion) {
          warnings.push({
            code: 'NEWER_REVISION_EXISTS',
            severity: 'caution',
            message: `A newer revision (v${entityRevs[0].version}) exists for this content. You are scheduling older revision v${revisionVersion}.`,
          });
        }
      }
    } catch (e) {}
  }

  // 2. Query other currently scheduled actions for this entity
  let existingSchedules = [];
  if (ScheduledAction.db && ScheduledAction.db.readyState === 1) {
    try {
      const filter = {
        entityType,
        entityId,
        status: 'SCHEDULED',
      };
      if (excludeId) {
        filter._id = { $ne: excludeId };
      }
      existingSchedules = await ScheduledAction.find(filter).lean();
    } catch (e) {}
  } else {
    try {
      const { IN_MEMORY_SCHEDULES } = require('./scheduleStore');
      existingSchedules = IN_MEMORY_SCHEDULES.filter(
        item => item.entityType === entityType &&
                String(item.entityId) === String(entityId) &&
                item.status === 'SCHEDULED' &&
                (!excludeId || String(item._id) !== String(excludeId))
      );
    } catch (e) {}
  }

      for (const item of existingSchedules) {
        const itemTime = new Date(item.scheduledFor).getTime();
        const diffMinutes = Math.abs(targetTime - itemTime) / (60 * 1000);

        // Conflict A: Duplicate action within 5 minutes
        if (item.actionType === actionType && diffMinutes < 5) {
          warnings.push({
            code: 'DUPLICATE_SCHEDULE_TIME',
            severity: 'caution',
            message: `An identical action (${actionType}) is already scheduled within 5 minutes on this item.`,
            conflictingScheduleId: String(item._id),
          });
        }

        // Conflict B: Time Inversion between PUBLISH and UNPUBLISH
        if (actionType === 'PUBLISH' && (item.actionType === 'UNPUBLISH' || item.actionType === 'DEACTIVATE')) {
          if (targetTime > itemTime) {
            warnings.push({
              code: 'PUBLISH_AFTER_UNPUBLISH',
              severity: 'warning',
              message: `This item is scheduled to be unpublished earlier at ${new Date(itemTime).toISOString()}. This will publish it again afterwards.`,
              conflictingScheduleId: String(item._id),
            });
          } else {
            warnings.push({
              code: 'UNPUBLISH_PENDING_AFTER_PUBLISH',
              severity: 'info',
              message: `This item will be published at ${new Date(targetTime).toISOString()}, and is already scheduled to be unpublished later at ${new Date(itemTime).toISOString()}.`,
              conflictingScheduleId: String(item._id),
            });
          }
        }

        if ((actionType === 'UNPUBLISH' || actionType === 'DEACTIVATE') && item.actionType === 'PUBLISH') {
          if (targetTime < itemTime) {
            warnings.push({
              code: 'UNPUBLISH_BEFORE_PUBLISH',
              severity: 'warning',
              message: `You are scheduling an unpublish at ${new Date(targetTime).toISOString()}, but a publish is already scheduled later at ${new Date(itemTime).toISOString()}.`,
              conflictingScheduleId: String(item._id),
            });
          }
        }

        // Conflict C: Revision Chronological Inversion
        if (
          revisionVersion &&
          item.revisionVersion &&
          (actionType === 'PUBLISH' || actionType === 'ACTIVATE_REVISION') &&
          (item.actionType === 'PUBLISH' || item.actionType === 'ACTIVATE_REVISION')
        ) {
          if (revisionVersion > item.revisionVersion && targetTime < itemTime) {
            warnings.push({
              code: 'NEWER_REVISION_SCHEDULED_EARLIER',
              severity: 'caution',
              message: `Newer revision v${revisionVersion} is scheduled to publish BEFORE older revision v${item.revisionVersion}. The older revision will overwrite it later.`,
              conflictingScheduleId: String(item._id),
            });
          } else if (revisionVersion < item.revisionVersion && targetTime > itemTime) {
            warnings.push({
              code: 'OLDER_REVISION_SCHEDULED_LATER',
              severity: 'caution',
              message: `Older revision v${revisionVersion} is scheduled to publish AFTER newer revision v${item.revisionVersion}. This will downgrade the live content.`,
              conflictingScheduleId: String(item._id),
            });
          }
        }
      }

  return {
    hasConflict: warnings.length > 0,
    warnings,
  };
}

module.exports = {
  detectScheduleConflicts,
};
