import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "default", className = "" }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
    };

    return (
        <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
    );
}

export function LoadingButton({
    loading = false,
    children,
    loadingText = "Loading...",
    className = "",
    ...props
}) {
    return (
        <button
            {...props}
            disabled={loading}
            className={`relative ${className}`}
        >
            {loading && (
                <LoadingSpinner
                    size="sm"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                />
            )}
            <span className={loading ? "ml-6" : ""}>
                {loading ? loadingText : children}
            </span>
        </button>
    );
}

export function ProgressBar({
    progress = 0,
    className = "",
    showPercentage = true,
}) {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
            {showPercentage && (
                <div className="text-xs text-gray-600 mt-1 text-center">
                    {Math.round(progress)}%
                </div>
            )}
        </div>
    );
}
