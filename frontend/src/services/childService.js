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
      Object.keys(childData).forEach(key => {
        if (childData[key] !== null && childData[key] !== undefined) {
          formData.append(key, childData[key]);
        }
      });

      const response = await api.post('/', formData, {
        headers: {
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
      Object.keys(childData).forEach(key => {
        if (childData[key] !== null && childData[key] !== undefined) {
          formData.append(key, childData[key]);
        }
      });

      const response = await api.put(`/${id}`, formData, {
        headers: {
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
      await api.delete(`/${id}`);
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