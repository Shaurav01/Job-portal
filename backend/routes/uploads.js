const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { resumeUpload, avatarUpload } = require('../middleware/upload');
const {
  uploadResume,
  uploadAvatar,
  deleteFile,
  getFileInfo
} = require('../controllers/uploadController');

// File upload routes
router.post('/resume', protect, resumeUpload, uploadResume);
router.post('/avatar', protect, avatarUpload, uploadAvatar);

// File management routes
router.get('/:filename', protect, getFileInfo);
router.delete('/:filename', protect, deleteFile);

module.exports = router;
