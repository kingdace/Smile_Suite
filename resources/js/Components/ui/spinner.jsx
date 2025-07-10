import * as React from "react";

export const Spinner = React.forwardRef(
    ({ className, size = "default", ...props }, ref) => {
        const sizes = {
            default: "h-5 w-5",
            sm: "h-4 w-4",
            lg: "h-6 w-6",
        };

        return (
            <svg
                ref={ref}
                className={`animate-spin text-gray-400 ${sizes[size]} ${
                    className || ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                {...props}
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        );
    }
);
Spinner.displayName = "Spinner";
