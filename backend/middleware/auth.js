const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user owns the resource
const checkOwnership = (model, paramName = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramName];
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
      }

      // Check if user owns the resource or is admin
      if (resource.user && resource.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this resource'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Check if user has already applied to a job
const checkApplicationExists = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const existingApplication = await require('../models/Application').findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  authorize,
  checkOwnership,
  checkApplicationExists
};
