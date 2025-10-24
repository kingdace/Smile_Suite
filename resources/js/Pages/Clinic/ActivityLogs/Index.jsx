import { useState, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
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
    Shield,
    Search,
    Filter,
    Download,
    Eye,
    Calendar,
    User,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Users,
    FileText,
    DollarSign,
    Package,
    Stethoscope,
    Calendar as CalendarIcon,
    Settings,
    RefreshCw,
    Terminal,
    Monitor,
    Lock,
    Unlock,
    Zap,
    AlertCircle,
    Info,
    Play,
    ChevronDown,
    ChevronUp,
    Pause,
    Square,
    RotateCcw,
    FilterX,
    Maximize2,
    Minimize2,
} from "lucide-react";
import { format } from "date-fns";

export default function ActivityLogsIndex({
    auth,
    logs,
    stats,
    filters,
    filterOptions,
    severityOptions,
    categoryOptions,
    actionOptions,
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedSeverity, setSelectedSeverity] = useState(
        filters.severity || "all"
    );
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || "all"
    );
    const [selectedAction, setSelectedAction] = useState(
        filters.action || "all"
    );
    const [selectedUser, setSelectedUser] = useState(filters.user_id || "all");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLiveMode, setIsLiveMode] = useState(true); // Always live by default
    const [terminalExpanded, setTerminalExpanded] = useState(true);
    const [autoScroll, setAutoScroll] = useState(true);
    const [expandedLogs, setExpandedLogs] = useState(new Set());
    const terminalRef = useRef(null);
    const refreshIntervalRef = useRef(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (autoScroll && terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs.data, autoScroll]);

    // Auto-refresh functionality
    useEffect(() => {
        if (isLiveMode) {
            // Refresh every 3 seconds when live mode is on (silent refresh)
            refreshIntervalRef.current = setInterval(() => {
                handleRefresh(true); // Silent refresh
            }, 3000);
        } else {
            // Clear interval when live mode is off
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        }

        // Cleanup on component unmount
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, [isLiveMode]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
            }
        };
    }, []);

    const handleSearch = () => {
        const searchFilters = {
            search: searchTerm,
            severity: selectedSeverity,
            category: selectedCategory,
            action: selectedAction,
            user_id: selectedUser,
            date_from: dateFrom,
            date_to: dateTo,
            per_page: 1000, // Load more logs for terminal view
        };

        Object.keys(searchFilters).forEach((key) => {
            if (!searchFilters[key] || searchFilters[key] === "all") {
                delete searchFilters[key];
            }
        });

        router.get(
            route("clinic.activity-logs.index", auth.clinic.id),
            searchFilters,
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedSeverity("all");
        setSelectedCategory("all");
        setSelectedAction("all");
        setSelectedUser("all");
        setDateFrom("");
        setDateTo("");

        router.get(
            route("clinic.activity-logs.index", auth.clinic.id),
            { per_page: 1000 }, // Load more logs for terminal view
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const toggleLogExpansion = (logId) => {
        const newExpanded = new Set(expandedLogs);
        if (newExpanded.has(logId)) {
            newExpanded.delete(logId);
        } else {
            newExpanded.add(logId);
        }
        setExpandedLogs(newExpanded);
    };

    const handleRefresh = (silent = false) => {
        if (!silent) {
            setIsRefreshing(true);
        }

        router.reload({
            only: ["logs", "stats"], // Only reload logs and stats data
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                if (!silent) {
                    setIsRefreshing(false);
                }
            },
        });
    };

    const handleExport = (format = "csv") => {
        const exportFilters = {
            search: searchTerm,
            severity: selectedSeverity,
            category: selectedCategory,
            action: selectedAction,
            user_id: selectedUser,
            date_from: dateFrom,
            date_to: dateTo,
            format: format,
        };

        Object.keys(exportFilters).forEach((key) => {
            if (!exportFilters[key] || exportFilters[key] === "all") {
                delete exportFilters[key];
            }
        });

        const queryString = new URLSearchParams(exportFilters).toString();
        window.open(
            route("clinic.activity-logs.export", auth.clinic.id) +
                "?" +
                queryString,
            "_blank"
        );
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case "low":
                return <CheckCircle className="w-3 h-3 text-green-400" />;
            case "medium":
                return <Clock className="w-3 h-3 text-yellow-400" />;
            case "high":
                return <AlertTriangle className="w-3 h-3 text-orange-400" />;
            case "critical":
                return <XCircle className="w-3 h-3 text-red-400" />;
            default:
                return <Activity className="w-3 h-3 text-gray-400" />;
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case "low":
                return "text-emerald-400";
            case "medium":
                return "text-amber-400";
            case "high":
                return "text-orange-400";
            case "critical":
                return "text-red-400";
            default:
                return "text-blue-400";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "patient_management":
                return <Users className="w-3 h-3 text-blue-400" />;
            case "payment_management":
                return <DollarSign className="w-3 h-3 text-green-400" />;
            case "treatment_management":
                return <Stethoscope className="w-3 h-3 text-purple-400" />;
            case "inventory_management":
                return <Package className="w-3 h-3 text-orange-400" />;
            case "appointment_management":
                return <CalendarIcon className="w-3 h-3 text-indigo-400" />;
            case "user_management":
                return <Settings className="w-3 h-3 text-gray-400" />;
            case "system_access":
                return <Shield className="w-3 h-3 text-red-400" />;
            default:
                return <FileText className="w-3 h-3 text-gray-400" />;
        }
    };

    const getActionColor = (action) => {
        switch (action.toLowerCase()) {
            case "created":
                return "text-emerald-400";
            case "updated":
                return "text-blue-400";
            case "deleted":
                return "text-red-400";
            case "login":
                return "text-emerald-400";
            case "logout":
                return "text-gray-400";
            case "restored":
                return "text-amber-400";
            default:
                return "text-blue-400";
        }
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const logDate = new Date(date);
        const diffInMinutes = Math.floor((now - logDate) / (1000 * 60));

        if (diffInMinutes < 1) return "now";
        if (diffInMinutes < 60) return `${diffInMinutes}m`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;

        return format(logDate, "MMM dd");
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "clinic_admin":
                return "text-red-400";
            case "dentist":
                return "text-blue-400";
            case "staff":
                return "text-emerald-400";
            case "patient":
                return "text-gray-400";
            default:
                return "text-blue-400";
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Activity Monitoring" />

            <div className="space-y-6">
                {/* Compact Terminal-Style Header */}
                <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 border-blue-500 shadow-lg">
                    <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-white" />
                                    <CardTitle className="text-white font-mono text-sm">
                                        activity-monitor@clinic-{auth.clinic.id}
                                    </CardTitle>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-white/80">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="font-mono">LIVE</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRefresh()}
                                    disabled={isRefreshing}
                                    className="h-7 px-2 border-white/30 bg-white/20 text-white hover:bg-white/30"
                                >
                                    <RefreshCw
                                        className={`w-3 h-3 ${
                                            isRefreshing ? "animate-spin" : ""
                                        }`}
                                    />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards - Clinic Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-sky-100 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700">
                                Total Activities
                            </CardTitle>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600 font-mono">
                                {stats.summary?.total_activities || 0}
                            </div>
                            <p className="text-xs text-blue-500 mt-1">
                                Last {stats.period_days} days
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-700">
                                Active Users
                            </CardTitle>
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Users className="h-4 w-4 text-emerald-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600 font-mono">
                                {stats.summary?.active_users || 0}
                            </div>
                            <p className="text-xs text-emerald-500 mt-1">
                                Users with activity
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 hover:border-amber-300 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-amber-700">
                                High Priority
                            </CardTitle>
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-amber-600 font-mono">
                                {(stats.summary?.high_activities || 0) +
                                    (stats.summary?.critical_activities || 0)}
                            </div>
                            <p className="text-xs text-amber-500 mt-1">
                                High + Critical events
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-rose-100 border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-700">
                                Deletions
                            </CardTitle>
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="h-4 w-4 text-red-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600 font-mono">
                                {stats.summary?.deleted_items || 0}
                            </div>
                            <p className="text-xs text-red-500 mt-1">
                                Deletion events
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Compact Filters */}
                <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200 shadow-lg">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Filter className="w-4 h-4 text-blue-600" />
                            <span className="font-mono text-blue-700 font-medium">
                                filter-controls
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="search"
                                    className="text-blue-700 text-sm font-medium"
                                >
                                    Search
                                </Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-3 w-3 text-blue-500" />
                                    <Input
                                        id="search"
                                        placeholder="Search activities..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-7 h-8 text-sm bg-white border-blue-200 text-gray-700 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-blue-700 text-sm font-medium">
                                    Severity
                                </Label>
                                <Select
                                    value={selectedSeverity}
                                    onValueChange={setSelectedSeverity}
                                >
                                    <SelectTrigger className="h-8 text-sm bg-white border-blue-200 text-gray-700 focus:border-blue-400 focus:ring-blue-400">
                                        <SelectValue placeholder="All severities" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-blue-200">
                                        <SelectItem
                                            value="all"
                                            className="text-gray-700"
                                        >
                                            All severities
                                        </SelectItem>
                                        {severityOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="text-gray-700"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-blue-700 text-sm font-medium">
                                    Category
                                </Label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                >
                                    <SelectTrigger className="h-8 text-sm bg-white border-blue-200 text-gray-700 focus:border-blue-400 focus:ring-blue-400">
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-blue-200">
                                        <SelectItem
                                            value="all"
                                            className="text-gray-700"
                                        >
                                            All categories
                                        </SelectItem>
                                        {categoryOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="text-gray-700"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-blue-700 text-sm font-medium">
                                    Action
                                </Label>
                                <Select
                                    value={selectedAction}
                                    onValueChange={setSelectedAction}
                                >
                                    <SelectTrigger className="h-8 text-sm bg-white border-blue-200 text-gray-700 focus:border-blue-400 focus:ring-blue-400">
                                        <SelectValue placeholder="All actions" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-blue-200">
                                        <SelectItem
                                            value="all"
                                            className="text-gray-700"
                                        >
                                            All actions
                                        </SelectItem>
                                        {actionOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                className="text-gray-700"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-blue-700 text-sm font-medium">
                                    User
                                </Label>
                                <Select
                                    value={selectedUser}
                                    onValueChange={setSelectedUser}
                                >
                                    <SelectTrigger className="h-8 text-sm bg-white border-blue-200 text-gray-700 focus:border-blue-400 focus:ring-blue-400">
                                        <SelectValue placeholder="All users" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-blue-200">
                                        <SelectItem
                                            value="all"
                                            className="text-gray-700"
                                        >
                                            All users
                                        </SelectItem>
                                        {filterOptions.users.map((user) => (
                                            <SelectItem
                                                key={user.value}
                                                value={user.value}
                                                className="text-gray-700"
                                            >
                                                {user.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <Button
                                onClick={handleSearch}
                                size="sm"
                                className="h-7 px-3 text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                            >
                                <Search className="w-3 h-3 mr-1" />
                                Execute
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="h-7 px-3 text-xs border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                            >
                                <FilterX className="w-3 h-3 mr-1" />
                                Clear
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExport("csv")}
                                className="h-7 px-3 text-xs border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                            >
                                <Download className="w-3 h-3 mr-1" />
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Terminal-Style Activity Log */}
                <Card className="bg-black border-gray-700 shadow-lg">
                    <CardHeader className="py-3 bg-gray-900 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-green-400">
                                <Monitor className="w-4 h-4 text-green-400" />
                                <span className="font-mono text-base">
                                    activity-log
                                </span>
                                {isRefreshing && (
                                    <div className="flex items-center gap-1 text-xs text-green-400">
                                        <RefreshCw className="w-3 h-3 animate-spin" />
                                        <span>updating...</span>
                                    </div>
                                )}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-green-400">
                                    <span>Auto-scroll:</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setAutoScroll(!autoScroll)
                                        }
                                        className={`h-6 px-2 text-xs ${
                                            autoScroll
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-700 text-green-400"
                                        }`}
                                    >
                                        {autoScroll ? "ON" : "OFF"}
                                    </Button>
                                </div>
                                <div className="text-xs text-green-400 font-mono">
                                    {logs.data.length} / {logs.total} entries
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div
                            ref={terminalRef}
                            className="bg-black border border-gray-700 rounded-lg h-96 overflow-y-auto font-mono text-sm"
                            style={{
                                fontFamily:
                                    'Monaco, Menlo, "Ubuntu Mono", monospace',
                            }}
                        >
                            {logs.data.length === 0 ? (
                                <div className="p-4 text-gray-500">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>
                                            Waiting for activity logs...
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-600 ml-4">
                                        System is monitoring for new activities
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1 p-1">
                                    {logs.data.map((log, index) => {
                                        const isExpanded = expandedLogs.has(
                                            log.id
                                        );
                                        const hasChanges =
                                            log.change_metadata &&
                                            log.change_metadata.total_changes >
                                                0;

                                        return (
                                            <div
                                                key={log.id}
                                                className="bg-gray-900 border border-gray-700 rounded hover:bg-gray-800 transition-colors"
                                            >
                                                {/* Ultra-Compact Single Row */}
                                                <div className="p-1">
                                                    <div className="flex items-center gap-1 text-xs">
                                                        {/* Entry Number */}
                                                        <span className="text-gray-400 font-mono bg-gray-800 px-1 py-0.5 rounded text-xs">
                                                            #{index + 1}
                                                        </span>

                                                        {/* Time */}
                                                        <span className="text-gray-400 font-mono">
                                                            {formatTimeAgo(
                                                                log.created_at
                                                            )}
                                                        </span>

                                                        {/* Severity Badge */}
                                                        <span
                                                            className={`px-1 py-0.5 rounded text-xs ${
                                                                log.severity ===
                                                                "critical"
                                                                    ? "bg-red-900 text-red-300"
                                                                    : log.severity ===
                                                                      "high"
                                                                    ? "bg-orange-900 text-orange-300"
                                                                    : log.severity ===
                                                                      "medium"
                                                                    ? "bg-yellow-900 text-yellow-300"
                                                                    : "bg-green-900 text-green-300"
                                                            }`}
                                                        >
                                                            {log.severity.toUpperCase()}
                                                        </span>

                                                        {/* Action Badge */}
                                                        <span
                                                            className={`px-1 py-0.5 rounded text-xs ${
                                                                log.action ===
                                                                "created"
                                                                    ? "bg-green-900 text-green-300"
                                                                    : log.action ===
                                                                      "updated"
                                                                    ? "bg-blue-900 text-blue-300"
                                                                    : log.action ===
                                                                      "deleted"
                                                                    ? "bg-red-900 text-red-300"
                                                                    : log.action ===
                                                                      "restored"
                                                                    ? "bg-purple-900 text-purple-300"
                                                                    : log.action ===
                                                                      "login"
                                                                    ? "bg-green-900 text-green-300"
                                                                    : log.action ===
                                                                      "logout"
                                                                    ? "bg-gray-900 text-gray-300"
                                                                    : "bg-gray-900 text-gray-300"
                                                            }`}
                                                        >
                                                            {log.action.toUpperCase()}
                                                        </span>

                                                        {/* Category */}
                                                        <div className="flex items-center gap-1">
                                                            {getCategoryIcon(
                                                                log.category
                                                            )}
                                                            <span className="text-gray-400 capitalize">
                                                                {log.category.replace(
                                                                    "-",
                                                                    " "
                                                                )}
                                                            </span>
                                                        </div>

                                                        {/* User */}
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-3 h-3 text-gray-400" />
                                                            <span className="text-green-400 font-medium">
                                                                {log.user
                                                                    ?.name ||
                                                                    "Unknown"}
                                                            </span>
                                                            <span className="text-gray-500">
                                                                (
                                                                {log.user
                                                                    ?.role ||
                                                                    "unknown"}
                                                                )
                                                            </span>
                                                        </div>

                                                        {/* IP Address */}
                                                        <div className="flex items-center gap-1 ml-auto">
                                                            <span className="font-mono text-gray-500">
                                                                IP:{" "}
                                                                {log.ip_address ||
                                                                    "N/A"}
                                                            </span>
                                                        </div>

                                                        {/* Expand/Collapse Button */}
                                                        {hasChanges && (
                                                            <button
                                                                onClick={() =>
                                                                    toggleLogExpansion(
                                                                        log.id
                                                                    )
                                                                }
                                                                className="ml-2 p-0.5 hover:bg-gray-700 rounded"
                                                            >
                                                                {isExpanded ? (
                                                                    <ChevronUp className="w-3 h-3 text-gray-400" />
                                                                ) : (
                                                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <div className="text-gray-200 text-xs mt-0.5 ml-2">
                                                        {log.description}
                                                    </div>

                                                    {/* Expandable Change Details */}
                                                    {hasChanges &&
                                                        isExpanded && (
                                                            <div className="mt-1 pt-1 border-t border-gray-700">
                                                                {/* Impact Summary */}
                                                                <div className="flex items-center gap-2 mb-1 text-xs">
                                                                    <div className="flex items-center gap-1">
                                                                        <div
                                                                            className={`w-1 h-1 rounded-full ${
                                                                                log
                                                                                    .change_metadata
                                                                                    .impact_score >=
                                                                                10
                                                                                    ? "bg-red-500"
                                                                                    : log
                                                                                          .change_metadata
                                                                                          .impact_score >=
                                                                                      5
                                                                                    ? "bg-orange-500"
                                                                                    : log
                                                                                          .change_metadata
                                                                                          .impact_score >=
                                                                                      3
                                                                                    ? "bg-yellow-500"
                                                                                    : "bg-green-500"
                                                                            }`}
                                                                        ></div>
                                                                        <span className="text-gray-300">
                                                                            Impact:{" "}
                                                                            {
                                                                                log
                                                                                    .change_metadata
                                                                                    .impact_score
                                                                            }
                                                                            /10
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-gray-500">
                                                                        •
                                                                    </div>
                                                                    <span className="text-gray-300">
                                                                        {
                                                                            log
                                                                                .change_metadata
                                                                                .total_changes
                                                                        }{" "}
                                                                        changes
                                                                    </span>
                                                                    {log
                                                                        .change_metadata
                                                                        .critical_changes >
                                                                        0 && (
                                                                        <>
                                                                            <div className="text-gray-500">
                                                                                •
                                                                            </div>
                                                                            <span className="text-red-400">
                                                                                {
                                                                                    log
                                                                                        .change_metadata
                                                                                        .critical_changes
                                                                                }{" "}
                                                                                critical
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                    {log
                                                                        .change_metadata
                                                                        .high_changes >
                                                                        0 && (
                                                                        <>
                                                                            <div className="text-gray-500">
                                                                                •
                                                                            </div>
                                                                            <span className="text-orange-400">
                                                                                {
                                                                                    log
                                                                                        .change_metadata
                                                                                        .high_changes
                                                                                }{" "}
                                                                                high-risk
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>

                                                                {/* All Field Changes */}
                                                                <div className="space-y-0.5">
                                                                    {log.change_metadata.changed_fields.map(
                                                                        (
                                                                            change,
                                                                            changeIndex
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    changeIndex
                                                                                }
                                                                                className={`px-1 py-0.5 rounded text-xs ${
                                                                                    change.importance ===
                                                                                    "critical"
                                                                                        ? "bg-red-900/20 border border-red-700/50"
                                                                                        : change.importance ===
                                                                                          "high"
                                                                                        ? "bg-orange-900/20 border border-orange-700/50"
                                                                                        : change.importance ===
                                                                                          "sensitive"
                                                                                        ? "bg-yellow-900/20 border border-yellow-700/50"
                                                                                        : "bg-gray-800/50 border border-gray-700/50"
                                                                                }`}
                                                                            >
                                                                                <div className="flex items-center justify-between">
                                                                                    <span
                                                                                        className={`font-mono ${
                                                                                            change.importance ===
                                                                                            "critical"
                                                                                                ? "text-red-300"
                                                                                                : change.importance ===
                                                                                                  "high"
                                                                                                ? "text-orange-300"
                                                                                                : change.importance ===
                                                                                                  "sensitive"
                                                                                                ? "text-yellow-300"
                                                                                                : "text-gray-300"
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            change.field_name
                                                                                        }
                                                                                    </span>
                                                                                    <div className="flex items-center gap-1 text-xs">
                                                                                        <span className="text-gray-500">
                                                                                            {change.old_value ||
                                                                                                "null"}
                                                                                        </span>
                                                                                        <span className="text-gray-400">
                                                                                            →
                                                                                        </span>
                                                                                        <span className="text-green-400">
                                                                                            {change.new_value ||
                                                                                                "null"}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Empty State */}
                            {(!logs.data || logs.data.length === 0) && (
                                <div className="text-center py-12 text-gray-400">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                    <p className="text-xl font-medium mb-2">
                                        No activity logs found
                                    </p>
                                    <p className="text-sm">
                                        Activity logs will appear here as users
                                        perform actions in the system.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Terminal Status */}
                <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200 shadow-lg">
                    <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-blue-600 font-mono">
                                Terminal Status: {logs.data?.length || 0} logs
                                loaded | Auto-refresh every 3s
                            </div>
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="font-mono">LIVE</span>
                                </div>
                                <span className="font-mono">
                                    {autoScroll
                                        ? "AUTO-SCROLL ON"
                                        : "AUTO-SCROLL OFF"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
