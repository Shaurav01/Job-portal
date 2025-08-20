const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { jobValidations, checkValidationResult } = require('../utils/validation');
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
  getFeaturedJobs,
  getJobCategories
} = require('../controllers/jobController');

// Public routes
router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/categories', getJobCategories);
router.get('/:id', getJob);

// Protected routes (Employers only)
router.post('/', [
  protect,
  authorize('employer'),
  jobValidations.title,
  jobValidations.location,
  jobValidations.type,
  jobValidations.category,
  jobValidations.experience,
  jobValidations.salaryMin,
  jobValidations.salaryMax,
  jobValidations.description,
  checkValidationResult
], createJob);

router.put('/:id', [
  protect,
  authorize('employer'),
  // allow partial updates
  require('../utils/validation').jobUpdateValidations.title,
  require('../utils/validation').jobUpdateValidations.location,
  require('../utils/validation').jobUpdateValidations.type,
  require('../utils/validation').jobUpdateValidations.category,
  require('../utils/validation').jobUpdateValidations.experience,
  require('../utils/validation').jobUpdateValidations.salaryMin,
  require('../utils/validation').jobUpdateValidations.salaryMax,
  require('../utils/validation').jobUpdateValidations.description,
  require('../utils/validation').jobUpdateValidations.requirements,
  require('../utils/validation').jobUpdateValidations.requirementsEach,
  checkValidationResult
], updateJob);

router.delete('/:id', protect, authorize('employer'), deleteJob);

// Employer specific routes
router.get('/employer/my-jobs', protect, authorize('employer'), getEmployerJobs);

module.exports = router;
