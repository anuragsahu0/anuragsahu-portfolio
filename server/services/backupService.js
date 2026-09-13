/**
 * ANURAG SAHU CONTROL CENTER — BACKUP & DISASTER RECOVERY SERVICE
 * Candidate: Anurag Sahu
 * Handles sanitized snapshots, SHA-256 integrity verification,
 * pre-restore safety snapshots, revision-safe and schedule-safe restoration.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Models
const Backup = require('../models/Backup');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Hero = require('../models/Hero');
const About = require('../models/About');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Achievement = require('../models/Achievement');
const Roadmap = require('../models/Roadmap');
const SocialLink = require('../models/SocialLink');
const Navigation = require('../models/Navigation');
const Media = require('../models/Media');
const Resume = require('../models/Resume');
const Settings = require('../models/Settings');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const Analytics = require('../models/Analytics');
const Revision = require('../models/Revision');
const ScheduledAction = require('../models/ScheduledAction');
const Draft = require('../models/Draft');
const LoginHistory = require('../models/LoginHistory');
const Role = require('../models/Role');
const Session = require('../models/Session');
const SecurityEvent = require('../models/SecurityEvent');
const Invitation = require('../models/Invitation');

// Stores & Utilities
const { IN_MEMORY_BACKUPS, BACKUP_SETTINGS } = require('../utils/backupStore');
const { IN_MEMORY_SCHEDULES } = require('../utils/scheduleStore');
const { IN_MEMORY_REVISIONS } = require('../utils/revisionHelper');

// Model Map for backup and restore
const ALL_MODELS = {
  profile: Profile,
  hero: Hero,
  about: About,
  projects: Project,
  skills: Skill,
  experience: Experience,
  education: Education,
  certificates: Certificate,
  achievements: Achievement,
  roadmap: Roadmap,
  socialLinks: SocialLink,
  navigation: Navigation,
  media: Media,
  resume: Resume,
  settings: Settings,
  contacts: Contact,
  notifications: Notification,
  activityLogs: ActivityLog,
  analytics: Analytics,
  revisions: Revision,
  schedules: ScheduledAction,
  drafts: Draft,
  loginHistory: LoginHistory,
  users: User,
  roles: Role,
  sessions: Session,
  securityEvents: SecurityEvent,
  invitations: Invitation,
};

// Scope-to-models mapping
const SCOPE_MODELS = {
  CONTENT: [
    'profile',
    'hero',
    'about',
    'projects',
    'skills',
    'experience',
    'education',
    'certificates',
    'achievements',
    'roadmap',
    'socialLinks',
    'navigation',
  ],
  MEDIA: ['media', 'resume'],
  DATABASE: [
    'profile',
    'hero',
    'about',
    'projects',
    'skills',
    'experience',
    'education',
    'certificates',
    'achievements',
    'roadmap',
    'socialLinks',
    'navigation',
    'media',
    'resume',
    'settings',
    'contacts',
    'notifications',
    'activityLogs',
    'revisions',
    'schedules',
    'drafts',
    'users',
  ],
  FULL: Object.keys(ALL_MODELS),
};

const BACKUP_DIR = path.join(__dirname, '../backups');

/**
 * Ensure backup directory exists
 */
const ensureBackupDir = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
};

/**
 * Strip sensitive credentials, passwords, hashes, and secrets
 */
const sanitizeForBackup = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForBackup(item));
  }

  const sanitized = {};
  const blockedKeys = new Set([
    'password',
    'passwordHash',
    'hash',
    'jwtSecret',
    'apiKey',
    'secret',
    'sessionToken',
    'token',
    'emailPassword',
    'smtpPassword',
    'encryptionKey',
    'privateKey',
  ]);

  for (const [k, v] of Object.entries(obj)) {
    const lk = k.toLowerCase();
    if (
      blockedKeys.has(k) ||
      lk.includes('password') ||
      lk.includes('token') ||
      lk.includes('secret') ||
      lk.includes('apikey') ||
      lk.includes('hash') ||
      lk.includes('privatekey')
    ) {
      continue; // Scrub
    }
    sanitized[k] = sanitizeForBackup(v);
  }

  return sanitized;
};

