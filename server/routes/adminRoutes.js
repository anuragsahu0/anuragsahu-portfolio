const express = require('express');
const router = express.Router();
const { verifyToken, requirePermission } = require('../middleware/auth');
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
const {
  getRevisions,
  getRevisionByVersion,
  compareRevisions,
  restoreRevision,
} = require('../controllers/revisionController');
const {
  autosaveDraft,
  getDraft,
  discardDraft,
} = require('../controllers/draftController');
const {
  generatePreviewToken,
  getPreviewSiteData,
} = require('../controllers/previewController');
const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  cancelSchedule,
  retrySchedule,
  deleteSchedule,
  getCalendarEvents,
  getSchedulerHealth,
  runSchedulerNow,
  bulkSchedule,
} = require('../controllers/scheduleController');
const {
  createBackup,
  getBackups,
  getBackupById,
  verifyBackup,
  restoreBackup,
  downloadBackup,
  deleteBackup,
  getBackupHealth,
  getBackupSettings,
  updateBackupSettings,
  getSystemHealth,
} = require('../controllers/backupController');

// Phase 14: Access Management & Security Controllers
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  resendInvitation,
  getPermissions,
  getRoles,
  createRole,
  updateRole,
  duplicateRole,
  deleteRole,
} = require('../controllers/accessController');
const {
  getSessions,
  revokeSession,
  revokeOtherSessions,
  getSecurityEvents,
  getLoginHistory,
  getSecurityDashboard,
  getSecuritySettings,
  updateSecuritySettings,
  runCleanup,
  changePassword,
} = require('../controllers/securityController');

// Phase 15: Global Search, Command Center & Bulk Operations
const {
  globalSearch,
  getRecentItems,
  addRecentItem,
  clearRecentItems,
  getPinnedItems,
  addPinnedItem,
  removePinnedItem,
} = require('../controllers/searchController');
const {
  bulkProjects,
  bulkMessages,
  bulkMedia,
} = require('../controllers/bulkController');

// All routes here are guarded by JWT Bearer Authentication
router.use('/admin', verifyToken);

// ─── Hero ───────────────────────────────────────────────────
router.get('/admin/hero', requirePermission('profile.view'), getHero);
router.put('/admin/hero', requirePermission('profile.edit'), updateHero);
router.patch('/admin/hero', requirePermission('profile.edit'), updateHero);

// ─── Profile ────────────────────────────────────────────────
router.get('/admin/profile', requirePermission('profile.view'), getProfile);
router.put('/admin/profile', requirePermission('profile.edit'), updateProfile);

// ─── About ──────────────────────────────────────────────────
router.get('/admin/about', requirePermission('about.view'), getAbout);
router.put('/admin/about', requirePermission('about.edit'), updateAbout);

// ─── Projects CRUD + Reorder ────────────────────────────────
router.get('/admin/projects', requirePermission('projects.view'), getAdminProjects);
router.post('/admin/projects', requirePermission('projects.create'), createProject);
router.put('/admin/projects/reorder', requirePermission('projects.edit'), reorderProjects);
router.get('/admin/projects/:id', requirePermission('projects.view'), getProjectById);
router.put('/admin/projects/:id', requirePermission('projects.edit'), updateProject);
router.patch('/admin/projects/:id', requirePermission('projects.edit'), updateProject);
router.delete('/admin/projects/:id', requirePermission('projects.delete'), deleteProject);
router.post('/admin/projects/:id/duplicate', requirePermission('projects.create'), duplicateProject);
router.patch('/admin/projects/:id/status', requirePermission('projects.publish'), updateProjectStatus);

// ─── Skills CRUD + Reorder ──────────────────────────────────
router.get('/admin/skills', requirePermission('skills.view'), getAdminSkills);
router.post('/admin/skills', requirePermission('skills.edit'), createSkill);
router.put('/admin/skills/reorder', requirePermission('skills.edit'), reorderSkills);
router.get('/admin/skills/:id', requirePermission('skills.view'), getSkillById);
router.put('/admin/skills/:id', requirePermission('skills.edit'), updateSkill);
router.patch('/admin/skills/:id', requirePermission('skills.edit'), updateSkill);
router.delete('/admin/skills/:id', requirePermission('skills.edit'), deleteSkill);

// ─── Experience CRUD + Reorder ──────────────────────────────
router.get('/admin/experience', requirePermission('experience.view'), getAdminExperience);
router.post('/admin/experience', requirePermission('experience.edit'), createExperience);
router.put('/admin/experience/reorder', requirePermission('experience.edit'), reorderExperience);
router.put('/admin/experience/:id', requirePermission('experience.edit'), updateExperience);
router.patch('/admin/experience/:id', requirePermission('experience.edit'), updateExperience);
router.delete('/admin/experience/:id', requirePermission('experience.edit'), deleteExperience);

