import * as React from "react";

export const Tabs = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`border-b border-gray-200 ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
);
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`flex space-x-8 ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef(
    ({ className, children, active, ...props }, ref) => (
        <button
            ref={ref}
            className={`border-b-2 px-1 pb-4 text-sm font-medium ${
                active
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } ${className || ""}`}
            {...props}
        >
            {children}
        </button>
    )
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={`mt-4 ${className || ""}`} {...props}>
            {children}
        </div>
    )
);
TabsContent.displayName = "TabsContent";
