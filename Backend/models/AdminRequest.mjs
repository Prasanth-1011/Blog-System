import mongoose from 'mongoose';

const adminRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: [true, 'Reason for admin request is required'],
        maxlength: [500, 'Reason cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNotes: {
        type: String,
        maxlength: [500, 'Review notes cannot be more than 500 characters']
    }
}, {
    timestamps: true
});

// Index for better query performance
adminRequestSchema.index({ user: 1 });
adminRequestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('AdminRequest', adminRequestSchema);