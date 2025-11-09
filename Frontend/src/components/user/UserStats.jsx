import React from 'react';
import { FileText, Eye, Heart, Edit } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

const UserStats = ({ stats }) => {
    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
                    <p className="text-gray-600 text-sm mt-1">{label}</p>
                </div>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
                icon={FileText}
                label="Published Blogs"
                value={stats.totalBlogs}
                color="bg-blue-500"
            />
            <StatCard
                icon={Eye}
                label="Total Views"
                value={stats.totalViews}
                color="bg-green-500"
            />
            <StatCard
                icon={Heart}
                label="Total Likes"
                value={stats.totalLikes}
                color="bg-red-500"
            />
            <StatCard
                icon={Edit}
                label="Drafts"
                value={stats.draftCount}
                color="bg-yellow-500"
            />
        </div>
    );
};

export default UserStats;