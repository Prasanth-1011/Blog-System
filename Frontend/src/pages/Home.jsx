import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { Eye, Clock, ArrowRight, BookOpen, Users, FileText, TrendingUp } from 'lucide-react';
import { formatDate, generateExcerpt, formatNumber } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
    const { featuredBlogs, fetchFeaturedBlogs, fetchBlogs, loading } = useBlog();
    const { isAuthenticated } = useAuth();
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [stats, setStats] = useState({ blogs: 0, users: 0, categories: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        await fetchFeaturedBlogs();

        // Fetch recent blogs
        const result = await fetchBlogs({ limit: 6 });
        if (result.success) {
            setRecentBlogs(result.data.data.blogs);
        }

        // Mock stats (in real app, fetch from API)
        setStats({
            blogs: 50,
            users: 10,
            categories: 25
        });
    };

    const FeaturedBlogCard = ({ blog }) => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {blog.featuredImage && (
                <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime} min read</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {blog.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt || generateExcerpt(blog.content)}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(blog.views)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <span>❤️ {formatNumber(blog.likes?.length || 0)}</span>
                        </div>
                    </div>
                    <Link
                        to={`/blogs/${blog._id}`}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );

    const BlogCard = ({ blog }) => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {blog.featuredImage && (
                <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-40 object-cover"
                />
            )}
            <div className="p-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>•</span>
                    <span>{blog.readTime} min read</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {blog.excerpt || generateExcerpt(blog.content, 80)}
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                                {blog.author?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-600">{blog.author?.name}</span>
                    </div>
                    <Link
                        to={`/blogs/${blog._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Read
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-linear-to-br from-blue-600 to-purple-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Share Your
                            <span className="block text-yellow-300">Story With World</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
                            Join thousands of writers and readers in our vibrant community.
                            Share your knowledge, experiences, and stories with the world.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isAuthenticated ? (
                                <Link
                                    to="/write"
                                    className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
                                >
                                    Write Your First Blog
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors shadow-lg"
                                    >
                                        Start Writing Now
                                    </Link>
                                    <Link
                                        to="/blogs"
                                        className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                                    >
                                        Explore Blogs
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {formatNumber(stats.blogs)}+
                            </div>
                            <div className="text-gray-600">Blogs Published</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {formatNumber(stats.users)}+
                            </div>
                            <div className="text-gray-600">Active Writers</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {formatNumber(stats.categories)}+
                            </div>
                            <div className="text-gray-600">Categories</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Blogs */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Featured Stories
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover the most engaging and popular stories from our community
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : featuredBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {featuredBlogs.map((blog) => (
                                <FeaturedBlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No featured blogs available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Blogs */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Recent Stories
                            </h2>
                            <p className="text-gray-600">Fresh content from our community</p>
                        </div>
                        <Link
                            to="/blogs"
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {recentBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentBlogs.map((blog) => (
                                <BlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No recent blogs available</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-linear-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Share Your Story?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join our community of writers and start sharing your knowledge and experiences today.
                    </p>
                    {!isAuthenticated && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                            >
                                Sign Up Free
                            </Link>
                            <Link
                                to="/blogs"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Explore Content
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;