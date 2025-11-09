import express from 'express';
import { body } from 'express-validator';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.mjs';
import { protect, authorize } from '../middleware/auth.mjs';
import { handleValidationErrors } from '../middleware/validation.mjs';

const router = express.Router();

// Validation rules
const categoryValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category name must be between 2 and 50 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Description cannot be more than 200 characters')
];

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', categoryValidation, handleValidationErrors, createCategory);
router.put('/:id', categoryValidation, handleValidationErrors, updateCategory);
router.delete('/:id', deleteCategory);

export default router;