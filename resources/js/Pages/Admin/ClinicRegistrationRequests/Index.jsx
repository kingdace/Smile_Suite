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
} from "lucide-react";
import { Tooltip } from "@/Components/ui/tooltip";

export default function Index({ auth, requests, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [paymentStatus, setPaymentStatus] = useState(
        filters.payment_status || "all"
    );

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

        router.get(route("admin.clinic-requests.index"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setPaymentStatus("all");
        router.get(
            route("admin.clinic-requests.index"),
            { page: 1 }, // Reset to first page when clearing filters
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
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
            failed: "bg-red-100 text-red-700 border-red-200",
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
        },
        {
            label: "Pending Review",
            value: requests.data.filter((r) => r.status === "pending").length,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            label: "Approved",
            value: requests.data.filter((r) => r.status === "approved").length,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            label: "Completed Setup",
            value: requests.data.filter((r) => r.status === "completed").length,
            icon: Building2,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Clinic Registration Requests" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50 mb-8">
                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <ClipboardList className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">
                                            Clinic Registration Requests
                                        </h1>
                                        <p className="text-blue-100 text-sm">
                                            Manage and review new clinic
                                            applications
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm font-medium"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative"
                            >
                                {/* Background gradient overlay */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-10`}
                                ></div>

                                {/* Icon with enhanced styling */}
                                <div className="relative z-10 mb-3">
                                    <div
                                        className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto shadow-md border border-white/50`}
                                    >
                                        <stat.icon
                                            className={`w-5 h-5 ${stat.color}`}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs font-medium text-gray-600">
                                        {stat.label}
                                    </div>
                                </div>

                                {/* Decorative corner accent */}
                                <div
                                    className={`absolute top-0 right-0 w-12 h-12 ${stat.bgColor} opacity-20 rounded-bl-full`}
                                ></div>
                            </div>
                        ))}
                    </div>

                    {/* Notification Banner for Pending Requests */}
                    {requests.data.some(
                        (request) => request.status === "pending"
                    ) && (
                        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-yellow-900">
                                        Pending Requests Require Attention
                                    </h3>
                                    <p className="text-sm text-yellow-800">
                                        You have{" "}
                                        <span className="font-bold">
                                            {
                                                requests.data.filter(
                                                    (r) =>
                                                        r.status === "pending"
                                                ).length
                                            }
                                        </span>{" "}
                                        pending clinic registration request(s)
                                        that need review and approval.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Celebration Banner for Completed Setups */}
                    {requests.data.some(
                        (request) => request.status === "completed"
                    ) && (
                        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🎉</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-emerald-900">
                                        Successful Clinic Setups!
                                    </h3>
                                    <p className="text-sm text-emerald-800">
                                        Congratulations!{" "}
                                        <span className="font-bold">
                                            {
                                                requests.data.filter(
                                                    (r) =>
                                                        r.status === "completed"
                                                ).length
                                            }
                                        </span>{" "}
                                        clinic(s) have successfully completed
                                        their setup and are now live on Smile
                                        Suite.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                <Filter className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Search & Filters
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Search
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search clinics, contacts, or emails..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === "Enter" && handleFilter()
                                        }
                                        className="pl-10 w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Status
                                </label>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm">
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

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Payment Status
                                </label>
                                <Select
                                    value={paymentStatus}
                                    onValueChange={setPaymentStatus}
                                >
                                    <SelectTrigger className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm">
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

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Actions
                                </label>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleFilter}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Apply Filters
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold transition-all duration-300"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                    <Inbox className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Registration Requests ({requests.total})
                                </h3>
                            </div>
                        </div>

                        <div className="p-6">
                            {requests.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Inbox className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                                        No Requests Found
                                    </h3>
                                    <p className="text-sm text-gray-400 text-center max-w-md">
                                        No clinic registration requests match
                                        your current filters. New clinic
                                        applications will appear here for
                                        review.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table className="min-w-full">
                                        <TableHeader>
                                            <TableRow className="bg-blue-50/50">
                                                <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider px-5 py-3.5 w-1/4">
                                                    Clinic Name
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider px-5 py-3.5 w-1/6">
                                                    Contact
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider px-5 py-3.5 w-1/5">
                                                    Email
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider px-5 py-3.5 w-1/12">
                                                    Plan
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider px-5 py-3.5 w-1/12">
                                                    Payment
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider px-5 py-3.5 w-1/12">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-700 uppercase tracking-wider px-5 py-3.5 w-1/8">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.data.map(
                                                (request, idx) => (
                                                    <TableRow
                                                        key={request.id}
                                                        className={`transition-all duration-200 hover:bg-blue-50/30 ${
                                                            idx % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-gray-50/50"
                                                        }`}
                                                    >
                                                        <TableCell className="px-5 py-3.5">
                                                            <div className="flex items-start gap-3">
                                                                <div className="flex-shrink-0">
                                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
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
                                                                            <span className="flex-shrink-0 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-medium">
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
                                                                            <span className="flex-shrink-0 text-emerald-600 font-medium flex items-center gap-1">
                                                                                <span className="text-xs">
                                                                                    ✓
                                                                                </span>
                                                                                Complete
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-3.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <Users className="w-3 h-3 text-blue-600" />
                                                                </div>
                                                                <span className="text-gray-900 font-medium truncate">
                                                                    {
                                                                        request.contact_person
                                                                    }
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-3.5">
                                                            <span className="text-gray-700 text-sm truncate block">
                                                                {request.email}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-3.5">
                                                            <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1 flex items-center gap-1 w-fit">
                                                                <DollarSign className="w-3 h-3" />
                                                                {
                                                                    request.subscription_plan
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="px-5 py-3.5">
                                                            {getPaymentStatusBadge(
                                                                request.payment_status
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-5 py-3.5">
                                                            {getStatusBadge(
                                                                request.status
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="px-5 py-3.5">
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
                                                                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 font-semibold rounded-lg px-4 py-2 flex items-center gap-2 hover:shadow-md transition-all duration-300"
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
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {requests.links && requests.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-blue-100">
                                {/* Page Info */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-sm text-gray-600">
                                        Showing{" "}
                                        <span className="font-semibold">
                                            {(requests.current_page - 1) *
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
                                        {requests.links.map((link, index) =>
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
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
        </AuthenticatedLayout>
    );
}
