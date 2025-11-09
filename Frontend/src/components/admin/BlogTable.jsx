import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Calendar } from 'lucide-react';
import { formatDate, formatNumber, capitalize } from '../../utils/helpers';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BlogTable = ({ blogs, onUpdate }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleStatusUpdate = async (blogId, newStatus) => {
        try {
            await adminAPI.updateBlogStatus(blogId, newStatus);
            toast.success(`Blog ${newStatus} successfully`);
            onUpdate(); // Refresh the blog list
        } catch (error) {
            console.error('Error updating blog status:', error);
            toast.error('Failed to update blog status');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
        </div>
    );
};

export default BlogTable;