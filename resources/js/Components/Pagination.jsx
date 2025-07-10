import React from "react";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export default function Pagination({ links, className = "" }) {
    if (!links || links.length <= 3) {
        return null; // Don't render pagination if there are 3 or fewer links (prev, 1, next) which means only one page
    }

    const filteredLinks = links.filter((link) => link.url !== null);

    return (
        <nav
            className={cn(
                "flex justify-center -space-x-px rounded-md shadow-sm",
                className
            )}
            aria-label="Pagination"
        >
            {filteredLinks.map((link, key) => (
                <Link
                    key={key}
                    href={link.url || "#"}
                    className={cn(
                        "relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                        link.active
                            ? "z-10 bg-blue-600 text-white focus-visible:outline-blue-600"
                            : "text-gray-900 hover:bg-gray-50",
                        key === 0 ? "rounded-l-md" : "",
                        key === filteredLinks.length - 1 ? "rounded-r-md" : "",
                        link.url === null ? "cursor-not-allowed opacity-50" : "" // Disable if url is null
                    )}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    preserveScroll
                />
            ))}
        </nav>
    );
}
