import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import { Shield, Search, User, Calendar, Check, X } from 'lucide-react';
import { formatDate, formatRelativeTime, capitalize } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [reviewLoading, setReviewLoading] = useState(null);
    const [reviewNotes, setReviewNotes] = useState({});

    useEffect(() => {
        loadRequests();
    }, [statusFilter]);

    const loadRequests = async () => {
        try {
            const params = statusFilter ? { status: statusFilter } : {};
            const response = await adminAPI.getAdminRequests(params);
            setRequests(response.data.data.requests);
        } catch (error) {
            console.error('Error loading admin requests:', error);
            toast.error('Failed to load admin requests');
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (requestId, status) => {
        if (status === 'rejected' && !reviewNotes[requestId]?.trim()) {
            toast.error('Please provide review notes for rejection');
            return;
        }

        setReviewLoading(requestId);
        try {
            await adminAPI.reviewAdminRequest(requestId, {
                status,
                reviewNotes: reviewNotes[requestId] || ''
            });
            toast.success(`Request ${status} successfully`);
            loadRequests(); // Reload requests
        } catch (error) {
            console.error('Error reviewing request:', error);
            toast.error('Failed to review request');
        } finally {
            setReviewLoading(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Requests</h1>
                    <p className="text-gray-600">Review and manage admin access requests</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="pending">Pending Requests</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="">All Requests</option>
                        </select>
                        <div className="text-sm text-gray-600">
                            {requests.length} request(s) found
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : requests.length > 0 ? (
                    <div className="space-y-6">
                        {requests.map((request) => (
                            <div key={request._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                    {/* Request Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                                <User className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {request.user?.name}
                                                    </h3>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                        {capitalize(request.status)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-3">{request.user?.email}</p>
                                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                    <p className="text-gray-700">{request.reason}</p>
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Requested {formatRelativeTime(request.createdAt)}</span>
                                                    </div>
                                                    {request.reviewedBy && (
                                                        <div className="flex items-center space-x-1">
                                                            <Shield className="w-4 h-4" />
                                                            <span>Reviewed by {request.reviewedBy?.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {request.reviewNotes && (
                                                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                        <p className="text-sm text-yellow-800">
                                                            <strong>Review Notes:</strong> {request.reviewNotes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {request.status === 'pending' && (
                                        <div className="lg:ml-6 mt-4 lg:mt-0 shrink-0">
                                            <div className="space-y-3">
                                                <button
                                                    onClick={() => handleReview(request._id, 'approved')}
                                                    disabled={reviewLoading === request._id}
                                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                                >
                                                    {reviewLoading === request._id ? (
                                                        <LoadingSpinner size="sm" />
                                                    ) : (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                    <span>Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (!reviewNotes[request._id]) {
                                                            setReviewNotes(prev => ({
                                                                ...prev,
                                                                [request._id]: ''
                                                            }));
                                                        } else {
                                                            handleReview(request._id, 'rejected');
                                                        }
                                                    }}
                                                    disabled={reviewLoading === request._id}
                                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                                >
                                                    {reviewLoading === request._id ? (
                                                        <LoadingSpinner size="sm" />
                                                    ) : (
                                                        <X className="w-4 h-4" />
                                                    )}
                                                    <span>Reject</span>
                                                </button>
                                            </div>

                                            {/* Rejection Notes */}
                                            {reviewNotes[request._id] !== undefined && (
                                                <div className="mt-3">
                                                    <textarea
                                                        value={reviewNotes[request._id] || ''}
                                                        onChange={(e) => setReviewNotes(prev => ({
                                                            ...prev,
                                                            [request._id]: e.target.value
                                                        }))}
                                                        placeholder="Provide reason for rejection..."
                                                        rows="3"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                                                    />
                                                    <div className="flex items-center space-x-2 mt-2">
                                                        <button
                                                            onClick={() => handleReview(request._id, 'rejected')}
                                                            disabled={!reviewNotes[request._id]?.trim() || reviewLoading === request._id}
                                                            className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Submit Rejection
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setReviewNotes(prev => {
                                                                    const newNotes = { ...prev };
                                                                    delete newNotes[request._id];
                                                                    return newNotes;
                                                                });
                                                            }}
                                                            className="px-3 py-1 text-gray-600 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests found</h3>
                        <p className="text-gray-600">
                            {statusFilter === 'pending'
                                ? 'No pending admin requests at the moment'
                                : `No ${statusFilter} requests found`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRequests;