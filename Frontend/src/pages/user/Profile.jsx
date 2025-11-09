import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Edit, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        profilePicture: user?.profilePicture || ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await updateProfile(formData);
        if (result.success) {
            toast.success('Profile updated successfully');
            setEditMode(false);
        } else {
            toast.error(result.error);
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            bio: user?.bio || '',
            profilePicture: user?.profilePicture || ''
        });
        setEditMode(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                    {!editMode && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                {formData.profilePicture ? (
                                    <img
                                        src={formData.profilePicture}
                                        alt={formData.name}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-blue-600" />
                                )}
                            </div>
                            {editMode && (
                                <button className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                                    <Camera className="w-3 h-3 text-white" />
                                </button>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user?.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {user?.role}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user?.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : user?.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                    {user?.status}
                                </span>
                                {user?.root && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                        Root Admin
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows="4"
                                value={formData.bio}
                                onChange={handleChange}
                                disabled={!editMode}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                            />
                        </div>

                        {/* Profile Picture URL */}
                        {editMode && (
                            <div>
                                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Picture URL
                                </label>
                                <input
                                    type="url"
                                    id="profilePicture"
                                    name="profilePicture"
                                    value={formData.profilePicture}
                                    onChange={handleChange}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        {editMode && (
                            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Account Info */}
                    {!editMode && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Member since</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(user?.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Last login</p>
                                    <p className="font-medium text-gray-900">
                                        {user?.lastLogin
                                            ? new Date(user.lastLogin).toLocaleDateString()
                                            : 'Never'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;