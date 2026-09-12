const Hero = require('../models/Hero');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { isSafeUrl, sanitizeHtmlContent } = require('../utils/security');

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
    const data = { ...req.body };
    const urlFields = ['primaryCtaUrl', 'secondaryCtaUrl', 'profileImage'];
    for (const f of urlFields) {
      if (data[f] && !isSafeUrl(data[f])) {
        return sendError(res, `Invalid or unsafe URL for ${f}.`, 'INVALID_URL', 422);
      }
    }
    if (data.mainHeading) data.mainHeading = sanitizeHtmlContent(data.mainHeading);
    if (data.highlightedText) data.highlightedText = sanitizeHtmlContent(data.highlightedText);
    if (data.subtitle) data.subtitle = sanitizeHtmlContent(data.subtitle);
    if (data.description) data.description = sanitizeHtmlContent(data.description);

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

    // Phase 11: Record immutable revision & clear working draft
    try {
      const { recordRevision } = require('../utils/revisionHelper');
      const Draft = require('../models/Draft');
      const finalHero = hero ? (hero.toObject ? hero.toObject() : hero) : { ...DEFAULT_HERO, ...data };
      await recordRevision({
        entityType: 'Hero',
        entityId: 'global',
        title: 'Hero Section',
        snapshot: finalHero,
        state: 'PUBLISHED',
        createdBy: req.user?.email || 'admin',
        changeSummary: 'Updated Hero Section',
      });
      if (Draft.db && Draft.db.readyState === 1) {
        await Draft.deleteOne({ entityType: 'Hero', entityId: 'global' });
      }
    } catch (revErr) {
      console.warn('[Hero] Revision recording failed:', revErr.message);
    }

    return sendSuccess(res, hero || { ...DEFAULT_HERO, ...data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHero,
  updateHero,
};
