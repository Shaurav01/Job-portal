const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Save/unsave a job
// @route   POST /api/users/save-job/:jobId
// @access  Private
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const user = await User.findById(userId);
    const isJobSaved = user.savedJobs.includes(jobId);

    if (isJobSaved) {
      // Remove from saved jobs
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();

      res.json({
        success: true,
        message: 'Job removed from saved jobs',
        data: { saved: false }
      });
    } else {
      // Add to saved jobs
      user.savedJobs.push(jobId);
      await user.save();

      res.json({
        success: true,
        message: 'Job saved successfully',
        data: { saved: true }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private
const getSavedJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const user = await User.findById(userId)
      .populate({
        path: 'savedJobs',
        select: 'title companyName location type salary status createdAt',
        options: {
          skip,
          limit: parseInt(limit),
          sort: '-createdAt'
        }
      });

    const total = user.savedJobs.length;

    res.json({
      success: true,
      data: user.savedJobs,
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

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Base stats available for both roles
    let stats = {
      totalSavedJobs: user.savedJobs.length,
      totalAppliedJobs: user.appliedJobs.length,
    };

    if (user.role === 'jobseeker') {
      // Applications counts and breakdown
      const totalApplications = await Application.countDocuments({ applicant: userId });
      const byStatusAgg = await Application.aggregate([
        { $match: { applicant: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      const byStatus = {
        pending: 0,
        reviewed: 0,
        shortlisted: 0,
        rejected: 0,
        hired: 0,
        withdrawn: 0,
      };
      byStatusAgg.forEach(s => { byStatus[s._id] = s.count; });

      // Simple profile completion heuristic
      const jp = user.jobSeekerProfile || {};
      let completed = 0;
      const checks = [
        !!jp.resume,
        Array.isArray(jp.skills) && jp.skills.length > 0,
        !!jp.summary || !!jp.headline,
        !!jp.location,
      ];
      checks.forEach(ok => { if (ok) completed += 1; });
      const profileCompletion = Math.round((completed / checks.length) * 100);

      stats = {
        ...stats,
        totalApplications,
        savedJobs: user.savedJobs.length,
        applicationsByStatus: byStatus,
        profileCompletion,
      };
    } else if (user.role === 'employer') {
      const totalJobs = await Job.countDocuments({ company: userId });
      const activeJobs = await Job.countDocuments({ company: userId, status: 'active' });
      const totalApplicationsAgg = await Job.aggregate([
        { $match: { company: userId } },
        { $group: { _id: null, total: { $sum: '$applicationsCount' } } }
      ]);

      stats = {
        ...stats,
        totalJobs,
        activeJobs,
        totalApplications: totalApplicationsAgg[0]?.total || 0,
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

// @desc    Search users (for employers to find candidates)
// @route   GET /api/users/search
// @access  Private (Employers only)
const searchUsers = async (req, res, next) => {
  try {
    const { search, skills, location, page = 1, limit = 10 } = req.query;

    // Only employers can search for users
    if (req.user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can search for users'
      });
    }

    const filter = { role: 'jobseeker', isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (skills) {
      filter['jobSeekerProfile.skills'] = { $in: skills.split(',') };
    }

    if (location) {
      filter['jobSeekerProfile.location'] = { $regex: location, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(filter)
      .select('firstName lastName jobSeekerProfile.headline jobSeekerProfile.skills jobSeekerProfile.location jobSeekerProfile.experience')
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
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

module.exports = {
  saveJob,
  getSavedJobs,
  getUserStats,
  searchUsers
};
