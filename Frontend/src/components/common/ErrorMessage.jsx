import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
    return (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1">
                    <p className="text-red-800 text-sm">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-2 text-red-700 hover:text-red-800 text-sm font-medium underline"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;