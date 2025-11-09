import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// User API
export const userAPI = {
    getProfile: (id) => api.get(`/users/profile/${id}`),
    getUserBlogs: (id, params) => api.get(`/users/${id}/blogs`, { params }),
    getUserBookmarks: () => api.get('/users/bookmarks'),
};

// Blog API
export const blogAPI = {
    getBlogs: (params) => api.get('/blogs', { params }),
    getBlog: (id) => api.get(`/blogs/${id}`),
    createBlog: (blogData) => api.post('/blogs', blogData),
    updateBlog: (id, blogData) => api.put(`/blogs/${id}`, blogData),
    deleteBlog: (id) => api.delete(`/blogs/${id}`),
    likeBlog: (id) => api.put(`/blogs/${id}/like`),
    bookmarkBlog: (id) => api.put(`/blogs/${id}/bookmark`),
    getDraftBlogs: () => api.get('/blogs/drafts/mine'),
    getCategories: () => api.get('/categories'),
};

// Comment API
export const commentAPI = {
    getBlogComments: (blogId, params) => api.get(`/comments/blog/${blogId}`, { params }),
    createComment: (commentData) => api.post('/comments', commentData),
    updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
    deleteComment: (id) => api.delete(`/comments/${id}`),
    likeComment: (id) => api.put(`/comments/${id}/like`),
    getCommentReplies: (id) => api.get(`/comments/${id}/replies`),
};

// Admin API
export const adminAPI = {
    getDashboardStats: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUserStatus: (id, status) => api.put(`/admin/users/${id}/status`, { status }),
    getAdminRequests: (params) => api.get('/admin/requests', { params }),
    createAdminRequest: (reason) => api.post('/admin/requests', { reason }),
    reviewAdminRequest: (id, data) => api.put(`/admin/requests/${id}/review`, data),
    getAdminBlogs: (params) => api.get('/admin/blogs', { params }),
    updateBlogStatus: (id, status) => api.put(`/admin/blogs/${id}/status`, { status }),
    createCategory: (categoryData) => api.post('/categories', categoryData),
    updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
    deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default api;