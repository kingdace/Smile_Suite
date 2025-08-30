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
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    CreditCard,
    Mail,
    Phone,
    ExternalLink,
    CalendarDays,
    Clock3,
    User,
    Building2,
} from "lucide-react";
import React, { useState } from "react";
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
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-blue-50 text-blue-700 border-blue-200",
    payment_received: "bg-purple-50 text-purple-700 border-purple-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-green-50 text-green-700 border-green-200",
};

const STATUS_ICONS = {
    pending: Clock,
    approved: CheckCircle,
    payment_received: DollarSign,
    rejected: XCircle,
    completed: CheckCircle,
};

const REQUEST_TYPE_COLORS = {
    upgrade: "bg-purple-50 text-purple-700 border-purple-200",
    renewal: "bg-blue-50 text-blue-700 border-blue-200",
};

const REQUEST_TYPE_ICONS = {
    upgrade: Crown,
    renewal: RefreshCw,
};

export default function SubscriptionRequestsIndex({
    auth,
    requests = [],
    stats = {},
}) {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [actionData, setActionData] = useState({
        calculated_amount: "",
        admin_notes: "",
        payment_verification_notes: "",
    });

    const filteredRequests = (requests || [])
        .filter((request) => {
            const matchesSearch =
                request.clinic.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                request.clinic.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                request.request_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || request.status === statusFilter;
            const matchesType =
                typeFilter === "all" || request.request_type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === "clinic.name") {
                aValue = a.clinic.name;
                bValue = b.clinic.name;
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const handleAction = async (request, type) => {
        setSelectedRequest(request);
        setActionType(type);
        setActionData({
            calculated_amount: request.calculated_amount || "",
            admin_notes: "",
            payment_verification_notes: "",
        });
        setActionDialogOpen(true);
    };

    const submitAction = async () => {
        if (!selectedRequest || !actionType) return;

        setLoading(true);
        try {
            let endpoint;
            let data = actionData;

            if (actionType === "verify-payment") {
                endpoint = route(
                    `admin.subscription-requests.verify-payment`,
                    selectedRequest.id
                );
                data = {
                    payment_verification_notes:
                        actionData.payment_verification_notes,
                };
            } else {
                endpoint = route(
                    `admin.subscription-requests.${actionType}`,
                    selectedRequest.id
                );
            }

            const response = await axios.post(endpoint, data);

            if (response.data.success) {
                setActionDialogOpen(false);
                router.reload();
            } else {
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("Action failed:", error);
            alert("Action failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleRowExpansion = (requestId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(requestId)) {
            newExpanded.delete(requestId);
        } else {
            newExpanded.add(requestId);
        }
        setExpandedRows(newExpanded);
    };

    const getStatusIcon = (status) => {
        const IconComponent = STATUS_ICONS[status];
        return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
    };

    const getRequestTypeIcon = (type) => {
        const IconComponent = REQUEST_TYPE_ICONS[type];
        return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Subscription Requests" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Building2 className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                                Subscription Requests
                                            </h1>
                                            <p className="text-blue-600 text-lg font-medium mt-1">
                                                Manage upgrade and renewal
                                                requests from clinics
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() => router.reload()}
                                        disabled={refreshing}
                                        size="lg"
                                        className="bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <RefreshCw
                                            className={`w-5 h-5 mr-2 ${
                                                refreshing ? "animate-spin" : ""
                                            }`}
                                        />
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl overflow-hidden">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                            <BarChart3 className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-sm font-medium">
                                                Total Requests
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-2">
                                        {stats?.total || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                                        <div
                                            className="bg-white h-2 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl overflow-hidden">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-sm font-medium">
                                                Pending
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-2">
                                        {stats?.pending || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                                        <div
                                            className="bg-white h-2 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl overflow-hidden">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                            <Crown className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-sm font-medium">
                                                Upgrades
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-2">
                                        {stats?.upgrades || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                                        <div
                                            className="bg-white h-2 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl overflow-hidden">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                            <RefreshCw className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-sm font-medium">
                                                Renewals
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-2">
                                        {stats?.renewals || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                                        <div
                                            className="bg-white h-2 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="border-0 shadow-xl bg-white mb-8 rounded-2xl">
                        <CardContent className="p-8">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                                <Search className="w-4 h-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <Input
                                            placeholder="Search by clinic name, email, or request type..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-16 pr-6 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl bg-gray-50 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value)
                                            }
                                            className="appearance-none px-6 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200 text-lg font-medium"
                                        >
                                            <option value="all">
                                                All Status
                                            </option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="approved">
                                                Approved
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={typeFilter}
                                            onChange={(e) =>
                                                setTypeFilter(e.target.value)
                                            }
                                            className="appearance-none px-6 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200 text-lg font-medium"
                                        >
                                            <option value="all">
                                                All Types
                                            </option>
                                            <option value="upgrade">
                                                Upgrades
                                            </option>
                                            <option value="renewal">
                                                Renewals
                                            </option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requests Table */}
                    <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                        <CardHeader className="border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50 p-8">
                            <CardTitle className="flex items-center justify-between text-2xl">
                                <span className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Activity className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-800">
                                            Subscription Requests
                                        </span>
                                        <span className="ml-3 text-lg font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
                                            {filteredRequests.length} requests
                                        </span>
                                    </div>
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredRequests.length === 0 ? (
                                <div className="text-center py-16">
                                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                        No requests found
                                    </h3>
                                    <p className="text-gray-500">
                                        No subscription requests match your
                                        current filters.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left py-6 px-8 font-bold text-gray-800 text-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                                            <Building2 className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <span>
                                                            Clinic Information
                                                        </span>
                                                    </div>
                                                </th>
                                                <th className="text-left py-6 px-8 font-bold text-gray-800 text-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                                            <Target className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <span>
                                                            Request Details
                                                        </span>
                                                    </div>
                                                </th>
                                                <th className="text-left py-6 px-8 font-bold text-gray-800 text-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                                            <DollarSign className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <span>
                                                            Payment Info
                                                        </span>
                                                    </div>
                                                </th>
                                                <th className="text-left py-6 px-8 font-bold text-gray-800 text-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                                                            <CalendarDays className="w-5 h-5 text-orange-600" />
                                                        </div>
                                                        <span>Date & Time</span>
                                                    </div>
                                                </th>
                                                <th className="text-left py-6 px-8 font-bold text-gray-800 text-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                                                            <Settings className="w-5 h-5 text-red-600" />
                                                        </div>
                                                        <span>Actions</span>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredRequests.map(
                                                (request, index) => (
                                                    <tr
                                                        key={request.id}
                                                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${
                                                            index % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-gray-50"
                                                        }`}
                                                    >
                                                        {/* Clinic Information */}
                                                        <td className="py-8 px-8">
                                                            <div className="flex items-start space-x-4">
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                                        <Building2 className="w-8 h-8 text-white" />
                                                                    </div>
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                                                        <p className="text-lg font-bold text-gray-900 mb-2">
                                                                            {
                                                                                request
                                                                                    .clinic
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center gap-2 text-blue-600">
                                                                            <Mail className="w-4 h-4" />
                                                                            <p className="text-sm font-medium">
                                                                                {
                                                                                    request
                                                                                        .clinic
                                                                                        .email
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Request Details */}
                                                        <td className="py-8 px-8">
                                                            <div className="space-y-4">
                                                                {/* Request Type Badge */}
                                                                <div className="flex justify-center">
                                                                    <Badge
                                                                        className={`${
                                                                            REQUEST_TYPE_COLORS[
                                                                                request
                                                                                    .request_type
                                                                            ]
                                                                        } border-0 px-6 py-3 text-lg font-bold rounded-xl shadow-lg`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            {getRequestTypeIcon(
                                                                                request.request_type
                                                                            )}
                                                                            <span>
                                                                                {request.request_type
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                    request.request_type.slice(
                                                                                        1
                                                                                    )}
                                                                            </span>
                                                                        </div>
                                                                    </Badge>
                                                                </div>

                                                                {/* Plan Details */}
                                                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg">
                                                                    <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                                                                        <Target className="w-5 h-5" />
                                                                        Plan
                                                                        Information
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-100">
                                                                            <span className="text-purple-700 font-medium">
                                                                                Current
                                                                                Plan:
                                                                            </span>
                                                                            <span className="font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-lg">
                                                                                {request.current_plan
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                    request.current_plan.slice(
                                                                                        1
                                                                                    )}
                                                                            </span>
                                                                        </div>
                                                                        {request.requested_plan && (
                                                                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-100">
                                                                                <span className="text-purple-700 font-medium">
                                                                                    New
                                                                                    Plan:
                                                                                </span>
                                                                                <span className="font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-lg">
                                                                                    {request.requested_plan
                                                                                        .charAt(
                                                                                            0
                                                                                        )
                                                                                        .toUpperCase() +
                                                                                        request.requested_plan.slice(
                                                                                            1
                                                                                        )}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-purple-100">
                                                                            <span className="text-purple-700 font-medium">
                                                                                Duration:
                                                                            </span>
                                                                            <span className="font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-lg">
                                                                                {
                                                                                    request.duration_months
                                                                                }{" "}
                                                                                month(s)
                                                                            </span>
                                                                        </div>
                                                                        {request.calculated_amount && (
                                                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white">
                                                                                <span className="font-medium">
                                                                                    Total
                                                                                    Amount:
                                                                                </span>
                                                                                <span className="font-bold text-xl">
                                                                                    ₱
                                                                                    {parseFloat(
                                                                                        request.calculated_amount
                                                                                    ).toLocaleString()}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Status Badges */}
                                                                <div className="flex flex-wrap gap-3 justify-center">
                                                                    <Badge
                                                                        className={`${
                                                                            STATUS_COLORS[
                                                                                request
                                                                                    .status
                                                                            ]
                                                                        } border-0 px-4 py-2 text-base font-bold rounded-xl shadow-lg`}
                                                                    >
                                                                        <span className="flex items-center gap-2">
                                                                            {getStatusIcon(
                                                                                request.status
                                                                            )}
                                                                            <span>
                                                                                {request.status
                                                                                    .replace(
                                                                                        "_",
                                                                                        " "
                                                                                    )
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                    request.status
                                                                                        .replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )
                                                                                        .slice(
                                                                                            1
                                                                                        )}
                                                                            </span>
                                                                        </span>
                                                                    </Badge>

                                                                    {/* Payment Status Badges */}
                                                                    {request.payment_status ===
                                                                        "pending_verification" && (
                                                                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-2 text-base font-bold rounded-xl shadow-lg">
                                                                            <DollarSign className="w-4 h-4 mr-1" />
                                                                            Payment
                                                                            Pending
                                                                            Verification
                                                                        </Badge>
                                                                    )}

                                                                    {request.payment_status ===
                                                                        "verified" && (
                                                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2 text-base font-bold rounded-xl shadow-lg">
                                                                            <DollarSign className="w-4 h-4 mr-1" />
                                                                            Payment
                                                                            Verified
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Payment Information */}
                                                        <td className="py-8 px-8">
                                                            <div className="space-y-4">
                                                                {/* Payment Method & Reference */}
                                                                {request.payment_method && (
                                                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-lg">
                                                                        <div className="flex items-center gap-3 mb-4">
                                                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                                                <CreditCard className="w-5 h-5 text-white" />
                                                                            </div>
                                                                            <span className="text-lg font-bold text-green-800">
                                                                                Payment
                                                                                Details
                                                                            </span>
                                                                        </div>
                                                                        <div className="space-y-3">
                                                                            <div className="flex justify-between">
                                                                                <span className="text-blue-600">
                                                                                    Method:
                                                                                </span>
                                                                                <span className="font-medium text-blue-900">
                                                                                    {request.payment_method
                                                                                        .replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )
                                                                                        .charAt(
                                                                                            0
                                                                                        )
                                                                                        .toUpperCase() +
                                                                                        request.payment_method
                                                                                            .replace(
                                                                                                "_",
                                                                                                " "
                                                                                            )
                                                                                            .slice(
                                                                                                1
                                                                                            )}
                                                                                </span>
                                                                            </div>
                                                                            {request.reference_number && (
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-blue-600">
                                                                                        Reference:
                                                                                    </span>
                                                                                    <span className="font-mono font-medium text-blue-900">
                                                                                        {
                                                                                            request.reference_number
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {request.sender_name && (
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-blue-600">
                                                                                        Sender:
                                                                                    </span>
                                                                                    <span className="font-medium text-blue-900">
                                                                                        {
                                                                                            request.sender_name
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {request.amount_sent && (
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-blue-600">
                                                                                        Amount
                                                                                        Sent:
                                                                                    </span>
                                                                                    <span className="font-medium text-blue-900">
                                                                                        ₱
                                                                                        {request.amount_sent.toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            {request.payment_received_at && (
                                                                                <div className="flex justify-between">
                                                                                    <span className="text-blue-600">
                                                                                        Received:
                                                                                    </span>
                                                                                    <span className="font-medium text-blue-900">
                                                                                        {new Date(
                                                                                            request.payment_received_at
                                                                                        ).toLocaleDateString()}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Payment Details for Verification */}
                                                                {request.payment_details &&
                                                                    request.payment_status ===
                                                                        "pending_verification" && (
                                                                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3">
                                                                            <div className="flex items-center gap-2 mb-3">
                                                                                <DollarSign className="h-4 w-4 text-orange-600" />
                                                                                <span className="text-sm font-semibold text-orange-800">
                                                                                    Verification
                                                                                    Required
                                                                                </span>
                                                                            </div>
                                                                            <div className="space-y-2 text-xs">
                                                                                {request
                                                                                    .payment_details
                                                                                    .sender_name && (
                                                                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-orange-100">
                                                                                        <span className="font-medium text-orange-700">
                                                                                            Sender:
                                                                                        </span>
                                                                                        <span className="text-orange-900 font-semibold">
                                                                                            {
                                                                                                request
                                                                                                    .payment_details
                                                                                                    .sender_name
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                {request
                                                                                    .payment_details
                                                                                    .sender_phone && (
                                                                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-orange-100">
                                                                                        <span className="font-medium text-orange-700">
                                                                                            Phone:
                                                                                        </span>
                                                                                        <span className="text-orange-900 font-mono font-semibold">
                                                                                            {
                                                                                                request
                                                                                                    .payment_details
                                                                                                    .sender_phone
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                {request
                                                                                    .payment_details
                                                                                    .transaction_reference && (
                                                                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-orange-100">
                                                                                        <span className="font-medium text-orange-700">
                                                                                            Reference:
                                                                                        </span>
                                                                                        <span className="text-orange-900 font-mono font-semibold">
                                                                                            {
                                                                                                request
                                                                                                    .payment_details
                                                                                                    .transaction_reference
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                {request
                                                                                    .payment_details
                                                                                    .payment_amount && (
                                                                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-orange-100">
                                                                                        <span className="font-medium text-orange-700">
                                                                                            Amount:
                                                                                        </span>
                                                                                        <span className="text-orange-900 font-semibold">
                                                                                            ₱
                                                                                            {parseFloat(
                                                                                                request
                                                                                                    .payment_details
                                                                                                    .payment_amount
                                                                                            ).toLocaleString(
                                                                                                "en-US",
                                                                                                {
                                                                                                    minimumFractionDigits: 2,
                                                                                                    maximumFractionDigits: 2,
                                                                                                }
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="py-8 px-8">
                                                            <div className="text-sm text-gray-600 space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <CalendarDays className="w-4 h-4 text-gray-400" />
                                                                    <span className="font-medium">
                                                                        {new Date(
                                                                            request.created_at
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Clock3 className="w-4 h-4 text-gray-400" />
                                                                    <span>
                                                                        {new Date(
                                                                            request.created_at
                                                                        ).toLocaleTimeString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="py-8 px-8">
                                                            <div className="flex flex-col gap-2">
                                                                {/* View Details Button */}
                                                                <Button
                                                                    onClick={() =>
                                                                        toggleRowExpansion(
                                                                            request.id
                                                                        )
                                                                    }
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                                >
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View Details
                                                                </Button>

                                                                {/* Action Buttons */}
                                                                {request.status ===
                                                                    "pending" && (
                                                                    <div className="space-y-2">
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    request,
                                                                                    "approve"
                                                                                )
                                                                            }
                                                                            size="sm"
                                                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Approve
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    request,
                                                                                    "reject"
                                                                                )
                                                                            }
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            className="w-full"
                                                                        >
                                                                            <XCircle className="w-4 h-4 mr-2" />
                                                                            Reject
                                                                        </Button>
                                                                    </div>
                                                                )}

                                                                {request.status ===
                                                                    "approved" &&
                                                                    request.payment_status ===
                                                                        "pending_verification" && (
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    request,
                                                                                    "verify-payment"
                                                                                )
                                                                            }
                                                                            size="sm"
                                                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                                                        >
                                                                            <DollarSign className="w-4 h-4 mr-2" />
                                                                            Verify
                                                                            Payment
                                                                        </Button>
                                                                    )}

                                                                {request.status ===
                                                                    "approved" &&
                                                                    request.payment_status ===
                                                                        "verified" && (
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    request,
                                                                                    "complete"
                                                                                )
                                                                            }
                                                                            size="sm"
                                                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Complete
                                                                        </Button>
                                                                    )}

                                                                {request.status ===
                                                                    "payment_received" && (
                                                                    <div className="space-y-2">
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    request,
                                                                                    "complete"
                                                                                )
                                                                            }
                                                                            size="sm"
                                                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                                            Verify
                                                                            &
                                                                            Complete
                                                                        </Button>
                                                                        <Button
                                                                            onClick={() =>
                                                                                handleAction(
                                                                                    request,
                                                                                    "reject"
                                                                                )
                                                                            }
                                                                            variant="destructive"
                                                                            size="sm"
                                                                            className="w-full"
                                                                        >
                                                                            <XCircle className="w-4 h-4 mr-2" />
                                                                            Reject
                                                                            Payment
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Action Dialog */}
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "approve" && "Approve Request"}
                            {actionType === "reject" && "Reject Request"}
                            {actionType === "complete" && "Complete Request"}
                            {actionType === "verify-payment" &&
                                "Verify Payment"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "approve" &&
                                "Send payment link to the clinic with fixed pricing"}
                            {actionType === "reject" &&
                                "Reject the request and notify the clinic"}
                            {actionType === "complete" &&
                                "Activate subscription after payment verification"}
                            {actionType === "verify-payment" &&
                                "Verify payment details and mark as verified"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {actionType === "approve" && (
                            <div>
                                <Label>Payment Details</Label>
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                Plan:
                                            </span>
                                            <span className="font-medium">
                                                {selectedRequest?.request_type ===
                                                "upgrade"
                                                    ? selectedRequest?.requested_plan
                                                          ?.charAt(0)
                                                          .toUpperCase() +
                                                      selectedRequest?.requested_plan?.slice(
                                                          1
                                                      )
                                                    : selectedRequest?.current_plan
                                                          ?.charAt(0)
                                                          .toUpperCase() +
                                                      selectedRequest?.current_plan?.slice(
                                                          1
                                                      )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                Duration:
                                            </span>
                                            <span className="font-medium">
                                                {
                                                    selectedRequest?.duration_months
                                                }{" "}
                                                month(s)
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                            <span className="text-sm font-medium">
                                                Total Amount:
                                            </span>
                                            <span className="font-bold text-lg">
                                                ₱
                                                {selectedRequest?.request_type ===
                                                "upgrade"
                                                    ? (selectedRequest?.requested_plan ===
                                                      "premium"
                                                          ? 1999
                                                          : 2999) *
                                                      selectedRequest?.duration_months
                                                    : (selectedRequest?.current_plan ===
                                                      "premium"
                                                          ? 1999
                                                          : 1999) *
                                                      selectedRequest?.duration_months}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Fixed pricing based on plan and duration.
                                    Payment link will be sent to the clinic.
                                </p>
                            </div>
                        )}

                        {actionType === "verify-payment" ? (
                            <div>
                                <Label htmlFor="payment_verification_notes">
                                    Payment Verification Notes
                                </Label>
                                <Textarea
                                    id="payment_verification_notes"
                                    value={
                                        actionData.payment_verification_notes
                                    }
                                    onChange={(e) =>
                                        setActionData({
                                            ...actionData,
                                            payment_verification_notes:
                                                e.target.value,
                                        })
                                    }
                                    placeholder="Add verification notes or confirm payment details..."
                                    rows={3}
                                />
                            </div>
                        ) : (
                            <div>
                                <Label htmlFor="admin_notes">Admin Notes</Label>
                                <Textarea
                                    id="admin_notes"
                                    value={actionData.admin_notes}
                                    onChange={(e) =>
                                        setActionData({
                                            ...actionData,
                                            admin_notes: e.target.value,
                                        })
                                    }
                                    placeholder="Add any notes or instructions..."
                                    rows={3}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setActionDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitAction}
                            disabled={loading}
                            className={
                                actionType === "approve"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : actionType === "reject"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : actionType === "verify-payment"
                                    ? "bg-orange-600 hover:bg-orange-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }
                        >
                            {loading
                                ? "Processing..."
                                : actionType === "approve"
                                ? "Approve"
                                : actionType === "reject"
                                ? "Reject"
                                : actionType === "verify-payment"
                                ? "Verify Payment"
                                : "Complete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
