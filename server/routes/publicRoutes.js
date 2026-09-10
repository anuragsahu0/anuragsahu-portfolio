const express = require('express');
const router = express.Router();

const { getProfile } = require('../controllers/profileController');
const { getAbout } = require('../controllers/aboutController');
const { getPublicProjects, getPublicProjectBySlug } = require('../controllers/projectController');
const { getPublicSkills } = require('../controllers/skillController');
const { getPublicExperience } = require('../controllers/experienceController');
const { getPublicEducation } = require('../controllers/educationController');
const { getPublicCertificates } = require('../controllers/certificateController');
const { getPublicRoadmap } = require('../controllers/roadmapController');
const { getPublicSettings } = require('../controllers/settingsController');

// ─── Public Read-Only Portfolio Endpoints ────────────────────────────────────
// Return only published/visible records, stripping any private metadata or admin fields

router.get('/public/profile', getProfile);
router.get('/public/about', getAbout);
router.get('/public/projects', getPublicProjects);
router.get('/public/projects/:slug', getPublicProjectBySlug);
router.get('/public/skills', getPublicSkills);
router.get('/public/experience', getPublicExperience);
router.get('/public/education', getPublicEducation);
router.get('/public/certificates', getPublicCertificates);
router.get('/public/roadmap', getPublicRoadmap);
router.get('/public/settings', getPublicSettings);

module.exports = router;
