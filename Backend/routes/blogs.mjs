import express from 'express';
import { body } from 'express-validator';
import {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    bookmarkBlog,
    getDraftBlogs
} from '../controllers/blogController.mjs';
import { protect } from '../middleware/auth.mjs';
import { handleValidationErrors } from '../middleware/validation.mjs';

const router = express.Router();

// Validation rules
const blogValidation = [
    body('title')
        .trim()
        .isLength({ min: 5, max: 200 })
        .withMessage('Title must be between 5 and 200 characters'),
    body('content')
        .isLength({ min: 50 })
        .withMessage('Content must be at least 50 characters long'),
    body('category')
        .isMongoId()
        .withMessage('Valid category ID is required'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),
    body('excerpt')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Excerpt cannot be more than 300 characters')
];

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlog);

// Protected routes
router.use(protect);

router.get('/drafts/mine', getDraftBlogs);
router.post('/', blogValidation, handleValidationErrors, createBlog);
router.put('/:id', blogValidation, handleValidationErrors, updateBlog);
router.delete('/:id', deleteBlog);
router.put('/:id/like', likeBlog);
router.put('/:id/bookmark', bookmarkBlog);

export default router;