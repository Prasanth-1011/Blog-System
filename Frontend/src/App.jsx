import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import Layout from './components/common/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Public pages
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Categories from './pages/Categories';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected pages
import Dashboard from './pages/user/Dashboard';
import MyBlogs from './pages/user/MyBlogs';
import Bookmarks from './pages/user/Bookmarks';
import Drafts from './pages/user/Drafts';
import WriteBlog from './pages/user/WriteBlog';
import EditBlog from './pages/user/EditBlog';
import Profile from './pages/user/Profile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import BlogManagement from './pages/admin/BlogManagement';
import AdminRequests from './pages/admin/AdminRequests';
import CategoryManagement from './pages/admin/CategoryManagement';

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false, requireRoot = false }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-96">
                    <LoadingSpinner size="lg" />
                </div>
            </Layout>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    if (requireRoot && !user?.root) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Public Route component (redirect authenticated users)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-96">
                    <LoadingSpinner size="lg" />
                </div>
            </Layout>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <BlogProvider>
                    <div className="App">
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Layout><Home /></Layout>} />
                            <Route path="/blogs" element={<Layout><Blogs /></Layout>} />
                            <Route path="/blogs/:id" element={<Layout><BlogDetail /></Layout>} />
                            <Route path="/categories" element={<Layout><Categories /></Layout>} />

                            {/* Auth routes */}
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <Layout><Login /></Layout>
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <PublicRoute>
                                        <Layout><Register /></Layout>
                                    </PublicRoute>
                                }
                            />

                            {/* User routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Layout><Dashboard /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-blogs"
                                element={
                                    <ProtectedRoute>
                                        <Layout><MyBlogs /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/bookmarks"
                                element={
                                    <ProtectedRoute>
                                        <Layout><Bookmarks /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/drafts"
                                element={
                                    <ProtectedRoute>
                                        <Layout><Drafts /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/write"
                                element={
                                    <ProtectedRoute>
                                        <Layout><WriteBlog /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/edit/:id"
                                element={
                                    <ProtectedRoute>
                                        <Layout><EditBlog /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Layout><Profile /></Layout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin routes */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <Layout><AdminDashboard /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <Layout><UserManagement /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/blogs"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <Layout><BlogManagement /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/requests"
                                element={
                                    <ProtectedRoute requireRoot>
                                        <Layout><AdminRequests /></Layout>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/categories"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <Layout><CategoryManagement /></Layout>
                                    </ProtectedRoute>
                                }
                            />

                            {/* 404 route */}
                            <Route path="*" element={<Layout><div className="text-center py-12">404 - Page Not Found</div></Layout>} />
                        </Routes>

                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                                success: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: '#10B981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    duration: 5000,
                                    iconTheme: {
                                        primary: '#EF4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </div>
                </BlogProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;