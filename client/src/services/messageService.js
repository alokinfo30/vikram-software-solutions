// client/src/services/messageService.js
import API from './api';

class MessageService {
  async getConversations() {
    const response = await API.get('/messages/conversations');
    return response.data;
  }

  async getMessages(userId) {
    const response = await API.get(`/messages/${userId}`);
    return response.data;
  }

  async sendMessage(receiverId, content) {
    const response = await API.post('/messages', { receiverId, content });
    return response.data;
  }

  async markAsRead(messageId) {
    const response = await API.put(`/messages/${messageId}/read`);
    return response.data;
  }

  async getUnreadCount() {
    const response = await API.get('/messages/unread/count');
    return response.data;
  }
}

export default new MessageService();