/**
 * Calculate SHA-256 checksum string
 */
const calculateChecksum = (data) => {
  const hash = crypto.createHash('sha256');
  hash.update(typeof data === 'string' ? data : JSON.stringify(data));
  return `sha256:${hash.digest('hex')}`;
};

/**
 * Log an audit activity event safely
 */
const logBackupActivity = async ({ action, backupId, description, metadata = {}, req = null }) => {
  const adminEmail = (req && req.user && req.user.email) || 'admin@anuragsahu.dev';
  const ipAddress = req ? req.ip || req.headers['x-forwarded-for'] || '127.0.0.1' : '127.0.0.1';

  const entry = {
    adminId: 'admin',
    adminEmail,
    action,
    resourceType: 'BACKUP',
    resourceId: backupId,
    description,
    metadata,
    ipAddress,
    createdAt: new Date(),
  };

  try {
    if (ActivityLog.db && ActivityLog.db.readyState === 1) {
      await ActivityLog.create(entry);
    }
  } catch (_) {}
};

/**
 * Create a notification event safely
 */
const emitBackupNotification = async ({ type = 'BACKUP', title, message, meta = {} }) => {
  try {
    if (Notification.db && Notification.db.readyState === 1) {
      await Notification.create({
        type,
        title,
        message,
        meta,
        isRead: false,
      });
    }
  } catch (_) {}
};

/**
 * Create a real database / CMS backup snapshot
 */
