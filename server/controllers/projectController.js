const Project = require('../models/Project');

// Static fallback data when MongoDB is unavailable
const FALLBACK_PROJECTS = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    subtitle: 'Production-ready personal platform & developer telemetry dashboard.',
    category: 'fullstack',
    categoryLabel: 'Full-Stack Web & Telemetry',
    badge: 'FLAGSHIP PROJECT',
    description: 'A full-stack personal platform built with React 18, Node.js, Express backend REST APIs, MongoDB, and glassmorphism design system.',
    github: 'https://github.com/anuragsahu0/portfolio',
    demo: 'https://anuragsahu.vercel.app',
    techStack: ['React 18', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'MongoDB'],
    isFeatured: true,
    order: 1,
    metrics: [
      { label: 'Status', value: 'Completed', change: 'Live' },
      { label: 'Backend', value: 'Express.js', change: 'Node.js + REST' },
    ],
  },
  {
    id: 'ai-finance-controller',
    title: 'AI Finance Controller',
    subtitle: 'Autonomous Financial Operations, Multi-Way Reconciliation & Audit Platform.',
    category: 'enterprise',
    categoryLabel: 'Autonomous AI & Fintech',
    badge: 'FLAGSHIP AI FINTECH',
    description: 'Autonomous enterprise financial operations platform featuring multi-source data ingestion, deterministic reconciliation engine, GST/VAT tax intelligence, anomaly detection 2.0, controlled settlement automation with Four-Eyes authorization, and Finance Copilot.',
    github: 'https://github.com/anuragsahu0/ai-finance-controller',
    demo: 'https://anuragsahu.com/AI-FINANCE-CONTROLLER',
    techStack: ['Next.js 14', 'FastAPI', 'Python', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'AI Copilot'],
    isFeatured: true,
    order: 2,
    metrics: [
      { label: 'Status', value: 'Live & Operational', change: '100% Production' },
      { label: 'Reconciliation', value: 'Multi-Way Engine', change: 'Deterministic' },
    ],
  },
  {
    id: 'smart-college-erp',
    title: 'Smart College ERP',
    subtitle: 'Comprehensive academic ERP platform featuring student, faculty, and examination portals.',
    category: 'enterprise',
    categoryLabel: 'Academic ERP System',
    badge: 'PLANNED ACADEMIC ERP',
    description: 'An end-to-end college management ERP platform featuring student attendance tracking, examination result portal, fee collection gateway, faculty schedule manager, and automated performance analytics.',
    github: 'https://github.com/anuragsahu0/smart-college-erp',
    demo: '#',
    techStack: ['React 18', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    isFeatured: false,
    order: 3,
    metrics: [
      { label: 'Status', value: 'Coming Soon', change: 'Planning' },
      { label: 'Modules', value: 'Academic ERP', change: 'Attendance + Fees' },
    ],
  },
];

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isActive: true }).sort({ order: 1, isFeatured: -1 });
    return res.status(200).json({ success: true, count: projects.length, projects, source: 'database' });
  } catch (err) {
    // Graceful fallback to static data
    console.warn('[Projects] DB unavailable, serving static fallback data');
    return res.status(200).json({ success: true, count: FALLBACK_PROJECTS.length, projects: FALLBACK_PROJECTS, source: 'fallback' });
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      const fallback = FALLBACK_PROJECTS.find(p => p.id === req.params.id);
      if (fallback) return res.status(200).json({ success: true, project: fallback, source: 'fallback' });
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    return res.status(200).json({ success: true, project, source: 'database' });
  } catch (err) {
    const fallback = FALLBACK_PROJECTS.find(p => p.id === req.params.id);
    if (fallback) return res.status(200).json({ success: true, project: fallback, source: 'fallback' });
    return res.status(404).json({ success: false, message: 'Project not found.' });
  }
};

const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json({ success: true, project });
  } catch (err) { next(err); }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.status(200).json({ success: true, project });
  } catch (err) { next(err); }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };
