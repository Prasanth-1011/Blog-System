import express from 'express';
import { getUserProfile, getUserBlogs, getUserBookmarks } from '../controllers/userController.mjs';
import { protect } from '../middleware/auth.mjs';

const router = express.Router();

router.get('/profile/:id', getUserProfile);
router.get('/:id/blogs', getUserBlogs);
router.get('/bookmarks', protect, getUserBookmarks);

export default router;