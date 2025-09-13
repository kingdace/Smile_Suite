import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({
    id,
    type = "info",
    title,
    message,
    duration = 5000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
    };

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    };

    const colors = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    const Icon = icons[type];

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 ${colors[type]} transform transition-all duration-300 ease-in-out`}
            style={{
                transform: isVisible ? "translateX(0)" : "translateX(100%)",
                opacity: isVisible ? 1 : 0,
            }}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        {title && (
                            <p className="text-sm font-medium">{title}</p>
                        )}
                        {message && <p className="text-sm mt-1">{message}</p>}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={handleClose}
                            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ToastContainer = ({ toasts, onRemoveToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} {...toast} onClose={onRemoveToast} />
            ))}
        </div>
    );
};

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { ...toast, id }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const showSuccess = (title, message) => {
        addToast({ type: "success", title, message });
    };

    const showError = (title, message) => {
        addToast({ type: "error", title, message });
    };

    const showWarning = (title, message) => {
        addToast({ type: "warning", title, message });
    };

    const showInfo = (title, message) => {
        addToast({ type: "info", title, message });
    };

    return {
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };
};
