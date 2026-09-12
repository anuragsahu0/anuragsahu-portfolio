/**
 * REVISION & AUDIT HELPER UTILITY
 * Handles immutable snapshots, deep diff calculation, sequential versioning,
 * secret scrubbing, and media reference audits for Anurag Sahu Control Center.
 */
const Revision = require('../models/Revision');

// In-memory fallback revisions storage if MongoDB is offline
const IN_MEMORY_REVISIONS = [];

// Sensitive keys that must NEVER be retained in snapshots or revision history
const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'secret',
  'jwt_secret',
  'jwtsecret',
  'hash',
  'salt',
  'apikey',
  'api_key',
  'refreshtoken',
  'refresh_token',
  'auth',
  '__v',
]);

/**
 * Deep-clones an object while scrubbing all sensitive credentials and internal keys
 */
function sanitizeSnapshot(data) {
  if (!data || typeof data !== 'object') return data;
  if (data instanceof Date) return data.toISOString();
  if (Array.isArray(data)) return data.map(sanitizeSnapshot);

  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('password') || lowerKey.includes('secret')) {
      continue;
    }
    if (value && typeof value === 'object') {
      clean[key] = sanitizeSnapshot(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Calculates a structured, human-readable diff between an old snapshot and new snapshot.
 * Returns { changes: Array<{ field, changeType, oldValue, newValue }>, changedFields: String[], summary: String }
 */
function calculateDiff(oldData = {}, newData = {}) {
  const oldClean = sanitizeSnapshot(oldData) || {};
  const newClean = sanitizeSnapshot(newData) || {};

  const allKeys = new Set([...Object.keys(oldClean), ...Object.keys(newClean)]);
  const changes = [];
  const changedFields = [];

  // Ignore internal/volatile keys in diff calculations
  const IGNORE_DIFF_KEYS = new Set(['_id', 'createdAt', 'updatedAt', '__v', 'id']);

  for (const key of allKeys) {
    if (IGNORE_DIFF_KEYS.has(key)) continue;

    const hasOld = key in oldClean;
    const hasNew = key in newClean;
    const oldVal = oldClean[key];
    const newVal = newClean[key];

    if (!hasOld && hasNew) {
      changes.push({ field: key, changeType: 'ADDED', oldValue: null, newValue: newVal });
      changedFields.push(key);
    } else if (hasOld && !hasNew) {
      changes.push({ field: key, changeType: 'REMOVED', oldValue: oldVal, newValue: null });
      changedFields.push(key);
    } else {
      const oldStr = JSON.stringify(oldVal);
      const newStr = JSON.stringify(newVal);
      if (oldStr !== newStr) {
        changes.push({ field: key, changeType: 'MODIFIED', oldValue: oldVal, newValue: newVal });
        changedFields.push(key);
      }
    }
  }

  let summary = '';
  if (changedFields.length === 0) {
    summary = 'No field alterations detected';
  } else if (changedFields.length <= 3) {
    summary = 'Updated ' + changedFields.join(', ');
  } else {
    summary = 'Updated ' + changedFields.slice(0, 3).join(', ') + ' and ' + (changedFields.length - 3) + ' more fields';
  }

  return { changes, changedFields, summary };
}

/**
 * Records a new immutable revision in MongoDB (or in-memory store)
 */
async function recordRevision({
  entityType,
  entityId,
  title = '',
  snapshot,
  state = 'PUBLISHED',
  createdBy = 'admin',
  changeSummary = '',
  restoredFromVersion = null,
}) {
  const cleanSnapshot = sanitizeSnapshot(snapshot);
  const strEntityId = String(entityId);

  let nextVersion = 1;
  let previousSnapshot = null;

  try {
    if (Revision.db && Revision.db.readyState === 1) {
      const latest = await Revision.findOne({ entityType, entityId: strEntityId }).sort({ version: -1 });
      if (latest) {
        nextVersion = (latest.version || 0) + 1;
        previousSnapshot = latest.snapshot;
      }
    }
  } catch (err) {
    // Fallback to memory
  }

  if (nextVersion === 1) {
    const memoryRevisions = IN_MEMORY_REVISIONS.filter(
      (r) => r.entityType === entityType && r.entityId === strEntityId
    ).sort((a, b) => b.version - a.version);
    if (memoryRevisions.length > 0) {
      nextVersion = memoryRevisions[0].version + 1;
      previousSnapshot = memoryRevisions[0].snapshot;
    }
  }

  // Calculate diff if not explicitly provided
  const diffResult = calculateDiff(previousSnapshot, cleanSnapshot);
  const finalSummary =
    changeSummary ||
    (restoredFromVersion
      ? 'Restored from Version ' + restoredFromVersion
      : nextVersion === 1
      ? 'Initial publication (Version 1)'
      : diffResult.summary);

  const revPayload = {
    entityType,
    entityId: strEntityId,
    version: nextVersion,
    title: title || (cleanSnapshot && cleanSnapshot.title) || (cleanSnapshot && cleanSnapshot.name) || entityType,
    snapshot: cleanSnapshot,
    state,
    changeSummary: finalSummary,
    changedFields: diffResult.changedFields,
    restoredFromVersion: restoredFromVersion || null,
    createdBy,
    createdAt: new Date(),
  };

  try {
    if (Revision.db && Revision.db.readyState === 1) {
      const created = await Revision.create(revPayload);
      return created;
    }
  } catch (err) {
    console.warn('[RevisionHelper] DB write failed, storing in memory:', err.message);
  }

  const memoryRecord = {
    _id: 'rev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    ...revPayload,
  };
  IN_MEMORY_REVISIONS.push(memoryRecord);
  return memoryRecord;
}

/**
 * Checks if a given media URL or ID is referenced inside revision snapshots
 */
async function isMediaReferencedInRevisions(mediaUrlOrPath) {
  if (!mediaUrlOrPath) return false;
  const searchPattern = String(mediaUrlOrPath);

  try {
    if (Revision.db && Revision.db.readyState === 1) {
      // Find within the last 50 revisions if the media path appears in snapshots
      const recent = await Revision.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .select('snapshot entityType title version')
        .lean();

      for (const rev of recent) {
        const snapStr = JSON.stringify(rev.snapshot || {});
        if (snapStr.includes(searchPattern)) {
          return {
            referenced: true,
            revisionInfo: {
              entityType: rev.entityType,
              title: rev.title,
              version: rev.version,
            },
          };
        }
      }
    }
  } catch (e) {}

  // Check in-memory revisions
  for (const rev of IN_MEMORY_REVISIONS) {
    const snapStr = JSON.stringify(rev.snapshot || {});
    if (snapStr.includes(searchPattern)) {
      return {
        referenced: true,
        revisionInfo: {
          entityType: rev.entityType,
          title: rev.title,
          version: rev.version,
        },
      };
    }
  }

  return { referenced: false };
}

module.exports = {
  sanitizeSnapshot,
  calculateDiff,
  recordRevision,
  isMediaReferencedInRevisions,
  IN_MEMORY_REVISIONS,
};
