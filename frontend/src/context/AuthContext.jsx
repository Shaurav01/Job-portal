import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      if (response.success) {
        const { token, ...userWithoutToken } = response.data || {};
        const stored = authService.getCurrentUser();
        setUser(stored || userWithoutToken || null);
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      if (response.success) {
        const { token, ...userWithoutToken } = response.data || {};
        const stored = authService.getCurrentUser();
        setUser(stored || userWithoutToken || null);
        return { success: true };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        const stored = authService.getCurrentUser();
        setUser(stored);
        return { success: true };
      } else {
        setError(response.message || 'Profile update failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      setError(message);
      return { success: false, message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isJobSeeker: user?.role === 'jobseeker',
    isEmployer: user?.role === 'employer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
