import { apiClient } from './apiClient';

/**
 * Analytics Service — Clean API interfaces for portfolio traffic and telemetry.
 */
export const analyticsService = {
  async getDashboardSummary() {
    return apiClient.get('/admin/dashboard');
  },

  async getHealth() {
    return apiClient.get('/health');
  },

  async trackEvent(eventName, metadata = {}) {
    return apiClient.post('/analytics/track', {
      event: eventName,
      metadata,
      timestamp: new Date().toISOString(),
    });
  },
};
