import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell({ auth }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLiveMode, setIsLiveMode] = useState(true);

    // Auto-refresh every 30 seconds (same as Activity Logs)
    useEffect(() => {
        if (!isLiveMode) return;

        const interval = setInterval(() => {
            fetchNotifications(true); // Silent refresh
        }, 30000);

        return () => clearInterval(interval);
    }, [isLiveMode]);

    // Initial load
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async (silent = false) => {
        if (!silent) setIsLoading(true);

        try {
            const response = await fetch(
                route("clinic.notifications.index", auth.clinic_id),
                {
                    method: "GET",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unread_count);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                route("clinic.notifications.mark-read", [
                    auth.clinic_id,
                    notificationId,
                ]),
                {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );

            if (response.ok) {
                // Update local state
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notificationId ? { ...n, is_read: true } : n
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                route("clinic.notifications.mark-all-read", auth.clinic_id),
                {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                }
            );

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, is_read: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const getBadgeColor = () => {
        if (unreadCount === 0) return "";

        // Check if there are urgent notifications
        const hasUrgent = notifications.some(
            (n) => !n.is_read && n.priority === "urgent"
        );
        return hasUrgent ? "bg-red-500 animate-pulse" : "bg-blue-500";
    };

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-slate-200 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 border border-slate-600/50 shadow-lg hover:border-white/30"
            >
                <Bell className="w-5 h-5" />

                {/* Unread Count Badge */}
                {unreadCount > 0 && (
                    <span
                        className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] ${getBadgeColor()} rounded-full text-white text-xs flex items-center justify-center shadow-lg border border-white`}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <Loader2 className="absolute -top-1 -right-1 w-4 h-4 text-blue-400 animate-spin" />
                )}
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
                <NotificationDropdown
                    auth={auth}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onClose={() => setIsOpen(false)}
                    userRole={auth.user?.role}
                />
            )}
        </div>
    );
}
