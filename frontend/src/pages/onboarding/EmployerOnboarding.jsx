import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const EmployerOnboarding = () => {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    industry: "",
    website: "",
    description: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    contactPerson: { name: "", title: "", email: "", phone: "" },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((p) => ({ ...p, address: { ...p.address, [key]: value } }));
    } else if (name.startsWith("contactPerson.")) {
      const key = name.split(".")[1];
      setForm((p) => ({
        ...p,
        contactPerson: { ...p.contactPerson, [key]: value },
      }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await updateProfile({ employerProfile: form });
      if (res.success) {
        setMessage("✅ Employer profile saved. You can now post jobs.");
      } else {
        setMessage(res.message || "❌ Failed to save profile");
      }
    } catch (e2) {
      setMessage(e2.response?.data?.message || "❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Employer Onboarding
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
        className="bg-white border rounded-2xl shadow-sm p-8 space-y-8"
      >
        {/* Company Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Company Information
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Email
                </label>
                <input
                  name="companyEmail"
                  type="email"
                  value={form.companyEmail}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Industry
                </label>
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  name="contactPerson.phone"
                  value={form.contactPerson.phone}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Description
              </label>
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Street"
              name="address.street"
              value={form.address.street}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              placeholder="City"
              name="address.city"
              value={form.address.city}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              placeholder="State"
              name="address.state"
              value={form.address.state}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              placeholder="Zip Code"
              name="address.zipCode"
              value={form.address.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              placeholder="Country"
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Contact Person
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              placeholder="Name"
              name="contactPerson.name"
              value={form.contactPerson.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              placeholder="Title"
              name="contactPerson.title"
              value={form.contactPerson.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              placeholder="Email"
              type="email"
              name="contactPerson.email"
              value={form.contactPerson.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <input
              placeholder="Phone"
              name="contactPerson.phone"
              value={form.contactPerson.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployerOnboarding;
