import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import AdminNotificationDropdown from "./AdminNotificationDropdown";

export default function AdminNotificationBell({ auth }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLiveMode, setIsLiveMode] = useState(true);

    // Auto-refresh every 30 seconds (same as clinic notifications)
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

        console.log("🔔 [AdminNotificationBell] Fetching notifications...");
        console.log(
            "🔔 [AdminNotificationBell] Route URL:",
            route("admin.notifications.index")
        );

        try {
            const response = await fetch(route("admin.notifications.index"), {
                method: "GET",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "same-origin", // ✅ Send session cookies
            });

            console.log(
                "🔔 [AdminNotificationBell] Response status:",
                response.status
            );
            console.log("🔔 [AdminNotificationBell] Response OK:", response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log("🔔 [AdminNotificationBell] Data received:", data);
                console.log(
                    "🔔 [AdminNotificationBell] Notifications count:",
                    data.notifications?.length || 0
                );
                console.log(
                    "🔔 [AdminNotificationBell] Unread count:",
                    data.unread_count
                );

                setNotifications(data.notifications);
                setUnreadCount(data.unread_count);
            } else {
                console.error("🔔 [AdminNotificationBell] Response not OK!");
                const text = await response.text();
                console.error(
                    "🔔 [AdminNotificationBell] Response text:",
                    text.substring(0, 500)
                );
            }
        } catch (error) {
            console.error("🔔 [AdminNotificationBell] Fetch error:", error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                route("admin.notifications.mark-read", notificationId),
                {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                    credentials: "same-origin", // ✅ Send session cookies
                }
            );

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n.id === notificationId ? { ...n, is_read: true } : n
                    )
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Failed to mark admin notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                route("admin.notifications.mark-all-read"),
                {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                    credentials: "same-origin", // ✅ Send session cookies
                }
            );

            if (response.ok) {
                setNotifications((prev) =>
                    prev.map((n) => ({ ...n, is_read: true }))
                );
                setUnreadCount(0);
            }
        } catch (error) {
            console.error(
                "Failed to mark all admin notifications as read:",
                error
            );
        }
    };

    const getBadgeColor = () => {
        if (unreadCount === 0) return "";

        // Check if there are urgent notifications
        const hasUrgent = notifications.some(
            (n) => !n.is_read && n.priority === "urgent"
        );
        return hasUrgent ? "bg-red-500 animate-pulse" : "bg-orange-500"; // Orange theme for admin
    };

    return (
        <div className="relative">
            {/* Admin Notification Bell Button */}
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
                    <Loader2 className="absolute -top-1 -right-1 w-4 h-4 text-orange-400 animate-spin" />
                )}
            </button>

            {/* Admin Notification Dropdown */}
            {isOpen && (
                <AdminNotificationDropdown
                    auth={auth}
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
