import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            getCurrentUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const getCurrentUser = async () => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data.data);
        } catch (error) {
            console.error('Get current user error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { data, token: newToken } = response.data.data;

            setUser(data);
            setToken(newToken);
            localStorage.setItem('token', newToken);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { data, token: newToken } = response.data.data;

            setUser(data);
            setToken(newToken);
            localStorage.setItem('token', newToken);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            setUser(response.data.data);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const requestAdminAccess = async (reason) => {
        try {
            const response = await adminAPI.createAdminRequest(reason);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Admin request failed'
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        requestAdminAccess,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isRoot: user?.root === true
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};