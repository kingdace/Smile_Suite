import { Link } from "@inertiajs/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Custom scrollbar styles
const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #e5e7eb, #d1d5db);
        border-radius: 8px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #d1d5db, #9ca3af);
        transform: scaleX(1.3);
        box-shadow: 0 0 8px rgba(156, 163, 175, 0.3);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:active {
        background: linear-gradient(180deg, #9ca3af, #6b7280);
        transform: scaleX(1.1);
    }
    .custom-scrollbar::-webkit-scrollbar-corner {
        background: transparent;
    }
`;
import {
    LayoutDashboard,
    Users,
    Calendar,
    Stethoscope,
    Package,
    DollarSign,
    Settings,
    FileText,
    CalendarClock,
    Truck,
    ChevronDown,
    ChevronRight,
    CircleSmall,
    Scissors,
    Building2,
    UserCheck,
    Activity,
    BarChart3,
    Bell,
    Shield,
    HelpCircle,
    Sparkles,
    Zap,
    Crown,
    Star,
    Heart,
    Award,
    Target,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

const navigation = (clinicId) => [
    {
        name: "Dashboard",
        href: route("clinic.dashboard", [clinicId]),
        routeName: "clinic.dashboard",
        icon: LayoutDashboard,
        description: "Overview and statistics",
    },
    {
        name: "Patients",
        href: route("clinic.patients.index", [clinicId]),
        routeName: "clinic.patients.*",
        icon: Users,
        description: "Patient management",
    },
    {
        name: "Appointments",
        href: route("clinic.appointments.index", [clinicId]),
        routeName: "clinic.appointments.*",
        icon: Calendar,
        description: "Schedule management",
    },
    {
        name: "Dentist Schedule",
        href: route("clinic.dentist-schedules.index", [clinicId]),
        routeName: "clinic.dentist-schedules.*",
        icon: CalendarClock,
        description: "Dentist availability",
    },
    {
        name: "Treatments",
        href: route("clinic.treatments.index", [clinicId]),
        routeName: "clinic.treatments.*",
        icon: Stethoscope,
        description: "Treatment records",
    },
    {
        name: "Services",
        href: route("clinic.services.index", [clinicId]),
        routeName: "clinic.services.*",
        icon: Scissors,
        description: "Service catalog",
    },
    {
        name: "Inventory",
        href: route("clinic.inventory.index", [clinicId]),
        routeName: "clinic.inventory.*",
        icon: Package,
        description: "Stock management",
        hasDropdown: true,
        children: [
            {
                name: "Inventory Items",
                href: route("clinic.inventory.index", [clinicId]),
                routeName: "clinic.inventory.*",
                icon: Package,
                description: "Manage stock items",
            },
            {
                name: "Suppliers",
                href: route("clinic.suppliers.index", [clinicId]),
                routeName: "clinic.suppliers.*",
                icon: Truck,
                description: "Supplier directory",
            },
        ],
    },
    {
        name: "Payments",
        href: route("clinic.payments.index", [clinicId]),
        routeName: "clinic.payments.*",
        icon: DollarSign,
        description: "Financial tracking",
    },
    {
        name: "Reports",
        href: route("clinic.reports.index", [clinicId]),
        routeName: "clinic.reports.*",
        icon: BarChart3,
        description: "Analytics & insights",
    },
    {
        name: "Settings",
        href: route("clinic.settings.index", [clinicId]),
        routeName: "clinic.settings.*",
        icon: Settings,
        description: "Clinic configuration",
    },
];

export default function Sidebar({ className, auth }) {
    const clinicId = auth?.clinic?.id;
    const [expandedItems, setExpandedItems] = useState(() => {
        // Auto-expand Inventory dropdown if on inventory or suppliers pages
        const isOnInventoryPage =
            route().current("clinic.inventory.*") ||
            route().current("clinic.suppliers.*");
        return isOnInventoryPage ? new Set(["Inventory"]) : new Set();
    });

    if (!clinicId) {
        return (
            <div
                className={cn(
                    "border-r-2 border-blue-200/50 bg-white/80 backdrop-blur-sm shadow-xl",
                    className
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="flex-1 py-4 pt-10 px-2">
                        <div className="flex items-center justify-center h-32">
                            <div className="text-center">
                                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                                <p className="text-sm text-gray-500">
                                    Loading...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const sidebarNavigation = navigation(clinicId);

    const toggleDropdown = (itemName) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemName)) {
            newExpanded.delete(itemName);
        } else {
            newExpanded.add(itemName);
        }
        setExpandedItems(newExpanded);
    };

    const isItemActive = (item) => {
        return route().current(item.routeName);
    };

    const isInventoryActive = () => {
        return (
            route().current("clinic.inventory.*") ||
            route().current("clinic.suppliers.*")
        );
    };

    return (
        <>
            <style>{scrollbarStyles}</style>
            <div
                className={cn(
                    "border-r border-gray-200/60 bg-white shadow-xl",
                    className
                )}
            >
                <div className="h-full flex flex-col max-h-screen">
                    {/* Enhanced Navigation */}
                    <div className="flex-1 py-4 pt-6 px-2 overflow-y-auto custom-scrollbar">
                        <div className="space-y-1">
                            {sidebarNavigation.map((item) => {
                                const isActive = item.hasDropdown
                                    ? isInventoryActive()
                                    : isItemActive(item);
                                const isExpanded = expandedItems.has(item.name);

                                return (
                                    <div key={item.name}>
                                        {item.hasDropdown ? (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        toggleDropdown(
                                                            item.name
                                                        )
                                                    }
                                                    className={cn(
                                                        "w-full flex items-center justify-between gap-2 rounded-xl pl-3 pr-2 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 group relative overflow-hidden",
                                                        "hover:bg-gradient-to-r hover:from-blue-100/80 hover:via-indigo-100/60 hover:to-purple-100/80 hover:text-blue-700 hover:shadow-lg hover:scale-[1.02]",
                                                        isActive
                                                            ? "bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 font-bold shadow-md ring-2 ring-blue-200/50"
                                                            : ""
                                                    )}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex items-center gap-3 relative z-10">
                                                        <div
                                                            className={cn(
                                                                "p-2 rounded-lg transition-all duration-300 shadow-sm",
                                                                isActive
                                                                    ? "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md"
                                                                    : "bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50 group-hover:from-blue-200 group-hover:via-indigo-200 group-hover:to-purple-200 group-hover:shadow-md"
                                                            )}
                                                        >
                                                            <item.icon
                                                                className={cn(
                                                                    "h-4 w-4 transition-all duration-300",
                                                                    isActive
                                                                        ? "text-white"
                                                                        : "text-gray-600 group-hover:text-blue-600"
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="font-bold text-base">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500 font-medium">
                                                                {
                                                                    item.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 relative z-10">
                                                        {isExpanded ? (
                                                            <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                                        )}
                                                    </div>
                                                </button>
                                                {isExpanded && (
                                                    <div className="ml-4 mt-2 space-y-1 pl-4 border-l-2 border-gradient-to-b from-blue-200 to-indigo-200">
                                                        {item.children.map(
                                                            (child) => (
                                                                <Link
                                                                    key={
                                                                        child.name
                                                                    }
                                                                    href={
                                                                        child.href
                                                                    }
                                                                    className={cn(
                                                                        "flex items-center gap-2 rounded-lg pl-3 pr-2 py-2 text-sm font-medium text-gray-600 transition-all duration-300 group relative overflow-hidden",
                                                                        "hover:bg-gradient-to-r hover:from-sky-50/80 hover:to-cyan-50/80 hover:text-sky-600 hover:shadow-sm hover:scale-[1.01]",
                                                                        route().current(
                                                                            child.routeName
                                                                        )
                                                                            ? "bg-gradient-to-r from-sky-100/90 to-cyan-100/90 text-sky-700 font-semibold shadow-sm ring-2 ring-sky-200/50"
                                                                            : ""
                                                                    )}
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                    <div
                                                                        className={cn(
                                                                            "p-2 rounded-lg transition-all duration-300 shadow-sm relative z-10",
                                                                            route().current(
                                                                                child.routeName
                                                                            )
                                                                                ? "bg-gradient-to-br from-sky-600 to-cyan-700 shadow-md"
                                                                                : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-sky-100 group-hover:to-cyan-100 group-hover:shadow-sm"
                                                                        )}
                                                                    >
                                                                        <child.icon
                                                                            className={cn(
                                                                                "h-4 w-4 transition-all duration-300",
                                                                                route().current(
                                                                                    child.routeName
                                                                                )
                                                                                    ? "text-white"
                                                                                    : "text-gray-500 group-hover:text-sky-600"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div className="text-left relative z-10">
                                                                        <div className="font-semibold text-sm">
                                                                            {
                                                                                child.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 font-medium">
                                                                            {
                                                                                child.description
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-xl pl-3 pr-2 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 group relative overflow-hidden",
                                                    "hover:bg-gradient-to-r hover:from-sky-100/80 hover:via-cyan-100/60 hover:to-sky-100/80 hover:text-sky-700 hover:shadow-lg hover:scale-[1.02]",
                                                    isActive
                                                        ? "bg-gradient-to-r from-sky-100/80 to-cyan-100/80 text-sky-700 font-bold shadow-md ring-2 ring-sky-200/50"
                                                        : ""
                                                )}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div
                                                    className={cn(
                                                        "p-2 rounded-lg transition-all duration-300 shadow-sm relative z-10",
                                                        isActive
                                                            ? "bg-gradient-to-br from-sky-600 to-cyan-700 shadow-md"
                                                            : "bg-gradient-to-br from-gray-100 via-sky-50 to-cyan-50 group-hover:from-sky-200 group-hover:via-cyan-200 group-hover:to-sky-200 group-hover:shadow-md"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            "h-4 w-4 transition-all duration-300",
                                                            isActive
                                                                ? "text-white"
                                                                : "text-gray-600 group-hover:text-sky-600"
                                                        )}
                                                    />
                                                </div>
                                                <div className="text-left relative z-10">
                                                    <div className="font-bold text-base">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Enhanced Footer */}
                    <div className="p-3 border-t-2 border-gray-200/60">
                        <div className="space-y-2">
                            {/* Enhanced Subscription Status */}
                            <div className="relative overflow-hidden rounded-xl bg-white border-2 border-blue-200/60 p-3 shadow-sm">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                                <div className="relative z-10 flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-sm">
                                        <Shield className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1 mb-0.5">
                                            <p className="text-xs font-bold text-blue-900">
                                                {auth?.clinic
                                                    ?.subscription_status ===
                                                "trial"
                                                    ? "Free Trial"
                                                    : auth?.clinic
                                                          ?.subscription_status ===
                                                      "active"
                                                    ? "Active"
                                                    : auth?.clinic
                                                          ?.subscription_status ===
                                                      "grace_period"
                                                    ? "Grace Period"
                                                    : "Inactive"}
                                            </p>
                                            {auth?.clinic
                                                ?.subscription_status ===
                                                "active" && (
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                            )}
                                        </div>
                                        <p className="text-xs text-blue-700 font-medium">
                                            {auth?.clinic?.subscription_plan ||
                                                "Basic"}{" "}
                                            Plan
                                        </p>
                                        {/* Show days remaining for trial */}
                                        {auth?.clinic?.subscription_status ===
                                            "trial" &&
                                            auth?.clinic?.trial_days_left && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3 text-green-600" />
                                                    <p className="text-xs text-green-700 font-bold">
                                                        {
                                                            auth.clinic
                                                                .trial_days_left
                                                        }{" "}
                                                        days left
                                                    </p>
                                                </div>
                                            )}
                                        {/* Show days remaining for active subscription */}
                                        {auth?.clinic?.subscription_status ===
                                            "active" &&
                                            auth?.clinic
                                                ?.subscription_days_left && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                                    <p
                                                        className={`text-xs font-bold ${
                                                            auth.clinic
                                                                .subscription_days_left <=
                                                            7
                                                                ? "text-orange-700"
                                                                : "text-green-700"
                                                        }`}
                                                    >
                                                        {
                                                            auth.clinic
                                                                .subscription_days_left
                                                        }{" "}
                                                        days left
                                                    </p>
                                                </div>
                                            )}
                                        {/* Show days remaining for grace period */}
                                        {auth?.clinic?.subscription_status ===
                                            "grace_period" &&
                                            auth?.clinic
                                                ?.subscription_days_left && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                                                    <p className="text-xs text-yellow-700 font-bold">
                                                        {
                                                            auth.clinic
                                                                .subscription_days_left
                                                        }{" "}
                                                        days grace
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Help & Support */}
                            <Link
                                href="#"
                                className="group flex items-center gap-2 p-2 text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 rounded-lg transition-all duration-300 border border-transparent hover:border-blue-200/50"
                            >
                                <div className="p-1.5 rounded-md bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 shadow-sm">
                                    <HelpCircle className="h-3.5 w-3.5 group-hover:text-blue-600 transition-colors" />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold group-hover:text-blue-700 transition-colors">
                                        Help & Support
                                    </span>
                                    <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                                        Get assistance
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
