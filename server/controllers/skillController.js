const Skill = require('../models/Skill');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const FALLBACK_SKILLS = [
  { _id: 'sk-1', name: 'React.js 18', category: 'Frontend', proficiency: 92, icon: 'Atom', description: 'Used in personal portfolio, interactive sandboxes, and modern component systems.', displayOrder: 1, isVisible: true },
  { _id: 'sk-2', name: 'Tailwind CSS', category: 'Frontend', proficiency: 95, icon: 'Palette', description: 'Obsidian glassmorphism design tokens, micro-interactions, and mobile viewports.', displayOrder: 2, isVisible: true },
  { _id: 'sk-3', name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 90, icon: 'Code2', description: 'Async/await event loops, closures, DOM manipulation, and modern web standards.', displayOrder: 3, isVisible: true },
  { _id: 'sk-4', name: 'Node.js', category: 'Backend', proficiency: 86, icon: 'Server', description: 'Event-driven web servers, REST API gateways, and asynchronous pipelines.', displayOrder: 4, isVisible: true },
  { _id: 'sk-5', name: 'Express.js', category: 'Backend', proficiency: 88, icon: 'Cpu', description: 'Custom middlewares, rate limiting, JWT authentication, and structured error handling.', displayOrder: 5, isVisible: true },
  { _id: 'sk-6', name: 'FastAPI', category: 'Backend', proficiency: 82, icon: 'Zap', description: 'High-performance asynchronous Python REST APIs and model inference endpoints.', displayOrder: 6, isVisible: true },
  { _id: 'sk-7', name: 'PyTorch', category: 'AI/ML', proficiency: 80, icon: 'Bot', description: 'Graph neural networks, tensor operations, and model loss optimization pipelines.', displayOrder: 7, isVisible: true },
  { _id: 'sk-8', name: 'Python (NumPy / SciPy)', category: 'AI/ML', proficiency: 88, icon: 'Terminal', description: 'Scientific computing, data vectorization, and machine learning pipelines.', displayOrder: 8, isVisible: true },
  { _id: 'sk-9', name: 'MongoDB / Mongoose', category: 'Database', proficiency: 85, icon: 'Database', description: 'Document schemas, aggregation pipelines, replica sets, and indexing.', displayOrder: 9, isVisible: true },
  { _id: 'sk-10', name: 'PostgreSQL', category: 'Database', proficiency: 82, icon: 'Boxes', description: 'Relational data modeling, foreign keys, ACID compliance, and SQL optimization.', displayOrder: 10, isVisible: true },
  { _id: 'sk-11', name: 'Git & GitHub', category: 'Tools', proficiency: 90, icon: 'GitBranch', description: 'Version control, atomic commits, pull requests, and CI/CD pipelines.', displayOrder: 11, isVisible: true },
  { _id: 'sk-12', name: 'Docker', category: 'Tools', proficiency: 75, icon: 'Container', description: 'Multi-stage container builds, microservices, and deployment isolation.', displayOrder: 12, isVisible: true },
  { _id: 'sk-13', name: 'Postman', category: 'Tools', proficiency: 88, icon: 'Send', description: 'Automated API testing suites, environment variables, and mock servers.', displayOrder: 13, isVisible: true },
  { _id: 'sk-14', name: 'Linux / Bash', category: 'Tools', proficiency: 80, icon: 'TerminalSquare', description: 'Shell scripting, server automation, process managers, and deployment.', displayOrder: 14, isVisible: true },
];

/**
 * GET /api/public/skills
 */
