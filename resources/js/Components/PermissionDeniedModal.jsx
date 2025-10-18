import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Shield, Lock, ArrowRight, Users, AlertCircle } from "lucide-react";
import { usePage } from "@inertiajs/react";

const PermissionDeniedModal = ({ permission, isOpen, onClose }) => {
    const { auth } = usePage().props;
    const permissionInfo = {
        view_patients: {
            displayName: "View Patients",
            description: "Access patient records and information",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        add_patients: {
            displayName: "Add Patients",
            description: "Create new patient records",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        edit_patients: {
            displayName: "Edit Patients",
            description: "Modify patient information",
            requiredRole: "Clinic Admin, Dentist",
            icon: Users,
            color: "orange",
        },
        delete_patients: {
            displayName: "Delete Patients",
            description: "Remove patient records",
            requiredRole: "Clinic Admin only",
            icon: Users,
            color: "red",
        },
        view_appointments: {
            displayName: "View Appointments",
            description: "Access appointment schedules and information",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        create_appointments: {
            displayName: "Create Appointments",
            description: "Schedule new appointments",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        edit_appointments: {
            displayName: "Edit Appointments",
            description: "Modify appointment details",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        delete_appointments: {
            displayName: "Delete Appointments",
            description: "Cancel or remove appointments",
            requiredRole: "Clinic Admin, Dentist",
            icon: Users,
            color: "orange",
        },
        assign_dentists: {
            displayName: "Assign Dentists",
            description: "Assign dentists to appointments",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        view_treatments: {
            displayName: "View Treatments",
            description: "Access treatment records and history",
            requiredRole: "Clinic Admin, Dentist",
            icon: Users,
            color: "blue",
        },
        create_treatments: {
            displayName: "Create Treatments",
            description: "Create new treatment plans",
            requiredRole: "Clinic Admin, Dentist",
            icon: Users,
            color: "orange",
        },
        edit_treatments: {
            displayName: "Edit Treatments",
            description: "Modify treatment records",
            requiredRole: "Clinic Admin, Dentist",
            icon: Users,
            color: "orange",
        },
        delete_treatments: {
            displayName: "Delete Treatments",
            description: "Remove treatment records",
            requiredRole: "Clinic Admin, Dentist",
            icon: Users,
            color: "red",
        },
        view_inventory: {
            displayName: "View Inventory",
            description: "Access inventory and stock information",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        add_inventory: {
            displayName: "Add Inventory",
            description: "Add new inventory items",
            requiredRole: "Clinic Admin, Staff",
            icon: Users,
            color: "orange",
        },
        edit_inventory: {
            displayName: "Edit Inventory",
            description: "Modify inventory information",
            requiredRole: "Clinic Admin, Staff",
            icon: Users,
            color: "orange",
        },
        delete_inventory: {
            displayName: "Delete Inventory",
            description: "Remove inventory items",
            requiredRole: "Clinic Admin only",
            icon: Users,
            color: "red",
        },
        view_payments: {
            displayName: "View Payments",
            description: "Access payment records and financial information",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        process_payments: {
            displayName: "Process Payments",
            description: "Process and manage payments",
            requiredRole: "Clinic Admin, Staff",
            icon: Users,
            color: "orange",
        },
        refund_payments: {
            displayName: "Refund Payments",
            description: "Process payment refunds",
            requiredRole: "Clinic Admin only",
            icon: Users,
            color: "red",
        },
        view_services: {
            displayName: "View Services",
            description: "Access service catalog and information",
            requiredRole: "All roles",
            icon: Users,
            color: "blue",
        },
        manage_services: {
            displayName: "Manage Services",
            description: "Create, edit, and delete clinic services",
            requiredRole: "Clinic Admin only",
            icon: Users,
            color: "red",
        },
        manage_suppliers: {
            displayName: "Manage Suppliers",
            description: "Create, edit, and delete supplier information",
            requiredRole: "Clinic Admin, Staff",
            icon: Users,
            color: "orange",
        },
        manage_dentist_schedules: {
            displayName: "Manage Dentist Schedules",
            description: "Create, edit, and delete dentist schedules",
            requiredRole: "Clinic Admin, Dentist",
            icon: Users,
            color: "orange",
        },
        clinic_admin: {
            displayName: "Clinic Admin Access",
            description:
                "Access to subscription management and administrative features",
            requiredRole: "Clinic Admin only",
            icon: Shield,
            color: "purple",
        },
    };

    const info = permissionInfo[permission] || {
        displayName: "Unknown Permission",
        description: "Access to this feature",
        requiredRole: "Contact administrator",
        icon: Lock,
        color: "gray",
    };

    const IconComponent = info.icon;

    const getColorClasses = (color) => {
        const colorMap = {
            blue: {
                bg: "bg-blue-50",
                border: "border-blue-200",
                icon: "text-blue-600",
                badge: "bg-blue-100 text-blue-800",
                accent: "text-blue-600",
            },
            orange: {
                bg: "bg-orange-50",
                border: "border-orange-200",
                icon: "text-orange-600",
                badge: "bg-orange-100 text-orange-800",
                accent: "text-orange-600",
            },
            red: {
                bg: "bg-red-50",
                border: "border-red-200",
                icon: "text-red-600",
                badge: "bg-red-100 text-red-800",
                accent: "text-red-600",
            },
            purple: {
                bg: "bg-purple-50",
                border: "border-purple-200",
                icon: "text-purple-600",
                badge: "bg-purple-100 text-purple-800",
                accent: "text-purple-600",
            },
            gray: {
                bg: "bg-gray-50",
                border: "border-gray-200",
                icon: "text-gray-600",
                badge: "bg-gray-100 text-gray-800",
                accent: "text-gray-600",
            },
        };
        return colorMap[color] || colorMap.gray;
    };

    const colors = getColorClasses(info.color);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm mx-auto px-6 py-6">
                {/* Header with Icon and Title - Compact & Centered */}
                <div className="flex flex-col items-center text-center space-y-3 mb-5">
                    <div
                        className={`w-14 h-14 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center shadow-sm`}
                    >
                        <IconComponent className={`w-7 h-7 ${colors.icon}`} />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Access Restricted
                        </DialogTitle>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            You need additional permissions
                        </p>
                    </div>
                </div>

                {/* Permission Info Card - Compact & Centered */}
                <div
                    className={`${colors.bg} ${colors.border} border rounded-xl p-4 mb-4 mx-auto max-w-xs`}
                >
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div
                            className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}
                        >
                            <IconComponent
                                className={`w-4 h-4 ${colors.icon}`}
                            />
                        </div>
                        <div className="space-y-1">
                            <h4
                                className={`font-semibold ${colors.accent} text-sm`}
                            >
                                {info.displayName}
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                {info.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Role Requirement - Compact & Centered */}
                <div className="flex flex-col items-center space-y-1 mb-5">
                    <span className="text-xs text-gray-500 font-medium">
                        Required Role
                    </span>
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.badge} shadow-sm`}
                    >
                        {info.requiredRole}
                    </span>
                </div>

                {/* Action Buttons - Compact & Centered */}
                <DialogFooter className="flex flex-col items-center space-y-2">
                    <Button
                        onClick={() => {
                            const clinicId =
                                auth.user?.clinic_id || auth.clinic_id;
                            if (clinicId) {
                                window.location.href = `/clinic/${clinicId}/dashboard`;
                            } else {
                                window.location.href = "/dashboard";
                            }
                        }}
                        className="w-full max-w-xs h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                    >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Go to Dashboard
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full max-w-xs h-10 border-gray-300 hover:bg-gray-50 flex items-center justify-center"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PermissionDeniedModal;
