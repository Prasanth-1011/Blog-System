import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { Tag, FileText, ArrowRight } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Categories = () => {
    const { categories, fetchCategories } = useBlog();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        await fetchCategories();
        setLoading(false);
    };

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
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Categories</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Explore blogs by topics and categories. Find content that matches your interests.
                    </p>
                </div>

                {/* Categories Grid */}
                {categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/blogs?category=${category.slug}`}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <Tag className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>

                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {category.description || `Explore ${category.name} related content`}
                                </p>

                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                    <FileText className="w-4 h-4" />
                                    <span>{formatNumber(category.blogCount || 0)} blogs</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
                            <p className="text-gray-600">
                                Categories will appear here once they are created by administrators.
                            </p>
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-16">
                    <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            Can't Find What You're Looking For?
                        </h2>
                        <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
                            Suggest new categories or start writing about topics you're passionate about.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/blogs"
                                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Browse All Blogs
                            </Link>
                            <Link
                                to="/write"
                                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Start Writing
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;