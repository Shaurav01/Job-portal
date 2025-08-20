import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ToastProvider } from './context/ToastContext';
import ToastViewport from './components/ui/ToastViewport';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { Jobs, JobDetails, Applications, SavedJobs, Profile, SeekerDashboard, EmployerDashboard, PostJob, MyJobs, EmployerOnboarding, SeekerOnboarding, EditJob } from './pages';
import Applicants from './pages/employer/Applicants';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <JobProvider>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                
                {/* Onboarding */}
                <Route 
                  path="/onboarding/employer" 
                  element={
                    <ProtectedRoute allowedRoles={['employer']}>
                      <EmployerOnboarding />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/onboarding/seeker" 
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <SeekerOnboarding />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Routes - Job Seekers */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <SeekerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/applications" 
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <Applications />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/saved-jobs" 
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <SavedJobs />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Routes - Employers */}
                <Route 
                  path="/employer-dashboard" 
                  element={
                    <ProtectedRoute allowedRoles={['employer']}>
                      <EmployerDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/post-job" 
                  element={
                    <ProtectedRoute allowedRoles={['employer']}>
                      <PostJob />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-jobs" 
                  element={
                    <ProtectedRoute allowedRoles={['employer']}>
                      <MyJobs />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobs/:id/edit" 
                  element={
                    <ProtectedRoute allowedRoles={['employer']}>
                      <EditJob />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobs/:id/applicants" 
                  element={
                    <ProtectedRoute allowedRoles={['employer']}>
                      <Applicants />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
            <ToastViewport />
          </JobProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
