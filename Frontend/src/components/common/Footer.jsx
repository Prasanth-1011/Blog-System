import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">BlogApp</span>
                        </Link>
                    </div>
                    <p className="text-gray-600 mb-4 max-w-md">
                        Share your stories, knowledge, and experiences with the world.
                        Join our community of writers and readers today.
                    </p>
                </div>

                <div className='flex gap-16'>
                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/blogs" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Blogs
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Community
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/register" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Join Now
                                </Link>
                            </li>
                            <li>
                                <Link to="/write" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Write a Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="/guidelines" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-center mt-8 py-8 border-t border-gray-200">
                <div className="flex flex-col gap-4 justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        © 2024 BlogApp. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                            Terms of Service
                        </Link>
                        <Link to="/contact" className="text-gray-500 hover:text-gray-700 text-sm">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;