import { apiClient } from './apiClient';

/**
 * Profile Service — Clean API interfaces for personal profile and biography.
 */
export const profileService = {
  async getProfile() {
    return apiClient.get('/admin/profile');
  },

  async updateProfile(profileData) {
    return apiClient.put('/admin/profile', profileData);
  },

  async getSocialLinks() {
    return apiClient.get('/social-links');
  },

  async updateSocialLink(id, linkData) {
    return apiClient.put(`/admin/social-links/${id}`, linkData);
  },
};
