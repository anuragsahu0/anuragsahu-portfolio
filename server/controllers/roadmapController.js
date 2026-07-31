const Roadmap = require('../models/Roadmap');

const FALLBACK_ROADMAP = [
  {
    number: '01',
    name: 'Portfolio',
    subtitle: 'Production-ready personal platform & developer telemetry dashboard.',
    status: 'Completed',
    statusVariant: 'emerald',
    statusSymbol: '🟢',
    progress: 100,
    progressLabel: 'Completed',
    lastUpdated: 'Updated Q1 2026',
    description: 'Building a premium production-ready portfolio with React 18, Node.js, Express backend API, modern glassmorphism design system, and recruiter-focused experience.',
    currentFocus: [
      'Nodemailer Contact Form Integration',
      'Telemetry Admin Dashboard & Real-Time Analytics',
      'Vercel & Docker Multi-Platform Public Deployment',
    ],
    plannedModules: [
      'Interactive WebGL Anti-Gravity Particle Canvas',
      'Centralized Candidate Data Store',
      'Product-Grade Case Study Modals & Metrics',
    ],
    technologies: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
    category: 'Full-Stack Web & Telemetry',
  },
  {
    number: '02',
    name: 'Restaurant Management System',
    subtitle: 'End-to-end POS, inventory control, billing, and real-time order processing platform.',
    status: 'Coming Soon',
    statusVariant: 'amber',
    statusSymbol: '🟡',
    progress: 0,
    progressLabel: 'Coming Soon',
    lastUpdated: 'Planned Q2 2026',
    description: 'A complete multi-tenant restaurant management platform with role-based authentication, real-time kitchen order display (KDS), automated inventory tracking, invoice billing, and revenue analytics.',
    currentFocus: [
      'Database Schema Design & ERD Modeling',
      'Role-Based Access Control (RBAC) System',
      'POS & Invoice Billing Module Specifications',
    ],
    plannedModules: [
      'JWT Authentication & Multi-Role User Management',
      'Real-Time Kitchen Order Display via WebSockets',
      'Inventory Stock Tracking & Automatic Low-Stock Alerts',
      'Automated Billing & Digital Receipt Generation',
      'Manager Analytics Dashboard (Revenue & Popular Dishes)',
    ],
    technologies: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Redis', 'WebSockets', 'Tailwind CSS'],
    category: 'Enterprise Full-Stack System',
  },
  {
    number: '03',
    name: 'Smart College ERP',
    subtitle: 'End-to-end college management ERP platform featuring student & faculty portals.',
    status: 'Coming Soon',
    statusVariant: 'amber',
    statusSymbol: '🟡',
    progress: 0,
    progressLabel: 'Coming Soon',
    lastUpdated: 'Planned Q3 2026',
    description: 'An end-to-end college management ERP platform featuring student attendance tracking, examination result portal, fee collection gateway, faculty schedule manager, and automated performance analytics.',
    currentFocus: [
      'Multi-Role Student, Faculty & Admin Portal (RBAC)',
      'Attendance Tracking & Automated Percentage Calculation',
      'Online Examination Result Publishing & Digital Fee Gateway',
    ],
    plannedModules: [
      'JWT Authentication & Multi-Role User Management',
      'Automated Attendance & Grading Pipeline',
      'Fee Collection Gateway & Digital Receipts',
      'Faculty Schedule & Timetable Scheduling Engine',
    ],
    technologies: ['Node.js', 'Express', 'React', 'MongoDB', 'Tailwind CSS'],
    category: 'Academic ERP System',
  },
];

const getAll = async (req, res, next) => {
  try {
    const projects = await Roadmap.find({ isActive: true }).sort({ order: 1 });
    return res.status(200).json({ success: true, count: projects.length, roadmap: projects, source: 'database' });
  } catch (err) {
    console.warn('[Roadmap] DB unavailable, serving fallback data');
    return res.status(200).json({ success: true, count: FALLBACK_ROADMAP.length, roadmap: FALLBACK_ROADMAP, source: 'fallback' });
  }
};

const getOne = async (req, res, next) => {
  try {
    const project = await Roadmap.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Roadmap project not found.' });
    return res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const project = await Roadmap.create(req.body);
    return res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { status, number, name } = req.body;
    
    // Update in memory FALLBACK_ROADMAP
    const target = FALLBACK_ROADMAP.find((item) => item.number === req.params.id || item.number === number || item.name.toLowerCase() === (name || '').toLowerCase());
    if (target && status) {
      target.status = status;
      target.statusSymbol = status === 'Completed' ? '🟢' : '🟡';
      target.statusVariant = status === 'Completed' ? 'emerald' : 'amber';
      target.progressLabel = status;
      target.progress = status === 'Completed' ? 100 : 0;
    }

    try {
      if (Roadmap.db && Roadmap.db.readyState === 1) {
        const project = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (project) return res.status(200).json({ success: true, project });
      }
    } catch (e) {}

    return res.status(200).json({ success: true, message: 'Status updated successfully', project: target });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const project = await Roadmap.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Roadmap project not found.' });
    return res.status(200).json({ success: true, message: 'Roadmap project deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };
