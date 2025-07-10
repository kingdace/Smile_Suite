import * as React from "react";

export const Accordion = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`divide-y divide-gray-200 ${className || ""}`}
            {...props}
        >
            {children}
        </div>
    )
);
Accordion.displayName = "Accordion";

export const AccordionItem = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div ref={ref} className={`${className || ""}`} {...props}>
            {children}
        </div>
    )
);
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <button
            ref={ref}
            className={`flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 ${
                className || ""
            }`}
            {...props}
        >
            {children}
            <svg
                className="h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        </button>
    )
);
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={`overflow-hidden text-sm text-gray-500 ${
                className || ""
            }`}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
);
AccordionContent.displayName = "AccordionContent";
