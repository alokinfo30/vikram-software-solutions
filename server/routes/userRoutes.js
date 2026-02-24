// server/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  toggleUserStatus
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes are protected
router.use(protect);

// Get all users - requires authentication (any role can see other users for messaging)
router.route('/')
  .get(getUsers)
  .post(authorize('admin'), createUser);

router.get('/role/:role', authorize('admin', 'employee'), getUsersByRole);
router.put('/:id/toggle-status', authorize('admin'), toggleUserStatus);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;