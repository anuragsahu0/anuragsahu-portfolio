/**
 * PREVIEW CONTROLLER
 * Secure preview token issuance and authenticated site aggregation with draft overlays.
 * Ensures drafts remain private and are NEVER exposed to normal public traffic.
 */
const jwt = require('jsonwebtoken');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { getPublicSite } = require('./publicController');
const Hero = require('../models/Hero');
const Profile = require('../models/Profile');
const About = require('../models/About');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Settings = require('../models/Settings');

const JWT_SECRET = process.env.JWT_SECRET || 'anuragsahu-control-center-secret-key-2026';

const { PREVIEW_SESSIONS } = require('../utils/previewStore');

/**
 * POST /api/admin/preview/token
 * Creates a signed, short-lived preview token containing draft overrides.
 * Body: { entityType, entityId, draftData }
 */
const generatePreviewToken = async (req, res, next) => {
  try {
    const { entityType, entityId, draftData } = req.body;

    if (!entityType || !draftData) {
      return sendError(res, 'entityType and draftData are required for preview.', 'VALIDATION_ERROR', 422);
    }

    const previewId = 'prev-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8);
    const payload = {
      previewId,
      entityType,
      entityId: String(entityId || 'global'),
      adminEmail: req.user?.email || 'admin@anuragsahu.dev',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

    PREVIEW_SESSIONS.set(previewId, {
      entityType,
      entityId: String(entityId || 'global'),
      draftData,
      createdAt: Date.now(),
    });

    // Cleanup expired sessions older than 30 minutes
    const now = Date.now();
    for (const [key, val] of PREVIEW_SESSIONS.entries()) {
      if (now - val.createdAt > 30 * 60 * 1000) {
        PREVIEW_SESSIONS.delete(key);
      }
    }

    return sendSuccess(res, {
      previewToken: token,
      previewUrl: '/?preview=true&previewToken=' + token,
      expiresIn: '15m',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/preview/site
 * Protected route: Returns full site data with draft overrides applied for live preview.
 */
const getPreviewSiteData = async (req, res, next) => {
  try {
    const previewToken = req.query.previewToken || req.headers['x-preview-token'];
    let draftOverride = null;

    if (previewToken) {
      try {
        const decoded = jwt.verify(previewToken, JWT_SECRET);
        if (decoded && decoded.previewId) {
          draftOverride = PREVIEW_SESSIONS.get(decoded.previewId);
        }
      } catch (tokenErr) {
        return sendError(res, 'Preview token is invalid or has expired.', 'INVALID_PREVIEW_TOKEN', 401);
      }
    }

    // Intercept response to apply draft data on top of published data
    const mockRes = {
      _data: null,
      _headers: {},
      set(k, v) { this._headers[k] = v; },
      status() { return this; },
      json(data) { this._data = data; return this; },
      send(data) { this._data = data; return this; },
    };

    await getPublicSite(req, mockRes, next);

    if (!mockRes._data || !mockRes._data.data) {
      return sendError(res, 'Failed to assemble base public site payload for preview.', 'PREVIEW_BUILD_ERROR', 500);
    }

    const siteData = { ...mockRes._data.data };

    // Apply draft overlay if provided
    if (draftOverride && draftOverride.draftData) {
      const { entityType, entityId, draftData } = draftOverride;

      if (entityType === 'Hero') {
        siteData.hero = { ...siteData.hero, ...draftData };
      } else if (entityType === 'Profile') {
        siteData.profile = { ...siteData.profile, ...draftData };
      } else if (entityType === 'About') {
        siteData.about = { ...siteData.about, ...draftData };
      } else if (entityType === 'Settings') {
        siteData.settings = { ...siteData.settings, ...draftData };
      } else if (entityType === 'SEO') {
        siteData.seo = { ...siteData.seo, ...draftData };
      } else if (entityType === 'Project') {
        const idx = siteData.projects.findIndex((p) => String(p._id) === String(entityId) || p.id === String(entityId) || p.slug === String(entityId));
        if (idx !== -1) {
          siteData.projects[idx] = { ...siteData.projects[idx], ...draftData };
        } else {
          siteData.projects.unshift({ _id: entityId, id: entityId, slug: entityId, ...draftData });
        }
      } else if (entityType === 'Skill') {
        const idx = siteData.skills.findIndex((s) => String(s._id) === String(entityId) || s.id === String(entityId));
        if (idx !== -1) {
          siteData.skills[idx] = { ...siteData.skills[idx], ...draftData };
        } else {
          siteData.skills.push({ _id: entityId, ...draftData });
        }
      }
    }

    // Set no-cache for preview responses
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');

    return sendSuccess(res, {
      ...siteData,
      isPreview: true,
      previewTimestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generatePreviewToken,
  getPreviewSiteData,
  PREVIEW_SESSIONS,
};
