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
    Check,
    X,
    Calendar,
    Clock,
    User,
    Stethoscope,
    Eye,
    Edit,
    Trash2,
    Filter,
    Activity,
    CheckCircle,
    AlertCircle,
    XCircle,
    CalendarClock,
    Users,
    TrendingUp,
    Package,
    Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Index({ auth, clinic, appointments, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [type, setType] = useState(filters.type || "all");
    const [date, setDate] = useState(filters.date || "");
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showDenyModal, setShowDenyModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState("");
    const [denyReason, setDenyReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    // Calculate statistics with safety checks
    const totalAppointments = appointments?.total || 0;
    const confirmedAppointments =
        appointments?.data?.filter((apt) => apt.status?.name === "Confirmed")
            ?.length || 0;
    const pendingAppointments =
        appointments?.data?.filter((apt) => apt.status?.name === "Pending")
            ?.length || 0;
    const completedAppointments =
        appointments?.data?.filter((apt) => apt.status?.name === "Completed")
            ?.length || 0;
    const cancelledAppointments =
        appointments?.data?.filter((apt) => apt.status?.name === "Cancelled")
            ?.length || 0;

    // Helper function to get status color
    const getStatusColor = (statusName) => {
        const colors = {
            Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
            Confirmed: "bg-blue-100 text-blue-700 border-blue-300",
            Completed: "bg-green-100 text-green-700 border-green-300",
            Cancelled: "bg-red-100 text-red-700 border-red-300",
            "No Show": "bg-gray-100 text-gray-700 border-gray-300",
        };
        return (
            colors[statusName] || "bg-gray-100 text-gray-700 border-gray-300"
        );
    };

    // Helper function to get type color
    const getTypeColor = (typeName) => {
        const colors = {
            "Walk-in": "bg-purple-100 text-purple-700 border-purple-300",
            "Phone Call": "bg-indigo-100 text-indigo-700 border-indigo-300",
            "Online Booking": "bg-cyan-100 text-cyan-700 border-cyan-300",
            "Follow-up": "bg-orange-100 text-orange-700 border-orange-300",
            Emergency: "bg-red-100 text-red-700 border-red-300",
        };
        return colors[typeName] || "bg-gray-100 text-gray-700 border-gray-300";
    };

    useEffect(() => {
        if (showApproveModal && clinic.id) {
            axios
                .get(route("clinic.dentists.index", [clinic.id]))
                .then((res) => {
                    let dentistList = res.data.dentists;
                    // Include current user if they are a dentist and not already in the list
                    if (auth?.user?.role === "dentist") {
                        const alreadyIncluded = dentistList.some(
                            (d) => d.id === auth.user.id
                        );
                        if (!alreadyIncluded) {
                            dentistList = [
                                {
                                    id: auth.user.id,
                                    name: auth.user.name,
                                    email: auth.user.email,
                                    role: "dentist",
                                },
                                ...dentistList,
                            ];
                        }
                    }
                    setDentists(dentistList);
                });
        }
    }, [showApproveModal, clinic.id]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("clinic.appointments.index", clinic.id),
            {
                search,
                status: status === "all" ? "" : status,
                type: type === "all" ? "" : type,
                date,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleApprove = (appointment) => {
        setSelectedAppointment(appointment);
        setShowApproveModal(true);
        setSelectedDentist(appointment.assigned_to || "");
        setActionError("");
    };
    const handleDeny = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDenyModal(true);
        setDenyReason("");
        setActionError("");
    };
    const submitApprove = async () => {
        setActionLoading(true);
        setActionError("");
        try {
            await axios.post(
                route("clinic.appointments.approve-online", {
                    clinic: clinic.id,
                    appointment: selectedAppointment.id,
                }),
                {
                    assigned_to: selectedDentist || null,
                }
            );
            setShowApproveModal(false);
            window.location.reload();
        } catch (err) {
            setActionError("Failed to approve appointment.");
        } finally {
            setActionLoading(false);
        }
    };
    const submitDeny = async () => {
        setActionLoading(true);
        setActionError("");
        try {
            await axios.post(
                route("clinic.appointments.deny-online", {
                    clinic: clinic.id,
                    appointment: selectedAppointment.id,
                }),
                {
                    cancellation_reason: denyReason,
                }
            );
            setShowDenyModal(false);
            window.location.reload();
        } catch (err) {
            setActionError("Failed to deny appointment.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${clinic.name} - Appointments`} />

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
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Appointments Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Manage and schedule patient appointments
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route(
                                        "clinic.appointments.calendar",
                                        clinic.id
                                    )}
                                >
                                    <Button
                                        variant="outline"
                                        className="gap-2 text-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-300/50 backdrop-blur-sm"
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Calendar View
                                    </Button>
                                </Link>
                                <Link
                                    href={route(
                                        "clinic.appointments.create-simplified",
                                        clinic.id
                                    )}
                                >
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm">
                                        <Plus className="h-4 w-4" />
                                        Create Appointment
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt--10 pb-12">
                    {/* Enhanced Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Calendar className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Total Appointments
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {totalAppointments}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-blue-600 font-medium">
                                                All appointments
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <CheckCircle className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Confirmed
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {confirmedAppointments}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                Ready to proceed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-yellow-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Clock className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Pending
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {pendingAppointments}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-yellow-600 font-medium">
                                                Awaiting approval
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-emerald-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Activity className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Completed
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {completedAppointments}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-emerald-600 font-medium">
                                                Successfully done
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <XCircle className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Cancelled
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {cancelledAppointments}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-red-600 font-medium">
                                                Cancelled appointments
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Search and Filter Controls */}
                    <Card className="shadow-xl rounded-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        <input
                                            type="text"
                                            placeholder="Search appointments by patient name, email, or phone..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Select
                                        value={status}
                                        onValueChange={setStatus}
                                    >
                                        <SelectTrigger className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500">
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Status
                                            </SelectItem>
                                            <SelectItem value="Pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="Confirmed">
                                                Confirmed
                                            </SelectItem>
                                            <SelectItem value="Completed">
                                                Completed
                                            </SelectItem>
                                            <SelectItem value="Cancelled">
                                                Cancelled
                                            </SelectItem>
                                            <SelectItem value="No Show">
                                                No Show
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={type}
                                        onValueChange={setType}
                                    >
                                        <SelectTrigger className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500">
                                            <SelectValue placeholder="All Types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Types
                                            </SelectItem>
                                            <SelectItem value="Walk-in">
                                                Walk-in
                                            </SelectItem>
                                            <SelectItem value="Phone Call">
                                                Phone Call
                                            </SelectItem>
                                            <SelectItem value="Online Booking">
                                                Online Booking
                                            </SelectItem>
                                            <SelectItem value="Follow-up">
                                                Follow-up
                                            </SelectItem>
                                            <SelectItem value="Emergency">
                                                Emergency
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        onClick={handleSearch}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filter
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appointments Table */}
                    <Card className="shadow-2xl rounded-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                            <CardTitle className="flex items-center gap-3 text-xl text-white">
                                <Calendar className="h-6 w-6 text-white" />
                                Appointments List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    Patient
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Type
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4" />
                                                    Status
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    Date & Time
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4" />
                                                    Dentist
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Service
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Settings className="h-4 w-4" />
                                                    Actions
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {appointments?.data?.map(
                                            (appointment) => {
                                                const isOnline =
                                                    appointment.type?.name?.toLowerCase?.() ===
                                                    "online booking";
                                                const statusName =
                                                    appointment.status?.name?.toLowerCase?.() ||
                                                    "";
                                                return (
                                                    <tr
                                                        key={appointment.id}
                                                        className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-indigo-50/40 hover:to-cyan-50/60 transition-all duration-300 border-b border-gray-100/50 hover:border-blue-200/50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-12 w-12">
                                                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                                                        <User className="h-6 w-6 text-white" />
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-base font-bold text-gray-900 leading-tight">
                                                                        {
                                                                            appointment
                                                                                .patient
                                                                                .first_name
                                                                        }{" "}
                                                                        {
                                                                            appointment
                                                                                .patient
                                                                                .last_name
                                                                        }
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        {
                                                                            appointment
                                                                                .patient
                                                                                .email
                                                                        }
                                                                    </div>
                                                                    {appointment
                                                                        .patient
                                                                        .phone_number && (
                                                                        <div className="text-sm text-blue-600 font-mono bg-blue-50 px-2 py-0.5 rounded text-xs mt-1 inline-block">
                                                                            {
                                                                                appointment
                                                                                    .patient
                                                                                    .phone_number
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge
                                                                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getTypeColor(
                                                                    appointment
                                                                        .type
                                                                        ?.name
                                                                )}`}
                                                            >
                                                                {
                                                                    appointment
                                                                        .type
                                                                        ?.name
                                                                }
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <Badge
                                                                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getStatusColor(
                                                                    appointment
                                                                        .status
                                                                        ?.name
                                                                )}`}
                                                            >
                                                                {
                                                                    appointment
                                                                        .status
                                                                        ?.name
                                                                }
                                                            </Badge>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <div className="flex items-center gap-1">
                                                                <CalendarClock className="h-4 w-4 text-gray-400" />
                                                                {format(
                                                                    new Date(
                                                                        appointment.scheduled_at
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </div>
                                                            <div className="text-sm font-medium text-gray-700">
                                                                {format(
                                                                    new Date(
                                                                        appointment.scheduled_at
                                                                    ),
                                                                    "h:mm a"
                                                                )}
                                                            </div>
                                                            {appointment.duration && (
                                                                <div className="text-xs text-gray-500">
                                                                    {
                                                                        appointment.duration
                                                                    }{" "}
                                                                    min
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {appointment.assigned_dentist ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                                        <Stethoscope className="h-4 w-4 text-green-600" />
                                                                    </div>
                                                                    <span className="font-medium">
                                                                        Dr.{" "}
                                                                        {
                                                                            appointment
                                                                                .assigned_dentist
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">
                                                                    Not assigned
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {appointment.service ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                                        <Package className="h-4 w-4 text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium">
                                                                            {
                                                                                appointment
                                                                                    .service
                                                                                    .name
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            ₱
                                                                            {appointment
                                                                                .service
                                                                                .price ||
                                                                                0}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">
                                                                    No service
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        (window.location.href =
                                                                            route(
                                                                                "clinic.appointments.show",
                                                                                [
                                                                                    clinic.id,
                                                                                    appointment.id,
                                                                                ]
                                                                            ))
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                                                    title="View Appointment Details"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        (window.location.href =
                                                                            route(
                                                                                "clinic.appointments.edit",
                                                                                [
                                                                                    clinic.id,
                                                                                    appointment.id,
                                                                                ]
                                                                            ))
                                                                    }
                                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                                                    title="Edit Appointment"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                {isOnline &&
                                                                    statusName ===
                                                                        "pending" && (
                                                                        <>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleApprove(
                                                                                        appointment
                                                                                    )
                                                                                }
                                                                                className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                                                                title="Approve Appointment"
                                                                            >
                                                                                <Check className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleDeny(
                                                                                        appointment
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                                                                title="Deny Appointment"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {(!appointments?.data ||
                                appointments.data.length === 0) && (
                                <Card className="shadow-2xl rounded-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                                    <CardContent className="p-16">
                                        <div className="text-center">
                                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Calendar className="h-12 w-12 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                {search ||
                                                status !== "all" ||
                                                type !== "all" ||
                                                date
                                                    ? "No appointments found"
                                                    : "No appointments yet"}
                                            </h3>
                                            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                                                {search ||
                                                status !== "all" ||
                                                type !== "all" ||
                                                date
                                                    ? "Try adjusting your search or filter criteria to find what you're looking for."
                                                    : "Get started by creating your first appointment to manage your clinic's schedule."}
                                            </p>
                                            <Link
                                                href={route(
                                                    "clinic.appointments.create-simplified",
                                                    clinic.id
                                                )}
                                            >
                                                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                                    <Plus className="h-5 w-5 mr-2" />
                                                    Create Appointment
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {appointments?.data?.length > 0 &&
                        appointments?.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing {appointments.from} to{" "}
                                    {appointments.to} of {appointments.total}{" "}
                                    results
                                </div>
                                <div className="flex items-center gap-2">
                                    {appointments?.links?.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : link.url
                                                    ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowApproveModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Approve Appointment
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign Dentist (optional)
                            </label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedDentist}
                                onChange={(e) =>
                                    setSelectedDentist(e.target.value)
                                }
                            >
                                <option value="">Unassigned</option>
                                {dentists.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {actionError && (
                            <div className="text-red-600 text-sm mb-2">
                                {actionError}
                            </div>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowApproveModal(false)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#22c55e",
                                    color: "white",
                                    border: "none",
                                }}
                                className="flex items-center gap-1 rounded-md px-3 py-1.5 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                                onClick={submitApprove}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    "Approving..."
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" /> Approve
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Deny Modal */}
            {showDenyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowDenyModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Deny Appointment
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Denial (optional)
                            </label>
                            <textarea
                                className="w-full border rounded px-3 py-2"
                                value={denyReason}
                                onChange={(e) => setDenyReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                        {actionError && (
                            <div className="text-red-600 text-sm mb-2">
                                {actionError}
                            </div>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDenyModal(false)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-1 rounded-md px-3 py-1.5"
                                onClick={submitDeny}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    "Denying..."
                                ) : (
                                    <>
                                        <X className="w-4 h-4" /> Deny
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
