const Contact = require('../models/Contact');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Roadmap = require('../models/Roadmap');
const Media = require('../models/Media');
const Resume = require('../models/Resume');
const Settings = require('../models/Settings');
const Profile = require('../models/Profile');
const Hero = require('../models/Hero');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const LoginHistory = require('../models/LoginHistory');
const { checkSystemHealth } = require('../services/healthService');
const { parseUserAgent } = require('./analyticsController');

// Memory fallbacks for offline DB mode
const memoryLogs = [];
const memoryLoginHistory = [];

/**
 * Log an Admin Activity Event
 */
const logActivity = async (action, targetCollection, details = {}, req = null) => {
  const resourceType = targetCollection || '';
  const logEntry = {
    _id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    adminId: req?.user?.id || 'admin',
    adminEmail: req?.user?.email || 'admin@anuragsahu.dev',
    action,
    resourceType,
    targetCollection,
    details,
    metadata: details,
    ipAddress: req ? req.ip || req.headers['x-forwarded-for'] || '127.0.0.1' : '127.0.0.1',
    createdAt: new Date(),
  };

  memoryLogs.push(logEntry);
  if (memoryLogs.length > 500) memoryLogs.shift();

  try {
    if (ActivityLog.db && ActivityLog.db.readyState === 1) {
      await ActivityLog.create(logEntry);
    }
  } catch (err) {}
};

/**
 * Log a Login Security Event
 */
const logLoginEvent = async (email, status, req) => {
  const ua = req.headers['user-agent'] || '';
  const parsed = parseUserAgent(ua);
  const entry = {
    _id: `login-${Date.now()}`,
    email,
    status,
    ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
    userAgent: ua,
    deviceType: parsed.deviceType,
    browser: parsed.browser,
    os: parsed.os,
    createdAt: new Date(),
  };

  memoryLoginHistory.push(entry);
  if (memoryLoginHistory.length > 200) memoryLoginHistory.shift();

  try {
    if (LoginHistory.db && LoginHistory.db.readyState === 1) {
      await LoginHistory.create(entry);
    }
  } catch (err) {}
};

