/**
 * ANURAG SAHU PORTFOLIO — CENTRALIZED PUBLIC DATA ACCESS LAYER
 * Public API client providing type-safe data access, client caching, and fallback protection.
 */

const API_BASE =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? `http://${window.location.hostname}:5001/api`
    : '/api';

const CACHE_KEY = 'as_public_site_cache';

/**
 * Fetch complete public site payload (Single-Fetch Aggregated Endpoint)
 * Uses Stale-While-Revalidate pattern with sessionStorage caching.
 * @param {boolean} forceRefresh - If true, bypasses sessionStorage cache
 * @returns {Promise<{ hero, profile, about, skills, experience, education, projects, certificates, roadmap, socialLinks, navigation, resume, settings, seo }>}
 */
export async function fetchPublicSite(forceRefresh = false) {
  let cached = null;
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) cached = JSON.parse(raw);
    } catch (e) {
      /* ignore cache read failure */
    }
  }

  try {
    const res = await fetch(`${API_BASE}/public/site`);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success && json.data) {
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(json.data));
          } catch (e) {
            /* ignore cache write failure */
          }
        }
        return json.data;
      }
    }
  } catch (err) {
    console.debug('[publicApi] Network fetch failed, falling back to cache:', err.message);
  }

  if (cached) return cached;
  throw new Error('Public site data unavailable and no cache present.');
}

/**
 * Fetch published projects
 */
export async function fetchPublicProjects() {
  try {
    const res = await fetch(`${API_BASE}/public/projects`);
    if (res.ok) {
      const json = await res.json();
      return json.data?.projects || json.projects || [];
    }
  } catch (e) {
    /* ignore network error */
  }
  return [];
}

/**
 * Fetch active resume
 */
export async function fetchPublicResume() {
  try {
    const res = await fetch(`${API_BASE}/public/resume`);
    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (e) {
    /* ignore network error */
  }
  return null;
}

/**
 * Fetch public settings
 */
export async function fetchPublicSettings() {
  try {
    const res = await fetch(`${API_BASE}/public/settings`);
    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (e) {
    /* ignore network error */
  }
  return null;
}

/**
 * Submit contact inquiry
 */
export async function submitContactMessage(payload) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit contact message');
  }
  return data;
}

/**
 * Subscribe to real-time CMS content update broadcasts across tabs
 */
export function subscribeRealtimeCmsUpdates(callback) {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return () => {};
  try {
    const bc = new BroadcastChannel('anurag_portfolio_realtime');
    const handler = (event) => {
      if (event && event.data && (event.data.type === 'cms_content_updated' || event.data.type === 'project_updated')) {
        callback(event.data);
      }
    };
    bc.addEventListener('message', handler);
    return () => {
      bc.removeEventListener('message', handler);
      bc.close();
    };
  } catch (e) {
    return () => {};
  }
}

export default {
  fetchPublicSite,
  fetchPublicProjects,
  fetchPublicResume,
  fetchPublicSettings,
  submitContactMessage,
  subscribeRealtimeCmsUpdates,
};
