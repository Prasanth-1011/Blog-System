import React, { createContext, useState, useContext } from 'react';
import { blogAPI } from '../services/api';

const BlogContext = createContext();

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlog must be used within a BlogProvider');
    }
    return context;
};

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [featuredBlogs, setFeaturedBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({});

    // Blog actions
    const fetchBlogs = async (params = {}) => {
        setLoading(true);
        try {
            const response = await blogAPI.getBlogs(params);
            setBlogs(response.data.data.blogs);
            setPagination(response.data.data.pagination);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch blogs'
            };
        } finally {
            setLoading(false);
        }
    };

    const fetchFeaturedBlogs = async () => {
        try {
            const response = await blogAPI.getBlogs({ featured: 'true', limit: 3 });
            setFeaturedBlogs(response.data.data.blogs);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch featured blogs'
            };
        }
    };

    const fetchBlog = async (id) => {
        setLoading(true);
        try {
            const response = await blogAPI.getBlog(id);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch blog'
            };
        } finally {
            setLoading(false);
        }
    };

    const createBlog = async (blogData) => {
        try {
            const response = await blogAPI.createBlog(blogData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to create blog'
            };
        }
    };

    const updateBlog = async (id, blogData) => {
        try {
            const response = await blogAPI.updateBlog(id, blogData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to update blog'
            };
        }
    };

    const deleteBlog = async (id) => {
        try {
            await blogAPI.deleteBlog(id);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to delete blog'
            };
        }
    };

    const likeBlog = async (id) => {
        try {
            const response = await blogAPI.likeBlog(id);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to like blog'
            };
        }
    };

    const bookmarkBlog = async (id) => {
        try {
            const response = await blogAPI.bookmarkBlog(id);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to bookmark blog'
            };
        }
    };

    const fetchDraftBlogs = async () => {
        try {
            const response = await blogAPI.getDraftBlogs();
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch draft blogs'
            };
        }
    };

    // Category actions - ADDED THIS FUNCTION
    const fetchCategories = async () => {
        try {
            const response = await blogAPI.getCategories();
            setCategories(response.data.data);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Failed to fetch categories'
            };
        }
    };

    const value = {
        // State
        blogs,
        featuredBlogs,
        categories,
        loading,
        pagination,

        // Blog actions
        fetchBlogs,
        fetchFeaturedBlogs,
        fetchBlog,
        createBlog,
        updateBlog,
        deleteBlog,
        likeBlog,
        bookmarkBlog,
        fetchDraftBlogs,

        // Category actions - ADDED THIS
        fetchCategories
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};