const getPublicSkills = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isVisible: true };
    if (category && category !== 'ALL') filter.category = category;

    let skills = [];
    try {
      if (Skill.db && Skill.db.readyState === 1) {
        skills = await Skill.find(filter).sort({ category: 1, displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!skills || skills.length === 0) {
      skills = FALLBACK_SKILLS.filter(
        (s) => s.isVisible && (!category || category === 'ALL' || s.category.toLowerCase() === category.toLowerCase())
      );
    }

    return sendSuccess(res, { count: skills.length, skills });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/skills
 */
const getAdminSkills = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'ALL') filter.category = category;

    let skills = [];
    try {
      if (Skill.db && Skill.db.readyState === 1) {
        skills = await Skill.find(filter).sort({ displayOrder: 1, createdAt: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!skills || skills.length === 0) {
      skills = FALLBACK_SKILLS;
    }

    return sendSuccess(res, { count: skills.length, skills });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/skills/:id
 */
const getSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let skill = null;

    try {
      if (Skill.db && Skill.db.readyState === 1) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          skill = await Skill.findById(id);
        } else {
          skill = await Skill.findOne({ id });
        }
      }
    } catch (dbErr) {}

    if (!skill) {
      skill = FALLBACK_SKILLS.find((s) => s._id === id || s.id === id);
    }

    if (!skill) {
      return sendError(res, 'Skill not found.', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, skill);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/skills
 */
const createSkill = async (req, res, next) => {
  try {
    const { name, category } = req.body;
    if (!name || !name.trim()) {
      return sendError(res, 'Skill name is required.', 'VALIDATION_ERROR', 422);
    }
    if (!category || !category.trim()) {
      return sendError(res, 'Skill category is required.', 'VALIDATION_ERROR', 422);
    }

    let skill = null;
    try {
      if (Skill.db && Skill.db.readyState === 1) {
        skill = await Skill.create(req.body);
      }
    } catch (dbErr) {}

    if (!skill) {
      skill = {
        _id: `sk-${Date.now()}`,
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...req.body,
        createdAt: new Date(),
      };
      FALLBACK_SKILLS.push(skill);
    }

    try {
      await logActivity('SKILL_CREATED', 'Skill', { name: skill.name, category: skill.category }, req);
    } catch (e) {}

    return sendSuccess(res, skill, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT/PATCH /api/admin/skills/:id
 */
const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    let skill = null;

    try {
      if (Skill.db && Skill.db.readyState === 1) {
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
        skill = await Skill.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!skill) {
      const idx = FALLBACK_SKILLS.findIndex((s) => s._id === id || s.id === id);
      if (idx !== -1) {
        FALLBACK_SKILLS[idx] = { ...FALLBACK_SKILLS[idx], ...req.body, updatedAt: new Date() };
        skill = FALLBACK_SKILLS[idx];
      }
    }

    if (!skill) {
      return sendError(res, 'Skill not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('SKILL_UPDATED', 'Skill', { id, name: skill.name }, req);
    } catch (e) {}

    return sendSuccess(res, skill);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/skills/:id
 */
const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Skill.db && Skill.db.readyState === 1) {
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
        deleted = await Skill.findOneAndDelete(query);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_SKILLS.findIndex((s) => s._id === id || s.id === id);
      if (idx !== -1) {
        deleted = FALLBACK_SKILLS.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Skill not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('SKILL_DELETED', 'Skill', { id, name: deleted.name }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Skill deleted successfully.', id });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/skills/reorder
 */
const reorderSkills = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return sendError(res, 'Invalid items array.', 'VALIDATION_ERROR', 400);
    }

    try {
      if (Skill.db && Skill.db.readyState === 1) {
        const bulkOps = items.map((item, idx) => {
          const id = typeof item === 'object' ? (item._id || item.id) : item;
          const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
          const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
          return {
            updateOne: {
              filter,
              update: { $set: { displayOrder: order } },
            },
          };
        });
        await Skill.bulkWrite(bulkOps);
      }
    } catch (dbErr) {}

    items.forEach((item, idx) => {
      const id = typeof item === 'object' ? (item._id || item.id) : item;
      const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
      const found = FALLBACK_SKILLS.find((s) => s._id === id || s.id === id);
      if (found) found.displayOrder = order;
    });
    FALLBACK_SKILLS.sort((a, b) => a.displayOrder - b.displayOrder);

    try {
      await logActivity('SKILL_REORDERED', 'Skill', { count: items.length }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Skills reordered successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicSkills,
  getAdminSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
  // legacy alias
  getAll: getAdminSkills,
  getOne: getSkillById,
  create: createSkill,
  update: updateSkill,
  remove: deleteSkill,
  FALLBACK_SKILLS,
};
