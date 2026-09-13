const { isDbConnected } = require('../config/db');
const { hasPermission, sanitizeDetails } = require('../services/securityService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const {
  getRecentItemsForUser,
  addRecentItemForUser,
  clearRecentItemsForUser,
  getPinnedItemsForUser,
  addPinnedItemForUser,
  removePinnedItemForUser,
} = require('../utils/preferenceStore');

// Models
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Roadmap = require('../models/Roadmap');
const Media = require('../models/Media');
const Resume = require('../models/Resume');
const Contact = require('../models/Contact');
const ScheduledAction = require('../models/ScheduledAction');
const Revision = require('../models/Revision');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const Settings = require('../models/Settings');
const Hero = require('../models/Hero');
const Profile = require('../models/Profile');
const About = require('../models/About');
const Backup = require('../models/Backup');

// Fallback stores
const { IN_MEMORY_USERS, SECURITY_SETTINGS } = require('../utils/securityStore');
const { IN_MEMORY_SCHEDULES } = require('../utils/scheduleStore');
const { IN_MEMORY_BACKUPS } = require('../utils/backupStore');
const { FALLBACK_PROJECTS } = require('./projectController');
const { FALLBACK_SKILLS } = require('./skillController');
const { FALLBACK_EXPERIENCES } = require('./experienceController');
const { FALLBACK_EDUCATION } = require('./educationController');
const { FALLBACK_CERTIFICATES } = require('./certificateController');
const { FALLBACK_ROADMAP } = require('./roadmapController');

/**
 * Calculate relevance score for a search result item
 */
function scoreItem(item, queryLower) {
  let score = 0;
  const title = (item.title || item.name || item.fullName || item.filename || item.versionName || item.role || item.degree || '').toLowerCase();
  const slug = (item.slug || item.id || (item._id ? item._id.toString() : '')).toLowerCase();
  const desc = (item.description || item.subtitle || item.shortDescription || item.message || item.subject || item.company || item.institution || item.bio || item.altText || item.notes || item.changeSummary || '').toLowerCase();
  const meta = JSON.stringify(item.techStack || item.highlights || item.tags || item.technologies || []).toLowerCase();

  if (title === queryLower || slug === queryLower) score += 100;
  else if (title.startsWith(queryLower)) score += 80;
  else if (title.includes(queryLower)) score += 60;
  else if (slug.includes(queryLower)) score += 50;
  else if (desc.includes(queryLower)) score += 30;
  else if (meta.includes(queryLower)) score += 15;

  return score;
}

/**
 * Format search result item uniformly
 */
function formatResult(entityType, raw, queryLower) {
  const item = sanitizeDetails(raw.toObject ? raw.toObject() : { ...raw });
  const id = item._id ? item._id.toString() : (item.id || item.slug || Math.random().toString(36).substring(2));
  const title = item.title || item.name || item.fullName || item.filename || item.versionName || item.role || item.degree || item.action || 'Untitled';
  const subtitle = item.subtitle || item.shortDescription || item.subject || item.company || item.institution || item.category || item.email || item.entityType || '';
  const score = scoreItem(item, queryLower);

  return {
    id,
    entityType,
    title,
    subtitle,
    status: item.status || item.visibility || (item.isActive ? 'ACTIVE' : '') || '',
    slug: item.slug || item.id || '',
    tab: getTabForEntity(entityType),
    url: getUrlForEntity(entityType, id, item),
    score,
    raw: item,
  };
}

function getTabForEntity(type) {
  switch (type) {
    case 'PROJECT': return 'projects';
    case 'SKILL': return 'skills';
    case 'EXPERIENCE': return 'experience';
    case 'EDUCATION': return 'education';
    case 'CERTIFICATE': return 'certificates';
    case 'ROADMAP': return 'roadmap';
    case 'MEDIA': return 'media';
    case 'RESUME': return 'resume';
    case 'MESSAGE': return 'messages';
    case 'SCHEDULE': return 'schedules';
    case 'REVISION': return 'projects';
    case 'ACTIVITY': return 'activity';
    case 'USER': return 'access';
    case 'BACKUP': return 'backups';
    case 'SETTINGS': return 'settings';
    case 'HERO': return 'hero';
    case 'PROFILE': return 'profile';
    case 'ABOUT': return 'about';
    default: return 'dashboard';
  }
}

