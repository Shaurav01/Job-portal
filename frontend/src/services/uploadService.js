import api from './api';

export const uploadService = {
  // Upload resume
  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/uploads/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/uploads/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get file info
  async getFileInfo(filename) {
    const response = await api.get(`/uploads/${filename}`);
    return response.data;
  },

  // Delete file
  async deleteFile(filename) {
    const response = await api.delete(`/uploads/${filename}`);
    return response.data;
  },

  // Get file URL
  getFileURL(filename) {
    const baseURL = import.meta.env.VITE_API_BASE_URL || "https://job-portal-m4na.onrender.com";
    return `${baseURL.replace('/api', '')}/uploads/${filename}`;
  }
};
