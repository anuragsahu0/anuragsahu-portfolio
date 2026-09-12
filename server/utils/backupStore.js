/**
 * BACKUP STORE
 * In-memory storage for backup records and retention settings when MongoDB is offline or in test environments.
 */
const IN_MEMORY_BACKUPS = [];

const BACKUP_SETTINGS = {
  retentionDays: 30,
  maxBackups: 15,
  autoBackupFrequency: 'daily', // 'daily', 'weekly', 'manual'
  lastRetentionRun: null,
};

module.exports = {
  IN_MEMORY_BACKUPS,
  BACKUP_SETTINGS,
};
