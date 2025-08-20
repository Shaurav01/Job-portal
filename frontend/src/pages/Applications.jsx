import React, { useEffect, useState } from 'react';
import { applicationService } from '../services/applicationService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  accepted: 'bg-green-100 text-green-800 border border-green-200',
  rejected: 'bg-red-100 text-red-800 border border-red-200',
  interview: 'bg-blue-100 text-blue-800 border border-blue-200',
};

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationService.getMyApplications();
        if (res.success) setApplications(res.data);
        else setError(res.message || res.error || 'Failed to fetch applications');
      } catch (e) {
        const status = e.response?.status;
        const data = e.response?.data;
        if (status === 401) {
          setError('Please log in to view your applications.');
        } else if (status === 403) {
          setError('This page is for job seekers. Please log in with a job seeker account.');
        } else {
          setError(data?.message || data?.error || 'Failed to fetch applications');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!applications.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="No applications yet"
          description="Start applying to jobs and track your application status here."
          action={<a href="/jobs" className="btn-primary">Browse Jobs</a>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>
      
      {/* Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => {
          const statusClass = statusColors[app.status?.toLowerCase()] || 
            'bg-gray-100 text-gray-700 border border-gray-200';

          return (
            <div
              key={app._id}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {app.job?.title}
                </h2>
                <p className="text-sm text-gray-600">{app.job?.companyName}</p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                  {app.status}
                </span>
                <a
                  href={`/jobs/${app.job?._id}`}
                  className="text-primary-600 text-sm font-medium hover:underline"
                >
                  View Job
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Applications;
