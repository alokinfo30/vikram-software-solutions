// client/src/services/userService.js
import API from './api';

class UserService {
  async getAllUsers() {
    const response = await API.get('/users');
    return response.data;
  }

  async getUserById(id) {
    const response = await API.get(`/users/${id}`);
    return response.data;
  }

  async createUser(userData) {
    const response = await API.post('/users', userData);
    return response.data;
  }

  async updateUser(id, userData) {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id) {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  }

  async getUsersByRole(role) {
    const response = await API.get(`/users/role/${role}`);
    return response.data;
  }
}

export default new UserService();