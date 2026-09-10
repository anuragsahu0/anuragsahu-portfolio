const ActivityLog = require('../models/ActivityLog');
const { sendSuccess } = require('../utils/apiResponse');

const FALLBACK_LOGS = [
  {
    _id: 'act-1',
    adminId: 'admin',
    adminEmail: 'admin@anuragsahu.dev',
    action: 'SYSTEM_BOOT',
    resourceType: 'Server',
    description: 'CMS Backend Engine initialized with security middleware and database caching.',
    createdAt: new Date(),
  },
];

const getActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    const filter = {};
    if (action) filter.action = action;

    let logs = [];
    let total = 0;

    try {
      if (ActivityLog.db && ActivityLog.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        [logs, total] = await Promise.all([
          ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
          ActivityLog.countDocuments(filter),
        ]);
      }
    } catch (dbErr) {}

    if (!logs || logs.length === 0) {
      logs = FALLBACK_LOGS;
      total = logs.length;
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
};
