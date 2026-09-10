const Media = require('../models/Media');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const FALLBACK_MEDIA = [
  {
    _id: 'med-1',
    fileName: 'anurag-portrait-sm.webp',
    url: '/assets/anurag-portrait-sm.webp',
    type: 'image',
    mimeType: 'image/webp',
    size: 9246,
    altText: 'Anurag Sahu Portrait WebP',
    category: 'PROFILE',
    createdAt: new Date(),
  },
  {
    _id: 'med-2',
    fileName: 'anurag-portrait-sm.jpg',
    url: '/assets/anurag-portrait-sm.jpg',
    type: 'image',
    mimeType: 'image/jpeg',
    size: 15995,
    altText: 'Anurag Sahu Portrait JPEG',
    category: 'PROFILE',
    createdAt: new Date(),
  },
  {
    _id: 'med-3',
    fileName: 'anurag-sahu-resume.pdf',
    url: '/assets/anurag-sahu-resume.pdf',
    type: 'document',
    mimeType: 'application/pdf',
    size: 85200,
    altText: 'Anurag Sahu Curriculum Vitae PDF',
    category: 'RESUME',
    createdAt: new Date(),
  },
  {
    _id: 'med-4',
    fileName: 'project-portfolio.webp',
    url: '/assets/project-portfolio.webp',
    type: 'image',
    mimeType: 'image/webp',
    size: 47155,
    altText: 'Portfolio Project Preview',
    category: 'PROJECT',
    createdAt: new Date(),
  },
];

const getMedia = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (category && category !== 'ALL') filter.category = category;

    let media = [];
    let total = 0;

    try {
      if (Media.db && Media.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        [media, total] = await Promise.all([
          Media.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
          Media.countDocuments(filter),
        ]);
      }
    } catch (dbErr) {}

    if (!media || media.length === 0) {
      media = FALLBACK_MEDIA.filter((m) => !category || category === 'ALL' || m.category === category);
      total = media.length;
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

const createMedia = async (req, res, next) => {
  try {
    const { fileName, url, category = 'OTHER', altText = '', size = 0, mimeType = 'image/webp' } = req.body;
    if (!fileName || !url) {
      return sendError(res, 'File name and URL are required.', 'VALIDATION_ERROR', 422);
    }

    let item = null;
    try {
      if (Media.db && Media.db.readyState === 1) {
        item = await Media.create({
          fileName,
          url,
          category,
          altText,
          size,
          mimeType,
          type: mimeType.startsWith('image/') ? 'image' : 'document',
        });
      }
    } catch (dbErr) {}

    if (!item) {
      item = {
        _id: `med-${Date.now()}`,
        fileName,
        url,
        category,
        altText,
        size,
        mimeType,
        type: mimeType.startsWith('image/') ? 'image' : 'document',
        createdAt: new Date(),
      };
      FALLBACK_MEDIA.push(item);
    }

    try {
      await logActivity('MEDIA_CREATED', 'Media', { fileName: item.fileName, category: item.category }, req);
    } catch (e) {}

    return sendSuccess(res, item, 201);
  } catch (err) {
    next(err);
  }
};

const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Media.db && Media.db.readyState === 1) {
        deleted = await Media.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_MEDIA.findIndex((m) => m._id === id);
      if (idx !== -1) {
        deleted = FALLBACK_MEDIA.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Media asset not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('MEDIA_DELETED', 'Media', { id }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Media metadata removed.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMedia,
  createMedia,
  deleteMedia,
};
