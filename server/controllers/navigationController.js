const Navigation = require('../models/Navigation');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const DEFAULT_NAVIGATION = [
  { _id: 'nav-1', label: 'About', target: '#about', url: '#about', displayOrder: 1, isEnabled: true },
  { _id: 'nav-2', label: 'Projects', target: '#projects', url: '#projects', displayOrder: 2, isEnabled: true },
  { _id: 'nav-3', label: 'Skills', target: '#skills', url: '#skills', displayOrder: 3, isEnabled: true },
  { _id: 'nav-4', label: 'Experience', target: '#experience', url: '#experience', displayOrder: 4, isEnabled: true },
  { _id: 'nav-5', label: 'Education', target: '#education', url: '#education', displayOrder: 5, isEnabled: true },
  { _id: 'nav-6', label: 'Roadmap', target: '#roadmap', url: '#roadmap', displayOrder: 6, isEnabled: true },
  { _id: 'nav-7', label: 'Contact', target: '#contact', url: '#contact', displayOrder: 7, isEnabled: true },
];

let fallbackNavigation = [...DEFAULT_NAVIGATION];

const getPublicNavigation = async (req, res, next) => {
  try {
    let items = [];
    try {
      if (Navigation.db && Navigation.db.readyState === 1) {
        items = await Navigation.find({ isEnabled: true }).sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!items || items.length === 0) {
      items = fallbackNavigation.filter((n) => n.isEnabled);
    }

    return sendSuccess(res, { count: items.length, navigation: items });
  } catch (err) {
    next(err);
  }
};

const getAdminNavigation = async (req, res, next) => {
  try {
    let items = [];
    try {
      if (Navigation.db && Navigation.db.readyState === 1) {
        items = await Navigation.find().sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!items || items.length === 0) {
      items = fallbackNavigation;
    }

    return sendSuccess(res, { count: items.length, navigation: items });
  } catch (err) {
    next(err);
  }
};

const createNavigation = async (req, res, next) => {
  try {
    const { label, target, url, displayOrder, isEnabled } = req.body;
    if (!label || !target) {
      return sendError(res, 'Label and target are required.', 'VALIDATION_ERROR', 422);
    }

    let item = null;
    try {
      if (Navigation.db && Navigation.db.readyState === 1) {
        item = await Navigation.create({
          label: label.trim(),
          target: target.trim(),
          url: url ? url.trim() : target.trim(),
          displayOrder: displayOrder !== undefined ? displayOrder : 0,
          isEnabled: isEnabled !== undefined ? isEnabled : true,
        });
      }
    } catch (dbErr) {}

    if (!item) {
      item = {
        _id: `nav-${Date.now()}`,
        label: label.trim(),
        target: target.trim(),
        url: url ? url.trim() : target.trim(),
        displayOrder: displayOrder !== undefined ? displayOrder : fallbackNavigation.length + 1,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
      };
      fallbackNavigation.push(item);
    }

    try {
      await logActivity('NAV_CREATED', 'Navigation', { label: item.label, target: item.target }, req);
    } catch (e) {}

    return sendSuccess(res, item, 201);
  } catch (err) {
    next(err);
  }
};

const updateNavigation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    let item = null;

    try {
      if (Navigation.db && Navigation.db.readyState === 1) {
        item = await Navigation.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!item) {
      const idx = fallbackNavigation.findIndex((n) => n._id === id);
      if (idx !== -1) {
        fallbackNavigation[idx] = { ...fallbackNavigation[idx], ...updates };
        item = fallbackNavigation[idx];
      }
    }

    if (!item) {
      return sendError(res, 'Navigation item not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('NAV_UPDATED', 'Navigation', { id, label: item.label }, req);
    } catch (e) {}

    return sendSuccess(res, item);
  } catch (err) {
    next(err);
  }
};

const deleteNavigation = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Navigation.db && Navigation.db.readyState === 1) {
        deleted = await Navigation.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = fallbackNavigation.findIndex((n) => n._id === id);
      if (idx !== -1) {
        deleted = fallbackNavigation.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Navigation item not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('NAV_DELETED', 'Navigation', { id, label: deleted.label }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Navigation item deleted.', id });
  } catch (err) {
    next(err);
  }
};

const reorderNavigation = async (req, res, next) => {
  try {
    const { items } = req.body; // array of { id, displayOrder } or array of IDs
    if (!Array.isArray(items)) {
      return sendError(res, 'Invalid items array.', 'VALIDATION_ERROR', 400);
    }

    try {
      if (Navigation.db && Navigation.db.readyState === 1) {
        const bulkOps = items.map((item, idx) => {
          const id = typeof item === 'object' ? (item._id || item.id) : item;
          const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
          return {
            updateOne: {
              filter: { _id: id },
              update: { $set: { displayOrder: order } },
            },
          };
        });
        await Navigation.bulkWrite(bulkOps);
      }
    } catch (dbErr) {}

    items.forEach((item, idx) => {
      const id = typeof item === 'object' ? (item._id || item.id) : item;
      const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
      const found = fallbackNavigation.find((n) => n._id === id);
      if (found) found.displayOrder = order;
    });
    fallbackNavigation.sort((a, b) => a.displayOrder - b.displayOrder);

    try {
      await logActivity('NAV_REORDERED', 'Navigation', { count: items.length }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Navigation reordered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicNavigation,
  getAdminNavigation,
  createNavigation,
  updateNavigation,
  deleteNavigation,
  reorderNavigation,
};
