const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply to a job
// @route   POST /api/applications/:jobId
// @access  Private (Job seekers only)
const applyToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications'
      });
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    // Get user's resume
    const user = await User.findById(req.user._id);
    if (!user.jobSeekerProfile.resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume before applying to jobs'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      employer: job.company,
      coverLetter,
      resume: user.jobSeekerProfile.resume
    });

    // Add to job's applications array
    job.applications.push({
      applicant: req.user._id,
      appliedAt: new Date(),
      status: 'pending',
      coverLetter,
      resume: user.jobSeekerProfile.resume
    });

    job.applicationsCount = job.applications.length;
    await job.save();

    // Add to user's applied jobs
    user.appliedJobs.push(jobId);
    await user.save();

    // Populate application data
    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title companyName location type')
      .populate('applicant', 'firstName lastName email jobSeekerProfile.headline')
      .populate('employer', 'firstName lastName employerProfile.companyName');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: populatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Job seekers only)
const getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { applicant: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate('job', 'title companyName location type status')
      .populate('employer', 'employerProfile.companyName')
      .sort('-appliedAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a specific job (employer view)
// @route   GET /api/applications/job/:jobId
// @access  Private (Job owner only)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Check if job exists and user owns it
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    const filter = { job: jobId };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await Application.find(filter)
      .populate('applicant', 'firstName lastName email jobSeekerProfile.headline jobSeekerProfile.skills')
      .populate('job', 'title companyName')
      .sort('-appliedAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, interview } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the job
    const job = await Job.findById(application.job);
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application
    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user._id;
    
    if (notes) {
      application.notes = { ...application.notes, employer: notes };
    }

    if (interview) {
      application.interview = { ...application.interview, ...interview };
    }

    await application.save();

    // Update job application status
    const jobApplication = job.applications.find(
      app => app.applicant.toString() === application.applicant.toString()
    );
    
    if (jobApplication) {
      jobApplication.status = status;
      await job.save();
    }

    const updatedApplication = await Application.findById(id)
      .populate('applicant', 'firstName lastName email')
      .populate('job', 'title companyName');

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Applicant only)
const withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Update status to withdrawn
    application.status = 'withdrawn';
    await application.save();

    // Remove from user's applied jobs
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { appliedJobs: application.job }
    });

    // Update job application status
    await Job.findByIdAndUpdate(application.job, {
      $pull: { applications: { applicant: req.user._id } }
    });

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private
const getApplicationStats = async (req, res, next) => {
  try {
    let stats;

    if (req.user.role === 'jobseeker') {
      // Job seeker stats
      const totalApplications = await Application.countDocuments({ applicant: req.user._id });
      const statusStats = await Application.aggregate([
        { $match: { applicant: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      stats = {
        total: totalApplications,
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      };
    } else {
      // Employer stats
      const totalApplications = await Application.countDocuments({ employer: req.user._id });
      const statusStats = await Application.aggregate([
        { $match: { employer: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      stats = {
        total: totalApplications,
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats
};
