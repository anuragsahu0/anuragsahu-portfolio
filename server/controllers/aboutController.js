const About = require('../models/About');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const DEFAULT_ABOUT = {
  title: 'About Me',
  description: 'Passionate about building modern web experiences and continuously growing as a software developer.',
  personalNarrative: [
    {
      id: 'p1',
      text: "Hi, I'm Anurag Sahu, a B.Tech student in Computer Science & Engineering (AI & ML) at Maharana Pratap Institute of Professional Studies.",
      highlightWords: ['Anurag Sahu', 'Computer Science & Engineering (AI & ML)', 'Maharana Pratap Institute of Professional Studies'],
    },
    {
      id: 'p2',
      text: 'I am passionate about building modern, scalable web applications and continuously improving my problem-solving skills.',
      highlightWords: ['modern, scalable web applications'],
    },
    {
      id: 'p3',
      text: 'My current focus is Full-Stack Development, where I work with both frontend and backend technologies to create responsive, efficient, and user-centric solutions.',
      highlightWords: ['Full-Stack Development'],
    },
    {
      id: 'p4',
      text: 'I enjoy learning new technologies, taking on challenging projects, and writing clean, maintainable code.',
      highlightWords: ['clean, maintainable code'],
    },
  ],
  learningJourney: 'B.Tech CSE (AI & ML) with strong focus on full-stack architecture, algorithms, and applied machine learning.',
  engineeringValues: [
    { title: 'Deterministic Engineering', description: 'Writing robust, testable, and maintainable software systems.', icon: 'ShieldCheck' },
    { title: 'Performance Optimization', description: 'Architecting high-speed, lightweight experiences with sub-second response times.', icon: 'Zap' },
    { title: 'Production Reliability', description: 'Zero compromise on security, validation, and fault-tolerant architecture.', icon: 'Cpu' },
  ],
  currentFocus: 'Full-Stack Development with React, Node.js, Express, and Modern Cloud Microservices.',
  goals: ['Excel in Software Engineering', 'Ship Enterprise-Grade Systems', 'Master Scalable Distributed Architecture'],
  interests: ['Autonomous AI Systems', 'Modern Web Infrastructure', 'Fintech & Multi-Way Reconciliation', 'High-Performance APIs'],
  displayOrder: 1,
  isPublished: true,
};

const getAbout = async (req, res, next) => {
  try {
    let about = null;
    try {
      if (About.db && About.db.readyState === 1) {
        about = await About.findOne();
      }
    } catch (dbErr) {}

    return sendSuccess(res, about || DEFAULT_ABOUT);
  } catch (err) {
    next(err);
  }
};

const updateAbout = async (req, res, next) => {
  try {
    const data = req.body;
    let about = null;
    try {
      if (About.db && About.db.readyState === 1) {
        about = await About.findOneAndUpdate({}, data, {
          new: true,
          upsert: true,
          runValidators: true,
        });
      }
    } catch (dbErr) {}

    try {
      await logActivity('ABOUT_UPDATED', 'About', { fields: Object.keys(data) }, req);
    } catch (e) {}

    return sendSuccess(res, about || { ...DEFAULT_ABOUT, ...data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAbout,
  updateAbout,
};
