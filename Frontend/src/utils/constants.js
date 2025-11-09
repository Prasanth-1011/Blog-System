export const BLOG_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
};

export const USER_STATUS = {
    PENDING: 'pending',
    ACTIVE: 'active',
    SUSPENDED: 'suspended'
};

export const ADMIN_REQUEST_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const ROLES = {
    USER: 'user',
    ADMIN: 'admin'
};

export const COMMENT_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

export const NAVIGATION = {
    PUBLIC: [
        { name: 'Home', href: '/', icon: 'Home' },
        { name: 'Blogs', href: '/blogs', icon: 'BookOpen' },
        { name: 'Categories', href: '/categories', icon: 'Tag' },
    ],
    USER: [
        { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
        { name: 'My Blogs', href: '/my-blogs', icon: 'FileText' },
        { name: 'Bookmarks', href: '/bookmarks', icon: 'Bookmark' },
        { name: 'Drafts', href: '/drafts', icon: 'Edit' },
    ],
    ADMIN: [
        { name: 'Admin Dashboard', href: '/admin', icon: 'Settings' },
        { name: 'User Management', href: '/admin/users', icon: 'Users' },
        { name: 'Blog Management', href: '/admin/blogs', icon: 'FileText' },
        { name: 'Admin Requests', href: '/admin/requests', icon: 'Shield' },
        { name: 'Categories', href: '/admin/categories', icon: 'Tags' },
    ]
};