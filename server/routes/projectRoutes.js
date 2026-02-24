// server/routes/projectRoutes.js
import express from 'express';
const router = express.Router();
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getAssignedProjects,
  getClientProjects,
  updateProjectStatus,
  assignEmployee,
  removeEmployee,
  getProjectStats
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes are protected
router.use(protect);

// Stats route
router.get('/stats', authorize('admin'), getProjectStats);

// Employee routes
router.get('/assigned', authorize('employee'), getAssignedProjects);

// Client routes
router.get('/my-projects', authorize('client'), getClientProjects);

// Project status update (employee)
router.put('/:id/status', authorize('employee'), updateProjectStatus);

// Admin only routes
router.route('/')
  .get(authorize('admin'), getProjects)
  .post(authorize('admin'), createProject);

router.post('/:id/assign', authorize('admin'), assignEmployee);
router.delete('/:id/assign/:employeeId', authorize('admin'), removeEmployee);

router.route('/:id')
  .get(getProject)
  .put(authorize('admin'), updateProject)
  .delete(authorize('admin'), deleteProject);

export default router;