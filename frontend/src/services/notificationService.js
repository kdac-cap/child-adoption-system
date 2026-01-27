import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notifications';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
});

const notificationService = {
  getNotificationsByUser: async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeader());
    return response.data;
  },

  getUnreadNotifications: async (userId) => {
    const response = await axios.get(`${API_URL}/user/${userId}/unread`, getAuthHeader());
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axios.put(`${API_URL}/${id}/read`, {}, getAuthHeader());
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  }
};

export default notificationService;
