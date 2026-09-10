const SocialLink = require('../models/SocialLink');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const DEFAULT_SOCIAL_LINKS = [
  { _id: 'soc-1', platform: 'GitHub', label: 'GitHub', url: 'https://github.com/anuragsahu0', icon: 'github', color: '#00f5ff', order: 1, isActive: true },
  { _id: 'soc-2', platform: 'LinkedIn', label: 'LinkedIn', url: 'https://linkedin.com/in/anuragsahu0', icon: 'linkedin', color: '#00b4d8', order: 2, isActive: true },
  { _id: 'soc-3', platform: 'Email', label: 'Email', url: 'mailto:shivasahu0612@gmail.com', icon: 'mail', color: '#ff6b6b', order: 3, isActive: true },
  { _id: 'soc-4', platform: 'Portfolio', label: 'Website', url: 'https://anuragsahu.com', icon: 'globe', color: '#10b981', order: 4, isActive: true },
];

let fallbackSocialLinks = [...DEFAULT_SOCIAL_LINKS];

const getPublicSocialLinks = async (req, res, next) => {
  try {
    let links = [];
    try {
      if (SocialLink.db && SocialLink.db.readyState === 1) {
        links = await SocialLink.find({ isActive: true }).sort({ order: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!links || links.length === 0) {
      links = fallbackSocialLinks.filter((s) => s.isActive);
    }

    return sendSuccess(res, { count: links.length, socialLinks: links });
  } catch (err) {
    next(err);
  }
};

const getAdminSocialLinks = async (req, res, next) => {
  try {
    let links = [];
    try {
      if (SocialLink.db && SocialLink.db.readyState === 1) {
        links = await SocialLink.find().sort({ order: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!links || links.length === 0) {
      links = fallbackSocialLinks;
    }

    return sendSuccess(res, { count: links.length, socialLinks: links });
  } catch (err) {
    next(err);
  }
};

const createSocialLink = async (req, res, next) => {
  try {
    const { platform, label, url, icon, color, order, isActive } = req.body;
    if (!platform || !url) {
      return sendError(res, 'Platform and URL are required.', 'VALIDATION_ERROR', 422);
    }

    let link = null;
    try {
      if (SocialLink.db && SocialLink.db.readyState === 1) {
        link = await SocialLink.create({
          platform: platform.trim(),
          label: (label || platform).trim(),
          url: url.trim(),
          icon: icon || 'link',
          color: color || '#06b6d4',
          order: order !== undefined ? order : 0,
          isActive: isActive !== undefined ? isActive : true,
        });
      }
    } catch (dbErr) {}

    if (!link) {
      link = {
        _id: `soc-${Date.now()}`,
        platform: platform.trim(),
        label: (label || platform).trim(),
        url: url.trim(),
        icon: icon || 'link',
        color: color || '#06b6d4',
        order: order !== undefined ? order : fallbackSocialLinks.length + 1,
        isActive: isActive !== undefined ? isActive : true,
      };
      fallbackSocialLinks.push(link);
    }

    try {
      await logActivity('SOCIAL_LINK_CREATED', 'SocialLink', { platform: link.platform, url: link.url }, req);
    } catch (e) {}

    return sendSuccess(res, link, 201);
  } catch (err) {
    next(err);
  }
};

const updateSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let link = null;

    try {
      if (SocialLink.db && SocialLink.db.readyState === 1) {
        link = await SocialLink.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!link) {
      const idx = fallbackSocialLinks.findIndex((s) => s._id === id);
      if (idx !== -1) {
        fallbackSocialLinks[idx] = { ...fallbackSocialLinks[idx], ...updates };
        link = fallbackSocialLinks[idx];
      }
    }

    if (!link) {
      return sendError(res, 'Social link not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('SOCIAL_LINK_UPDATED', 'SocialLink', { id, platform: link.platform }, req);
    } catch (e) {}

    return sendSuccess(res, link);
  } catch (err) {
    next(err);
  }
};

const deleteSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (SocialLink.db && SocialLink.db.readyState === 1) {
        deleted = await SocialLink.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = fallbackSocialLinks.findIndex((s) => s._id === id);
      if (idx !== -1) {
        deleted = fallbackSocialLinks.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Social link not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('SOCIAL_LINK_DELETED', 'SocialLink', { id, platform: deleted.platform }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Social link deleted.', id });
  } catch (err) {
    next(err);
  }
};

const reorderSocialLinks = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return sendError(res, 'Invalid items array.', 'VALIDATION_ERROR', 400);
    }

    try {
      if (SocialLink.db && SocialLink.db.readyState === 1) {
        const bulkOps = items.map((item, idx) => {
          const id = typeof item === 'object' ? (item._id || item.id) : item;
          const order = typeof item === 'object' && item.order !== undefined ? item.order : idx + 1;
          return {
            updateOne: {
              filter: { _id: id },
              update: { $set: { order } },
            },
          };
        });
        await SocialLink.bulkWrite(bulkOps);
      }
    } catch (dbErr) {}

    items.forEach((item, idx) => {
      const id = typeof item === 'object' ? (item._id || item.id) : item;
      const order = typeof item === 'object' && item.order !== undefined ? item.order : idx + 1;
      const found = fallbackSocialLinks.find((s) => s._id === id);
      if (found) found.order = order;
    });
    fallbackSocialLinks.sort((a, b) => a.order - b.order);

    try {
      await logActivity('SOCIAL_LINK_REORDERED', 'SocialLink', { count: items.length }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Social links reordered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicSocialLinks,
  getAdminSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
  // legacy aliases
  getAll: getPublicSocialLinks,
  create: createSocialLink,
  update: updateSocialLink,
  remove: deleteSocialLink,
};