// ─── Education CRUD + Reorder ───────────────────────────────
router.get('/admin/education', requirePermission('education.view'), getAdminEducation);
router.post('/admin/education', requirePermission('education.edit'), createEducation);
router.put('/admin/education/reorder', requirePermission('education.edit'), reorderEducation);
router.put('/admin/education/:id', requirePermission('education.edit'), updateEducation);
router.patch('/admin/education/:id', requirePermission('education.edit'), updateEducation);
router.delete('/admin/education/:id', requirePermission('education.edit'), deleteEducation);

// ─── Certificates CRUD + Reorder ────────────────────────────
router.get('/admin/certificates', requirePermission('certificates.view'), getAdminCertificates);
router.post('/admin/certificates', requirePermission('certificates.edit'), createCertificate);
router.put('/admin/certificates/reorder', requirePermission('certificates.edit'), reorderCertificates);
router.put('/admin/certificates/:id', requirePermission('certificates.edit'), updateCertificate);
router.patch('/admin/certificates/:id', requirePermission('certificates.edit'), updateCertificate);
router.delete('/admin/certificates/:id', requirePermission('certificates.edit'), deleteCertificate);

// ─── Roadmap CRUD + Reorder ─────────────────────────────────
router.get('/admin/roadmap', requirePermission('roadmap.view'), getAdminRoadmap);
router.post('/admin/roadmap', requirePermission('roadmap.edit'), createRoadmap);
router.put('/admin/roadmap/reorder', requirePermission('roadmap.edit'), reorderRoadmap);
router.get('/admin/roadmap/:id', requirePermission('roadmap.view'), getRoadmapById);
router.put('/admin/roadmap/:id', requirePermission('roadmap.edit'), updateRoadmap);
router.patch('/admin/roadmap/:id', requirePermission('roadmap.edit'), updateRoadmap);
router.delete('/admin/roadmap/:id', requirePermission('roadmap.edit'), deleteRoadmap);

// ─── Navigation CRUD + Reorder ──────────────────────────────
router.get('/admin/navigation', requirePermission('settings.view'), getAdminNavigation);
router.post('/admin/navigation', requirePermission('settings.edit'), createNavigation);
router.put('/admin/navigation/reorder', requirePermission('settings.edit'), reorderNavigation);
router.put('/admin/navigation/:id', requirePermission('settings.edit'), updateNavigation);
router.patch('/admin/navigation/:id', requirePermission('settings.edit'), updateNavigation);
router.delete('/admin/navigation/:id', requirePermission('settings.edit'), deleteNavigation);

// ─── Social Links CRUD + Reorder ────────────────────────────
router.get('/admin/social-links', requirePermission('settings.view'), getAdminSocialLinks);
router.post('/admin/social-links', requirePermission('settings.edit'), createSocialLink);
router.put('/admin/social-links/reorder', requirePermission('settings.edit'), reorderSocialLinks);
router.put('/admin/social-links/:id', requirePermission('settings.edit'), updateSocialLink);
router.patch('/admin/social-links/:id', requirePermission('settings.edit'), updateSocialLink);
router.delete('/admin/social-links/:id', requirePermission('settings.edit'), deleteSocialLink);

// ─── Media Library ──────────────────────────────────────────
router.get('/admin/media', requirePermission('media.view'), getMedia);
router.post('/admin/media/upload', requirePermission('media.upload'), upload.single('file'), uploadMedia);
router.post('/admin/media', requirePermission('media.upload'), upload.single('file'), uploadMedia);
router.get('/admin/media/:id/usage', requirePermission('media.view'), getMediaUsage);
router.get('/admin/media/:id', requirePermission('media.view'), getMediaById);
router.put('/admin/media/:id', requirePermission('media.upload'), updateMedia);
router.patch('/admin/media/:id', requirePermission('media.upload'), updateMedia);
router.delete('/admin/media/:id', requirePermission('media.delete'), deleteMedia);

// ─── Resume Management ──────────────────────────────────────
router.get('/admin/resume', requirePermission('resume.view'), getAdminResumes);
router.post('/admin/resume/upload', requirePermission('resume.manage'), upload.single('file'), uploadResume);
router.patch('/admin/resume/:id/activate', requirePermission('resume.manage'), setActiveResume);
router.delete('/admin/resume/:id', requirePermission('resume.manage'), deleteResume);

