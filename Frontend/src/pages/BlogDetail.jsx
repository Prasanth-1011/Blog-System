import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatRelativeTime, formatNumber } from '../utils/helpers';
import {
    Clock,
    Eye,
    Heart,
    Bookmark,
    Share2,
    User,
    Calendar,
    Tag,
    MessageCircle,
    ArrowLeft
} from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CommentsSection from '../components/blog/CommentsSection';

const BlogDetail = () => {
    const { id } = useParams();
    const { fetchBlog, likeBlog, bookmarkBlog } = useBlog();
    const { isAuthenticated } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({ like: false, bookmark: false });

    useEffect(() => {
        loadBlog();
    }, [id]);

    const loadBlog = async () => {
        setLoading(true);
        const result = await fetchBlog(id);
        if (result.success) {
            setBlog(result.data.data);
        }
        setLoading(false);
    };

    const handleLike = async () => {
        if (!isAuthenticated) return;

        setActionLoading(prev => ({ ...prev, like: true }));
        const result = await likeBlog(id);
        if (result.success) {
            setBlog(prev => ({
                ...prev,
                likes: result.data.data.isLiked
                    ? [...prev.likes, 'current-user']
                    : prev.likes.filter(like => like !== 'current-user'),
                likesCount: result.data.data.likes
            }));
        }
        setActionLoading(prev => ({ ...prev, like: false }));
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) return;

        setActionLoading(prev => ({ ...prev, bookmark: true }));
        const result = await bookmarkBlog(id);
        if (result.success) {
            setBlog(prev => ({
                ...prev,
                isBookmarked: result.data.data.isBookmarked
            }));
        }
        setActionLoading(prev => ({ ...prev, bookmark: false }));
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.excerpt,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            // Show toast notification
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
                    <Link to="/blogs" className="text-blue-600 hover:text-blue-700">
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    const isLiked = isAuthenticated && blog.likes?.includes('current-user');
    const isBookmarked = blog.isBookmarked;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        to="/blogs"
                        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Blogs</span>
                    </Link>
                </div>
            </div>

            {/* Blog Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {blog.category?.name}
                        </span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={blog.createdAt}>
                                {formatDate(blog.createdAt)}
                            </time>
                        </div>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{blog.readTime} min read</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {blog.excerpt}
                    </p>

                    {/* Author & Stats */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{blog.author?.name}</p>
                                    <p className="text-sm text-gray-500">
                                        Published {formatRelativeTime(blog.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{formatNumber(blog.views)} views</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {blog.featuredImage && (
                    <div className="mb-8 rounded-2xl overflow-hidden">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-96 object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none mb-12">
                    <div
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                        className="text-gray-700 leading-relaxed text-lg"
                    />
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mb-8">
                        <Tag className="w-5 h-5 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLike}
                            disabled={actionLoading.like || !isAuthenticated}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{formatNumber(blog.likes?.length || 0)}</span>
                        </button>

                        <button
                            onClick={handleBookmark}
                            disabled={actionLoading.bookmark || !isAuthenticated}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isBookmarked
                                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            <span>Save</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                            <span>Share</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 text-gray-500">
                        <MessageCircle className="w-5 h-5" />
                        <span>{formatNumber(blog.commentsCount || 0)} comments</span>
                    </div>
                </div>

                {/* Author Bio */}
                <div className="bg-blue-50 rounded-2xl p-6 mb-12">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                About {blog.author?.name}
                            </h3>
                            <p className="text-gray-600">
                                {blog.author?.bio || 'A passionate writer sharing knowledge and experiences with the community.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <CommentsSection blogId={id} />
            </article>
        </div>
    );
};

export default BlogDetail;