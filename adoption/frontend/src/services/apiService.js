import axios from 'axios';
import config from '../config/environment';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor - Add JWT token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Handle errors
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.api.post('/auth/login', credentials);
    if (response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async register(userData) {
    return this.api.post('/auth/register', userData);
  }

  async registerChildWelfare(userData) {
    return this.api.post('/auth/register/child-welfare', userData);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Children endpoints
  async getChildren() {
    return this.api.get('/children');
  }

  async createChild(childData) {
    return this.api.post('/children', childData);
  }

  async getChild(id) {
    return this.api.get(`/children/${id}`);
  }

  async updateChild(id, childData) {
    return this.api.put(`/children/${id}`, childData);
  }

  async deleteChild(id) {
    return this.api.delete(`/children/${id}`);
  }

  // Applications endpoints
  async getApplications() {
    return this.api.get('/applications');
  }

  async createApplication(applicationData) {
    return this.api.post('/applications', applicationData);
  }

  async updateApplication(id, applicationData) {
    return this.api.put(`/applications/${id}`, applicationData);
  }

  async getApplication(id) {
    return this.api.get(`/applications/${id}`);
  }

  async deleteApplication(id) {
    return this.api.delete(`/applications/${id}`);
  }

  // Documents endpoints
  async uploadDocument(applicationId, documentData) {
    return this.api.post(`/applications/${applicationId}/documents`, documentData);
  }

  async getDocuments(applicationId) {
    return this.api.get(`/applications/${applicationId}/documents`);
  }

  async verifyDocument(documentId, status) {
    return this.api.put(`/documents/${documentId}/verify`, { status });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.api.get('/notifications');
  }

  async markNotificationRead(id) {
    return this.api.put(`/notifications/${id}/read`);
  }
}

export default new ApiService();