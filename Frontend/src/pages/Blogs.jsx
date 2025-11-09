import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { Search, Filter, Grid, List, Clock, Eye, User } from 'lucide-react';
import { formatDate, generateExcerpt, formatNumber, debounce } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Blogs = () => {
    const { blogs, fetchBlogs, loading, pagination, categories, fetchCategories } = useBlog();
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        tag: '',
        sort: 'newest'
    });

    useEffect(() => {
        loadBlogs();
        fetchCategories(); // This will now work
    }, [filters]);

    const loadBlogs = debounce(() => {
        const params = {
            page: 1,
            limit: 12,
            ...filters
        };
        fetchBlogs(params);
    }, 500);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const BlogCard = ({ blog }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-2px">
            {blog.featuredImage && (
                <Link to={`/blogs/${blog._id}`}>
                    <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                </Link>
            )}
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {blog.category?.name}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime} min</span>
                    </div>
                </div>

                <Link to={`/blogs/${blog._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                </Link>

                <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt || generateExcerpt(blog.content)}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(blog.views)} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <span>❤️ {formatNumber(blog.likes?.length || 0)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{blog.author?.name}</p>
                            <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                        </div>
                    </div>
                    <Link
                        to={`/blogs/${blog._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                        Read More →
                    </Link>
                </div>
            </div>
        </div>
    );

    const BlogListItem = ({ blog }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="md:flex">
                {blog.featuredImage && (
                    <div className="md:w-64 md:shrink-0">
                        <Link to={`/blogs/${blog._id}`}>
                            <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </Link>
                    </div>
                )}
                <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {blog.category?.name}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{blog.readTime} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{formatNumber(blog.views)}</span>
                            </div>
                        </div>
                    </div>

                    <Link to={`/blogs/${blog._id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                            {blog.title}
                        </h3>
                    </Link>

                    <p className="text-gray-600 mb-4">
                        {blog.excerpt || generateExcerpt(blog.content, 200)}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{blog.author?.name}</p>
                                <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                            </div>
                        </div>
                        <Link
                            to={`/blogs/${blog._id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Read Full Story →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">All Blogs</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover amazing stories, tutorials, and insights from our community of writers
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search blogs..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category._id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="popular">Most Popular</option>
                            <option value="featured">Featured</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Blog List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : blogs.length > 0 ? (
                    <>
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-6'
                        }>
                            {blogs.map((blog) => (
                                viewMode === 'grid'
                                    ? <BlogCard key={blog._id} blog={blog} />
                                    : <BlogListItem key={blog._id} blog={blog} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center space-x-2">
                                    <button
                                        disabled={pagination.current === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-gray-600">
                                        Page {pagination.current} of {pagination.pages}
                                    </span>
                                    <button
                                        disabled={pagination.current === pagination.pages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs found</h3>
                            <p className="text-gray-600 mb-6">
                                Try adjusting your search filters or browse all categories
                            </p>
                            <button
                                onClick={() => setFilters({ search: '', category: '', tag: '', sort: 'newest' })}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blogs;