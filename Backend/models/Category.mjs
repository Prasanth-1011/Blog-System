import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot be more than 200 characters'],
        default: ''
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Generate slug before saving
categorySchema.pre('save', function (next) {
    if (this.name && this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-');
    }
    next();
});

// Index for better query performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

// Static method to get active categories
categorySchema.statics.getActiveCategories = function () {
    return this.find({ isActive: true }).sort({ name: 1 });
};

// Instance method to check if category can be deleted
categorySchema.methods.canDelete = async function () {
    const Blog = mongoose.model('Blog');
    const blogCount = await Blog.countDocuments({ category: this._id });
    return blogCount === 0;
};

// Virtual for blog count (will be populated when needed)
categorySchema.virtual('blogCount', {
    ref: 'Blog',
    localField: '_id',
    foreignField: 'category',
    count: true
});

// Ensure virtual fields are serialized
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

export default mongoose.model('Category', categorySchema);