import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import ExportButton from "@/Components/Reports/ExportButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Calendar,
    CalendarDays,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Filter,
    ArrowLeft,
    Eye,
    TrendingUp,
    TrendingDown,
    BarChart3,
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
} from "recharts";

export default function AppointmentsReport({
    auth,
    clinic,
    appointments,
    appointmentStats,
    filters,
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");

    const handleSearch = () => {
        router.get(
            route("clinic.reports.appointments", clinic.id),
            {
                search: searchTerm,
                status: statusFilter,
                date_from: dateFrom,
                date_to: dateTo,
            },
            { preserveState: true }
        );
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setDateFrom("");
        setDateTo("");
        router.get(route("clinic.reports.appointments", clinic.id));
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            Pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-700" },
            Confirmed: { variant: "default", className: "bg-blue-100 text-blue-700" },
            Completed: { variant: "default", className: "bg-green-100 text-green-700" },
            Cancelled: { variant: "destructive", className: "bg-red-100 text-red-700" },
            "No Show": { variant: "destructive", className: "bg-gray-100 text-gray-700" },
        };

        const config = statusConfig[status] || statusConfig.Pending;
        return (
            <Badge variant={config.variant} className={config.className}>
                {status}
            </Badge>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    // Chart data for appointment trends
    const appointmentTrendData = [
        { day: "Mon", scheduled: 12, completed: 10, cancelled: 2 },
        { day: "Tue", scheduled: 15, completed: 14, cancelled: 1 },
        { day: "Wed", scheduled: 18, completed: 16, cancelled: 2 },
        { day: "Thu", scheduled: 14, completed: 13, cancelled: 1 },
        { day: "Fri", scheduled: 16, completed: 15, cancelled: 1 },
        { day: "Sat", scheduled: 8, completed: 7, cancelled: 1 },
        { day: "Sun", scheduled: 3, completed: 3, cancelled: 0 },
    ];

    const statusDistribution = [
        { name: "Completed", value: appointmentStats.completed_appointments, color: "#10B981" },
        { name: "Pending", value: appointmentStats.pending_appointments, color: "#F59E0B" },
        { name: "Cancelled", value: appointmentStats.cancelled_appointments, color: "#EF4444" },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Appointments Report" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
                    <div className="max-w-7xl mx-auto px-8 py-12">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Appointments Report
                                </h1>
                                <p className="text-blue-100">
                                    Comprehensive appointment scheduling and status analysis
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <ExportButton
                                    exportRoute={`/clinic/${clinic.id}/reports/export/appointments`}
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
                </div>

                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Appointments
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {appointmentStats.total_appointments?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Pending Appointments
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-600">
                                            {appointmentStats.pending_appointments?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Completed Appointments
                                        </p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {appointmentStats.completed_appointments?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            This Month
                                        </p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {appointmentStats.this_month?.toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <CalendarDays className="h-8 w-8 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                    Weekly Appointment Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={appointmentTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="scheduled" fill="#3B82F6" name="Scheduled" />
                                        <Bar dataKey="completed" fill="#10B981" name="Completed" />
                                        <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-green-600" />
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
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {statusDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div>
                                    <Label htmlFor="search">Search</Label>
                                    <Input
                                        id="search"
                                        placeholder="Search appointments..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">All statuses</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="date_from">From Date</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="date_to">To Date</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button onClick={handleSearch} className="flex-1">
                                        <Search className="w-4 h-4 mr-2" />
                                        Search
                                    </Button>
                                    <Button variant="outline" onClick={clearFilters}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointments Table */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Appointments List</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Dentist</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Scheduled Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {appointments.data?.map((appointment) => (
                                        <TableRow key={appointment.id}>
                                            <TableCell className="font-medium">
                                                {appointment.patient ? 
                                                    `${appointment.patient.first_name} ${appointment.patient.last_name}` : 
                                                    'N/A'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {appointment.assigned_dentist?.name || 'Unassigned'}
                                            </TableCell>
                                            <TableCell>
                                                {appointment.type?.name || 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                {appointment.scheduled_at ? 
                                                    format(new Date(appointment.scheduled_at), 'MMM dd, yyyy HH:mm') : 
                                                    'N/A'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(appointment.status?.name || 'Unknown')}
                                            </TableCell>
                                            <TableCell>
                                                {appointment.duration_minutes ? 
                                                    `${appointment.duration_minutes} min` : 
                                                    'N/A'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {appointments.links && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-500">
                                        Showing {appointments.from || 0} to {appointments.to || 0} of{" "}
                                        {appointments.total || 0} appointments
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {appointments.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