const createBackup = async ({
  type = 'MANUAL',
  scope = 'FULL',
  createdBy = 'admin',
  notes = '',
  req = null,
} = {}) => {
  ensureBackupDir();

  // 1. Guard against duplicate running backups
  let running = null;
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      running = await Backup.findOne({ status: { $in: ['RUNNING', 'QUEUED'] } });
    }
  } catch (_) {}
  if (!running) {
    running = IN_MEMORY_BACKUPS.find((b) => b.status === 'RUNNING' || b.status === 'QUEUED');
  }

  if (running) {
    throw new Error('A backup operation is currently running. Please wait for it to complete.');
  }

  const startTime = Date.now();
  const backupId = `bkp_${startTime}_${crypto.randomBytes(3).toString('hex')}`;
  const filename = `snapshot_${backupId}.json`;
  const storageReference = `server/backups/${filename}`;
  const fullPath = path.join(BACKUP_DIR, filename);

  const targetModelKeys = SCOPE_MODELS[scope] || SCOPE_MODELS.FULL;

  // 2. Register initial backup document
  const backupDocData = {
    backupId,
    type,
    status: 'RUNNING',
    scope,
    storageReference,
    size: 0,
    checksum: '',
    integrity: 'NOT_VERIFIED',
    createdBy: createdBy || 'admin',
    notes: notes || '',
    isProtected: type === 'PRE_RESTORE',
    metadata: {
      scope,
      type,
      startedAt: new Date().toISOString(),
    },
    createdAt: new Date(),
  };

  let backupDoc = null;
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      backupDoc = await Backup.create(backupDocData);
    }
  } catch (_) {}
  IN_MEMORY_BACKUPS.unshift(backupDocData);

  await logBackupActivity({
    action: 'BACKUP_CREATED',
    backupId,
    description: `Initiated ${type} backup (${scope})`,
    metadata: { type, scope },
    req,
  });

  try {
    // 3. Collect collections data
    const collections = {};
    const counts = {};
    let totalRecords = 0;

    for (const key of targetModelKeys) {
      const model = ALL_MODELS[key];
      if (!model) continue;

      let records = [];
      try {
        if (model.db && model.db.readyState === 1) {
          let q = model.find().lean();
          if (key === 'users') q = q.select('-password');
          records = await q;
        }
      } catch (_) {}

      // Fallback for in-memory records if DB is cold
      if ((!records || records.length === 0) && key === 'schedules') {
        records = IN_MEMORY_SCHEDULES;
      }
      if ((!records || records.length === 0) && key === 'revisions') {
        records = IN_MEMORY_REVISIONS;
      }

      const sanitizedRecords = sanitizeForBackup(records || []);
      collections[key] = sanitizedRecords;
      counts[key] = sanitizedRecords.length;
      totalRecords += sanitizedRecords.length;
    }

    // 4. Construct JSON payload
    const payload = {
      metadata: {
        system: 'ANURAG SAHU CONTROL CENTER',
        version: '13.0.0',
        candidate: 'Anurag Sahu',
        backupId,
        type,
        scope,
        createdAt: new Date().toISOString(),
        totalRecords,
        counts,
        durationMs: Date.now() - startTime,
      },
      collections,
    };

    const serialized = JSON.stringify(payload, null, 2);
    const size = Buffer.byteLength(serialized, 'utf8');
    const checksum = calculateChecksum(serialized);

    // 5. Write to disk
    fs.writeFileSync(fullPath, serialized, 'utf8');

    // Update snapshot_latest.json if FULL or DATABASE
    if (scope === 'FULL' || scope === 'DATABASE') {
      try {
        fs.writeFileSync(path.join(BACKUP_DIR, 'snapshot_latest.json'), serialized, 'utf8');
      } catch (_) {}
    }

    const retentionDays = BACKUP_SETTINGS.retentionDays || 30;
    const expiresAt = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);
    const completedAt = new Date();

    const updateFields = {
      status: 'COMPLETED',
      size,
      checksum,
      integrity: 'VALID',
      lastVerifiedAt: completedAt,
      completedAt,
      expiresAt,
      metadata: {
        ...backupDocData.metadata,
        totalRecords,
        counts,
        durationMs: Date.now() - startTime,
        completedAt: completedAt.toISOString(),
      },
    };

    // Update in MongoDB
    if (backupDoc && Backup.db && Backup.db.readyState === 1) {
      backupDoc = await Backup.findOneAndUpdate({ backupId }, { $set: updateFields }, { new: true });
    }

    // Update in memory store
    const memIdx = IN_MEMORY_BACKUPS.findIndex((b) => b.backupId === backupId);
    if (memIdx !== -1) {
      Object.assign(IN_MEMORY_BACKUPS[memIdx], updateFields);
      backupDoc = IN_MEMORY_BACKUPS[memIdx];
    }

    // 6. Log completion & notify
    await logBackupActivity({
      action: 'BACKUP_COMPLETED',
      backupId,
      description: `Completed ${type} backup (${scope}) with ${totalRecords} records. Size: ${size} bytes.`,
      metadata: { backupId, type, scope, totalRecords, size, checksum },
      req,
    });

    await emitBackupNotification({
      type: 'BACKUP',
      title: 'Backup Completed',
      message: `Backup ${backupId} completed successfully (${totalRecords} records, ${(size / 1024).toFixed(1)} KB).`,
      meta: { backupId, totalRecords, size },
    });

    // Run automatic retention cleanup non-blockingly
    runRetentionCleanup().catch(() => {});

    return backupDoc;
  } catch (err) {
    const failFields = {
      status: 'FAILED',
      failureReason: err.message,
      completedAt: new Date(),
    };

    if (Backup.db && Backup.db.readyState === 1) {
      await Backup.findOneAndUpdate({ backupId }, { $set: failFields });
    }
    const memIdx = IN_MEMORY_BACKUPS.findIndex((b) => b.backupId === backupId);
    if (memIdx !== -1) {
      Object.assign(IN_MEMORY_BACKUPS[memIdx], failFields);
    }

    await logBackupActivity({
      action: 'BACKUP_FAILED',
      backupId,
      description: `Backup failed: ${err.message}`,
      metadata: { backupId, error: err.message },
      req,
    });

    await emitBackupNotification({
      type: 'ERROR',
      title: 'Backup Failed',
      message: `Backup ${backupId} failed: ${err.message}`,
      meta: { backupId, error: err.message },
    });

    throw err;
  }
};

