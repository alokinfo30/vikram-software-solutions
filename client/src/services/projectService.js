// client/src/services/projectService.js
import API from './api';

class ProjectService {
  async getAllProjects() {
    const response = await API.get('/projects');
    return response.data;
  }

  async getProjectById(id) {
    const response = await API.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(projectData) {
    const response = await API.post('/projects', projectData);
    return response.data;
  }

  async updateProject(id, projectData) {
    const response = await API.put(`/projects/${id}`, projectData);
    return response.data;
  }

  async deleteProject(id) {
    const response = await API.delete(`/projects/${id}`);
    return response.data;
  }

  async getAssignedProjects() {
    const response = await API.get('/projects/assigned');
    return response.data;
  }

  async getClientProjects() {
    const response = await API.get('/projects/my-projects');
    return response.data;
  }

  async updateProjectStatus(id, status) {
    const response = await API.put(`/projects/${id}/status`, { status });
    return response.data;
  }

  async assignEmployee(projectId, employeeId) {
    const response = await API.post(`/projects/${projectId}/assign`, { employeeId });
    return response.data;
  }

  async removeEmployee(projectId, employeeId) {
    const response = await API.delete(`/projects/${projectId}/assign/${employeeId}`);
    return response.data;
  }
}

export default new ProjectService();