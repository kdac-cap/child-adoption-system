import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 1. Authentication APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  registerChildWelfare: (data) => api.post('/auth/register/child-welfare', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// 2. User Management APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.put('/users/change-password', data),
};

// 3. Child Management APIs
export const childAPI = {
  addChild: (data) => api.post('/children', data),
  getAllChildren: () => api.get('/children'),
  getChild: (id) => api.get(`/children/${id}`),
  updateChild: (id, data) => api.put(`/children/${id}`, data),
  deleteChild: (id) => api.delete(`/children/${id}`),
};

// 4. Adoption Application APIs
export const adoptionAPI = {
  apply: (childId) => api.post(`/adoptions/apply/${childId}`),
  getMyApplications: () => api.get('/adoptions/my-applications'),
  getApplication: (id) => api.get(`/adoptions/${id}`),
  getAllApplications: () => api.get('/adoptions/all'),
  approve: (id, message) => api.put(`/adoptions/${id}/approve`, { message }),
  reject: (id, message) => api.put(`/adoptions/${id}/reject`, { message }),
};

// 5. Document Management APIs
export const documentAPI = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyDocuments: () => api.get('/documents/my-documents'),
  getDocument: (id) => api.get(`/documents/${id}`),
};

// 6. Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// 7. Admin APIs (existing)
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getAllChildren: () => api.get('/admin/children'),
  getAllApplications: () => api.get('/admin/applications'),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  approveApplication: (appId) => api.put(`/admin/applications/${appId}/approve`, { message: 'Approved' }),
  rejectApplication: (appId) => api.put(`/admin/applications/${appId}/reject`, { message: 'Rejected' }),
  requestWelfareReview: (appId) => api.put(`/admin/applications/${appId}/welfare-review`),
};

// 8. Staff APIs (existing)
export const staffAPI = {
  getDocuments: () => api.get('/staff/documents'),
  verifyDocument: (docId) => api.put(`/staff/documents/${docId}/verify`),
  rejectDocument: (docId, reason) => api.put(`/staff/documents/${docId}/reject`, { reason }),
};

// 9. Child Welfare APIs (existing)
export const childWelfareAPI = {
  getApplications: () => api.get('/child-welfare/applications'),
  scheduleVisit: (appId, visitData) => api.post(`/child-welfare/applications/${appId}/visits`, visitData),
  completeVisit: (visitId, report) => api.put(`/child-welfare/visits/${visitId}/complete`, report),
  approveApplication: (appId, comments) => api.put(`/child-welfare/applications/${appId}/approve`, { comments }),
  rejectApplication: (appId, comments) => api.put(`/child-welfare/applications/${appId}/reject`, { comments }),
};

// 10. Parent APIs (existing)
export const parentAPI = {
  submitApplication: (data) => api.post('/parent/applications', data),
  uploadDocument: (appId, formData) => api.post(`/parent/applications/${appId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyApplications: () => api.get('/parent/applications'),
};

// 11. Donation APIs (existing)
export const donationAPI = {
  create: (data) => api.post('/donations', data),
};

export default api;
