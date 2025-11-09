import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, Shield, Tag, Settings } from 'lucide-react';

const QuickActionsPanel = () => {
    const actions = [
        {
            icon: Users,
            label: 'Manage Users',
            description: 'View and manage users',
            href: '/admin/users',
            color: 'blue'
        },
        {
            icon: FileText,
            label: 'Manage Blogs',
            description: 'Review and manage content',
            href: '/admin/blogs',
            color: 'green'
        },
        {
            icon: Shield,
            label: 'Admin Requests',
            description: 'Review admin applications',
            href: '/admin/requests',
            color: 'yellow'
        },
        {
            icon: Tag,
            label: 'Categories',
            description: 'Manage blog categories',
            href: '/admin/categories',
            color: 'purple'
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200 border-blue-200',
            green: 'bg-green-100 text-green-600 group-hover:bg-green-200 border-green-200',
            yellow: 'bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200 border-yellow-200',
            purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200 border-purple-200'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        to={action.href}
                        className={`flex items-center space-x-3 p-3 border rounded-lg hover:border-2 transition-all group ${getColorClasses(action.color)}`}
                    >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
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

export default QuickActionsPanel;