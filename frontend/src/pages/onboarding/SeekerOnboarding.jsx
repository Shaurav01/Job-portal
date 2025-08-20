import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { uploadService } from '../../services/uploadService';
import { motion } from 'framer-motion';
import { Loader2, Upload, Save } from 'lucide-react';

const SeekerOnboarding = () => {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState({
    location: '',
    skills: '',
    links: { github: '', linkedin: '', portfolio: '' },
    preferredRoles: '',
    preferredCategories: '',
    expectedSalary: { min: '', max: '', currency: 'USD', period: 'yearly' },
    availability: 'negotiable',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('links.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, links: { ...p.links, [key]: value } }));
    } else if (name.startsWith('expectedSalary.')) {
      const key = name.split('.')[1];
      setForm((p) => ({ ...p, expectedSalary: { ...p.expectedSalary, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      let resumePath;
      if (resumeFile) {
        const up = await uploadService.uploadResume(resumeFile);
        if (up.success) {
          resumePath = up.data?.resume || `/uploads/${up.data?.filename || up.filename}`;
        } else {
          setMessage(up.message || 'Resume upload failed');
          setSaving(false);
          return;
        }
      }
      const payload = {
        jobSeekerProfile: {
          location: form.location,
          resume: resumePath,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
          links: form.links,
          preferredRoles: form.preferredRoles.split(',').map(s => s.trim()).filter(Boolean),
          preferredCategories: form.preferredCategories.split(',').map(s => s.trim()).filter(Boolean),
          expectedSalary: {
            min: form.expectedSalary.min ? Number(form.expectedSalary.min) : undefined,
            max: form.expectedSalary.max ? Number(form.expectedSalary.max) : undefined,
            currency: form.expectedSalary.currency,
            period: form.expectedSalary.period,
          },
          availability: form.availability,
        }
      };
      const res = await updateProfile(payload);
      setMessage(res.success ? '✅ Profile saved. You can now apply to jobs.' : (res.message || '❌ Failed to save profile'));
    } catch (e2) {
      setMessage(e2.response?.data?.message || '❌ Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎯 Job Seeker Onboarding</h1>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg text-sm font-medium ${
              message.startsWith('✅')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">📍 Location / City</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Kolkata, India"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="block text-sm font-medium text-gray-700">📄 Resume / CV</label>
            <div className="flex items-center gap-3 mt-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
              />
              {resumeFile && <span className="text-xs text-gray-500">{resumeFile.name}</span>}
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700">💡 Skills</label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="React, Node.js, SQL"
            />
          </div>

          {/* Roles & Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">👨‍💻 Preferred Roles</label>
              <input
                name="preferredRoles"
                value={form.preferredRoles}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Frontend Developer, Backend Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">📂 Preferred Categories</label>
              <input
                name="preferredCategories"
                value={form.preferredCategories}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="IT, Finance, Marketing"
              />
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700">🔗 Links</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <input name="links.github" value={form.links.github} onChange={handleChange} placeholder="GitHub" className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500" />
              <input name="links.linkedin" value={form.links.linkedin} onChange={handleChange} placeholder="LinkedIn" className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500" />
              <input name="links.portfolio" value={form.links.portfolio} onChange={handleChange} placeholder="Portfolio" className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700">💰 Expected Salary (optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              <input type="number" name="expectedSalary.min" value={form.expectedSalary.min} onChange={handleChange} placeholder="Min" className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500" />
              <input type="number" name="expectedSalary.max" value={form.expectedSalary.max} onChange={handleChange} placeholder="Max" className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500" />
              <select name="expectedSalary.currency" value={form.expectedSalary.currency} onChange={handleChange} className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500">
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
              </select>
              <select name="expectedSalary.period" value={form.expectedSalary.period} onChange={handleChange} className="rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500">
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700">📅 Availability</label>
            <select name="availability" value={form.availability} onChange={handleChange} className="mt-2 w-full rounded-xl border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500">
              <option value="immediately">Immediately</option>
              <option value="2-weeks">2 weeks</option>
              <option value="1-month">1 month</option>
              <option value="3-months">3 months</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SeekerOnboarding;
