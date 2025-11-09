import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isEdited: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better query performance
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);