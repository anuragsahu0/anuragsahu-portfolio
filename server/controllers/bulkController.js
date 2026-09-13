const { isDbConnected } = require('../config/db');
const { hasPermission } = require('../services/securityService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { recordRevision } = require('../utils/revisionHelper');

// Models
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const Media = require('../models/Media');
const ActivityLog = require('../models/ActivityLog');
const { FALLBACK_PROJECTS } = require('./projectController');

/**
 * Safe Activity Logger Helper
 */
async function logBulkActivity({ adminEmail, adminId, action, resourceType, description, metadata }) {
  const entry = {
    _id: `act-bulk-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    adminId: adminId || 'primary-owner',
    adminEmail: adminEmail || 'anuragsahu@anuragsahu.dev',
    action,
    resourceType,
    description,
    metadata: metadata || {},
    createdAt: new Date(),
  };

  try {
    if (ActivityLog.db && ActivityLog.db.readyState === 1) {
      await ActivityLog.create(entry);
    }
  } catch (_) {}
  return entry;
}

/**
 * POST /api/admin/bulk/projects
 * Safe bulk operations for portfolio projects.
 */
const bulkProjects = async (req, res, next) => {
  try {
    const { ids, action, category } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 'ids must be a non-empty array', 400);
    }

    const validActions = ['PUBLISH', 'UNPUBLISH', 'ARCHIVE', 'DELETE', 'CHANGE_CATEGORY'];
    if (!validActions.includes(action)) {
      return sendError(res, `Invalid action. Supported: ${validActions.join(', ')}`, 400);
    }

    const role = req.user?.role || 'VIEWER';

    // 1. Permission checks
    let requiredPerm = 'projects.edit';
    if (['PUBLISH', 'UNPUBLISH', 'ARCHIVE'].includes(action)) {
      requiredPerm = 'projects.publish';
    } else if (action === 'DELETE') {
      requiredPerm = 'projects.delete';
    }

    const allowed = await hasPermission(role, requiredPerm);
    if (!allowed) {
      return sendError(res, `Permission denied: ${requiredPerm} is required for bulk ${action}.`, 403, {
        totalSelected: ids.length,
        allowedCount: 0,
        deniedCount: ids.length,
      });
    }

    const isConnected = isDbConnected();
    const results = [];
    let completed = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        let proj = null;
        if (isConnected) {
          proj = await Project.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { id }, { slug: id }] });
        }
        if (!proj && Array.isArray(FALLBACK_PROJECTS)) {
          proj = FALLBACK_PROJECTS.find(p => String(p._id) === String(id) || p.id === id || p.slug === id);
        }

        if (action === 'DELETE') {
          if (isConnected && proj && proj.deleteOne) {
            await Project.deleteOne({ _id: proj._id });
          }
          if (Array.isArray(FALLBACK_PROJECTS)) {
            const idx = FALLBACK_PROJECTS.findIndex(p => String(p._id) === String(id) || p.id === id || p.slug === id);
            if (idx !== -1) FALLBACK_PROJECTS.splice(idx, 1);
          }
          results.push({ id, status: 'SUCCESS', action: 'DELETED' });
          completed++;
        } else {
          let updateData = {};
          let state = 'DRAFT';

          if (action === 'PUBLISH') {
            updateData = { visibility: 'PUBLISHED', status: 'WORKING' };
            state = 'PUBLISHED';
          } else if (action === 'UNPUBLISH') {
            updateData = { visibility: 'DRAFT' };
            state = 'DRAFT';
          } else if (action === 'ARCHIVE') {
            updateData = { visibility: 'HIDDEN', status: 'ARCHIVED' };
            state = 'ARCHIVED';
          } else if (action === 'CHANGE_CATEGORY') {
            if (!category) {
              results.push({ id, status: 'FAILED', reason: 'Category parameter is required' });
              failed++;
              continue;
            }
            updateData = { category };
          }

          if (proj) {
            Object.assign(proj, updateData);
            if (isConnected && proj.save) {
              await proj.save();
            }

            // Record Revision for content integrity (Phase 11)
            try {
              await recordRevision({
                entityType: 'Project',
                entityId: (proj._id || proj.id || id).toString(),
                title: proj.title || 'Project',
                snapshot: proj.toObject ? proj.toObject() : proj,
                state,
                createdBy: req.user?.email || 'admin',
                changeSummary: `Bulk operation: ${action} applied`,
              });
            } catch (_) {}
          }

          results.push({ id, status: 'SUCCESS', action });
          completed++;
        }
      } catch (itemErr) {
        results.push({ id, status: 'FAILED', reason: itemErr.message });
        failed++;
      }
    }

    // Log Activity
    await logBulkActivity({
      adminEmail: req.user?.email,
      adminId: req.user?.id,
      action: `BULK_PROJECT_${action}`,
      resourceType: 'Project',
      description: `Bulk ${action} executed on ${completed} project(s) (${failed} failed).`,
      metadata: { totalSelected: ids.length, completed, failed, ids },
    });

    return sendSuccess(res, {
      action,
      totalSelected: ids.length,
      completed,
      failed,
      results,
      message: `Successfully processed ${completed} of ${ids.length} projects.`,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/admin/bulk/messages
 * Safe bulk operations for inquiries/messages.
 */
const bulkMessages = async (req, res, next) => {
  try {
    const { ids, action } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 'ids must be a non-empty array', 400);
    }

    const validActions = ['MARK_READ', 'MARK_UNREAD', 'ARCHIVE', 'DELETE'];
    if (!validActions.includes(action)) {
      return sendError(res, `Invalid action. Supported: ${validActions.join(', ')}`, 400);
    }

    const role = req.user?.role || 'VIEWER';
    const allowed = await hasPermission(role, 'messages.manage');
    if (!allowed) {
      return sendError(res, 'Permission denied: messages.manage is required for bulk message operations.', 403, {
        totalSelected: ids.length,
        allowedCount: 0,
        deniedCount: ids.length,
      });
    }

    const isConnected = isDbConnected();
    const results = [];
    let completed = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        if (isConnected) {
          if (action === 'DELETE') {
            await Contact.deleteOne({ _id: id });
          } else if (action === 'MARK_READ') {
            await Contact.updateOne({ _id: id }, { status: 'read', readAt: new Date() });
          } else if (action === 'MARK_UNREAD') {
            await Contact.updateOne({ _id: id }, { status: 'unread', readAt: null });
          } else if (action === 'ARCHIVE') {
            await Contact.updateOne({ _id: id }, { status: 'archived' });
          }
        }
        results.push({ id, status: 'SUCCESS', action });
        completed++;
      } catch (itemErr) {
        results.push({ id, status: 'FAILED', reason: itemErr.message });
        failed++;
      }
    }

    // Log Activity
    await logBulkActivity({
      adminEmail: req.user?.email,
      adminId: req.user?.id,
      action: `BULK_MESSAGE_${action}`,
      resourceType: 'Contact',
      description: `Bulk ${action} executed on ${completed} message(s) (${failed} failed).`,
      metadata: { totalSelected: ids.length, completed, failed, ids },
    });

    return sendSuccess(res, {
      action,
      totalSelected: ids.length,
      completed,
      failed,
      results,
      message: `Successfully processed ${completed} of ${ids.length} messages.`,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/admin/bulk/media
 * Safe bulk operations for media assets.
 */
const bulkMedia = async (req, res, next) => {
  try {
    const { ids, action } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 'ids must be a non-empty array', 400);
    }

    if (action !== 'DELETE') {
      return sendError(res, 'Only DELETE action is supported for bulk media operations.', 400);
    }

    const role = req.user?.role || 'VIEWER';
    const allowed = await hasPermission(role, 'media.delete');
    if (!allowed) {
      return sendError(res, 'Permission denied: media.delete is required for bulk media removal.', 403, {
        totalSelected: ids.length,
        allowedCount: 0,
        deniedCount: ids.length,
      });
    }

    const isConnected = isDbConnected();
    const results = [];
    let completed = 0;
    let failed = 0;

    for (const id of ids) {
      try {
        if (isConnected) {
          await Media.deleteOne({ _id: id });
        }
        results.push({ id, status: 'SUCCESS', action: 'DELETED' });
        completed++;
      } catch (itemErr) {
        results.push({ id, status: 'FAILED', reason: itemErr.message });
        failed++;
      }
    }

    // Log Activity
    await logBulkActivity({
      adminEmail: req.user?.email,
      adminId: req.user?.id,
      action: 'BULK_MEDIA_DELETE',
      resourceType: 'Media',
      description: `Bulk DELETE executed on ${completed} media item(s) (${failed} failed).`,
      metadata: { totalSelected: ids.length, completed, failed, ids },
    });

    return sendSuccess(res, {
      action: 'DELETE',
      totalSelected: ids.length,
      completed,
      failed,
      results,
      message: `Successfully deleted ${completed} of ${ids.length} media items.`,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  bulkProjects,
  bulkMessages,
  bulkMedia,
  logBulkActivity,
};
