const Skill = require('../models/Skill');

const FALLBACK_SKILLS = [
  { id: 'react', name: 'React.js 18', category: 'frontend', status: 'Building Projects With', proficiency: 92, icon: 'Atom', levelLabel: 'Advanced Student Level', highlights: ['Custom Hooks & Context API', 'Framer Motion Animations', 'Component Architecture'] },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', status: 'Building Projects With', proficiency: 95, icon: 'Palette', levelLabel: 'Advanced Student Level', highlights: ['Custom Utility Classes', 'Responsive Grid Systems', 'Dark Theme Tokens'] },
  { id: 'javascript-es6', name: 'JavaScript (ES6+)', category: 'frontend', status: 'Building Projects With', proficiency: 90, icon: 'Code2', levelLabel: 'Advanced Student Level', highlights: ['Async/Await & Promises', 'ES6 Modules & Closures', 'DOM Manipulation'] },
  { id: 'nodejs', name: 'Node.js', category: 'backend', status: 'Building Projects With', proficiency: 86, icon: 'Server', levelLabel: 'Intermediate Student Level', highlights: ['Express Middleware', 'REST API Architecture', 'JWT Authentication'] },
  { id: 'express', name: 'Express.js', category: 'backend', status: 'Building Projects With', proficiency: 88, icon: 'Cpu', levelLabel: 'Intermediate Student Level', highlights: ['Custom Route Handlers', 'Input Validation', 'Error Handling'] },
  { id: 'pytorch', name: 'PyTorch', category: 'aiml', status: 'Building Projects With', proficiency: 80, icon: 'Bot', levelLabel: 'Academic Focus', highlights: ['Custom Neural Layers', 'Tensor Manipulations', 'Graph Neural Networks'] },
  { id: 'python-ml', name: 'Python (NumPy / SciPy)', category: 'aiml', status: 'Building Projects With', proficiency: 88, icon: 'Terminal', levelLabel: 'Academic Focus', highlights: ['NumPy Vectorization', 'Pandas Analysis', 'Scientific Computing'] },
  { id: 'mongodb', name: 'MongoDB / Mongoose', category: 'databases', status: 'Building Projects With', proficiency: 85, icon: 'FileCode', levelLabel: 'Intermediate Student Level', highlights: ['Document Modeling', 'Aggregation Pipeline', 'CRUD Operations'] },
  { id: 'postgresql', name: 'PostgreSQL', category: 'databases', status: 'Building Projects With', proficiency: 84, icon: 'Database', levelLabel: 'Intermediate Student Level', highlights: ['Relational Schema Design', 'SQL Queries & Joins', 'ACID Transactions'] },
  { id: 'cpp', name: 'C++', category: 'languages', status: 'Building Projects With', proficiency: 85, icon: 'Terminal', levelLabel: 'Core CS Foundation', highlights: ['OOP & Encapsulation', 'Pointers & Memory Control', 'STL Algorithms'] },
  { id: 'git', name: 'Git & GitHub', category: 'tools', status: 'Building Projects With', proficiency: 90, icon: 'GitBranch', levelLabel: 'Daily Engineering Standard', highlights: ['Branching Strategies', 'PR Workflows', 'GitHub Actions Basics'] },
  { id: 'docker', name: 'Docker', category: 'tools', status: 'Learning', proficiency: 72, icon: 'Box', levelLabel: 'Active Skill Expansion', highlights: ['Multi-Stage Dockerfiles', 'Container Networking', 'Image Optimization'] },
];

const getAll = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    const skills = await Skill.find(filter).sort({ order: 1 });
    return res.status(200).json({ success: true, count: skills.length, skills, source: 'database' });
  } catch (err) {
    console.warn('[Skills] DB unavailable, serving static fallback');
    let fallback = FALLBACK_SKILLS;
    if (req.query.category && req.query.category !== 'all') {
      fallback = FALLBACK_SKILLS.filter(s => s.category === req.query.category);
    }
    return res.status(200).json({ success: true, count: fallback.length, skills: fallback, source: 'fallback' });
  }
};

const getOne = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    return res.status(200).json({ success: true, skill });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    return res.status(201).json({ success: true, skill });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    return res.status(200).json({ success: true, skill });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });
    return res.status(200).json({ success: true, message: 'Skill deleted.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove };
