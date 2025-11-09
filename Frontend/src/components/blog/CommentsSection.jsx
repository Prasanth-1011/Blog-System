import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentAPI } from '../../services/api';
import { formatRelativeTime, formatNumber } from '../../utils/helpers';
import { MessageCircle, Heart, Send, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const CommentsSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        loadComments();
    }, [blogId]);

    const loadComments = async () => {
        try {
            const response = await commentAPI.getBlogComments(blogId);
            setComments(response.data.data.comments);
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            await commentAPI.createComment({
                content: newComment,
                blogId
            });
            setNewComment('');
            toast.success('Comment added successfully');
            loadComments();
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReply = async (parentCommentId) => {
        if (!replyContent.trim()) return;

        setLoading(true);
        try {
            await commentAPI.createComment({
                content: replyContent,
                blogId,
                parentComment: parentCommentId
            });
            setReplyContent('');
            setReplyingTo(null);
            toast.success('Reply added successfully');
            loadComments();
        } catch (error) {
            toast.error('Failed to add reply');
        } finally {
            setLoading(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!isAuthenticated) return;

        try {
            await commentAPI.likeComment(commentId);
            loadComments();
        } catch (error) {
            toast.error('Failed to like comment');
        }
    };

    const Comment = ({ comment, depth = 0 }) => {
        const [showReplies, setShowReplies] = useState(false);
        const [showReplyForm, setShowReplyForm] = useState(false);

        const isLiked = comment.likes?.includes(user?._id);

        return (
            <div className={`${depth > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
                <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
                    {/* Comment Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                    {comment.author?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {comment.author?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatRelativeTime(comment.createdAt)}
                                </p>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Comment Content */}
                    <p className="text-gray-700 mb-3">{comment.content}</p>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button
                            onClick={() => handleLikeComment(comment._id)}
                            disabled={!isAuthenticated}
                            className={`flex items-center space-x-1 ${isLiked ? 'text-red-600' : 'hover:text-gray-700'
                                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{formatNumber(comment.likes?.length || 0)}</span>
                        </button>

                        {isAuthenticated && depth < 2 && (
                            <button
                                onClick={() => {
                                    setShowReplyForm(!showReplyForm);
                                    setReplyingTo(comment._id);
                                }}
                                className="flex items-center space-x-1 hover:text-gray-700"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Reply</span>
                            </button>
                        )}

                        {comment.replies?.length > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
                            </button>
                        )}
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && replyingTo === comment._id && (
                        <div className="mt-4">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write your reply..."
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <button
                                    onClick={() => {
                                        setShowReplyForm(false);
                                        setReplyingTo(null);
                                    }}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSubmitReply(comment._id)}
                                    disabled={!replyContent.trim() || loading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Reply</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Nested Replies */}
                {showReplies && comment.replies?.map(reply => (
                    <Comment key={reply._id} comment={reply} depth={depth + 1} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
                <MessageCircle className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-semibold text-gray-900">
                    Comments ({formatNumber(comments.length)})
                </h3>
            </div>

            {/* Add Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <div className="flex justify-end mt-3">
                        <button
                            type="submit"
                            disabled={!newComment.trim() || loading}
                            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center mb-8">
                    <p className="text-gray-600">
                        Please{' '}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            sign in
                        </a>{' '}
                        to leave a comment.
                    </p>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <Comment key={comment._id} comment={comment} />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;