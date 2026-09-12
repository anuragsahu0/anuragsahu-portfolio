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
const { getPublicSettings, getPublicSeo } = require('../controllers/settingsController');
const { getPublicResume } = require('../controllers/resumeController');
const { getMediaById } = require('../controllers/mediaController');
const { getPublicSite, getDynamicSitemap } = require('../controllers/publicController');

// ─── Public Read-Only Portfolio Endpoints ────────────────────────────────────
// Return only published/visible records, stripping any private metadata or admin fields

router.get('/public/site', getPublicSite);
router.get('/sitemap.xml', getDynamicSitemap);
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
router.get('/public/seo', getPublicSeo);
router.get('/public/resume', getPublicResume);
router.get('/public/media/:id', getMediaById);

module.exports = router;
