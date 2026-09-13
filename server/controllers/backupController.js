/**
 * ANURAG SAHU CONTROL CENTER — BACKUP & RECOVERY CONTROLLER
 * Candidate: Anurag Sahu
 * Exposes authenticated endpoints for backup management, integrity verification,
 * safety restores, authenticated download, and system maintenance health.
 */
const path = require('path');
const fs = require('fs');
const Backup = require('../models/Backup');
const {
  createBackup: createBackupService,
  verifyBackupIntegrity: verifyIntegrityService,
  restoreFromBackup: restoreService,
  deleteBackup: deleteBackupService,
  getBackupHealthStats: getHealthService,
  BACKUP_DIR,
} = require('../services/backupService');
const { performSystemHealthCheck } = require('../services/systemHealthService');
const { IN_MEMORY_BACKUPS, BACKUP_SETTINGS } = require('../utils/backupStore');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * POST /api/admin/backups
 * Create a new database / CMS backup snapshot
 */
const createBackup = async (req, res, next) => {
  try {
    const { type = 'MANUAL', scope = 'FULL', notes = '' } = req.body || {};
    const createdBy = (req.user && req.user.email) || 'anuragsahu@anuragsahu.dev';

    const backup = await createBackupService({
      type,
      scope,
      createdBy,
      notes,
      req,
    });

    return res.status(201).json({
      success: true,
      message: `Backup ${backup.backupId} created successfully.`,
      backup,
    });
  } catch (err) {
    if (err.message.includes('currently running')) {
      return sendError(res, err.message, 409);
    }
    next(err);
  }
};

/**
 * GET /api/admin/backups
 * List backups with optional filtering by status and type
 */
const getBackups = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (type) filter.type = type.toUpperCase();
    if (status) filter.status = status.toUpperCase();

    let backups = [];
    let total = 0;

    try {
      if (Backup.db && Backup.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        [backups, total] = await Promise.all([
          Backup.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
          Backup.countDocuments(filter),
        ]);
      }
    } catch (_) {}

    // Fallback if DB is empty or offline
    if (backups.length === 0) {
      let mem = [...IN_MEMORY_BACKUPS];
      if (type) mem = mem.filter((b) => b.type === type.toUpperCase());
      if (status) mem = mem.filter((b) => b.status === status.toUpperCase());
      total = mem.length;
      const skip = (Number(page) - 1) * Number(limit);
      backups = mem.slice(skip, skip + Number(limit));
    }

    return res.status(200).json({
      success: true,
      count: backups.length,
      total,
      page: Number(page),
      backups,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/backups/:id
 * Retrieve single backup details by backupId or Mongo _id
 */
const getBackupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let backup = null;

    try {
      if (Backup.db && Backup.db.readyState === 1) {
        backup = await Backup.findOne({
          $or: [{ backupId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
        });
      }
    } catch (_) {}

    if (!backup) {
      backup = IN_MEMORY_BACKUPS.find((b) => b.backupId === id || b._id === id);
    }

    if (!backup) {
      return sendError(res, `Backup ${id} not found.`, 404);
    }

    return res.status(200).json({
      success: true,
      backup,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/backups/:id/verify
 * Verify SHA-256 checksum integrity of a backup snapshot
 */
const verifyBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const verification = await verifyIntegrityService(id, req);

    return res.status(200).json({
      success: true,
      backupId: id,
      ...verification,
    });
  } catch (err) {
    if (err.message.includes('not found')) {
      return sendError(res, err.message, 404);
    }
    next(err);
  }
};

/**
 * POST /api/admin/backups/:id/restore
 * High-Risk Disaster Recovery: Restores database from validated snapshot
 * Mandatory PRE_RESTORE safety snapshot generated first.
 */
const restoreBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { confirmationText, scheduleStrategy = 'preserve' } = req.body || {};

    if (confirmationText !== 'RESTORE') {
      return sendError(
        res,
        "Destructive action aborted: confirmationText must be exactly 'RESTORE'.",
        400
      );
    }

    const adminEmail = (req.user && req.user.email) || 'anuragsahu@anuragsahu.dev';
    const result = await restoreService({
      backupId: id,
      adminEmail,
      scheduleStrategy,
      req,
    });

    return res.status(200).json({
      success: true,
      message: `Database successfully restored from backup ${id}.`,
      result,
    });
  } catch (err) {
    if (err.message.includes('not exist') || err.message.includes('not found')) {
      return sendError(res, err.message, 404);
    }
    if (err.message.includes('integrity verification failed') || err.message.includes('corrupted')) {
      return sendError(res, err.message, 422);
    }
    next(err);
  }
};

/**
 * GET /api/admin/backups/:id/download
 * Authenticated streaming download of backup snapshot JSON
 */
const downloadBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const filename = `snapshot_${id}.json`;
    const fullPath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(fullPath)) {
      // Check memory store for in-memory snapshot
      const backup = IN_MEMORY_BACKUPS.find((b) => b.backupId === id);
      if (!backup) {
        return sendError(res, `Backup snapshot file for ${id} not found on disk.`, 404);
      }
      res.setHeader('Content-Disposition', `attachment; filename="backup_${id}.json"`);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(JSON.stringify(backup, null, 2));
    }

    res.setHeader('Content-Disposition', `attachment; filename="backup_${id}.json"`);
    res.setHeader('Content-Type', 'application/json');

    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/backups/:id
 * Delete a backup snapshot safely (protected pre-restore snapshots guarded)
 */
const deleteBackup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const force = req.query.force === 'true';

    await deleteBackupService(id, { force, req });

    return res.status(200).json({
      success: true,
      message: `Backup ${id} deleted successfully.`,
    });
  } catch (err) {
    if (err.message.includes('not found')) {
      return sendError(res, err.message, 404);
    }
    if (err.message.includes('Cannot delete') || err.message.includes('protected')) {
      return sendError(res, err.message, 403);
    }
    next(err);
  }
};

