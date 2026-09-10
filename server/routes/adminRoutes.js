const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Controllers
const { getProfile, updateProfile } = require('../controllers/profileController');
const { getAbout, updateAbout } = require('../controllers/aboutController');
const {
  getAdminProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const {
  getAdminSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const {
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController');
const {
  getAdminEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/educationController');
const {
  getAdminCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');
const {
  getAdminRoadmap,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
} = require('../controllers/roadmapController');
const { getMedia, createMedia, deleteMedia } = require('../controllers/mediaController');
const {
  getMessages,
  markMessageRead,
  archiveMessage,
  deleteMessage,
} = require('../controllers/contactController');
const { getAdminSettings, updateSettings } = require('../controllers/settingsController');
const {
  getNotifications,
  markNotificationRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { getActivityLogs } = require('../controllers/activityLogController');
const { getAdminDashboardStats } = require('../controllers/adminController');

// All routes here are guarded by JWT Bearer Authentication
router.use('/admin', verifyToken);

// ─── Profile ────────────────────────────────────────────────
router.get('/admin/profile', getProfile);
router.put('/admin/profile', updateProfile);

// ─── About ──────────────────────────────────────────────────
router.get('/admin/about', getAbout);
router.put('/admin/about', updateAbout);

// ─── Projects CRUD ──────────────────────────────────────────
router.get('/admin/projects', getAdminProjects);
router.post('/admin/projects', createProject);
router.get('/admin/projects/:id', getProjectById);
router.put('/admin/projects/:id', updateProject);
router.patch('/admin/projects/:id', updateProject);
router.delete('/admin/projects/:id', deleteProject);

// ─── Skills CRUD ────────────────────────────────────────────
router.get('/admin/skills', getAdminSkills);
router.post('/admin/skills', createSkill);
router.get('/admin/skills/:id', getSkillById);
router.put('/admin/skills/:id', updateSkill);
router.patch('/admin/skills/:id', updateSkill);
router.delete('/admin/skills/:id', deleteSkill);

// ─── Experience CRUD ────────────────────────────────────────
router.get('/admin/experience', getAdminExperience);
router.post('/admin/experience', createExperience);
router.put('/admin/experience/:id', updateExperience);
router.patch('/admin/experience/:id', updateExperience);
router.delete('/admin/experience/:id', deleteExperience);

// ─── Education CRUD ─────────────────────────────────────────
router.get('/admin/education', getAdminEducation);
router.post('/admin/education', createEducation);
router.put('/admin/education/:id', updateEducation);
router.patch('/admin/education/:id', updateEducation);
router.delete('/admin/education/:id', deleteEducation);

// ─── Certificates CRUD ──────────────────────────────────────
router.get('/admin/certificates', getAdminCertificates);
router.post('/admin/certificates', createCertificate);
router.put('/admin/certificates/:id', updateCertificate);
router.patch('/admin/certificates/:id', updateCertificate);
router.delete('/admin/certificates/:id', deleteCertificate);

// ─── Roadmap CRUD ───────────────────────────────────────────
router.get('/admin/roadmap', getAdminRoadmap);
router.post('/admin/roadmap', createRoadmap);
router.get('/admin/roadmap/:id', getRoadmapById);
router.put('/admin/roadmap/:id', updateRoadmap);
router.patch('/admin/roadmap/:id', updateRoadmap);
router.delete('/admin/roadmap/:id', deleteRoadmap);

// ─── Media Library ──────────────────────────────────────────
router.get('/admin/media', getMedia);
router.post('/admin/media', createMedia);
router.delete('/admin/media/:id', deleteMedia);

// ─── Messages & Inquiries ───────────────────────────────────
router.get('/admin/messages', getMessages);
router.put('/admin/messages/:id/read', markMessageRead);
router.patch('/admin/messages/:id/read', markMessageRead);
router.put('/admin/messages/:id/archive', archiveMessage);
router.patch('/admin/messages/:id/archive', archiveMessage);
router.delete('/admin/messages/:id', deleteMessage);

// ─── Settings ───────────────────────────────────────────────
router.get('/admin/settings', getAdminSettings);
router.put('/admin/settings', updateSettings);
router.patch('/admin/settings', updateSettings);

// ─── Notifications ──────────────────────────────────────────
router.get('/admin/notifications', getNotifications);
router.patch('/admin/notifications/:id/read', markNotificationRead);
router.put('/admin/notifications/:id/read', markNotificationRead);
router.delete('/admin/notifications/:id', deleteNotification);

// ─── Activity Audit Log ─────────────────────────────────────
router.get('/admin/activity', getActivityLogs);

// ─── Telemetry & Dashboard ──────────────────────────────────
router.get('/admin/dashboard', getAdminDashboardStats);
router.get('/admin/analytics', getAdminDashboardStats);

module.exports = router;
