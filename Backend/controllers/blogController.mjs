import Blog from '../models/Blog.mjs';
import Category from '../models/Category.mjs';
import Comment from '../models/Comment.mjs';

// @desc    Get all published blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { category, tag, search, featured } = req.query;

        // Build query
        let query = { status: 'published' };

        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Get blogs with pagination
        const blogs = await Blog.find(query)
            .populate('author', 'name profilePicture')
            .populate('category', 'name slug')
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
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name profilePicture bio')
            .populate('category', 'name slug');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        res.json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching blog',
            error: error.message
        });
    }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, featuredImage, metaTitle, metaDescription } = req.body;

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

        const blog = await Blog.create({
            title,
            content,
            excerpt,
            category,
            tags: tags || [],
            featuredImage: featuredImage || '',
            metaTitle,
            metaDescription,
            author: req.user._id
        });

        const populatedBlog = await Blog.findById(blog._id)
            .populate('author', 'name profilePicture')
            .populate('category', 'name slug');

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: populatedBlog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating blog',
            error: error.message
        });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is author or admin
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        // Update fields
        const updatableFields = ['title', 'content', 'excerpt', 'category', 'tags', 'featuredImage', 'status', 'isFeatured', 'metaTitle', 'metaDescription'];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                blog[field] = req.body[field];
            }
        });

        await blog.save();

        const updatedBlog = await Blog.findById(blog._id)
            .populate('author', 'name profilePicture')
            .populate('category', 'name slug');

        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating blog',
            error: error.message
        });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is author or admin
        if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        await Blog.findByIdAndDelete(req.params.id);

        // Also delete associated comments
        await Comment.deleteMany({ blog: req.params.id });

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting blog',
            error: error.message
        });
    }
};

// @desc    Like/unlike blog
// @route   PUT /api/blogs/:id/like
// @access  Private
const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        const isLiked = blog.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike
            blog.likes = blog.likes.filter(like => like.toString() !== req.user._id.toString());
        } else {
            // Like
            blog.likes.push(req.user._id);
        }

        await blog.save();

        res.json({
            success: true,
            message: isLiked ? 'Blog unliked' : 'Blog liked',
            data: {
                likes: blog.likes.length,
                isLiked: !isLiked
            }
        });
    } catch (error) {
        console.error('Like blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating like',
            error: error.message
        });
    }
};

// @desc    Bookmark/unbookmark blog
// @route   PUT /api/blogs/:id/bookmark
// @access  Private
const bookmarkBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        const isBookmarked = blog.bookmarks.includes(req.user._id);

        if (isBookmarked) {
            // Remove bookmark
            blog.bookmarks = blog.bookmarks.filter(bookmark => bookmark.toString() !== req.user._id.toString());
        } else {
            // Add bookmark
            blog.bookmarks.push(req.user._id);
        }

        await blog.save();

        res.json({
            success: true,
            message: isBookmarked ? 'Blog removed from bookmarks' : 'Blog bookmarked',
            data: {
                isBookmarked: !isBookmarked
            }
        });
    } catch (error) {
        console.error('Bookmark blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating bookmark',
            error: error.message
        });
    }
};

// @desc    Get user's draft blogs
// @route   GET /api/blogs/drafts
// @access  Private
const getDraftBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({
            author: req.user._id,
            status: 'draft'
        })
            .populate('category', 'name slug')
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments({
            author: req.user._id,
            status: 'draft'
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
        console.error('Get draft blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching draft blogs',
            error: error.message
        });
    }
};

export {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    bookmarkBlog,
    getDraftBlogs
};