import express from 'express';
import { body } from 'express-validator';
import {
    getBlogComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    getCommentReplies
} from '../controllers/commentController.mjs';
import { protect } from '../middleware/auth.mjs';
import { handleValidationErrors } from '../middleware/validation.mjs';

const router = express.Router();

// Validation rules
const commentValidation = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters'),
    body('blogId')
        .isMongoId()
        .withMessage('Valid blog ID is required')
];

// Public routes
router.get('/blog/:blogId', getBlogComments);
router.get('/:id/replies', getCommentReplies);

// Protected routes
router.use(protect);

router.post('/', commentValidation, handleValidationErrors, createComment);
router.put('/:id', commentValidation, handleValidationErrors, updateComment);
router.delete('/:id', deleteComment);
router.put('/:id/like', likeComment);

export default router;