import axios from 'axios';
import { API_CONFIG } from '../utils/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL + '/api/children';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const childService = {
  // Get all children
  getAllChildren: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch children' };
    }
  },

  // Get children by status
  getChildrenByStatus: async (status) => {
    try {
      const response = await api.get(`/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch children' };
    }
  },

  // Get child by ID
  getChildById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch child' };
    }
  },

  // Add new child (Staff only)
  addChild: async (childData) => {
    try {
      const formData = new FormData();
      formData.append('name', childData.name);
      formData.append('age', childData.age);
      formData.append('gender', childData.gender);
      if (childData.description) formData.append('description', childData.description);
      if (childData.healthReport) formData.append('healthReport', childData.healthReport);
      if (childData.fosterHistory) formData.append('fosterHistory', childData.fosterHistory);
      if (childData.photo) formData.append('photo', childData.photo);

      const response = await axios.post('http://localhost:8080/staff/children', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add child' };
    }
  },

  // Update child (Staff only)
  updateChild: async (id, childData) => {
    try {
      const formData = new FormData();
      formData.append('name', childData.name);
      formData.append('age', childData.age);
      formData.append('gender', childData.gender);
      if (childData.description) formData.append('description', childData.description);
      if (childData.healthReport) formData.append('healthReport', childData.healthReport);
      if (childData.fosterHistory) formData.append('fosterHistory', childData.fosterHistory);
      if (childData.photo) formData.append('photo', childData.photo);

      const response = await axios.put(`http://localhost:8080/staff/children/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update child' };
    }
  },

  // Delete child (Staff only)
  deleteChild: async (id) => {
    try {
      await axios.delete(`http://localhost:8080/staff/children/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return { success: true };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete child' };
    }
  },

  // Update child status (Staff only)
  updateChildStatus: async (id, status) => {
    try {
      const response = await api.patch(`/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update status' };
    }
  }
};

export default childService;