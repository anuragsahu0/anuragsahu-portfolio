const Project = require('../models/Project');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { isSafeUrl, sanitizeHtmlContent } = require('../utils/security');

// In-memory fallback if DB is offline
const FALLBACK_PROJECTS = [
  {
    _id: 'proj-1',
    id: 'ai-finance-controller',
    slug: 'ai-finance-controller',
    title: 'AI Finance Controller',
    subtitle: 'Autonomous Financial Operations, Multi-Way Reconciliation & Audit Platform.',
    shortDescription: 'Autonomous enterprise financial operations platform with multi-source ingestion, reconciliation, tax intelligence & Finance Copilot.',
    description: 'Autonomous enterprise financial operations platform featuring multi-source data ingestion, deterministic multi-way reconciliation engine, GST/VAT tax intelligence, statistical anomaly detection 2.0 (+178% surge detection), controlled settlement automation with Four-Eyes authorization, and Finance Copilot.',
    category: 'enterprise',
    categoryLabel: 'Autonomous AI & Fintech',
    badge: 'FLAGSHIP AI FINTECH',
    tagline: 'Autonomous enterprise financial operations platform with multi-source ingestion, reconciliation, tax intelligence & Finance Copilot.',
    status: 'COMPLETED',
    progress: 100,
    githubUrl: 'https://github.com/anuragsahu0/ai-finance-controller',
    liveUrl: 'https://anuragsahu.com/AI-FINANCE-CONTROLLER',
    thumbnail: '/assets/project-portfolio.webp',
    gallery: [],
    technologies: ['Next.js 14', 'FastAPI', 'Python', 'PostgreSQL', 'Alembic', 'Tailwind CSS', 'Docker', 'AI Copilot'],
    featured: true,
    visibility: 'PUBLISHED',
    displayOrder: 1,
    metrics: [
      { label: 'Platform Status', value: '100%', change: '🟢 Live & Operational' },
      { label: 'Reconciliation', value: 'Multi-Way Engine', change: 'Deterministic' },
      { label: 'Tax & Anomaly', value: 'Active', change: 'GST/VAT Matching' },
      { label: 'Governance', value: 'Four-Eyes', change: 'Strict Dual Authorization' },
    ],
    techStack: ['Next.js 14', 'FastAPI', 'Python', 'PostgreSQL', 'Alembic', 'Tailwind CSS', 'Docker'],
    recruiterHighlights: [
      'Built multi-way deterministic reconciliation pipeline comparing real bank statements, ledger entries, and payment feeds.',
      'Implemented automated GST/VAT tax matching and statistical anomaly detection flagging volume surges with UNUSUAL tag.',
      'Designed controlled settlement engine enforcing Four-Eyes principle preventing self-approval of payouts.',
      'Integrated Finance Copilot with specialized logical agents citing verified database records and PII masking.',
    ],
    architecture: {
      frontend: 'Next.js 14 App Router with Tailwind CSS, Lucide icons, and responsive executive finance consoles.',
      backend: 'FastAPI Python asynchronous service with SQLAlchemy ORM, Alembic migrations, and security middlewares.',
    },
    timeline: [
      { phase: 'Phase 1-4: Foundation & Ingestion', detail: 'Multi-source CSV/Excel parsing & schemas.' },
      { phase: 'Phase 5: Reconciliation Engine', detail: 'Deterministic multi-way matching & scores.' },
      { phase: 'Phase 6-8: Tax, Risk & Settlement', detail: 'Four-Eyes approval & tax discrepancy engine.' },
      { phase: 'Phase 9-10: Monitoring & Intelligence', detail: 'Event bus, 7-day cash flow forecast & Copilot.' },
    ],
  },
  {
    _id: 'proj-2',
    id: 'restaurant-management-system',
    slug: 'restaurant-management-system',
    title: 'Restaurant Management System',
    subtitle: 'Multi-tenant POS, kitchen order display, and automated billing engine.',
    shortDescription: 'Multi-tenant restaurant operations platform with live WebSocket KDS.',
    description: 'A complete multi-tenant restaurant management platform with authentication, real-time kitchen order display (KDS), inventory control, billing, and analytics.',
    category: 'enterprise',
    categoryLabel: 'Enterprise System',
    badge: 'COMING SOON',
    tagline: 'Multi-tenant restaurant operations platform with live WebSocket KDS.',
    status: 'COMING_SOON',
    progress: 15,
    githubUrl: 'https://github.com/anuragsahu0/restaurant-management-system',
    liveUrl: '#',
    thumbnail: '/assets/project-portfolio.webp',
    gallery: [],
    technologies: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS', 'JWT'],
    featured: false,
    visibility: 'PUBLISHED',
    displayOrder: 2,
    metrics: [
      { label: 'Phase', value: '15%', change: 'Coming Soon' },
      { label: 'Auth', value: 'RBAC', change: 'JWT + Multi-Tenant' },
      { label: 'Real-Time', value: 'WebSockets', change: 'KDS Display' },
      { label: 'DB', value: 'PostgreSQL', change: 'Relational + Redis' },
    ],
    techStack: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets'],
    recruiterHighlights: [
      'Designed PostgreSQL ERD schema for multi-tenant restaurant inventory.',
      'Specified real-time WebSocket KDS architecture.',
      'Planned JWT RBAC separating Admin, Chef, Cashier, Waiter roles.',
    ],
    architecture: {
      frontend: 'React SPA with glassmorphism POS interface and live KDS.',
      backend: 'Node.js + Express REST & WebSocket server with PostgreSQL + Redis.',
    },
    timeline: [
      { phase: 'Phase 1: ERD Schema', detail: 'PostgreSQL relational modeling.' },
      { phase: 'Phase 2: Auth + RBAC', detail: 'JWT + role-based middleware.' },
      { phase: 'Phase 3: POS + KDS', detail: 'WebSocket order pipeline.' },
      { phase: 'Phase 4: Billing', detail: 'Invoice generation + analytics.' },
    ],
  },
  {
    _id: 'proj-3',
    id: 'portfolio',
    slug: 'portfolio',
    title: 'Portfolio',
    subtitle: 'Production-ready personal platform & developer telemetry dashboard.',
    shortDescription: 'Production-ready personal platform built with React, Express, MongoDB, and telemetry dashboard.',
    description: 'A full-stack personal platform built with modern architecture, REST APIs, MongoDB Mongoose models, and an administrative control center.',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web & Telemetry',
    badge: 'FLAGSHIP PROJECT',
    tagline: 'Building a premium production-ready portfolio with React 18, Node.js, Express backend API, modern glassmorphism design system.',
    status: 'WORKING',
    progress: 95,
    githubUrl: 'https://github.com/anuragsahu0/portfolio',
    liveUrl: 'https://anuragsahu.com',
    thumbnail: '/assets/project-portfolio.webp',
    gallery: [],
    technologies: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
    featured: true,
    visibility: 'PUBLISHED',
    displayOrder: 3,
    metrics: [
      { label: 'Completion', value: '95%', change: 'Working' },
      { label: 'Backend', value: 'Express.js', change: 'Node.js + REST' },
      { label: 'Database', value: 'MongoDB', change: 'Mongoose' },
      { label: 'Security', value: 'JWT + CSP', change: 'Production' },
    ],
    techStack: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
    recruiterHighlights: [
      'Engineered secure Control Center with JWT Bearer authentication.',
      'Designed glassmorphism design system with responsive obsidian theme.',
      'Constructed RESTful API endpoints for content and telemetry.',
    ],
    architecture: {
      frontend: 'React 18 + Vite with Tailwind CSS and Framer Motion.',
      backend: 'Node.js + Express.js API with CORS, helmet, and rate limiting.',
    },
    timeline: [
      { phase: 'Phase 1: Design System', detail: 'Glassmorphism design tokens.' },
      { phase: 'Phase 2: Full-Stack API', detail: 'Contact form + REST endpoints.' },
      { phase: 'Phase 3: Admin Panel', detail: 'JWT auth + real telemetry.' },
      { phase: 'Phase 4: Deployment', detail: 'Vercel, Docker & CI/CD.' },
    ],
  },
];

