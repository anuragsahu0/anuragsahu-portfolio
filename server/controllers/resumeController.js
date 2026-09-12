const Resume = require('../models/Resume');
const Settings = require('../models/Settings');
const Profile = require('../models/Profile');
const Media = require('../models/Media');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { saveFile, deleteFile } = require('../services/storageService');

const DEFAULT_RESUME = {
  _id: 'res-default',
  version: 'v1.0',
  title: 'Anurag Sahu — Software Engineer Resume (2026)',
  fileName: 'anurag-sahu-resume.pdf',
  originalName: 'anurag-sahu-resume.pdf',
  url: '/assets/anurag-sahu-resume.pdf',
  size: 85200,
  mimeType: 'application/pdf',
  status: 'ACTIVE',
  uploadedBy: 'admin',
  notes: 'Official verified resume for internships and engineering roles.',
  createdAt: new Date('2026-08-15'),
  updatedAt: new Date('2026-08-15'),
};

const FALLBACK_RESUMES = [DEFAULT_RESUME];

/**
 * GET /api/public/resume
 * Publicly accessible active resume information
 */
const getPublicResume = async (req, res, next) => {
  try {
    let activeResume = null;
    try {
      if (Resume.db && Resume.db.readyState === 1) {
        activeResume = await Resume.findOne({ status: 'ACTIVE' }).sort({ updatedAt: -1 }).lean();
      }
    } catch (dbErr) {}

    if (!activeResume) {
      activeResume = FALLBACK_RESUMES.find((r) => r.status === 'ACTIVE') || DEFAULT_RESUME;
    }

    return sendSuccess(res, {
      title: activeResume.title,
      version: activeResume.version,
      url: activeResume.url,
      fileName: activeResume.fileName,
      size: activeResume.size,
      updatedAt: activeResume.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/resume
 * List all resume versions with status and metrics
 */
const getAdminResumes = async (req, res, next) => {
  try {
    let resumes = [];
    try {
      if (Resume.db && Resume.db.readyState === 1) {
        resumes = await Resume.find().sort({ createdAt: -1 }).lean();
      }
    } catch (dbErr) {}

    if (!resumes || resumes.length === 0) {
      resumes = [...FALLBACK_RESUMES];
    }

    const activeResume = resumes.find((r) => r.status === 'ACTIVE') || resumes[0];

    return sendSuccess(res, {
      total: resumes.length,
      activeResume,
      resumes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/resume/upload
 * Upload new PDF resume, compute next version, set ACTIVE, archive old versions, and sync Profile/Settings
 */
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No resume PDF provided for upload.', 'VALIDATION_ERROR', 400);
    }

    if (req.file.mimetype !== 'application/pdf') {
      return sendError(res, 'Only PDF documents are accepted for resumes.', 'VALIDATION_ERROR', 400);
    }

    const { title, notes, makeActive = 'true' } = req.body;

    // 1. Save file to storage
    const stored = await saveFile(req.file.buffer, req.file.originalname, 'application/pdf');

    // 2. Determine next version number
    let count = 0;
    try {
      if (Resume.db && Resume.db.readyState === 1) {
        count = await Resume.countDocuments();
      } else {
        count = FALLBACK_RESUMES.length;
      }
    } catch (e) {
      count = FALLBACK_RESUMES.length;
    }
    const nextVersion = `v${count + 1}.0`;
    const resumeTitle = title || `Anurag Sahu — Software Engineer Resume (${nextVersion})`;
    const shouldActivate = makeActive === 'true' || makeActive === true;

    // 3. If activating, archive previous active resumes
    if (shouldActivate) {
      try {
        if (Resume.db && Resume.db.readyState === 1) {
          await Resume.updateMany({ status: 'ACTIVE' }, { status: 'ARCHIVED' });
        }
      } catch (e) {}

      FALLBACK_RESUMES.forEach((r) => {
        if (r.status === 'ACTIVE') r.status = 'ARCHIVED';
      });
    }

    // 4. Create resume record
    let resumeRecord = null;
    try {
      if (Resume.db && Resume.db.readyState === 1) {
        resumeRecord = await Resume.create({
          version: nextVersion,
          title: resumeTitle,
          fileName: stored.fileName,
          originalName: stored.originalName,
          url: stored.url,
          size: stored.size,
          mimeType: 'application/pdf',
          status: shouldActivate ? 'ACTIVE' : 'ARCHIVED',
          uploadedBy: req.user?.email || 'admin',
          notes: notes ? notes.trim() : '',
        });
      }
    } catch (dbErr) {
      console.warn('[uploadResume] DB save error:', dbErr.message);
    }

    if (!resumeRecord) {
      resumeRecord = {
        _id: `res-${Date.now()}`,
        version: nextVersion,
        title: resumeTitle,
        fileName: stored.fileName,
        originalName: stored.originalName,
        url: stored.url,
        size: stored.size,
        mimeType: 'application/pdf',
        status: shouldActivate ? 'ACTIVE' : 'ARCHIVED',
        uploadedBy: req.user?.email || 'admin',
        notes: notes ? notes.trim() : '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      FALLBACK_RESUMES.unshift(resumeRecord);
    }

    // 5. Also register into Media collection for unified visibility
    try {
      if (Media.db && Media.db.readyState === 1) {
        await Media.create({
          fileName: stored.fileName,
          originalName: stored.originalName,
          url: stored.url,
          type: 'document',
          fileType: 'document',
          mimeType: 'application/pdf',
          size: stored.size,
          altText: resumeTitle,
          caption: `Portfolio Resume (${nextVersion})`,
          category: 'RESUME',
          status: 'ACTIVE',
        });
      }
    } catch (e) {}

    // 6. Sync Settings and Profile if active
    if (shouldActivate) {
      try {
        if (Settings.db && Settings.db.readyState === 1) {
          await Settings.findOneAndUpdate(
            { singletonId: 'global' },
            { resumeUrl: stored.url },
            { upsert: true }
          );
        }
        if (Profile.db && Profile.db.readyState === 1) {
          await Profile.updateMany({}, { resumeUrl: stored.url });
        }
      } catch (e) {}
    }

    try {
      await logActivity(
        'RESUME_UPLOADED',
        'Resume',
        { version: resumeRecord.version, fileName: resumeRecord.fileName, active: shouldActivate },
        req
      );
    } catch (e) {}

    return sendSuccess(res, resumeRecord, 201);
  } catch (err) {
    if (err.message && (err.message.includes('MIME type') || err.message.includes('magic'))) {
      return sendError(res, err.message, 'VALIDATION_ERROR', 400);
    }
    next(err);
  }
};

/**
 * PATCH /api/admin/resume/:id/activate
 * Set a specific resume version as ACTIVE, archive others, and sync references
 */
const setActiveResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    let target = null;

    try {
      if (Resume.db && Resume.db.readyState === 1) {
        target = await Resume.findById(id);
      }
    } catch (dbErr) {}

    if (!target) {
      target = FALLBACK_RESUMES.find((r) => r._id === id);
    }

    if (!target) {
      return sendError(res, 'Resume version not found.', 'NOT_FOUND', 404);
    }

    // Archive all other resumes
    try {
      if (Resume.db && Resume.db.readyState === 1) {
        await Resume.updateMany({ _id: { $ne: target._id } }, { status: 'ARCHIVED' });
        target.status = 'ACTIVE';
        await target.save();
      }
    } catch (dbErr) {}

    FALLBACK_RESUMES.forEach((r) => {
      r.status = r._id === target._id ? 'ACTIVE' : 'ARCHIVED';
    });

    // Synchronize Settings and Profile
    try {
      if (Settings.db && Settings.db.readyState === 1) {
        await Settings.findOneAndUpdate(
          { singletonId: 'global' },
          { resumeUrl: target.url },
          { upsert: true }
        );
      }
      if (Profile.db && Profile.db.readyState === 1) {
        await Profile.updateMany({}, { resumeUrl: target.url });
      }
    } catch (e) {}

    try {
      await logActivity('RESUME_ACTIVATED', 'Resume', { version: target.version, id: target._id }, req);
    } catch (e) {}

    return sendSuccess(res, {
      message: `Resume ${target.version} is now the active portfolio resume.`,
      activeResume: target,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/resume/:id
 * Delete an archived resume (cannot delete active resume)
 */
const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    let target = null;

    try {
      if (Resume.db && Resume.db.readyState === 1) {
        target = await Resume.findById(id);
      }
    } catch (dbErr) {}

    if (!target) {
      target = FALLBACK_RESUMES.find((r) => r._id === id);
    }

    if (!target) {
      return sendError(res, 'Resume record not found.', 'NOT_FOUND', 404);
    }

    if (target.status === 'ACTIVE') {
      return sendError(
        res,
        'Cannot delete the active portfolio resume. Please activate another resume first.',
        'VALIDATION_ERROR',
        400
      );
    }

    // Remove file if local upload
    if (target.fileName && !target.url.startsWith('/assets/')) {
      await deleteFile(target.fileName);
    }

    try {
      if (Resume.db && Resume.db.readyState === 1) {
        await Resume.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    const idx = FALLBACK_RESUMES.findIndex((r) => r._id === id);
    if (idx !== -1) {
      FALLBACK_RESUMES.splice(idx, 1);
    }

    try {
      await logActivity('RESUME_DELETED', 'Resume', { id, version: target.version }, req);
    } catch (e) {}

    return sendSuccess(res, { message: `Resume ${target.version} deleted.` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicResume,
  getAdminResumes,
  uploadResume,
  setActiveResume,
  deleteResume,
};
