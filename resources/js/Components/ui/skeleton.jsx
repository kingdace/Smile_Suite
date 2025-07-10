import * as React from "react";

export const Skeleton = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={`animate-pulse rounded-md bg-gray-200 ${className || ""}`}
        {...props}
    />
));
Skeleton.displayName = "Skeleton";
