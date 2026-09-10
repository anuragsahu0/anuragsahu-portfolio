const Profile = require('../models/Profile');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { logActivity } = require('./adminController');

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
    const data = req.body;
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

    return sendSuccess(res, profile || { ...DEFAULT_PROFILE, ...data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
