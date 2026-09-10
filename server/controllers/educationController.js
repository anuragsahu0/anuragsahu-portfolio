const Education = require('../models/Education');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const FALLBACK_EDUCATION = [
  {
    _id: 'edu-1',
    institution: 'Maharana Pratap Institute of Professional Studies',
    degree: 'B.Tech in Computer Science & Engineering (AI & ML)',
    specialization: 'Artificial Intelligence & Machine Learning',
    startYear: '2024',
    endYear: '2028',
    cgpa: '9.2 / 10.0',
    description: 'Specializing in core computer science, deep learning foundations, and full-stack software architecture.',
    relevantCoursework: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (C++)',
      'Database Management Systems',
      'Operating Systems',
      'Artificial Intelligence & Machine Learning',
    ],
    highlights: [
      'Ranked top 5% in academic coursework',
      'Lead Student Coordinator for Tech & AI Student Chapter',
      'Organized collegiate hackathons and coding symposiums',
    ],
    displayOrder: 1,
    isVisible: true,
  },
  {
    _id: 'edu-2',
    institution: 'Higher Secondary Education (CBSE / State Board)',
    degree: 'Senior Secondary Schooling (Class XII - PCM)',
    specialization: 'Physics, Chemistry, Mathematics & Computer Science',
    startYear: '2022',
    endYear: '2024',
    cgpa: '90%+',
    description: 'Completed secondary education with distinction in Mathematics and Computer Science (Python).',
    relevantCoursework: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science (Python)'],
    highlights: [
      'Scored 90%+ in Mathematics & Computer Science',
      'Developed foundational Python automation programs in high school',
    ],
    displayOrder: 2,
    isVisible: true,
  },
];

const getPublicEducation = async (req, res, next) => {
  try {
    let records = [];
    try {
      if (Education.db && Education.db.readyState === 1) {
        records = await Education.find({ isVisible: true }).sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!records || records.length === 0) {
      records = FALLBACK_EDUCATION.filter((e) => e.isVisible);
    }

    return sendSuccess(res, { count: records.length, education: records });
  } catch (err) {
    next(err);
  }
};

const getAdminEducation = async (req, res, next) => {
  try {
    let records = [];
    try {
      if (Education.db && Education.db.readyState === 1) {
        records = await Education.find().sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!records || records.length === 0) {
      records = FALLBACK_EDUCATION;
    }

    return sendSuccess(res, { count: records.length, education: records });
  } catch (err) {
    next(err);
  }
};

const createEducation = async (req, res, next) => {
  try {
    const { institution, degree } = req.body;
    if (!institution || !degree) {
      return sendError(res, 'Institution and degree are required.', 'VALIDATION_ERROR', 422);
    }

    let record = null;
    try {
      if (Education.db && Education.db.readyState === 1) {
        record = await Education.create(req.body);
      }
    } catch (dbErr) {}

    if (!record) {
      record = { _id: `edu-${Date.now()}`, ...req.body, createdAt: new Date() };
      FALLBACK_EDUCATION.push(record);
    }

    try {
      await logActivity('EDUCATION_CREATED', 'Education', { institution: record.institution, degree: record.degree }, req);
    } catch (e) {}

    return sendSuccess(res, record, 201);
  } catch (err) {
    next(err);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    let record = null;

    try {
      if (Education.db && Education.db.readyState === 1) {
        record = await Education.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!record) {
      const idx = FALLBACK_EDUCATION.findIndex((e) => e._id === id);
      if (idx !== -1) {
        FALLBACK_EDUCATION[idx] = { ...FALLBACK_EDUCATION[idx], ...req.body, updatedAt: new Date() };
        record = FALLBACK_EDUCATION[idx];
      }
    }

    if (!record) {
      return sendError(res, 'Education record not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('EDUCATION_UPDATED', 'Education', { id, institution: record.institution }, req);
    } catch (e) {}

    return sendSuccess(res, record);
  } catch (err) {
    next(err);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Education.db && Education.db.readyState === 1) {
        deleted = await Education.findByIdAndDelete(id);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_EDUCATION.findIndex((e) => e._id === id);
      if (idx !== -1) {
        deleted = FALLBACK_EDUCATION.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Education record not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('EDUCATION_DELETED', 'Education', { id }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Education record deleted.', id });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/education/reorder
 */
const reorderEducation = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return sendError(res, 'Invalid items array.', 'VALIDATION_ERROR', 400);
    }

    try {
      if (Education.db && Education.db.readyState === 1) {
        const bulkOps = items.map((item, idx) => {
          const id = typeof item === 'object' ? (item._id || item.id) : item;
          const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
          const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
          return {
            updateOne: {
              filter,
              update: { $set: { displayOrder: order, order } },
            },
          };
        });
        await Education.bulkWrite(bulkOps);
      }
    } catch (dbErr) {}

    items.forEach((item, idx) => {
      const id = typeof item === 'object' ? (item._id || item.id) : item;
      const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
      const found = FALLBACK_EDUCATION.find((e) => e._id === id || e.id === id);
      if (found) {
        found.displayOrder = order;
        found.order = order;
      }
    });
    FALLBACK_EDUCATION.sort((a, b) => (a.displayOrder || a.order) - (b.displayOrder || b.order));

    try {
      await logActivity('EDUCATION_REORDERED', 'Education', { count: items.length }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Education records reordered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicEducation,
  getAdminEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation,
  // legacy alias
  getAll: getAdminEducation,
  create: createEducation,
  update: updateEducation,
  remove: deleteEducation,
};
