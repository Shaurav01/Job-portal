const express = require('express');
const router = express.Router();
const { protect, authorize, checkApplicationExists } = require('../middleware/auth');
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  getApplicationStats
} = require('../controllers/applicationController');

// Job seeker routes
router.post('/:jobId', [
  protect,
  authorize('jobseeker'),
  checkApplicationExists
], applyToJob);

router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);
router.delete('/:id', protect, authorize('jobseeker'), withdrawApplication);

// Employer routes
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);

// Common routes
router.get('/stats', protect, getApplicationStats);

module.exports = router;
