import axios from 'axios';

const API_URL = 'http://localhost:8080/api/applications';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
});

const applicationService = {
  createApplication: async (parentId, childId) => {
    const response = await axios.post(API_URL, { parentId, childId }, getAuthHeader());
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },

  getApplicationsByParent: async (parentId) => {
    const response = await axios.get(`${API_URL}/parent/${parentId}`, getAuthHeader());
    return response.data;
  },

  getAllApplications: async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  getApplicationsByStatus: async (status) => {
    const response = await axios.get(`${API_URL}/status/${status}`, getAuthHeader());
    return response.data;
  },

  updateApplicationStatus: async (id, status, message) => {
    const response = await axios.put(`${API_URL}/${id}/status`, { status, message }, getAuthHeader());
    return response.data;
  },

  deleteApplication: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  }
};

export default applicationService;
