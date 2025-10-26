import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

export default function AdminNotificationPreview({
    notification,
    icon: IconComponent,
    priorityColor,
    timestamp,
    onMarkAsRead,
}) {
    const handleClick = () => {
        if (!notification.is_read) {
            onMarkAsRead();
        }
    };

    const getActionUrl = () => {
        // Priority 1: Use specific action_url if provided
        if (notification.data?.action_url) {
            return notification.data.action_url;
        }

        // Priority 2: Navigate to appropriate admin pages based on notification type
        switch (notification.type) {
            case "support":
                return `/admin/support-tickets/${
                    notification.data?.ticket_id || ""
                }`;

            case "clinic_registration":
                return `/admin/clinic-requests/${
                    notification.data?.request_id || ""
                }`;

            case "subscription":
                return `/admin/subscriptions`;

            case "user_management":
                return `/admin/users`;

            case "system":
                return `/admin/dashboard`;

            default:
                return `/admin/notifications`;
        }
    };

    return (
        <Link
            href={getActionUrl()}
            onClick={handleClick}
            className={`block px-3 py-3 hover:bg-orange-50 border-b border-gray-100 transition-colors cursor-pointer group ${
                !notification.is_read
                    ? "bg-orange-50 border-l-4 border-l-orange-400"
                    : ""
            }`}
            title={`Click to view ${notification.type} details`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`p-1.5 rounded-md ${priorityColor} bg-gray-100 group-hover:bg-orange-100 transition-colors`}
                >
                    <IconComponent className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 group-hover:text-orange-700 transition-colors line-clamp-1">
                                {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 group-hover:text-orange-600 transition-colors line-clamp-2 mt-0.5">
                                {notification.message}
                            </p>
                        </div>

                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0 mt-0.5" />
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs text-gray-500">
                            {timestamp}
                        </span>

                        {!notification.is_read && (
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