// ─── SEO Management ─────────────────────────────────────────
router.get('/admin/seo', requirePermission('seo.view'), getAdminSeo);
router.put('/admin/seo', requirePermission('seo.edit'), updateSeo);
router.patch('/admin/seo', requirePermission('seo.edit'), updateSeo);

// ─── Site Settings ──────────────────────────────────────────
router.get('/admin/settings', requirePermission('settings.view'), getAdminSettings);
router.put('/admin/settings', requirePermission('settings.edit'), updateSettings);
router.patch('/admin/settings', requirePermission('settings.edit'), updateSettings);

// ─── Messages & Inquiries ───────────────────────────────────
router.get('/admin/messages', requirePermission('messages.view'), getMessages);
router.get('/admin/messages/:id', requirePermission('messages.view'), getMessageById);
router.put('/admin/messages/:id/read', requirePermission('messages.manage'), markMessageRead);
router.patch('/admin/messages/:id/read', requirePermission('messages.manage'), markMessageRead);
router.put('/admin/messages/:id/unread', requirePermission('messages.manage'), markMessageUnread);
router.patch('/admin/messages/:id/unread', requirePermission('messages.manage'), markMessageUnread);
router.put('/admin/messages/:id/archive', requirePermission('messages.manage'), archiveMessage);
router.patch('/admin/messages/:id/archive', requirePermission('messages.manage'), archiveMessage);
router.put('/admin/messages/:id/status', requirePermission('messages.manage'), updateMessageStatus);
router.patch('/admin/messages/:id/status', requirePermission('messages.manage'), updateMessageStatus);
router.post('/admin/messages/:id/reply', requirePermission('messages.manage'), replyToMessage);
router.delete('/admin/messages/:id', requirePermission('messages.manage'), deleteMessage);

// ─── Notifications ──────────────────────────────────────────
router.get('/admin/notifications', requirePermission('notifications.view'), getNotifications);
router.post('/admin/notifications/read-all', requirePermission('notifications.view'), markAllNotificationsRead);
router.patch('/admin/notifications/read-all', requirePermission('notifications.view'), markAllNotificationsRead);
router.patch('/admin/notifications/:id/read', requirePermission('notifications.view'), markNotificationRead);
router.put('/admin/notifications/:id/read', requirePermission('notifications.view'), markNotificationRead);
router.delete('/admin/notifications/:id', requirePermission('notifications.view'), deleteNotification);

// ─── Activity Audit Log ─────────────────────────────────────
router.get('/admin/activity', requirePermission('activity.view'), getActivityLogs);

// ─── Telemetry, Dashboard, Health & Analytics ───────────────
router.get('/admin/dashboard', requirePermission('dashboard.view'), getAdminDashboardStats);
router.get('/admin/health', requirePermission('dashboard.view'), getAdminHealth);
router.get('/admin/analytics', requirePermission('analytics.view'), getAdminAnalytics);

// ─── Phase 11: Revisions & Rollback ─────────────────────────
router.get('/admin/revisions/:entity/:id', requirePermission('projects.view'), getRevisions);
router.get('/admin/revisions/:entity/:id/:version', requirePermission('projects.view'), getRevisionByVersion);
router.post('/admin/revisions/:entity/:id/compare', requirePermission('projects.view'), compareRevisions);
router.post('/admin/revisions/:entity/:id/restore', requirePermission('projects.edit'), restoreRevision);

// ─── Phase 11: Drafts & Autosave ────────────────────────────
router.post('/admin/draft/autosave', requirePermission('projects.edit'), autosaveDraft);
router.get('/admin/draft/:entity/:id', requirePermission('projects.view'), getDraft);
router.delete('/admin/draft/:entity/:id', requirePermission('projects.edit'), discardDraft);

// ─── Phase 11: Live Preview ─────────────────────────────────
router.post('/admin/preview/token', requirePermission('projects.view'), generatePreviewToken);
router.get('/admin/preview/site', requirePermission('projects.view'), getPreviewSiteData);