function getUrlForEntity(type, id, item) {
  switch (type) {
    case 'PROJECT': return `/admin?tab=projects&id=${item.slug || id}`;
    case 'MESSAGE': return `/admin?tab=messages&id=${id}`;
    case 'SCHEDULE': return `/admin?tab=schedules&id=${id}`;
    case 'BACKUP': return `/admin?tab=backups&id=${id}`;
    case 'REVISION': return `/admin?tab=projects&revision=${id}`;
    case 'USER': return `/admin?tab=access&userId=${id}`;
    default: return `/admin?tab=${getTabForEntity(type)}`;
  }
}

/**
 * GET /api/admin/search
 * Global Search endpoint across all CMS resources with server-side RBAC enforcement.
 */
const globalSearch = async (req, res, next) => {
  try {
    const q = (req.query.q || req.query.query || '').trim();
    const rawTarget = (req.query.type || req.query.category || 'all').toLowerCase().trim();
    const isCategory = (cat) => rawTarget === 'all' || rawTarget === cat || rawTarget === `${cat}s` || `${rawTarget}s` === cat;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 50);

    if (!q) {
      return sendSuccess(res, {
        query: '',
        totalResults: 0,
        categories: {},
        results: [],
      });
    }

    const role = req.user?.role || 'VIEWER';
    const queryLower = q.toLowerCase();
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    const canAccess = async (perm) => await hasPermission(role, perm);

    // Permission checks across all categories
    const permissions = {
      projects: await canAccess('projects.view'),
      skills: await canAccess('skills.view'),
      experience: await canAccess('experience.view'),
      education: await canAccess('education.view'),
      certificates: await canAccess('certificates.view'),
      roadmap: await canAccess('roadmap.view'),
      media: await canAccess('media.view'),
      resume: await canAccess('resume.view'),
      messages: await canAccess('messages.view'),
      schedules: await canAccess('schedules.view'),
      revisions: await canAccess('projects.view'),
      activity: await canAccess('activity.view'),
      users: await canAccess('users.view'),
      settings: await canAccess('settings.view'),
      content: await canAccess('dashboard.view'),
      backups: await canAccess('backups.view'),
    };

    const categories = {};
    const allResults = [];

    const isConnected = isDbConnected();

    // 1. PROJECTS
    if (permissions.projects && isCategory('project')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Project.find({
            $or: [{ title: rx }, { slug: rx }, { description: rx }, { subtitle: rx }, { techStack: rx }, { category: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      if (items.length === 0 && Array.isArray(FALLBACK_PROJECTS)) {
        items = FALLBACK_PROJECTS.filter(p => rx.test(p.title || '') || rx.test(p.slug || '') || rx.test(p.description || '') || rx.test(p.subtitle || '') || rx.test(p.category || ''));
      }
      categories.projects = items.map(p => formatResult('PROJECT', p, queryLower));
      allResults.push(...categories.projects);
    }

    // 2. SKILLS
    if (permissions.skills && isCategory('skill')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Skill.find({
            $or: [{ name: rx }, { category: rx }, { practicalUsage: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      if (items.length === 0 && Array.isArray(FALLBACK_SKILLS)) {
        items = FALLBACK_SKILLS.filter(s => rx.test(s.name || '') || rx.test(s.category || '') || rx.test(s.description || ''));
      }
      categories.skills = items.map(s => formatResult('SKILL', s, queryLower));
      allResults.push(...categories.skills);
    }

    // 3. EXPERIENCE
    if (permissions.experience && isCategory('experience')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Experience.find({
            $or: [{ role: rx }, { company: rx }, { description: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      if (items.length === 0 && Array.isArray(FALLBACK_EXPERIENCES)) {
        items = FALLBACK_EXPERIENCES.filter(e => rx.test(e.role || '') || rx.test(e.company || '') || rx.test(e.description || ''));
      }
      categories.experience = items.map(e => formatResult('EXPERIENCE', e, queryLower));
      allResults.push(...categories.experience);
    }

    // 4. EDUCATION
    if (permissions.education && isCategory('education')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Education.find({
            $or: [{ degree: rx }, { institution: rx }, { field: rx }, { location: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      if (items.length === 0 && Array.isArray(FALLBACK_EDUCATION)) {
        items = FALLBACK_EDUCATION.filter(e => rx.test(e.degree || '') || rx.test(e.institution || '') || rx.test(e.field || ''));
      }
      categories.education = items.map(e => formatResult('EDUCATION', e, queryLower));
      allResults.push(...categories.education);
    }

    // 5. CERTIFICATES
    if (permissions.certificates && isCategory('certificate')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Certificate.find({
            $or: [{ title: rx }, { issuer: rx }, { credentialId: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      if (items.length === 0 && Array.isArray(FALLBACK_CERTIFICATES)) {
        items = FALLBACK_CERTIFICATES.filter(c => rx.test(c.title || '') || rx.test(c.issuer || ''));
      }
      categories.certificates = items.map(c => formatResult('CERTIFICATE', c, queryLower));
      allResults.push(...categories.certificates);
    }

    // 6. ROADMAP
    if (permissions.roadmap && isCategory('roadmap')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Roadmap.find({
            $or: [{ title: rx }, { name: rx }, { description: rx }, { category: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      if (items.length === 0 && Array.isArray(FALLBACK_ROADMAP)) {
        items = FALLBACK_ROADMAP.filter(r => rx.test(r.title || '') || rx.test(r.name || '') || rx.test(r.description || ''));
      }
      categories.roadmap = items.map(r => formatResult('ROADMAP', r, queryLower));
      allResults.push(...categories.roadmap);
    }

    // 7. MEDIA
    if (permissions.media && isCategory('media')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Media.find({
            $or: [{ filename: rx }, { originalName: rx }, { altText: rx }, { caption: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      categories.media = items.map(m => formatResult('MEDIA', m, queryLower));
      allResults.push(...categories.media);
    }

    // 8. RESUME
    if (permissions.resume && isCategory('resume')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Resume.find({
            $or: [{ versionName: rx }, { filename: rx }, { targetRole: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      categories.resume = items.map(r => formatResult('RESUME', r, queryLower));
      allResults.push(...categories.resume);
    }

    // 9. MESSAGES
    if (permissions.messages && isCategory('message')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Contact.find({
            $or: [{ fullName: rx }, { email: rx }, { subject: rx }, { message: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      categories.messages = items.map(m => formatResult('MESSAGE', m, queryLower));
      allResults.push(...categories.messages);
    }

    // 10. SCHEDULES
    if (permissions.schedules && isCategory('schedule')) {
      let items = [];
      if (isConnected) {
        try {
          items = await ScheduledAction.find({
            $or: [{ entityName: rx }, { entityType: rx }, { action: rx }, { notes: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      } else {
        items = IN_MEMORY_SCHEDULES.filter(s =>
          rx.test(s.entityName || '') || rx.test(s.entityType || '') || rx.test(s.action || '') || rx.test(s.notes || '')
        );
      }
      categories.schedules = items.map(s => formatResult('SCHEDULE', s, queryLower));
      allResults.push(...categories.schedules);
    }

    // 11. REVISIONS
    if (permissions.revisions && isCategory('revision')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Revision.find({
            $or: [{ entityTitle: rx }, { entityType: rx }, { changeSummary: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      categories.revisions = items.map(r => formatResult('REVISION', r, queryLower));
      allResults.push(...categories.revisions);
    }

    // 12. ACTIVITY
    if (permissions.activity && isCategory('activity')) {
      let items = [];
      if (isConnected) {
        try {
          items = await ActivityLog.find({
            $or: [{ description: rx }, { action: rx }, { resourceType: rx }, { userEmail: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      }
      categories.activity = items.map(a => formatResult('ACTIVITY', a, queryLower));
      allResults.push(...categories.activity);
    }

    // 13. USERS (Strict Credential Scrubbing)
    if (permissions.users && isCategory('user')) {
      let items = [];
      if (isConnected) {
        try {
          items = await User.find({
            $or: [{ name: rx }, { email: rx }, { role: rx }],
          }).select('-password -tokens').limit(limit * 2);
        } catch (_) {}
      } else {
        items = IN_MEMORY_USERS.filter(u => rx.test(u.name || '') || rx.test(u.email || '') || rx.test(u.role || ''));
      }
      categories.users = items.map(u => formatResult('USER', u, queryLower));
      allResults.push(...categories.users);
    }

    // 14. BACKUPS
    if (permissions.backups && isCategory('backup')) {
      let items = [];
      if (isConnected) {
        try {
          items = await Backup.find({
            $or: [{ backupId: rx }, { type: rx }, { status: rx }, { notes: rx }],
          }).limit(limit * 2);
        } catch (_) {}
      } else {
        items = IN_MEMORY_BACKUPS.filter(b => rx.test(b.backupId || '') || rx.test(b.type || '') || rx.test(b.notes || ''));
      }
      categories.backups = items.map(b => formatResult('BACKUP', b, queryLower));
      allResults.push(...categories.backups);
    }

    // 15. SETTINGS & CONTENT
    if (permissions.content && isCategory('content')) {
      let contentItems = [];
      if (isConnected) {
        try {
          const [hero, profile, about] = await Promise.all([
            Hero.findOne({ $or: [{ greeting: rx }, { headline: rx }, { subheadline: rx }] }),
            Profile.findOne({ $or: [{ fullName: rx }, { title: rx }, { shortBio: rx }] }),
            About.findOne({ $or: [{ intro: rx }, { story: rx }] }),
          ]);
          if (hero) contentItems.push(formatResult('HERO', { ...hero.toObject(), title: 'Hero Section: ' + (hero.headline || '') }, queryLower));
          if (profile) contentItems.push(formatResult('PROFILE', { ...profile.toObject(), title: 'Profile: ' + (profile.fullName || '') }, queryLower));
          if (about) contentItems.push(formatResult('ABOUT', { ...about.toObject(), title: 'About Section' }, queryLower));
        } catch (_) {}
      }
      if (contentItems.length) {
        categories.content = contentItems;
        allResults.push(...contentItems);
      }
    }

    // Sort category results and slice by limit
    for (const [key, list] of Object.entries(categories)) {
      list.sort((a, b) => b.score - a.score);
      categories[key] = list.slice(0, limit);
    }

    // Global ranked list
    allResults.sort((a, b) => b.score - a.score);
    const topResults = allResults.slice(0, limit * 4);

    return sendSuccess(res, {
      query: q,
      totalResults: allResults.length,
      categories,
      results: topResults,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/admin/preferences/recent
 */
const getRecentItems = (req, res) => {
  const userKey = req.user?.email || req.user?.id || 'admin';
  const recents = getRecentItemsForUser(userKey);
  return sendSuccess(res, recents);
};

/**
 * POST /api/admin/preferences/recent
 */
const addRecentItem = (req, res) => {
  const userKey = req.user?.email || req.user?.id || 'admin';
  const { title, subtitle, url, action, tab } = req.body || {};
  const entityType = req.body?.entityType || req.body?.category || 'GENERAL';
  const entityId = req.body?.entityId || req.body?.id;
  if (!entityId) {
    return sendError(res, 'entityId (or id) is required', 400);
  }
  const updated = addRecentItemForUser(userKey, { entityType, entityId, title, subtitle, url, action, tab });
  return sendSuccess(res, updated);
};

/**
 * DELETE /api/admin/preferences/recent
 */
const clearRecentItems = (req, res) => {
  const userKey = req.user?.email || req.user?.id || 'admin';
  clearRecentItemsForUser(userKey);
  return sendSuccess(res, { message: 'Recent items cleared' });
};

/**
 * GET /api/admin/preferences/pinned
 */
const getPinnedItems = (req, res) => {
  const userKey = req.user?.email || req.user?.id || 'admin';
  const pinned = getPinnedItemsForUser(userKey);
  return sendSuccess(res, pinned);
};

/**
 * POST /api/admin/preferences/pinned
 */
const addPinnedItem = (req, res) => {
  const userKey = req.user?.email || req.user?.id || 'admin';
  const { title, subtitle, url, tab, icon, id } = req.body || {};
  const entityType = req.body?.entityType || req.body?.category || 'GENERAL';
  const entityId = req.body?.entityId || id || req.body?.id;
  const updated = addPinnedItemForUser(userKey, { entityType, entityId, title, subtitle, url, tab, icon, id: id || entityId });
  return sendSuccess(res, updated);
};

/**
 * DELETE /api/admin/preferences/pinned/:id
 */
const removePinnedItem = (req, res) => {
  const userKey = req.user?.email || req.user?.id || 'admin';
  const pinId = req.params.id;
  const updated = removePinnedItemForUser(userKey, pinId);
  return sendSuccess(res, updated);
};

module.exports = {
  globalSearch,
  getRecentItems,
  addRecentItem,
  clearRecentItems,
  getPinnedItems,
  addPinnedItem,
  removePinnedItem,
  scoreItem,
  formatResult,
};
