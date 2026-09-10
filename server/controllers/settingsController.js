const Settings = require('../models/Settings');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

const DEFAULT_SETTINGS = {
  siteName: 'Anurag Sahu',
  portfolioUrl: 'https://anuragsahu.com',
  contactEmail: 'shivasahu0612@gmail.com',
  github: 'https://github.com/anuragsahu0',
  linkedin: 'https://linkedin.com/in/anuragsahu0',
  resumeUrl: '/assets/anurag-sahu-resume.pdf',
  availability: 'Open to Internship Opportunities',
  seoTitle: 'Anurag Sahu — Computer Science Engineer & Full-Stack Developer',
  seoDescription: 'Personal portfolio and engineering telemetry showcase for Anurag Sahu.',
  ogTitle: 'Anurag Sahu — Control Center & Developer Portfolio',
  ogDescription: 'Explore engineering projects, interactive systems, and live telemetry.',
  ogImage: '/assets/anurag-portrait-sm.jpg',
  footerText: '© 2026 Anurag Sahu. Engineered for performance and scale.',
};

/**
 * GET /api/public/settings
 * Safe public configuration only (no sensitive backend settings)
 */
const getPublicSettings = async (req, res, next) => {
  try {
    let settings = null;
    try {
      if (Settings.db && Settings.db.readyState === 1) {
        settings = await Settings.findOne({ singletonId: 'global' }).lean();
      }
    } catch (dbErr) {}

    const source = settings || DEFAULT_SETTINGS;
    const publicSafe = {
      siteName: source.siteName,
      portfolioUrl: source.portfolioUrl,
      availability: source.availability,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      ogTitle: source.ogTitle,
      ogDescription: source.ogDescription,
      ogImage: source.ogImage,
      footerText: source.footerText,
      github: source.github,
      linkedin: source.linkedin,
      resumeUrl: source.resumeUrl,
    };

    return sendSuccess(res, publicSafe);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/settings
 */
const getAdminSettings = async (req, res, next) => {
  try {
    let settings = null;
    try {
      if (Settings.db && Settings.db.readyState === 1) {
        settings = await Settings.findOne({ singletonId: 'global' }).lean();
      }
    } catch (dbErr) {}

    return sendSuccess(res, settings || DEFAULT_SETTINGS);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT/PATCH /api/admin/settings
 */
const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body;
    let settings = null;

    try {
      if (Settings.db && Settings.db.readyState === 1) {
        settings = await Settings.findOneAndUpdate(
          { singletonId: 'global' },
          { ...updates, singletonId: 'global' },
          { new: true, upsert: true, runValidators: true }
        );
      }
    } catch (dbErr) {}

    try {
      await logActivity('SETTINGS_UPDATED', 'Settings', { updatedKeys: Object.keys(updates) }, req);
    } catch (e) {}

    return sendSuccess(res, settings || { ...DEFAULT_SETTINGS, ...updates });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
  // legacy alias
  getAll: getAdminSettings,
  upsert: updateSettings,
};
