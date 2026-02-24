// server/routes/serviceRequestRoutes.js
import express from 'express';
const router = express.Router();
import {
  getServiceRequests,
  getMyRequests,
  getServiceRequest,
  createServiceRequest,
  approveRequest,
  rejectRequest,
  updateServiceRequest,
  deleteServiceRequest
} from '../controllers/serviceRequestController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes are protected
router.use(protect);

// Client routes
router.get('/my-requests', authorize('client'), getMyRequests);
router.post('/', authorize('client'), createServiceRequest);
router.put('/:id', authorize('client'), updateServiceRequest);
router.delete('/:id', authorize('client'), deleteServiceRequest);

// Admin routes
router.get('/', authorize('admin'), getServiceRequests);
router.put('/:id/approve', authorize('admin'), approveRequest);
router.put('/:id/reject', authorize('admin'), rejectRequest);

// Shared route (both admin and client can view individual request with proper auth)
router.get('/:id', getServiceRequest);

export default router;