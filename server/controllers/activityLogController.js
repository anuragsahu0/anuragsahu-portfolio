const ActivityLog = require('../models/ActivityLog');
const { sendSuccess } = require('../utils/apiResponse');

const FALLBACK_LOGS = [
  {
    _id: 'act-seed-1',
    adminId: 'admin',
    adminEmail: 'admin@anuragsahu.dev',
    action: 'SYSTEM_BOOT',
    resourceType: 'Server',
    description: 'CMS Backend Engine initialized with security middleware and database caching.',
    createdAt: new Date(Date.now() - 7200000),
  },
];

/**
 * Remove any sensitive keys from log metadata before returning
 */
function sanitizeMetadata(meta) {
  if (!meta || typeof meta !== 'object') return {};
  const safe = { ...meta };
  const sensitiveKeys = ['password', 'token', 'jwt', 'secret', 'key', 'apiKey', 'authorization'];
  for (const k of Object.keys(safe)) {
    if (sensitiveKeys.some((s) => k.toLowerCase().includes(s))) {
      delete safe[k];
    }
  }
  return safe;
}

/**
 * GET /api/admin/activity
 * List audit activity logs with filtering by action, resourceType, search, and pagination
 */
const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action, resourceType, search } = req.query;
    const filter = {};

    if (action && action !== 'ALL') {
      filter.action = action;
    }

    if (resourceType && resourceType !== 'ALL') {
      filter.resourceType = resourceType;
    }

    if (search && String(search).trim()) {
      const regex = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ action: regex }, { resourceType: regex }, { description: regex }];
    }

    let logs = [];
    let total = 0;

    try {
      if (ActivityLog.db && ActivityLog.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        const [docs, count] = await Promise.all([
          ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
          ActivityLog.countDocuments(filter),
        ]);
        logs = docs.map((l) => ({
          ...l,
          metadata: sanitizeMetadata(l.metadata || l.details),
        }));
        total = count;
      }
    } catch (dbErr) {
      console.warn('[getActivityLogs] DB warning:', dbErr.message);
    }

    if (!logs || logs.length === 0) {
      let filtered = [...FALLBACK_LOGS];

      if (action && action !== 'ALL') {
        filtered = filtered.filter((l) => l.action === action);
      }
      if (resourceType && resourceType !== 'ALL') {
        filtered = filtered.filter((l) => l.resourceType === resourceType);
      }
      if (search && String(search).trim()) {
        const s = String(search).trim().toLowerCase();
        filtered = filtered.filter(
          (l) =>
            (l.action && l.action.toLowerCase().includes(s)) ||
            (l.resourceType && l.resourceType.toLowerCase().includes(s)) ||
            (l.description && l.description.toLowerCase().includes(s))
        );
      }

      total = filtered.length;
      const skip = (Number(page) - 1) * Number(limit);
      logs = filtered.slice(skip, skip + Number(limit));
    }

    return sendSuccess(res, {
      total,
      page: Number(page),
      limit: Number(limit),
      logs,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActivityLogs,
  FALLBACK_LOGS,
};
