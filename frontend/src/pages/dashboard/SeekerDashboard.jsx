import React, { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import { applicationService } from "../../services/applicationService"; // ✅ Added import
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatCard from "../../components/ui/StatCard";
import {
  BriefcaseIcon,
  BookmarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const SeekerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [userStats, appStats] = await Promise.all([
          userService.getUserStats(),
          applicationService.getApplicationStats(),
        ]);
        const merged = {};
        if (userStats?.success) Object.assign(merged, userStats.data);
        if (appStats?.success) {
          merged.totalApplications =
            appStats.data?.total ?? merged.totalApplications;
          merged.applicationsByStatus =
            appStats.data?.byStatus ?? merged.applicationsByStatus;
        }
        setStats(merged);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner className="py-12" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome Back 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Track your applications, saved jobs, and profile progress.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Applications"
          value={stats?.totalApplications || 0}
          icon={BriefcaseIcon}
        />
        <StatCard
          label="Saved Jobs"
          value={stats?.savedJobs || 0}
          color="success"
          icon={BookmarkIcon}
        />
        <StatCard
          label="Profile Completion"
          value={`${stats?.profileCompletion || 0}%`}
          color="warning"
          icon={UserCircleIcon}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-10 bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Jump quickly to important sections.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="/jobs"
            className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Find Jobs
          </a>
          <a
            href="/applications"
            className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            View Applications
          </a>
          <a
            href="/saved-jobs"
            className="px-4 py-2 rounded-lg border text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Saved Jobs
          </a>
          <a
            href="/profile"
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium shadow hover:bg-primary-700 transition"
          >
            Update Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
