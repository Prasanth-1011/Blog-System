import User from '../models/User.mjs';
import Blog from '../models/Blog.mjs';

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('blogs', 'title slug featuredImage createdAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's published blogs count
        const publishedBlogsCount = await Blog.countDocuments({
            author: req.params.id,
            status: 'published'
        });

        res.json({
            success: true,
            data: {
                user,
                stats: {
                    publishedBlogs: publishedBlogsCount
                }
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// @desc    Get user's blogs
// @route   GET /api/users/:id/blogs
// @access  Public
const getUserBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({
            author: req.params.id,
            status: 'published'
        })
            .populate('author', 'name profilePicture')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments({
            author: req.params.id,
            status: 'published'
        });

        res.json({
            success: true,
            data: {
                blogs,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get user blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user blogs',
            error: error.message
        });
    }
};

// @desc    Get user's bookmarks
// @route   GET /api/users/bookmarks
// @access  Private
const getUserBookmarks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({
            bookmarks: req.user._id,
            status: 'published'
        })
            .populate('author', 'name profilePicture')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments({
            bookmarks: req.user._id,
            status: 'published'
        });

        res.json({
            success: true,
            data: {
                blogs,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get user bookmarks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookmarks',
            error: error.message
        });
    }
};

export { getUserProfile, getUserBlogs, getUserBookmarks };