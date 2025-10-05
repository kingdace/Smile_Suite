import React from "react";
import { cn } from "@/lib/utils";

// Spinner Component
export const Spinner = ({ 
    size = "md", 
    className = "", 
    color = "blue" 
}) => {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6", 
        lg: "w-8 h-8",
        xl: "w-12 h-12"
    };

    const colorClasses = {
        blue: "border-blue-600 border-t-transparent",
        green: "border-green-600 border-t-transparent",
        red: "border-red-600 border-t-transparent",
        gray: "border-gray-600 border-t-transparent",
        white: "border-white border-t-transparent"
    };

    return (
        <div
            className={cn(
                "border-2 rounded-full animate-spin",
                sizeClasses[size],
                colorClasses[color],
                className
            )}
            role="status"
            aria-label="Loading"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

// Skeleton Loader Component
export const Skeleton = ({ 
    className = "", 
    variant = "default",
    lines = 1 
}) => {
    const variants = {
        default: "h-4 bg-gray-200 rounded",
        text: "h-4 bg-gray-200 rounded",
        circle: "rounded-full bg-gray-200",
        rectangle: "h-20 bg-gray-200 rounded"
    };

    if (lines > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "animate-pulse",
                            variants[variant],
                            className
                        )}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "animate-pulse",
                variants[variant],
                className
            )}
        />
    );
};

// Card Skeleton Component
export const CardSkeleton = ({ className = "" }) => (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm border", className)}>
        <div className="flex items-center space-x-4 mb-4">
            <Skeleton variant="circle" className="w-12 h-12" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
        </div>
    </div>
);

// Button Loading State
export const ButtonWithLoading = ({ 
    children, 
    loading = false, 
    loadingText = "Loading...",
    className = "",
    ...props 
}) => (
    <button
        className={cn(
            "inline-flex items-center justify-center gap-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
        )}
        disabled={loading}
        {...props}
    >
        {loading && <Spinner size="sm" color="white" />}
        {loading ? loadingText : children}
    </button>
);

// Page Loading Component
export const PageLoading = ({ message = "Loading page..." }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <Spinner size="xl" color="blue" className="mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">{message}</p>
        </div>
    </div>
);

// Inline Loading Component
export const InlineLoading = ({ message = "Loading..." }) => (
    <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
            <Spinner size="md" color="blue" />
            <span className="text-gray-600 font-medium">{message}</span>
        </div>
    </div>
);

// Shimmer Effect Component
export const Shimmer = ({ className = "" }) => (
    <div
        className={cn(
            "relative overflow-hidden",
            "before:absolute before:inset-0",
            "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
            "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
            className
        )}
    />
);

// Pulse Animation Component
export const Pulse = ({ children, className = "" }) => (
    <div
        className={cn(
            "animate-pulse",
            className
        )}
    >
        {children}
    </div>
);

// Bounce Animation Component
export const Bounce = ({ children, className = "" }) => (
    <div
        className={cn(
            "animate-bounce",
            className
        )}
    >
        {children}
    </div>
);

// Fade In Animation Component
export const FadeIn = ({ children, delay = 0, className = "" }) => (
    <div
        className={cn(
            "animate-fade-in",
            className
        )}
        style={{ animationDelay: `${delay}ms` }}
    >
        {children}
    </div>
);

// Slide In Animation Component
export const SlideIn = ({ 
    children, 
    direction = "up", 
    delay = 0, 
    className = "" 
}) => {
    const directionClasses = {
        up: "animate-slide-in-up",
        down: "animate-slide-in-down",
        left: "animate-slide-in-left",
        right: "animate-slide-in-right"
    };

    return (
        <div
            className={cn(
                directionClasses[direction],
                className
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// Loading Overlay Component
export const LoadingOverlay = ({ 
    loading = false, 
    children, 
    message = "Loading...",
    className = "" 
}) => (
    <div className={cn("relative", className)}>
        {children}
        {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="text-center">
                    <Spinner size="lg" color="blue" className="mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">{message}</p>
                </div>
            </div>
        )}
    </div>
);

// Progress Bar Component
export const ProgressBar = ({ 
    progress = 0, 
    className = "",
    showPercentage = true,
    color = "blue"
}) => {
    const colorClasses = {
        blue: "bg-blue-600",
        green: "bg-green-600",
        red: "bg-red-600",
        yellow: "bg-yellow-600"
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                {showPercentage && (
                    <span className="text-sm font-medium text-gray-700">
                        {Math.round(progress)}%
                    </span>
                )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={cn(
                        "h-2 rounded-full transition-all duration-300 ease-out",
                        colorClasses[color]
                    )}
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
            </div>
        </div>
    );
};

// Loading Dots Component
export const LoadingDots = ({ className = "" }) => (
    <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
            />
        ))}
    </div>
);

// Skeleton Table Component
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
    <div className="overflow-hidden rounded-lg border">
        <div className="bg-gray-50 px-6 py-3 border-b">
            <div className="flex space-x-4">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-24" />
                ))}
            </div>
        </div>
        <div className="divide-y">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="px-6 py-4">
                    <div className="flex space-x-4">
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <Skeleton key={colIndex} className="h-4 w-20" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Loading States for Different Components
export const AppointmentCardSkeleton = () => (
    <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <Skeleton variant="circle" className="w-4 h-4" />
                <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
        </div>
    </div>
);

export const StatCardSkeleton = () => (
    <div className="bg-gradient-to-br from-blue-50/90 via-white/80 to-cyan-100/60 backdrop-blur-sm rounded-xl shadow-lg border border-blue-200/50 p-4">
        <div className="flex items-center justify-between mb-3">
            <Skeleton variant="circle" className="w-10 h-10" />
            <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-16 mb-1" />
        <Skeleton className="h-4 w-24" />
    </div>
);

export const QuickActionSkeleton = () => (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 rounded-xl">
        <Skeleton variant="circle" className="w-10 h-10 sm:w-12 sm:h-12" />
        <div className="flex-1 text-center sm:text-left space-y-1">
            <Skeleton className="h-4 w-16 mx-auto sm:mx-0" />
            <Skeleton className="h-3 w-20 mx-auto sm:mx-0 hidden sm:block" />
        </div>
    </div>
);
