import React, { useState } from "react";
import { jobService } from "../../services/jobService";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    type: "full-time",
    category: "engineering",
    experience: "entry",
    description: "",
    salaryMin: "",
    salaryMax: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    // Validation
    if (!form.salaryMin || !form.salaryMax) {
      setMessage("⚠️ Please provide salary min and max.");
      setSubmitting(false);
      return;
    }
    if (Number(form.description?.length || 0) < 50) {
      setMessage("⚠️ Description must be at least 50 characters.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...form,
        salary: {
          min: Number(form.salaryMin),
          max: Number(form.salaryMax),
        },
      };
      const res = await jobService.createJob(payload);

      if (res.success) {
        setMessage("✅ Job posted successfully!");
        setForm({
          title: "",
          location: "",
          type: "full-time",
          category: "engineering",
          experience: "entry",
          description: "",
          salaryMin: "",
          salaryMax: "",
        });
      } else {
        const apiMsg =
          res.errors?.map((e) => `${e.field}: ${e.message}`).join("\n") ||
          res.message;
        setMessage(apiMsg || "❌ Failed to post job");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to post job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Post a New Job
      </h1>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium shadow-sm ${
            message.startsWith("✅")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl shadow-sm p-8 space-y-6"
      >
        {/* Job Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Job Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* Location + Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>

        {/* Category + Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="operations">Operations</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Experience
            </label>
            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full mt-2 px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows="6"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 50 characters required.
          </p>
        </div>

        {/* Salary Min & Max */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Salary Min
            </label>
            <input
              name="salaryMin"
              value={form.salaryMin}
              onChange={handleChange}
              type="number"
              min="1"
              className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Salary Max
            </label>
            <input
              name="salaryMax"
              value={form.salaryMax}
              onChange={handleChange}
              type="number"
              min={form.salaryMin || 1}
              className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
