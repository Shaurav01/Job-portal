const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  saveJob,
  getSavedJobs,
  getUserStats,
  searchUsers
} = require('../controllers/userController');

// User management routes
router.get('/stats', protect, getUserStats);
router.get('/saved-jobs', protect, getSavedJobs);
router.post('/save-job/:jobId', protect, saveJob);
router.get('/search', protect, authorize('employer'), searchUsers);

// @desc    Get user profile by ID (public info only)
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.id)
      .select('firstName lastName role jobSeekerProfile.headline jobSeekerProfile.skills employerProfile.companyName employerProfile.industry')
      .populate('savedJobs', 'title companyName location type')
      .populate('appliedJobs', 'title companyName location type');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password');

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user status (admin only)
// @route   PUT /api/users/:id/status
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const User = require('../models/User');
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
