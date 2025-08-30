import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Users,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    RefreshCw,
    Play,
    Zap,
    TrendingUp,
    Activity,
    Star,
    Search,
    Filter,
    Download,
    Eye,
    Settings,
    DollarSign,
    BarChart3,
    PieChart,
    Bell,
    Shield,
    Plus,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Target,
    Award,
    Rocket,
    Heart,
    Crown,
    Gem,
    Building,
} from "lucide-react";
import { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

const STATUS_COLORS = {
    active: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 shadow-green-100",
    trial: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 shadow-blue-100",
    grace_period:
        "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200 shadow-yellow-100",
    suspended:
        "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200 shadow-red-100",
    inactive:
        "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200 shadow-gray-100",
};

const STATUS_ICONS = {
    active: CheckCircle,
    trial: Star,
    grace_period: Clock,
    suspended: XCircle,
    inactive: XCircle,
};

const PLAN_COLORS = {
    basic: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 shadow-blue-100",
    premium:
        "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200 shadow-purple-100",
    enterprise:
        "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 shadow-emerald-100",
};

const PLAN_ICONS = {
    basic: Target,
    premium: Crown,
    enterprise: Gem,
};

export default function SubscriptionsIndex({ auth, stats, clinics }) {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [overrideData, setOverrideData] = useState({
        subscription_status: "active",
        reason: "",
        extend_days: 0,
        extend_hours: 0,
        extend_minutes: 0,
        testing_mode: false,
    });

    const handleCheckStatus = async (clinicId) => {
        setRefreshing(true);
        try {
            await axios.post(
                route("admin.subscriptions.check-status", clinicId)
            );
            window.location.reload();
        } catch (error) {
            console.error("Failed to check status:", error);
        }
        setRefreshing(false);
    };

    const handleStartTrial = async (clinicId) => {
        setLoading(true);
        try {
            await axios.post(
                route("admin.subscriptions.start-trial", clinicId)
            );
            window.location.reload();
        } catch (error) {
            console.error("Failed to start trial:", error);
        }
        setLoading(false);
    };

    const handleRunConsoleCommand = async () => {
        setRefreshing(true);
        try {
            await axios.post(route("admin.subscriptions.check-expirations"));
            window.location.reload();
        } catch (error) {
            console.error("Failed to run console command:", error);
        }
        setRefreshing(false);
    };

    const handleOverrideStatus = async () => {
        if (!selectedClinic) return;

        setLoading(true);
        try {
            await axios.post(
                route("admin.subscriptions.override-status", selectedClinic.id),
                overrideData
            );
            setOverrideDialogOpen(false);
            setSelectedClinic(null);
            setOverrideData({
                subscription_status: "active",
                reason: "",
                extend_days: 0,
                extend_hours: 0,
                extend_minutes: 0,
                testing_mode: false,
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to override status:", error);
        }
        setLoading(false);
    };

    const openOverrideDialog = (clinic) => {
        setSelectedClinic(clinic);
        setOverrideData({
            subscription_status: clinic.subscription_status,
            reason: "",
            extend_days: 0,
            extend_hours: 0,
            extend_minutes: 0,
            testing_mode: false,
        });
        setOverrideDialogOpen(true);
    };

    const toggleExpandedRow = (clinicId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(clinicId)) {
            newExpanded.delete(clinicId);
        } else {
            newExpanded.add(clinicId);
        }
        setExpandedRows(newExpanded);
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    // Filter and sort clinics
    const filteredClinics = clinics
        .filter((clinic) => {
            const matchesSearch =
                clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                clinic.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "all" ||
                clinic.subscription_status === statusFilter;
            const matchesPlan =
                planFilter === "all" || clinic.subscription_plan === planFilter;
            return matchesSearch && matchesStatus && matchesPlan;
        })
        .sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "name":
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case "status":
                    aValue = a.subscription_status;
                    bValue = b.subscription_status;
                    break;
                case "plan":
                    aValue = a.subscription_plan;
                    bValue = b.subscription_plan;
                    break;
                case "expiry":
                    aValue = a.subscription_end_date || new Date(0);
                    bValue = b.subscription_end_date || new Date(0);
                    break;
                case "users":
                    aValue = a.users_count || 0;
                    bValue = b.users_count || 0;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getDaysUntilExpiry = (endDate) => {
        if (!endDate) return null;
        const days = Math.ceil(
            (new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return days;
    };

    const getStatusBadge = (status) => {
        const Icon = STATUS_ICONS[status] || XCircle;
        return (
            <Badge
                className={`${STATUS_COLORS[status]} flex items-center gap-1 shadow-lg`}
            >
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getPlanBadge = (plan) => {
        const Icon = PLAN_ICONS[plan] || Target;
        return (
            <Badge
                className={`${PLAN_COLORS[plan]} flex items-center gap-1 shadow-lg`}
            >
                <Icon className="w-3 h-3" />
                {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Badge>
        );
    };

    const statCards = [
        {
            title: "Total Clinics",
            value: stats.total_clinics,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-gradient-to-br from-blue-500 to-cyan-600",
            gradient: "from-blue-500 to-cyan-600",
            description: "All registered clinics",
        },
        {
            title: "Active Subscriptions",
            value: stats.active_subscriptions,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
            gradient: "from-green-500 to-emerald-600",
            description: "Fully active subscriptions",
        },
        {
            title: "Trial Clinics",
            value: stats.trial_clinics,
            icon: Star,
            color: "text-blue-600",
            bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
            gradient: "from-blue-500 to-indigo-600",
            description: "In 14-day trial period",
        },
        {
            title: "Grace Period",
            value: stats.grace_period,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-gradient-to-br from-yellow-500 to-orange-600",
            gradient: "from-yellow-500 to-orange-600",
            description: "7-day grace period",
        },
        {
            title: "Suspended",
            value: stats.suspended,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-gradient-to-br from-red-500 to-pink-600",
            gradient: "from-red-500 to-pink-600",
            description: "Past grace period",
        },
        {
            title: "Expiring Soon",
            value: stats.expiring_soon,
            icon: AlertTriangle,
            color: "text-orange-600",
            bgColor: "bg-gradient-to-br from-orange-500 to-red-600",
            gradient: "from-orange-500 to-red-600",
            description: "Within 7 days",
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Subscription Management
                </h2>
            }
        >
            <Head title="Subscription Management - Smile Suite" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Subscription Dashboard
                                        </h1>
                                        <p className="text-gray-600 mt-1 text-sm">
                                            Monitor and manage clinic
                                            subscriptions with advanced controls
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "admin.subscription-requests.index"
                                                )
                                            )
                                        }
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                                    >
                                        <Bell className="w-4 h-4" />
                                        View Requests
                                    </button>
                                    <button
                                        onClick={handleRunConsoleCommand}
                                        disabled={refreshing}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Check Expirations
                                    </button>
                                    <button
                                        onClick={() => window.location.reload()}
                                        disabled={refreshing}
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                                    >
                                        <RefreshCw
                                            className={`w-4 h-4 ${
                                                refreshing ? "animate-spin" : ""
                                            }`}
                                        />
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Statistics Cards with Animations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-8">
                        {statCards.map((stat, index) => (
                            <Card
                                key={index}
                                className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                {stat.title}
                                            </p>
                                            <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                                {stat.value}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {stat.description}
                                            </p>
                                        </div>
                                        <div
                                            className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300`}
                                        >
                                            <stat.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Enhanced Clinics Table */}
                    <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                            <div className="space-y-4">
                                {/* Table Title and Sort Controls */}
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Activity className="w-5 h-5 text-white" />
                                        </div>
                                        Clinic Subscriptions (
                                        {filteredClinics.length} of{" "}
                                        {clinics.length})
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>Sort by:</span>
                                        <select
                                            value={`${sortBy}-${sortOrder}`}
                                            onChange={(e) => {
                                                const [field, order] =
                                                    e.target.value.split("-");
                                                setSortBy(field);
                                                setSortOrder(order);
                                            }}
                                            className="px-3 py-1 border-2 border-blue-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="name-asc">
                                                Name (A-Z)
                                            </option>
                                            <option value="name-desc">
                                                Name (Z-A)
                                            </option>
                                            <option value="status-asc">
                                                Status (A-Z)
                                            </option>
                                            <option value="status-desc">
                                                Status (Z-A)
                                            </option>
                                            <option value="plan-asc">
                                                Plan (A-Z)
                                            </option>
                                            <option value="plan-desc">
                                                Plan (Z-A)
                                            </option>
                                            <option value="expiry-asc">
                                                Expiry (Earliest)
                                            </option>
                                            <option value="expiry-desc">
                                                Expiry (Latest)
                                            </option>
                                            <option value="users-asc">
                                                Users (Low-High)
                                            </option>
                                            <option value="users-desc">
                                                Users (High-Low)
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                {/* Search and Filter Controls - Integrated in table header */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Search clinics..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="all">
                                            All Statuses
                                        </option>
                                        <option value="active">Active</option>
                                        <option value="trial">Trial</option>
                                        <option value="grace_period">
                                            Grace Period
                                        </option>
                                        <option value="suspended">
                                            Suspended
                                        </option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                    <select
                                        value={planFilter}
                                        onChange={(e) =>
                                            setPlanFilter(e.target.value)
                                        }
                                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    >
                                        <option value="all">All Plans</option>
                                        <option value="basic">Basic</option>
                                        <option value="premium">Premium</option>
                                        <option value="enterprise">
                                            Enterprise
                                        </option>
                                    </select>
                                    <Button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setStatusFilter("all");
                                            setPlanFilter("all");
                                        }}
                                        variant="outline"
                                        className="border-2 border-blue-200 hover:bg-blue-50 text-blue-700 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                    >
                                        <Filter className="w-4 h-4 mr-2" />
                                        Clear Filters
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                                            <th className="text-left py-4 px-6 font-semibold text-blue-900">
                                                Clinic
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                                onClick={() =>
                                                    handleSort("plan")
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    Plan
                                                    {sortBy === "plan" &&
                                                        (sortOrder === "asc" ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ))}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                                onClick={() =>
                                                    handleSort("status")
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    Status
                                                    {sortBy === "status" &&
                                                        (sortOrder === "asc" ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ))}
                                                </div>
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                                onClick={() =>
                                                    handleSort("expiry")
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    End Date
                                                    {sortBy === "expiry" &&
                                                        (sortOrder === "asc" ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ))}
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-6 font-semibold text-blue-900">
                                                Days Left
                                            </th>
                                            <th
                                                className="text-left py-4 px-6 font-semibold text-blue-900 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
                                                onClick={() =>
                                                    handleSort("users")
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    Users
                                                    {sortBy === "users" &&
                                                        (sortOrder === "asc" ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ))}
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-6 font-semibold text-blue-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClinics.map(
                                            (clinic, index) => {
                                                const daysLeft =
                                                    getDaysUntilExpiry(
                                                        clinic.subscription_end_date
                                                    );
                                                const isExpanded =
                                                    expandedRows.has(clinic.id);
                                                return (
                                                    <>
                                                        <tr
                                                            key={clinic.id}
                                                            className={`border-b border-blue-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer transition-all duration-300 ${
                                                                index % 2 === 0
                                                                    ? "bg-white/50"
                                                                    : "bg-blue-50/30"
                                                            }`}
                                                            onClick={() =>
                                                                toggleExpandedRow(
                                                                    clinic.id
                                                                )
                                                            }
                                                        >
                                                            <td className="py-4 px-6">
                                                                <div className="flex items-center gap-3">
                                                                    {isExpanded ? (
                                                                        <ChevronUp className="w-5 h-5 text-blue-500" />
                                                                    ) : (
                                                                        <ChevronDown className="w-5 h-5 text-blue-500" />
                                                                    )}
                                                                    <div>
                                                                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                                                                            {
                                                                                clinic.name
                                                                            }
                                                                            {clinic.subscription_status ===
                                                                                "trial" && (
                                                                                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 text-xs shadow-lg animate-pulse">
                                                                                    🎉
                                                                                    TRIAL
                                                                                </Badge>
                                                                            )}
                                                                            {clinic.subscription_status ===
                                                                                "grace_period" && (
                                                                                <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-200 text-xs shadow-lg animate-pulse">
                                                                                    ⏰
                                                                                    GRACE
                                                                                </Badge>
                                                                            )}
                                                                            {clinic.subscription_status ===
                                                                                "suspended" && (
                                                                                <Badge className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200 text-xs shadow-lg animate-pulse">
                                                                                    🔴
                                                                                    SUSPENDED
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm text-gray-500">
                                                                            {
                                                                                clinic.email
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {getPlanBadge(
                                                                    clinic.subscription_plan
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {getStatusBadge(
                                                                    clinic.subscription_status
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="text-sm text-gray-900">
                                                                    {formatDate(
                                                                        clinic.subscription_end_date
                                                                    )}
                                                                </div>
                                                                {clinic.trial_ends_at && (
                                                                    <div className="text-xs text-blue-600 font-medium">
                                                                        Trial:{" "}
                                                                        {formatDate(
                                                                            clinic.trial_ends_at
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                {daysLeft !==
                                                                null ? (
                                                                    <div
                                                                        className={`text-sm font-bold px-3 py-2 rounded-xl shadow-md ${
                                                                            daysLeft <
                                                                            0
                                                                                ? "text-red-700 bg-gradient-to-r from-red-100 to-pink-100 border border-red-200"
                                                                                : daysLeft <=
                                                                                  7
                                                                                ? "text-yellow-700 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200"
                                                                                : "text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200"
                                                                        }`}
                                                                    >
                                                                        {daysLeft <
                                                                        0
                                                                            ? `${Math.abs(
                                                                                  daysLeft
                                                                              )} days overdue`
                                                                            : daysLeft ===
                                                                              0
                                                                            ? "Expires today"
                                                                            : `${daysLeft} days`}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-500 bg-gradient-to-r from-gray-100 to-slate-100 border border-gray-200 px-3 py-2 rounded-xl shadow-md">
                                                                        N/A
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                                                        <Users className="w-4 h-4 text-white" />
                                                                    </div>
                                                                    <span className="text-sm font-bold text-gray-700">
                                                                        {clinic.users_count ||
                                                                            0}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-6">
                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            handleCheckStatus(
                                                                                clinic.id
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            refreshing
                                                                        }
                                                                        className="hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                    >
                                                                        <RefreshCw className="w-3 h-3" />
                                                                    </Button>
                                                                    {clinic.subscription_status ===
                                                                        "inactive" && (
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                handleStartTrial(
                                                                                    clinic.id
                                                                                );
                                                                            }}
                                                                            disabled={
                                                                                loading
                                                                            }
                                                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                        >
                                                                            <Play className="w-3 h-3 mr-1" />
                                                                            Start
                                                                            Trial
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            openOverrideDialog(
                                                                                clinic
                                                                            );
                                                                        }}
                                                                        className="hover:bg-orange-50 border-orange-200 text-orange-700 hover:border-orange-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                    >
                                                                        <Settings className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            router.visit(
                                                                                route(
                                                                                    "admin.clinics.show",
                                                                                    clinic.id
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="hover:bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-300 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                    >
                                                                        <Eye className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {isExpanded && (
                                                            <tr
                                                                key={`${clinic.id}-expanded`}
                                                                className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                                                            >
                                                                <td
                                                                    colSpan="7"
                                                                    className="px-6 py-4"
                                                                >
                                                                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-200">
                                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                                                                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                                                                    <DollarSign className="w-4 h-4" />
                                                                                    Subscription
                                                                                    Details
                                                                                </h4>
                                                                                <div className="space-y-3 text-sm">
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-blue-700 font-medium">
                                                                                            Plan:
                                                                                        </span>
                                                                                        {getPlanBadge(
                                                                                            clinic.subscription_plan
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-blue-700 font-medium">
                                                                                            Status:
                                                                                        </span>
                                                                                        {getStatusBadge(
                                                                                            clinic.subscription_status
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-blue-600">
                                                                                            Start
                                                                                            Date:
                                                                                        </span>
                                                                                        <span className="font-medium text-blue-900">
                                                                                            {formatDate(
                                                                                                clinic.subscription_start_date
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-blue-600">
                                                                                            End
                                                                                            Date:
                                                                                        </span>
                                                                                        <span className="font-medium text-blue-900">
                                                                                            {formatDate(
                                                                                                clinic.subscription_end_date
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                    {clinic.trial_ends_at && (
                                                                                        <div className="flex justify-between">
                                                                                            <span className="text-blue-600">
                                                                                                Trial
                                                                                                Ends:
                                                                                            </span>
                                                                                            <span className="font-medium text-blue-900">
                                                                                                {formatDate(
                                                                                                    clinic.trial_ends_at
                                                                                                )}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                                                                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                                                                    <Building className="w-4 h-4" />
                                                                                    Clinic
                                                                                    Information
                                                                                </h4>
                                                                                <div className="space-y-3 text-sm">
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-blue-600">
                                                                                            Name:
                                                                                        </span>
                                                                                        <span className="font-medium text-blue-900">
                                                                                            {
                                                                                                clinic.name
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-blue-600">
                                                                                            Email:
                                                                                        </span>
                                                                                        <span className="font-medium text-blue-900">
                                                                                            {
                                                                                                clinic.email
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex justify-between items-center">
                                                                                        <span className="text-blue-600">
                                                                                            Users:
                                                                                        </span>
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Users className="w-3 h-3 text-blue-600" />
                                                                                            <span className="font-medium text-blue-900">
                                                                                                {clinic.users_count ||
                                                                                                    0}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex justify-between">
                                                                                        <span className="text-blue-600">
                                                                                            Active:
                                                                                        </span>
                                                                                        <span
                                                                                            className={`font-medium ${
                                                                                                clinic.is_active
                                                                                                    ? "text-green-600"
                                                                                                    : "text-red-600"
                                                                                            }`}
                                                                                        >
                                                                                            {clinic.is_active
                                                                                                ? "Yes"
                                                                                                : "No"}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                                                                                <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                                                                    <Rocket className="w-4 h-4" />
                                                                                    Quick
                                                                                    Actions
                                                                                </h4>
                                                                                <div className="space-y-3">
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="outline"
                                                                                        onClick={() =>
                                                                                            router.visit(
                                                                                                route(
                                                                                                    "admin.clinics.show",
                                                                                                    clinic.id
                                                                                                )
                                                                                            )
                                                                                        }
                                                                                        className="w-full justify-start border-emerald-200 text-emerald-700 hover:bg-emerald-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                                    >
                                                                                        <Eye className="w-3 h-3 mr-2" />
                                                                                        View
                                                                                        Clinic
                                                                                        Details
                                                                                    </Button>
                                                                                    <Button
                                                                                        size="sm"
                                                                                        variant="outline"
                                                                                        onClick={() =>
                                                                                            handleCheckStatus(
                                                                                                clinic.id
                                                                                            )
                                                                                        }
                                                                                        className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                                        disabled={
                                                                                            refreshing
                                                                                        }
                                                                                    >
                                                                                        <RefreshCw className="w-3 h-3 mr-2" />
                                                                                        Check
                                                                                        Status
                                                                                    </Button>
                                                                                    {clinic.subscription_status ===
                                                                                        "inactive" && (
                                                                                        <Button
                                                                                            size="sm"
                                                                                            onClick={() =>
                                                                                                handleStartTrial(
                                                                                                    clinic.id
                                                                                                )
                                                                                            }
                                                                                            className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                                                                            disabled={
                                                                                                loading
                                                                                            }
                                                                                        >
                                                                                            <Play className="w-3 h-3 mr-2" />
                                                                                            Start
                                                                                            Trial
                                                                                        </Button>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Override Status Dialog */}
            <Dialog
                open={overrideDialogOpen}
                onOpenChange={setOverrideDialogOpen}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Override Subscription Status</DialogTitle>
                        <DialogDescription>
                            Change the subscription status for{" "}
                            {selectedClinic?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="status">Subscription Status</Label>
                            <select
                                id="status"
                                value={overrideData.subscription_status}
                                onChange={(e) =>
                                    setOverrideData({
                                        ...overrideData,
                                        subscription_status: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="trial">Trial</option>
                                <option value="active">Active</option>
                                <option value="grace_period">
                                    Grace Period
                                </option>
                                <option value="suspended">Suspended</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <Label htmlFor="extend_days">Days</Label>
                                <input
                                    id="extend_days"
                                    type="number"
                                    min="0"
                                    max="365"
                                    value={overrideData.extend_days}
                                    onChange={(e) =>
                                        setOverrideData({
                                            ...overrideData,
                                            extend_days:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="extend_hours">Hours</Label>
                                <input
                                    id="extend_hours"
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={overrideData.extend_hours}
                                    onChange={(e) =>
                                        setOverrideData({
                                            ...overrideData,
                                            extend_hours:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="extend_minutes">Minutes</Label>
                                <input
                                    id="extend_minutes"
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={overrideData.extend_minutes}
                                    onChange={(e) =>
                                        setOverrideData({
                                            ...overrideData,
                                            extend_minutes:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Quick Test Presets */}
                        <div>
                            <Label className="text-sm text-gray-600 mb-2 block">
                                Quick Test Presets
                            </Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setOverrideData({
                                            ...overrideData,
                                            extend_days: 0,
                                            extend_hours: 0,
                                            extend_minutes: 1,
                                            testing_mode: true,
                                        })
                                    }
                                    className="text-xs"
                                >
                                    1 Minute (Test)
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setOverrideData({
                                            ...overrideData,
                                            extend_days: 0,
                                            extend_hours: 1,
                                            extend_minutes: 0,
                                            testing_mode: true,
                                        })
                                    }
                                    className="text-xs"
                                >
                                    1 Hour (Test)
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setOverrideData({
                                            ...overrideData,
                                            extend_days: 1,
                                            extend_hours: 0,
                                            extend_minutes: 0,
                                            testing_mode: true,
                                        })
                                    }
                                    className="text-xs"
                                >
                                    1 Day (Test)
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setOverrideData({
                                            ...overrideData,
                                            extend_days: 14,
                                            extend_hours: 0,
                                            extend_minutes: 0,
                                            testing_mode: false,
                                        })
                                    }
                                    className="text-xs"
                                >
                                    14 Days
                                </Button>
                            </div>
                        </div>

                        {/* Testing Mode Toggle */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="testing_mode"
                                checked={overrideData.testing_mode}
                                onChange={(e) =>
                                    setOverrideData({
                                        ...overrideData,
                                        testing_mode: e.target.checked,
                                    })
                                }
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="testing_mode" className="text-sm">
                                Testing Mode (Allows short durations without
                                auto-suspension)
                            </Label>
                        </div>
                        <div>
                            <Label htmlFor="reason">Reason (Optional)</Label>
                            <Textarea
                                id="reason"
                                value={overrideData.reason}
                                onChange={(e) =>
                                    setOverrideData({
                                        ...overrideData,
                                        reason: e.target.value,
                                    })
                                }
                                placeholder="Reason for status change..."
                                className="w-full"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button
                                onClick={handleOverrideStatus}
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? "Updating..." : "Update Status"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setOverrideDialogOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
