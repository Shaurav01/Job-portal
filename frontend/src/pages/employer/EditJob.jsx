import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/jobService";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "full-time",
    category: "",
    experience: "entry",
    description: "",
    salaryMin: "",
    salaryMax: "",
    requirements: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await jobService.getJob(id);
        if (res.success) {
          const j = res.data;
          setForm({
            title: j.title || "",
            location: j.location || "",
            type: j.type || "full-time",
            category: j.category || "",
            experience: j.experience || "entry",
            description: j.description || "",
            salaryMin: j.salary?.min ?? "",
            salaryMax: j.salary?.max ?? "",
            requirements: (j.requirements || []).join(", "),
          });
        } else {
          setMessage(res.message || "Failed to load job");
        }
      } catch {
        setMessage("Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const update = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        title: form.title,
        location: form.location,
        type: form.type,
        category: form.category,
        experience: form.experience,
        description: form.description,
        salary: {
          min: form.salaryMin !== "" ? Number(form.salaryMin) : undefined,
          max: form.salaryMax !== "" ? Number(form.salaryMax) : undefined,
        },
        requirements: form.requirements
          ? form.requirements
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      const res = await jobService.updateJob(id, payload);
      if (res.success) {
        navigate("/my-jobs", { replace: true });
      } else {
        const msg =
          res.errors?.map((e) => `${e.field}: ${e.message}`).join("\n") ||
          res.message;
        setMessage(msg || "Failed to update job");
      }
    } catch (e) {
      setMessage(e.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-600">
        Loading job details...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        Edit Job
      </h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium whitespace-pre-line ${
            message.toLowerCase().includes("failed")
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={update}
        className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Job Title
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            required
          />
        </div>

        {/* Location & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((p) => ({ ...p, type: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Category & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <input
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Experience Level
            </label>
            <select
              value={form.experience}
              onChange={(e) =>
                setForm((p) => ({ ...p, experience: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              <option value="entry">Entry</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={6}
            className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 50 characters recommended.
          </p>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Salary Min
            </label>
            <input
              type="number"
              min="1"
              value={form.salaryMin}
              onChange={(e) =>
                setForm((p) => ({ ...p, salaryMin: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Salary Max
            </label>
            <input
              type="number"
              min={form.salaryMin || 1}
              value={form.salaryMax}
              onChange={(e) =>
                setForm((p) => ({ ...p, salaryMax: e.target.value }))
              }
              className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Requirements (comma separated)
          </label>
          <input
            value={form.requirements}
            onChange={(e) =>
              setForm((p) => ({ ...p, requirements: e.target.value }))
            }
            placeholder="e.g., React, Node.js, MongoDB"
            className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 text-sm"
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
