import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";
import {
    Plus,
    Search,
    Filter,
    Users,
    Clock,
    AlertTriangle,
    CheckCircle,
    Phone,
    Mail,
    Calendar,
    Eye,
    Edit,
    Trash2,
    MessageSquare,
    CalendarDays,
    UserCheck,
    UserX,
    Activity,
    TrendingUp,
    Package,
    Settings,
    XCircle,
    Sparkles,
    BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Index({
    auth,
    clinic,
    waitlist,
    stats,
    dentists,
    services,
    filters,
}) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "all");
    const [priorityFilter, setPriorityFilter] = useState(
        filters?.priority || "all"
    );
    const [dentistFilter, setDentistFilter] = useState(
        filters?.dentist || "all"
    );
    const [serviceFilter, setServiceFilter] = useState(
        filters?.service || "all"
    );

    const getPriorityColor = (priority) => {
        const colors = {
            urgent: "bg-red-100 text-red-800 border-red-300 shadow-sm",
            high: "bg-blue-100 text-blue-800 border-blue-300 shadow-sm",
            normal: "bg-blue-100 text-blue-800 border-blue-300 shadow-sm",
            low: "bg-gray-100 text-gray-600 border-gray-300 shadow-sm",
        };
        return (
            colors[priority] ||
            "bg-gray-100 text-gray-600 border-gray-300 shadow-sm"
        );
    };

    const getStatusColor = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800 border-green-300 shadow-sm",
            contacted: "bg-blue-100 text-blue-800 border-blue-300 shadow-sm",
            scheduled:
                "bg-purple-100 text-purple-800 border-purple-300 shadow-sm",
            cancelled: "bg-red-100 text-red-800 border-red-300 shadow-sm",
            expired: "bg-gray-100 text-gray-600 border-gray-300 shadow-sm",
        };
        return (
            colors[status] ||
            "bg-gray-100 text-gray-600 border-gray-300 shadow-sm"
        );
    };

    const getContactMethodIcon = (method) => {
        switch (method) {
            case "phone":
                return <Phone className="h-4 w-4" />;
            case "email":
                return <Mail className="h-4 w-4" />;
            case "sms":
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const handleFilter = () => {
        const params = {
            search: searchTerm,
        };

        if (statusFilter && statusFilter !== "all") {
            params.status = statusFilter;
        }
        if (priorityFilter && priorityFilter !== "all") {
            params.priority = priorityFilter;
        }
        if (dentistFilter && dentistFilter !== "all") {
            params.dentist = dentistFilter;
        }
        if (serviceFilter && serviceFilter !== "all") {
            params.service = serviceFilter;
        }

        router.get(route("clinic.waitlist.index", clinic.id), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setPriorityFilter("all");
        setDentistFilter("all");
        setServiceFilter("all");
        router.get(
            route("clinic.waitlist.index", clinic.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilter();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [
        searchTerm,
        statusFilter,
        priorityFilter,
        dentistFilter,
        serviceFilter,
    ]);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Waitlist Management" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-5 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Waitlist Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Manage patient waitlist and overflow
                                        appointments
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route(
                                        "clinic.appointments.index",
                                        clinic.id
                                    )}
                                >
                                    <Button
                                        variant="outline"
                                        className="gap-2 text-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-300/50 backdrop-blur-sm"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Appointments
                                    </Button>
                                </Link>
                                <Link
                                    href={route(
                                        "clinic.waitlist.create",
                                        clinic.id
                                    )}
                                >
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm">
                                        <Plus className="h-4 w-4" />
                                        Add Entry
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt--10 pb-12">
                    {/* Enhanced Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Total Entries
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {stats.total}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-blue-600 font-medium">
                                                All entries
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Active
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {stats.active}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                Waiting
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Phone className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Contacted
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {stats.contacted}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-blue-600 font-medium">
                                                In progress
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Scheduled
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {stats.scheduled}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-purple-600 font-medium">
                                                Booked
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Urgent
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {stats.urgent}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-red-600 font-medium">
                                                Priority
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filters Section */}
                    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm rounded-2xl mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[280px]">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search patients..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Compact Filters */}
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="h-10 w-32 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="contacted">
                                            Contacted
                                        </SelectItem>
                                        <SelectItem value="scheduled">
                                            Scheduled
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                        <SelectItem value="expired">
                                            Expired
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={priorityFilter}
                                    onValueChange={setPriorityFilter}
                                >
                                    <SelectTrigger className="h-10 w-32 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Priority
                                        </SelectItem>
                                        <SelectItem value="urgent">
                                            Urgent
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                        <SelectItem value="normal">
                                            Normal
                                        </SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={dentistFilter}
                                    onValueChange={setDentistFilter}
                                >
                                    <SelectTrigger className="h-10 w-36 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Dentist" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Dentists
                                        </SelectItem>
                                        {dentists.map((dentist) => (
                                            <SelectItem
                                                key={dentist.id}
                                                value={dentist.id.toString()}
                                            >
                                                {dentist.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={serviceFilter}
                                    onValueChange={setServiceFilter}
                                >
                                    <SelectTrigger className="h-10 w-36 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Services
                                        </SelectItem>
                                        {services.map((service) => (
                                            <SelectItem
                                                key={service.id}
                                                value={service.id.toString()}
                                            >
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* Clear Filters Button */}
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="h-10 px-4 text-gray-600 hover:text-gray-800 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Clear
                                </Button>

                                {/* Results Count */}
                                <div className="text-sm text-gray-600 font-medium">
                                    {waitlist.data.length} of {waitlist.total}{" "}
                                    entries
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Waitlist Table */}
                    <Card className="shadow-2xl rounded-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                            <CardTitle className="flex items-center gap-3 text-xl text-white">
                                <Users className="h-6 w-6 text-white" />
                                Waitlist Entries
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Patient
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Priority
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Dentist
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Service
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                Added
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {waitlist.data.length > 0 ? (
                                            waitlist.data.map((entry) => (
                                                <tr
                                                    key={entry.id}
                                                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                                                <span className="text-white font-bold text-xs">
                                                                    {entry.patient?.first_name?.charAt(
                                                                        0
                                                                    )}
                                                                    {entry.patient?.last_name?.charAt(
                                                                        0
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">
                                                                    {
                                                                        entry
                                                                            .patient
                                                                            ?.first_name
                                                                    }{" "}
                                                                    {
                                                                        entry
                                                                            .patient
                                                                            ?.last_name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <Phone className="h-3 w-3" />
                                                                    {entry
                                                                        .patient
                                                                        ?.phone_number ||
                                                                        "No phone"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            className={`${getPriorityColor(
                                                                entry.priority
                                                            )} font-semibold px-2 py-1 text-xs`}
                                                        >
                                                            {entry.priority
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                entry.priority.slice(
                                                                    1
                                                                )}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            className={`${getStatusColor(
                                                                entry.status
                                                            )} font-semibold px-2 py-1 text-xs`}
                                                        >
                                                            {entry.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                entry.status.slice(
                                                                    1
                                                                )}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {entry.preferred_dentist ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-green-100 rounded-lg">
                                                                    <UserCheck className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    {
                                                                        entry
                                                                            .preferred_dentist
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-gray-100 rounded-lg">
                                                                    <UserX className="h-4 w-4 text-gray-500" />
                                                                </div>
                                                                <span className="text-sm text-gray-500">
                                                                    Any dentist
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {entry.service ? (
                                                            <span className="text-xs font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                                                                {
                                                                    entry
                                                                        .service
                                                                        .name
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                                                No service
                                                                specified
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-1 bg-blue-100 rounded-lg">
                                                                {getContactMethodIcon(
                                                                    entry.contact_method
                                                                )}
                                                            </div>
                                                            <span className="text-xs font-semibold capitalize text-gray-900">
                                                                {
                                                                    entry.contact_method
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-xs text-gray-900 font-medium">
                                                            {format(
                                                                new Date(
                                                                    entry.created_at
                                                                ),
                                                                "MMM dd, yyyy"
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {format(
                                                                new Date(
                                                                    entry.created_at
                                                                ),
                                                                "HH:mm"
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={route(
                                                                    "clinic.waitlist.show",
                                                                    [
                                                                        clinic.id,
                                                                        entry.id,
                                                                    ]
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    title="View Details"
                                                                    className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "clinic.waitlist.edit",
                                                                    [
                                                                        clinic.id,
                                                                        entry.id,
                                                                    ]
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    title="Edit Entry"
                                                                    className="hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-6 py-16 text-center"
                                                >
                                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                        <Users className="h-10 w-10 text-blue-500" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                                        No waitlist entries
                                                    </h3>
                                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                                        {Object.values(
                                                            filters
                                                        ).some((f) => f)
                                                            ? "No entries match your current filters. Try adjusting your search criteria."
                                                            : "Get started by adding patients to the waitlist to manage overflow appointments."}
                                                    </p>
                                                    {!Object.values(
                                                        filters
                                                    ).some((f) => f) && (
                                                        <Link
                                                            href={route(
                                                                "clinic.waitlist.create",
                                                                clinic.id
                                                            )}
                                                        >
                                                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Add First Entry
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>

                        {/* Pagination Footer - Integrated in Table */}
                        {waitlist.data.length > 0 && (
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700 font-medium">
                                        Showing{" "}
                                        <span className="font-bold text-blue-600">
                                            {waitlist.from}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-bold text-blue-600">
                                            {waitlist.to}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-bold text-blue-600">
                                            {waitlist.total}
                                        </span>{" "}
                                        results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {waitlist.links.map((link, index) =>
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-1 text-sm rounded-lg font-medium transition-all duration-200 ${
                                                        link.active
                                                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                                                            : "bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
                                                    }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed font-medium"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
