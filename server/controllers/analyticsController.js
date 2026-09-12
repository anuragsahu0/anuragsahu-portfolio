const crypto = require('crypto');
const Analytics = require('../models/Analytics');

// In-memory store for offline mode & real-time telemetry (capped at 1000 items)
const memoryEvents = [];
const activeSessions = new Map(); // ipHash -> session metadata

/**
 * Hash IP address for privacy-preserving visitor counting
 */
function hashIp(rawIp) {
  if (!rawIp || typeof rawIp !== 'string') return 'anonymous-hash';
  const salt = process.env.IP_SALT || 'anti-gravity-privacy-salt-2026';
  return crypto.createHash('sha256').update(rawIp.trim() + salt).digest('hex').substring(0, 16);
}

/**
 * Helper to parse User-Agent strings into OS, Browser, and Device Type
 */
function parseUserAgent(uaString = '') {
  const ua = uaString.toLowerCase();
  let os = 'Unknown';
  let browser = 'Unknown';
  let deviceType = 'Desktop';
  let isBot = false;

  // Bot detection
  if (
    ua.includes('bot') ||
    ua.includes('crawler') ||
    ua.includes('spider') ||
    ua.includes('lighthouse') ||
    ua.includes('headless') ||
    ua.includes('postman') ||
    ua.includes('curl') ||
    ua.includes('wget')
  ) {
    isBot = true;
  }

  // OS Detection
  if (ua.includes('mac os') || ua.includes('macintosh')) os = 'macOS';
  else if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) os = 'iOS';
  else if (ua.includes('linux')) os = 'Linux';

  // Browser Detection
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

  // Device Detection
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    deviceType = 'Mobile';
  } else if (ua.includes('ipad') || ua.includes('tablet')) {
    deviceType = 'Tablet';
  }

  return { os, browser, deviceType, isBot };
}

/**
 * Categorize HTTP referrer string
 */
function categorizeReferrer(referrerUrl = '') {
  if (!referrerUrl || referrerUrl === '' || referrerUrl === 'direct') return 'Direct';
  const lower = referrerUrl.toLowerCase();
  if (lower.includes('google.')) return 'Google';
  if (lower.includes('github.com')) return 'GitHub';
  if (lower.includes('linkedin.com')) return 'LinkedIn';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'Twitter / X';
  if (lower.includes('instagram.com')) return 'Instagram';
  if (lower.includes('youtube.com')) return 'YouTube';
  if (lower.includes('reddit.com')) return 'Reddit';
  try {
    const urlObj = new URL(referrerUrl);
    return urlObj.hostname.replace('www.', '');
  } catch (e) {
    return 'Other';
  }
}

/**
 * POST /api/analytics/track
 * Public telemetry event tracking (excludes /admin and bot requests)
 */
