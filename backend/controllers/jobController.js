const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employers only)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      location,
      type,
      category,
      experience,
      salary,
      description,
      requirements,
      responsibilities,
      benefits,
      skills,
      education,
      remote,
      visaSponsorship,
      relocation,
      deadline,
      tags
    } = req.body;

    // Create job
    const job = await Job.create({
      title,
      company: req.user._id,
      companyName: req.user.employerProfile.companyName || req.user.firstName + ' ' + req.user.lastName,
      location,
      type,
      category,
      experience,
      salary,
      description,
      requirements,
      responsibilities,
      benefits,
      skills,
      education,
      remote,
      visaSponsorship,
      relocation,
      deadline,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      type,
      category,
      experience,
      remote,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    if (search) {
      filter.$text = { $search: search };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (experience) {
      filter.experience = experience;
    }

    if (remote) {
      filter.remote = remote;
    }

    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = parseInt(minSalary);
      if (maxSalary) filter.salary.$lte = parseInt(maxSalary);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const jobs = await Job.find(filter)
      .populate('company', 'firstName lastName employerProfile.companyName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
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

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'firstName lastName employerProfile.companyName employerProfile.industry employerProfile.website')
      .populate('applications.applicant', 'firstName lastName email jobSeekerProfile.headline');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count
    job.views += 1;
    await job.save();

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Job owner only)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Job owner only)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    // Delete related applications
    await Application.deleteMany({ job: req.params.id });

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs by employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employers only)
const getEmployerJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { company: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(filter)
      .populate('applications.applicant', 'firstName lastName email jobSeekerProfile.headline')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(filter);

    res.json({
      success: true,
      data: jobs,
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

// @desc    Get featured jobs (most viewed/recent)
// @route   GET /api/jobs/featured
// @access  Public
const getFeaturedJobs = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const jobs = await Job.find({ status: 'active' })
      .populate('company', 'employerProfile.companyName')
      .sort('-views -createdAt')
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job categories
// @route   GET /api/jobs/categories
// @access  Public
const getJobCategories = async (req, res, next) => {
  try {
    const categories = await Job.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getFeaturedJobs,
  getJobCategories
};
