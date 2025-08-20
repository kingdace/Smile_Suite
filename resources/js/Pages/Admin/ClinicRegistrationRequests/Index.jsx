import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    ClipboardList,
    Inbox,
    Filter,
    RotateCcw,
    AlertTriangle,
    TrendingUp,
    Users,
    Building2,
    Plus,
    Activity,
    Calendar,
    Star,
    MapPin,
    Mail,
    Shield,
    Trash2,
    HardDrive,
    X,
    AlertCircle,
} from "lucide-react";
import { Tooltip } from "@/Components/ui/tooltip";

export default function Index({ auth, requests, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [paymentStatus, setPaymentStatus] = useState(
        filters.payment_status || "all"
    );
    const [showDeleted, setShowDeleted] = useState(
        filters.show_deleted === "true"
    );

    // Dialog states
    const [softDeleteDialogOpen, setSoftDeleteDialogOpen] = useState(false);
    const [hardDeleteDialogOpen, setHardDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [requestToSoftDelete, setRequestToSoftDelete] = useState(null);
    const [requestToHardDelete, setRequestToHardDelete] = useState(null);
    const [requestToRestore, setRequestToRestore] = useState(null);

    const handleFilter = () => {
        const params = {
            search,
            page: 1, // Reset to first page when filtering
        };

        if (status !== "all") {
            params.status = status;
        }

        if (paymentStatus !== "all") {
            params.payment_status = paymentStatus;
        }

        if (showDeleted) {
            params.show_deleted = "true";
        }

        router.get(route("admin.clinic-requests.index"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setPaymentStatus("all");
        setShowDeleted(false);
        router.get(
            route("admin.clinic-requests.index"),
            { page: 1 }, // Reset to first page when clearing filters
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSoftDelete = (request) => {
        setRequestToSoftDelete(request);
        setSoftDeleteDialogOpen(true);
    };

    const handleHardDelete = (request) => {
        setRequestToHardDelete(request);
        setHardDeleteDialogOpen(true);
    };

    const handleRestore = (request) => {
        setRequestToRestore(request);
        setRestoreDialogOpen(true);
    };

    const confirmSoftDelete = () => {
        if (requestToSoftDelete) {
            router.delete(
                route(
                    "admin.clinic-requests.soft-delete",
                    requestToSoftDelete.id
                ),
                {
                    onSuccess: () => {
                        setSoftDeleteDialogOpen(false);
                        setRequestToSoftDelete(null);
                        router.reload();
                    },
                    onError: (errors) => {
                        console.error("Soft delete failed:", errors);
                        setSoftDeleteDialogOpen(false);
                        setRequestToSoftDelete(null);
                    },
                }
            );
        }
    };

    const confirmHardDelete = () => {
        if (requestToHardDelete) {
            router.delete(
                route(
                    "admin.clinic-requests.hard-delete",
                    requestToHardDelete.id
                ),
                {
                    onSuccess: () => {
                        setHardDeleteDialogOpen(false);
                        setRequestToHardDelete(null);
                        router.reload();
                    },
                    onError: (errors) => {
                        console.error("Hard delete failed:", errors);
                        setHardDeleteDialogOpen(false);
                        setRequestToHardDelete(null);
                    },
                }
            );
        }
    };

    const confirmRestore = () => {
        if (requestToRestore) {
            router.post(
                route("admin.clinic-requests.restore", requestToRestore.id),
                {},
                {
                    onSuccess: () => {
                        setRestoreDialogOpen(false);
                        setRequestToRestore(null);
                        router.reload();
                    },
                    onError: (errors) => {
                        console.error("Restore failed:", errors);
                        setRestoreDialogOpen(false);
                        setRequestToRestore(null);
                    },
                }
            );
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            approved: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
        };
        return (
            <Badge
                className={`${
                    variants[status] ||
                    "bg-gray-100 text-gray-700 border-gray-200"
                } text-xs font-medium px-2 py-1`}
            >
                {status}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            paid: "bg-green-100 text-green-700 border-green-200",
            trial: "bg-blue-100 text-blue-700 border-blue-200",
            failed: "bg-red-100 text-red-700 border-red-200",
            payment_failed: "bg-orange-100 text-orange-700 border-orange-200",
        };
        return (
            <Badge
                className={`${
                    variants[status] ||
                    "bg-gray-100 text-gray-700 border-gray-200"
                } text-xs font-medium px-2 py-1`}
            >
                {status === "trial" ? "Free Trial" : status}
            </Badge>
        );
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const month = d.toLocaleDateString("en-US", { month: "short" });
        const day = d.getDate();
        const year = d.getFullYear();
        const time = d.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        return `${month} ${day}, ${year} ${time}`;
    };

    // Calculate statistics
    const stats = [
        {
            label: "Total Requests",
            value: requests.total,
            icon: Inbox,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            gradient: "from-blue-500 to-cyan-600",
        },
        {
            label: "Pending Review",
            value: requests.data.filter((r) => r.status === "pending").length,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            gradient: "from-yellow-500 to-orange-600",
        },
        {
            label: "Approved",
            value: requests.data.filter((r) => r.status === "approved").length,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
            gradient: "from-green-500 to-emerald-600",
        },
        {
            label: "Completed Setup",
            value: requests.data.filter((r) => r.status === "completed").length,
            icon: Building2,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            gradient: "from-emerald-500 to-teal-600",
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Clinic Registration Requests
                </h2>
            }
        >
            <Head title="Clinic Registration Requests" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <ClipboardList className="w-5 h-5 text-white" />
                                        </div>
                                        Clinic Registration Requests
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        Manage and review new clinic
                                        applications
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "admin.subscriptions.index"
                                                )
                                            )
                                        }
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Subscriptions
                                    </button>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-lg transition-all duration-300 text-sm font-semibold shadow-md"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Back
                                    </button>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative group"
                                    >
                                        {/* Background gradient overlay */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                                        ></div>

                                        {/* Icon with enhanced styling */}
                                        <div className="relative z-10 mb-3">
                                            <div
                                                className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto shadow-lg border border-white/50 group-hover:scale-110 transition-transform duration-300`}
                                            >
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                                {stat.value}
                                            </div>
                                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                {stat.label}
                                            </div>
                                        </div>

                                        {/* Decorative corner accent */}
                                        <div
                                            className={`absolute top-0 right-0 w-16 h-16 ${stat.bgColor} opacity-20 rounded-bl-full group-hover:opacity-30 transition-opacity duration-300`}
                                        ></div>
                                    </div>
                                ))}
                            </div>

                            {/* Notification Banner for Pending Requests */}
                            {requests.data.some(
                                (request) => request.status === "pending"
                            ) && (
                                <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                                            <AlertTriangle className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-yellow-900">
                                                Pending Requests Require
                                                Attention
                                            </h3>
                                            <p className="text-sm text-yellow-800">
                                                You have{" "}
                                                <span className="font-bold text-yellow-900">
                                                    {
                                                        requests.data.filter(
                                                            (r) =>
                                                                r.status ===
                                                                "pending"
                                                        ).length
                                                    }
                                                </span>{" "}
                                                pending clinic registration
                                                request(s) that need review and
                                                approval.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Celebration Banner for Completed Setups */}
                            {requests.data.some(
                                (request) => request.status === "completed"
                            ) && (
                                <div className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-2xl">🎉</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-emerald-900">
                                                Successful Clinic Setups!
                                            </h3>
                                            <p className="text-sm text-emerald-800">
                                                Congratulations!{" "}
                                                <span className="font-bold text-emerald-900">
                                                    {
                                                        requests.data.filter(
                                                            (r) =>
                                                                r.status ===
                                                                "completed"
                                                        ).length
                                                    }
                                                </span>{" "}
                                                clinic(s) have successfully
                                                completed their setup and are
                                                now live on Smile Suite.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Filters */}
                            <div className="mb-6 bg-gradient-to-r from-blue-50 via-white to-cyan-50/30 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                        <Filter className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Search & Filters
                                    </h3>
                                </div>

                                {/* Search Row */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                                        <Input
                                            placeholder="Search clinics, contacts, or emails..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            onKeyPress={(e) =>
                                                e.key === "Enter" &&
                                                handleFilter()
                                            }
                                            className="pl-10 w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Filters Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">
                                            Status
                                        </label>
                                        <Select
                                            value={status}
                                            onValueChange={setStatus}
                                        >
                                            <SelectTrigger className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Statuses
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="approved">
                                                    Approved
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed Setup
                                                </SelectItem>
                                                <SelectItem value="rejected">
                                                    Rejected
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">
                                            Payment Status
                                        </label>
                                        <Select
                                            value={paymentStatus}
                                            onValueChange={setPaymentStatus}
                                        >
                                            <SelectTrigger className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm">
                                                <SelectValue placeholder="All Payment Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Payment Statuses
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="paid">
                                                    Paid
                                                </SelectItem>
                                                <SelectItem value="failed">
                                                    Failed
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">
                                            Show Deleted
                                        </label>
                                        <Select
                                            value={
                                                showDeleted ? "true" : "false"
                                            }
                                            onValueChange={(value) =>
                                                setShowDeleted(value === "true")
                                            }
                                        >
                                            <SelectTrigger className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm">
                                                <SelectValue placeholder="Show Deleted" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true">
                                                    Show Deleted
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    Hide Deleted
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700">
                                            Actions
                                        </label>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={handleFilter}
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm py-2"
                                            >
                                                Apply
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={clearFilters}
                                                className="border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold transition-all duration-300 text-sm py-2"
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[200px]">
                                                    <Mail className="inline w-4 h-4 mr-2" />
                                                    Email
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">
                                                    <DollarSign className="inline w-4 h-4 mr-2" />
                                                    Plan
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">
                                                    <Activity className="inline w-4 h-4 mr-2" />
                                                    Payment
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[120px]">
                                                    <Star className="inline w-4 h-4 mr-2" />
                                                    Status
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[100px]">
                                                    Actions
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider min-w-[140px]">
                                                    Delete
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-100">
                                            {requests.data.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="text-center py-16 text-gray-500"
                                                    >
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                                                                <ClipboardList className="w-8 h-8 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-semibold text-gray-700 mb-2">
                                                                    No Requests
                                                                    Found
                                                                </p>
                                                                <p className="text-sm text-gray-500 max-w-md">
                                                                    No clinic
                                                                    registration
                                                                    requests
                                                                    match your
                                                                    current
                                                                    filters. New
                                                                    clinic
                                                                    applications
                                                                    will appear
                                                                    here for
                                                                    review.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                requests.data.map(
                                                    (request, index) => (
                                                        <tr
                                                            key={request.id}
                                                            className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 ${
                                                                index % 2 === 0
                                                                    ? "bg-white"
                                                                    : "bg-blue-50/20"
                                                            }`}
                                                        >
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
                                                                                    request.clinic_name
                                                                                }
                                                                            </span>
                                                                            {request.status ===
                                                                                "completed" && (
                                                                                <span className="flex-shrink-0 text-xs bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
                                                                                    Live
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                            <span className="flex-shrink-0">
                                                                                ID:{" "}
                                                                                {
                                                                                    request.id
                                                                                }
                                                                            </span>
                                                                            {request.status ===
                                                                                "completed" && (
                                                                                <span className="flex-shrink-0 text-emerald-600 font-bold flex items-center gap-1">
                                                                                    <span className="text-xs">
                                                                                        ✓
                                                                                    </span>
                                                                                    Complete
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                                    <span className="text-gray-700 text-sm truncate max-w-[180px]">
                                                                        {
                                                                            request.email
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 flex items-center gap-1 w-fit">
                                                                    <DollarSign className="w-3 h-3" />
                                                                    {
                                                                        request.subscription_plan
                                                                    }
                                                                </Badge>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {getPaymentStatusBadge(
                                                                    request.payment_status
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {getStatusBadge(
                                                                    request.status
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {route(
                                                                    "admin.clinic-requests.show",
                                                                    request.id
                                                                ) ? (
                                                                    <Link
                                                                        href={route(
                                                                            "admin.clinic-requests.show",
                                                                            request.id
                                                                        )}
                                                                        title="View details"
                                                                    >
                                                                        <Tooltip content="View details">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 font-semibold rounded-lg px-4 py-2 flex items-center gap-2 hover:shadow-md transition-all duration-300 hover:scale-105"
                                                                            >
                                                                                <Eye className="h-4 w-4" />
                                                                                View
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </Link>
                                                                ) : (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        disabled
                                                                        className="border-gray-200 text-gray-400 font-semibold rounded-lg px-4 py-2 flex items-center gap-2"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        View
                                                                    </Button>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {request.deleted_at ? (
                                                                    <div className="flex gap-2">
                                                                        <Tooltip content="Restore request">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleRestore(
                                                                                        request
                                                                                    )
                                                                                }
                                                                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1 hover:shadow-md transition-all duration-300 hover:scale-105"
                                                                            >
                                                                                <RotateCcw className="h-3 w-3" />
                                                                                Restore
                                                                            </Button>
                                                                        </Tooltip>
                                                                        <Tooltip content="⚠️ PERMANENTLY DELETE - This action cannot be undone!">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleHardDelete(
                                                                                        request
                                                                                    )
                                                                                }
                                                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-800 font-bold rounded-lg px-3 py-1.5 flex items-center gap-1 hover:shadow-lg transition-all duration-300 hover:scale-105 shadow-lg relative overflow-hidden group"
                                                                            >
                                                                                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                                                <HardDrive className="h-3 w-3 relative z-10" />
                                                                                <span className="relative z-10">
                                                                                    Delete
                                                                                </span>
                                                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </div>
                                                                ) : (
                                                                    <Tooltip
                                                                        content={
                                                                            request.status ===
                                                                            "completed"
                                                                                ? "Cannot delete completed requests with active clinic accounts"
                                                                                : request.status ===
                                                                                      "approved" &&
                                                                                  request.payment_status ===
                                                                                      "paid"
                                                                                ? "Cannot delete approved and paid requests - they may be in clinic setup process"
                                                                                : "🗑️ Soft delete - Data will be preserved"
                                                                        }
                                                                    >
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleSoftDelete(
                                                                                    request
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                request.status ===
                                                                                    "completed" ||
                                                                                (request.status ===
                                                                                    "approved" &&
                                                                                    request.payment_status ===
                                                                                        "paid")
                                                                            }
                                                                            className={`font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1 transition-all duration-300 ${
                                                                                request.status ===
                                                                                    "completed" ||
                                                                                (request.status ===
                                                                                    "approved" &&
                                                                                    request.payment_status ===
                                                                                        "paid")
                                                                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                                                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border border-red-700 hover:shadow-md hover:scale-105 shadow-sm relative overflow-hidden group"
                                                                            }`}
                                                                        >
                                                                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                                            <Trash2 className="h-3 w-3 relative z-10" />
                                                                            <span className="relative z-10">
                                                                                Delete
                                                                            </span>
                                                                        </Button>
                                                                    </Tooltip>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {requests.links &&
                                    requests.links.length > 3 && (
                                        <div className="px-6 py-4 border-t border-blue-100">
                                            {/* Page Info */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm text-gray-600">
                                                    Showing{" "}
                                                    <span className="font-semibold">
                                                        {(requests.current_page -
                                                            1) *
                                                            requests.per_page +
                                                            1}
                                                    </span>{" "}
                                                    to{" "}
                                                    <span className="font-semibold">
                                                        {Math.min(
                                                            requests.current_page *
                                                                requests.per_page,
                                                            requests.total
                                                        )}
                                                    </span>{" "}
                                                    of{" "}
                                                    <span className="font-semibold">
                                                        {requests.total}
                                                    </span>{" "}
                                                    requests
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Page{" "}
                                                    <span className="font-semibold">
                                                        {requests.current_page}
                                                    </span>{" "}
                                                    of{" "}
                                                    <span className="font-semibold">
                                                        {requests.last_page}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-center">
                                                <nav className="flex items-center space-x-2">
                                                    {requests.links.map(
                                                        (link, index) =>
                                                            link.url ? (
                                                                <Link
                                                                    key={index}
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    className={`px-4 py-2 text-sm rounded-lg border transition-all duration-300 font-semibold shadow-sm ${
                                                                        link.active
                                                                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-600 shadow-md"
                                                                            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:shadow-md"
                                                                    }`}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                    preserveState
                                                                    preserveScroll
                                                                />
                                                            ) : (
                                                                <span
                                                                    key={index}
                                                                    className="px-4 py-2 text-sm rounded-lg opacity-50 cursor-not-allowed border border-gray-200"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            )
                                                    )}
                                                </nav>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Soft Delete Confirmation Dialog */}
            {softDeleteDialogOpen && requestToSoftDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-600 to-red-700 p-4 text-white relative">
                            <button
                                onClick={() => setSoftDeleteDialogOpen(false)}
                                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
                                aria-label="Close"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Soft Delete Request
                                    </h2>
                                    <p className="text-orange-100 text-xs">
                                        Data will be preserved
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Trash2 className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    Soft Delete{" "}
                                    {requestToSoftDelete.clinic_name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will soft delete the request. The data
                                    will be preserved but hidden from the main
                                    view. You can restore it later if needed.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmSoftDelete}
                                    className="flex-1 bg-gradient-to-r from-orange-600 to-red-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Soft Delete
                                </button>
                                <button
                                    onClick={() =>
                                        setSoftDeleteDialogOpen(false)
                                    }
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hard Delete Confirmation Dialog */}
            {hardDeleteDialogOpen && requestToHardDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white relative">
                            <button
                                onClick={() => setHardDeleteDialogOpen(false)}
                                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
                                aria-label="Close"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Permanently Delete
                                    </h2>
                                    <p className="text-red-100 text-xs">
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <HardDrive className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    Permanently Delete{" "}
                                    {requestToHardDelete.clinic_name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    ⚠️ WARNING: This will permanently delete the
                                    request from the database. This action
                                    cannot be undone and all data will be lost
                                    forever.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmHardDelete}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Permanently Delete
                                </button>
                                <button
                                    onClick={() =>
                                        setHardDeleteDialogOpen(false)
                                    }
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Confirmation Dialog */}
            {restoreDialogOpen && requestToRestore && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 text-white relative">
                            <button
                                onClick={() => setRestoreDialogOpen(false)}
                                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
                                aria-label="Close"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <RotateCcw className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Restore Request
                                    </h2>
                                    <p className="text-emerald-100 text-xs">
                                        Reactivate request
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <RotateCcw className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    Restore {requestToRestore.clinic_name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will restore the request. The request
                                    will be visible again in the main view and
                                    can be processed normally.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmRestore}
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Restore Request
                                </button>
                                <button
                                    onClick={() => setRestoreDialogOpen(false)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
