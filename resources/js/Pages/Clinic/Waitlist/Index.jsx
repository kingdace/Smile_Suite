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

            {/* Main Page Container */}
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header Bar */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                    <Users className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Waitlist Management
                                    </h1>
                                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-blue-500" />
                                        Manage patient waitlist and overflow
                                        appointments
                                    </p>
                                </div>
                            </div>
                            <Link
                                href={route(
                                    "clinic.waitlist.create",
                                    clinic.id
                                )}
                            >
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 px-6 py-3">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add Entry
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Enhanced Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                            <BarChart3 className="h-4 w-4" />
                                            Total Entries
                                        </p>
                                        <p className="text-3xl font-bold text-blue-900">
                                            {stats.total}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600 flex items-center gap-1">
                                            <Activity className="h-4 w-4" />
                                            Active
                                        </p>
                                        <p className="text-3xl font-bold text-green-900">
                                            {stats.active}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600 flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            Contacted
                                        </p>
                                        <p className="text-3xl font-bold text-blue-900">
                                            {stats.contacted}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                                        <Phone className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Scheduled
                                        </p>
                                        <p className="text-3xl font-bold text-purple-900">
                                            {stats.scheduled}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600 flex items-center gap-1">
                                            <AlertTriangle className="h-4 w-4" />
                                            Urgent
                                        </p>
                                        <p className="text-3xl font-bold text-red-900">
                                            {stats.urgent}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Waitlist Table */}
                    <Card className="shadow-2xl border-0 bg-white rounded-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 py-4">
                            <div className="space-y-4">
                                {/* Header with Title and Create Button */}
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-3 text-blue-900">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                            <Users className="h-5 w-5 text-white" />
                                        </div>
                                        Waitlist Entries
                                    </CardTitle>
                                    <Link
                                        href={route(
                                            "clinic.waitlist.create",
                                            clinic.id
                                        )}
                                    >
                                        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Entry
                                        </Button>
                                    </Link>
                                </div>

                                {/* Search and Filters Embedded in Header */}
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
                                            <SelectItem value="low">
                                                Low
                                            </SelectItem>
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
                                        {waitlist.data.length} of{" "}
                                        {waitlist.total} entries
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {waitlist.data.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                                            <TableHead className="font-bold text-blue-900 py-4 px-6">
                                                Patient
                                            </TableHead>
                                            <TableHead className="font-bold text-blue-900 py-4 px-6">
                                                Priority
                                            </TableHead>
                                            <TableHead className="font-bold text-blue-900 py-4 px-6">
                                                Status
                                            </TableHead>
                                            <TableHead className="font-bold text-blue-900 py-4 px-6">
                                                Dentist
                                            </TableHead>
                                            <TableHead className="font-bold text-blue-900 py-4 px-6">
                                                Service
                                            </TableHead>
                                            <TableHead className="font-bold text-blue-900 py-4 px-6">
                                                Contact
                                            </TableHead>
                                            <TableHead className="font-bold text-blue-900 py-4 px-6">
                                                Added
                                            </TableHead>
                                            <TableHead className="font-bold text-blue-900 py-4 px-6 text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {waitlist.data.map((entry) => (
                                            <TableRow
                                                key={entry.id}
                                                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 border-b border-gray-100"
                                            >
                                                <TableCell className="py-4 px-6">
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
                                                                {entry.patient
                                                                    ?.phone_number ||
                                                                    "No phone"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
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
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
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
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    {entry.preferred_dentist ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                <UserCheck className="h-4 w-4 text-green-600" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                Dr.{" "}
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
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
                                                    {entry.service ? (
                                                        <span className="text-xs font-semibold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                                                            {entry.service.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                                            No service specified
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
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
                                                </TableCell>
                                                <TableCell className="py-4 px-6">
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
                                                </TableCell>
                                                <TableCell className="text-right py-4 px-6">
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
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Users className="h-10 w-10 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        No waitlist entries
                                    </h3>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                        {Object.values(filters).some((f) => f)
                                            ? "No entries match your current filters. Try adjusting your search criteria."
                                            : "Get started by adding patients to the waitlist to manage overflow appointments."}
                                    </p>
                                    {!Object.values(filters).some((f) => f) && (
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
                                </div>
                            )}
                        </CardContent>

                        {/* Pagination Footer - Embedded in Table */}
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
