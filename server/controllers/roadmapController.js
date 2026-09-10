const Roadmap = require('../models/Roadmap');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const FALLBACK_ROADMAP = [
  {
    _id: 'rd-1',
    id: 'portfolio',
    title: 'Personal Portfolio & Control Center',
    number: '01',
    name: 'Portfolio',
    subtitle: 'Production-ready personal platform & developer telemetry dashboard.',
    status: 'WORKING',
    statusVariant: 'cyan',
    statusSymbol: '🟢',
    progress: 85,
    progressLabel: 'Working • 85% Completed',
    lastUpdated: 'Updated Q1 2026',
    description: 'Building a premium production-ready portfolio with React 18, Node.js, Express backend API, modern glassmorphism design system, and recruiter-focused fast-track telemetry.',
    currentFocus: [
      'Nodemailer Contact Form Integration',
      'Telemetry Admin Dashboard & Real-Time Analytics',
      'Vercel & Docker Multi-Platform Public Deployment',
    ],
    plannedModules: [
      'Interactive WebGL Anti-Gravity Particle Canvas',
      'Centralized Candidate Data Store (Anurag Sahu)',
      'Product-Grade Case Study Modals & Metrics',
    ],
    technologies: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
    category: 'Full-Stack Web & Telemetry',
    displayOrder: 1,
    isVisible: true,
  },
  {
    _id: 'rd-2',
    id: 'meoww-racing-game',
    title: 'Meoww Racing Game',
    number: '02',
    name: 'Meoww Racing Game',
    subtitle: 'Interactive 2D/3D arcade cat racing game with HTML5 Canvas physics engine.',
    status: 'COMING_SOON',
    statusVariant: 'amber',
    statusSymbol: '🟡',
    progress: 15,
    progressLabel: 'Planning • 15% Completed',
    lastUpdated: 'Planned Q2 2026',
    description: 'An action-packed arcade racing game featuring feline racers, nitro boosters, dynamic obstacle courses, and high score leaderboards.',
    currentFocus: [
      'Database Schema Design & ERD Modeling',
      'Physics Engine Collision Detection & Vector Math',
      'Custom Sprite Sheet Animation Pipeline',
    ],
    plannedModules: [
      'Canvas 2D Physics Loop with Variable Delta Timing',
      'Audio Synthesizer for Engine Sound FX',
      'Local Storage & Cloud Leaderboard Sync',
    ],
    technologies: ['HTML5 Canvas', 'JavaScript ES6+', 'WebGL', 'Tailwind CSS'],
    category: 'Game Engineering & Simulation',
    displayOrder: 2,
    isVisible: true,
  },
  {
    _id: 'rd-3',
    id: 'ai-finance-platform',
    title: 'Autonomous Financial Reconciliation Engine',
    number: '03',
    name: 'AI Finance Controller',
    subtitle: 'High-throughput deterministic reconciliation engine with GST/VAT matching.',
    status: 'PLANNING',
    statusVariant: 'purple',
    statusSymbol: '🟣',
    progress: 30,
    progressLabel: 'Architecture Phase • 30%',
    lastUpdated: 'Q2 2026',
    description: 'Autonomous financial reconciliation system handling multi-source transaction feeds, rule-based settlement engines, and anomaly detection.',
    currentFocus: [
      'Deterministic Matching Pipeline',
      'Four-Eyes Authorization Enforcement',
      'Anomaly Flagging Algorithm',
    ],
    plannedModules: [
      'FastAPI Microservice with Asynchronous Processing',
      'Multi-Format Bank Statement Ingestion',
      'Audit Trail Verification & PII Protection',
    ],
    technologies: ['FastAPI', 'Python', 'PostgreSQL', 'Docker', 'Redis'],
    category: 'Fintech & Autonomous AI',
    displayOrder: 3,
    isVisible: true,
  },
];

const getPublicRoadmap = async (req, res, next) => {
  try {
    let roadmap = [];
    try {
      if (Roadmap.db && Roadmap.db.readyState === 1) {
        roadmap = await Roadmap.find({ isVisible: true }).sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!roadmap || roadmap.length === 0) {
      roadmap = FALLBACK_ROADMAP.filter((r) => r.isVisible);
    }

    return sendSuccess(res, { count: roadmap.length, roadmap });
  } catch (err) {
    next(err);
  }
};

const getAdminRoadmap = async (req, res, next) => {
  try {
    let roadmap = [];
    try {
      if (Roadmap.db && Roadmap.db.readyState === 1) {
        roadmap = await Roadmap.find().sort({ displayOrder: 1 }).lean();
      }
    } catch (dbErr) {}

    if (!roadmap || roadmap.length === 0) {
      roadmap = FALLBACK_ROADMAP;
    }

    return sendSuccess(res, { count: roadmap.length, roadmap });
  } catch (err) {
    next(err);
  }
};

const getRoadmapById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    try {
      if (Roadmap.db && Roadmap.db.readyState === 1) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          item = await Roadmap.findById(id);
        } else {
          item = await Roadmap.findOne({ $or: [{ id }, { number: id }] });
        }
      }
    } catch (dbErr) {}

    if (!item) {
      item = FALLBACK_ROADMAP.find((r) => r._id === id || r.id === id || r.number === id);
    }

    if (!item) {
      return sendError(res, 'Roadmap project not found.', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, item);
  } catch (err) {
    next(err);
  }
};

const createRoadmap = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return sendError(res, 'Title and description are required.', 'VALIDATION_ERROR', 422);
    }

    let item = null;
    try {
      if (Roadmap.db && Roadmap.db.readyState === 1) {
        item = await Roadmap.create(req.body);
      }
    } catch (dbErr) {}

    if (!item) {
      item = {
        _id: `rd-${Date.now()}`,
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        ...req.body,
        createdAt: new Date(),
      };
      FALLBACK_ROADMAP.push(item);
    }

    try {
      await logActivity('ROADMAP_CREATED', 'Roadmap', { title: item.title, status: item.status }, req);
    } catch (e) {}

    return sendSuccess(res, item, 201);
  } catch (err) {
    next(err);
  }
};

const updateRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params;
    let item = null;

    try {
      if (Roadmap.db && Roadmap.db.readyState === 1) {
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
        item = await Roadmap.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!item) {
      const idx = FALLBACK_ROADMAP.findIndex((r) => r._id === id || r.id === id);
      if (idx !== -1) {
        FALLBACK_ROADMAP[idx] = { ...FALLBACK_ROADMAP[idx], ...req.body, updatedAt: new Date() };
        item = FALLBACK_ROADMAP[idx];
      }
    }

    if (!item) {
      return sendError(res, 'Roadmap project not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('ROADMAP_UPDATED', 'Roadmap', { id, title: item.title }, req);
    } catch (e) {}

    return sendSuccess(res, item);
  } catch (err) {
    next(err);
  }
};

const deleteRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Roadmap.db && Roadmap.db.readyState === 1) {
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
        deleted = await Roadmap.findOneAndDelete(query);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_ROADMAP.findIndex((r) => r._id === id || r.id === id);
      if (idx !== -1) {
        deleted = FALLBACK_ROADMAP.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Roadmap project not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('ROADMAP_DELETED', 'Roadmap', { id }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Roadmap project deleted.', id });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicRoadmap,
  getAdminRoadmap,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  // legacy alias
  getAll: getAdminRoadmap,
  getOne: getRoadmapById,
  create: createRoadmap,
  update: updateRoadmap,
  remove: deleteRoadmap,
};
