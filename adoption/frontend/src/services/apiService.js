const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Children endpoints
  async getChildren() {
    return this.request('/children');
  }

  async createChild(childData) {
    return this.request('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  }

  async getChild(id) {
    return this.request(`/children/${id}`);
  }

  // Applications endpoints
  async getApplications() {
    return this.request('/applications');
  }

  async createApplication(applicationData) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async updateApplication(id, applicationData) {
    return this.request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  }
}

export default new ApiService();