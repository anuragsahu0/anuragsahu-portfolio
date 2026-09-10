import { apiClient } from './apiClient';

/**
 * Project Service — Clean API interfaces for portfolio project records.
 */
export const projectService = {
  async getProjects() {
    return apiClient.get('/projects');
  },

  async getProjectById(id) {
    return apiClient.get(`/projects/${id}`);
  },

  async createProject(projectData) {
    return apiClient.post('/admin/projects', projectData);
  },

  async updateProject(id, projectData) {
    return apiClient.put(`/admin/projects/${id}`, projectData);
  },

  async deleteProject(id) {
    return apiClient.delete(`/admin/projects/${id}`);
  },
};
