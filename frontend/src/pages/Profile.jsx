import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadService } from "../services/uploadService";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [tab, setTab] = useState("personal");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [js, setJs] = useState({
    location: "",
    skills: "",
    summary: "",
    education: "",
    links: { github: "", linkedin: "", portfolio: "" },
    preferredRoles: "",
    preferredCategories: "",
    expectedSalary: { min: "", max: "", currency: "USD", period: "yearly" },
    availability: "negotiable",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [employer, setEmployer] = useState({
    companyName: "",
    companyEmail: "",
    industry: "",
    website: "",
    description: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    contactPerson: { name: "", title: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
    });

    if (user.role === "jobseeker") {
      const jp = user.jobSeekerProfile || {};
      setJs({
        location: jp.location || "",
        skills: (jp.skills || []).join(", "),
        summary: jp.summary || "",
        education: (jp.education || [])
          .map((e) => [e.degree, e.school, e.field, e.to || e.from].filter(Boolean).join(" - "))
          .join("\n"),
        links: jp.links || { github: "", linkedin: "", portfolio: "" },
        preferredRoles: (jp.preferredRoles || []).join(", "),
        preferredCategories: (jp.preferredCategories || []).join(", "),
        expectedSalary: {
          min: jp.expectedSalary?.min ?? "",
          max: jp.expectedSalary?.max ?? "",
          currency: jp.expectedSalary?.currency || "USD",
          period: jp.expectedSalary?.period || "yearly",
        },
        availability: jp.availability || "negotiable",
      });
    }

    if (user.role === "employer") {
      const ep = user.employerProfile || {};
      setEmployer({
        companyName: ep.companyName || "",
        companyEmail: ep.companyEmail || "",
        industry: ep.industry || "",
        website: ep.website || "",
        description: ep.description || "",
        address: {
          ...(ep.address || {}),
          street: ep.address?.street || "",
          city: ep.address?.city || "",
          state: ep.address?.state || "",
          zipCode: ep.address?.zipCode || "",
          country: ep.address?.country || "",
        },
        contactPerson: {
          ...(ep.contactPerson || {}),
          name: ep.contactPerson?.name || "",
          title: ep.contactPerson?.title || "",
          email: ep.contactPerson?.email || "",
          phone: ep.contactPerson?.phone || "",
        },
      });
    }
  }, [user]);

  const save = async () => {
    setMessage("");
    try {
      const payload = { firstName: form.firstName, lastName: form.lastName, phone: form.phone };
      if (user.role === "jobseeker") {
        payload.jobSeekerProfile = {
          location: js.location,
          skills: js.skills.split(",").map((s) => s.trim()).filter(Boolean),
          summary: js.summary,
          links: js.links,
          preferredRoles: js.preferredRoles.split(",").map((s) => s.trim()).filter(Boolean),
          preferredCategories: js.preferredCategories.split(",").map((s) => s.trim()).filter(Boolean),
          expectedSalary: {
            min: js.expectedSalary.min ? Number(js.expectedSalary.min) : undefined,
            max: js.expectedSalary.max ? Number(js.expectedSalary.max) : undefined,
            currency: js.expectedSalary.currency,
            period: js.expectedSalary.period,
          },
          availability: js.availability,
        };
      } else if (user.role === "employer") {
        payload.employerProfile = employer;
      }
      const res = await updateProfile(payload);
      setMessage(res.success ? "Profile updated successfully!" : res.message || "Update failed");
    } catch (e) {
      setMessage(e.response?.data?.message || "Update failed");
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return;
    setMessage("");
    try {
      const res = await uploadService.uploadResume(resumeFile);
      setMessage(res.success ? "Resume uploaded successfully!" : res.message || "Upload failed");
    } catch (e) {
      setMessage("Upload failed");
    }
  };

  const onChangePersonal = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {user?.role === "employer" ? "Company Profile" : "My Profile"}
      </h1>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-sm">
          {message}
        </div>
      )}

      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="px-6 pt-4 border-b">
          <div className="flex gap-6 flex-wrap">
            <button
              className={`pb-2 border-b-2 font-medium transition ${
                tab === "personal" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setTab("personal")}
            >
              Personal
            </button>
            {user?.role === "jobseeker" && (
              <>
                <button
                  className={`pb-2 border-b-2 font-medium transition ${
                    tab === "seeker" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setTab("seeker")}
                >
                  Profile
                </button>
                <button
                  className={`pb-2 border-b-2 font-medium transition ${
                    tab === "resume" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setTab("resume")}
                >
                  Resume
                </button>
              </>
            )}
            {user?.role === "employer" && (
              <button
                className={`pb-2 border-b-2 font-medium transition ${
                  tab === "employer" ? "border-indigo-600 text-indigo-700" : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setTab("employer")}
              >
                Company
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Tab */}
          {tab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input name="firstName" value={form.firstName} onChange={onChangePersonal} className="input mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={onChangePersonal} className="input mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input name="phone" value={form.phone} onChange={onChangePersonal} className="input mt-1" />
              </div>
            </div>
          )}

          {/* Job Seeker Profile */}
          {user?.role === "jobseeker" && tab === "seeker" && (
            <div className="space-y-4">
              {/* Grid inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location / City</label>
                  <input
                    value={js.location}
                    onChange={(e) => setJs((p) => ({ ...p, location: e.target.value }))}
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Availability</label>
                  <select
                    value={js.availability}
                    onChange={(e) => setJs((p) => ({ ...p, availability: e.target.value }))}
                    className="input mt-1"
                  >
                    <option value="immediately">Immediately</option>
                    <option value="2-weeks">2 weeks</option>
                    <option value="1-month">1 month</option>
                    <option value="3-months">3 months</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                <input
                  value={js.skills}
                  onChange={(e) => setJs((p) => ({ ...p, skills: e.target.value }))}
                  placeholder="e.g., React, Node.js"
                  className="input mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Summary / About</label>
                <textarea
                  value={js.summary}
                  onChange={(e) => setJs((p) => ({ ...p, summary: e.target.value }))}
                  rows={4}
                  className="input mt-1"
                  placeholder="Briefly describe yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Links</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
                  <input
                    value={js.links.github}
                    onChange={(e) => setJs((p) => ({ ...p, links: { ...p.links, github: e.target.value } }))}
                    placeholder="GitHub URL"
                    className="input"
                  />
                  <input
                    value={js.links.linkedin}
                    onChange={(e) => setJs((p) => ({ ...p, links: { ...p.links, linkedin: e.target.value } }))}
                    placeholder="LinkedIn URL"
                    className="input"
                  />
                  <input
                    value={js.links.portfolio}
                    onChange={(e) => setJs((p) => ({ ...p, links: { ...p.links, portfolio: e.target.value } }))}
                    placeholder="Portfolio URL"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Roles</label>
                  <input
                    value={js.preferredRoles}
                    onChange={(e) => setJs((p) => ({ ...p, preferredRoles: e.target.value }))}
                    placeholder="Frontend Engineer, Backend Developer"
                    className="input mt-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Categories</label>
                  <input
                    value={js.preferredCategories}
                    onChange={(e) => setJs((p) => ({ ...p, preferredCategories: e.target.value }))}
                    placeholder="Engineering, Design"
                    className="input mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Expected Salary (optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-1">
                  <input
                    value={js.expectedSalary.min}
                    onChange={(e) => setJs((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, min: e.target.value } }))}
                    type="number"
                    placeholder="Min"
                    className="input"
                  />
                  <input
                    value={js.expectedSalary.max}
                    onChange={(e) => setJs((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, max: e.target.value } }))}
                    type="number"
                    placeholder="Max"
                    className="input"
                  />
                  <select
                    value={js.expectedSalary.currency}
                    onChange={(e) => setJs((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, currency: e.target.value } }))}
                    className="input"
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <select
                    value={js.expectedSalary.period}
                    onChange={(e) => setJs((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, period: e.target.value } }))}
                    className="input"
                  >
                    <option value="yearly">Yearly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Resume */}
          {user?.role === "jobseeker" && tab === "resume" && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Upload Resume (PDF/DOC/DOCX/TXT)</label>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="mt-1" />
              <button onClick={uploadResume} disabled={!resumeFile} className="btn-primary mt-2">
                Upload
              </button>
            </div>
          )}

          {/* Employer */}
          {user?.role === "employer" && tab === "employer" && (
            <div className="space-y-6">
              {/* Company info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input value={employer.companyName} onChange={(e) => setEmployer((p) => ({ ...p, companyName: e.target.value }))} className="input mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Email</label>
                  <input value={employer.companyEmail} onChange={(e) => setEmployer((p) => ({ ...p, companyEmail: e.target.value }))} type="email" className="input mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <input value={employer.industry} onChange={(e) => setEmployer((p) => ({ ...p, industry: e.target.value }))} className="input mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input value={employer.website} onChange={(e) => setEmployer((p) => ({ ...p, website: e.target.value }))} type="url" className="input mt-1" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company Description</label>
                <textarea value={employer.description} onChange={(e) => setEmployer((p) => ({ ...p, description: e.target.value }))} rows={4} className="input mt-1" />
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Street" value={employer.address.street} onChange={(e) => setEmployer((p) => ({ ...p, address: { ...p.address, street: e.target.value } }))} className="input" />
                  <input placeholder="City" value={employer.address.city} onChange={(e) => setEmployer((p) => ({ ...p, address: { ...p.address, city: e.target.value } }))} className="input" />
                  <input placeholder="State" value={employer.address.state} onChange={(e) => setEmployer((p) => ({ ...p, address: { ...p.address, state: e.target.value } }))} className="input" />
                  <input placeholder="Zip Code" value={employer.address.zipCode} onChange={(e) => setEmployer((p) => ({ ...p, address: { ...p.address, zipCode: e.target.value } }))} className="input" />
                  <input placeholder="Country" value={employer.address.country} onChange={(e) => setEmployer((p) => ({ ...p, address: { ...p.address, country: e.target.value } }))} className="input" />
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Contact Person</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Name" value={employer.contactPerson.name} onChange={(e) => setEmployer((p) => ({ ...p, contactPerson: { ...p.contactPerson, name: e.target.value } }))} className="input" />
                  <input placeholder="Title" value={employer.contactPerson.title} onChange={(e) => setEmployer((p) => ({ ...p, contactPerson: { ...p.contactPerson, title: e.target.value } }))} className="input" />
                  <input placeholder="Email" type="email" value={employer.contactPerson.email} onChange={(e) => setEmployer((p) => ({ ...p, contactPerson: { ...p.contactPerson, email: e.target.value } }))} className="input" />
                  <input placeholder="Phone" value={employer.contactPerson.phone} onChange={(e) => setEmployer((p) => ({ ...p, contactPerson: { ...p.contactPerson, phone: e.target.value } }))} className="input" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button onClick={save} className="btn-primary w-full md:w-auto px-6 py-2 rounded-lg shadow hover:shadow-lg transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
