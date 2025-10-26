import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Bell,
    Search,
    Filter,
    RefreshCw,
    CheckCircle,
    Calendar,
    Package,
    CreditCard,
    Users,
    Settings,
    Clock,
    AlertCircle,
    MoreVertical,
    Archive,
    Trash2,
    EyeOff,
    Zap,
    Activity,
    TrendingUp,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Info,
    AlertTriangle,
    ChevronDown,
    ChevronRight,
    Flame,
    Gem,
} from "lucide-react";

export default function Index({
    auth,
    clinic,
    notifications: initialNotifications,
    filters,
    stats,
    debug_auth,
}) {
    const [isLiveMode, setIsLiveMode] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [notifications, setNotifications] = useState(
        initialNotifications || []
    );
    const [unreadCount, setUnreadCount] = useState(stats?.unread || 0);
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [typeFilter, setTypeFilter] = useState(filters?.type || "all");
    const [priorityFilter, setPriorityFilter] = useState(
        filters?.priority || "all"
    );
    const [expandedNotifications, setExpandedNotifications] = useState(
        new Set()
    );
    const [selectedNotifications, setSelectedNotifications] = useState(
        new Set()
    );

    // Helper functions
    const getNotificationIcon = (type, priority) => {
        const iconClass = "w-4 h-4";
        const priorityClass =
            priority === "urgent"
                ? "text-red-500"
                : priority === "high"
                ? "text-orange-500"
                : priority === "medium"
                ? "text-blue-500"
                : "text-gray-500";

        switch (type) {
            case "appointment":
                return <Calendar className={`${iconClass} ${priorityClass}`} />;
            case "inventory":
                return <Package className={`${iconClass} ${priorityClass}`} />;
            case "subscription":
                return (
                    <CreditCard className={`${iconClass} ${priorityClass}`} />
                );
            case "patient":
                return <Users className={`${iconClass} ${priorityClass}`} />;
            case "system":
                return <Settings className={`${iconClass} ${priorityClass}`} />;
            default:
                return <Bell className={`${iconClass} ${priorityClass}`} />;
        }
    };

    const getPriorityGradient = (priority) => {
        switch (priority) {
            case "urgent":
                return "from-red-500 to-red-600";
            case "high":
                return "from-orange-500 to-orange-600";
            case "medium":
                return "from-blue-500 to-blue-600";
            case "low":
                return "from-gray-500 to-gray-600";
            default:
                return "from-gray-500 to-gray-600";
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "urgent":
                return <Flame className="w-3 h-3" />;
            case "high":
                return <TrendingUp className="w-3 h-3" />;
            case "medium":
                return <Info className="w-3 h-3" />;
            case "low":
                return <CheckCircle className="w-3 h-3" />;
            default:
                return <Bell className="w-3 h-3" />;
        }
    };

    const formatTimestamp = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInMinutes = Math.floor(
            (now - notificationDate) / (1000 * 60)
        );

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440)
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080)
            return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return notificationDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year:
                notificationDate.getFullYear() !== now.getFullYear()
                    ? "numeric"
                    : undefined,
        });
    };

    const toggleNotificationExpansion = (notificationId) => {
        const newExpanded = new Set(expandedNotifications);
        if (newExpanded.has(notificationId)) {
            newExpanded.delete(notificationId);
        } else {
            newExpanded.add(notificationId);
        }
        setExpandedNotifications(newExpanded);
    };

    const toggleNotificationSelection = (notificationId) => {
        const newSelected = new Set(selectedNotifications);
        if (newSelected.has(notificationId)) {
            newSelected.delete(notificationId);
        } else {
            newSelected.add(notificationId);
        }
        setSelectedNotifications(newSelected);
    };

    const selectAllNotifications = () => {
        const allIds = filteredNotifications.map((n) => n.id);
        setSelectedNotifications(new Set(allIds));
    };

    const clearSelection = () => {
        setSelectedNotifications(new Set());
    };

    // Filter notifications
    const filteredNotifications = notifications.filter((notification) => {
        if (
            searchTerm &&
            !notification.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) &&
            !notification.message
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        ) {
            return false;
        }
        if (typeFilter !== "all" && notification.type !== typeFilter) {
            return false;
        }
        if (
            priorityFilter !== "all" &&
            notification.priority !== priorityFilter
        ) {
            return false;
        }
        return true;
    });

    // Auto-refresh
    useEffect(() => {
        if (!isLiveMode) return;
        const interval = setInterval(() => {
            handleRefresh(true);
        }, 30000);
        return () => clearInterval(interval);
    }, [isLiveMode]);

    useEffect(() => {
        handleRefresh(true);
    }, []);

    const handleRefresh = async (silent = false) => {
        if (!silent) setIsRefreshing(true);
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
            if (!silent) setIsRefreshing(false);
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
                handleRefresh();
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
                handleRefresh();
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Notification Center" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-5 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <Bell className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Notification Center
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Stay updated with your clinic activities
                                        {isLiveMode && (
                                            <span className="ml-2 inline-flex items-center gap-1 bg-green-500/20 text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                                                <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                                                LIVE
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => handleRefresh()}
                                    variant="outline"
                                    size="sm"
                                    disabled={isRefreshing}
                                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                                >
                                    <RefreshCw
                                        className={`w-4 h-4 mr-2 ${
                                            isRefreshing ? "animate-spin" : ""
                                        }`}
                                    />
                                    Refresh
                                </Button>
                                {selectedNotifications.size > 0 && (
                                    <Button
                                        onClick={clearSelection}
                                        variant="outline"
                                        size="sm"
                                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Clear Selection
                                    </Button>
                                )}
                                <Button
                                    onClick={markAllAsRead}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 shadow-lg"
                                    size="sm"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark All Read
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Container */}
                <div className="mx-5 mb-5">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                                            Total
                                        </p>
                                        <p className="text-2xl font-bold text-blue-700 mt-1">
                                            {stats?.total || 0}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Bell className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                                            Unread
                                        </p>
                                        <p className="text-2xl font-bold text-orange-700 mt-1">
                                            {stats?.unread || 0}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <AlertCircle className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                                            This Week
                                        </p>
                                        <p className="text-2xl font-bold text-green-700 mt-1">
                                            {stats?.this_week || 0}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Activity className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">
                                            Urgent
                                        </p>
                                        <p className="text-2xl font-bold text-red-700 mt-1">
                                            {stats?.urgent || 0}
                                        </p>
                                    </div>
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Flame className="w-5 h-5 text-red-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="mt-6">
                        {/* Filters */}
                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg mb-4">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                placeholder="Search notifications..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10 h-9 bg-white border-gray-200 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <Select
                                        value={typeFilter}
                                        onValueChange={setTypeFilter}
                                    >
                                        <SelectTrigger className="w-40 h-9 bg-white border-gray-200 rounded-lg">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Types
                                            </SelectItem>
                                            <SelectItem value="appointment">
                                                Appointments
                                            </SelectItem>
                                            <SelectItem value="inventory">
                                                Inventory
                                            </SelectItem>
                                            <SelectItem value="subscription">
                                                Subscription
                                            </SelectItem>
                                            <SelectItem value="patient">
                                                Patients
                                            </SelectItem>
                                            <SelectItem value="system">
                                                System
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={priorityFilter}
                                        onValueChange={setPriorityFilter}
                                    >
                                        <SelectTrigger className="w-40 h-9 bg-white border-gray-200 rounded-lg">
                                            <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Priority
                                            </SelectItem>
                                            <SelectItem value="urgent">
                                                Urgent
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setTypeFilter("all");
                                            setPriorityFilter("all");
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className="h-9"
                                    >
                                        <Filter className="w-4 h-4 mr-1" />
                                        Clear
                                    </Button>
                                </div>

                                {/* Bulk Actions */}
                                {filteredNotifications.length > 0 && (
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={selectAllNotifications}
                                                variant="outline"
                                                size="sm"
                                                className="h-8"
                                            >
                                                Select All
                                            </Button>
                                            {selectedNotifications.size > 0 && (
                                                <span className="text-sm text-gray-600">
                                                    {selectedNotifications.size}{" "}
                                                    selected
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={markAllAsRead}
                                                variant="outline"
                                                size="sm"
                                                className="h-8"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Mark Read
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notifications List */}
                        <Card className="bg-white/80 backdrop-blur-sm border-white/50 shadow-lg">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <MessageSquare className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                Notifications
                                            </CardTitle>
                                            <CardDescription>
                                                {filteredNotifications.length}{" "}
                                                notification
                                                {filteredNotifications.length !==
                                                1
                                                    ? "s"
                                                    : ""}{" "}
                                                found
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            setIsLiveMode(!isLiveMode)
                                        }
                                        variant={
                                            isLiveMode ? "default" : "outline"
                                        }
                                        size="sm"
                                        className={`h-8 ${
                                            isLiveMode
                                                ? "bg-green-500 hover:bg-green-600"
                                                : ""
                                        }`}
                                    >
                                        <Zap className="w-4 h-4 mr-1" />
                                        {isLiveMode ? "Live" : "Manual"}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {filteredNotifications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Bell className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No notifications found
                                        </h3>
                                        <p className="text-gray-500">
                                            Notifications will appear here as
                                            events occur.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredNotifications.map(
                                            (notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`group p-4 rounded-lg border transition-all duration-200 ${
                                                        !notification.is_read
                                                            ? "bg-blue-50/50 border-blue-200"
                                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                                    } ${
                                                        selectedNotifications.has(
                                                            notification.id
                                                        )
                                                            ? "bg-blue-100 border-blue-300"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        {/* Selection Checkbox */}
                                                        <div className="flex-shrink-0 mt-1">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedNotifications.has(
                                                                    notification.id
                                                                )}
                                                                onChange={() =>
                                                                    toggleNotificationSelection(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        {/* Notification Icon */}
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            <div
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                                    notification.priority ===
                                                                    "urgent"
                                                                        ? "bg-red-100"
                                                                        : notification.priority ===
                                                                          "high"
                                                                        ? "bg-orange-100"
                                                                        : notification.priority ===
                                                                          "medium"
                                                                        ? "bg-blue-100"
                                                                        : "bg-gray-100"
                                                                }`}
                                                            >
                                                                {getNotificationIcon(
                                                                    notification.type,
                                                                    notification.priority
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Notification Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex-1">
                                                                    <h4
                                                                        className={`text-sm font-semibold ${
                                                                            !notification.is_read
                                                                                ? "text-gray-900"
                                                                                : "text-gray-700"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                        {
                                                                            notification.message
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2 ml-3">
                                                                    <Badge
                                                                        className={`text-xs bg-gradient-to-r ${getPriorityGradient(
                                                                            notification.priority
                                                                        )} text-white`}
                                                                    >
                                                                        <div className="flex items-center gap-1">
                                                                            {getPriorityIcon(
                                                                                notification.priority
                                                                            )}
                                                                            {
                                                                                notification.priority
                                                                            }
                                                                        </div>
                                                                    </Badge>
                                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                                        {formatTimestamp(
                                                                            notification.created_at
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs text-gray-600"
                                                                    >
                                                                        {
                                                                            notification.type
                                                                        }
                                                                    </Badge>
                                                                    {!notification.is_read && (
                                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    {notification.data && (
                                                                        <Button
                                                                            onClick={() =>
                                                                                toggleNotificationExpansion(
                                                                                    notification.id
                                                                                )
                                                                            }
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                                                                        >
                                                                            {expandedNotifications.has(
                                                                                notification.id
                                                                            ) ? (
                                                                                <ChevronDown className="w-4 h-4" />
                                                                            ) : (
                                                                                <ChevronRight className="w-4 h-4" />
                                                                            )}
                                                                        </Button>
                                                                    )}
                                                                    {!notification.is_read && (
                                                                        <Button
                                                                            onClick={() =>
                                                                                markAsRead(
                                                                                    notification.id
                                                                                )
                                                                            }
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                        >
                                                                            <CheckCircle2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                                                                    >
                                                                        <MoreVertical className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* Expanded Content */}
                                                            {expandedNotifications.has(
                                                                notification.id
                                                            ) &&
                                                                notification.data && (
                                                                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                                                                        <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                                            <Gem className="w-3 h-3 text-blue-500" />
                                                                            Additional
                                                                            Details
                                                                        </h5>
                                                                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                                                            {JSON.stringify(
                                                                                notification.data,
                                                                                null,
                                                                                2
                                                                            )}
                                                                        </pre>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