/**
 * Verify integrity of a backup snapshot using SHA-256
 */
const verifyBackupIntegrity = async (backupId, req = null) => {
  let backup = null;
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      backup = await Backup.findOne({ backupId });
    }
  } catch (_) {}
  if (!backup) {
    backup = IN_MEMORY_BACKUPS.find((b) => b.backupId === backupId);
  }

  if (!backup) {
    throw new Error(`Backup record not found: ${backupId}`);
  }

  const filename = `snapshot_${backupId}.json`;
  const fullPath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(fullPath)) {
    const failUpdate = { integrity: 'INVALID', lastVerifiedAt: new Date() };
    if (Backup.db && Backup.db.readyState === 1) {
      await Backup.findOneAndUpdate({ backupId }, { $set: failUpdate });
    }
    if (backup) Object.assign(backup, failUpdate);
    return {
      isValid: false,
      integrity: 'INVALID',
      error: 'Snapshot file missing from storage',
      lastVerifiedAt: new Date(),
    };
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const calculatedChecksum = calculateChecksum(fileContent);
  const isValid = calculatedChecksum === backup.checksum;
  const integrity = isValid ? 'VALID' : 'INVALID';
  const lastVerifiedAt = new Date();

  const updateFields = { integrity, lastVerifiedAt };
  if (Backup.db && Backup.db.readyState === 1) {
    await Backup.findOneAndUpdate({ backupId }, { $set: updateFields });
  }
  Object.assign(backup, updateFields);

  await logBackupActivity({
    action: 'BACKUP_VERIFIED',
    backupId,
    description: `Integrity verification ${isValid ? 'passed' : 'FAILED'}. Checksum: ${calculatedChecksum}`,
    metadata: { backupId, isValid, calculatedChecksum, storedChecksum: backup.checksum },
    req,
  });

  if (!isValid) {
    await emitBackupNotification({
      type: 'ERROR',
      title: 'Integrity Check Failed',
      message: `Integrity verification failed for backup ${backupId}. Checksum mismatch.`,
      meta: { backupId },
    });
  }

  return {
    isValid,
    integrity,
    checksum: backup.checksum,
    calculatedChecksum,
    lastVerifiedAt,
  };
};

/**
 * Restore database collections from a validated backup snapshot
 */
