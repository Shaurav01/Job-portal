import React, { useEffect, useState } from "react";
import { userService } from "../services/userService";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyState from "../components/ui/EmptyState";
import JobCard from "../components/ui/JobCard";

const SavedJobs = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await userService.getSavedJobs();
        if (res.success) setSaved(res.data?.jobs || []);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  if (!saved.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <EmptyState
          title="No saved jobs yet"
          description="Save jobs you are interested in to review or apply later."
          action={
            <a
              href="/jobs"
              className="btn-primary inline-block mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Find Jobs
            </a>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Saved Jobs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {saved.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
