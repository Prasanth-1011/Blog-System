import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { Bookmark, Eye, Heart, Clock, User, Search } from 'lucide-react';
import { formatDate, formatNumber, generateExcerpt } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadBookmarks();
    }, []);

    const loadBookmarks = async () => {
        try {
            const response = await userAPI.getUserBookmarks();
            setBookmarks(response.data.data.blogs);
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookmarks = bookmarks.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const BookmarkCard = ({ blog }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:translate-y-2px">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <Link to={`/blogs/${blog._id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                            {blog.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt || generateExcerpt(blog.content)}
                    </p>
                </div>
                <Bookmark className="w-5 h-5 text-blue-600 fill-current shrink-0 ml-4" />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-3 h-3 text-blue-600" />
                        </div>
                        <span>{blog.author?.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime} min read</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(blog.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{formatNumber(blog.likes?.length || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookmarks</h1>
                    <p className="text-gray-600">Your saved articles and stories</p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="relative max-w-md">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search your bookmarks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Bookmarks Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : filteredBookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredBookmarks.map(blog => (
                            <BookmarkCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {searchTerm ? 'No bookmarks found' : 'No bookmarks yet'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Start saving interesting articles by clicking the bookmark icon on any blog'
                                }
                            </p>
                            {!searchTerm && (
                                <Link
                                    to="/blogs"
                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <span>Explore Blogs</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookmarks;