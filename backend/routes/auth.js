const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { commonValidations, profileValidations, checkValidationResult } = require('../utils/validation');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword
} = require('../controllers/authController');

// Public routes
router.post('/register', [
  commonValidations.firstName,
  commonValidations.lastName,
  commonValidations.email,
  commonValidations.password,
  commonValidations.role,
  commonValidations.phone,
  checkValidationResult
], register);

router.post('/login', [
  commonValidations.email,
  commonValidations.password,
  checkValidationResult
], login);

router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', [
  protect,
  // optional profile validations
  profileValidations.companyEmail,
  profileValidations.industry,
  profileValidations.addressCity,
  profileValidations.github,
  profileValidations.linkedin,
  profileValidations.portfolio,
  profileValidations.preferredRoles,
  profileValidations.preferredCategories,
  profileValidations.expectedSalaryMin,
  profileValidations.expectedSalaryMax,
  checkValidationResult
], updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
