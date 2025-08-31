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
    Hash,
    FileText,
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
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedRequestForDetails, setSelectedRequestForDetails] =
        useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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

    // Pagination logic
    const totalItems = filteredRequests.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    // Reset to first page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, typeFilter, sortBy, sortOrder, itemsPerPage]);

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

    const handleViewDetails = (request) => {
        setSelectedRequestForDetails(request);
        setDetailsModalOpen(true);
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
                    <div className="mb-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                                                Subscription Requests
                                            </h1>
                                            <p className="text-blue-600 text-base font-medium mt-1">
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
                                        size="default"
                                        className="bg-white text-blue-600 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <RefreshCw
                                            className={`w-4 h-4 mr-2 ${
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden">
                            <CardContent className="p-4 relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-xs font-medium">
                                                Total Requests
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-white mb-2">
                                        {stats?.total || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                                        <div
                                            className="bg-white h-1.5 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl overflow-hidden">
                            <CardContent className="p-4 relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-xs font-medium">
                                                Pending
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-white mb-2">
                                        {stats?.pending || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                                        <div
                                            className="bg-white h-1.5 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl overflow-hidden">
                            <CardContent className="p-4 relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                            <Crown className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-xs font-medium">
                                                Upgrades
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-white mb-2">
                                        {stats?.upgrades || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                                        <div
                                            className="bg-white h-1.5 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl overflow-hidden">
                            <CardContent className="p-4 relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-12 translate-x-12"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                            <RefreshCw className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-opacity-80 text-xs font-medium">
                                                Renewals
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-white mb-2">
                                        {stats?.renewals || 0}
                                    </p>
                                    <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                                        <div
                                            className="bg-white h-1.5 rounded-full"
                                            style={{ width: "100%" }}
                                        ></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="border-0 shadow-lg bg-white mb-6 rounded-xl">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <div className="w-7 h-7 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                                <Search className="w-4 h-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <Input
                                            placeholder="Search by clinic name, email, or request type..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-12 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg bg-gray-50 focus:bg-white transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(e.target.value)
                                            }
                                            className="appearance-none px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200 text-base font-medium"
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
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={typeFilter}
                                            onChange={(e) =>
                                                setTypeFilter(e.target.value)
                                            }
                                            className="appearance-none px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 focus:bg-white transition-all duration-200 text-base font-medium"
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
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requests Table */}
                    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50/30 rounded-xl shadow-lg border border-blue-200/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-blue-100">
                                <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[220px]">
                                            <Building2 className="inline w-4 h-4 mr-2" />
                                            Clinic Name
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">
                                            <Target className="inline w-4 h-4 mr-2" />
                                            Type
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">
                                            <Crown className="inline w-4 h-4 mr-2" />
                                            Plan
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">
                                            <DollarSign className="inline w-4 h-4 mr-2" />
                                            Amount
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">
                                            <Activity className="inline w-4 h-4 mr-2" />
                                            Status
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-blue-100">
                                    {paginatedRequests.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-center py-16 text-gray-500"
                                            >
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                                                        <Bell className="w-8 h-8 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold text-gray-700 mb-2">
                                                            {totalItems === 0
                                                                ? "No Requests Found"
                                                                : "No Results on This Page"}
                                                        </p>
                                                        <p className="text-sm text-gray-500 max-w-md">
                                                            {totalItems === 0
                                                                ? "No subscription requests match your current filters."
                                                                : "Try adjusting your filters or go to the first page."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedRequests.map(
                                            (request, index) => (
                                                <tr
                                                    key={request.id}
                                                    className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 ${
                                                        index % 2 === 0
                                                            ? "bg-white"
                                                            : "bg-blue-50/20"
                                                    }`}
                                                >
                                                    {/* Clinic Name */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0">
                                                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">
                                                                    <Building2 className="w-4 h-4 text-white" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold text-gray-900 truncate">
                                                                        {
                                                                            request
                                                                                .clinic
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <span className="flex-shrink-0">
                                                                        ID:{" "}
                                                                        {
                                                                            request.id
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Type */}
                                                    <td className="px-3 py-3">
                                                        <Badge
                                                            className={`${
                                                                REQUEST_TYPE_COLORS[
                                                                    request
                                                                        .request_type
                                                                ]
                                                            } border-0 px-3 py-1 text-xs font-bold flex items-center gap-1 w-fit`}
                                                        >
                                                            {getRequestTypeIcon(
                                                                request.request_type
                                                            )}
                                                            {request.request_type
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                request.request_type.slice(
                                                                    1
                                                                )}
                                                        </Badge>
                                                    </td>

                                                    {/* Plan */}
                                                    <td className="px-3 py-3">
                                                        <div className="space-y-1">
                                                            <div className="text-xs text-gray-500">
                                                                Current:{" "}
                                                                {request.current_plan
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    request.current_plan.slice(
                                                                        1
                                                                    )}
                                                            </div>
                                                            {request.requested_plan && (
                                                                <div className="text-xs text-gray-500">
                                                                    New:{" "}
                                                                    {request.requested_plan
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                        request.requested_plan.slice(
                                                                            1
                                                                        )}
                                                                </div>
                                                            )}
                                                            <div className="text-xs text-gray-500">
                                                                {
                                                                    request.duration_months
                                                                }{" "}
                                                                month(s)
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="px-3 py-3">
                                                        {request.calculated_amount ? (
                                                            <span className="font-semibold text-green-700">
                                                                ₱
                                                                {parseFloat(
                                                                    request.calculated_amount
                                                                ).toLocaleString()}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                -
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-3 py-3">
                                                        <div className="space-y-1">
                                                            <Badge
                                                                className={`${
                                                                    STATUS_COLORS[
                                                                        request
                                                                            .status
                                                                    ]
                                                                } border-0 px-2 py-1 text-xs font-bold`}
                                                            >
                                                                {getStatusIcon(
                                                                    request.status
                                                                )}
                                                                {request.status
                                                                    .replace(
                                                                        "_",
                                                                        " "
                                                                    )
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    request.status
                                                                        .replace(
                                                                            "_",
                                                                            " "
                                                                        )
                                                                        .slice(
                                                                            1
                                                                        )}
                                                            </Badge>
                                                            {request.payment_status ===
                                                                "pending_verification" && (
                                                                <Badge className="bg-orange-100 text-orange-700 border-0 px-2 py-1 text-xs font-bold">
                                                                    Payment
                                                                    Pending
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-3 py-3">
                                                        <div className="flex flex-col gap-2">
                                                            <Button
                                                                onClick={() =>
                                                                    handleViewDetails(
                                                                        request
                                                                    )
                                                                }
                                                                variant="outline"
                                                                size="sm"
                                                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 font-semibold rounded-lg px-3 py-1 text-xs flex items-center gap-1 hover:shadow-md transition-all duration-300"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                View
                                                            </Button>

                                                            {request.status ===
                                                                "pending" && (
                                                                <div className="space-y-1">
                                                                    <Button
                                                                        onClick={() =>
                                                                            handleAction(
                                                                                request,
                                                                                "approve"
                                                                            )
                                                                        }
                                                                        size="sm"
                                                                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
                                                                    >
                                                                        <CheckCircle className="w-3 h-3 mr-1" />
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
                                                                        className="w-full text-xs"
                                                                    >
                                                                        <XCircle className="w-3 h-3 mr-1" />
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
                                                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs"
                                                                    >
                                                                        <DollarSign className="w-3 h-3 mr-1" />
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
                                                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                                                    >
                                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                                        Complete
                                                                    </Button>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-700">
                                    Showing{" "}
                                    <span className="font-medium">
                                        {startIndex + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {Math.min(endIndex, totalItems)}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {totalItems}
                                    </span>{" "}
                                    results
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">
                                        Show:
                                    </span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(
                                                parseInt(e.target.value)
                                            );
                                            setCurrentPage(1); // Reset to first page when changing page size
                                        }}
                                        className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                    </select>
                                    <span className="text-sm text-gray-700">
                                        per page
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                    First
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                    Previous
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    )
                                        .filter((page) => {
                                            // Show first page, last page, current page, and pages around current
                                            if (
                                                page === 1 ||
                                                page === totalPages
                                            )
                                                return true;
                                            if (
                                                page >= currentPage - 1 &&
                                                page <= currentPage + 1
                                            )
                                                return true;
                                            return false;
                                        })
                                        .map((page, index, array) => {
                                            // Add ellipsis if there's a gap
                                            const showEllipsis =
                                                index > 0 &&
                                                page - array[index - 1] > 1;
                                            return (
                                                <React.Fragment key={page}>
                                                    {showEllipsis && (
                                                        <span className="px-2 text-gray-500">
                                                            ...
                                                        </span>
                                                    )}
                                                    <Button
                                                        variant={
                                                            currentPage === page
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            setCurrentPage(page)
                                                        }
                                                        className={`px-3 py-2 text-sm min-w-[40px] ${
                                                            currentPage === page
                                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                                : "border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {page}
                                                    </Button>
                                                </React.Fragment>
                                            );
                                        })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setCurrentPage(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                    Next
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 text-sm border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                    Last
                                </Button>
                            </div>
                        </div>
                    )}
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

            {/* Details Modal */}
            <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <span>Subscription Request Details</span>
                        </DialogTitle>
                        <DialogDescription>
                            Detailed information for subscription request #
                            {selectedRequestForDetails?.id}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequestForDetails && (
                        <div className="space-y-6">
                            {/* Clinic Information */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                                <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Clinic Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-blue-600" />
                                            <span className="font-semibold text-blue-800">
                                                Clinic Name
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {
                                                selectedRequestForDetails.clinic
                                                    .name
                                            }
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                            <span className="font-semibold text-blue-800">
                                                Email
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {
                                                selectedRequestForDetails.clinic
                                                    .email
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Request Details */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                                <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Request Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="w-4 h-4 text-purple-600" />
                                            <span className="font-semibold text-purple-800">
                                                Request Type
                                            </span>
                                        </div>
                                        <Badge
                                            className={`${
                                                REQUEST_TYPE_COLORS[
                                                    selectedRequestForDetails
                                                        .request_type
                                                ]
                                            } border-0 px-3 py-1`}
                                        >
                                            {getRequestTypeIcon(
                                                selectedRequestForDetails.request_type
                                            )}
                                            {selectedRequestForDetails.request_type
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedRequestForDetails.request_type.slice(
                                                    1
                                                )}
                                        </Badge>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Crown className="w-4 h-4 text-purple-600" />
                                            <span className="font-semibold text-purple-800">
                                                Current Plan
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {selectedRequestForDetails.current_plan
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedRequestForDetails.current_plan.slice(
                                                    1
                                                )}
                                        </p>
                                    </div>
                                    {selectedRequestForDetails.requested_plan && (
                                        <div className="bg-white rounded-lg p-4 border border-purple-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Crown className="w-4 h-4 text-purple-600" />
                                                <span className="font-semibold text-purple-800">
                                                    New Plan
                                                </span>
                                            </div>
                                            <p className="text-gray-900">
                                                {selectedRequestForDetails.requested_plan
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    selectedRequestForDetails.requested_plan.slice(
                                                        1
                                                    )}
                                            </p>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-purple-600" />
                                            <span className="font-semibold text-purple-800">
                                                Duration
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {
                                                selectedRequestForDetails.duration_months
                                            }{" "}
                                            month(s)
                                        </p>
                                    </div>
                                    {selectedRequestForDetails.calculated_amount && (
                                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white col-span-1 md:col-span-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="w-5 h-5" />
                                                <span className="font-semibold">
                                                    Total Amount
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold">
                                                ₱
                                                {parseFloat(
                                                    selectedRequestForDetails.calculated_amount
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Information */}
                            {selectedRequestForDetails.payment_method && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                                    <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Payment Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-green-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CreditCard className="w-4 h-4 text-green-600" />
                                                <span className="font-semibold text-green-800">
                                                    Payment Method
                                                </span>
                                            </div>
                                            <p className="text-gray-900">
                                                {selectedRequestForDetails.payment_method
                                                    .replace("_", " ")
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    selectedRequestForDetails.payment_method
                                                        .replace("_", " ")
                                                        .slice(1)}
                                            </p>
                                        </div>
                                        {selectedRequestForDetails.reference_number && (
                                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Hash className="w-4 h-4 text-green-600" />
                                                    <span className="font-semibold text-green-800">
                                                        System Reference Number
                                                    </span>
                                                </div>
                                                <p className="font-mono text-gray-900">
                                                    {
                                                        selectedRequestForDetails.reference_number
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* Payment Method Reference - with manual JSON decoding */}
                                        {(() => {
                                            let paymentDetails =
                                                selectedRequestForDetails.payment_details;
                                            let userReferenceNumber = null;

                                            // Manual JSON decoding if it's a string
                                            if (
                                                typeof paymentDetails ===
                                                "string"
                                            ) {
                                                try {
                                                    paymentDetails =
                                                        JSON.parse(
                                                            paymentDetails
                                                        );
                                                    userReferenceNumber =
                                                        paymentDetails.user_reference_number;
                                                } catch (e) {
                                                    console.error(
                                                        "Failed to parse payment details:",
                                                        e
                                                    );
                                                }
                                            } else if (
                                                paymentDetails &&
                                                typeof paymentDetails ===
                                                    "object"
                                            ) {
                                                userReferenceNumber =
                                                    paymentDetails.user_reference_number;
                                            }

                                            return userReferenceNumber ? (
                                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Hash className="w-4 h-4 text-green-600" />
                                                        <span className="font-semibold text-green-800">
                                                            Payment Method
                                                            Reference
                                                        </span>
                                                    </div>
                                                    <p className="font-mono text-gray-900">
                                                        {userReferenceNumber}
                                                    </p>
                                                </div>
                                            ) : null;
                                        })()}

                                        {/* Original conditional field */}
                                        {selectedRequestForDetails
                                            .payment_details
                                            ?.user_reference_number && (
                                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Hash className="w-4 h-4 text-green-600" />
                                                    <span className="font-semibold text-green-800">
                                                        Payment Method Reference
                                                    </span>
                                                </div>
                                                <p className="font-mono text-gray-900">
                                                    {
                                                        selectedRequestForDetails
                                                            .payment_details
                                                            .user_reference_number
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {selectedRequestForDetails.sender_name && (
                                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="w-4 h-4 text-green-600" />
                                                    <span className="font-semibold text-green-800">
                                                        Sender Name
                                                    </span>
                                                </div>
                                                <p className="text-gray-900">
                                                    {
                                                        selectedRequestForDetails.sender_name
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {selectedRequestForDetails.sender_number && (
                                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Phone className="w-4 h-4 text-green-600" />
                                                    <span className="font-semibold text-green-800">
                                                        Sender Number
                                                    </span>
                                                </div>
                                                <p className="text-gray-900">
                                                    {
                                                        selectedRequestForDetails.sender_number
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        {selectedRequestForDetails.amount_sent && (
                                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="font-semibold text-green-800">
                                                        Amount Sent
                                                    </span>
                                                </div>
                                                <p className="text-gray-900">
                                                    ₱
                                                    {selectedRequestForDetails.amount_sent.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Status Information */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                                <h3 className="text-lg font-bold text-amber-800 mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    Status Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                            <span className="font-semibold text-amber-800">
                                                Request Status
                                            </span>
                                        </div>
                                        <Badge
                                            className={`${
                                                STATUS_COLORS[
                                                    selectedRequestForDetails
                                                        .status
                                                ]
                                            } border-0 px-3 py-1`}
                                        >
                                            {getStatusIcon(
                                                selectedRequestForDetails.status
                                            )}
                                            {selectedRequestForDetails.status
                                                .replace("_", " ")
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedRequestForDetails.status
                                                    .replace("_", " ")
                                                    .slice(1)}
                                        </Badge>
                                    </div>
                                    {selectedRequestForDetails.payment_status && (
                                        <div className="bg-white rounded-lg p-4 border border-amber-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="w-4 h-4 text-amber-600" />
                                                <span className="font-semibold text-amber-800">
                                                    Payment Status
                                                </span>
                                            </div>
                                            <Badge
                                                className={`${
                                                    selectedRequestForDetails.payment_status ===
                                                    "pending_verification"
                                                        ? "bg-orange-100 text-orange-700"
                                                        : selectedRequestForDetails.payment_status ===
                                                          "verified"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-700"
                                                } border-0 px-3 py-1`}
                                            >
                                                {selectedRequestForDetails.payment_status
                                                    .replace("_", " ")
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    selectedRequestForDetails.payment_status
                                                        .replace("_", " ")
                                                        .slice(1)}
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-amber-600" />
                                            <span className="font-semibold text-amber-800">
                                                Created Date
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {new Date(
                                                selectedRequestForDetails.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-amber-600" />
                                            <span className="font-semibold text-amber-800">
                                                Created Time
                                            </span>
                                        </div>
                                        <p className="text-gray-900">
                                            {new Date(
                                                selectedRequestForDetails.created_at
                                            ).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            {selectedRequestForDetails.admin_notes && (
                                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Admin Notes
                                    </h3>
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                        <p className="text-gray-900">
                                            {
                                                selectedRequestForDetails.admin_notes
                                            }
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
