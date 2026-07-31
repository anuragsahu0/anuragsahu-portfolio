const Analytics = require('../models/Analytics');

// Memory store for offline mode & instant real-time telemetry
const memoryEvents = [];
const activeSessions = new Map(); // sessionId -> metadata
const uniqueIPs = new Set();

/**
 * Helper to parse User-Agent strings into OS, Browser, and Device Type
 */
function parseUserAgent(uaString = '') {
  const ua = uaString.toLowerCase();
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let deviceType = 'Desktop';

  // OS Detection
  if (ua.includes('mac os') || ua.includes('macintosh')) os = 'macOS';
  else if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  else if (ua.includes('linux')) os = 'Linux';

  // Browser Detection
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';

  // Device Detection
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'Mobile';
  } else if (ua.includes('ipad') || ua.includes('tablet')) {
    deviceType = 'Tablet';
  }

  return { os, browser, deviceType };
}

const trackEvent = async (req, res) => {
  try {
    const { type, path, metadata } = req.body;
    const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const ipAddress = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    if (!type) {
      return res.status(400).json({ success: false, message: 'Event type is required.' });
    }

    const parsedUA = parseUserAgent(userAgent);
    const eventData = {
      _id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      path: path || '/',
      metadata: metadata || {},
      ipAddress,
      userAgent,
      browser: parsedUA.browser,
      os: parsedUA.os,
      deviceType: parsedUA.deviceType,
      createdAt: new Date(),
    };

    memoryEvents.push(eventData);
    uniqueIPs.add(ipAddress);

    // Track active session heartbeat
    activeSessions.set(ipAddress, {
      lastSeen: new Date(),
      currentPath: path || '/',
      browser: parsedUA.browser,
      os: parsedUA.os,
      deviceType: parsedUA.deviceType,
      ipAddress,
    });

    try {
      if (Analytics.db && Analytics.db.readyState === 1) {
        await Analytics.create(eventData);
      }
    } catch (dbErr) {}

    return res.status(201).json({
      success: true,
      message: 'Telemetry event tracked successfully',
      event: eventData,
      activeUsersCount: getActiveSessionsCount(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

function getActiveSessionsCount() {
  const now = Date.now();
  let count = 0;
  activeSessions.forEach((sess) => {
    if (now - sess.lastSeen.getTime() < 5 * 60 * 1000) { // 5 minute window
      count++;
    }
  });
  return count || 1;
}

const getAnalyticsSummary = async (req, res) => {
  try {
    let events = memoryEvents;

    try {
      if (Analytics.db && Analytics.db.readyState === 1) {
        events = await Analytics.find().sort({ createdAt: -1 });
      }
    } catch (e) {
      events = memoryEvents;
    }

    const pageViews = events.filter((e) => e.type === 'page_view').length;
    const resumeDownloads = events.filter((e) => e.type === 'resume_download').length;
    const projectClicks = events.filter((e) => e.type === 'project_click').length;
    const githubClicks = events.filter((e) => e.type === 'github_click').length;
    const linkedinClicks = events.filter((e) => e.type === 'linkedin_click').length;
    const contactSubmissions = events.filter((e) => e.type === 'contact_submission').length;

    // Device & Browser Distribution
    const browserDist = {};
    const osDist = {};
    const deviceDist = {};

    events.forEach((e) => {
      const b = e.browser || 'Chrome';
      const o = e.os || 'macOS';
      const d = e.deviceType || 'Desktop';

      browserDist[b] = (browserDist[b] || 0) + 1;
      osDist[o] = (osDist[o] || 0) + 1;
      deviceDist[d] = (deviceDist[d] || 0) + 1;
    });

    const ipSet = new Set(events.map((e) => e.ipAddress));

    return res.status(200).json({
      success: true,
      totalEvents: events.length,
      onlineUsers: getActiveSessionsCount(),
      summary: {
        totalVisitors: pageViews || events.length || 1,
        uniqueVisitors: ipSet.size || 1,
        activeSessions: getActiveSessionsCount(),
        resumeDownloads,
        projectClicks,
        githubClicks,
        linkedinClicks,
        contactSubmissions,
      },
      distributions: {
        browsers: browserDist,
        operatingSystems: osDist,
        devices: deviceDist,
      },
      recentEvents: events.slice(-25).reverse(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  trackEvent,
  getAnalyticsSummary,
  memoryEvents,
  activeSessions,
  parseUserAgent,
};
