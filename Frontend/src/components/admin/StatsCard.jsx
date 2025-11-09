import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';

const StatsCard = ({ icon: Icon, label, value, change, color }) => {
    const isPositive = change > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
                    <p className="text-gray-600 text-sm mt-1">{label}</p>
                    {change !== undefined && (
                        <div className={`flex items-center space-x-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            <span>{Math.abs(change)}% from last week</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;