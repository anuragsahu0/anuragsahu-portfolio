const Hero = require('../models/Hero');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const DEFAULT_HERO = {
  mainHeading: 'ENGINEERING INTELLIGENT SYSTEMS',
  highlightedText: 'FROM ZERO TO PRODUCTION',
  subtitle: 'Anurag Sahu — Computer Science Engineer & Full-Stack Developer',
  description:
    'Passionate about building production-grade full-stack platforms, deterministic financial engines, and modern distributed systems.',
  primaryCtaLabel: 'Explore Flagship AI System',
  primaryCtaUrl: '/AI-FINANCE-CONTROLLER',
  secondaryCtaLabel: 'Download Resume',
  secondaryCtaUrl: '/assets/resume.pdf',
  profileImage: '/assets/anurag-portrait-sm.webp',
  availabilityBadge: 'OPEN TO INTERNSHIP OPPORTUNITIES',
  supportingText: 'B.Tech CSE (AI & ML) • 2022–2026',
  isVisible: true,
};

const getHero = async (req, res, next) => {
  try {
    let hero = null;
    try {
      if (Hero.db && Hero.db.readyState === 1) {
        hero = await Hero.findOne();
      }
    } catch (dbErr) {}

    return sendSuccess(res, hero || DEFAULT_HERO);
  } catch (err) {
    next(err);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const data = req.body;
    let hero = null;

    try {
      if (Hero.db && Hero.db.readyState === 1) {
        hero = await Hero.findOneAndUpdate({}, data, {
          new: true,
          upsert: true,
          runValidators: true,
        });
      }
    } catch (dbErr) {}

    try {
      await logActivity('HERO_UPDATED', 'Hero', { fields: Object.keys(data) }, req);
    } catch (e) {}

    return sendSuccess(res, hero || { ...DEFAULT_HERO, ...data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHero,
  updateHero,
};
