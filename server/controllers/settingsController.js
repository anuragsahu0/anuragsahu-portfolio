const Settings = require('../models/Settings');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { isSafeUrl, sanitizeHtmlContent } = require('../utils/security');

const DEFAULT_SETTINGS = {
  singletonId: 'global',
  siteName: 'Anurag Sahu',
  portfolioUrl: 'https://anuragsahu.com',
  siteDescription: 'Computer Science Engineer & Full-Stack Developer specializing in high-performance web systems and AI applications.',
  timezone: 'Asia/Kolkata',
  contactEmail: 'shivasahu0612@gmail.com',
  contactFormEnabled: true,
  publicEmailVisible: true,
  github: 'https://github.com/anuragsahu0',
  linkedin: 'https://linkedin.com/in/anuragsahu0',
  resumeUrl: '/assets/anurag-sahu-resume.pdf',
  availability: 'Open to Internship Opportunities',
  logoUrl: '/assets/as-admin-icon.svg',
  faviconUrl: '/assets/anurag-portrait-sm.webp',
  appleTouchIconUrl: '/assets/anurag-portrait-sm.webp',
  seoTitle: 'Anurag Sahu — Full-Stack Developer & B.Tech CSE (AI & ML) Sophomore',
  seoDescription: 'Portfolio of Anurag Sahu, Computer Science & Engineering (AI & ML) student specializing in Full-Stack Web Development, React, Node.js, Python, and practical Machine Learning applications. Open for Summer 2026 internships.',
  canonicalUrl: 'https://anuragsahu.com/',
  keywords: 'Anurag Sahu, Full-Stack Developer, AI ML Developer, React Developer, Node.js, Python, Computer Science, Portfolio, Software Engineering Intern',
  author: 'Anurag Sahu',
  siteLanguage: 'en',
  robotsDirective: 'index, follow',
  ogTitle: 'Anurag Sahu — Control Center & Developer Portfolio',
  ogDescription: 'Explore engineering projects, interactive systems, and live telemetry for Anurag Sahu.',
  ogImage: '/assets/anurag-portrait.webp',
  twitterCard: 'summary_large_image',
  maintenanceMode: false,
  maintenanceMessage: 'System undergoing scheduled optimization. We will be back online shortly.',
  resumeButtonEnabled: true,
  analyticsEnabled: true,
  footerText: '© 2026 Anurag Sahu. Engineered for performance and scale.',
};

let inMemorySettings = { ...DEFAULT_SETTINGS };

/**
 * Helper to get current settings document or default fallback
 */
async function getCurrentSettings() {
  try {
    if (Settings.db && Settings.db.readyState === 1) {
      const doc = await Settings.findOne({ singletonId: 'global' }).lean();
      if (doc) return { ...DEFAULT_SETTINGS, ...inMemorySettings, ...doc };
    }
  } catch (err) {}
  return { ...inMemorySettings };
}

/**
 * GET /api/public/settings
 * Safe public configuration only (no sensitive credentials)
 */
