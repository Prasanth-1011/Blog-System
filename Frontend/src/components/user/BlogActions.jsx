import React, { useState } from 'react';
import { Heart, Bookmark, Share2, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const BlogActions = ({ blog, onEdit, onDelete, showManagement = false }) => {
    const { isAuthenticated } = useAuth();
    const { likeBlog, bookmarkBlog } = useBlog();
    const [actionLoading, setActionLoading] = useState({ like: false, bookmark: false });

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to like blogs');
            return;
        }

        setActionLoading(prev => ({ ...prev, like: true }));
        const result = await likeBlog(blog._id);
        if (result.success) {
            toast.success(result.data.message);
        } else {
            toast.error(result.error);
        }
        setActionLoading(prev => ({ ...prev, like: false }));
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to bookmark blogs');
            return;
        }

        setActionLoading(prev => ({ ...prev, bookmark: true }));
        const result = await bookmarkBlog(blog._id);
        if (result.success) {
            toast.success(result.data.message);
        } else {
            toast.error(result.error);
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
            toast.success('Link copied to clipboard!');
        }
    };

    const isLiked = isAuthenticated && blog.likes?.includes('current-user');
    const isBookmarked = blog.isBookmarked;

    return (
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-200">
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleLike}
                    disabled={actionLoading.like || !isAuthenticated}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {actionLoading.like ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    )}
                    <span>{blog.likes?.length || 0}</span>
                </button>

                <button
                    onClick={handleBookmark}
                    disabled={actionLoading.bookmark || !isAuthenticated}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isBookmarked
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {actionLoading.bookmark ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    )}
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

            {showManagement && (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogActions;