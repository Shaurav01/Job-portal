import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { uploadService } from '../services/uploadService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { formatSalary } from '../utils/helpers';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated, isJobSeeker, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await jobService.getJob(id);
        if (res.success) setJob(res.data);
        else setError(res.message || 'Failed to load job');
      } catch (err) {
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const alreadyApplied = useMemo(() => {
    if (!job || !user) return false;
    return (job.applications || []).some(app => {
      const applicant = app.applicant;
      const applicantId = typeof applicant === 'string' ? applicant : applicant?._id;
      return applicantId && user?._id && String(applicantId) === String(user._id);
    });
  }, [job, user]);

  const openApply = () => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (!isJobSeeker) {
      toast.push({ type: 'error', title: 'Not allowed', message: 'Only job seekers can apply to jobs.' });
      return;
    }
    if (job?.status && job.status !== 'active') {
      toast.push({ type: 'warning', title: 'Applications closed', message: 'This job is not accepting applications.' });
      return;
    }
    if (alreadyApplied) {
      toast.push({ type: 'info', title: 'Already applied', message: 'You have already applied to this job.' });
      return;
    }
    setIsApplyOpen(true);
  };

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      toast.push({ type: 'warning', title: 'Cover letter required', message: 'Please write a brief cover letter.' });
      return;
    }

    setIsApplying(true);
    try {
      let resumeFilename;
      if (resumeFile) {
        const up = await uploadService.uploadResume(resumeFile);
        if (up.success) {
          resumeFilename = up.data?.filename || up.filename;
        } else {
          toast.push({ type: 'error', title: 'Upload failed', message: up.message || 'Could not upload resume.' });
          setIsApplying(false);
          return;
        }
      }

      const payload = { coverLetter };
      if (resumeFilename) payload.resume = resumeFilename;

      const res = await applicationService.applyToJob(id, payload);
      if (res.success) {
        toast.push({ type: 'success', title: 'Application submitted' });
        setIsApplyOpen(false);
        setCoverLetter('');
        setResumeFile(null);
        const j = await jobService.getJob(id);
        if (j.success) setJob(j.data);
      } else {
        toast.push({ type: 'error', title: 'Failed to apply', message: res.message });
      }
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to apply';
      toast.push({ type: 'error', title: 'Failed to apply', message: msg });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-16" />;
  if (error) return <div className="max-w-3xl mx-auto p-6 text-red-600">{error}</div>;
  if (!job) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 transition-all hover:shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 text-lg">{job.companyName || job.company?.name || 'Company'}</p>
          </div>
          <div className="text-xl font-semibold text-indigo-600">{formatSalary(job.salary)}</div>
        </div>

        {/* Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <span className="block text-gray-500">📍 Location</span>
            <p className="font-medium text-gray-800">{job.location}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <span className="block text-gray-500">💼 Type</span>
            <p className="font-medium text-gray-800">{job.type}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <span className="block text-gray-500">📂 Category</span>
            <p className="font-medium text-gray-800">{job.category}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Job Description</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3">Requirements</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/jobs"
            className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            ← Back to Jobs
          </Link>
          <button
            className={`px-6 py-2 rounded-xl font-medium text-white transition ${
              alreadyApplied
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
            disabled={alreadyApplied}
            onClick={openApply}
          >
            {alreadyApplied ? 'Already Applied' : 'Apply Now'}
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title="Apply to this Job"
        actions={
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isApplying ? 'Applying...' : 'Submit Application'}
          </button>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea
              rows={6}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a short cover letter..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach Resume (optional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="w-full text-sm text-gray-600"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetails;
