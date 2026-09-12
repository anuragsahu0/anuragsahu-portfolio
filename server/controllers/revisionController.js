/**
 * REVISION CONTROLLER
 * Full version history, change diffing, read-only inspection, and safe non-destructive rollback.
 */
const Revision = require('../models/Revision');
const Draft = require('../models/Draft');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { calculateDiff, recordRevision, IN_MEMORY_REVISIONS } = require('../utils/revisionHelper');

// Entity Model registry
const ENTITY_MODELS = {
  Project: require('../models/Project'),
  Hero: require('../models/Hero'),
  Profile: require('../models/Profile'),
  About: require('../models/About'),
  Skill: require('../models/Skill'),
  Experience: require('../models/Experience'),
  Education: require('../models/Education'),
  Certificate: require('../models/Certificate'),
  Roadmap: require('../models/Roadmap'),
  SocialLink: require('../models/SocialLink'),
  Navigation: require('../models/Navigation'),
  Settings: require('../models/Settings'),
  SEO: require('../models/Settings'),
};

/**
 * GET /api/admin/revisions/:entity/:id
 * Fetches revision list for an entity (sorted newest first, omitting snapshot body for speed)
 */
const getRevisions = async (req, res, next) => {
  try {
    const { entity, id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const query = { entityType: entity, entityId: String(id) };
    let revisions = [];
    let total = 0;

    try {
      if (Revision.db && Revision.db.readyState === 1) {
        total = await Revision.countDocuments(query);
        revisions = await Revision.find(query)
          .sort({ version: -1 })
          .skip((Number(page) - 1) * Number(limit))
          .limit(Number(limit))
          .select('-snapshot')
          .lean();
      }
    } catch (dbErr) {}

    if (!revisions.length && (!Revision.db || Revision.db.readyState !== 1)) {
      const filtered = IN_MEMORY_REVISIONS.filter(
        (r) => r.entityType === entity && r.entityId === String(id)
      ).sort((a, b) => b.version - a.version);
      total = filtered.length;
      revisions = filtered
        .slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit))
        .map(({ snapshot, ...rest }) => rest);
    }

    return sendSuccess(res, {
      entityType: entity,
      entityId: id,
      total,
      page: Number(page),
      limit: Number(limit),
      revisions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/revisions/:entity/:id/:version
 * Fetches single revision with full content snapshot (read-only)
 */
const getRevisionByVersion = async (req, res, next) => {
  try {
    const { entity, id, version } = req.params;
    const vNum = Number(version);

    if (isNaN(vNum) || vNum < 1) {
      return sendError(res, 'Valid version number is required.', 'INVALID_VERSION', 400);
    }

    let revision = null;

    try {
      if (Revision.db && Revision.db.readyState === 1) {
        revision = await Revision.findOne({
          entityType: entity,
          entityId: String(id),
          version: vNum,
        }).lean();
      }
    } catch (dbErr) {}

    if (!revision) {
      revision = IN_MEMORY_REVISIONS.find(
        (r) => r.entityType === entity && r.entityId === String(id) && r.version === vNum
      );
    }

    if (!revision) {
      return sendError(res, 'Revision Version ' + vNum + ' not found for ' + entity + '.', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, revision);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/revisions/:entity/:id/compare
 * Compares two versions (or current entity against target version)
 * Body: { baseVersion, targetVersion }
 */
const compareRevisions = async (req, res, next) => {
  try {
    const { entity, id } = req.params;
    const { baseVersion, targetVersion } = req.body;

    if (!targetVersion) {
      return sendError(res, 'targetVersion is required for comparison.', 'MISSING_PARAM', 400);
    }

    let baseSnapshot = null;
    let targetSnapshot = null;

    // Load target snapshot
    try {
      if (Revision.db && Revision.db.readyState === 1) {
        const tDoc = await Revision.findOne({
          entityType: entity,
          entityId: String(id),
          version: Number(targetVersion),
        }).lean();
        if (tDoc) targetSnapshot = tDoc.snapshot;
      }
    } catch (e) {}

    if (!targetSnapshot) {
      const tMem = IN_MEMORY_REVISIONS.find(
        (r) => r.entityType === entity && r.entityId === String(id) && r.version === Number(targetVersion)
      );
      if (tMem) targetSnapshot = tMem.snapshot;
    }

    if (!targetSnapshot) {
      return sendError(res, 'Target revision version ' + targetVersion + ' not found.', 'NOT_FOUND', 404);
    }

    // Load base snapshot (or current live doc if baseVersion not specified)
    if (baseVersion) {
      try {
        if (Revision.db && Revision.db.readyState === 1) {
          const bDoc = await Revision.findOne({
            entityType: entity,
            entityId: String(id),
            version: Number(baseVersion),
          }).lean();
          if (bDoc) baseSnapshot = bDoc.snapshot;
        }
      } catch (e) {}

      if (!baseSnapshot) {
        const bMem = IN_MEMORY_REVISIONS.find(
          (r) => r.entityType === entity && r.entityId === String(id) && r.version === Number(baseVersion)
        );
        if (bMem) baseSnapshot = bMem.snapshot;
      }
    } else {
      // Base is current document
      const Model = ENTITY_MODELS[entity];
      if (Model && Model.db && Model.db.readyState === 1) {
        let currentDoc = null;
        if (['Hero', 'Profile', 'About', 'Settings', 'SEO'].includes(entity)) {
          currentDoc = await Model.findOne().lean();
        } else if (String(id).match(/^[0-9a-fA-F]{24}$/)) {
          currentDoc = await Model.findById(id).lean();
        } else {
          currentDoc = await Model.findOne({ $or: [{ slug: id }, { id }] }).lean();
        }
        if (currentDoc) baseSnapshot = currentDoc;
      }
    }

    const diff = calculateDiff(baseSnapshot || {}, targetSnapshot || {});

    return sendSuccess(res, {
      entityType: entity,
      entityId: id,
      baseVersion: baseVersion || 'CURRENT',
      targetVersion: Number(targetVersion),
      summary: diff.summary,
      changedFields: diff.changedFields,
      changes: diff.changes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/revisions/:entity/:id/restore
 * Safe rollback: Restores content from targetVersion by creating a NEW revision.
 * Never deletes or truncates existing version history!
 */
const restoreRevision = async (req, res, next) => {
  try {
    const { entity, id } = req.params;
    const { targetVersion } = req.body;
    const vNum = Number(targetVersion);

    if (isNaN(vNum) || vNum < 1) {
      return sendError(res, 'Valid targetVersion number is required.', 'INVALID_VERSION', 400);
    }

    let targetRev = null;

    try {
      if (Revision.db && Revision.db.readyState === 1) {
        targetRev = await Revision.findOne({
          entityType: entity,
          entityId: String(id),
          version: vNum,
        }).lean();
      }
    } catch (dbErr) {}

    if (!targetRev) {
      targetRev = IN_MEMORY_REVISIONS.find(
        (r) => r.entityType === entity && r.entityId === String(id) && r.version === vNum
      );
    }

    if (!targetRev || !targetRev.snapshot) {
      return sendError(res, 'Revision Version ' + vNum + ' not found for ' + entity + '.', 'NOT_FOUND', 404);
    }

    const restoredData = { ...targetRev.snapshot };
    delete restoredData._id;
    delete restoredData.createdAt;
    delete restoredData.updatedAt;
    delete restoredData.__v;

    // Apply restored content to the primary database collection
    const Model = ENTITY_MODELS[entity];
    let updatedDoc = null;

    if (Model && Model.db && Model.db.readyState === 1) {
      if (['Hero', 'Profile', 'About', 'Settings', 'SEO'].includes(entity)) {
        updatedDoc = await Model.findOneAndUpdate({}, restoredData, { new: true, upsert: true });
      } else if (String(id).match(/^[0-9a-fA-F]{24}$/)) {
        updatedDoc = await Model.findByIdAndUpdate(id, restoredData, { new: true });
      } else {
        updatedDoc = await Model.findOneAndUpdate({ $or: [{ slug: id }, { id }] }, restoredData, { new: true });
      }
    }

    // Create NEW revision preserving full audit trail
    const adminEmail = req.user?.email || 'admin@anuragsahu.dev';
    const newRev = await recordRevision({
      entityType: entity,
      entityId: id,
      title: targetRev.title || entity,
      snapshot: restoredData,
      state: 'RESTORED',
      createdBy: adminEmail,
      changeSummary: 'Restored from Version ' + vNum,
      restoredFromVersion: vNum,
    });

    // Clear active working draft for this entity
    try {
      if (Draft.db && Draft.db.readyState === 1) {
        await Draft.deleteOne({ entityType: entity, entityId: String(id) });
      }
    } catch (e) {}

    // Log Activity
    try {
      await logActivity(
        'REVISION_RESTORED',
        entity,
        {
          entityId: id,
          restoredFromVersion: vNum,
          newVersion: newRev.version,
        },
        req
      );
    } catch (e) {}

    return sendSuccess(res, {
      message: 'Successfully restored ' + entity + ' to content from Version ' + vNum + '. Created new Version ' + newRev.version + '.',
      newVersion: newRev.version,
      restoredFromVersion: vNum,
      entity: updatedDoc || restoredData,
      revision: newRev,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRevisions,
  getRevisionByVersion,
  compareRevisions,
  restoreRevision,
  ENTITY_MODELS,
};
