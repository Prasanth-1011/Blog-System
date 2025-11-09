import express from 'express';
import { body } from 'express-validator';
import {
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getAdminRequests,
    createAdminRequest,
    reviewAdminRequest,
    getAdminBlogs,
    updateBlogStatus
} from '../controllers/adminController.mjs';
import { protect, authorize, requireRoot } from '../middleware/auth.mjs';
import { handleValidationErrors } from '../middleware/validation.mjs';

const router = express.Router();

// All admin routes require authentication
router.use(protect);

// Dashboard and user management (admin only)
router.get('/dashboard', authorize('admin'), getDashboardStats);
router.get('/users', authorize('admin'), getUsers);
router.put('/users/:id/status', authorize('admin'), updateUserStatus);

// Blog management (admin only)
router.get('/blogs', authorize('admin'), getAdminBlogs);
router.put('/blogs/:id/status', authorize('admin'), updateBlogStatus);

// Admin requests
router.get('/requests', authorize('admin'), getAdminRequests);
router.post('/requests', createAdminRequest);
router.put('/requests/:id/review', requireRoot, reviewAdminRequest);

export default router;