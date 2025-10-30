import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import {
    Bell,
    CheckCircle,
    AlertCircle,
    AlertTriangle,
    Info,
    Clock,
    Eye,
    EyeOff,
    Filter,
    RefreshCw,
    Calendar,
    Users,
    Building2,
    TrendingUp,
} from "lucide-react";

export default function Index({ auth, notifications, stats }) {
    const [filter, setFilter] = useState("all");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getNotificationUrl = (notification) => {
        // Priority 1: Use specific action_url if provided
        if (notification.data?.action_url) {
            return notification.data.action_url;
        }

        // Priority 2: Navigate to appropriate admin pages based on notification type
        switch (notification.type) {
            case "support":
                // If ticket_id is provided, go to specific ticket, otherwise list
                if (notification.data?.ticket_id) {
                    return route(
                        "admin.support.show",
                        notification.data.ticket_id
                    );
                }
                return route("admin.support.index");

            case "clinic_registration":
                // If request_id is provided, go to specific request, otherwise list
                if (notification.data?.request_id) {
                    return route(
                        "admin.clinic-requests.show",
                        notification.data.request_id
                    );
                }
                return route("admin.clinic-requests.index");

            case "subscription":
                return route("admin.subscriptions.index");

            case "user_management":
                return route("admin.users.index");

            case "system":
                return route("admin.dashboard");

            default:
                return route("admin.notifications.page");
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            urgent: "bg-red-100 text-red-800 border-red-300",
            high: "bg-orange-100 text-orange-800 border-orange-300",
            normal: "bg-blue-100 text-blue-800 border-blue-300",
            low: "bg-gray-100 text-gray-800 border-gray-300",
        };
        return colors[priority] || colors.normal;
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "urgent":
                return <AlertCircle className="h-4 w-4" />;
            case "high":
                return <AlertTriangle className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "appointment":
                return <Calendar className="h-5 w-5" />;
            case "clinic":
                return <Building2 className="h-5 w-5" />;
            case "user":
                return <Users className="h-5 w-5" />;
            default:
                return <Bell className="h-5 w-5" />;
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await fetch(
                route("admin.notifications.mark-read", notificationId),
                {
                    method: "POST",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                    credentials: "same-origin",
                }
            );
            router.reload({ only: ["notifications", "stats"] });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(route("admin.notifications.mark-all-read"), {
                method: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                credentials: "same-origin",
            });
            router.reload({ only: ["notifications", "stats"] });
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ["notifications", "stats"],
            onFinish: () => setIsRefreshing(false),
        });
    };

    const filteredNotifications = notifications.data.filter((notif) => {
        if (filter === "unread") return !notif.is_read;
        if (filter === "urgent") return notif.priority === "urgent";
        return true;
    });

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Notifications
                </h2>
            }
            hideSidebar={true}
        >
            <Head title="Admin Notifications" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50">
                        <div className="p-6 text-gray-900">
                            {/* Page Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        Admin Notifications
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        System-wide alerts and updates
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                                    >
                                        <RefreshCw
                                            className={`h-4 w-4 inline mr-2 ${
                                                isRefreshing
                                                    ? "animate-spin"
                                                    : ""
                                            }`}
                                        />
                                        Refresh
                                    </button>
                                    {stats.unread > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                        >
                                            <CheckCircle className="h-4 w-4 inline mr-2" />
                                            Mark All Read
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200/50 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">
                                                Total
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stats.total}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                All notifications
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Bell className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200/50 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">
                                                Unread
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stats.unread}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Needs attention
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <EyeOff className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200/50 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">
                                                Urgent
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stats.urgent}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                High priority
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <AlertCircle className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200/50 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 font-medium">
                                                This Week
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stats.this_week}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Recent activity
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <TrendingUp className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="mb-6 flex items-center gap-4 bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                                <Filter className="h-5 w-5 text-gray-600" />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setFilter("all")}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                                            filter === "all"
                                                ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md"
                                                : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400"
                                        }`}
                                    >
                                        All ({notifications.data.length})
                                    </button>
                                    <button
                                        onClick={() => setFilter("unread")}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                                            filter === "unread"
                                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                                                : "bg-white text-gray-700 border border-gray-300 hover:border-orange-400"
                                        }`}
                                    >
                                        Unread (
                                        {
                                            notifications.data.filter(
                                                (n) => !n.is_read
                                            ).length
                                        }
                                        )
                                    </button>
                                    <button
                                        onClick={() => setFilter("urgent")}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                                            filter === "urgent"
                                                ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md"
                                                : "bg-white text-gray-700 border border-gray-300 hover:border-red-400"
                                        }`}
                                    >
                                        Urgent (
                                        {
                                            notifications.data.filter(
                                                (n) => n.priority === "urgent"
                                            ).length
                                        }
                                        )
                                    </button>
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="space-y-4">
                                {filteredNotifications.length === 0 ? (
                                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                                        <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                            No notifications found
                                        </h3>
                                        <p className="text-gray-500">
                                            {filter === "all"
                                                ? "You're all caught up!"
                                                : `No ${filter} notifications at the moment.`}
                                        </p>
                                    </div>
                                ) : (
                                    filteredNotifications.map(
                                        (notification) => (
                                            <Link
                                                key={notification.id}
                                                href={getNotificationUrl(
                                                    notification
                                                )}
                                                className={`block rounded-xl border p-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                                                    !notification.is_read
                                                        ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-300"
                                                        : "bg-white border-gray-200"
                                                }`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`p-3 rounded-xl ${
                                                            notification.priority ===
                                                            "urgent"
                                                                ? "bg-red-100 text-red-600"
                                                                : notification.priority ===
                                                                  "high"
                                                                ? "bg-orange-100 text-orange-600"
                                                                : "bg-blue-100 text-blue-600"
                                                        }`}
                                                    >
                                                        {getTypeIcon(
                                                            notification.type
                                                        )}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </h3>
                                                                <p className="text-gray-700 text-sm mt-1">
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                className={`${getPriorityColor(
                                                                    notification.priority
                                                                )} flex items-center gap-1 whitespace-nowrap`}
                                                            >
                                                                {getPriorityIcon(
                                                                    notification.priority
                                                                )}
                                                                {
                                                                    notification.priority
                                                                }
                                                            </Badge>
                                                        </div>

                                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" />
                                                                {format(
                                                                    new Date(
                                                                        notification.created_at
                                                                    ),
                                                                    "MMM d, yyyy 'at' h:mm a"
                                                                )}
                                                            </div>
                                                            {notification.clinic_id && (
                                                                <div className="flex items-center gap-2">
                                                                    <Building2 className="h-4 w-4" />
                                                                    Clinic ID:{" "}
                                                                    {
                                                                        notification.clinic_id
                                                                    }
                                                                </div>
                                                            )}
                                                            {notification.is_read && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-green-600 border-green-300"
                                                                >
                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                    Read
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {!notification.is_read && (
                                                            <div className="mt-3">
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        markAsRead(
                                                                            notification.id
                                                                        );
                                                                    }}
                                                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                                                                >
                                                                    <Eye className="h-4 w-4 inline mr-2" />
                                                                    Mark as Read
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    )
                                )}
                            </div>

                            {/* Pagination */}
                            {notifications.links &&
                                notifications.links.length > 3 && (
                                    <div className="mt-6 flex items-center justify-center gap-2">
                                        {notifications.links.map(
                                            (link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || "#"}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                        link.active
                                                            ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md"
                                                            : link.url
                                                            ? "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:shadow-md"
                                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
