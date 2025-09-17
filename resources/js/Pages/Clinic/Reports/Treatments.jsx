import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import ExportButton from "@/Components/Reports/ExportButton";
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
    Stethoscope,
    Search,
    Filter,
    Download,
    Eye,
    TrendingUp,
    CheckCircle,
    Clock,
    XCircle,
    BarChart3,
    ArrowLeft,
    DollarSign,
    User,
    Calendar,
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

export default function Treatments({
    auth,
    clinic,
    treatments,
    treatmentStats,
    filters,
}) {
    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [category, setCategory] = useState(filters?.category || "");

    const handleSearch = () => {
        router.get(
            route("clinic.reports.treatments", clinic.id),
            {
                search,
                status,
                category,
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
        setCategory("");
        router.get(
            route("clinic.reports.treatments", clinic.id),
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

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
            },
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
            in_progress: { color: "bg-blue-100 text-blue-800", icon: Clock },
            cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
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

    const getStatusColor = (status) => {
        const colors = {
            completed: "#10b981",
            pending: "#f59e0b",
            in_progress: "#3b82f6",
            cancelled: "#ef4444",
        };
        return colors[status?.toLowerCase()] || "#f59e0b";
    };

    // Sample data for charts (replace with real data from backend)
    const treatmentTrends = [
        { month: "Jan", treatments: 25, completed: 20, revenue: 85000 },
        { month: "Feb", treatments: 32, completed: 28, revenue: 112000 },
        { month: "Mar", treatments: 28, completed: 24, revenue: 98000 },
        { month: "Apr", treatments: 35, completed: 31, revenue: 125000 },
        { month: "May", treatments: 30, completed: 26, revenue: 105000 },
        { month: "Jun", treatments: 38, completed: 34, revenue: 135000 },
    ];

    const statusDistribution = [
        {
            name: "Completed",
            value: treatmentStats?.completed || 0,
            color: "#10b981",
        },
        {
            name: "Pending",
            value: treatmentStats?.pending || 0,
            color: "#f59e0b",
        },
        {
            name: "In Progress",
            value: treatmentStats?.in_progress || 0,
            color: "#3b82f6",
        },
        {
            name: "Cancelled",
            value: treatmentStats?.cancelled || 0,
            color: "#ef4444",
        },
    ];

    const categoryDistribution = [
        {
            name: "Preventive",
            value: treatmentStats?.categories?.preventive || 0,
            color: "#3b82f6",
        },
        {
            name: "Restorative",
            value: treatmentStats?.categories?.restorative || 0,
            color: "#8b5cf6",
        },
        {
            name: "Surgical",
            value: treatmentStats?.categories?.surgical || 0,
            color: "#f59e0b",
        },
        {
            name: "Cosmetic",
            value: treatmentStats?.categories?.cosmetic || 0,
            color: "#10b981",
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Treatments Report" />

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Treatments Report
                            </h1>
                            <p className="text-indigo-100">
                                Treatment performance and patient care analysis
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            exportRoute={`/clinic/${clinic.id}/reports/export/treatments`}
                            filters={filters}
                            clinic={clinic}
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        />
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
                                    Total Treatments
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(treatmentStats?.total || 0)}
                                </p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <Stethoscope className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatNumber(
                                        treatmentStats?.completed || 0
                                    )}
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
                                    This Month
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatNumber(
                                        treatmentStats?.this_month || 0
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
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(
                                        treatmentStats?.total_revenue || 0
                                    )}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
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
                            Treatment Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={treatmentTrends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="treatments"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.3}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="completed"
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
                            Status Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) =>
                                        `${name}: ${value}`
                                    }
                                >
                                    {statusDistribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
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
                        Search & Filter Treatments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                placeholder="Patient name, treatment name..."
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
                                    <SelectItem value="in_progress">
                                        In Progress
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        Cancelled
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">
                                        All Categories
                                    </SelectItem>
                                    <SelectItem value="preventive">
                                        Preventive
                                    </SelectItem>
                                    <SelectItem value="restorative">
                                        Restorative
                                    </SelectItem>
                                    <SelectItem value="surgical">
                                        Surgical
                                    </SelectItem>
                                    <SelectItem value="cosmetic">
                                        Cosmetic
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <Button
                            onClick={handleSearch}
                            className="bg-indigo-600 hover:bg-indigo-700"
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

            {/* Treatments Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5" />
                            Treatments ({treatments?.total || 0})
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Treatment</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Dentist</TableHead>
                                    <TableHead>Cost</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {treatments?.data?.map((treatment) => (
                                    <TableRow key={treatment.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {
                                                        treatment.patient?.user
                                                            ?.name
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {
                                                        treatment.patient?.user
                                                            ?.email
                                                    }
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {treatment.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {treatment.description}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {treatment.service?.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {treatment.dentist?.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {treatment.dentist?.email}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-green-600">
                                                {formatCurrency(
                                                    treatment.cost || 0
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(treatment.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {formatDate(
                                                        treatment.start_date
                                                    )}
                                                </p>
                                                {treatment.end_date && (
                                                    <p className="text-sm text-gray-500">
                                                        End:{" "}
                                                        {formatDate(
                                                            treatment.end_date
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route(
                                                        "clinic.treatments.show",
                                                        [
                                                            clinic.id,
                                                            treatment.id,
                                                        ]
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
                    {treatments?.links && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Showing {treatments.from} to {treatments.to} of{" "}
                                {treatments.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                {treatments.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? "bg-indigo-600 text-white"
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
