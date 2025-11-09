import Comment from '../models/Comment.mjs';
import Blog from '../models/Blog.mjs';

// @desc    Get comments for a blog
// @route   GET /api/comments/blog/:blogId
// @access  Public
const getBlogComments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const comments = await Comment.find({
            blog: req.params.blogId,
            parentComment: null, // Only top-level comments
            status: 'approved'
        })
            .populate('author', 'name profilePicture')
            .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'name profilePicture'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Comment.countDocuments({
            blog: req.params.blogId,
            parentComment: null,
            status: 'approved'
        });

        res.json({
            success: true,
            data: {
                comments,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });
    } catch (error) {
        console.error('Get blog comments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comments',
            error: error.message
        });
    }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
    try {
        const { content, blogId, parentComment } = req.body;

        // Check if blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // If it's a reply, check if parent comment exists
        if (parentComment) {
            const parent = await Comment.findById(parentComment);
            if (!parent) {
                return res.status(404).json({
                    success: false,
                    message: 'Parent comment not found'
                });
            }
        }

        const comment = await Comment.create({
            content,
            blog: blogId,
            author: req.user._id,
            parentComment: parentComment || null
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('author', 'name profilePicture');

        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: populatedComment
        });
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating comment',
            error: error.message
        });
    }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
    try {
        const { content } = req.body;

        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the author
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this comment'
            });
        }

        comment.content = content;
        comment.isEdited = true;
        await comment.save();

        const updatedComment = await Comment.findById(comment._id)
            .populate('author', 'name profilePicture');

        res.json({
            success: true,
            message: 'Comment updated successfully',
            data: updatedComment
        });
    } catch (error) {
        console.error('Update comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating comment',
            error: error.message
        });
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the author or admin
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        // If it's a parent comment, also delete replies
        if (!comment.parentComment) {
            await Comment.deleteMany({ parentComment: comment._id });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting comment',
            error: error.message
        });
    }
};

// @desc    Like/unlike comment
// @route   PUT /api/comments/:id/like
// @access  Private
const likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        const isLiked = comment.likes.includes(req.user._id);

        if (isLiked) {
            // Unlike
            comment.likes = comment.likes.filter(like => like.toString() !== req.user._id.toString());
        } else {
            // Like
            comment.likes.push(req.user._id);
        }

        await comment.save();

        res.json({
            success: true,
            message: isLiked ? 'Comment unliked' : 'Comment liked',
            data: {
                likes: comment.likes.length,
                isLiked: !isLiked
            }
        });
    } catch (error) {
        console.error('Like comment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating like',
            error: error.message
        });
    }
};

// @desc    Get comment replies
// @route   GET /api/comments/:id/replies
// @access  Public
const getCommentReplies = async (req, res) => {
    try {
        const replies = await Comment.find({
            parentComment: req.params.id,
            status: 'approved'
        })
            .populate('author', 'name profilePicture')
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            data: replies
        });
    } catch (error) {
        console.error('Get comment replies error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comment replies',
            error: error.message
        });
    }
};

export {
    getBlogComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    getCommentReplies
};