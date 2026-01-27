const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const adoptionAPI = {
  // Application APIs
  applyForAdoption: async (parentId, childId) => {
    const response = await fetch(`${API_BASE_URL}/applications/apply?parentId=${parentId}&childId=${childId}`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  getParentApplications: async (parentId) => {
    const response = await fetch(`${API_BASE_URL}/applications/parent/${parentId}`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  getAllApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/applications/all`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  requestDocuments: async (applicationId, message) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/request-documents`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader() 
      },
      body: JSON.stringify({ message })
    });
    return response.json();
  },

  verifyDocuments: async (applicationId) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/verify-documents`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  scheduleWelfareVisit: async (applicationId) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/schedule-welfare-visit`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  completeWelfareVisit: async (applicationId, approved) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/complete-welfare-visit?approved=${approved}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  // Document APIs
  submitDocuments: async (parentId, applicationId, documents) => {
    const response = await fetch(`${API_BASE_URL}/documents/submit?parentId=${parentId}&applicationId=${applicationId}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader() 
      },
      body: JSON.stringify(documents)
    });
    return response.json();
  },

  getDocumentByApplication: async (applicationId) => {
    const response = await fetch(`${API_BASE_URL}/documents/application/${applicationId}`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  getAllDocuments: async () => {
    const response = await fetch(`${API_BASE_URL}/documents/all`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  verifyDocument: async (documentId, approved, comments) => {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/verify?approved=${approved}&comments=${comments || ''}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  // Notification APIs
  getUserNotifications: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`, {
      headers: { ...getAuthHeader() }
    });
    return response.json();
  },

  markNotificationAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return response;
  }
};
