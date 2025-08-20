import React, { useEffect, useState } from "react";
import { jobService } from "../../services/jobService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { PlusCircle, Briefcase, Users } from "lucide-react"; // modern icons

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobService.getEmployerJobs();
        if (res.success) setJobs(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <LoadingSpinner className="py-12" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your jobs and applicants with ease.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="/post-job"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium shadow hover:bg-primary-700 transition"
          >
            <PlusCircle size={18} />
            Post a Job
          </a>
          <a
            href="/my-jobs"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
          >
            <Briefcase size={18} />
            Manage Jobs
          </a>
        </div>
      </div>

      {/* Recent Jobs Section */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase size={20} className="text-primary-600" />
          Recent Jobs
        </h2>

        <div className="mt-4 divide-y divide-gray-200">
          {jobs.length === 0 ? (
            <p className="text-gray-600 py-6 text-center">
              You haven’t posted any jobs yet.
            </p>
          ) : (
            jobs.slice(0, 5).map((job) => (
              <div
                key={job._id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 rounded-lg px-3 transition"
              >
                <div>
                  <p className="font-medium text-gray-900">{job.title}</p>
                  <p className="text-sm text-gray-600">
                    {job.location} • {job.type}
                  </p>
                </div>
                <a
                  href={`/jobs/${job._id}/applicants`}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  <Users size={18} />
                  View Applicants
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
