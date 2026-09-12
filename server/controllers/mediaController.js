const Media = require('../models/Media');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { saveFile, deleteFile } = require('../services/storageService');
const { findMediaUsage } = require('../utils/mediaUsage');

const FALLBACK_MEDIA = [
  {
    _id: 'med-1',
    fileName: 'anurag-portrait-sm.webp',
    originalName: 'anurag-portrait-sm.webp',
    url: '/assets/anurag-portrait-sm.webp',
    type: 'image',
    fileType: 'image',
    mimeType: 'image/webp',
    size: 9246,
    width: 400,
    height: 400,
    altText: 'Anurag Sahu Portrait WebP',
    caption: 'Official profile portrait',
    category: 'PROFILE',
    status: 'ACTIVE',
    createdAt: new Date('2026-08-01'),
  },
  {
    _id: 'med-2',
    fileName: 'anurag-portrait-sm.jpg',
    originalName: 'anurag-portrait-sm.jpg',
    url: '/assets/anurag-portrait-sm.jpg',
    type: 'image',
    fileType: 'image',
    mimeType: 'image/jpeg',
    size: 15995,
    width: 400,
    height: 400,
    altText: 'Anurag Sahu Portrait JPEG',
    caption: 'Profile fallback image',
    category: 'PROFILE',
    status: 'ACTIVE',
    createdAt: new Date('2026-08-01'),
  },
  {
    _id: 'med-3',
    fileName: 'anurag-sahu-resume.pdf',
    originalName: 'anurag-sahu-resume.pdf',
    url: '/assets/anurag-sahu-resume.pdf',
    type: 'document',
    fileType: 'document',
    mimeType: 'application/pdf',
    size: 85200,
    altText: 'Anurag Sahu Curriculum Vitae PDF',
    caption: 'Full-Stack & AI/ML Engineer Resume',
    category: 'RESUME',
    status: 'ACTIVE',
    createdAt: new Date('2026-08-15'),
  },
  {
    _id: 'med-4',
    fileName: 'anurag-portrait.webp',
    originalName: 'anurag-portrait.webp',
    url: '/assets/anurag-portrait.webp',
    type: 'image',
    fileType: 'image',
    mimeType: 'image/webp',
    size: 46052,
    width: 1200,
    height: 1200,
    altText: 'Anurag Sahu High-Resolution Portrait',
    caption: 'Open Graph and High-DPI Hero Image',
    category: 'SEO',
    status: 'ACTIVE',
    createdAt: new Date('2026-08-01'),
  },
  {
    _id: 'med-5',
    fileName: 'as-admin-icon.svg',
    originalName: 'as-admin-icon.svg',
    url: '/assets/as-admin-icon.svg',
    type: 'image',
    fileType: 'image',
    mimeType: 'image/svg+xml',
    size: 2519,
    altText: 'Anurag Sahu Control Center Logo',
    caption: 'Control Center Brand Icon',
    category: 'BRANDING',
    status: 'ACTIVE',
    createdAt: new Date('2026-08-01'),
  },
];

/**
 * GET /api/admin/media
 * Search, filter, sort, and paginate media library assets
 */
const getMedia = async (req, res, next) => {
  try {
    const {
      category,
      type,
      search,
      sort = 'newest',
      page = 1,
      limit = 50,
    } = req.query;

    const filter = { status: { $ne: 'DELETED' } };

    if (category && category !== 'ALL') {
      filter.category = category.toUpperCase();
    }

    if (type && type !== 'all') {
      filter.type = type.toLowerCase();
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { fileName: new RegExp(q, 'i') },
        { originalName: new RegExp(q, 'i') },
        { altText: new RegExp(q, 'i') },
        { caption: new RegExp(q, 'i') },
      ];
    }

    // Sort order
    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'name') sortObj = { fileName: 1 };
    else if (sort === 'size') sortObj = { size: -1 };

    let media = [];
    let total = 0;

    try {
      if (Media.db && Media.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        [media, total] = await Promise.all([
          Media.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
          Media.countDocuments(filter),
        ]);
      }
    } catch (dbErr) {
      console.warn('[getMedia] DB error, using fallback:', dbErr.message);
    }

    if (!media || media.length === 0) {
      let filtered = FALLBACK_MEDIA.filter((m) => m.status !== 'DELETED');
      if (category && category !== 'ALL') {
        filtered = filtered.filter((m) => m.category === category.toUpperCase());
      }
      if (type && type !== 'all') {
        filtered = filtered.filter((m) => m.type === type.toLowerCase());
      }
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.fileName.toLowerCase().includes(q) ||
            (m.altText && m.altText.toLowerCase().includes(q)) ||
            (m.caption && m.caption.toLowerCase().includes(q))
        );
      }
      if (sort === 'oldest') filtered.sort((a, b) => a.createdAt - b.createdAt);
      else if (sort === 'name') filtered.sort((a, b) => a.fileName.localeCompare(b.fileName));
      else if (sort === 'size') filtered.sort((a, b) => b.size - a.size);
      else filtered.sort((a, b) => b.createdAt - a.createdAt);

      total = filtered.length;
      media = filtered.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
    }

    return sendSuccess(res, {
      total,
      page: Number(page),
      limit: Number(limit),
      media,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/media/:id
 * Retrieve specific media detail including live usage references
 */
const getMediaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    try {
      if (Media.db && Media.db.readyState === 1) {
        item = await Media.findById(id).lean();
      }
    } catch (dbErr) {}

    if (!item) {
      item = FALLBACK_MEDIA.find((m) => m._id === id || m.fileName === id);
    }

    if (!item) {
      return sendError(res, 'Media asset not found.', 'NOT_FOUND', 404);
    }

    // Inspect usages dynamically
    const usages = await findMediaUsage(item);
    item.usedIn = usages;
    item.usageCount = usages.length;

    return sendSuccess(res, item);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/media/upload
 * Authenticated file upload with MIME, extension, magic-byte check, and dimension extraction
 */
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file was provided for upload.', 'VALIDATION_ERROR', 400);
    }

    const { category = 'OTHER', altText = '', caption = '', folder = 'general' } = req.body;

    // Save file to storage through persistent abstraction
    const stored = await saveFile(req.file.buffer, req.file.originalname, req.file.mimetype);

    let item = null;
    try {
      if (Media.db && Media.db.readyState === 1) {
        item = await Media.create({
          fileName: stored.fileName,
          originalName: stored.originalName,
          storageKey: stored.storageKey,
          url: stored.url,
          type: stored.fileType,
          fileType: stored.fileType,
          mimeType: stored.mimeType,
          size: stored.size,
          width: stored.width,
          height: stored.height,
          altText: altText.trim(),
          caption: caption.trim(),
          category: category.toUpperCase(),
          folder: folder.trim().toLowerCase(),
          checksum: stored.checksum,
          uploadedBy: req.user?.email || 'admin',
          status: 'ACTIVE',
        });
      }
    } catch (dbErr) {
      console.warn('[uploadMedia] DB save error:', dbErr.message);
    }

    if (!item) {
      item = {
        _id: `med-${Date.now()}`,
        fileName: stored.fileName,
        originalName: stored.originalName,
        url: stored.url,
        type: stored.fileType,
        fileType: stored.fileType,
        mimeType: stored.mimeType,
        size: stored.size,
        width: stored.width,
        height: stored.height,
        altText: altText.trim(),
        caption: caption.trim(),
        category: category.toUpperCase(),
        folder: folder.trim().toLowerCase(),
        checksum: stored.checksum,
        status: 'ACTIVE',
        createdAt: new Date(),
      };
      FALLBACK_MEDIA.unshift(item);
    }

    try {
      await logActivity(
        'MEDIA_UPLOADED',
        'Media',
        { fileName: item.fileName, size: item.size, category: item.category },
        req
      );
    } catch (e) {}

    return sendSuccess(res, item, 201);
  } catch (err) {
    if (err.message && (err.message.includes('MIME type') || err.message.includes('magic'))) {
      return sendError(res, err.message, 'VALIDATION_ERROR', 400);
    }
    next(err);
  }
};

