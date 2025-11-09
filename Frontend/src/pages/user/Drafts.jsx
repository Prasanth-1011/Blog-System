import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import { FileText, Edit, Trash2, Plus, Search } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Drafts = () => {
    const { fetchDraftBlogs, deleteBlog } = useBlog();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        setLoading(true);
        const result = await fetchDraftBlogs();
        if (result.success) {
            setDrafts(result.data.data.blogs);
        }
        setLoading(false);
    };

    const handleDelete = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
            return;
        }

        setDeleteLoading(blogId);
        const result = await deleteBlog(blogId);
        if (result.success) {
            toast.success('Draft deleted successfully');
            setDrafts(prev => prev.filter(draft => draft._id !== blogId));
        } else {
            toast.error(result.error);
        }
        setDeleteLoading(null);
    };

    const filteredDrafts = drafts.filter(draft =>
        draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        draft.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const DraftCard = ({ draft }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {draft.title || 'Untitled Draft'}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                        {draft.excerpt || 'No description available'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Last edited {formatRelativeTime(draft.updatedAt)}</span>
                        <span>•</span>
                        <span>Created {formatDate(draft.createdAt)}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                    <Link
                        to={`/edit/${draft._id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Draft"
                    >
                        <Edit className="w-5 h-5" />
                    </Link>
                    <button
                        onClick={() => handleDelete(draft._id)}
                        disabled={deleteLoading === draft._id}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete Draft"
                    >
                        {deleteLoading === draft._id ? (
                            <LoadingSpinner size="sm" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {draft.category && (
                <div className="flex items-center justify-between">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {draft.category.name}
                    </span>
                    <span className="text-sm text-gray-500">
                        {draft.readTime || 0} min read
                    </span>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Draft Blogs</h1>
                        <p className="text-gray-600">Continue working on your unpublished content</p>
                    </div>
                    <Link
                        to="/write"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create New Draft</span>
                    </Link>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="relative max-w-md">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search your drafts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Drafts Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredDrafts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredDrafts.map(draft => (
                            <DraftCard key={draft._id} draft={draft} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {searchTerm ? 'No drafts found' : 'No drafts yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Start creating draft blogs to save your work in progress'
                                }
                            </p>
                            {!searchTerm && (
                                <Link
                                    to="/write"
                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Create Your First Draft</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drafts;