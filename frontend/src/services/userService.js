import api from './api';

export const userService = {
  // Get user profile by ID
  async getUserProfile(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Save/unsave a job
  async saveJob(jobId) {
    const response = await api.post(`/users/save-job/${jobId}`);
    return response.data;
  },

  // Get saved jobs
  async getSavedJobs(page = 1, limit = 10) {
    const response = await api.get(`/users/saved-jobs?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get user statistics
  async getUserStats() {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Search users (employers only)
  async searchUsers(searchParams) {
    const params = new URLSearchParams();
    
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined && searchParams[key] !== '') {
        params.append(key, searchParams[key]);
      }
    });
    
    const response = await api.get(`/users/search?${params.toString()}`);
    return response.data;
  }
};
