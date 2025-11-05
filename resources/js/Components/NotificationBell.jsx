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
        // Debug log on mount
        console.log("🔔 [NOTIFICATION BELL] Component mounted", {
            auth: auth
                ? {
                      hasUser: !!auth.user,
                      clinicId: auth.clinic_id,
                      userRole: auth.user?.role,
                  }
                : "AUTH MISSING",
            timestamp: new Date().toISOString(),
        });

        fetchNotifications();
    }, []);

    // Debug log when unreadCount changes
    useEffect(() => {
        if (unreadCount === 0) {
            console.log("🔔 [BADGE] No unread notifications (badge hidden)", {
                totalNotifications: notifications.length,
                allRead: notifications.every((n) => n.is_read),
            });
        } else {
            console.log("🔔 [BADGE] Showing badge", {
                unreadCount,
                totalNotifications: notifications.length,
            });
        }
    }, [unreadCount, notifications.length]);

    const fetchNotifications = async (silent = false) => {
        // 🔍 COMPREHENSIVE DEBUG LOGGING
        const DEBUG_PREFIX = "🔔 [NOTIFICATION DEBUG]";
        console.group(`${DEBUG_PREFIX} Fetching Notifications`);

        // Log 1: User/Auth Information
        console.log("📋 [1] User/Auth Information:", {
            userId: auth.user?.id,
            userEmail: auth.user?.email,
            userName: auth.user?.name,
            userRole: auth.user?.role,
            clinicId: auth.clinic_id,
            hasAuth: !!auth,
            hasUser: !!auth?.user,
            hasClinicId: !!auth?.clinic_id,
        });

        // Check if required data exists
        if (!auth) {
            console.error("❌ [ERROR] auth object is missing!");
            console.groupEnd();
            return;
        }

        if (!auth.clinic_id) {
            console.error("❌ [ERROR] auth.clinic_id is missing!");
            console.warn("Available auth keys:", Object.keys(auth));
            console.groupEnd();
            return;
        }

        if (!auth.user) {
            console.warn(
                "⚠️ [WARNING] auth.user is missing (might be okay for some routes)"
            );
        }

        if (!silent) setIsLoading(true);

        try {
            // Build API URL
            const apiUrl = route("clinic.notifications.index", auth.clinic_id);

            // Log 2: API Request Details
            console.log("🌐 [2] API Request Details:", {
                url: apiUrl,
                method: "GET",
                clinicId: auth.clinic_id,
                routeName: "clinic.notifications.index",
                routeFunctionExists: typeof route === "function",
                baseUrl: window.location.origin,
                fullUrl: window.location.origin + apiUrl,
            });

            // Check if route() function exists
            if (typeof route !== "function") {
                console.error("❌ [ERROR] route() function is not defined!");
                console.error("Make sure Ziggy route helper is loaded");
                console.groupEnd();
                if (!silent) setIsLoading(false);
                return;
            }

            const requestHeaders = {
                "X-Requested-With": "XMLHttpRequest",
            };

            // Log 3: Request Headers
            console.log("📤 [3] Request Headers:", requestHeaders);
            console.log(
                "🍪 [3.1] Cookies:",
                document.cookie ? "Present" : "Missing"
            );

            const response = await fetch(apiUrl, {
                method: "GET",
                headers: requestHeaders,
                credentials: "same-origin",
            });

            // Log 4: Response Status
            console.log("📥 [4] Response Status:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                redirected: response.redirected,
                type: response.type,
                url: response.url,
            });

            if (!response.ok) {
                // Log error response details
                const errorText = await response.text();
                console.error("❌ [4.1] Response Error Details:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText.substring(0, 500), // First 500 chars
                    headers: Object.fromEntries(response.headers.entries()),
                });

                if (response.status === 401) {
                    console.error(
                        "🔒 [AUTH ERROR] User is not authenticated. Check session."
                    );
                } else if (response.status === 403) {
                    console.error(
                        "🚫 [PERMISSION ERROR] User doesn't have permission to view notifications."
                    );
                } else if (response.status === 404) {
                    console.error(
                        "🔍 [NOT FOUND] Route not found. Check if route is registered."
                    );
                } else if (response.status >= 500) {
                    console.error(
                        "💥 [SERVER ERROR] Backend error. Check server logs."
                    );
                }
            }

            if (response.ok) {
                const data = await response.json();

                // Log 5: Response Data
                console.log("📦 [5] Response Data:", {
                    notificationsCount: data.notifications?.length || 0,
                    unreadCount: data.unread_count || 0,
                    hasNotifications: !!(
                        data.notifications && data.notifications.length > 0
                    ),
                    notifications:
                        data.notifications?.map((n) => ({
                            id: n.id,
                            title: n.title,
                            type: n.type,
                            priority: n.priority,
                            isRead: n.is_read,
                            targetRoles: n.target_roles,
                            clinicId: n.clinic_id,
                        })) || [],
                    rawData: data,
                });

                // Log 6: Notification Analysis
                if (data.notifications && data.notifications.length > 0) {
                    console.log("✅ [6] Notification Analysis:", {
                        total: data.notifications.length,
                        unread: data.notifications.filter((n) => !n.is_read)
                            .length,
                        read: data.notifications.filter((n) => n.is_read)
                            .length,
                        byType: data.notifications.reduce((acc, n) => {
                            acc[n.type] = (acc[n.type] || 0) + 1;
                            return acc;
                        }, {}),
                        byPriority: data.notifications.reduce((acc, n) => {
                            acc[n.priority] = (acc[n.priority] || 0) + 1;
                            return acc;
                        }, {}),
                        firstNotification: data.notifications[0],
                    });
                } else {
                    console.warn("⚠️ [6] No notifications returned!", {
                        possibleReasons: [
                            "No notifications exist for this clinic",
                            "User's role doesn't match target_roles",
                            "All notifications are expired",
                            "All notifications are already read",
                            "Database query issue",
                        ],
                        userRole: auth.user?.role,
                        clinicId: auth.clinic_id,
                    });
                }

                setNotifications(data.notifications);
                setUnreadCount(data.unread_count);

                console.log("✅ [SUCCESS] Notifications loaded successfully!");
            } else {
                console.error("❌ [FAILED] Response was not OK");
            }
        } catch (error) {
            // Log 7: Exception Details
            console.error("💥 [7] Exception Caught:", {
                name: error.name,
                message: error.message,
                stack: error.stack,
                error: error,
            });

            console.error("❌ [ERROR] Failed to fetch notifications:", error);

            // Additional context
            console.error("🔍 [ERROR CONTEXT]:", {
                apiUrl: route
                    ? route("clinic.notifications.index", auth.clinic_id)
                    : "N/A (route not defined)",
                clinicId: auth.clinic_id,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                online: navigator.onLine,
            });
        } finally {
            if (!silent) setIsLoading(false);
            console.groupEnd();
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
                    credentials: "same-origin", // ✅ Send session cookies
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
                onClick={() => {
                    console.log("🔔 [NOTIFICATION BELL] Clicked", {
                        isOpen,
                        unreadCount,
                        notificationsCount: notifications.length,
                        willOpen: !isOpen,
                    });
                    setIsOpen(!isOpen);
                }}
                className="relative p-2.5 text-slate-200 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 border border-slate-600/50 shadow-lg hover:border-white/30"
            >
                <Bell className="w-5 h-5" />

                {/* Unread Count Badge */}
                {unreadCount > 0 && (
                    <span
                        className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] ${getBadgeColor()} rounded-full text-white text-xs flex items-center justify-center shadow-lg border border-white`}
                        title={`${unreadCount} unread notification${
                            unreadCount !== 1 ? "s" : ""
                        }`}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
                {/* Badge visibility: unreadCount > 0 shows badge */}

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
