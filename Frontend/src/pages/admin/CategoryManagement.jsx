import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Tag, Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatDate, formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await adminAPI.getCategories();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setFormLoading(true);
        try {
            if (editingCategory) {
                await adminAPI.updateCategory(editingCategory._id, formData);
                toast.success('Category updated successfully');
            } else {
                await adminAPI.createCategory(formData);
                toast.success('Category created successfully');
            }
            setShowForm(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            loadCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error.response?.data?.message || 'Failed to save category');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            await adminAPI.deleteCategory(categoryId);
            toast.success('Category deleted successfully');
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || ''
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
                        <p className="text-gray-600">Manage blog categories and topics</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Category</span>
                    </button>
                </div>

                {/* Category Form */}
                {showForm && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {editingCategory ? 'Edit Category' : 'Create New Category'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="Enter category description (optional)"
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {formLoading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Tag className="w-4 h-4" />
                                    )}
                                    <span>{editingCategory ? 'Update' : 'Create'} Category</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : categories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Tag className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {formatNumber(category.blogCount || 0)} blogs
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="Edit Category"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category._id)}
                                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete Category"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {category.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Created {formatDate(category.createdAt)}</span>
                                    <span className={`px-2 py-1 rounded-full ${category.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {category.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
                            <p className="text-gray-600 mb-6">
                                Create your first category to organize blog content
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create Category</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryManagement;