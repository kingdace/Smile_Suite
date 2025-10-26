import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

export default function NotificationPreview({
    notification,
    icon: IconComponent,
    priorityColor,
    timestamp,
    onMarkAsRead,
    userRole,
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

        // Priority 2: Navigate to appropriate pages based on notification type and context
        // Use relative URLs to avoid CORS issues
        switch (notification.type) {
            case "appointment":
                // For appointment notifications, navigate to appointments index
                // This is safer than trying to show specific appointments that might not exist
                return `/clinic/${notification.clinic_id}/appointments`;

            case "patient":
                // For patient notifications, try to show specific patient if available
                if (notification.data?.patient_id) {
                    return `/clinic/${notification.clinic_id}/patients/${notification.data.patient_id}`;
                }
                // Fallback to patients index
                return `/clinic/${notification.clinic_id}/patients`;

            case "inventory":
                // For inventory notifications, try to show specific item if available
                if (notification.data?.inventory_id) {
                    return `/clinic/${notification.clinic_id}/inventory/${notification.data.inventory_id}`;
                }
                // Fallback to inventory index
                return `/clinic/${notification.clinic_id}/inventory`;

            case "subscription":
                // Navigate to subscription management or billing
                return `/clinic/${notification.clinic_id}/subscription`;

            case "system":
                // Navigate to dashboard for system notifications
                return `/clinic/${notification.clinic_id}/dashboard`;

            default:
                // Fallback to notifications page
                return `/clinic/${notification.clinic_id}/notifications`;
        }
    };

    return (
        <Link
            href={getActionUrl()}
            onClick={handleClick}
            className={`block px-2 py-2 hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer group ${
                !notification.is_read
                    ? "bg-blue-50 border-l-2 border-l-blue-400"
                    : ""
            }`}
            title={`Click to view ${notification.type} details`}
        >
            <div className="flex items-start gap-2">
                {/* Icon */}
                <div className={`flex-shrink-0 ${priorityColor}`}>
                    <IconComponent className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <p
                        className={`font-medium text-xs ${
                            !notification.is_read
                                ? "text-gray-900"
                                : "text-gray-700"
                        }`}
                    >
                        {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{timestamp}</p>
                </div>

                {/* Action Indicator */}
                <div className="flex-shrink-0 flex items-center gap-1">
                    {/* Unread Indicator */}
                    {!notification.is_read && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    )}
                    {/* Click Arrow */}
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
            </div>
        </Link>
    );
}