/**
 * GET /api/admin/dashboard
 * Real, data-driven Control Center Dashboard
 * Zero hardcoded scores, zero fake numbers.
 */
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const isDbConnected = Boolean(Contact.db && Contact.db.readyState === 1);

    // 1. Parallel Database Queries for Content Overview & Project Breakdowns
    let totalProjects = 0;
    let publishedProjects = 0;
    let draftProjects = 0;
    let featuredProjects = 0;
    let projectsByStatus = {
      WORKING: 0,
      COMPLETED: 0,
      COMING_SOON: 0,
      PAUSED: 0,
      ARCHIVED: 0,
    };
    let recentProjects = [];

    let totalSkills = 0;
    let totalExperience = 0;
    let totalEducation = 0;
    let totalCertificates = 0;
    let totalRoadmap = 0;
    let totalMedia = 0;
    let totalMediaBytes = 0;
    let activeResume = null;

    let contactCounts = {
      total: 0,
      unread: 0,
      replied: 0,
      archived: 0,
      spam: 0,
      failedDeliveries: 0,
    };
    let unreadNotifications = 0;
    let recentContacts = [];
    let recentActivity = [];

    let seoSettings = null;
    let profileDoc = null;
    let heroDoc = null;

    if (isDbConnected) {
      try {
        const [
          projTotal,
          projPublished,
          projDraft,
          projFeatured,
          projWorking,
          projCompleted,
          projComingSoon,
          projPaused,
          projArchived,
          recProjects,
          skillsCount,
          expCount,
          eduCount,
          certCount,
          roadmapCount,
          mediaCount,
          mediaSizeAgg,
          currentResume,
          totalC,
          unreadC,
          repliedC,
          archivedC,
          spamC,
          failedEmailC,
          unreadN,
          recContacts,
          recLogs,
          seoData,
          profileData,
          heroData,
        ] = await Promise.all([
          Project.countDocuments().catch(() => 0),
          Project.countDocuments({ visibility: 'PUBLISHED' }).catch(() => 0),
          Project.countDocuments({ visibility: 'DRAFT' }).catch(() => 0),
          Project.countDocuments({ featured: true }).catch(() => 0),
          Project.countDocuments({ status: 'WORKING' }).catch(() => 0),
          Project.countDocuments({ status: 'COMPLETED' }).catch(() => 0),
          Project.countDocuments({ status: 'COMING_SOON' }).catch(() => 0),
          Project.countDocuments({ status: 'PAUSED' }).catch(() => 0),
          Project.countDocuments({ status: 'ARCHIVED' }).catch(() => 0),
          Project.find()
            .sort({ updatedAt: -1, createdAt: -1 })
            .limit(5)
            .select('title slug id thumbnail status visibility featured updatedAt')
            .catch(() => []),
          Skill.countDocuments({ isActive: true }).catch(() => 0),
          Experience.countDocuments().catch(() => 0),
          Education.countDocuments().catch(() => 0),
          Certificate.countDocuments().catch(() => 0),
          Roadmap.countDocuments().catch(() => 0),
          Media.countDocuments().catch(() => 0),
          Media.aggregate([{ $group: { _id: null, totalBytes: { $sum: '$size' } } }]).catch(() => []),
          Resume.findOne({ status: 'ACTIVE' }).catch(() => null),
          Contact.countDocuments().catch(() => 0),
          Contact.countDocuments({ status: { $in: ['NEW', 'unread', 'UNREAD'] } }).catch(() => 0),
          Contact.countDocuments({ status: { $in: ['REPLIED', 'replied'] } }).catch(() => 0),
          Contact.countDocuments({ status: { $in: ['ARCHIVED', 'archived'] } }).catch(() => 0),
          Contact.countDocuments({ status: { $in: ['SPAM', 'spam'] } }).catch(() => 0),
          Contact.countDocuments({ emailNotificationStatus: 'FAILED' }).catch(() => 0),
          Notification.countDocuments({ isRead: false }).catch(() => 0),
          Contact.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name fullName email subject status isRead createdAt')
            .catch(() => []),
          ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('action resourceType targetCollection adminEmail createdAt details')
            .catch(() => []),
          Settings.findOne({ singletonId: 'global' }).catch(() => null),
          Profile.findOne().catch(() => null),
          Hero.findOne().catch(() => null),
        ]);

        totalProjects = projTotal;
        publishedProjects = projPublished;
        draftProjects = projDraft;
        featuredProjects = projFeatured;
        projectsByStatus = {
          WORKING: projWorking,
          COMPLETED: projCompleted,
          COMING_SOON: projComingSoon,
          PAUSED: projPaused,
          ARCHIVED: projArchived,
        };
        recentProjects = recProjects;
        totalSkills = skillsCount;
        totalExperience = expCount;
        totalEducation = eduCount;
        totalCertificates = certCount;
        totalRoadmap = roadmapCount;
        totalMedia = mediaCount;
        totalMediaBytes = mediaSizeAgg && mediaSizeAgg[0] ? mediaSizeAgg[0].totalBytes : 0;
        activeResume = currentResume;
        contactCounts = {
          total: totalC,
          unread: unreadC,
          replied: repliedC,
          archived: archivedC,
          spam: spamC,
          failedDeliveries: failedEmailC,
        };
        unreadNotifications = unreadN;
        recentContacts = recContacts;
        recentActivity = recLogs;
        seoSettings = seoData;
        profileDoc = profileData;
        heroDoc = heroData;
      } catch (dbErr) {
        console.warn('[Dashboard] Aggregation warning:', dbErr.message);
      }
    } else {
      // Memory fallback for activity logs
      recentActivity = memoryLogs.slice(-10).reverse();
    }

    // 2. Real System Health Diagnostic Probes
    const healthResult = await checkSystemHealth();

    // 3. Dynamic "Needs Attention" Checklist Engine (strictly real conditions)
    const attentionItems = [];

    if (contactCounts.unread > 0) {
      attentionItems.push({
        id: 'unread-messages',
        type: 'warning',
        title: `${contactCounts.unread} unread contact inquiry${contactCounts.unread > 1 ? 'ies' : ''} awaiting review`,
        tab: 'messages',
        link: '/admin/messages',
        actionText: 'View Inbox',
      });
    }

    if (contactCounts.failedDeliveries > 0) {
      attentionItems.push({
        id: 'failed-email-delivery',
        type: 'warning',
        title: `${contactCounts.failedDeliveries} contact inquiry notification(s) failed SMTP delivery`,
        tab: 'messages',
        link: '/admin/messages',
        actionText: 'Review Inquiries',
      });
    }

    if (!activeResume) {
      attentionItems.push({
        id: 'missing-active-resume',
        type: 'caution',
        title: 'No active ATS resume PDF designated for public download',
        tab: 'resume',
        link: '/admin/resume',
        actionText: 'Upload Resume',
      });
    }

    if (draftProjects > 0) {
      attentionItems.push({
        id: 'draft-projects',
        type: 'info',
        title: `${draftProjects} project(s) currently saved as draft (not visible on public portfolio)`,
        tab: 'projects',
        link: '/admin/projects',
        actionText: 'Manage Projects',
      });
    }

    if (seoSettings) {
      if (!seoSettings.seoDescription || seoSettings.seoDescription.trim() === '') {
        attentionItems.push({
          id: 'missing-seo-description',
          type: 'info',
          title: 'Meta description for search engine optimization is empty',
          tab: 'seo',
          link: '/admin/seo',
          actionText: 'Configure SEO',
        });
      }
      if (!seoSettings.ogImage || seoSettings.ogImage.trim() === '') {
        attentionItems.push({
          id: 'missing-og-image',
          type: 'info',
          title: 'Open Graph social share preview image is not configured',
          tab: 'seo',
          link: '/admin/seo',
          actionText: 'Set OG Image',
        });
      }
    }

    if (healthResult.overallStatus !== 'HEALTHY') {
      attentionItems.push({
        id: 'system-degraded',
        type: 'warning',
        title: `System service health is currently ${healthResult.overallStatus.toLowerCase()}`,
        tab: 'dashboard',
        link: '#system-health-section',
        actionText: 'View Health',
      });
    }

    // 4. Content Health Audit
    const contentHealth = {
      profileComplete: Boolean(profileDoc && profileDoc.name && profileDoc.headline),
      heroComplete: Boolean(heroDoc && heroDoc.headline && heroDoc.primaryCtaText),
      hasActiveResume: Boolean(activeResume),
      seoComplete: Boolean(seoSettings && seoSettings.seoTitle && seoSettings.seoDescription && seoSettings.ogImage),
      publishedProjectsCount: publishedProjects,
      publishedSkillsCount: totalSkills,
    };

    return res.status(200).json({
      success: true,
      candidate: 'Anurag Sahu',
      systemHealth: healthResult,
      stats: {
        totalProjects,
        publishedProjects,
        contactSubmissions: contactCounts.total,
        unreadContacts: contactCounts.unread,
        unreadNotifications,
        totalSkills,
        totalCertificates,
      },
      summaryCards: {
        totalProjects,
        publishedProjects,
        unreadContacts: contactCounts.unread,
        publishedSkills: totalSkills,
        totalCertificates,
        activeResumeStatus: activeResume ? `${activeResume.version || 'Active'} (${activeResume.title || 'ATS Resume'})` : 'Missing',
        hasActiveResume: Boolean(activeResume),
      },
      contentOverview: {
        projects: totalProjects,
        skills: totalSkills,
        experience: totalExperience,
        education: totalEducation,
        certificates: totalCertificates,
        roadmap: totalRoadmap,
        mediaFiles: totalMedia,
        mediaStorageBytes: totalMediaBytes,
      },
      projectOverview: {
        total: totalProjects,
        published: publishedProjects,
        draft: draftProjects,
        featured: featuredProjects,
        byStatus: projectsByStatus,
      },
      communicationOverview: {
        total: contactCounts.total,
        unread: contactCounts.unread,
        replied: contactCounts.replied,
        archived: contactCounts.archived,
        spam: contactCounts.spam,
        failedDeliveries: contactCounts.failedDeliveries,
        unreadNotifications,
      },
      recentProjects,
      recentContacts,
      recentActivityLogs: recentActivity,
      needsAttention: {
        allGood: attentionItems.length === 0,
        items: attentionItems,
      },
      contentHealth,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/messages
 */
const getMessages = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    let messages = [];
    let total = 0;

    try {
      if (Contact.db && Contact.db.readyState === 1) {
        const filter = {};
        if (status) filter.status = status;
        const skip = (Number(page) - 1) * Number(limit);
        [messages, total] = await Promise.all([
          Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
          Contact.countDocuments(filter),
        ]);
      }
    } catch (dbErr) {}

    return res.status(200).json({ success: true, total, page: Number(page), messages });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/messages/:id/read
 */
const markMessageRead = async (req, res, next) => {
  try {
    await logActivity('MESSAGE_MARKED_READ', 'Contact', { messageId: req.params.id }, req);
    try {
      if (Contact.db && Contact.db.readyState === 1) {
        const message = await Contact.findByIdAndUpdate(
          req.params.id,
          { status: 'READ', isRead: true, readAt: new Date() },
          { new: true }
        );
        if (message) return res.status(200).json({ success: true, message });
      }
    } catch (dbErr) {}

    return res.status(200).json({ success: true, message: { _id: req.params.id, status: 'READ', isRead: true } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/messages/:id/archive
 */
const archiveMessage = async (req, res, next) => {
  try {
    await logActivity('MESSAGE_ARCHIVED', 'Contact', { messageId: req.params.id }, req);
    try {
      if (Contact.db && Contact.db.readyState === 1) {
        const message = await Contact.findByIdAndUpdate(req.params.id, { status: 'ARCHIVED' }, { new: true });
        if (message) return res.status(200).json({ success: true, message });
      }
    } catch (dbErr) {}

    return res.status(200).json({ success: true, message: { _id: req.params.id, status: 'ARCHIVED' } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/logs
 */
const getActivityLogs = async (req, res, next) => {
  try {
    let logs = memoryLogs;
    try {
      if (ActivityLog.db && ActivityLog.db.readyState === 1) {
        logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
      }
    } catch (e) {}

    return res.status(200).json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminDashboardStats,
  getMessages,
  markMessageRead,
  archiveMessage,
  getActivityLogs,
  logActivity,
  logLoginEvent,
};
