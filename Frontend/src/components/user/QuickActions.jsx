import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bookmark, FileText, Settings } from 'lucide-react';

const QuickActions = () => {
    const actions = [
        {
            icon: Plus,
            label: 'Write New Blog',
            description: 'Start creating content',
            href: '/write',
            color: 'blue'
        },
        {
            icon: Bookmark,
            label: 'Bookmarks',
            description: 'Saved articles',
            href: '/bookmarks',
            color: 'green'
        },
        {
            icon: FileText,
            label: 'My Blogs',
            description: 'Manage your content',
            href: '/my-blogs',
            color: 'purple'
        },
        {
            icon: Settings,
            label: 'Profile',
            description: 'Update your settings',
            href: '/profile',
            color: 'gray'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
            green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
            purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
            gray: 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.href}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${getColorClasses(action.color)}`}>
                            <action.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{action.label}</p>
                            <p className="text-sm text-gray-500">{action.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;