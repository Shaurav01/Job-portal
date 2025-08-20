import api from './api';

export const jobService = {
  // Get all jobs with filters
  async getJobs(filters = {}) {
    const params = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get featured jobs
  async getFeaturedJobs() {
    const response = await api.get('/jobs/featured');
    return response.data;
  },

  // Get job categories
  async getJobCategories() {
    const response = await api.get('/jobs/categories');
    return response.data;
  },

  // Get single job by ID
  async getJob(id) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create new job (employers only)
  async createJob(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job (employers only)
  async updateJob(id, jobData) {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job (employers only)
  async deleteJob(id) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Get employer's jobs
  async getEmployerJobs() {
    const response = await api.get('/jobs/employer/my-jobs');
    return response.data;
  },

  // Search jobs
  async searchJobs(searchTerm, filters = {}) {
    const params = new URLSearchParams();
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  }
};
