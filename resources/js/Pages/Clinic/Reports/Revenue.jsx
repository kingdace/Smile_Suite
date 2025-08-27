import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    DollarSign,
    Search,
    Filter,
    Download,
    Eye,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Clock,
    XCircle,
    BarChart3,
    ArrowLeft,
    CreditCard,
    Wallet,
    Building,
} from "lucide-react";
import { format } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";

export default function Revenue({
    auth,
    clinic,
    payments,
    revenueStats,
    filters,
}) {
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [paymentMethod, setPaymentMethod] = useState(
        filters?.payment_method || ""
    );
    const [dateFrom, setDateFrom] = useState(filters?.date_from || "");
    const [dateTo, setDateTo] = useState(filters?.date_to || "");

    const handleSearch = () => {
        router.get(
            route("clinic.reports.revenue", clinic.id),
            {
                search,
                status,
                payment_method: paymentMethod,
                date_from: dateFrom,
                date_to: dateTo,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setPaymentMethod("");
        setDateFrom("");
        setDateTo("");
        router.get(
            route("clinic.reports.revenue", clinic.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return format(new Date(date), "MMM dd, yyyy");
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return "N/A";
        return format(new Date(dateTime), "MMM dd, yyyy hh:mm a");
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
            },
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
            failed: { color: "bg-red-100 text-red-800", icon: XCircle },
            refunded: {
                color: "bg-orange-100 text-orange-800",
                icon: TrendingDown,
            },
            cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
        };

        const config =
            statusConfig[status?.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </Badge>
        );
    };

    const getPaymentMethodIcon = (method) => {
        const methodConfig = {
            cash: { icon: Wallet, color: "text-green-600" },
            card: { icon: CreditCard, color: "text-blue-600" },
            gcash: { icon: CreditCard, color: "text-blue-600" },
            bank_transfer: { icon: Building, color: "text-purple-600" },
            check: { icon: CreditCard, color: "text-gray-600" },
        };

        const config = methodConfig[method?.toLowerCase()] || methodConfig.cash;
        const Icon = config.icon;

        return <Icon className={`w-4 h-4 ${config.color}`} />;
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    // Sample data for charts (replace with real data from backend)
    const monthlyRevenue = [
        { month: "Jan", revenue: 125000, payments: 45 },
        { month: "Feb", revenue: 142000, payments: 52 },
        { month: "Mar", revenue: 138000, payments: 48 },
        { month: "Apr", revenue: 165000, payments: 61 },
        { month: "May", revenue: 152000, payments: 55 },
        { month: "Jun", revenue: 178000, payments: 58 },
    ];

    const paymentMethodsData = [
        {
            name: "Cash",
            value: revenueStats?.payment_methods?.cash || 0,
            color: "#10b981",
        },
        {
            name: "Card",
            value: revenueStats?.payment_methods?.card || 0,
            color: "#3b82f6",
        },
        {
            name: "GCash",
            value: revenueStats?.payment_methods?.gcash || 0,
            color: "#8b5cf6",
        },
        {
            name: "Bank Transfer",
            value: revenueStats?.payment_methods?.bank_transfer || 0,
            color: "#f59e0b",
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Revenue Report" />

            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Revenue Report
                            </h1>
                            <p className="text-green-100">
                                Financial performance and payment analysis
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Link href={route("clinic.reports.index", clinic.id)}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Reports
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(revenueStats?.total || 0)}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    This Month
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        revenueStats?.this_month || 0
                                    )}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Completed Payments
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatNumber(revenueStats?.completed || 0)}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Pending Payments
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {formatNumber(revenueStats?.pending || 0)}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Monthly Revenue Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Payment Methods Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={paymentMethodsData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) =>
                                        `${name}: ${formatCurrency(value)}`
                                    }
                                >
                                    {paymentMethodsData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatCurrency(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search & Filter Payments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                placeholder="Patient, treatment, ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleSearch()
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="completed">
                                        Completed
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="failed">
                                        Failed
                                    </SelectItem>
                                    <SelectItem value="refunded">
                                        Refunded
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="paymentMethod">
                                Payment Method
                            </Label>
                            <Select
                                value={paymentMethod}
                                onValueChange={setPaymentMethod}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Methods" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">
                                        All Methods
                                    </SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="card">Card</SelectItem>
                                    <SelectItem value="gcash">GCash</SelectItem>
                                    <SelectItem value="bank_transfer">
                                        Bank Transfer
                                    </SelectItem>
                                    <SelectItem value="check">Check</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="dateFrom">From Date</Label>
                            <Input
                                id="dateFrom"
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="dateTo">To Date</Label>
                            <Input
                                id="dateTo"
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <Button
                            onClick={handleSearch}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                        <Button variant="outline" onClick={clearFilters}>
                            <Filter className="w-4 h-4 mr-2" />
                            Clear All
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5" />
                            Payments ({payments?.total || 0})
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Treatment</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments?.data?.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div className="font-mono text-sm">
                                                {payment.reference_number}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {
                                                        payment.patient?.user
                                                            ?.name
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {
                                                        payment.patient?.user
                                                            ?.email
                                                    }
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {payment.treatment?.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {
                                                        payment.treatment
                                                            ?.service?.name
                                                    }
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-green-600">
                                                {formatCurrency(payment.amount)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getPaymentMethodIcon(
                                                    payment.payment_method
                                                )}
                                                <span className="capitalize">
                                                    {payment.payment_method}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(payment.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {formatDate(
                                                        payment.payment_date
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDateTime(
                                                        payment.created_at
                                                    )}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route(
                                                        "clinic.payments.show",
                                                        [clinic.id, payment.id]
                                                    )}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {payments?.links && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Showing {payments.from} to {payments.to} of{" "}
                                {payments.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                {payments.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? "bg-green-600 text-white"
                                                : "bg-white text-gray-700 border hover:bg-gray-50"
                                        } ${
                                            !link.url &&
                                            "opacity-50 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
