/**
 * DRAFT & AUTOSAVE CONTROLLER
 * Debounced draft saving, optimistic concurrency conflict detection, and draft recovery.
 */
const Draft = require('../models/Draft');
const Revision = require('../models/Revision');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { sanitizeSnapshot, IN_MEMORY_REVISIONS } = require('../utils/revisionHelper');
const { sanitizeHtmlContent, isSafeUrl } = require('../utils/security');

// In-memory drafts fallback
const IN_MEMORY_DRAFTS = new Map();

/**
 * POST /api/admin/draft/autosave
 * Saves draft state, performs concurrency conflict detection, never publishes publicly.
 * Body: { entityType, entityId, data, baseVersion }
 */
const autosaveDraft = async (req, res, next) => {
  try {
    const { entityType, entityId, data, baseVersion } = req.body;

    if (!entityType || !entityId || !data) {
      return sendError(res, 'entityType, entityId, and data are required.', 'VALIDATION_ERROR', 422);
    }

    const strEntityId = String(entityId);
    const cleanData = sanitizeSnapshot(data);

    // Sanitize string content and URLs
    for (const [key, val] of Object.entries(cleanData)) {
      if (typeof val === 'string') {
        if (key.toLowerCase().includes('url') && val.trim()) {
          if (!isSafeUrl(val)) {
            return sendError(res, 'Invalid or unsafe URL in field: ' + key, 'INVALID_URL', 422);
          }
        } else if (val.includes('<') && val.includes('>')) {
          cleanData[key] = sanitizeHtmlContent(val);
        }
      }
    }

    // ─── Optimistic Concurrency Conflict Detection ───────────
    let latestVersion = 1;
    try {
      if (Revision.db && Revision.db.readyState === 1) {
        const latestRev = await Revision.findOne({ entityType, entityId: strEntityId }).sort({ version: -1 });
        if (latestRev) latestVersion = latestRev.version;
      }
    } catch (e) {}

    if (latestVersion === 1) {
      const memRevs = IN_MEMORY_REVISIONS.filter(
        (r) => r.entityType === entityType && r.entityId === strEntityId
      ).sort((a, b) => b.version - a.version);
      if (memRevs.length > 0) latestVersion = memRevs[0].version;
    }

    const passedBaseVersion = Number(baseVersion);
    const isConflict = !isNaN(passedBaseVersion) && passedBaseVersion > 0 && latestVersion > passedBaseVersion;

    const adminEmail = req.user?.email || 'anuragsahu@anuragsahu.dev';
    const draftPayload = {
      entityType,
      entityId: strEntityId,
      data: cleanData,
      baseVersion: passedBaseVersion || latestVersion,
      adminEmail,
      lastSavedAt: new Date(),
      isDirty: true,
    };

    let savedDraft = null;

    try {
      if (Draft.db && Draft.db.readyState === 1) {
        savedDraft = await Draft.findOneAndUpdate(
          { entityType, entityId: strEntityId },
          draftPayload,
          { new: true, upsert: true, runValidators: true }
        );
      }
    } catch (dbErr) {
      console.warn('[DraftController] DB autosave failed, using memory:', dbErr.message);
    }

    if (!savedDraft) {
      const memKey = entityType + ':' + strEntityId;
      IN_MEMORY_DRAFTS.set(memKey, draftPayload);
      savedDraft = draftPayload;
    }

    return sendSuccess(res, {
      message: isConflict ? 'Draft saved, but content was modified in another session.' : 'Draft autosaved successfully.',
      conflict: isConflict,
      latestVersion,
      baseVersion: passedBaseVersion || latestVersion,
      draft: savedDraft,
      savedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/draft/:entity/:id
 * Fetches active draft for an entity (if any)
 */
const getDraft = async (req, res, next) => {
  try {
    const { entity, id } = req.params;
    let draft = null;

    try {
      if (Draft.db && Draft.db.readyState === 1) {
        draft = await Draft.findOne({ entityType: entity, entityId: String(id) }).lean();
      }
    } catch (e) {}

    if (!draft) {
      const memKey = entity + ':' + String(id);
      draft = IN_MEMORY_DRAFTS.get(memKey) || null;
    }

    if (!draft) {
      return sendSuccess(res, { hasDraft: false, draft: null });
    }

    return sendSuccess(res, {
      hasDraft: true,
      draft,
      savedAt: draft.lastSavedAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/draft/:entity/:id
 * Discards working draft
 */
const discardDraft = async (req, res, next) => {
  try {
    const { entity, id } = req.params;

    try {
      if (Draft.db && Draft.db.readyState === 1) {
        await Draft.deleteOne({ entityType: entity, entityId: String(id) });
      }
    } catch (e) {}

    const memKey = entity + ':' + String(id);
    IN_MEMORY_DRAFTS.delete(memKey);

    return sendSuccess(res, { message: 'Draft discarded successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  autosaveDraft,
  getDraft,
  discardDraft,
  IN_MEMORY_DRAFTS,
};
