const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Job is required']
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant is required']
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employer is required']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
    default: 'pending'
  },
  coverLetter: {
    type: String,
    trim: true,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    employer: String,
    applicant: String
  },
  interview: {
    scheduled: {
      type: Boolean,
      default: false
    },
    date: Date,
    time: String,
    location: String,
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person'],
      default: 'video'
    },
    notes: String
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ employer: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Virtual for application duration
applicationSchema.virtual('duration').get(function() {
  const now = new Date();
  const applied = this.appliedAt;
  const diffTime = Math.abs(now - applied);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtual fields are serialized
applicationSchema.set('toJSON', { virtuals: true });
applicationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Application', applicationSchema);
