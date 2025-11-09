import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { FileText, Search, Filter, Eye, Edit, Calendar } from 'lucide-react';
import { formatDate, formatNumber, capitalize } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BlogManagement = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadBlogs();
    }, [searchTerm, statusFilter]);

    const loadBlogs = async () => {
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (statusFilter) params.status = statusFilter;

            const response = await adminAPI.getAdminBlogs(params);
            setBlogs(response.data.data.blogs);
        } catch (error) {
            console.error('Error loading blogs:', error);
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (blogId, newStatus) => {
        try {
            await adminAPI.updateBlogStatus(blogId, newStatus);
            toast.success(`Blog ${newStatus} successfully`);
            loadBlogs(); // Reload blogs to reflect changes
        } catch (error) {
            console.error('Error updating blog status:', error);
            toast.error('Failed to update blog status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
                    <p className="text-gray-600">Manage and moderate blog content</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search blogs by title or content..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Blogs Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : blogs.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Blog
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Author
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Views
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {blogs.map((blog) => (
                                        <tr key={blog._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {blog.featuredImage && (
                                                        <img
                                                            src={blog.featuredImage}
                                                            alt={blog.title}
                                                            className="w-10 h-10 object-cover rounded-lg"
                                                        />
                                                    )}
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                            {blog.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {blog.category?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{blog.author?.name}</div>
                                                <div className="text-sm text-gray-500">{blog.author?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blog.status)}`}>
                                                    {capitalize(blog.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatNumber(blog.views)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(blog.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        to={`/blogs/${blog._id}`}
                                                        className="text-blue-600 hover:text-blue-900 p-1"
                                                        title="View Blog"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <select
                                                        value={blog.status}
                                                        onChange={(e) => handleStatusUpdate(blog._id, e.target.value)}
                                                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option value="published">Published</option>
                                                        <option value="draft">Draft</option>
                                                        <option value="archived">Archived</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
                            <p className="text-gray-600">
                                {searchTerm || statusFilter
                                    ? 'Try adjusting your search filters'
                                    : 'No blogs have been created yet'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogManagement;