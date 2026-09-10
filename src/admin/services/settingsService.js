import { apiClient } from './apiClient';

/**
 * Settings Service — Site-wide metadata and security configuration API.
 */
export const settingsService = {
  async getSettings() {
    return apiClient.get('/settings');
  },

  async updateSetting(key, value, description = '') {
    return apiClient.put('/admin/settings', { key, value, description });
  },
};
