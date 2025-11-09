import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBlog } from '../../context/BlogContext';
import {
    FileText,
    Bookmark,
    Eye,
    Heart,
    Edit,
    Plus,
    TrendingUp,
    Calendar,
    User
} from 'lucide-react';
import { formatDate, formatNumber, formatRelativeTime } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
    const { user } = useAuth();
    const { fetchBlogs, fetchDraftBlogs } = useBlog();
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [draftBlogs, setDraftBlogs] = useState([]);
    const [stats, setStats] = useState({
        totalBlogs: 0,
        totalViews: 0,
        totalLikes: 0,
        draftCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);

        // Fetch user's published blogs
        const blogsResult = await fetchBlogs({ author: user._id, limit: 5 });
        if (blogsResult.success) {
            setRecentBlogs(blogsResult.data.data.blogs);
            setStats(prev => ({
                ...prev,
                totalBlogs: blogsResult.data.data.pagination.total,
                totalViews: blogsResult.data.data.blogs.reduce((sum, blog) => sum + blog.views, 0),
                totalLikes: blogsResult.data.data.blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0)
            }));
        }

        // Fetch draft blogs
        const draftsResult = await fetchDraftBlogs();
        if (draftsResult.success) {
            setDraftBlogs(draftsResult.data.data.blogs);
            setStats(prev => ({ ...prev, draftCount: draftsResult.data.data.pagination.total }));
        }

        setLoading(false);
    };

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
                    <p className="text-gray-600 text-sm mt-1">{label}</p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const BlogCard = ({ blog, isDraft = false }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {blog.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        {!isDraft && (
                            <>
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{formatNumber(blog.views)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{formatNumber(blog.likes?.length || 0)}</span>
                                </div>
                            </>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {blog.excerpt || 'No description available'}
                    </p>
                </div>
                <Link
                    to={isDraft ? `/edit/${blog._id}` : `/blogs/${blog._id}`}
                    className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                    <Edit className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening with your content and community.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={FileText}
                        label="Published Blogs"
                        value={stats.totalBlogs}
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={Eye}
                        label="Total Views"
                        value={stats.totalViews}
                        color="bg-green-500"
                    />
                    <StatCard
                        icon={Heart}
                        label="Total Likes"
                        value={stats.totalLikes}
                        color="bg-red-500"
                    />
                    <StatCard
                        icon={Edit}
                        label="Drafts"
                        value={stats.draftCount}
                        color="bg-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Blogs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">Recent Blogs</h2>
                                <Link
                                    to="/my-blogs"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    View All
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentBlogs.length > 0 ? (
                                <div className="space-y-4">
                                    {recentBlogs.map(blog => (
                                        <BlogCard key={blog._id} blog={blog} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-4">You haven't published any blogs yet</p>
                                    <Link
                                        to="/write"
                                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Write Your First Blog</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Drafts & Quick Actions */}
                    <div className="space-y-8">
                        {/* Draft Blogs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Draft Blogs</h2>
                                    <Link
                                        to="/drafts"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {draftBlogs.length > 0 ? (
                                    <div className="space-y-4">
                                        {draftBlogs.slice(0, 3).map(blog => (
                                            <BlogCard key={blog._id} blog={blog} isDraft />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="text-gray-500">No draft blogs</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link
                                    to="/write"
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <Plus className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Write New Blog</p>
                                        <p className="text-sm text-gray-500">Start creating content</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/bookmarks"
                                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                        <Bookmark className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Bookmarks</p>
                                        <p className="text-sm text-gray-500">Saved articles</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;