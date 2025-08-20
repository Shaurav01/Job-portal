const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// @desc    Upload resume
// @route   POST /api/uploads/resume
// @access  Private (Job seekers only)
const uploadResume = async (req, res, next) => {
try {
if (!req.file) {
return res.status(400).json({
success: false,
message: 'Please upload a file'
});
}

// Check if user is a job seeker
if (req.user.role !== 'jobseeker') {
return res.status(403).json({
success: false,
message: 'Only job seekers can upload resumes'
});
}

// Delete old resume if exists
const user = await User.findById(req.user._id).select('jobSeekerProfile.resume');
if (user?.jobSeekerProfile?.resume) {
const oldResumePath = path.join(__dirname, '..', user.jobSeekerProfile.resume);
if (fs.existsSync(oldResumePath)) {
fs.unlinkSync(oldResumePath);
}
}

// Update user's resume path without triggering unrelated validations
const resumePath = `/uploads/${req.file.filename}`;
await User.findByIdAndUpdate(
  req.user._id,
      { $set: { 'jobSeekerProfile.resume': resumePath } },
  { new: true, runValidators: false }
);

res.json({
success: true,
message: 'Resume uploaded successfully',
data: {
resume: resumePath,
  filename: req.file.filename,
    size: req.file.size,
      mimetype: req.file.mimetype
  }
  });
  } catch (error) {
      next(error);
    }
  };

// @desc    Upload avatar
// @route   POST /api/uploads/avatar
// @access  Private
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Check file type for avatar
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      
      return res.status(400).json({
        success: false,
        message: 'Only JPEG, JPG, PNG, and GIF images are allowed for avatars'
      });
    }

    // Delete old avatar if exists
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update user's avatar path
    const avatarPath = `/uploads/${req.file.filename}`;
    user.avatar = avatarPath;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: avatarPath,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete uploaded file
// @route   DELETE /api/uploads/:filename
// @access  Private
const deleteFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if user owns the file (basic check)
    const user = await User.findById(req.user._id);
    const isOwner = user.jobSeekerProfile.resume === `/uploads/${filename}` || 
                   user.avatar === `/uploads/${filename}`;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    // Update user document
    if (user.jobSeekerProfile.resume === `/uploads/${filename}`) {
      user.jobSeekerProfile.resume = '';
    } else if (user.avatar === `/uploads/${filename}`) {
      user.avatar = '';
    }

    await user.save();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get file info
// @route   GET /api/uploads/:filename
// @access  Private
const getFileInfo = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const stats = fs.statSync(filePath);
    const fileInfo = {
      filename,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      path: `/uploads/${filename}`
    };

    res.json({
      success: true,
      data: fileInfo
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResume,
  uploadAvatar,
  deleteFile,
  getFileInfo
};
