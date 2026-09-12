const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../services/storageService');

// Controllers
const { getHero, updateHero } = require('../controllers/heroController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { getAbout, updateAbout } = require('../controllers/aboutController');
const {
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  duplicateProject,
  updateProjectStatus,
} = require('../controllers/projectController');
const {
  getAdminSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} = require('../controllers/skillController');
const {
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
} = require('../controllers/experienceController');
const {
  getAdminEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation,
} = require('../controllers/educationController');
const {
  getAdminCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
} = require('../controllers/certificateController');
const {
  getAdminRoadmap,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  reorderRoadmap,
} = require('../controllers/roadmapController');
const {
  getAdminNavigation,
  createNavigation,
  updateNavigation,
  deleteNavigation,
  reorderNavigation,
} = require('../controllers/navigationController');
const {
  getAdminSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
} = require('../controllers/socialLinkController');
const {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  getMediaUsage,
} = require('../controllers/mediaController');
const {
  getAdminResumes,
  uploadResume,
  setActiveResume,
  deleteResume,
} = require('../controllers/resumeController');
const {
  getMessages,
  getMessageById,
  markMessageRead,
  markMessageUnread,
  archiveMessage,
  updateMessageStatus,
  replyToMessage,
  deleteMessage,
} = require('../controllers/contactController');
const {
  getAdminSettings,
  updateSettings,
  getAdminSeo,
  updateSeo,
} = require('../controllers/settingsController');
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { getActivityLogs } = require('../controllers/activityLogController');
const { getAdminDashboardStats } = require('../controllers/adminController');
const { getAdminHealth } = require('../controllers/adminHealthController');
const { getAdminAnalytics } = require('../controllers/analyticsController');

// All routes here are guarded by JWT Bearer Authentication
router.use('/admin', verifyToken);

// ─── Hero ───────────────────────────────────────────────────
router.get('/admin/hero', getHero);
router.put('/admin/hero', updateHero);
router.patch('/admin/hero', updateHero);

// ─── Profile ────────────────────────────────────────────────
router.get('/admin/profile', getProfile);
router.put('/admin/profile', updateProfile);

// ─── About ──────────────────────────────────────────────────
router.get('/admin/about', getAbout);
router.put('/admin/about', updateAbout);

// ─── Projects CRUD + Reorder ────────────────────────────────
router.get('/admin/projects', getAdminProjects);
router.post('/admin/projects', createProject);
router.put('/admin/projects/reorder', reorderProjects);
router.get('/admin/projects/:id', getProjectById);
router.put('/admin/projects/:id', updateProject);
router.patch('/admin/projects/:id', updateProject);
router.delete('/admin/projects/:id', deleteProject);
router.post('/admin/projects/:id/duplicate', duplicateProject);
router.patch('/admin/projects/:id/status', updateProjectStatus);

// ─── Skills CRUD + Reorder ──────────────────────────────────
router.get('/admin/skills', getAdminSkills);
router.post('/admin/skills', createSkill);
router.put('/admin/skills/reorder', reorderSkills);
router.get('/admin/skills/:id', getSkillById);
router.put('/admin/skills/:id', updateSkill);
router.patch('/admin/skills/:id', updateSkill);
router.delete('/admin/skills/:id', deleteSkill);

// ─── Experience CRUD + Reorder ──────────────────────────────
router.get('/admin/experience', getAdminExperience);
router.post('/admin/experience', createExperience);
router.put('/admin/experience/reorder', reorderExperience);
router.put('/admin/experience/:id', updateExperience);
router.patch('/admin/experience/:id', updateExperience);
router.delete('/admin/experience/:id', deleteExperience);

// ─── Education CRUD + Reorder ───────────────────────────────
router.get('/admin/education', getAdminEducation);
router.post('/admin/education', createEducation);
router.put('/admin/education/reorder', reorderEducation);
router.put('/admin/education/:id', updateEducation);
router.patch('/admin/education/:id', updateEducation);
router.delete('/admin/education/:id', deleteEducation);

// ─── Certificates CRUD + Reorder ────────────────────────────
router.get('/admin/certificates', getAdminCertificates);
router.post('/admin/certificates', createCertificate);
router.put('/admin/certificates/reorder', reorderCertificates);
router.put('/admin/certificates/:id', updateCertificate);
router.patch('/admin/certificates/:id', updateCertificate);
router.delete('/admin/certificates/:id', deleteCertificate);

// ─── Roadmap CRUD + Reorder ─────────────────────────────────
router.get('/admin/roadmap', getAdminRoadmap);
router.post('/admin/roadmap', createRoadmap);
router.put('/admin/roadmap/reorder', reorderRoadmap);
router.get('/admin/roadmap/:id', getRoadmapById);
router.put('/admin/roadmap/:id', updateRoadmap);
router.patch('/admin/roadmap/:id', updateRoadmap);
router.delete('/admin/roadmap/:id', deleteRoadmap);

// ─── Navigation CRUD + Reorder ──────────────────────────────
router.get('/admin/navigation', getAdminNavigation);
router.post('/admin/navigation', createNavigation);
router.put('/admin/navigation/reorder', reorderNavigation);
router.put('/admin/navigation/:id', updateNavigation);
router.patch('/admin/navigation/:id', updateNavigation);
router.delete('/admin/navigation/:id', deleteNavigation);

// ─── Social Links CRUD + Reorder ────────────────────────────
router.get('/admin/social-links', getAdminSocialLinks);
router.post('/admin/social-links', createSocialLink);
router.put('/admin/social-links/reorder', reorderSocialLinks);
router.put('/admin/social-links/:id', updateSocialLink);
router.patch('/admin/social-links/:id', updateSocialLink);
router.delete('/admin/social-links/:id', deleteSocialLink);

// ─── Media Library ──────────────────────────────────────────
router.get('/admin/media', getMedia);
router.post('/admin/media/upload', upload.single('file'), uploadMedia);
router.post('/admin/media', upload.single('file'), uploadMedia);
router.get('/admin/media/:id/usage', getMediaUsage);
router.get('/admin/media/:id', getMediaById);
router.put('/admin/media/:id', updateMedia);
router.patch('/admin/media/:id', updateMedia);
router.delete('/admin/media/:id', deleteMedia);

// ─── Resume Management ──────────────────────────────────────
router.get('/admin/resume', getAdminResumes);
router.post('/admin/resume/upload', upload.single('file'), uploadResume);
router.patch('/admin/resume/:id/activate', setActiveResume);
router.delete('/admin/resume/:id', deleteResume);

// ─── SEO Management ─────────────────────────────────────────
router.get('/admin/seo', getAdminSeo);
router.put('/admin/seo', updateSeo);
router.patch('/admin/seo', updateSeo);

// ─── Site Settings ──────────────────────────────────────────
router.get('/admin/settings', getAdminSettings);
router.put('/admin/settings', updateSettings);
router.patch('/admin/settings', updateSettings);

// ─── Messages & Inquiries ───────────────────────────────────
router.get('/admin/messages', getMessages);
router.get('/admin/messages/:id', getMessageById);
router.put('/admin/messages/:id/read', markMessageRead);
router.patch('/admin/messages/:id/read', markMessageRead);
router.put('/admin/messages/:id/unread', markMessageUnread);
router.patch('/admin/messages/:id/unread', markMessageUnread);
router.put('/admin/messages/:id/archive', archiveMessage);
router.patch('/admin/messages/:id/archive', archiveMessage);
router.put('/admin/messages/:id/status', updateMessageStatus);
router.patch('/admin/messages/:id/status', updateMessageStatus);
router.post('/admin/messages/:id/reply', replyToMessage);
router.delete('/admin/messages/:id', deleteMessage);

// ─── Notifications ──────────────────────────────────────────
router.get('/admin/notifications', getNotifications);
router.post('/admin/notifications/read-all', markAllNotificationsRead);
router.patch('/admin/notifications/read-all', markAllNotificationsRead);
router.patch('/admin/notifications/:id/read', markNotificationRead);
router.put('/admin/notifications/:id/read', markNotificationRead);
router.delete('/admin/notifications/:id', deleteNotification);

// ─── Activity Audit Log ─────────────────────────────────────
router.get('/admin/activity', getActivityLogs);

// ─── Telemetry, Dashboard, Health & Analytics ───────────────
router.get('/admin/dashboard', getAdminDashboardStats);
router.get('/admin/health', getAdminHealth);
router.get('/admin/analytics', getAdminAnalytics);

module.exports = router;
