import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useBlog } from '../../context/BlogContext';
import { useAuth } from '../../context/AuthContext';
import { Save, Send, Eye, Tag, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditBlog = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        featuredImage: '',
        status: 'draft'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(false);

    const { fetchBlog, updateBlog } = useBlog();
    const { categories, fetchCategories } = useBlog();
    const navigate = useNavigate();

    useEffect(() => {
        loadBlog();
        fetchCategories();
    }, [id]);

    const loadBlog = async () => {
        setLoading(true);
        const result = await fetchBlog(id);
        if (result.success) {
            const blog = result.data.data;
            setFormData({
                title: blog.title,
                content: blog.content,
                excerpt: blog.excerpt || '',
                category: blog.category?._id || '',
                tags: blog.tags?.join(', ') || '',
                featuredImage: blog.featuredImage || '',
                status: blog.status
            });
        } else {
            toast.error('Failed to load blog');
            navigate('/my-blogs');
        }
        setLoading(false);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (publish = false) => {
        if (!formData.title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        if (!formData.content.trim() || formData.content === '<p><br></p>') {
            toast.error('Please enter blog content');
            return;
        }

        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }

        setSaving(true);

        const submitData = {
            ...formData,
            status: publish ? 'published' : formData.status,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        const result = await updateBlog(id, submitData);

        if (result.success) {
            toast.success(
                publish
                    ? 'Blog published successfully!'
                    : 'Blog updated successfully!'
            );
            navigate(publish ? '/my-blogs' : '/drafts');
        } else {
            toast.error(result.error);
        }

        setSaving(false);
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote', 'code-block'],
            ['link', 'image'],
            ['clean']
        ],
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Blog</h1>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Form */}
                    <div className="p-6 space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Blog Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Featured Image */}
                        <div>
                            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
                                Featured Image URL
                            </label>
                            <div className="flex space-x-3">
                                <input
                                    type="url"
                                    id="featuredImage"
                                    value={formData.featuredImage}
                                    onChange={(e) => handleChange('featuredImage', e.target.value)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {formData.featuredImage && (
                                    <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
                                        <img
                                            src={formData.featuredImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="relative">
                                <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    id="tags"
                                    value={formData.tags}
                                    onChange={(e) => handleChange('tags', e.target.value)}
                                    placeholder="technology, programming, web-development"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => handleChange('excerpt', e.target.value)}
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Content *
                            </label>
                            <ReactQuill
                                value={formData.content}
                                onChange={(content) => handleChange('content', content)}
                                modules={modules}
                                theme="snow"
                                className="bg-white rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setPreview(!preview)}
                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>{preview ? 'Hide Preview' : 'Show Preview'}</span>
                                </button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => handleSubmit(false)}
                                    disabled={saving}
                                    className="flex items-center space-x-2 px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    {saving ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Save Changes</span>
                                </button>
                                {formData.status !== 'published' && (
                                    <button
                                        onClick={() => handleSubmit(true)}
                                        disabled={saving}
                                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {saving ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        <span>Publish</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                {preview && (
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Preview</h3>
                        <div className="prose prose-lg max-w-none">
                            <h1>{formData.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditBlog;