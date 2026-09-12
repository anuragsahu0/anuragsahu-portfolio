/**
 * ANURAG SAHU CONTROL CENTER — PRODUCTION DATABASE RESTORE UTILITY
 * Safely restores database collections from a validated JSON backup snapshot.
 * Supports --dry-run and collection-specific restoration.
 *
 * Usage:
 *   node server/scripts/restore.js --snapshot=server/backups/snapshot_latest.json
 *   node server/scripts/restore.js --dry-run
 *   node server/scripts/restore.js --collection=projects
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");

// Models mapping
const MODELS = {
  profile: require("../models/Profile"),
  hero: require("../models/Hero"),
  about: require("../models/About"),
  projects: require("../models/Project"),
  skills: require("../models/Skill"),
  experience: require("../models/Experience"),
  education: require("../models/Education"),
  certificates: require("../models/Certificate"),
  roadmap: require("../models/Roadmap"),
  socialLinks: require("../models/SocialLink"),
  media: require("../models/Media"),
  resume: require("../models/Resume"),
  settings: require("../models/Settings"),
  contacts: require("../models/Contact"),
  notifications: require("../models/Notification"),
  activityLogs: require("../models/ActivityLog"),
};

const runRestore = async () => {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const snapArg = args.find((a) => a.startsWith("--snapshot="));
  const colArg = args.find((a) => a.startsWith("--collection="));
  const targetCol = colArg ? colArg.split("=")[1] : null;

  const snapshotFile = snapArg
    ? path.resolve(snapArg.split("=")[1])
    : path.join(__dirname, "../backups/snapshot_latest.json");

  console.log("\n==================================================");
  console.log("🔄 ANURAG SAHU CONTROL CENTER — DATABASE RESTORE");
  console.log("==================================================");
  console.log(`   Snapshot: ${snapshotFile}`);
  console.log(`   Dry Run:  ${isDryRun ? "YES (No writes)" : "NO (Live restoration)"}`);
  if (targetCol) console.log(`   Target:   ${targetCol}`);

  if (!fs.existsSync(snapshotFile)) {
    console.error(`❌ Snapshot file not found: ${snapshotFile}`);
    return { success: false, error: "File not found" };
  }

  let raw = null;
  try {
    raw = JSON.parse(fs.readFileSync(snapshotFile, "utf8"));
  } catch (err) {
    console.error(`❌ Invalid JSON snapshot: ${err.message}`);
    return { success: false, error: err.message };
  }

  if (!raw.collections) {
    console.error("❌ Invalid snapshot structure: missing collections object.");
    return { success: false, error: "Invalid snapshot structure" };
  }

  const collections = raw.collections;
  console.log("\n📋 Snapshot Overview:");
  for (const [name, items] of Object.entries(collections)) {
    if (!targetCol || targetCol === name) {
      console.log(`   • ${name.padEnd(16)}: ${items.length} records`);
    }
  }

  if (isDryRun) {
    console.log("\n✓ DRY RUN COMPLETE: Snapshot validated successfully. Zero database writes performed.");
    console.log("==================================================\n");
    return { success: true, dryRun: true };
  }

  await connectDB();

  console.log("\n⏳ Restoring collections into MongoDB...");
  let restoredCount = 0;

  for (const [colName, model] of Object.entries(MODELS)) {
    if (targetCol && targetCol !== colName) continue;
    const records = collections[colName];
    if (!records || !records.length) continue;

    try {
      if (model.db && model.db.readyState === 1) {
        for (const doc of records) {
          const filter = doc._id ? { _id: doc._id } : (doc.id ? { id: doc.id } : (doc.singletonId ? { singletonId: doc.singletonId } : null));
          if (filter) {
            await model.findOneAndUpdate(filter, doc, { upsert: true, new: true, runValidators: false });
          } else {
            await model.create(doc);
          }
          restoredCount++;
        }
        console.log(`   ✓ Restored ${records.length} records into ${colName}`);
      }
    } catch (err) {
      console.warn(`   ⚠️ Error restoring ${colName}: ${err.message}`);
    }
  }

  console.log(`\n✅ RESTORATION COMPLETED: ${restoredCount} total documents restored/updated.`);
  console.log("==================================================\n");

  if (mongoose.connection && mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  return { success: true, restoredCount };
};

if (require.main === module) {
  runRestore().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { runRestore };
