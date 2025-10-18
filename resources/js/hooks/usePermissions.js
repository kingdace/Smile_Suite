import { usePage } from "@inertiajs/react";

export const usePermissions = () => {
    const { auth } = usePage().props;

    const hasPermission = (permission) => {
        return auth.user?.permissions?.includes(permission) || false;
    };

    const hasAnyPermission = (permissions) => {
        return permissions.some((permission) => hasPermission(permission));
    };

    const hasAllPermissions = (permissions) => {
        return permissions.every((permission) => hasPermission(permission));
    };

    return { hasPermission, hasAnyPermission, hasAllPermissions };
};
