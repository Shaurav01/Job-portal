const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Company is required']
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: [true, 'Job type is required']
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    trim: true
  },
  experience: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    required: [true, 'Experience level is required']
  },
  salary: {
    min: {
      type: Number,
      required: [true, 'Minimum salary is required']
    },
    max: {
      type: Number,
      required: [true, 'Maximum salary is required']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
      default: 'yearly'
    }
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [50, 'Job description must be at least 50 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true
  }],
  education: {
    type: String,
    enum: ['high-school', 'associate', 'bachelor', 'master', 'phd', 'any'],
    default: 'any'
  },
  remote: {
    type: String,
    enum: ['on-site', 'remote', 'hybrid'],
    default: 'on-site'
  },
  visaSponsorship: {
    type: Boolean,
    default: false
  },
  relocation: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  applications: {
    type: [{
      applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      appliedAt: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
        default: 'pending'
      },
      coverLetter: String,
      resume: String
    }],
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  deadline: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search functionality
jobSchema.index({
  title: 'text',
  description: 'text',
  requirements: 'text',
  skills: 'text',
  companyName: 'text',
  location: 'text',
  category: 'text'
});

// Virtual for formatted salary range
jobSchema.virtual('salaryRange').get(function() {
  if (this.salary.min && this.salary.max) {
    return `${this.salary.currency} ${this.salary.min.toLocaleString()} - ${this.salary.max.toLocaleString()} ${this.salary.period}`;
  }
  return 'Salary not specified';
});

// Virtual for application status count
jobSchema.virtual('applicationStats').get(function() {
  const apps = Array.isArray(this.applications) ? this.applications : [];
  const stats = {
    total: apps.length,
    pending: 0,
    reviewed: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  };
  
  apps.forEach(app => {
    if (app && app.status && stats.hasOwnProperty(app.status)) {
      stats[app.status]++;
    }
  });
  
  return stats;
});

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
