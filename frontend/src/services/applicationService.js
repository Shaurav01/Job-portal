import api from './api';

export const applicationService = {
  // Apply to a job
  async applyToJob(jobId, applicationData) {
    const response = await api.post(`/applications/${jobId}`, applicationData);
    return response.data;
  },

  // Get user's applications
  async getMyApplications() {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  // Get applications for a specific job (employers only)
  async getJobApplications(jobId) {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  // Update application status (employers only)
  async updateApplicationStatus(applicationId, statusData) {
    const response = await api.put(`/applications/${applicationId}/status`, statusData);
    return response.data;
  },

  // Withdraw application
  async withdrawApplication(applicationId) {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },

  // Get application statistics
  async getApplicationStats() {
    const response = await api.get('/applications/stats');
    return response.data;
  }
};
