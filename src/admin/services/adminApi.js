/**
 * ANURAG SAHU CONTROL CENTER — Admin API Service
 * Production-ready API service connecting to real backend endpoints:
 * - GET /api/admin/dashboard
 * - GET /api/admin/messages
 * - PUT /api/admin/messages/:id/read
 * - PUT /api/admin/messages/:id/archive
 * - GET /api/health
 */

const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('as_admin_token') || sessionStorage.getItem('as_admin_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const adminApi = {
  // System Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed (${res.status})`);
    return res.json();
  },

  // Dashboard Aggregated Telemetry
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      throw new Error(`Failed to fetch dashboard stats (${res.status})`);
    }
    return res.json();
  },

  // Messages / Inquiries
  async getMessages(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE}/admin/messages${query ? `?${query}` : ''}`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) {
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      throw new Error(`Failed to fetch messages (${res.status})`);
    }
    return res.json();
  },

  async markMessageRead(id) {
    const res = await fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to mark message read (${res.status})`);
    return res.json();
  },

  async archiveMessage(id) {
    const res = await fetch(`${API_BASE}/admin/messages/${id}/archive`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Failed to archive message (${res.status})`);
    return res.json();
  },

  // Clean Service Interface Placeholders for Future CMS Phases (Phase 01+)
  async getProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error(`Failed to fetch projects (${res.status})`);
    return res.json();
  },

  async getSkills() {
    const res = await fetch(`${API_BASE}/skills`);
    if (!res.ok) throw new Error(`Failed to fetch skills (${res.status})`);
    return res.json();
  },

  async getEducation() {
    const res = await fetch(`${API_BASE}/education`);
    if (!res.ok) throw new Error(`Failed to fetch education (${res.status})`);
    return res.json();
  },

  async getRoadmap() {
    const res = await fetch(`${API_BASE}/roadmap`);
    if (!res.ok) throw new Error(`Failed to fetch roadmap (${res.status})`);
    return res.json();
  },

  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error(`Failed to fetch settings (${res.status})`);
    return res.json();
  },
};
