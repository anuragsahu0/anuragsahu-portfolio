const Profile = require('../models/Profile');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');
const { isSafeUrl, sanitizeHtmlContent } = require('../utils/security');

const DEFAULT_PROFILE = {
  fullName: 'Anurag Sahu',
  professionalHeadline: 'Computer Science Engineer & Full-Stack Developer',
  shortIntroduction: 'Passionate about building modern web experiences and continuously growing as a software developer.',
  profileImage: '/assets/anurag-portrait-sm.webp',
  secondaryImage: '/assets/anurag-portrait-sm.jpg',
  location: 'India',
  availability: 'Open to Internship Opportunities',
  currentFocus: 'Full-Stack Development & Autonomous AI Systems',
  email: 'shivasahu0612@gmail.com',
  github: 'https://github.com/anuragsahu0',
  linkedin: 'https://linkedin.com/in/anuragsahu0',
  portfolioUrl: 'https://anuragsahu.com',
  resumeUrl: '/assets/anurag-sahu-resume.pdf',
};

const getProfile = async (req, res, next) => {
  try {
    let profile = null;
    try {
      if (Profile.db && Profile.db.readyState === 1) {
        profile = await Profile.findOne();
      }
    } catch (dbErr) {}

    return sendSuccess(res, profile || DEFAULT_PROFILE);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const urlFields = ['profileImage', 'secondaryImage', 'github', 'linkedin', 'portfolioUrl', 'resumeUrl'];
    for (const f of urlFields) {
      if (data[f] && !isSafeUrl(data[f])) {
        return sendError(res, `Invalid or unsafe URL for ${f}.`, 'INVALID_URL', 422);
      }
    }
    if (data.shortIntroduction) data.shortIntroduction = sanitizeHtmlContent(data.shortIntroduction);
    if (data.professionalHeadline) data.professionalHeadline = sanitizeHtmlContent(data.professionalHeadline);
    if (data.currentFocus) data.currentFocus = sanitizeHtmlContent(data.currentFocus);

    let profile = null;
    try {
      if (Profile.db && Profile.db.readyState === 1) {
        profile = await Profile.findOneAndUpdate({}, data, {
          new: true,
          upsert: true,
          runValidators: true,
        });
      }
    } catch (dbErr) {}

    try {
      await logActivity('PROFILE_UPDATED', 'Profile', { fields: Object.keys(data) }, req);
    } catch (e) {}

    // Phase 11: Record immutable revision & clear working draft
    try {
      const { recordRevision } = require('../utils/revisionHelper');
      const Draft = require('../models/Draft');
      const finalProfile = profile ? (profile.toObject ? profile.toObject() : profile) : { ...DEFAULT_PROFILE, ...data };
      await recordRevision({
        entityType: 'Profile',
        entityId: 'global',
        title: finalProfile.fullName || 'Anurag Sahu Profile',
        snapshot: finalProfile,
        state: 'PUBLISHED',
        createdBy: req.user?.email || 'admin',
        changeSummary: 'Updated Profile Information',
      });
      if (Draft.db && Draft.db.readyState === 1) {
        await Draft.deleteOne({ entityType: 'Profile', entityId: 'global' });
      }
    } catch (revErr) {
      console.warn('[Profile] Revision recording failed:', revErr.message);
    }

    return sendSuccess(res, profile || { ...DEFAULT_PROFILE, ...data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
