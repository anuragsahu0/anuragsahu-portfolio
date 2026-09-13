const Experience = require('../models/Experience');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const FALLBACK_EXPERIENCES = [
  {
    _id: 'exp-1',
    organization: 'Maharana Pratap Institute of Professional Studies',
    role: 'Lead Student Technical Coordinator (AI & Web)',
    description: 'Leading student technical chapter, organizing collegiate hackathons, coordinating full-stack workshops, and architecting internal tools.',
    technologies: ['React', 'Node.js', 'FastAPI', 'Git', 'MongoDB'],
    achievements: [
      'Organized multi-college hackathons and technical symposiums for 200+ students.',
      'Conducted hands-on sessions on modern web development and Git workflows.',
    ],
    startDate: 'Aug 2024',
    endDate: 'Present',
    isCurrent: true,
    displayOrder: 1,
    isVisible: true,
  },
];

const getPublicExperience = async (req, res, next) => {
  try {
    let experiences = [];
    try {
      if (Experience.db && Experience.db.readyState === 1) {
        experiences = await Experience.find({ isVisible: true }).sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!experiences || experiences.length === 0) {
      experiences = FALLBACK_EXPERIENCES.filter((e) => e.isVisible);
    }

    return sendSuccess(res, { count: experiences.length, experiences });
  } catch (err) {
    next(err);
  }
};

const getAdminExperience = async (req, res, next) => {
  try {
    let experiences = [];
    try {
      if (Experience.db && Experience.db.readyState === 1) {
        experiences = await Experience.find().sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!experiences || experiences.length === 0) {
      experiences = FALLBACK_EXPERIENCES;
    }

    return sendSuccess(res, { count: experiences.length, experiences });
  } catch (err) {
    next(err);
  }
};

const createExperience = async (req, res, next) => {
  try {
    const { organization, role, description, startDate } = req.body;
    if (!organization || !role || !description || !startDate) {
      return sendError(res, 'Organization, role, description, and startDate are required.', 'VALIDATION_ERROR', 422);
    }

    let exp = null;
    try {
      if (Experience.db && Experience.db.readyState === 1) {
        exp = await Experience.create(req.body);
      }
    } catch (dbErr) {}

    if (!exp) {
      exp = { _id: `exp-${Date.now()}`, ...req.body, createdAt: new Date() };
      FALLBACK_EXPERIENCES.push(exp);
    }

    try {
      await logActivity('EXPERIENCE_CREATED', 'Experience', { organization: exp.organization, role: exp.role }, req);
    } catch (e) {}

    return sendSuccess(res, exp, 201);
  } catch (err) {
    next(err);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    let exp = null;

    try {
      if (Experience.db && Experience.db.readyState === 1) {
        exp = await Experience.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!exp) {
      const idx = FALLBACK_EXPERIENCES.findIndex((e) => e._id === id);
      if (idx !== -1) {
        FALLBACK_EXPERIENCES[idx] = { ...FALLBACK_EXPERIENCES[idx], ...req.body, updatedAt: new Date() };
        exp = FALLBACK_EXPERIENCES[idx];
      }
    }

    if (!exp) {
      return sendError(res, 'Experience record not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('EXPERIENCE_UPDATED', 'Experience', { id, organization: exp.organization }, req);
    } catch (e) {}

    return sendSuccess(res, exp);
  } catch (err) {
    next(err);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Experience.db && Experience.db.readyState === 1) {
        deleted = await Experience.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_EXPERIENCES.findIndex((e) => e._id === id);
      if (idx !== -1) {
        deleted = FALLBACK_EXPERIENCES.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Experience record not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('EXPERIENCE_DELETED', 'Experience', { id }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Experience record deleted.', id });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/experience/reorder
 */
const reorderExperience = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return sendError(res, 'Invalid items array.', 'VALIDATION_ERROR', 400);
    }

    try {
      if (Experience.db && Experience.db.readyState === 1) {
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
        await Experience.bulkWrite(bulkOps);
      }
    } catch (dbErr) {}

    items.forEach((item, idx) => {
      const id = typeof item === 'object' ? (item._id || item.id) : item;
      const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
      const found = FALLBACK_EXPERIENCES.find((e) => e._id === id);
      if (found) found.displayOrder = order;
    });
    FALLBACK_EXPERIENCES.sort((a, b) => a.displayOrder - b.displayOrder);

    try {
      await logActivity('EXPERIENCE_REORDERED', 'Experience', { count: items.length }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Experience records reordered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicExperience,
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
  FALLBACK_EXPERIENCES,
};
