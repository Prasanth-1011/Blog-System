import User from '../models/User.mjs';
import Blog from '../models/Blog.mjs';
import Comment from '../models/Comment.mjs';
import Category from '../models/Category.mjs';
import AdminRequest from '../models/AdminRequest.mjs';
import { sendAdminApprovalEmail } from '../utils/emailService.mjs';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBlogs = await Blog.countDocuments();
        const totalPublishedBlogs = await Blog.countDocuments({ status: 'published' });
        const totalCategories = await Category.countDocuments();
        const pendingAdminRequests = await AdminRequest.countDocuments({ status: 'pending' });

        // Recent users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        // Recent blogs (last 7 days)
        const recentBlogs = await Blog.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
            status: 'published'
        });

        // Popular blogs (most viewed)
        const popularBlogs = await Blog.find({ status: 'published' })
            .sort({ views: -1 })
            .limit(5)
            .populate('author', 'name')
            .select('title views createdAt');

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalBlogs,
                    totalPublishedBlogs,
                    totalCategories,
                    pendingAdminRequests,
                    recentUsers,
                    recentBlogs
                },
                popularBlogs
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { search, status, role } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        if (role) {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent modifying root admin
        if (user.root) {
            return res.status(403).json({
                success: false,
                message: 'Cannot modify root admin status'
            });
        }

        user.status = status;
        await user.save();

        res.json({
            success: true,
            message: `User status updated to ${status}`,
            data: user
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message
        });
    }
};

// @desc    Get all admin requests
// @route   GET /api/admin/requests
// @access  Private/Admin
const getAdminRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status } = req.query;

        let query = {};
        if (status) {
            query.status = status;
        }

        const requests = await AdminRequest.find(query)
            .populate('user', 'name email profilePicture')
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AdminRequest.countDocuments(query);

        res.json({
            success: true,
            data: {
                requests,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get admin requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admin requests',
            error: error.message
        });
    }
};

// @desc    Create admin request
// @route   POST /api/admin/requests
// @access  Private
const createAdminRequest = async (req, res) => {
    try {
        const { reason } = req.body;

        // Check if user already has a pending request
        const existingRequest = await AdminRequest.findOne({
            user: req.user._id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending admin request'
            });
        }

        const adminRequest = await AdminRequest.create({
            user: req.user._id,
            reason
        });

        const populatedRequest = await AdminRequest.findById(adminRequest._id)
            .populate('user', 'name email');

        res.status(201).json({
            success: true,
            message: 'Admin request submitted successfully',
            data: populatedRequest
        });
    } catch (error) {
        console.error('Create admin request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting admin request',
            error: error.message
        });
    }
};

// @desc    Approve/reject admin request
// @route   PUT /api/admin/requests/:id/review
// @access  Private/Root
const reviewAdminRequest = async (req, res) => {
    try {
        const { status, reviewNotes } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const adminRequest = await AdminRequest.findById(req.params.id)
            .populate('user', 'name email');

        if (!adminRequest) {
            return res.status(404).json({
                success: false,
                message: 'Admin request not found'
            });
        }

        if (adminRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been reviewed'
            });
        }

        adminRequest.status = status;
        adminRequest.reviewedBy = req.user._id;
        adminRequest.reviewNotes = reviewNotes || '';

        await adminRequest.save();

        // If approved, update user role and status
        if (status === 'approved') {
            await User.findByIdAndUpdate(adminRequest.user._id, {
                role: 'admin',
                status: 'active'
            });

            // Send approval email
            try {
                await sendAdminApprovalEmail(adminRequest.user.email, true);
            } catch (emailError) {
                console.error('Failed to send approval email:', emailError);
            }
        } else {
            // Send rejection email
            try {
                await sendAdminApprovalEmail(adminRequest.user.email, false);
            } catch (emailError) {
                console.error('Failed to send rejection email:', emailError);
            }
        }

        res.json({
            success: true,
            message: `Admin request ${status} successfully`,
            data: adminRequest
        });
    } catch (error) {
        console.error('Review admin request error:', error);
        res.status(500).json({
            success: false,
            message: 'Error reviewing admin request',
            error: error.message
        });
    }
};

// @desc    Get all blogs for admin
// @route   GET /api/admin/blogs
// @access  Private/Admin
const getAdminBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status, search } = req.query;

        let query = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const blogs = await Blog.find(query)
            .populate('author', 'name email')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments(query);

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
        console.error('Get admin blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
};

// @desc    Update blog status (admin only)
// @route   PUT /api/admin/blogs/:id/status
// @access  Private/Admin
const updateBlogStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['draft', 'published', 'archived'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        blog.status = status;
        await blog.save();

        const updatedBlog = await Blog.findById(blog._id)
            .populate('author', 'name')
            .populate('category', 'name');

        res.json({
            success: true,
            message: `Blog status updated to ${status}`,
            data: updatedBlog
        });
    } catch (error) {
        console.error('Update blog status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog status',
            error: error.message
        });
    }
};

export {
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getAdminRequests,
    createAdminRequest,
    reviewAdminRequest,
    getAdminBlogs,
    updateBlogStatus
};