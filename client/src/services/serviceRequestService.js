// client/src/services/serviceRequestService.js
import API from './api';

class ServiceRequestService {
  async getAllRequests() {
    const response = await API.get('/service-requests');
    return response.data;
  }

  async getMyRequests() {
    const response = await API.get('/service-requests/my-requests');
    return response.data;
  }

  async createRequest(requestData) {
    const response = await API.post('/service-requests', requestData);
    return response.data;
  }

  async approveRequest(requestId) {
    const response = await API.put(`/service-requests/${requestId}/approve`);
    return response.data;
  }

  async rejectRequest(requestId) {
    const response = await API.put(`/service-requests/${requestId}/reject`);
    return response.data;
  }

  async getRequestById(requestId) {
    const response = await API.get(`/service-requests/${requestId}`);
    return response.data;
  }
}

export default new ServiceRequestService();