// ─── Phase 12: Automation & Scheduling ──────────────────────
router.get('/admin/schedules', requirePermission('schedules.view'), getSchedules);
router.post('/admin/schedules', requirePermission('schedules.manage'), createSchedule);
router.post('/admin/schedules/bulk', requirePermission('schedules.manage'), bulkSchedule);
router.get('/admin/schedules/calendar', requirePermission('schedules.view'), getCalendarEvents);
router.get('/admin/schedules/health', requirePermission('schedules.view'), getSchedulerHealth);
router.post('/admin/scheduler/run', requirePermission('schedules.manage'), runSchedulerNow);
router.get('/admin/schedules/:id', requirePermission('schedules.view'), getScheduleById);
router.patch('/admin/schedules/:id', requirePermission('schedules.manage'), updateSchedule);
router.put('/admin/schedules/:id', requirePermission('schedules.manage'), updateSchedule);
router.post('/admin/schedules/:id/cancel', requirePermission('schedules.manage'), cancelSchedule);
router.post('/admin/schedules/:id/retry', requirePermission('schedules.manage'), retrySchedule);
router.delete('/admin/schedules/:id', requirePermission('schedules.manage'), deleteSchedule);

// ─── Phase 13: Backup, Restore & Disaster Recovery ──────────
router.get('/admin/backups', requirePermission('backups.view'), getBackups);
router.post('/admin/backups', requirePermission('backups.create'), createBackup);
router.get('/admin/backups/health', requirePermission('backups.view'), getBackupHealth);
router.get('/admin/backups/settings', requirePermission('backups.view'), getBackupSettings);
router.put('/admin/backups/settings', requirePermission('backups.create'), updateBackupSettings);
router.patch('/admin/backups/settings', requirePermission('backups.create'), updateBackupSettings);
router.get('/admin/backups/:id', requirePermission('backups.view'), getBackupById);
router.post('/admin/backups/:id/verify', requirePermission('backups.view'), verifyBackup);
router.post('/admin/backups/:id/restore', requirePermission('backups.restore'), restoreBackup);
router.get('/admin/backups/:id/download', requirePermission('backups.view'), downloadBackup);
router.delete('/admin/backups/:id', requirePermission('backups.delete'), deleteBackup);

// ─── Phase 13: System Maintenance Center ────────────────────
router.get('/admin/system/health', requirePermission('security.view'), getSystemHealth);

// ─── Phase 14: Admin User Management ────────────────────────
router.get('/admin/users', requirePermission('users.view'), getUsers);
router.post('/admin/users', requirePermission('users.manage'), createUser);
router.put('/admin/users/:id', requirePermission('users.manage'), updateUser);
router.delete('/admin/users/:id', requirePermission('users.manage'), deleteUser);
router.post('/admin/users/:id/resend-invite', requirePermission('users.manage'), resendInvitation);

// ─── Phase 14: Role & Permission Management ─────────────────
router.get('/admin/permissions', requirePermission('users.view'), getPermissions);
router.get('/admin/roles', requirePermission('users.view'), getRoles);
router.post('/admin/roles', requirePermission('users.manage'), createRole);
router.put('/admin/roles/:id', requirePermission('users.manage'), updateRole);
router.post('/admin/roles/:id/duplicate', requirePermission('users.manage'), duplicateRole);
router.delete('/admin/roles/:id', requirePermission('users.manage'), deleteRole);

// ─── Phase 14: Security Center & Session Management ─────────
router.get('/admin/security/dashboard', requirePermission('security.view'), getSecurityDashboard);
router.get('/admin/security/sessions', requirePermission('security.view'), getSessions);
router.post('/admin/security/sessions/:id/revoke', requirePermission('security.manage'), revokeSession);
router.post('/admin/security/sessions/revoke-others', requirePermission('security.view'), revokeOtherSessions);
router.get('/admin/security/events', requirePermission('security.view'), getSecurityEvents);
router.get('/admin/security/login-history', requirePermission('security.view'), getLoginHistory);
router.get('/admin/security/settings', requirePermission('security.view'), getSecuritySettings);
router.put('/admin/security/settings', requirePermission('security.manage'), updateSecuritySettings);
router.post('/admin/security/cleanup', requirePermission('security.manage'), runCleanup);
router.post('/admin/security/change-password', changePassword);

// ─── Phase 15: Global Search & Command Center ────────────────
router.get('/admin/search', globalSearch);
router.get('/admin/preferences/recent', getRecentItems);
router.post('/admin/preferences/recent', addRecentItem);
router.delete('/admin/preferences/recent', clearRecentItems);
router.get('/admin/preferences/pinned', getPinnedItems);
router.post('/admin/preferences/pinned', addPinnedItem);
router.delete('/admin/preferences/pinned/:id', removePinnedItem);

// ─── Phase 15: Safe Bulk Operations ─────────────────────────
router.post('/admin/bulk/projects', requirePermission('projects.edit'), bulkProjects);
router.post('/admin/bulk/messages', requirePermission('messages.manage'), bulkMessages);
router.post('/admin/bulk/media', requirePermission('media.delete'), bulkMedia);

module.exports = router;
