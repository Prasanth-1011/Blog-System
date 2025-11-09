import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Menu,
    X,
    Home,
    BookOpen,
    Tag,
    LayoutDashboard,
    FileText,
    Bookmark,
    Edit,
    Settings,
    Users,
    Shield,
    Tags,
    User,
    LogOut,
    Menu as MenuIcon
} from 'lucide-react';
import { NAVIGATION } from '../../utils/constants';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    const getIcon = (iconName) => {
        const icons = {
            Home, BookOpen, Tag, LayoutDashboard, FileText, Bookmark, Edit, Settings, Users, Shield, Tags
        };
        const IconComponent = icons[iconName];
        return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
    };

    const navigationItems = [
        ...NAVIGATION.PUBLIC,
        ...(isAuthenticated ? NAVIGATION.USER : []),
        ...(isAdmin ? NAVIGATION.ADMIN : [])
    ];

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-8xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">BlogApp</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigationItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {getIcon(item.icon)}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                                        {user?.name}
                                    </span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <MenuIcon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-2">
                            {navigationItems.map((item) => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {getIcon(item.icon)}
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;