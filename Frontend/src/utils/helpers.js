import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format date
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
};

// Format relative time
export const formatRelativeTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
};

// Truncate text
export const truncateText = (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

// Generate excerpt from HTML content
export const generateExcerpt = (html, length = 150) => {
    if (!html) return '';
    // Remove HTML tags and truncate
    const text = html.replace(/<[^>]*>/g, '');
    return truncateText(text, length);
};

// Capitalize first letter
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format number with commas
export const formatNumber = (num) => {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Get initial from name
export const getInitials = (name) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Validate email
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Get status color
export const getStatusColor = (status) => {
    const colors = {
        active: 'green',
        pending: 'yellow',
        suspended: 'red',
        published: 'green',
        draft: 'gray',
        archived: 'orange',
        approved: 'green',
        rejected: 'red'
    };
    return colors[status] || 'gray';
};

// Calculate read time
export const calculateReadTime = (content) => {
    if (!content) return 0;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200); // Assuming 200 words per minute
};