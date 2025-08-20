import React, { createContext, useContext, useState, useEffect } from 'react';
import { jobService } from '../services/jobService';

const JobContext = createContext();

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

const defaultFilters = {
  search: '',
  location: '',
  type: '',
  category: '',
  salaryMin: '',
  salaryMax: '',
  sort: 'newest',
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => {
    try {
      const stored = localStorage.getItem('jobFilters');
      return stored ? { ...defaultFilters, ...JSON.parse(stored) } : defaultFilters;
    } catch {
      return defaultFilters;
    }
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 12,
  });

  useEffect(() => {
    localStorage.setItem('jobFilters', JSON.stringify(filters));
  }, [filters]);

  // Load featured jobs on mount
  useEffect(() => {
    loadFeaturedJobs();
    loadCategories();
  }, []);

  const loadFeaturedJobs = async () => {
    try {
      const response = await jobService.getFeaturedJobs();
      if (response.success) {
        setFeaturedJobs(response.data);
      }
    } catch (error) {
      // silent
    }
  };

  const loadCategories = async () => {
    try {
      const response = await jobService.getJobCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      // silent
    }
  };

  const searchJobs = async (searchTerm = '', newFilters = {}) => {
    return loadJobs({ ...newFilters, search: searchTerm });
  };

  const loadJobs = async (newFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const mergedFilters = { ...filters, ...newFilters };
      const page = newFilters.page || pagination.current || 1;
      const limit = newFilters.limit || pagination.limit || 12;

      setFilters(mergedFilters);

      const response = await jobService.getJobs({ ...mergedFilters, page, limit });

      if (response.success) {
        setJobs(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        } else {
          setPagination({ current: page, pages: 1, total: response.data.length, limit });
        }
      } else {
        setError(response.message || 'Failed to load jobs');
      }
    } catch (error) {
      setError('An error occurred while loading jobs');
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData) => {
    try {
      setError(null);
      const response = await jobService.createJob(jobData);
      if (response.success) {
        await loadJobs({ page: 1 });
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to create job');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create job';
      setError(message);
      return { success: false, message };
    }
  };

  const updateJob = async (id, jobData) => {
    try {
      setError(null);
      const response = await jobService.updateJob(id, jobData);
      if (response.success) {
        setJobs(prevJobs => prevJobs.map(job => job._id === id ? { ...job, ...response.data } : job));
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update job');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update job';
      setError(message);
      return { success: false, message };
    }
  };

  const deleteJob = async (id) => {
    try {
      setError(null);
      const response = await jobService.deleteJob(id);
      if (response.success) {
        setJobs(prevJobs => prevJobs.filter(job => job._id !== id));
        return { success: true };
      } else {
        setError(response.message || 'Failed to delete job');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete job';
      setError(message);
      return { success: false, message };
    }
  };

  const clearError = () => setError(null);

  const value = {
    jobs,
    featuredJobs,
    categories,
    loading,
    error,
    filters,
    pagination,
    searchJobs,
    loadJobs,
    createJob,
    updateJob,
    deleteJob,
    clearError,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
