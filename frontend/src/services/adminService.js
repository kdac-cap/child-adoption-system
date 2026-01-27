import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { Authorization: `Bearer ${token}` };
};

export const adminService = {
  // Existing methods...
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/users`, { headers: getAuthHeader() });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, { headers: getAuthHeader() });
    return response.data;
  },

  getAllApplications: async () => {
    const response = await axios.get(`${API_URL}/applications`, { headers: getAuthHeader() });
    return response.data;
  },

  approveApplication: async (applicationId, message) => {
    const response = await axios.put(
      `${API_URL}/applications/${applicationId}/approve`,
      { message },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  rejectApplication: async (applicationId, message) => {
    const response = await axios.put(
      `${API_URL}/applications/${applicationId}/reject`,
      { message },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  requestWelfareReview: async (applicationId) => {
    const response = await axios.put(
      `${API_URL}/applications/${applicationId}/welfare-review`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  approveWelfareReview: async (applicationId, comments) => {
    const response = await axios.put(
      `${API_URL}/applications/${applicationId}/welfare-approve`,
      { comments },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getStatistics: async () => {
    const response = await axios.get(`${API_URL}/stats`, { headers: getAuthHeader() });
    return response.data;
  },

  // Audit Log methods
  getAuditLogs: async () => {
    const response = await axios.get(`${API_URL}/audit-logs`, { headers: getAuthHeader() });
    return response.data;
  },

  getAuditLogsByUser: async (userId) => {
    const response = await axios.get(`${API_URL}/audit-logs/user/${userId}`, { headers: getAuthHeader() });
    return response.data;
  },

  getAuditLogsByEntity: async (entityType, entityId) => {
    const response = await axios.get(`${API_URL}/audit-logs/entity/${entityType}/${entityId}`, { headers: getAuthHeader() });
    return response.data;
  }
};

export default adminService;
