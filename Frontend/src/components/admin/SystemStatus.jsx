import React from 'react';

const SystemStatus = () => {
    const statusItems = [
        {
            label: 'Platform Status',
            status: 'operational',
            description: 'All systems normal'
        },
        {
            label: 'Database',
            status: 'connected',
            description: 'MongoDB connection active'
        },
        {
            label: 'API Services',
            status: 'running',
            description: 'All endpoints responsive'
        },
        {
            label: 'File Storage',
            status: 'operational',
            description: 'Uploads working normally'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'operational':
            case 'connected':
            case 'running':
                return 'text-green-600';
            case 'degraded':
                return 'text-yellow-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'operational':
            case 'connected':
            case 'running':
                return (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                );
            case 'degraded':
                return (
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                );
            case 'down':
                return (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                );
            default:
                return (
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                );
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
                {statusItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div>
                            <span className="text-gray-600">{item.label}</span>
                            <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(item.status)}
                            <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemStatus;