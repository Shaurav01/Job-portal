const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: [true, 'Role is required']
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  // Job Seeker Specific Fields
  jobSeekerProfile: {
    headline: {
      type: String,
      trim: true,
      maxlength: [100, 'Headline cannot exceed 100 characters']
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [500, 'Summary cannot exceed 500 characters']
    },
    skills: [{
      type: String,
      trim: true
    }],
    experience: [{
      title: String,
      company: String,
      location: String,
      from: Date,
      to: Date,
      current: {
        type: Boolean,
        default: false
      },
      description: String
    }],
    education: [{
      degree: String,
      field: String,
      school: String,
      from: Date,
      to: Date,
      current: {
        type: Boolean,
        default: false
      },
      description: String
    }],
    resume: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      trim: true
    },
    salary: {
      type: Number
    },
    availability: {
      type: String,
      enum: ['immediately', '2-weeks', '1-month', '3-months', 'negotiable'],
      default: 'negotiable'
    },
    links: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      portfolio: { type: String, trim: true }
    },
    preferredRoles: [{ type: String, trim: true }],
    preferredCategories: [{ type: String, trim: true }],
    expectedSalary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
      period: { type: String, enum: ['hourly','daily','weekly','monthly','yearly'], default: 'yearly' }
    }
  },

  // Employer Specific Fields
  employerProfile: {
  companyName: {
  type: String,
  trim: true,
  maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  companyEmail: {
  type: String,
  trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid company email']
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  industry: {
    type: String,
    trim: true
  },
  website: {
  type: String,
    trim: true
  },
  description: {
  type: String,
  trim: true,
  maxlength: [500, 'Company description cannot exceed 500 characters']
  },
  address: {
    street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
  },
    contactPerson: {
      name: String,
      title: String,
      email: String,
    phone: String
  }
  },

  // Common Fields
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  appliedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
}, {
  timestamps: true
});

// Index for search functionality
userSchema.index({ 
  'firstName': 'text', 
  'lastName': 'text', 
  'email': 'text',
  'jobSeekerProfile.headline': 'text',
  'jobSeekerProfile.skills': 'text',
  'employerProfile.companyName': 'text',
  'employerProfile.industry': 'text'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
