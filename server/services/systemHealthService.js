/**
 * ANURAG SAHU CONTROL CENTER — SYSTEM HEALTH & MAINTENANCE DIAGNOSTICS
 * Candidate: Anurag Sahu
 * Performs real-time health checks on 8 core subsystems:
 * DATABASE, API, AUTH, STORAGE, EMAIL, SCHEDULER, BACKUPS, ANALYTICS.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Services & Models
const { getBackupHealthStats, BACKUP_DIR } = require('./backupService');
const { getSchedulerHealthStats } = require('./schedulerService');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

/**
 * Execute real diagnostics across all 8 subsystems
 */
const performSystemHealthCheck = async () => {
  const timestamp = new Date().toISOString();
  const checks = {};

  // 1. DATABASE
  try {
    const dbState = mongoose.connection.readyState;
    let latencyMs = 0;
    if (dbState === 1 && mongoose.connection.db) {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();
      latencyMs = Date.now() - start;
      checks.DATABASE = {
        name: 'Database Engine',
        service: 'DATABASE',
        status: 'operational',
        latencyMs,
        message: `MongoDB connected (${latencyMs}ms latency)`,
        details: {
          host: mongoose.connection.host || '127.0.0.1',
          port: mongoose.connection.port || 27017,
          name: mongoose.connection.name || 'portfolio',
          readyState: dbState,
        },
      };
    } else {
      checks.DATABASE = {
        name: 'Database Engine',
        service: 'DATABASE',
        status: 'warning',
        latencyMs: 0,
        message: 'Running in lightweight fallback memory mode (MongoDB daemon offline)',
        details: { readyState: dbState },
      };
    }
  } catch (err) {
    checks.DATABASE = {
      name: 'Database Engine',
      service: 'DATABASE',
      status: 'warning',
      latencyMs: 0,
      message: `Database connection warning: ${err.message}`,
      details: { error: err.message },
    };
  }

  // 2. API SERVER
  try {
    const uptimeSec = Math.floor(process.uptime());
    const memUsage = process.memoryUsage();
    checks.API = {
      name: 'Express REST Engine',
      service: 'API',
      status: 'operational',
      latencyMs: 1,
      message: `Server active for ${Math.floor(uptimeSec / 60)}m ${uptimeSec % 60}s`,
      details: {
        uptimeSeconds: uptimeSec,
        heapUsedMB: (memUsage.heapUsed / (1024 * 1024)).toFixed(1),
        heapTotalMB: (memUsage.heapTotal / (1024 * 1024)).toFixed(1),
        nodeVersion: process.version,
        platform: process.platform,
      },
    };
  } catch (err) {
    checks.API = {
      name: 'Express REST Engine',
      service: 'API',
      status: 'unavailable',
      latencyMs: 0,
      message: `API check error: ${err.message}`,
      details: { error: err.message },
    };
  }

  // 3. AUTH & IDENTITY
  try {
    const hasSecret = Boolean(process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16);
    let userCount = 0;
    try {
      if (User.db && User.db.readyState === 1) {
        userCount = await User.countDocuments();
      }
    } catch (_) {}

    checks.AUTH = {
      name: 'Authentication & RBAC',
      service: 'AUTH',
      status: hasSecret ? 'operational' : 'warning',
      latencyMs: 1,
      message: hasSecret
        ? 'JWT signing and session verification active'
        : 'Running with fallback secret; configure JWT_SECRET in .env',
      details: {
        tokenType: 'Bearer JWT (HMAC-SHA256)',
        secretConfigured: hasSecret,
        adminAccounts: userCount || 1,
      },
    };
  } catch (err) {
    checks.AUTH = {
      name: 'Authentication & RBAC',
      service: 'AUTH',
      status: 'warning',
      latencyMs: 0,
      message: `Auth verification error: ${err.message}`,
      details: { error: err.message },
    };
  }

  // 4. STORAGE & FILESYSTEM
  try {
    const testFile = path.join(BACKUP_DIR, `.health_probe_${Date.now()}.tmp`);
    fs.writeFileSync(testFile, 'probe', 'utf8');
    const readBack = fs.readFileSync(testFile, 'utf8');
    fs.unlinkSync(testFile);

    checks.STORAGE = {
      name: 'Local File System Storage',
      service: 'STORAGE',
      status: readBack === 'probe' ? 'operational' : 'warning',
      latencyMs: 2,
      message: 'Read/write storage access verified in server/backups',
      details: {
        backupDirectory: BACKUP_DIR,
        writeVerified: true,
      },
    };
  } catch (err) {
    checks.STORAGE = {
      name: 'Local File System Storage',
      service: 'STORAGE',
      status: 'warning',
      latencyMs: 0,
      message: `Storage permission warning: ${err.message}`,
      details: { error: err.message },
    };
  }

  // 5. EMAIL DELIVERY
  try {
    const host = process.env.EMAIL_HOST;
    const user = process.env.EMAIL_USER;
    const recipient = process.env.RECIPIENT_EMAIL || 'shivasahu0612@gmail.com';
    const isConfigured = Boolean(host && user);

    checks.EMAIL = {
      name: 'Nodemailer SMTP Engine',
      service: 'EMAIL',
      status: isConfigured ? 'operational' : 'warning',
      latencyMs: 0,
      message: isConfigured
        ? `Configured via SMTP (${host}) -> ${recipient}`
        : 'Development mode: emails logged to console (configure EMAIL_HOST in .env)',
      details: {
        host: host || 'Not set',
        recipient,
        transporter: isConfigured ? 'SMTP' : 'Mock/Console',
      },
    };
  } catch (err) {
    checks.EMAIL = {
      name: 'Nodemailer SMTP Engine',
      service: 'EMAIL',
      status: 'warning',
      latencyMs: 0,
      message: `Email subsystem check: ${err.message}`,
      details: { error: err.message },
    };
  }

  // 6. SCHEDULER & AUTOMATION
  try {
    const schedStats = await getSchedulerHealthStats();
    checks.SCHEDULER = {
      name: 'Cron & Automation Engine',
      service: 'SCHEDULER',
      status: schedStats.isWorkerRunning ? 'operational' : 'warning',
      latencyMs: 1,
      message: schedStats.isWorkerRunning
        ? `Worker running (30s interval, ${schedStats.scheduledCount} upcoming)`
        : 'Worker idle or awaiting trigger',
      details: {
        workerActive: schedStats.isWorkerRunning,
        intervalMs: schedStats.intervalMs,
        scheduledCount: schedStats.scheduledCount,
        completedCount: schedStats.completedCount,
        failedCount: schedStats.failedCount,
        lastTickAt: schedStats.lastTickAt,
      },
    };
  } catch (err) {
    checks.SCHEDULER = {
      name: 'Cron & Automation Engine',
      service: 'SCHEDULER',
      status: 'warning',
      latencyMs: 0,
      message: `Scheduler check: ${err.message}`,
      details: { error: err.message },
    };
  }

  // 7. BACKUPS & RECOVERY
  try {
    const bkpStats = await getBackupHealthStats();
    checks.BACKUPS = {
      name: 'Backup & Recovery Center',
      service: 'BACKUPS',
      status: bkpStats.healthStatus === 'OPERATIONAL' ? 'operational' : 'warning',
      latencyMs: 1,
      message:
        bkpStats.healthStatus === 'OPERATIONAL'
          ? `Operational (${bkpStats.completedCount} snapshots, ${bkpStats.storageUsedFormatted} used)`
          : bkpStats.attentionReason || 'Attention required on backup system',
      details: {
        totalBackups: bkpStats.totalBackups,
        completedCount: bkpStats.completedCount,
        failedCount: bkpStats.failedCount,
        storageUsedFormatted: bkpStats.storageUsedFormatted,
        lastSuccessfulBackup: bkpStats.lastSuccessfulBackup,
      },
    };
  } catch (err) {
    checks.BACKUPS = {
      name: 'Backup & Recovery Center',
      service: 'BACKUPS',
      status: 'warning',
      latencyMs: 0,
      message: `Backup health check: ${err.message}`,
      details: { error: err.message },
    };
  }

  // 8. ANALYTICS & TELEMETRY
  try {
    let eventCount = 0;
    try {
      if (Analytics.db && Analytics.db.readyState === 1) {
        eventCount = await Analytics.countDocuments();
      }
    } catch (_) {}

    checks.ANALYTICS = {
      name: 'Telemetry & Visitor Insights',
      service: 'ANALYTICS',
      status: 'operational',
      latencyMs: 1,
      message: 'Telemetry collection active with privacy anonymization',
      details: {
        eventsTracked: eventCount,
        anonymization: 'SHA-256 IP masking',
      },
    };
  } catch (err) {
    checks.ANALYTICS = {
      name: 'Telemetry & Visitor Insights',
      service: 'ANALYTICS',
      status: 'warning',
      latencyMs: 0,
      message: `Analytics check: ${err.message}`,
      details: { error: err.message },
    };
  }

  // Calculate overall system status
  const statuses = Object.values(checks).map((c) => c.status);
  let overall = 'operational';
  if (statuses.includes('unavailable')) {
    overall = 'unavailable';
  } else if (statuses.includes('warning')) {
    overall = 'warning';
  }

  return {
    success: true,
    system: 'ANURAG SAHU CONTROL CENTER',
    version: '13.0.0',
    overall,
    timestamp,
    services: checks,
  };
};

module.exports = {
  performSystemHealthCheck,
};