/**
 * PATCH /api/admin/media/:id
 * Update media metadata (altText, caption, category, folder)
 */
const updateMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { altText, caption, category, folder, fileName } = req.body;

    const updates = {};
    if (altText !== undefined) updates.altText = altText.trim();
    if (caption !== undefined) updates.caption = caption.trim();
    if (category !== undefined) updates.category = category.toUpperCase();
    if (folder !== undefined) updates.folder = folder.trim().toLowerCase();
    if (fileName !== undefined && fileName.trim()) updates.fileName = fileName.trim();

    let updated = null;
    try {
      if (Media.db && Media.db.readyState === 1) {
        updated = await Media.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!updated) {
      const idx = FALLBACK_MEDIA.findIndex((m) => m._id === id);
      if (idx !== -1) {
        FALLBACK_MEDIA[idx] = { ...FALLBACK_MEDIA[idx], ...updates, updatedAt: new Date() };
        updated = FALLBACK_MEDIA[idx];
      }
    }

    if (!updated) {
      return sendError(res, 'Media asset not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('MEDIA_UPDATED', 'Media', { id, updates: Object.keys(updates) }, req);
    } catch (e) {}

    return sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/media/:id
 * Reference-checked deletion (warns if file is used in CMS records)
 */
const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { force = 'false' } = req.query;

    let item = null;
    try {
      if (Media.db && Media.db.readyState === 1) {
        item = await Media.findById(id);
      }
    } catch (dbErr) {}

    if (!item) {
      item = FALLBACK_MEDIA.find((m) => m._id === id);
    }

    if (!item) {
      return sendError(res, 'Media asset not found.', 'NOT_FOUND', 404);
    }

    // Check usage across all CMS modules
    const usages = await findMediaUsage(item);

    if (usages.length > 0 && force !== 'true') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'MEDIA_IN_USE',
          message: `This file is currently used by ${usages.length} content item(s). Use ?force=true to override.`,
          usages,
        },
      });
    }

    // Attempt physical deletion from disk
    if (item.fileName) {
      await deleteFile(item.fileName);
    }

    // Remove or soft-delete from DB
    try {
      if (Media.db && Media.db.readyState === 1) {
        await Media.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    const idx = FALLBACK_MEDIA.findIndex((m) => m._id === id);
    if (idx !== -1) {
      FALLBACK_MEDIA.splice(idx, 1);
    }

    try {
      await logActivity('MEDIA_DELETED', 'Media', { id, fileName: item.fileName, forced: force === 'true' }, req);
    } catch (e) {}

    return sendSuccess(res, {
      message: 'Media asset deleted successfully.',
      id,
      fileName: item.fileName,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/media/:id/usage
 * Explicitly query references for a media item
 */
const getMediaUsage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    try {
      if (Media.db && Media.db.readyState === 1) {
        item = await Media.findById(id).lean();
      }
    } catch (dbErr) {}

    if (!item) {
      item = FALLBACK_MEDIA.find((m) => m._id === id);
    }

    if (!item) {
      return sendError(res, 'Media asset not found.', 'NOT_FOUND', 404);
    }

    const usages = await findMediaUsage(item);
    return sendSuccess(res, { id, fileName: item.fileName, count: usages.length, usages, usedIn: usages });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaUsage,
  // Backward compatibility alias for legacy route
  createMedia: uploadMedia,
};
