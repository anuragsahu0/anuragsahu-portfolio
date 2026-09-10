/**
 * ANURAG SAHU CONTROL CENTER — Auth Service
 * Production auth management: login, cookie sessions, and session validation.
 */

const USER_KEY = 'as_admin_user';

export const authService = {
  getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_err) {
      return null;
    }
  },

  async getMe() {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        this.clearSession();
        return null;
      }

      const data = await res.json();
      const user = data.data?.user || data.user || null;
      if (user) {
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      return user;
    } catch (_err) {
      return null;
    }
  },

  async login(email, password, remember = false) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.error?.message || data.message || 'Authentication failed.';
      throw new Error(errorMsg);
    }

    const user = data.data?.user || data.user;
    const storage = remember ? localStorage : sessionStorage;
    if (user) {
      storage.setItem(USER_KEY, JSON.stringify(user));
    }

    return data;
  },

  async logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    } catch (err) {
      console.warn('Logout network notification failed:', err);
    }
    this.clearSession();
  },

  clearSession() {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
  },
};

