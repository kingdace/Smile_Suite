import { Link } from "@inertiajs/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

const navigation = (clinicId) => [
    {
        name: "Dashboard",
        href: route("clinic.dashboard", [clinicId]),
        routeName: "clinic.dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Patients",
        href: route("clinic.patients.index", [clinicId]),
        routeName: "clinic.patients.*",
        icon: Users,
    },
    {
        name: "Dentist Schedule",
        href: route("clinic.dentist-schedules.index", [clinicId]),
        routeName: "clinic.dentist-schedules.*",
        icon: CalendarClock,
    },
    {
        name: "Appointments",
        href: route("clinic.appointments.index", [clinicId]),
        routeName: "clinic.appointments.*",
        icon: Calendar,
    },
    {
        name: "Treatments",
        href: route("clinic.treatments.index", [clinicId]),
        routeName: "clinic.treatments.*",
        icon: Stethoscope,
    },
    {
        name: "Inventory",
        href: route("clinic.inventory.index", [clinicId]),
        routeName: "clinic.inventory.*",
        icon: Package,
        hasDropdown: true,
        children: [
            {
                name: "Inventory Items",
                href: route("clinic.inventory.index", [clinicId]),
                routeName: "clinic.inventory.*",
                icon: CircleSmall,
            },
            {
                name: "Suppliers",
                href: route("clinic.suppliers.index", [clinicId]),
                routeName: "clinic.suppliers.*",
                icon: CircleSmall,
            },
        ],
    },
    {
        name: "Payments",
        href: route("clinic.payments.index", [clinicId]),
        routeName: "clinic.payments.*",
        icon: DollarSign,
    },
    {
        name: "Reports",
        href: route("clinic.reports.index", [clinicId]),
        routeName: "clinic.reports.*",
        icon: FileText,
    },
    {
        name: "Settings",
        href: route("clinic.settings.index", [clinicId]),
        routeName: "clinic.settings.*",
        icon: Settings,
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
            <div className={cn("border-r bg-white", className)}>
                Loading Sidebar...
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
        <div
            className={cn(
                "border-r-2 border-blue-200/50 bg-white/80 backdrop-blur-sm shadow-xl",
                className
            )}
        >
            <div className="h-full flex flex-col">
                <div className="flex-1 py-4 pt-10 px-2">
                    <div className="space-y-2">
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
                                                    toggleDropdown(item.name)
                                                }
                                                className={cn(
                                                    "w-full flex items-center justify-between gap-3 rounded-xl pl-8 py-2.5 text-base font-semibold text-gray-700 transition-colors",
                                                    "hover:bg-blue-50/80 hover:text-blue-700",
                                                    isActive
                                                        ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-l-4 border-blue-600 font-bold"
                                                        : ""
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon
                                                        className={cn(
                                                            "h-6 w-6 text-blue-600/80 transition-colors",
                                                            isActive
                                                                ? "text-blue-700"
                                                                : ""
                                                        )}
                                                    />
                                                    {item.name}
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronDown className="h-4 w-4 mr-2" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 mr-2" />
                                                )}
                                            </button>
                                            {isExpanded && (
                                                <div className="ml-8 mt-2 space-y-1">
                                                    {item.children.map(
                                                        (child) => (
                                                            <Link
                                                                key={child.name}
                                                                href={
                                                                    child.href
                                                                }
                                                                className={cn(
                                                                    "flex items-center gap-3 rounded-lg pl-4 py-2 text-sm font-medium text-gray-600 transition-colors",
                                                                    "hover:bg-blue-50/60 hover:text-blue-600",
                                                                    route().current(
                                                                        child.routeName
                                                                    )
                                                                        ? "bg-blue-50/80 text-blue-700 border-l-2 border-blue-500"
                                                                        : ""
                                                                )}
                                                            >
                                                                {child.icon && (
                                                                    <child.icon className="h-4 w-4" />
                                                                )}
                                                                {child.name}
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
                                                "flex items-center gap-3 rounded-xl pl-8 py-2.5 text-base font-semibold text-gray-700 transition-colors",
                                                "hover:bg-blue-50/80 hover:text-blue-700",
                                                isActive
                                                    ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-l-4 border-blue-600 font-bold"
                                                    : ""
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "h-6 w-6 text-blue-600/80 transition-colors",
                                                    isActive
                                                        ? "text-blue-700"
                                                        : ""
                                                )}
                                            />
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