/**
 * GET /api/public/projects
 * Returns only PUBLISHED projects sorted by displayOrder
 */
const getPublicProjects = async (req, res, next) => {
  try {
    let projects = [];
    try {
      if (Project.db && Project.db.readyState === 1) {
        projects = await Project.find({ visibility: 'PUBLISHED' })
          .sort({ displayOrder: 1, createdAt: -1 })
          .lean();
      }
    } catch (dbErr) {}

    if (!projects || projects.length === 0) {
      projects = FALLBACK_PROJECTS.filter((p) => p.visibility === 'PUBLISHED');
    }

    return sendSuccess(res, { count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/public/projects/:slug
 */
const getPublicProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let project = null;

    try {
      if (Project.db && Project.db.readyState === 1) {
        project = await Project.findOne({
          $or: [{ slug }, { id: slug }],
          visibility: 'PUBLISHED',
        }).lean();
      }
    } catch (dbErr) {}

    if (!project) {
      project = FALLBACK_PROJECTS.find(
        (p) => (p.slug === slug || p.id === slug) && p.visibility === 'PUBLISHED'
      );
    }

    if (!project) {
      return sendError(res, 'Project not found.', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/projects
 * Paginated, filtered list for Admin Control Center
 */
const getAdminProjects = async (req, res, next) => {
  try {
    const { status, visibility, category, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== 'ALL') filter.status = status;
    if (visibility && visibility !== 'ALL') filter.visibility = visibility;
    if (category && category !== 'ALL') filter.category = category;

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { slug: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    let projects = [];
    let total = 0;

    try {
      if (Project.db && Project.db.readyState === 1) {
        const skip = (Number(page) - 1) * Number(limit);
        [projects, total] = await Promise.all([
          Project.find(filter)
            .sort({ displayOrder: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
          Project.countDocuments(filter),
        ]);
      }
    } catch (dbErr) {}

    if (!projects || projects.length === 0) {
      projects = FALLBACK_PROJECTS;
      total = projects.length;
    }

    return sendSuccess(res, {
      total,
      page: Number(page),
      limit: Number(limit),
      projects,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/projects/:id
 */
const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let project = null;

    try {
      if (Project.db && Project.db.readyState === 1) {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          project = await Project.findById(id);
        } else {
          project = await Project.findOne({ $or: [{ slug: id }, { id }] });
        }
      }
    } catch (dbErr) {}

    if (!project) {
      project = FALLBACK_PROJECTS.find((p) => p._id === id || p.slug === id || p.id === id);
    }

    if (!project) {
      return sendError(res, 'Project not found.', 'NOT_FOUND', 404);
    }

    return sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/projects
 */
const createProject = async (req, res, next) => {
  try {
    const { title, slug, description } = req.body;

    if (!title || !title.trim()) {
      return sendError(res, 'Project title is required.', 'VALIDATION_ERROR', 422);
    }
    if (!description || !description.trim()) {
      return sendError(res, 'Project description is required.', 'VALIDATION_ERROR', 422);
    }

    const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // Validate URLs and sanitize text
    if (req.body.githubUrl && !isSafeUrl(req.body.githubUrl)) {
      return sendError(res, 'Invalid or unsafe GitHub URL.', 'INVALID_URL', 422);
    }
    if (req.body.liveUrl && !isSafeUrl(req.body.liveUrl)) {
      return sendError(res, 'Invalid or unsafe Live/Demo URL.', 'INVALID_URL', 422);
    }
    if (req.body.thumbnail && !isSafeUrl(req.body.thumbnail)) {
      return sendError(res, 'Invalid or unsafe thumbnail URL.', 'INVALID_URL', 422);
    }
    const safePayload = {
      ...req.body,
      description: sanitizeHtmlContent(description),
      shortDescription: sanitizeHtmlContent(req.body.shortDescription || ''),
      slug: cleanSlug,
      id: cleanSlug,
    };

    try {
      if (Project.db && Project.db.readyState === 1) {
        const existing = await Project.findOne({ slug: cleanSlug });
        if (existing) {
          return sendError(res, `A project with slug "${cleanSlug}" already exists.`, 'DUPLICATE_SLUG', 409);
        }

        const project = await Project.create(safePayload);

        try {
          await logActivity('PROJECT_CREATED', 'Project', { title: project.title, slug: project.slug }, req);
        } catch (e) {}

        return sendSuccess(res, project, 201);
      }
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        return sendError(res, `A project with slug "${cleanSlug}" already exists.`, 'DUPLICATE_SLUG', 409);
      }
    }

    // In-memory duplicate check
    const existingMemory = FALLBACK_PROJECTS.find((p) => p.slug === cleanSlug || p.id === cleanSlug);
    if (existingMemory) {
      return sendError(res, `A project with slug "${cleanSlug}" already exists.`, 'DUPLICATE_SLUG', 409);
    }

    // In-memory create
    const newProject = {
      _id: `proj-${Date.now()}`,
      ...safePayload,
      createdAt: new Date(),
    };
    FALLBACK_PROJECTS.push(newProject);
    return sendSuccess(res, newProject, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT/PATCH /api/admin/projects/:id
 */
const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.githubUrl && !isSafeUrl(updates.githubUrl)) {
      return sendError(res, 'Invalid or unsafe GitHub URL.', 'INVALID_URL', 422);
    }
    if (updates.liveUrl && !isSafeUrl(updates.liveUrl)) {
      return sendError(res, 'Invalid or unsafe Live/Demo URL.', 'INVALID_URL', 422);
    }
    if (updates.thumbnail && !isSafeUrl(updates.thumbnail)) {
      return sendError(res, 'Invalid or unsafe thumbnail URL.', 'INVALID_URL', 422);
    }
    if (updates.description) updates.description = sanitizeHtmlContent(updates.description);
    if (updates.shortDescription) updates.shortDescription = sanitizeHtmlContent(updates.shortDescription);

    if (updates.slug) {
      updates.slug = updates.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      updates.id = updates.slug;
    }

    let project = null;

    try {
      if (Project.db && Project.db.readyState === 1) {
        // Verify duplicate slug if slug is changing
        if (updates.slug) {
          const existing = await Project.findOne({
            slug: updates.slug,
            _id: { $ne: id },
          });
          if (existing) {
            return sendError(res, `Slug "${updates.slug}" is already taken by another project.`, 'DUPLICATE_SLUG', 409);
          }
        }

        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { $or: [{ slug: id }, { id }] };
        project = await Project.findOneAndUpdate(query, updates, { new: true, runValidators: true });
      }
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        return sendError(res, `Slug "${updates.slug}" is already taken.`, 'DUPLICATE_SLUG', 409);
      }
    }

    if (!project) {
      const idx = FALLBACK_PROJECTS.findIndex((p) => p._id === id || p.slug === id || p.id === id);
      if (idx !== -1) {
        FALLBACK_PROJECTS[idx] = { ...FALLBACK_PROJECTS[idx], ...updates, updatedAt: new Date() };
        project = FALLBACK_PROJECTS[idx];
      }
    }

    if (!project) {
      return sendError(res, 'Project not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('PROJECT_UPDATED', 'Project', { id, title: project.title }, req);
    } catch (e) {}

    return sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/projects/:id
 */
const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = null;

    try {
      if (Project.db && Project.db.readyState === 1) {
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { $or: [{ slug: id }, { id }] };
        deleted = await Project.findOneAndDelete(query);
      }
    } catch (dbErr) {}

    if (!deleted) {
      const idx = FALLBACK_PROJECTS.findIndex((p) => p._id === id || p.slug === id || p.id === id);
      if (idx !== -1) {
        deleted = FALLBACK_PROJECTS.splice(idx, 1)[0];
      }
    }

    if (!deleted) {
      return sendError(res, 'Project not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('PROJECT_DELETED', 'Project', { id, title: deleted.title }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Project deleted successfully.', id });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/projects/reorder
 */
const reorderProjects = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return sendError(res, 'Invalid items array.', 'VALIDATION_ERROR', 400);
    }

    try {
      if (Project.db && Project.db.readyState === 1) {
        const bulkOps = items.map((item, idx) => {
          const id = typeof item === 'object' ? (item._id || item.id) : item;
          const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
          const filter = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { $or: [{ slug: id }, { id }] };
          return {
            updateOne: {
              filter,
              update: { $set: { displayOrder: order } },
            },
          };
        });
        await Project.bulkWrite(bulkOps);
      }
    } catch (dbErr) {}

    items.forEach((item, idx) => {
      const id = typeof item === 'object' ? (item._id || item.id) : item;
      const order = typeof item === 'object' && item.displayOrder !== undefined ? item.displayOrder : idx + 1;
      const found = FALLBACK_PROJECTS.find((p) => p._id === id || p.slug === id || p.id === id);
      if (found) found.displayOrder = order;
    });
    FALLBACK_PROJECTS.sort((a, b) => a.displayOrder - b.displayOrder);

    try {
      await logActivity('PROJECT_REORDERED', 'Project', { count: items.length }, req);
    } catch (e) {}

    return sendSuccess(res, { message: 'Projects reordered successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/admin/projects/:id/duplicate
 */
const duplicateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    let source = null;

    try {
      if (Project.db && Project.db.readyState === 1) {
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { $or: [{ slug: id }, { id }] };
        source = await Project.findOne(query).lean();
      }
    } catch (dbErr) {}

    if (!source) {
      source = FALLBACK_PROJECTS.find((p) => p._id === id || p.slug === id || p.id === id);
    }

    if (!source) {
      return sendError(res, 'Project not found.', 'NOT_FOUND', 404);
    }

    const newSlug = `${source.slug || source.id}-copy-${Date.now().toString().slice(-4)}`;
    const newTitle = `${source.title} (Copy)`;

    const { _id, createdAt, updatedAt, __v, ...cloneData } = source;
    const duplicatedPayload = {
      ...cloneData,
      title: newTitle,
      slug: newSlug,
      id: newSlug,
      visibility: 'DRAFT',
      displayOrder: (source.displayOrder || 0) + 1,
    };

    let newDoc = null;
    try {
      if (Project.db && Project.db.readyState === 1) {
        newDoc = await Project.create(duplicatedPayload);
      }
    } catch (dbErr) {}

    if (!newDoc) {
      newDoc = {
        _id: `proj-${Date.now()}`,
        ...duplicatedPayload,
        createdAt: new Date(),
      };
      FALLBACK_PROJECTS.push(newDoc);
    }

    try {
      await logActivity('PROJECT_DUPLICATED', 'Project', { sourceId: id, newId: newDoc._id, title: newDoc.title }, req);
    } catch (e) {}

    return sendSuccess(res, newDoc, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/projects/:id/status
 */
const updateProjectStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, visibility } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (visibility) updates.visibility = visibility;

    let project = null;
    try {
      if (Project.db && Project.db.readyState === 1) {
        const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { $or: [{ slug: id }, { id }] };
        project = await Project.findOneAndUpdate(query, updates, { new: true, runValidators: true });
      }
    } catch (dbErr) {}

    if (!project) {
      const p = FALLBACK_PROJECTS.find((item) => item._id === id || item.slug === id || item.id === id);
      if (p) {
        Object.assign(p, updates);
        project = p;
      }
    }

    if (!project) {
      return sendError(res, 'Project not found.', 'NOT_FOUND', 404);
    }

    try {
      await logActivity('PROJECT_STATUS_UPDATED', 'Project', { id, status: project.status, visibility: project.visibility }, req);
    } catch (e) {}

    return sendSuccess(res, project);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicProjects,
  getPublicProjectBySlug,
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  duplicateProject,
  updateProjectStatus,
  // legacy alias
  getAllProjects: getPublicProjects,
};
