import React from 'react';
import { Ban, Shield, MoreVertical } from 'lucide-react';
import { formatDate, capitalize } from '../../utils/helpers';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const UserTable = ({ users, onUpdate }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role) => {
        return role === 'admin'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800';
    };

    const handleStatusUpdate = async (userId, newStatus) => {
        try {
            await adminAPI.updateUserStatus(userId, newStatus);
            toast.success(`User ${newStatus} successfully`);
            onUpdate(); // Refresh the user list
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error('Failed to update user status');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {user.name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                        {capitalize(user.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                            {capitalize(user.role)}
                                        </span>
                                        {user.root && (
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                Root
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                        {!user.root && user.status === 'active' && (
                                            <button
                                                onClick={() => handleStatusUpdate(user._id, 'suspended')}
                                                className="text-red-600 hover:text-red-900 p-1"
                                                title="Suspend User"
                                            >
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        )}
                                        {!user.root && user.status === 'suspended' && (
                                            <button
                                                onClick={() => handleStatusUpdate(user._id, 'active')}
                                                className="text-green-600 hover:text-green-900 p-1"
                                                title="Activate User"
                                            >
                                                <Shield className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;