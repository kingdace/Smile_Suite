import * as React from "react";

export const Toast = React.forwardRef(
    ({ className, variant = "default", children, ...props }, ref) => {
        const variants = {
            default: "bg-white text-gray-900",
            success: "bg-green-50 text-green-800",
            error: "bg-red-50 text-red-800",
            warning: "bg-yellow-50 text-yellow-800",
        };

        return (
            <div
                ref={ref}
                className={`rounded-lg p-4 shadow-lg ${variants[variant]} ${
                    className || ""
                }`}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Toast.displayName = "Toast";

export const ToastTitle = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <h3
            ref={ref}
            className={`text-sm font-medium ${className || ""}`}
            {...props}
        >
            {children}
        </h3>
    )
);
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <p ref={ref} className={`mt-1 text-sm ${className || ""}`} {...props}>
            {children}
        </p>
    )
);
ToastDescription.displayName = "ToastDescription";

export const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
    <button
        ref={ref}
        className={`ml-auto inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            className || ""
        }`}
        {...props}
    >
        <span className="sr-only">Close</span>
        <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    </button>
));
ToastClose.displayName = "ToastClose";
