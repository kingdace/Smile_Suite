import * as React from "react";

export const Tooltip = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`relative inline-block ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
);
Tooltip.displayName = "Tooltip";

export const TooltipTrigger = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={`inline-block ${className || ""}`} {...props}>
            {children}
        </div>
    )
);
TooltipTrigger.displayName = "TooltipTrigger";

export const TooltipContent = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`absolute z-50 mt-2 rounded-md bg-gray-900 px-3 py-2 text-sm text-white shadow-lg ${
                className || ""
            }`}
            {...props}
        >
            {children}
        </div>
    )
);
TooltipContent.displayName = "TooltipContent";
