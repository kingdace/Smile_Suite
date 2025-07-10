import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import SiteHeader from "@/Components/SiteHeader";

export default function GuestLayout({ children, centered }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
            <SiteHeader />
            {centered ? (
                <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                    {children}
                </div>
            ) : (
                children
            )}
        </div>
    );
}
