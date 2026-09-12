/**
 * ANURAG SAHU CONTROL CENTER — PRODUCTION DATABASE BACKUP UTILITY
 * Candidate: Anurag Sahu
 * Exports sanitized JSON snapshots of all active collections to server/backups/
 * Strips sensitive passwords/credentials to protect snapshot integrity.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const { connectDB } = require('../config/db');

// Models
const User = require('../models/User');
const Profile = require('../models/Profile');
const Hero = require('../models/Hero');
const About = require('../models/About');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Certificate = require('../models/Certificate');
const Roadmap = require('../models/Roadmap');
const SocialLink = require('../models/SocialLink');
const Media = require('../models/Media');
const Resume = require('../models/Resume');
const Settings = require('../models/Settings');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

const runBackup = async () => {
  console.log('\n==================================================');
  console.log('📦 ANURAG SAHU CONTROL CENTER — DATABASE BACKUP');
  console.log('==================================================');

  await connectDB();

  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotPath = path.join(backupDir, `snapshot_${timestamp}.json`);
  const latestPath = path.join(backupDir, 'snapshot_latest.json');

  try {
    const fetchSafe = async (model, select = '') => {
      try {
        if (!model.db || model.db.readyState !== 1) return [];
        let query = model.find().lean();
        if (select) query = query.select(select);
        return await query;
      } catch (err) {
        return [];
      }
    };

    console.log('⏳ Fetching collections (sanitizing credentials)...');

    const collections = {
      users: await fetchSafe(User, '-password'),
      profile: await fetchSafe(Profile),
      hero: await fetchSafe(Hero),
      about: await fetchSafe(About),
      projects: await fetchSafe(Project),
      skills: await fetchSafe(Skill),
      experience: await fetchSafe(Experience),
      education: await fetchSafe(Education),
      certificates: await fetchSafe(Certificate),
      roadmap: await fetchSafe(Roadmap),
      socialLinks: await fetchSafe(SocialLink),
      media: await fetchSafe(Media),
      resume: await fetchSafe(Resume),
      settings: await fetchSafe(Settings),
      contacts: await fetchSafe(Contact),
      notifications: await fetchSafe(Notification),
      activityLogs: await fetchSafe(ActivityLog),
    };

    const counts = {};
    let totalRecords = 0;
    for (const [colName, records] of Object.entries(collections)) {
      counts[colName] = records.length;
      totalRecords += records.length;
    }

    const backupData = {
      metadata: {
        system: 'ANURAG SAHU CONTROL CENTER',
        version: '10.0.0',
        candidate: 'Anurag Sahu',
        createdAt: new Date().toISOString(),
        totalRecords,
        counts,
      },
      collections,
    };

    const serialized = JSON.stringify(backupData, null, 2);
    fs.writeFileSync(snapshotPath, serialized, 'utf8');
    fs.writeFileSync(latestPath, serialized, 'utf8');

    console.log('✅ BACKUP SUCCESSFUL!');
    console.log(`   Total Records: ${totalRecords}`);
    console.log(`   Snapshot File: ${snapshotPath}`);
    console.log(`   Latest Alias:  ${latestPath}`);
    console.log('==================================================\n');
    return { success: true, snapshotPath, totalRecords };
  } catch (err) {
    console.error('❌ BACKUP FAILED:', err.message);
    return { success: false, error: err.message };
  } finally {
    if (mongoose.connection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

if (require.main === module) {
  runBackup().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { runBackup };
