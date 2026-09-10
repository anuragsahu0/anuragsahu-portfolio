import { apiClient } from './apiClient';

/**
 * Message Service — Real API methods for contact inquiries.
 */
export const messageService = {
  async getMessages(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = `/admin/messages${query ? `?${query}` : ''}`;
    return apiClient.get(endpoint);
  },

  async markRead(id) {
    return apiClient.put(`/admin/messages/${id}/read`, {});
  },

  async archiveMessage(id) {
    return apiClient.put(`/admin/messages/${id}/archive`, {});
  },
};
