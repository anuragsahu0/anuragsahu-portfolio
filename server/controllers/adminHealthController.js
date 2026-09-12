const { checkSystemHealth } = require('../services/healthService');

/**
 * GET /api/admin/health
 * Detailed protected system health check (MongoDB, API latency, Auth JWT, Email SMTP, File storage)
 */
const getAdminHealth = async (req, res, next) => {
  try {
    const health = await checkSystemHealth();
    return res.status(200).json({
      success: true,
      ...health,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAdminHealth };
