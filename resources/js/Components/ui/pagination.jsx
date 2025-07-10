import * as React from "react";

export const Pagination = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <nav
            ref={ref}
            className={`flex items-center justify-between ${className || ""}`}
            {...props}
        >
            {children}
        </nav>
    )
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`flex items-center space-x-2 ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`inline-flex items-center ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
);
PaginationItem.displayName = "PaginationItem";

export const PaginationLink = React.forwardRef(
    ({ className, children, active, ...props }, ref) => (
        <a
            ref={ref}
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${
                active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
            } ${className || ""}`}
            {...props}
        >
            {children}
        </a>
    )
);
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <a
            ref={ref}
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                className || ""
            }`}
            {...props}
        >
            <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            {children}
        </a>
    )
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <a
            ref={ref}
            className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                className || ""
            }`}
            {...props}
        >
            {children}
            <svg
                className="ml-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
            </svg>
        </a>
    )
);
PaginationNext.displayName = "PaginationNext";
