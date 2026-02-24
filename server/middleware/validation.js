// server/middleware/validation.js
import { body, validationResult } from 'express-validator';

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateUser = [
  body('firstName').notEmpty().withMessage('First name is required')
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').notEmpty().withMessage('Last name is required')
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'employee', 'client']).withMessage('Invalid role'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateProject = [
  body('name').notEmpty().withMessage('Project name is required')
    .isLength({ min: 3 }).withMessage('Project name must be at least 3 characters'),
  body('description').notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('client').notEmpty().withMessage('Client is required').isMongoId().withMessage('Invalid client ID'),
  body('serviceType').notEmpty().withMessage('Service type is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateServiceRequest = [
  body('serviceName').notEmpty().withMessage('Service name is required')
    .isLength({ min: 3 }).withMessage('Service name must be at least 3 characters'),
  body('description').notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateMessage = [
  body('receiverId').notEmpty().withMessage('Receiver is required').isMongoId().withMessage('Invalid receiver ID'),
  body('content').notEmpty().withMessage('Message content is required')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];