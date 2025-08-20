import api from './api';

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const payload = response.data;
    if (payload?.success && payload?.data) {
      const { token, ...user } = payload.data;
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return payload;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    const payload = response.data;
    if (payload?.success && payload?.data) {
      const { token, ...user } = payload.data;
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return payload;
  },

  // Get current user profile
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.success) {
      // Update stored user data
      let currentUser = {};
      const raw = localStorage.getItem('user');
      if (raw) {
        try {
          currentUser = JSON.parse(raw) || {};
        } catch (e) {
          // Corrupt value, clear it
          localStorage.removeItem('user');
          currentUser = {};
        }
      }
      const updatedUser = { ...currentUser, ...response.data.data };
      delete updatedUser.token;
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
  },

  // Change password
  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser() {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') {
      if (raw) localStorage.removeItem('user');
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      // Clear corrupt value
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user is job seeker
  isJobSeeker() {
    return this.getUserRole() === 'jobseeker';
  },

  // Check if user is employer
  isEmployer() {
    return this.getUserRole() === 'employer';
  }
};
