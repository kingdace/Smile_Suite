import { useState, cloneElement } from "react";
import { usePermissions } from "@/Hooks/usePermissions";
import PermissionDeniedModal from "./PermissionDeniedModal";
import { Lock } from "lucide-react";

const ProtectedRoute = ({
    permission,
    children,
    fallback,
    showLockIcon = true,
    isButton = false, // New prop to distinguish button clicks from navigation
}) => {
    const { hasPermission } = usePermissions();
    const [showModal, setShowModal] = useState(false);

    if (!hasPermission(permission)) {
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
                        permission={permission}
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