/**
 * GET /api/admin/backups/health
 * Aggregated health status and storage usage metrics
 */
const getBackupHealth = async (req, res, next) => {
  try {
    const health = await getHealthService();
    return res.status(200).json({
      success: true,
      health,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/backups/settings
 * Retrieve retention and auto-backup policy settings
 */
const getBackupSettings = async (req, res) => {
  return res.status(200).json({
    success: true,
    settings: BACKUP_SETTINGS,
  });
};

/**
 * PUT /api/admin/backups/settings
 * Update retention policy and auto-backup frequency
 */
const updateBackupSettings = async (req, res) => {
  const { retentionDays, maxBackups, autoBackupFrequency } = req.body || {};

  if (retentionDays !== undefined) {
    const days = Number(retentionDays);
    if (!isNaN(days) && days > 0) BACKUP_SETTINGS.retentionDays = days;
  }
  if (maxBackups !== undefined) {
    const max = Number(maxBackups);
    if (!isNaN(max) && max > 0) BACKUP_SETTINGS.maxBackups = max;
  }
  if (autoBackupFrequency && ['daily', 'weekly', 'manual'].includes(autoBackupFrequency)) {
    BACKUP_SETTINGS.autoBackupFrequency = autoBackupFrequency;
  }

  return res.status(200).json({
    success: true,
    message: 'Backup retention settings updated.',
    settings: BACKUP_SETTINGS,
  });
};

/**
 * GET /api/admin/system/health
 * System Maintenance Center: Real diagnostic check across 8 services
 */
const getSystemHealth = async (req, res, next) => {
  try {
    const diagnostics = await performSystemHealthCheck();
    return res.status(200).json(diagnostics);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBackup,
  getBackups,
  getBackupById,
  verifyBackup,
  restoreBackup,
  downloadBackup,
  deleteBackup,
  getBackupHealth,
  getBackupSettings,
  updateBackupSettings,
  getSystemHealth,
};
