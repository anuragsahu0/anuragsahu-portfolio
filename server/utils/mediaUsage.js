const Profile = require('../models/Profile');
const Hero = require('../models/Hero');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const About = require('../models/About');
const Settings = require('../models/Settings');
const Resume = require('../models/Resume');

/**
 * Scan all CMS entities to see where a media asset is currently referenced.
 * Matches by exact URL or fileName substring.
 */
async function findMediaUsage(media) {
  if (!media) return [];
  const url = media.url || '';
  const fileName = media.fileName || '';
  const usages = [];

  try {
    // 1. Check Profile
    if (Profile.db && Profile.db.readyState === 1) {
      const profile = await Profile.findOne().lean();
      if (profile) {
        if (profile.profileImage && (profile.profileImage === url || profile.profileImage.includes(fileName))) {
          usages.push({ module: 'Profile', field: 'profileImage', title: 'Main Profile Image', refId: profile._id });
        }
        if (profile.secondaryImage && (profile.secondaryImage === url || profile.secondaryImage.includes(fileName))) {
          usages.push({ module: 'Profile', field: 'secondaryImage', title: 'Secondary Profile Image', refId: profile._id });
        }
        if (profile.resumeUrl && (profile.resumeUrl === url || profile.resumeUrl.includes(fileName))) {
          usages.push({ module: 'Profile', field: 'resumeUrl', title: 'Profile Resume Link', refId: profile._id });
        }
      }
    }

    // 2. Check Hero
    if (Hero.db && Hero.db.readyState === 1) {
      const hero = await Hero.findOne().lean();
      if (hero) {
        if (hero.profileImage && (hero.profileImage === url || hero.profileImage.includes(fileName))) {
          usages.push({ module: 'Hero', field: 'profileImage', title: 'Hero Section Avatar', refId: hero._id });
        }
        if (hero.secondaryCtaUrl && (hero.secondaryCtaUrl === url || hero.secondaryCtaUrl.includes(fileName))) {
          usages.push({ module: 'Hero', field: 'secondaryCtaUrl', title: 'Hero Resume CTA Link', refId: hero._id });
        }
      }
    }

    // 3. Check Projects
    if (Project.db && Project.db.readyState === 1) {
      const projects = await Project.find({
        $or: [
          { image: url },
          { image: new RegExp(fileName, 'i') },
          { thumbnail: url },
          { thumbnail: new RegExp(fileName, 'i') },
        ],
      }).lean();

      projects.forEach((p) => {
        usages.push({ module: 'Project', field: 'image', title: `Project: ${p.title || p.id}`, refId: p._id });
      });
    }

    // 4. Check Certificates
    if (Certificate.db && Certificate.db.readyState === 1) {
      const certs = await Certificate.find({
        $or: [
          { credentialUrl: url },
          { credentialUrl: new RegExp(fileName, 'i') },
          { certificateUrl: url },
        ],
      }).lean();

      certs.forEach((c) => {
        usages.push({ module: 'Certificate', field: 'credentialUrl', title: `Certificate: ${c.title || c.name}`, refId: c._id });
      });
    }

    // 5. Check Settings
    if (Settings.db && Settings.db.readyState === 1) {
      const settings = await Settings.findOne({ singletonId: 'global' }).lean();
      if (settings) {
        if (settings.ogImage && (settings.ogImage === url || settings.ogImage.includes(fileName))) {
          usages.push({ module: 'Settings', field: 'ogImage', title: 'Open Graph Social Image', refId: settings._id });
        }
        if (settings.faviconUrl && (settings.faviconUrl === url || settings.faviconUrl.includes(fileName))) {
          usages.push({ module: 'Settings', field: 'faviconUrl', title: 'Site Favicon', refId: settings._id });
        }
        if (settings.resumeUrl && (settings.resumeUrl === url || settings.resumeUrl.includes(fileName))) {
          usages.push({ module: 'Settings', field: 'resumeUrl', title: 'Site Active Resume Link', refId: settings._id });
        }
      }
    }

    // 6. Check Resume
    if (Resume.db && Resume.db.readyState === 1) {
      const resumes = await Resume.find({
        $or: [{ url }, { fileName }],
      }).lean();

      resumes.forEach((r) => {
        usages.push({ module: 'Resume', field: 'url', title: `Resume: ${r.version} (${r.status})`, refId: r._id });
      });
    }

    // 7. Check Revisions history for preserved references
    try {
      const { isMediaReferencedInRevisions } = require('./revisionHelper');
      const revCheck = await isMediaReferencedInRevisions(url || fileName);
      if (revCheck && revCheck.referenced) {
        usages.push({
          module: 'Revisions',
          field: 'snapshot',
          title: `Revision History: ${revCheck.revisionInfo.entityType} (v${revCheck.revisionInfo.version} - ${revCheck.revisionInfo.title || ''})`,
          refId: 'revision-history',
        });
      }
    } catch (revErr) {}
  } catch (err) {
    console.warn('[findMediaUsage] Error checking references:', err.message);
  }

  return usages;
}

module.exports = { findMediaUsage };
