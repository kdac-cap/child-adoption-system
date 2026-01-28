import axios from 'axios';

const API_URL = 'http://localhost:8080/api/documents';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
});

const documentService = {
  submitDocuments: async (applicationId, documents) => {
    const response = await axios.post(`${API_URL}/submit`, {
      applicationId,
      ...documents
    }, getAuthHeader());
    return response.data;
  },

  getDocumentById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeader());
    return response.data;
  },

  getDocumentByApplication: async (applicationId) => {
    const response = await axios.get(`${API_URL}/application/${applicationId}`, getAuthHeader());
    return response.data;
  },

  getDocumentsByParent: async (parentId) => {
    const response = await axios.get(`${API_URL}/parent/${parentId}`, getAuthHeader());
    return response.data;
  },

  getAllDocuments: async () => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },

  verifyDocuments: async (id, status, comments) => {
    const response = await axios.put(`${API_URL}/${id}/verify`, { status, comments }, getAuthHeader());
    return response.data;
  }
};

export default documentService;
