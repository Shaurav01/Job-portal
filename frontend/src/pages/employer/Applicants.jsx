import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { applicationService } from "../../services/applicationService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { uploadService } from "../../services/uploadService";
import { UserIcon, EnvelopeIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const statusOptions = ["pending", "reviewed", "shortlisted", "rejected", "hired"];

const Applicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const res = await applicationService.getJobApplications(id);
      if (res.success) setApplications(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const updateStatus = async (appId, status) => {
    setMessage("");
    const res = await applicationService.updateApplicationStatus(appId, { status });
    if (res.success) {
      setMessage("✅ Status updated successfully!");
      load();
    } else {
      setMessage(res.message || "❌ Failed to update status");
    }
  };

  if (loading) return <LoadingSpinner className="py-12" />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Applicants</h1>
        <Link
          to={`/jobs/${id}`}
          className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition"
        >
          View Job
        </Link>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`mb-6 p-3 rounded-lg text-sm font-medium ${
            message.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Applicants List */}
      <div className="bg-white border rounded-2xl shadow-sm divide-y">
        {applications.length === 0 ? (
          <div className="p-8 text-gray-500 text-center">No applicants yet.</div>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="p-6 hover:bg-gray-50 transition duration-200"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                {/* Applicant Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    {app.applicant?.firstName} {app.applicant?.lastName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                    {app.applicant?.email}
                  </div>
                  {app.coverLetter && (
                    <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-line">
                      {app.coverLetter}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-[220px]">
                  {/* Status Dropdown */}
                  <select
                    className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>

                  {/* Resume Link */}
                  {app.resume && (() => {
                    const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace("/api", "");
                    const href = app.resume.startsWith("/uploads/")
                      ? `${base}${app.resume}`
                      : uploadService.getFileURL(app.resume);
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition"
                      >
                        <DocumentTextIcon className="w-4 h-4" />
                        Resume
                      </a>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Applicants;
