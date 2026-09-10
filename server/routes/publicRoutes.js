const express = require('express');
const router = express.Router();

const { getHero } = require('../controllers/heroController');
const { getProfile } = require('../controllers/profileController');
const { getAbout } = require('../controllers/aboutController');
const { getPublicProjects, getPublicProjectBySlug } = require('../controllers/projectController');
const { getPublicSkills } = require('../controllers/skillController');
const { getPublicExperience } = require('../controllers/experienceController');
const { getPublicEducation } = require('../controllers/educationController');
const { getPublicCertificates } = require('../controllers/certificateController');
const { getPublicRoadmap } = require('../controllers/roadmapController');
const { getPublicNavigation } = require('../controllers/navigationController');
const { getPublicSocialLinks } = require('../controllers/socialLinkController');
const { getPublicSettings } = require('../controllers/settingsController');

// ─── Public Read-Only Portfolio Endpoints ────────────────────────────────────
// Return only published/visible records, stripping any private metadata or admin fields

router.get('/public/hero', getHero);
router.get('/public/profile', getProfile);
router.get('/public/about', getAbout);
router.get('/public/projects', getPublicProjects);
router.get('/public/projects/:slug', getPublicProjectBySlug);
router.get('/public/skills', getPublicSkills);
router.get('/public/experience', getPublicExperience);
router.get('/public/education', getPublicEducation);
router.get('/public/certificates', getPublicCertificates);
router.get('/public/roadmap', getPublicRoadmap);
router.get('/public/navigation', getPublicNavigation);
router.get('/public/social-links', getPublicSocialLinks);
router.get('/public/settings', getPublicSettings);

module.exports = router;
