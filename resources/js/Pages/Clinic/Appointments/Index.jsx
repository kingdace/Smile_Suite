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
    Download,
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
    const [showRescheduleApproveModal, setShowRescheduleApproveModal] =
        useState(false);
    const [showRescheduleDenyModal, setShowRescheduleDenyModal] =
        useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState("");
    const [denyReason, setDenyReason] = useState("");
    const [rescheduleDenyReason, setRescheduleDenyReason] = useState("");
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

    // Calculate Online Booking specific statistics
    const onlineBookings =
        appointments?.data?.filter((apt) => apt.type?.name === "Online Booking")
            ?.length || 0;
    const pendingOnlineBookings =
        appointments?.data?.filter(
            (apt) =>
                apt.type?.name === "Online Booking" &&
                apt.status?.name === "Pending"
        )?.length || 0;
    const patientCancelledOnline =
        appointments?.data?.filter(
            (apt) =>
                apt.type?.name === "Online Booking" &&
                apt.status?.name === "Cancelled" &&
                apt.cancelled_at &&
                apt.cancellation_reason
        )?.length || 0;

    // Helper function to get status color
    const getStatusColor = (statusName) => {
        const colors = {
            Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
            "Pending Reschedule":
                "bg-orange-100 text-orange-700 border-orange-300",
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

    const handleApproveReschedule = (appointment) => {
        setSelectedAppointment(appointment);
        setShowRescheduleApproveModal(true);
        setActionError("");
    };

    const handleDenyReschedule = (appointment) => {
        setSelectedAppointment(appointment);
        setShowRescheduleDenyModal(true);
        setRescheduleDenyReason("");
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

    const submitRescheduleApprove = async () => {
        setActionLoading(true);
        setActionError("");
        try {
            const response = await axios.post(
                route("clinic.appointments.approve-reschedule", {
                    clinic: clinic.id,
                    appointment: selectedAppointment.id,
                })
            );

            if (response.data.success) {
                setShowRescheduleApproveModal(false);
                window.location.reload();
            } else {
                setActionError(
                    response.data.message || "Failed to approve reschedule"
                );
            }
        } catch (err) {
            setActionError("Failed to approve reschedule.");
        } finally {
            setActionLoading(false);
        }
    };

    const submitRescheduleDeny = async () => {
        setActionLoading(true);
        setActionError("");
        try {
            const response = await axios.post(
                route("clinic.appointments.deny-reschedule", {
                    clinic: clinic.id,
                    appointment: selectedAppointment.id,
                }),
                {
                    denial_reason: rescheduleDenyReason,
                }
            );

            if (response.data.success) {
                setShowRescheduleDenyModal(false);
                window.location.reload();
            } else {
                setActionError(
                    response.data.message || "Failed to deny reschedule"
                );
            }
        } catch (err) {
            setActionError("Failed to deny reschedule.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleExportAllAppointments = () => {
        // Create export URL for all appointments
        const exportUrl = route("clinic.appointments.export", {
            clinic: clinic.id,
            format: "excel",
        });

        // Open the export URL in a new window to trigger download
        window.open(exportUrl, "_blank");
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
                                <Button
                                    onClick={handleExportAllAppointments}
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <Download className="h-4 w-4" />
                                    Export All
                                </Button>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Total Appointments
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
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
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <CheckCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Confirmed
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
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
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Clock className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Pending
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
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
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Activity className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Completed
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
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
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <XCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Cancelled
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
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

                        {/* Online Booking Statistics Card */}
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-cyan-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-4 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <CalendarClock className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600 font-medium mb-1">
                                            Online Bookings
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">
                                            {onlineBookings}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-cyan-600 font-medium">
                                                {pendingOnlineBookings} pending
                                                approval
                                            </span>
                                        </div>
                                        {patientCancelledOnline > 0 && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                                <span className="text-xs text-orange-600 font-medium">
                                                    {patientCancelledOnline}{" "}
                                                    patient cancelled
                                                </span>
                                            </div>
                                        )}
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
                                                        className="transition-all duration-300 border-b border-gray-100/50 hover:border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-indigo-50/40 hover:to-cyan-50/60"
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
                                                                        {appointment
                                                                            .patient
                                                                            ?.first_name ||
                                                                            "Unknown"}{" "}
                                                                        {appointment
                                                                            .patient
                                                                            ?.last_name ||
                                                                            ""}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        {appointment
                                                                            .patient
                                                                            ?.email ||
                                                                            "No email"}
                                                                    </div>
                                                                    {appointment
                                                                        .patient
                                                                        ?.phone_number && (
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
                                                            <div className="flex items-center gap-2">
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
                                                                {isOnline &&
                                                                    appointment.cancelled_at &&
                                                                    appointment.cancellation_reason && (
                                                                        <Badge
                                                                            className="text-xs font-semibold px-2 py-1 rounded-full border bg-orange-100 text-orange-700 border-orange-300"
                                                                            title="Cancelled by patient"
                                                                        >
                                                                            Patient
                                                                            Cancelled
                                                                        </Badge>
                                                                    )}
                                                            </div>
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
                                                                        {appointment
                                                                            .assigned_dentist
                                                                            ?.name ||
                                                                            "Unknown"}
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
                                                                {appointment
                                                                    .status
                                                                    ?.name ===
                                                                    "Pending Reschedule" && (
                                                                    <>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleApproveReschedule(
                                                                                    appointment
                                                                                )
                                                                            }
                                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                                                            title="Approve Reschedule"
                                                                        >
                                                                            <Check className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                handleDenyReschedule(
                                                                                    appointment
                                                                                )
                                                                            }
                                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-105"
                                                                            title="Deny Reschedule"
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
            {showApproveModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowApproveModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-green-600 mb-2">
                                Approve Appointment Request
                            </h2>
                            <p className="text-gray-600">
                                Review and confirm this online booking request
                            </p>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Appointment Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Patient:
                                    </span>
                                    <span className="font-medium">
                                        {
                                            selectedAppointment.patient
                                                ?.first_name
                                        }{" "}
                                        {selectedAppointment.patient?.last_name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Date & Time:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Reason:
                                    </span>
                                    <span className="font-medium">
                                        {selectedAppointment.reason}
                                    </span>
                                </div>
                                {selectedAppointment.service && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Service:
                                        </span>
                                        <span className="font-medium">
                                            {selectedAppointment.service.name}
                                        </span>
                                    </div>
                                )}
                                {selectedAppointment.notes && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Notes:
                                        </span>
                                        <span className="font-medium">
                                            {selectedAppointment.notes}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Requested:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            selectedAppointment.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assign Dentist (optional)
                            </label>
                            <select
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                value={selectedDentist}
                                onChange={(e) =>
                                    setSelectedDentist(e.target.value)
                                }
                            >
                                <option value="">
                                    Unassigned - Will be assigned later
                                </option>
                                {dentists.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                The patient will be notified of the assigned
                                dentist via email
                            </p>
                        </div>

                        {actionError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {actionError}
                            </div>
                        )}

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <h4 className="font-medium text-green-900 mb-2">
                                What happens next?
                            </h4>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>
                                    • Patient will receive a confirmation email
                                </li>
                                <li>
                                    • Appointment will be marked as "Confirmed"
                                </li>
                                <li>
                                    • Patient can view details in their portal
                                </li>
                                <li>
                                    • Appointment will appear in your calendar
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3">
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
                                className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                                onClick={submitApprove}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" /> Approve
                                        Appointment
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Deny Modal */}
            {showDenyModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowDenyModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">
                                Deny Appointment Request
                            </h2>
                            <p className="text-gray-600">
                                Please provide a reason for denying this
                                appointment request
                            </p>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Appointment Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Patient:
                                    </span>
                                    <span className="font-medium">
                                        {
                                            selectedAppointment.patient
                                                ?.first_name
                                        }{" "}
                                        {selectedAppointment.patient?.last_name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Date & Time:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Reason:
                                    </span>
                                    <span className="font-medium">
                                        {selectedAppointment.reason}
                                    </span>
                                </div>
                                {selectedAppointment.service && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Service:
                                        </span>
                                        <span className="font-medium">
                                            {selectedAppointment.service.name}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Requested:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            selectedAppointment.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Denial
                            </label>
                            <textarea
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                value={denyReason}
                                onChange={(e) => setDenyReason(e.target.value)}
                                rows={4}
                                placeholder="Please provide a reason for denying this appointment request. This will be included in the email sent to the patient."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This reason will be sent to the patient via
                                email
                            </p>
                        </div>

                        {/* Common Reasons */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Common Reasons (click to select)
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    "No available slots at requested time",
                                    "Requested service not available",
                                    "Dentist not available",
                                    "Clinic fully booked",
                                    "Patient needs to reschedule",
                                    "Insufficient information provided",
                                ].map((reason) => (
                                    <button
                                        key={reason}
                                        type="button"
                                        className="text-left p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                                        onClick={() => setDenyReason(reason)}
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {actionError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {actionError}
                            </div>
                        )}

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <h4 className="font-medium text-red-900 mb-2">
                                What happens next?
                            </h4>
                            <ul className="text-sm text-red-800 space-y-1">
                                <li>
                                    • Patient will receive a denial email with
                                    your reason
                                </li>
                                <li>
                                    • Appointment will be marked as "Cancelled"
                                </li>
                                <li>
                                    • Patient can submit a new request for a
                                    different time
                                </li>
                                <li>
                                    • You can contact the patient directly if
                                    needed
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDenyModal(false)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2 rounded-lg px-4 py-2"
                                onClick={submitDeny}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Denying...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" /> Deny
                                        Appointment
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Approve Modal */}
            {showRescheduleApproveModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowRescheduleApproveModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-green-600 mb-2">
                                Approve Reschedule Request
                            </h2>
                            <p className="text-gray-600">
                                Review and approve this reschedule request
                            </p>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Reschedule Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Patient:
                                    </span>
                                    <span className="font-medium">
                                        {
                                            selectedAppointment.patient
                                                ?.first_name
                                        }{" "}
                                        {selectedAppointment.patient?.last_name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Current Time:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Requested Time:
                                    </span>
                                    <span className="font-medium text-green-600">
                                        {selectedAppointment.requested_scheduled_at
                                            ? new Date(
                                                  selectedAppointment.requested_scheduled_at
                                              ).toLocaleDateString() +
                                              " at " +
                                              new Date(
                                                  selectedAppointment.requested_scheduled_at
                                              ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : selectedAppointment.notes &&
                                              selectedAppointment.notes.includes(
                                                  "Requested new time:"
                                              )
                                            ? (() => {
                                                  const match =
                                                      selectedAppointment.notes.match(
                                                          /Requested new time: (.+)/
                                                      );
                                                  return match
                                                      ? match[1]
                                                      : "Not specified";
                                              })()
                                            : "Not specified"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Reason:
                                    </span>
                                    <span className="font-medium">
                                        {(() => {
                                            if (!selectedAppointment.notes)
                                                return "No reason provided";

                                            // Look for "Reason: " pattern (from patient reschedule)
                                            const reasonMatch =
                                                selectedAppointment.notes.match(
                                                    /Reason: (.+?)(?:\n|$)/
                                                );
                                            if (reasonMatch) {
                                                return reasonMatch[1].trim();
                                            }

                                            // Fallback to last line if no specific pattern found
                                            const lines =
                                                selectedAppointment.notes.split(
                                                    "\n"
                                                );
                                            const lastLine =
                                                lines[lines.length - 1]?.trim();

                                            // Skip lines that are just timestamps or "Requested new time"
                                            if (
                                                lastLine &&
                                                !lastLine.includes(
                                                    "Requested new time:"
                                                ) &&
                                                !lastLine.match(
                                                    /^\d{4}-\d{2}-\d{2}/
                                                ) &&
                                                !lastLine.includes(
                                                    "Rescheduled by patient"
                                                )
                                            ) {
                                                return lastLine;
                                            }

                                            return "No reason provided";
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {actionError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {actionError}
                            </div>
                        )}

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <h4 className="font-medium text-green-900 mb-2">
                                What happens next?
                            </h4>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>
                                    • Appointment will be rescheduled to the
                                    requested time
                                </li>
                                <li>
                                    • Patient will receive a confirmation email
                                </li>
                                <li>
                                    • Appointment status will change to
                                    "Confirmed"
                                </li>
                                <li>• Original time slot will be freed up</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setShowRescheduleApproveModal(false)
                                }
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
                                className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                                onClick={submitRescheduleApprove}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" /> Approve
                                        Reschedule
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Deny Modal */}
            {showRescheduleDenyModal && selectedAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowRescheduleDenyModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">
                                Deny Reschedule Request
                            </h2>
                            <p className="text-gray-600">
                                Please provide a reason for denying this
                                reschedule request
                            </p>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">
                                Reschedule Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Patient:
                                    </span>
                                    <span className="font-medium">
                                        {
                                            selectedAppointment.patient
                                                ?.first_name
                                        }{" "}
                                        {selectedAppointment.patient?.last_name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Current Time:
                                    </span>
                                    <span className="font-medium">
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleDateString()}{" "}
                                        at{" "}
                                        {new Date(
                                            selectedAppointment.scheduled_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Requested Time:
                                    </span>
                                    <span className="font-medium text-orange-600">
                                        {selectedAppointment.requested_scheduled_at
                                            ? new Date(
                                                  selectedAppointment.requested_scheduled_at
                                              ).toLocaleDateString() +
                                              " at " +
                                              new Date(
                                                  selectedAppointment.requested_scheduled_at
                                              ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : selectedAppointment.notes &&
                                              selectedAppointment.notes.includes(
                                                  "Requested new time:"
                                              )
                                            ? (() => {
                                                  const match =
                                                      selectedAppointment.notes.match(
                                                          /Requested new time: (.+)/
                                                      );
                                                  return match
                                                      ? match[1]
                                                      : "Not specified";
                                              })()
                                            : "Not specified"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Denial
                            </label>
                            <textarea
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                value={rescheduleDenyReason}
                                onChange={(e) =>
                                    setRescheduleDenyReason(e.target.value)
                                }
                                rows={4}
                                placeholder="Please provide a reason for denying this reschedule request. This will be included in the email sent to the patient."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This reason will be sent to the patient via
                                email
                            </p>
                        </div>

                        {/* Common Reasons */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Common Reasons (click to select)
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    "No available slots at requested time",
                                    "Dentist not available at requested time",
                                    "Clinic fully booked at requested time",
                                    "Requested time conflicts with existing appointments",
                                    "Insufficient notice for reschedule",
                                    "Patient needs to contact clinic directly",
                                ].map((reason) => (
                                    <button
                                        key={reason}
                                        type="button"
                                        className="text-left p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border"
                                        onClick={() =>
                                            setRescheduleDenyReason(reason)
                                        }
                                    >
                                        {reason}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {actionError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                                {actionError}
                            </div>
                        )}

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <h4 className="font-medium text-red-900 mb-2">
                                What happens next?
                            </h4>
                            <ul className="text-sm text-red-800 space-y-1">
                                <li>
                                    • Patient will receive a denial email with
                                    your reason
                                </li>
                                <li>
                                    • Appointment will remain at its original
                                    time
                                </li>
                                <li>
                                    • Patient can contact you directly to
                                    discuss alternatives
                                </li>
                                <li>• Reschedule request will be cleared</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setShowRescheduleDenyModal(false)
                                }
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2 rounded-lg px-4 py-2"
                                onClick={submitRescheduleDeny}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Denying...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4" /> Deny
                                        Reschedule
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
