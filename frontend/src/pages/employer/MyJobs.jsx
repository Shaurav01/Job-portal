import React, { useEffect, useState } from "react";
import { jobService } from "../../services/jobService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [reqInput, setReqInput] = useState("");

  const load = async () => {
    try {
      const res = await jobService.getEmployerJobs();
      if (res.success) setJobs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    await jobService.deleteJob(id);
    load();
  };

  const startEdit = (job) => {
    setEditingId(job._id);
    setReqInput((job.requirements || []).join(", "));
  };

  const saveRequirements = async () => {
    const id = editingId;
    const arr = reqInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await jobService.updateJob(id, { requirements: arr });
    setEditingId(null);
    setReqInput("");
    load();
  };

  if (loading) return <LoadingSpinner className="py-12" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
        <a
          href="/post-job"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
        >
          + Post a Job
        </a>
      </div>

      {/* Job List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.length === 0 ? (
          <div className="col-span-full p-8 bg-gray-50 border border-dashed rounded-xl text-center text-gray-600">
            You have not posted any jobs yet.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col h-full">
                {/* Job Info */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {job.location} • {job.type}
                  </p>
                  {/* Uncomment to show requirements */}
                  {/* <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">Requirements:</span>{" "}
                    {(job.requirements || []).join(", ") || "—"}
                  </p> */}
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {editingId === job._id ? (
                    <>
                      <input
                        className="flex-1 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                        value={reqInput}
                        onChange={(e) => setReqInput(e.target.value)}
                        placeholder="e.g., React, Node.js, MongoDB"
                      />
                      <button
                        onClick={saveRequirements}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setReqInput("");
                        }}
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <a
                        href={`/jobs/${job._id}`}
                        className="text-indigo-600 hover:underline text-sm font-medium"
                      >
                        View
                      </a>
                      <a
                        href={`/jobs/${job._id}/edit`}
                        className="text-indigo-600 hover:underline text-sm font-medium"
                      >
                        Edit
                      </a>
                      <a
                        href={`/jobs/${job._id}/applicants`}
                        className="text-indigo-600 hover:underline text-sm font-medium"
                      >
                        Applicants
                      </a>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="text-red-600 hover:underline text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyJobs;
