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
            className={`relative inline-flex items-center justify-center ${className}`}
        >
            {loading ? (
                <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    <span>{loadingText}</span>
                </>
            ) : (
                children
            )}
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
