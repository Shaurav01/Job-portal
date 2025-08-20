// Format salary range
export const formatSalary = (salary) => {
  if (!salary) return 'Not specified';
  
  if (typeof salary === 'object') {
    const { min, max, currency = 'USD', period = 'yearly' } = salary;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()} / ${period}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()} / ${period}`;
    }
  }
  
  if (typeof salary === 'number') {
    return `$${salary.toLocaleString()} / year`;
  }
  
  return 'Not specified';
};

// Format date
export const formatDate = (date) => {
  if (!date) return 'Not specified';
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return 'Not specified';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format experience level
export const formatExperience = (level) => {
  const levels = {
    'entry': 'Entry Level',
    'junior': 'Junior',
    'mid': 'Mid Level',
    'senior': 'Senior',
    'lead': 'Lead',
    'principal': 'Principal',
    'executive': 'Executive'
  };
  
  return levels[level] || capitalize(level);
};

// Format job type
export const formatJobType = (type) => {
  const types = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship',
    'freelance': 'Freelance'
  };
  
  return types[type] || capitalize(type);
};

// Format remote work
export const formatRemote = (remote) => {
  const remoteTypes = {
    'on-site': 'On Site',
    'remote': 'Remote',
    'hybrid': 'Hybrid'
  };
  
  return remoteTypes[remote] || capitalize(remote);
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    'active': 'success',
    'pending': 'warning',
    'reviewed': 'primary',
    'shortlisted': 'success',
    'rejected': 'error',
    'hired': 'success',
    'withdrawn': 'secondary'
  };
  
  return colors[status] || 'secondary';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'None' };
  
  let score = 0;
  let feedback = [];
  
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
  if (score < 2) {
    feedback.push('Too weak');
  } else if (score < 4) {
    feedback.push('Could be stronger');
  } else {
    feedback.push('Strong password');
  }
  
  return {
    score,
    label: feedback[0],
    color: score < 2 ? 'error' : score < 4 ? 'warning' : 'success'
  };
};
