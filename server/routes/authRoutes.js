// server/routes/authRoutes.js
import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
import {
  login,
  getMe,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Seed first admin (run once)
router.post('/seed-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (!adminExists) {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@vikram.com',
        password: 'admin123',
        role: 'admin'
      });
      res.status(201).json({
        success: true,
        message: 'Admin created successfully',
        data: admin
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Admin already exists'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding admin'
    });
  }
});

export default router;