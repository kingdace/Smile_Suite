import { Link } from "@inertiajs/react";
import {
    X,
    Calendar,
    Package,
    CreditCard,
    Users,
    Settings,
    Clock,
    CheckCircle,
} from "lucide-react";
import NotificationPreview from "./NotificationPreview";

export default function NotificationDropdown({
    auth,
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead,
    onClose,
    userRole,
}) {
    const formatTimestamp = (date) => {
        const logDate = new Date(date);
        return logDate
            .toLocaleString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            })
            .replace(/,/g, "");
    };

    const getNotificationIcon = (type, priority) => {
        const iconMap = {
            appointment: Calendar,
            inventory: Package,
            subscription: CreditCard,
            patient: Users,
            system: Settings,
        };

        return iconMap[type] || Settings;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "urgent":
                return "text-red-500";
            case "high":
                return "text-orange-500";
            case "medium":
                return "text-blue-500";
            case "low":
                return "text-gray-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            {/* Header */}
            <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm">
                        Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </h3>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <button
                                onClick={onMarkAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-1"
                            >
                                Mark All
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        <Clock className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                        <p className="text-xs">No notifications</p>
                    </div>
                ) : (
                    notifications.slice(0, 6).map((notification) => {
                        const IconComponent = getNotificationIcon(
                            notification.type,
                            notification.priority
                        );

                        return (
                            <NotificationPreview
                                key={notification.id}
                                notification={notification}
                                icon={IconComponent}
                                priorityColor={getPriorityColor(
                                    notification.priority
                                )}
                                timestamp={formatTimestamp(
                                    notification.created_at
                                )}
                                onMarkAsRead={() =>
                                    onMarkAsRead(notification.id)
                                }
                                userRole={userRole}
                            />
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <Link
                    href={route("clinic.notifications.page", auth.clinic_id)}
                    className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium block"
                >
                    View All Notifications
                </Link>
            </div>
        </div>
    );
}
