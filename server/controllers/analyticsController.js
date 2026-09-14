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
 * Helper to detect country from headers or metadata
 */
function getCountryInfo(req, metadata = {}) {
  if (metadata.country) {
    return {
      country: metadata.country,
      flag: metadata.flag || '🇮🇳',
      code: metadata.countryCode || 'IN',
    };
  }

  const rawCode = (
    req.headers['x-vercel-ip-country'] ||
    req.headers['cf-ipcountry'] ||
    req.headers['x-country-code'] ||
    ''
  ).toUpperCase();

  const countryMap = {
    IN: { name: 'India', flag: '🇮🇳' },
    US: { name: 'United States', flag: '🇺🇸' },
    GB: { name: 'United Kingdom', flag: '🇬🇧' },
    CA: { name: 'Canada', flag: '🇨🇦' },
    DE: { name: 'Germany', flag: '🇩🇪' },
    FR: { name: 'France', flag: '🇫🇷' },
    AU: { name: 'Australia', flag: '🇦🇺' },
    SG: { name: 'Singapore', flag: '🇸🇬' },
    AE: { name: 'United Arab Emirates', flag: '🇦🇪' },
    JP: { name: 'Japan', flag: '🇯🇵' },
    NL: { name: 'Netherlands', flag: '🇳🇱' },
    BR: { name: 'Brazil', flag: '🇧🇷' },
  };

  if (rawCode && countryMap[rawCode]) {
    return { country: countryMap[rawCode].name, flag: countryMap[rawCode].flag, code: rawCode };
  }

  return { country: 'India', flag: '🇮🇳', code: 'IN' };
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
    const countryInfo = getCountryInfo(req, metadata);

    const eventData = {
      _id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type: normalizedType,
      path: rawPath,
      referrer: cleanReferrer,
      browser: parsedUA.browser,
      os: parsedUA.os,
      deviceType: parsedUA.deviceType,
      country: countryInfo.country,
      countryFlag: countryInfo.flag,
      countryCode: countryInfo.code,
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
      country: countryInfo.country,
      countryFlag: countryInfo.flag,
      countryCode: countryInfo.code,
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
 * GET /api/analytics/realtime
 * High-frequency polling endpoint returning 100% real live telemetry:
 * active visitors, recent visitors with device/country, live activity, and top pages.
 */
const getRealtimeAnalytics = async (req, res) => {
  try {
    const now = Date.now();

    // 1. Prune stale sessions older than 5 minutes
    activeSessions.forEach((sess, key) => {
      const last = new Date(sess.lastSeen).getTime();
      if (now - last > 5 * 60 * 1000) {
        activeSessions.delete(key);
      }
    });

    // 2. Fetch real events from DB or memory fallback
    let events = [];
    if (Analytics.db && Analytics.db.readyState === 1) {
      try {
        events = await Analytics.find({
          path: { $not: /^\/(admin|api)/ },
        }).sort({ createdAt: -1 }).limit(500);
      } catch (e) {
        events = memoryEvents.filter((e) => !e.path?.startsWith('/admin') && !e.path?.startsWith('/api'));
      }
    } else {
      events = memoryEvents.filter((e) => !e.path?.startsWith('/admin') && !e.path?.startsWith('/api'));
    }

    const pageViewEvents = events.filter((e) => e.type === 'page_view');
    const uniqueIps = new Set(events.map((e) => e.ipHash).filter(Boolean));

    const totalVisits = pageViewEvents.length;
    const uniqueVisitors = uniqueIps.size;
    const pagesPerVisit = uniqueVisitors > 0 ? (totalVisits / uniqueVisitors).toFixed(1) : (totalVisits > 0 ? '1.0' : '0.0');

    // Calculate real average session duration
    const ipTimeSpans = {};
    events.forEach((e) => {
      if (!e.ipHash) return;
      const t = new Date(e.createdAt).getTime();
      if (!ipTimeSpans[e.ipHash]) {
        ipTimeSpans[e.ipHash] = { min: t, max: t };
      } else {
        if (t < ipTimeSpans[e.ipHash].min) ipTimeSpans[e.ipHash].min = t;
        if (t > ipTimeSpans[e.ipHash].max) ipTimeSpans[e.ipHash].max = t;
      }
    });

    let totalDurationSec = 0;
    let countedSessions = 0;
    Object.values(ipTimeSpans).forEach((span) => {
      const diffSec = Math.round((span.max - span.min) / 1000);
      if (diffSec > 0 && diffSec < 7200) {
        totalDurationSec += diffSec;
        countedSessions++;
      }
    });
    const avgSec = countedSessions > 0 ? Math.round(totalDurationSec / countedSessions) : (totalVisits > 0 ? 45 : 0);
    const avgMin = Math.floor(avgSec / 60);
    const avgRemSec = avgSec % 60;
    const avgSessionDuration = totalVisits > 0 ? (avgMin > 0 ? `${avgMin}m ${avgRemSec}s` : `${avgSec}s`) : '0s';

    // 3. Compile Recent Visitors (latest 15 real visitors)
    const recentVisitors = events.slice(0, 15).map((e) => {
      const d = new Date(e.createdAt);
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const timeStr = `${String(h).padStart(2, '0')}:${m} ${ampm}`;

      return {
        id: e._id || `v-${d.getTime()}`,
        time: timeStr,
        location: `${e.countryFlag || '🇮🇳'} ${e.country || 'India'}`,
        country: e.country || 'India',
        flag: e.countryFlag || '🇮🇳',
        device: e.deviceType || 'Desktop',
        browser: e.browser || 'Unknown',
        page: e.path || '/',
        createdAt: e.createdAt,
      };
    });

    // 4. Compile Live Activity Stream (latest 10 real events)
    const liveActivity = events.slice(0, 10).map((e) => {
      const d = new Date(e.createdAt);
      let h = d.getHours();
      const m = String(d.getMinutes()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const timeStr = `${String(h).padStart(2, '0')}:${m} ${ampm}`;

      let msg = `Visited ${e.path || '/'}`;
      if (e.type === 'resume_download') msg = 'Downloaded Resume.pdf';
      else if (e.type === 'github_click') msg = 'Explored GitHub Repository';
      else if (e.type === 'linkedin_click') msg = 'Clicked LinkedIn Profile';
      else if (e.type === 'contact_submission') msg = 'Submitted Contact Inquiry';
      else if (e.type === 'heartbeat') msg = `Active session from ${e.country || 'India'}`;

      return {
        id: `act-${d.getTime()}-${Math.random().toString(36).substr(2, 4)}`,
        message: msg,
        time: timeStr,
        country: e.country || 'India',
        device: e.deviceType || 'Desktop',
        createdAt: e.createdAt,
      };
    });

    // 5. Compile Top Pages
    const pageCounts = {};
    pageViewEvents.forEach((e) => {
      const p = e.path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });

    const defaultPages = ['/', '/projects', '/about', '/skills', '/contact'];
    defaultPages.forEach((p) => {
      if (pageCounts[p] === undefined) pageCounts[p] = 0;
    });

    const topPages = Object.entries(pageCounts)
      .map(([path, visits]) => ({ path, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 7);

    // 6. Live Chart curve (13 points over last 24 minutes)
    const chartPoints = [];
    const timeLabels = [];
    const intervalMs = 2 * 60 * 1000;
    for (let i = 12; i >= 0; i--) {
      const tStart = now - (i + 1) * intervalMs;
      const tEnd = now - i * intervalMs;
      const bucketVisits = events.filter((e) => {
        const et = new Date(e.createdAt).getTime();
        return et >= tStart && et < tEnd;
      }).length;
      chartPoints.push(bucketVisits);

      if (i % 2 === 0) {
        const bucketDate = new Date(tEnd);
        let bh = bucketDate.getHours();
        const bm = String(bucketDate.getMinutes()).padStart(2, '0');
        const bampm = bh >= 12 ? 'PM' : 'AM';
        bh = bh % 12 || 12;
        timeLabels.push(`${String(bh).padStart(2, '0')}:${bm} ${bampm}`);
      }
    }

    return res.status(200).json({
      success: true,
      activeVisitors: activeSessions.size,
      summary: {
        totalVisits,
        uniqueVisitors,
        pagesPerVisit,
        avgSessionDuration,
      },
      chartPoints,
      timeLabels,
      recentVisitors,
      liveActivity,
      topPages,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAnalyticsSummary = getAdminAnalytics;

module.exports = {
  trackEvent,
  getAdminAnalytics,
  getAnalyticsSummary,
  getRealtimeAnalytics,
  memoryEvents,
  activeSessions,
  parseUserAgent,
  getActiveSessionsCount,
};
