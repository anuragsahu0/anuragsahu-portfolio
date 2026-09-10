/**
 * ANURAG SAHU CONTROL CENTER — Auth Service
 * Production auth management: login, token storage, and session validation.
 */

const TOKEN_KEY = 'as_admin_token';
const USER_KEY = 'as_admin_user';

export const authService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  },

  getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getToken());
  },

  async login(email, password, remember = false) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    const storage = remember ? localStorage : sessionStorage;
    if (data.token) {
      storage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user) {
      storage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};
