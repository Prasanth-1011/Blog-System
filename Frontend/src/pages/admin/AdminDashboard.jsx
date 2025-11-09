import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
    Users,
    FileText,
    Eye,
    TrendingUp,
    Shield,
    AlertCircle,
    ArrowUp,
    ArrowDown,
    Tag
} from 'lucide-react';
import { formatNumber } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const response = await adminAPI.getDashboardStats();
            setStats(response.data.data.stats);
            setPopularBlogs(response.data.data.popularBlogs);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, change, color }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
                    <p className="text-gray-600 text-sm mt-1">{label}</p>
                    {change && (
                        <div className={`flex items-center space-x-1 mt-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            <span>{Math.abs(change)}% from last week</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Overview of your blog platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={stats?.totalUsers}
                        change={12}
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={FileText}
                        label="Total Blogs"
                        value={stats?.totalBlogs}
                        change={8}
                        color="bg-green-500"
                    />
                    <StatCard
                        icon={Eye}
                        label="Published Blogs"
                        value={stats?.totalPublishedBlogs}
                        change={15}
                        color="bg-purple-500"
                    />
                    <StatCard
                        icon={Shield}
                        label="Pending Requests"
                        value={stats?.pendingAdminRequests}
                        change={-5}
                        color="bg-yellow-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity & Quick Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{formatNumber(stats?.recentUsers)}</div>
                                    <div className="text-sm text-gray-600">New Users (7d)</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{formatNumber(stats?.recentBlogs)}</div>
                                    <div className="text-sm text-gray-600">New Blogs (7d)</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{formatNumber(stats?.totalCategories)}</div>
                                    <div className="text-sm text-gray-600">Categories</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {stats?.totalUsers ? Math.round((stats.totalPublishedBlogs / stats.totalUsers) * 100) / 100 : 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Blogs/User</div>
                                </div>
                            </div>
                        </div>

                        {/* Popular Blogs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">Popular Blogs</h2>
                                    <Link
                                        to="/admin/blogs"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {popularBlogs.length > 0 ? (
                                    <div className="space-y-4">
                                        {popularBlogs.map((blog, index) => (
                                            <div key={blog._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">{blog.title}</p>
                                                        <p className="text-sm text-gray-500">{blog.author?.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <Eye className="w-4 h-4" />
                                                        <span>{formatNumber(blog.views)}</span>
                                                    </div>
                                                    <Link
                                                        to={`/blogs/${blog._id}`}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p>No popular blogs data available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/admin/users"
                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                >
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Manage Users</p>
                                        <p className="text-sm text-gray-500">View and manage users</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/admin/blogs"
                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                                >
                                    <FileText className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Manage Blogs</p>
                                        <p className="text-sm text-gray-500">Review and manage content</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/admin/requests"
                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
                                >
                                    <Shield className="w-5 h-5 text-yellow-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Admin Requests</p>
                                        <p className="text-sm text-gray-500">Review admin applications</p>
                                    </div>
                                </Link>
                                <Link
                                    to="/admin/categories"
                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                                >
                                    <Tag className="w-5 h-5 text-purple-600" /> {/* NOW THIS WILL WORK */}
                                    <div>
                                        <p className="font-medium text-gray-900">Categories</p>
                                        <p className="text-sm text-gray-500">Manage blog categories</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Platform Status</span>
                                    <span className="flex items-center space-x-1 text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm">Operational</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Database</span>
                                    <span className="flex items-center space-x-1 text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm">Connected</span>
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">API Services</span>
                                    <span className="flex items-center space-x-1 text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-sm">Running</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;