import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { FileText, Eye, Heart, Edit, Trash2, Plus, Search } from 'lucide-react';
import { formatDate, formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyBlogs = () => {
    const { fetchBlogs, deleteBlog } = useBlog();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        setLoading(true);
        const result = await fetchBlogs({ author: 'me', limit: 20 });
        if (result.success) {
            setBlogs(result.data.data.blogs);
        }
        setLoading(false);
    };

    const handleDelete = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        setDeleteLoading(blogId);
        const result = await deleteBlog(blogId);
        if (result.success) {
            toast.success('Blog deleted successfully');
            setBlogs(prev => prev.filter(blog => blog._id !== blogId));
        } else {
            toast.error(result.error);
        }
        setDeleteLoading(null);
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const BlogCard = ({ blog }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                        {blog.excerpt || 'No description available'}
                    </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                    <Link
                        to={`/edit/${blog._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Blog"
                    >
                        <Edit className="w-5 h-5" />
                    </Link>
                    <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deleteLoading === blog._id}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete Blog"
                    >
                        {deleteLoading === blog._id ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(blog.views)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(blog.likes?.length || 0)} likes</span>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : blog.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                    {blog.status}
                </span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Blogs</h1>
                        <p className="text-gray-600">Manage and track your published content</p>
                    </div>
                    <Link
                        to="/write"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Write New Blog</span>
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="relative max-w-md">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search your blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Blogs Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBlogs.map(blog => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {searchTerm ? 'No blogs found' : 'No blogs yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Start sharing your knowledge and experiences with the community'
                                }
                            </p>
                            {!searchTerm && (
                                <Link
                                    to="/write"
                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Write Your First Blog</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBlogs;