const { body, validationResult } = require('express-validator');

// Common validation rules
const commonValidations = {
  firstName: body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),

  lastName: body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),

  email: body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  password: body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

  phone: body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid phone number'),

  role: body('role')
    .isIn(['jobseeker', 'employer'])
    .withMessage('Role must be either jobseeker or employer')
};

// Job validation rules
const jobValidations = {
  title: body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),

  location: body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),

  type: body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),

  category: body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),

  experience: body('experience')
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),

  salaryMin: body('salary.min')
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => value > 0)
    .withMessage('Minimum salary must be greater than 0'),

  salaryMax: body('salary.max')
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      if (req.body.salary && req.body.salary.min) {
        return value >= req.body.salary.min;
      }
      return true;
    })
    .withMessage('Maximum salary must be greater than or equal to minimum salary'),

  description: body('description')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Job description must be between 50 and 5000 characters')
};

// Job update validation rules (all optional)
const jobUpdateValidations = {
  title: body('title')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),

  location: body('location')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),

  type: body('type')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),

  category: body('category')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),

  experience: body('experience')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['entry', 'junior', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),

  salaryMin: body('salary.min')
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => Number(value) > 0)
    .withMessage('Minimum salary must be greater than 0'),

  salaryMax: body('salary.max')
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      const min = req.body?.salary?.min;
      return !min || Number(value) >= Number(min);
    })
    .withMessage('Maximum salary must be greater than or equal to minimum salary'),

  description: body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Job description must be between 50 and 5000 characters'),

  requirements: body('requirements')
    .optional({ nullable: true })
    .isArray()
    .withMessage('Requirements must be an array of strings'),
  requirementsEach: body('requirements.*')
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage('Each requirement must be a string')
};

// Profile validation rules
const profileValidations = {
  headline: body('headline')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Headline cannot exceed 100 characters'),

  summary: body('summary')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Summary cannot exceed 500 characters'),

  companyName: body('companyName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),

  website: body('website')
    .optional()
    .isURL()
    .withMessage('Please enter a valid website URL'),

  companyEmail: body('employerProfile.companyEmail')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage('Enter a valid company email'),
  industry: body('employerProfile.industry')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  addressCity: body('employerProfile.address.city')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage('City cannot exceed 100 characters'),

  github: body('jobSeekerProfile.links.github').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Enter a valid GitHub URL'),
  linkedin: body('jobSeekerProfile.links.linkedin').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Enter a valid LinkedIn URL'),
  portfolio: body('jobSeekerProfile.links.portfolio').optional({ nullable: true, checkFalsy: true }).isURL().withMessage('Enter a valid portfolio URL'),
  preferredRoles: body('jobSeekerProfile.preferredRoles').optional({ nullable: true, checkFalsy: true }).isArray().withMessage('Preferred roles must be an array'),
  preferredCategories: body('jobSeekerProfile.preferredCategories').optional({ nullable: true, checkFalsy: true }).isArray().withMessage('Preferred categories must be an array'),
  expectedSalaryMin: body('jobSeekerProfile.expectedSalary.min').optional({ nullable: true, checkFalsy: true }).isNumeric().withMessage('Expected min salary must be a number'),
  expectedSalaryMax: body('jobSeekerProfile.expectedSalary.max')
    .optional({ nullable: true, checkFalsy: true })
    .isNumeric()
    .withMessage('Expected max salary must be a number')
    .custom((value, { req }) => {
      const min = req.body?.jobSeekerProfile?.expectedSalary?.min;
      return !min || Number(value) >= Number(min);
    })
    .withMessage('Max salary must be >= min salary'),
};

// Check for validation errors
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  commonValidations,
  jobValidations,
  jobUpdateValidations,
  profileValidations,
  checkValidationResult
};