const trackEvent = async (req, res) => {
  try {
    const { type, path: eventPath, metadata } = req.body;
    const rawPath = eventPath || '/';

    // Never count /admin or /api routes in public visitor analytics
    if (rawPath.startsWith('/admin') || rawPath.startsWith('/api')) {
      return res.status(200).json({ success: true, ignored: true, message: 'Admin/API routes excluded from public analytics' });
    }

    const rawIp = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
    const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    const parsedUA = parseUserAgent(userAgent);

    // Ignore bots
    if (parsedUA.isBot) {
      return res.status(200).json({ success: true, ignored: true, message: 'Bot traffic excluded' });
    }

    if (!type) {
      return res.status(400).json({ success: false, message: 'Event type is required.' });
    }

    // Normalize event type
    let normalizedType = type;
    if (type === 'resume_click') normalizedType = 'resume_download';
    if (type === 'project_click') normalizedType = 'project_view';
    if (type === 'contact_submit') normalizedType = 'contact_submission';

    const validTypes = [
      'page_view',
      'project_view',
      'project_click',
      'resume_download',
      'resume_click',
      'github_click',
      'linkedin_click',
      'contact_submission',
      'contact_submit',
      'external_link_click',
      'heartbeat',
    ];

    if (!validTypes.includes(type)) {
      normalizedType = 'page_view';
    }

    const ipHash = hashIp(clientIp);
    const referrerHeader = req.headers['referer'] || req.headers['referrer'] || (metadata && metadata.referrer) || '';
    const cleanReferrer = categorizeReferrer(referrerHeader);

    const eventData = {
      _id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type: normalizedType,
      path: rawPath,
      referrer: cleanReferrer,
      browser: parsedUA.browser,
      os: parsedUA.os,
      deviceType: parsedUA.deviceType,
      ipHash,
      metadata: metadata || {},
      createdAt: new Date(),
    };

    // Store in memory (cap at 1000 items)
    memoryEvents.push(eventData);
    if (memoryEvents.length > 1000) {
      memoryEvents.shift();
    }

    // Track active online session
    activeSessions.set(ipHash, {
      lastSeen: new Date(),
      currentPath: rawPath,
      browser: parsedUA.browser,
      os: parsedUA.os,
      deviceType: parsedUA.deviceType,
      ipHash,
    });

    // Save to MongoDB if available
    try {
      if (Analytics.db && Analytics.db.readyState === 1) {
        await Analytics.create(eventData);
      }
    } catch (dbErr) {
      // Continue safely without failing response
    }

    return res.status(201).json({
      success: true,
      activeUsersCount: getActiveSessionsCount(),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get active sessions count within last 5 minutes
 */
function getActiveSessionsCount() {
  const now = Date.now();
  let count = 0;
  activeSessions.forEach((sess, key) => {
    if (now - sess.lastSeen.getTime() < 5 * 60 * 1000) {
      count++;
    } else {
      activeSessions.delete(key);
    }
  });
  return count;
}

/**
 * GET /api/admin/analytics
 * Real analytics & insights supporting date ranges: 7d, 30d, 90d, 1y
 */
const getAdminAnalytics = async (req, res, next) => {
  try {
    const range = (req.query.range || '30d').toLowerCase();
    const now = new Date();
    let days = 30;

    if (range === '7d') days = 7;
    else if (range === '30d') days = 30;
    else if (range === '90d') days = 90;
    else if (range === '1y') days = 365;

    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    let events = [];

    try {
      if (Analytics.db && Analytics.db.readyState === 1) {
        events = await Analytics.find({
          createdAt: { $gte: startDate },
          path: { $not: /^\/(admin|api)/ },
        }).sort({ createdAt: 1 });
      } else {
        events = memoryEvents.filter(
          (e) => new Date(e.createdAt) >= startDate && !e.path?.startsWith('/admin') && !e.path?.startsWith('/api')
        );
      }
    } catch (err) {
      events = memoryEvents.filter(
        (e) => new Date(e.createdAt) >= startDate && !e.path?.startsWith('/admin') && !e.path?.startsWith('/api')
      );
    }

    // Filter out heartbeats from page view count
    const pageViewEvents = events.filter((e) => e.type === 'page_view');
    const resumeEvents = events.filter((e) => e.type === 'resume_download' || e.type === 'resume_click');
    const projectEvents = events.filter((e) => e.type === 'project_view' || e.type === 'project_click');
    const uniqueVisitorHashes = new Set(pageViewEvents.map((e) => e.ipHash || e.ipAddress).filter(Boolean));

    const totalVisitors = uniqueVisitorHashes.size;
    const pageViews = pageViewEvents.length;
    const activeSessionsCount = getActiveSessionsCount();
    const resumeDownloads = resumeEvents.length;
    const projectClicks = projectEvents.length;

    const hasData = events.length > 0;

    // Daily Traffic Trend Aggregation
    const trendMap = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = d.toISOString().split('T')[0];
      trendMap[dateKey] = { date: dateKey, views: 0, visitors: 0, _ips: new Set() };
    }

    pageViewEvents.forEach((e) => {
      const dateKey = new Date(e.createdAt).toISOString().split('T')[0];
      if (trendMap[dateKey]) {
        trendMap[dateKey].views += 1;
        if (e.ipHash) trendMap[dateKey]._ips.add(e.ipHash);
      }
    });

    const trafficTrend = Object.values(trendMap).map((item) => ({
      date: item.date,
      views: item.views,
      visitors: item._ips.size,
    }));

    // Top Pages
    const pageMap = {};
    pageViewEvents.forEach((e) => {
      const p = e.path || '/';
      pageMap[p] = (pageMap[p] || 0) + 1;
    });

    const topPages = Object.entries(pageMap)
      .map(([pagePath, count]) => ({
        path: pagePath,
        views: count,
        percentage: pageViews > 0 ? Math.round((count / pageViews) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Traffic Sources / Referrers
    const sourceMap = {};
    events.forEach((e) => {
      const src = e.referrer || 'Direct';
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });

    const totalSources = events.length;
    const trafficSources = Object.entries(sourceMap)
      .map(([source, count]) => ({
        source,
        count,
        percentage: totalSources > 0 ? Math.round((count / totalSources) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Device Breakdown
    const deviceMap = { Desktop: 0, Mobile: 0, Tablet: 0 };
    events.forEach((e) => {
      const dev = e.deviceType || 'Desktop';
      if (deviceMap[dev] !== undefined) {
        deviceMap[dev] += 1;
      } else {
        deviceMap.Desktop += 1;
      }
    });

    const totalDevices = events.length;
    const devices = Object.entries(deviceMap).map(([device, count]) => ({
      device,
      count,
      percentage: totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0,
    }));

    // Browser Breakdown
    const browserMap = {};
    events.forEach((e) => {
      const b = e.browser || 'Unknown';
      browserMap[b] = (browserMap[b] || 0) + 1;
    });

    const browsers = Object.entries(browserMap)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Provider Inspection
    const gaId = process.env.GA_MEASUREMENT_ID || process.env.VITE_GA_MEASUREMENT_ID;
    const plausibleDomain = process.env.PLAUSIBLE_DOMAIN || process.env.VITE_PLAUSIBLE_DOMAIN;

    let providerInfo = {
      name: 'Internal Telemetry Engine (Privacy-First)',
      type: 'internal',
      connected: true,
      measurementId: null,
    };

    if (gaId) {
      providerInfo = {
        name: 'Google Analytics 4',
        type: 'ga4',
        connected: true,
        measurementId: gaId,
      };
    } else if (plausibleDomain) {
      providerInfo = {
        name: 'Plausible Analytics',
        type: 'plausible',
        connected: true,
        domain: plausibleDomain,
      };
    }

    return res.status(200).json({
      success: true,
      range,
      hasData,
      provider: providerInfo,
      summary: {
        totalVisitors,
        pageViews,
        activeSessions: activeSessionsCount,
        resumeDownloads,
        projectClicks,
      },
      trafficTrend,
      topPages,
      trafficSources,
      devices,
      browsers,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Backward compatibility summary endpoint
 */
const getAnalyticsSummary = async (req, res, next) => {
  return getAdminAnalytics(req, res, next);
};

module.exports = {
  trackEvent,
  getAdminAnalytics,
  getAnalyticsSummary,
  memoryEvents,
  activeSessions,
  parseUserAgent,
  getActiveSessionsCount,
};
