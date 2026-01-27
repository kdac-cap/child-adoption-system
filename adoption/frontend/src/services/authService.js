import apiService from './apiService';

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'token';
    this.USER_KEY = 'user';
  }

  async login(credentials) {
    try {
      const response = await apiService.login(credentials);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await apiService.register(userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async registerChildWelfare(userData) {
    try {
      const response = await apiService.registerChildWelfare(userData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Child welfare registration failed');
    }
  }

  logout() {
    apiService.logout();
    window.location.href = '/login';
  }

  isAuthenticated() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin() {
    return this.hasRole('ADMIN');
  }

  isParent() {
    return this.hasRole('PARENT');
  }

  isStaff() {
    return this.hasRole('STAFF');
  }

  isAgency() {
    return this.hasRole('AGENCY');
  }

  isChildWelfare() {
    return this.hasRole('CHILD_WELFARE');
  }
}

export default new AuthService();