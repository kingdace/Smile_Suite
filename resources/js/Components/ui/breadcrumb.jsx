import * as React from "react";

export const Breadcrumb = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <nav ref={ref} className={`flex ${className || ""}`} {...props}>
            <ol className="flex items-center space-x-2">{children}</ol>
        </nav>
    )
);
Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbItem = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <li
            ref={ref}
            className={`inline-flex items-center ${className || ""}`}
            {...props}
        >
            {children}
        </li>
    )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <a
            ref={ref}
            className={`text-sm font-medium text-gray-500 hover:text-gray-700 ${
                className || ""
            }`}
            {...props}
        >
            {children}
        </a>
    )
);
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbSeparator = React.forwardRef(
    ({ className, ...props }, ref) => (
        <svg
            ref={ref}
            className={`h-5 w-5 flex-shrink-0 text-gray-400 ${className || ""}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            {...props}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
            />
        </svg>
    )
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
