import { useState, cloneElement } from "react";
import { usePage } from "@inertiajs/react";
import { usePermissions } from "@/hooks/usePermissions";
import PermissionDeniedModal from "./PermissionDeniedModal";
import { Lock } from "lucide-react";

const ProtectedRoute = ({
    permission,
    role,
    children,
    fallback,
    showLockIcon = true,
    isButton = false, // New prop to distinguish button clicks from navigation
}) => {
    const { hasPermission, hasRole } = usePermissions();
    const [showModal, setShowModal] = useState(false);

    // Safety check for functions
    if (typeof hasRole !== "function" || typeof hasPermission !== "function") {
        return children; // Return children without protection if functions are not available
    }

    // Check permission or role
    const hasAccess = permission
        ? hasPermission(permission)
        : role
        ? hasRole(role)
        : true;

    // Temporary debug - remove after testing
    if (role === "clinic_admin") {
        console.log("ProtectedRoute access check:", {
            role,
            hasAccess,
            hasRoleResult: hasRole(role),
            userRole: usePage().props.auth?.user?.role,
        });
    }

    if (!hasAccess) {
        if (fallback) {
            return fallback;
        }

        // For button clicks, show modal only
        if (isButton) {
            // Clone the children and override the onClick handler
            const protectedChildren = cloneElement(children, {
                onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowModal(true);
                },
                className: `${
                    children.props.className || ""
                } opacity-50 hover:opacity-75 transition-opacity relative`,
            });

            return (
                <>
                    {protectedChildren}
                    {showLockIcon && (
                        <div className="absolute top-2 right-2 pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                    )}
                    <PermissionDeniedModal
                        permission={permission || role}
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                    />
                </>
            );
        }

        // For navigation links, redirect to permission denied page
        return (
            <>
                <div
                    className="cursor-pointer opacity-50 hover:opacity-75 transition-opacity relative"
                    onClick={() => {
                        // Store intended URL and redirect to permission denied page
                        const currentUrl = window.location.href;
                        window.location.href = `/permission-denied/${permission}?intended=${encodeURIComponent(
                            currentUrl
                        )}`;
                    }}
                >
                    {children}
                    {showLockIcon && (
                        <div className="absolute top-2 right-2">
                            <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                    )}
                </div>
            </>
        );
    }

    return children;
};

export default ProtectedRoute;
