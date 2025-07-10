import * as React from "react";

export const Alert = React.forwardRef(
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
                className={`rounded-lg p-4 ${variants[variant]} ${
                    className || ""
                }`}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Alert.displayName = "Alert";

export const AlertTitle = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <h5
            ref={ref}
            className={`mb-1 font-medium ${className || ""}`}
            {...props}
        >
            {children}
        </h5>
    )
);
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={`text-sm ${className || ""}`} {...props}>
            {children}
        </div>
    )
);
AlertDescription.displayName = "AlertDescription";
