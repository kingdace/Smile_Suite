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
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return (
            <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
                {status}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-800",
            paid: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
        };
        return (
            <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
                {status}
            </Badge>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Clinic Registration Requests" />
            <div className="py-12 min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-300 shadow-sm">
                            <ClipboardList className="w-7 h-7 text-blue-500" />
                        </span>
                        <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Clinic Registration Requests
                        </span>
                    </div>
                    {/* Notification Banner for Pending Requests */}
                    {requests.data.some(
                        (request) => request.status === "pending"
                    ) && (
                        <div className="mb-6 flex items-center gap-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 shadow-sm">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                                <Clock className="h-5 w-5 text-yellow-500" />
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-900 flex items-center gap-1">
                                    Pending Requests Require Attention
                                </h3>
                                <p className="text-sm text-yellow-800">
                                    You have{" "}
                                    {
                                        requests.data.filter(
                                            (r) => r.status === "pending"
                                        ).length
                                    }{" "}
                                    pending clinic registration request(s) that
                                    need review and approval.
                                </p>
                            </div>
                        </div>
                    )}
                    {/* Filters Card */}
                    <Card className="mb-6 shadow-lg rounded-2xl border-l-4 border-blue-200 border-t border-r border-b border-gray-100 bg-white">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-900 font-bold">
                                <Search className="h-5 w-5 text-blue-400" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <Search className="h-4 w-4 text-gray-300" />
                                    <Input
                                        placeholder="Search clinics, contacts, or emails..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === "Enter" && handleFilter()
                                        }
                                        className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-md shadow-sm text-gray-900 transition-all duration-150"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="h-4 w-4 text-gray-300" />
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-md text-gray-900 transition-all duration-150">
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
                                            <SelectItem value="rejected">
                                                Rejected
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-gray-300" />
                                    <Select
                                        value={paymentStatus}
                                        onValueChange={setPaymentStatus}
                                    >
                                        <SelectTrigger className="w-full border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-md text-gray-900 transition-all duration-150">
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
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleFilter}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow rounded-md"
                                    >
                                        Apply Filters
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="border-gray-200 text-gray-700 font-semibold rounded-md"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Divider between filters and table */}
                    <div className="h-px bg-gray-100 mb-6" />
                    {/* Requests Table Card */}
                    <Card className="rounded-2xl border-l-4 border-blue-200 border-t border-r border-b border-gray-100 bg-white shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Inbox className="h-5 w-5 text-blue-400" />
                                Registration Requests ({requests.total})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {requests.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-gray-400 text-base gap-4">
                                    <Inbox className="w-12 h-12 text-gray-200" />
                                    <span>
                                        No clinic registration requests found.
                                    </span>
                                    <span className="text-sm text-gray-400">
                                        New clinics will appear here for your
                                        review.
                                    </span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table className="min-w-full">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Clinic Name
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Contact Person
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Plan
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Payment
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Submitted
                                                </TableHead>
                                                <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.data.map(
                                                (request, idx) => (
                                                    <TableRow
                                                        key={request.id}
                                                        className={`transition-colors duration-150 ${
                                                            idx % 2 === 0
                                                                ? "bg-white"
                                                                : "bg-gray-50"
                                                        } hover:bg-blue-50/60`}
                                                    >
                                                        <TableCell className="font-medium text-gray-900">
                                                            {
                                                                request.clinic_name
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {
                                                                request.contact_person
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {request.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className="capitalize bg-gray-100 text-gray-800 border-none flex items-center gap-1 px-2 py-1"
                                                            >
                                                                <DollarSign className="w-4 h-4 text-blue-400" />
                                                                {
                                                                    request.subscription_plan
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`rounded-full px-3 py-1 font-semibold text-xs border-none flex items-center gap-1 ${
                                                                    request.payment_status ===
                                                                    "paid"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : request.payment_status ===
                                                                          "pending"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : request.payment_status ===
                                                                          "failed"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {request.payment_status ===
                                                                    "paid" && (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                )}
                                                                {request.payment_status ===
                                                                    "pending" && (
                                                                    <Clock className="w-4 h-4 text-yellow-500" />
                                                                )}
                                                                {request.payment_status ===
                                                                    "failed" && (
                                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                                )}
                                                                {
                                                                    request.payment_status
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`rounded-full px-3 py-1 font-semibold text-xs border-none flex items-center gap-1 ${
                                                                    request.status ===
                                                                    "approved"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : request.status ===
                                                                          "pending"
                                                                        ? "bg-yellow-100 text-yellow-700"
                                                                        : request.status ===
                                                                          "rejected"
                                                                        ? "bg-red-100 text-red-700"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                            >
                                                                {request.status ===
                                                                    "approved" && (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                )}
                                                                {request.status ===
                                                                    "pending" && (
                                                                    <Clock className="w-4 h-4 text-yellow-500" />
                                                                )}
                                                                {request.status ===
                                                                    "rejected" && (
                                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                                )}
                                                                {request.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-gray-900">
                                                            {formatDate(
                                                                request.created_at
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
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
                                                                            className="border-blue-200 text-blue-700 font-semibold rounded-full px-4 py-1 flex items-center gap-1 hover:bg-blue-50"
                                                                        >
                                                                            <Eye className="h-4 w-4 text-blue-400" />
                                                                            View
                                                                        </Button>
                                                                    </Tooltip>
                                                                </Link>
                                                            ) : (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled
                                                                    className="border-gray-200 text-gray-400 font-semibold rounded-full px-4 py-1 flex items-center gap-1"
                                                                >
                                                                    <Eye className="h-4 w-4 text-gray-300" />
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
                            {/* Divider above pagination */}
                            <div className="h-px bg-gray-100 mt-8 mb-4" />
                            {/* Pagination */}
                            {requests.links && requests.links.length > 3 && (
                                <div className="flex justify-center">
                                    <nav className="flex items-center space-x-2">
                                        {requests.links.map((link, index) =>
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm rounded-full border transition-colors duration-150 font-semibold shadow-sm ${
                                                        link.active
                                                            ? "bg-blue-600 text-white border-blue-600"
                                                            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm rounded-full opacity-50 cursor-not-allowed border border-gray-200"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )
                                        )}
                                    </nav>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
