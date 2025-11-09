import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    excerpt: {
        type: String,
        maxlength: [300, 'Excerpt cannot be more than 300 characters']
    },
    featuredImage: {
        type: String,
        default: ''
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    metaTitle: {
        type: String,
        maxlength: [200, 'Meta title cannot be more than 200 characters']
    },
    metaDescription: {
        type: String,
        maxlength: [500, 'Meta description cannot be more than 500 characters']
    },
    readTime: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Generate slug before saving
blogSchema.pre('save', function (next) {
    if (this.title && this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 100);
    }

    // Calculate read time (assuming 200 words per minute)
    if (this.content && this.isModified('content')) {
        const words = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(words / 200);
    }

    // Generate excerpt from content if not provided
    if (this.content && !this.excerpt) {
        this.excerpt = this.content
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .substring(0, 300)
            .trim() + '...';
    }

    next();
});

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });

export default mongoose.model('Blog', blogSchema);