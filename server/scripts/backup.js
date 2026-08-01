/**
 * ANTI GRAVITY PORTFOLIO — AUTOMATED MONGODB BACKUP UTILITY
 * Candidate: Anurag Sahu
 * Exports JSON snapshots of all production database collections to server/backups/
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const connectDB = require('../config/db');

// Models
const User = require('../models/User');
const Project = require('../models/Project');
const Roadmap = require('../models/Roadmap');
const Skill = require('../models/Skill');
const Education = require('../models/Education');
const Contact = require('../models/Contact');
const SocialLink = require('../models/SocialLink');
const Settings = require('../models/Settings');

const runBackup = async () => {
  console.log('📦 Starting MongoDB Production Backup...');
  await connectDB();

  const backupDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const snapshotPath = path.join(backupDir, `snapshot_${timestamp}.json`);

  try {
    const backupData = {
      timestamp: new Date(),
      candidate: 'Anurag Sahu',
      version: '3.0',
      collections: {
        users: await User.find().lean().catch(() => []),
        projects: await Project.find().lean().catch(() => []),
        roadmap: await Roadmap.find().lean().catch(() => []),
        skills: await Skill.find().lean().catch(() => []),
        education: await Education.find().lean().catch(() => []),
        contacts: await Contact.find().lean().catch(() => []),
        socialLinks: await SocialLink.find().lean().catch(() => []),
        settings: await Settings.find().lean().catch(() => []),
      },
    };

    fs.writeFileSync(snapshotPath, JSON.stringify(backupData, null, 2));
    console.log(`✅ BACKUP SUCCESSFUL: ${snapshotPath}`);
  } catch (err) {
    console.error('❌ BACKUP FAILED:', err.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

runBackup();