const restoreFromBackup = async ({
  backupId,
  adminEmail = 'admin@anuragsahu.dev',
  scheduleStrategy = 'preserve', // 'preserve', 'restore', 'cancel'
  targetCollections = null,
  req = null,
} = {}) => {
  let backup = null;
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      backup = await Backup.findOne({ backupId });
    }
  } catch (_) {}
  if (!backup) {
    backup = IN_MEMORY_BACKUPS.find((b) => b.backupId === backupId);
  }

  if (!backup) {
    throw new Error(`Backup ${backupId} does not exist.`);
  }

  if (backup.status !== 'COMPLETED') {
    throw new Error(`Cannot restore backup with status '${backup.status}'. Must be COMPLETED.`);
  }

  // 1. Verify integrity before restoring
  const verification = await verifyBackupIntegrity(backupId, req);
  if (!verification.isValid) {
    throw new Error('Restore aborted: Backup integrity verification failed. Checksum mismatch.');
  }

  const filename = `snapshot_${backupId}.json`;
  const fullPath = path.join(BACKUP_DIR, filename);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Backup snapshot file not found on disk: ${filename}`);
  }

  const snapshot = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  if (!snapshot.collections) {
    throw new Error('Invalid snapshot structure: missing collections object.');
  }

  // 2. Mandatory PRE_RESTORE safety backup
  const preRestoreBackup = await createBackup({
    type: 'PRE_RESTORE',
    scope: 'FULL',
    createdBy: adminEmail,
    notes: `Pre-restore safety snapshot prior to restoring ${backupId}`,
    req,
  });

  await logBackupActivity({
    action: 'RESTORE_STARTED',
    backupId,
    description: `Initiated restore from backup ${backupId}. Pre-restore backup created: ${preRestoreBackup.backupId}`,
    metadata: { backupId, preRestoreBackupId: preRestoreBackup.backupId, scheduleStrategy },
    req,
  });

  try {
    let restoredRecords = 0;
    const restoredCollections = [];

    // 3. Handle Scheduled Actions Strategy
    if (scheduleStrategy === 'cancel') {
      try {
        if (ScheduledAction.db && ScheduledAction.db.readyState === 1) {
          await ScheduledAction.updateMany(
            { status: 'SCHEDULED' },
            { $set: { status: 'CANCELLED', notes: `Cancelled prior to restoring ${backupId}` } }
          );
        }
      } catch (_) {}
      IN_MEMORY_SCHEDULES.forEach((s) => {
        if (s.status === 'SCHEDULED') {
          s.status = 'CANCELLED';
          s.notes = `Cancelled prior to restoring ${backupId}`;
        }
      });
    }

    // 4. Restore each collection
    for (const [colKey, model] of Object.entries(ALL_MODELS)) {
      if (targetCollections && !targetCollections.includes(colKey)) continue;

      const records = snapshot.collections[colKey];
      if (!records || !Array.isArray(records) || records.length === 0) continue;

      // Singletons: update single document
      if (['profile', 'hero', 'about', 'settings', 'navigation'].includes(colKey)) {
        const singleDoc = records[0];
        if (singleDoc) {
          try {
            if (model.db && model.db.readyState === 1) {
              const filter = singleDoc.singletonId ? { singletonId: singleDoc.singletonId } : {};
              await model.findOneAndUpdate(filter, singleDoc, { upsert: true, new: true, runValidators: false });
            }
          } catch (_) {}
          restoredRecords++;
          restoredCollections.push(colKey);
        }
        continue;
      }

      // Revisions: Preserve revision history! Never delete historical versions.
      if (colKey === 'revisions') {
        for (const rev of records) {
          try {
            if (model.db && model.db.readyState === 1) {
              const existing = await model.findOne({ entityType: rev.entityType, entityId: rev.entityId, version: rev.version });
              if (!existing) {
                await model.create(rev);
                restoredRecords++;
              }
            }
          } catch (_) {}
        }
        restoredCollections.push(colKey);
        continue;
      }

      // Schedules: If scheduleStrategy is 'preserve', skip restoring schedules
      if (colKey === 'schedules' && scheduleStrategy === 'preserve') {
        continue;
      }

      // General multi-document collections
      try {
        if (model.db && model.db.readyState === 1) {
          for (const doc of records) {
            const filter = doc.id ? { id: doc.id } : (doc._id ? { _id: doc._id } : null);
            if (filter) {
              await model.findOneAndUpdate(filter, doc, { upsert: true, new: true, runValidators: false });
            } else {
              await model.create(doc);
            }
            restoredRecords++;
          }
        }
      } catch (_) {}

      // In-memory update if schedules
      if (colKey === 'schedules' && scheduleStrategy === 'restore') {
        IN_MEMORY_SCHEDULES.length = 0;
        records.forEach((r) => IN_MEMORY_SCHEDULES.push(r));
      }

      restoredCollections.push(colKey);
    }

    // 5. Create restore record in Revisions for traceability
    try {
      if (Revision.db && Revision.db.readyState === 1) {
        await Revision.create({
          entityType: 'system',
          entityId: 'backup_restore',
          version: Date.now(),
          status: 'RESTORED',
          author: adminEmail,
          changeSummary: `Restored database from backup ${backupId} (${restoredRecords} records across ${restoredCollections.length} collections)`,
          data: { backupId, restoredCollections, restoredRecords, restoredAt: new Date().toISOString() },
        });
      }
    } catch (_) {}

    await logBackupActivity({
      action: 'RESTORE_COMPLETED',
      backupId,
      description: `Successfully restored from backup ${backupId}. Restored ${restoredRecords} records across ${restoredCollections.length} collections.`,
      metadata: { backupId, restoredRecords, restoredCollections, preRestoreBackupId: preRestoreBackup.backupId },
      req,
    });

    await emitBackupNotification({
      type: 'RESTORE',
      title: 'Disaster Recovery Completed',
      message: `System successfully restored from backup ${backupId} (${restoredRecords} records). Safety snapshot: ${preRestoreBackup.backupId}.`,
      meta: { backupId, preRestoreBackupId: preRestoreBackup.backupId, restoredRecords },
    });

    return {
      success: true,
      backupId,
      preRestoreBackupId: preRestoreBackup.backupId,
      restoredRecords,
      restoredCollections,
      scheduleStrategy,
    };
  } catch (err) {
    await logBackupActivity({
      action: 'RESTORE_FAILED',
      backupId,
      description: `Restore failed: ${err.message}. Safety snapshot preserved: ${preRestoreBackup.backupId}`,
      metadata: { backupId, error: err.message, preRestoreBackupId: preRestoreBackup.backupId },
      req,
    });

    await emitBackupNotification({
      type: 'ERROR',
      title: 'Restore Failed',
      message: `Restore from backup ${backupId} failed: ${err.message}. Pre-restore safety snapshot ${preRestoreBackup.backupId} remains safe.`,
      meta: { backupId, preRestoreBackupId: preRestoreBackup.backupId, error: err.message },
    });

    throw err;
  }
};

/**
 * Delete a backup snapshot safely
 */
const deleteBackup = async (backupId, { force = false, req = null } = {}) => {
  let backup = null;
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      backup = await Backup.findOne({ backupId });
    }
  } catch (_) {}
  if (!backup) {
    backup = IN_MEMORY_BACKUPS.find((b) => b.backupId === backupId);
  }

  if (!backup) {
    throw new Error(`Backup not found: ${backupId}`);
  }

  // Safety check: protect recent pre-restore backup recovery points
  if (backup.type === 'PRE_RESTORE' && backup.isProtected && !force) {
    const ageHours = (Date.now() - new Date(backup.createdAt).getTime()) / (1000 * 60 * 60);
    if (ageHours < 24) {
      throw new Error('Cannot delete this safety recovery point. Pre-restore backups are protected for 24 hours.');
    }
  }

  // Delete disk file
  const filename = `snapshot_${backupId}.json`;
  const fullPath = path.join(BACKUP_DIR, filename);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (_) {}
  }

  // Delete in MongoDB
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      await Backup.findOneAndDelete({ backupId });
    }
  } catch (_) {}

  // Delete in memory
  const memIdx = IN_MEMORY_BACKUPS.findIndex((b) => b.backupId === backupId);
  if (memIdx !== -1) {
    IN_MEMORY_BACKUPS.splice(memIdx, 1);
  }

  await logBackupActivity({
    action: 'BACKUP_DELETED',
    backupId,
    description: `Deleted backup ${backupId}`,
    metadata: { backupId, type: backup.type },
    req,
  });

  return { success: true, backupId };
};

/**
 * Retention cleanup: prune expired backups and enforce maxBackups
 */
const runRetentionCleanup = async () => {
  const now = new Date();
  let backups = [];
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      backups = await Backup.find().sort({ createdAt: 1 });
    }
  } catch (_) {}
  if (!backups || backups.length === 0) {
    backups = IN_MEMORY_BACKUPS;
  }

  let deletedCount = 0;
  const maxBackups = BACKUP_SETTINGS.maxBackups || 15;

  // 1. Delete expired unprotected backups
  for (const b of backups) {
    if (b.status === 'RUNNING' || b.status === 'QUEUED') continue;
    if (b.isProtected) continue;

    if (b.expiresAt && new Date(b.expiresAt) < now) {
      try {
        await deleteBackup(b.backupId, { force: false });
        deletedCount++;
      } catch (_) {}
    }
  }

  // 2. Enforce max backups limit (oldest first, skip protected)
  const remaining = backups.filter((b) => b.status === 'COMPLETED' && !b.isProtected);
  if (remaining.length > maxBackups) {
    const excess = remaining.slice(0, remaining.length - maxBackups);
    for (const b of excess) {
      try {
        await deleteBackup(b.backupId, { force: false });
        deletedCount++;
      } catch (_) {}
    }
  }

  BACKUP_SETTINGS.lastRetentionRun = new Date().toISOString();

  if (deletedCount > 0) {
    await logBackupActivity({
      action: 'RETENTION_CLEANUP',
      backupId: 'system',
      description: `Pruned ${deletedCount} expired/excess backups under retention policy.`,
      metadata: { deletedCount, maxBackups },
    });
  }

  return { deletedCount };
};

/**
 * Get aggregated backup health and storage metrics
 */
const getBackupHealthStats = async () => {
  let backups = [];
  try {
    if (Backup.db && Backup.db.readyState === 1) {
      backups = await Backup.find().sort({ createdAt: -1 });
    }
  } catch (_) {}
  if (!backups || backups.length === 0) {
    backups = IN_MEMORY_BACKUPS;
  }

  const completed = backups.filter((b) => b.status === 'COMPLETED');
  const failed = backups.filter((b) => b.status === 'FAILED');
  const running = backups.find((b) => b.status === 'RUNNING');

  const totalBytes = completed.reduce((acc, b) => acc + (b.size || 0), 0);
  const formattedStorage =
    totalBytes > 1024 * 1024
      ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
      : `${(totalBytes / 1024).toFixed(1)} KB`;

  const lastSuccessful = completed[0] || null;
  const lastFailed = failed[0] || null;

  // Next scheduled backup estimation
  let nextScheduledBackup = null;
  if (BACKUP_SETTINGS.autoBackupFrequency === 'daily') {
    const next = new Date();
    next.setHours(2, 0, 0, 0);
    if (next < new Date()) next.setDate(next.getDate() + 1);
    nextScheduledBackup = next.toISOString();
  }

  // Health status determination
  let healthStatus = 'OPERATIONAL';
  let attentionReason = '';

  if (lastFailed && (!lastSuccessful || new Date(lastFailed.createdAt) > new Date(lastSuccessful.createdAt))) {
    healthStatus = 'ATTENTION_REQUIRED';
    attentionReason = `Latest backup failed: ${lastFailed.failureReason || 'Execution error'}`;
  } else if (completed.length === 0) {
    healthStatus = 'ATTENTION_REQUIRED';
    attentionReason = 'No completed backup available. Please create a recovery snapshot.';
  } else if (lastSuccessful) {
    const daysSince = (Date.now() - new Date(lastSuccessful.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 7) {
      healthStatus = 'ATTENTION_REQUIRED';
      attentionReason = `Last successful backup was ${Math.round(daysSince)} days ago. Automated backups recommended.`;
    }
  }

  return {
    healthStatus,
    attentionReason,
    totalBackups: backups.length,
    completedCount: completed.length,
    failedCount: failed.length,
    runningBackupId: running ? running.backupId : null,
    storageUsedBytes: totalBytes,
    storageUsedFormatted: formattedStorage,
    lastSuccessfulBackup: lastSuccessful
      ? {
          backupId: lastSuccessful.backupId,
          createdAt: lastSuccessful.createdAt,
          size: lastSuccessful.size,
          integrity: lastSuccessful.integrity,
        }
      : null,
    lastFailedBackup: lastFailed
      ? {
          backupId: lastFailed.backupId,
          createdAt: lastFailed.createdAt,
          reason: lastFailed.failureReason,
        }
      : null,
    nextScheduledBackup,
    retentionSettings: BACKUP_SETTINGS,
  };
};

module.exports = {
  createBackup,
  verifyBackupIntegrity,
  restoreFromBackup,
  deleteBackup,
  runRetentionCleanup,
  getBackupHealthStats,
  sanitizeForBackup,
  calculateChecksum,
  BACKUP_DIR,
};
