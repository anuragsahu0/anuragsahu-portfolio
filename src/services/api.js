/**
 * ANTI GRAVITY PORTFOLIO — Full API Client
 * Centralized service layer connecting the React frontend to the Express backend.
 *
 * Base URL: http://localhost:5001/api
 * All methods return { success, data } or throw on network error.
 *
 * The frontend gracefully falls back to static data when the API is unavailable.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// ─── HTTP Helper ────────────────────────────────────────────
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

// ─── Public API ─────────────────────────────────────────────

export const apiService = {
  // Health
  async getHealth() {
    return request('/health');
  },

  // Projects
  async getProjects() {
    return request('/projects');
  },
  async getProject(id) {
    return request(`/projects/${id}`);
  },

  // Skills
  async getSkills(category) {
    const q = category && category !== 'all' ? `?category=${category}` : '';
    return request(`/skills${q}`);
  },

  // Education
  async getEducation(type) {
    const q = type ? `?type=${type}` : '';
    return request(`/education${q}`);
  },

  // Roadmap
  async getRoadmap() {
    return request('/roadmap');
  },

  // Social Links
  async getSocialLinks() {
    return request('/social-links');
  },

  // Settings
  async getSettings() {
    return request('/settings');
  },

  // Contact Form
  async sendContactMessage(payload) {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // GitHub telemetry (placeholder)
  async getGitHubTelemetry() {
    return { commits: 142, streak: 18 };
  },

  // ─── Admin API (JWT protected) ───────────────────────────

  async adminLogin(email, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async adminGetMe(token) {
    return request('/auth/me', { headers: authHeader(token) });
  },

  async adminGetDashboard(token) {
    return request('/admin/dashboard', { headers: authHeader(token) });
  },

  async adminGetMessages(token, status, page = 1) {
    const q = new URLSearchParams();
    if (status) q.set('status', status);
    q.set('page', page);
    return request(`/admin/messages?${q.toString()}`, { headers: authHeader(token) });
  },

  async adminMarkMessageRead(token, id) {
    return request(`/admin/messages/${id}/read`, { method: 'PUT', headers: authHeader(token) });
  },

  async adminCreateProject(token, data) {
    return request('/admin/projects', { method: 'POST', body: JSON.stringify(data), headers: authHeader(token) });
  },

  async adminUpdateProject(token, id, data) {
    return request(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeader(token) });
  },

  async adminDeleteProject(token, id) {
    return request(`/admin/projects/${id}`, { method: 'DELETE', headers: authHeader(token) });
  },

  async adminCreateSkill(token, data) {
    return request('/admin/skills', { method: 'POST', body: JSON.stringify(data), headers: authHeader(token) });
  },

  async adminUpdateSkill(token, id, data) {
    return request(`/admin/skills/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeader(token) });
  },

  async adminDeleteSkill(token, id) {
    return request(`/admin/skills/${id}`, { method: 'DELETE', headers: authHeader(token) });
  },

  async adminCreateRoadmap(token, data) {
    return request('/admin/roadmap', { method: 'POST', body: JSON.stringify(data), headers: authHeader(token) });
  },

  async adminUpdateRoadmap(token, id, data) {
    return request(`/admin/roadmap/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeader(token) });
  },

  async adminUpdateSettings(token, key, value) {
    return request('/admin/settings', { method: 'PUT', body: JSON.stringify({ key, value }), headers: authHeader(token) });
  },
};