const getPublicSettings = async (req, res, next) => {
  try {
    const s = await getCurrentSettings();
    const publicSafe = {
      siteName: s.siteName,
      portfolioUrl: s.portfolioUrl,
      siteDescription: s.siteDescription,
      availability: s.availability,
      footerText: s.footerText,
      contactEmail: s.publicEmailVisible ? s.contactEmail : null,
      contactFormEnabled: s.contactFormEnabled,
      publicEmailVisible: s.publicEmailVisible,
      github: s.github,
      linkedin: s.linkedin,
      resumeUrl: s.resumeUrl,
      logoUrl: s.logoUrl,
      faviconUrl: s.faviconUrl,
      appleTouchIconUrl: s.appleTouchIconUrl,
      maintenanceMode: s.maintenanceMode,
      maintenanceMessage: s.maintenanceMessage,
      resumeButtonEnabled: s.resumeButtonEnabled,
      analyticsEnabled: s.analyticsEnabled,
    };

    return sendSuccess(res, publicSafe);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/public/seo
 * Publicly rendered SEO, Canonical, Favicon and Open Graph tags
 */
const getPublicSeo = async (req, res, next) => {
  try {
    const s = await getCurrentSettings();
    const seo = {
      title: s.seoTitle || `${s.siteName} — Portfolio`,
      description: s.seoDescription || s.siteDescription,
      canonicalUrl: s.canonicalUrl || s.portfolioUrl,
      keywords: s.keywords,
      author: s.author,
      siteLanguage: s.siteLanguage,
      robotsDirective: s.robotsDirective,
      faviconUrl: s.faviconUrl,
      appleTouchIconUrl: s.appleTouchIconUrl,
      openGraph: {
        title: s.ogTitle || s.seoTitle,
        description: s.ogDescription || s.seoDescription,
        image: s.ogImage,
        url: s.canonicalUrl || s.portfolioUrl,
        type: 'website',
      },
      twitter: {
        card: s.twitterCard || 'summary_large_image',
        title: s.ogTitle || s.seoTitle,
        description: s.ogDescription || s.seoDescription,
        image: s.ogImage,
      },
    };

    return sendSuccess(res, seo);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/settings
 */
const getAdminSettings = async (req, res, next) => {
  try {
    const s = await getCurrentSettings();
    return sendSuccess(res, s);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT/PATCH /api/admin/settings
 */
const updateSettings = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    const urlKeys = ['portfolioUrl', 'github', 'linkedin', 'resumeUrl', 'logoUrl', 'faviconUrl', 'appleTouchIconUrl', 'canonicalUrl', 'ogImage'];
    for (const k of urlKeys) {
      if (updates[k] && !isSafeUrl(updates[k])) {
        return sendError(res, `Invalid or unsafe URL for ${k}.`, 'INVALID_URL', 422);
      }
    }
    if (updates.siteDescription) updates.siteDescription = sanitizeHtmlContent(updates.siteDescription);
    if (updates.maintenanceMessage) updates.maintenanceMessage = sanitizeHtmlContent(updates.maintenanceMessage);
    if (updates.footerText) updates.footerText = sanitizeHtmlContent(updates.footerText);

    let settings = null;

    try {
      if (Settings.db && Settings.db.readyState === 1) {
        settings = await Settings.findOneAndUpdate(
          { singletonId: 'global' },
          { ...updates, singletonId: 'global' },
          { new: true, upsert: true, runValidators: true }
        );
      }
    } catch (dbErr) {
      console.warn('[updateSettings] DB save error:', dbErr.message);
    }

    try {
      await logActivity('SETTINGS_UPDATED', 'Settings', { updatedKeys: Object.keys(updates) }, req);
    } catch (e) {}

    inMemorySettings = { ...inMemorySettings, ...updates };

    return sendSuccess(res, settings || { ...DEFAULT_SETTINGS, ...updates });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/seo
 */
const getAdminSeo = async (req, res, next) => {
  try {
    const s = await getCurrentSettings();
    const seo = {
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      canonicalUrl: s.canonicalUrl,
      keywords: s.keywords,
      author: s.author,
      siteLanguage: s.siteLanguage,
      robotsDirective: s.robotsDirective,
      ogTitle: s.ogTitle,
      ogDescription: s.ogDescription,
      ogImage: s.ogImage,
      twitterCard: s.twitterCard,
    };
    return sendSuccess(res, seo);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT/PATCH /api/admin/seo
 */
const updateSeo = async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (updates.canonicalUrl && !isSafeUrl(updates.canonicalUrl)) {
      return sendError(res, 'Invalid or unsafe canonical URL.', 'INVALID_URL', 422);
    }
    if (updates.ogImage && !isSafeUrl(updates.ogImage)) {
      return sendError(res, 'Invalid or unsafe ogImage URL.', 'INVALID_URL', 422);
    }
    if (updates.seoTitle) updates.seoTitle = sanitizeHtmlContent(updates.seoTitle);
    if (updates.seoDescription) updates.seoDescription = sanitizeHtmlContent(updates.seoDescription);

    let settings = null;

    const seoFields = [
      'seoTitle',
      'seoDescription',
      'canonicalUrl',
      'keywords',
      'author',
      'siteLanguage',
      'robotsDirective',
      'ogTitle',
      'ogDescription',
      'ogImage',
      'twitterCard',
    ];

    const cleanUpdates = {};
    seoFields.forEach((f) => {
      if (updates[f] !== undefined) cleanUpdates[f] = updates[f];
    });

    try {
      if (Settings.db && Settings.db.readyState === 1) {
        settings = await Settings.findOneAndUpdate(
          { singletonId: 'global' },
          { ...cleanUpdates, singletonId: 'global' },
          { new: true, upsert: true, runValidators: true }
        );
      }
    } catch (dbErr) {}

    try {
      await logActivity('SEO_UPDATED', 'Settings', { fields: Object.keys(cleanUpdates) }, req);
    } catch (e) {}

    inMemorySettings = { ...inMemorySettings, ...cleanUpdates };

    return sendSuccess(res, settings || { ...DEFAULT_SETTINGS, ...cleanUpdates });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPublicSettings,
  getPublicSeo,
  getAdminSettings,
  updateSettings,
  getAdminSeo,
  updateSeo,
  // legacy alias
  getAll: getAdminSettings,
  upsert: updateSettings,
};
