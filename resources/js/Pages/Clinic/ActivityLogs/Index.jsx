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

    const formatTimestamp = (date) => {
        const logDate = new Date(date);

        // Always show full date and time: YYYY-MM-DD HH:MM:SS
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
            .replace(/,/g, ""); // Remove commas for cleaner look
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

                {/* Statistics Cards - Compact Style with Visual Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-blue-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-lg shadow-md flex-shrink-0">
                                    <Activity className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        Total Activities
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {stats.summary?.total_activities || 0}
                                    </p>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] text-blue-600 font-medium truncate">
                                            Last {stats.period_days} days
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-green-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-lg shadow-md flex-shrink-0">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        Active Users
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {stats.summary?.active_users || 0}
                                    </p>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] text-green-600 font-medium truncate">
                                            Users with activity
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-amber-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-lg shadow-md flex-shrink-0">
                                    <AlertTriangle className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        High Priority
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {(stats.summary?.high_activities || 0) +
                                            (stats.summary
                                                ?.critical_activities || 0)}
                                    </p>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] text-amber-600 font-medium truncate">
                                            High + Critical
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 border border-red-100/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full -translate-y-8 translate-x-8 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-full translate-y-6 -translate-x-6 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                        <CardContent className="p-3 relative">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <div className="p-2 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-lg shadow-md flex-shrink-0">
                                    <XCircle className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0 w-full">
                                    <p className="text-[10px] text-gray-600 font-medium mb-0.5 leading-none">
                                        Deletions
                                    </p>
                                    <p className="text-base font-bold text-gray-900 leading-none">
                                        {stats.summary?.deleted_items || 0}
                                    </p>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                                        <span className="text-[9px] text-red-600 font-medium truncate">
                                            Deletion events
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters - Compact Single Row */}
                <Card className="border-0 shadow-lg bg-white border border-gray-200">
                    <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search activities..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {/* Filter Dropdowns */}
                            <Select
                                value={selectedSeverity}
                                onValueChange={setSelectedSeverity}
                            >
                                <SelectTrigger className="w-28 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                    <SelectValue placeholder="Severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Severity
                                    </SelectItem>
                                    {severityOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-36 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Category
                                    </SelectItem>
                                    {categoryOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedAction}
                                onValueChange={setSelectedAction}
                            >
                                <SelectTrigger className="w-28 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                    <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Action</SelectItem>
                                    {actionOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedUser}
                                onValueChange={setSelectedUser}
                            >
                                <SelectTrigger className="w-36 h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                    <SelectValue placeholder="User" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">User</SelectItem>
                                    {filterOptions.users.map((user) => (
                                        <SelectItem
                                            key={user.value}
                                            value={user.value}
                                        >
                                            {user.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Action Buttons */}
                            <Button
                                onClick={handleSearch}
                                className="h-10 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                            >
                                <Search className="h-4 w-4 mr-2" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="h-10 px-4 border-gray-300"
                            >
                                <FilterX className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleExport("csv")}
                                className="h-10 px-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                                <Download className="h-4 w-4" />
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
                                                            {formatTimestamp(
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
