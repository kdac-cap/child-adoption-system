import axios from 'axios';

const API_URL = 'http://localhost:8080/api/visits';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
});

const visitService = {
  scheduleVisit: async (visitData) => {
    const response = await axios.post(API_URL, visitData, getAuthHeader());
    return response.data;
  },

  getVisitById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },

  getVisitsByApplication: async (applicationId) => {
    const response = await axios.get(`${API_URL}/application/${applicationId}`, getAuthHeader());
    return response.data;
  },

  getAllVisits: async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  updateVisitStatus: async (id, status, notes) => {
    const response = await axios.put(`${API_URL}/${id}/status`, { status, notes }, getAuthHeader());
    return response.data;
  },

  deleteVisit: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  }
};

export default visitService;
