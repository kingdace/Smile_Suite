import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    Calendar,
    Users,
    Package,
    Clock,
    Plus,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Stethoscope,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Star,
    Building2,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    Activity,
    UserCheck,
    CalendarDays,
    PackageCheck,
    FileText,
    BarChart3,
    Settings,
    Bell,
    Shield,
    Crown,
    Timer,
    Zap,
    Wallet,
    Heart,
    Smile,
    Award,
    Target,
    Sparkles,
    Eye,
    ChevronRight,
    Play,
    Pause,
    RotateCcw,
    MoreVertical,
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
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
} from "recharts";

export default function Dashboard({
    auth,
    clinic,
    stats,
    today_appointments,
    upcoming_appointments,
    recent_patients,
    lowStockItems,
    todayTreatments,
}) {
    // Sample data for charts
    const appointmentData = [
        { name: "Mon", appointments: 12, treatments: 8 },
        { name: "Tue", appointments: 19, treatments: 15 },
        { name: "Wed", appointments: 15, treatments: 12 },
        { name: "Thu", appointments: 23, treatments: 18 },
        { name: "Fri", appointments: 18, treatments: 14 },
        { name: "Sat", appointments: 8, treatments: 6 },
        { name: "Sun", appointments: 5, treatments: 3 },
    ];

    const treatmentData = [
        { name: "Consultation", value: 35, color: "#3B82F6" },
        { name: "Cleaning", value: 25, color: "#10B981" },
        { name: "Extraction", value: 20, color: "#F59E0B" },
        { name: "Root Canal", value: 15, color: "#EF4444" },
        { name: "Other", value: 5, color: "#8B5CF6" },
    ];

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    const getStatusColor = (statusId) => {
        const colors = {
            1: "bg-amber-50 text-amber-700 border-amber-200", // Pending
            2: "bg-emerald-50 text-emerald-700 border-emerald-200", // Confirmed
            3: "bg-blue-50 text-blue-700 border-blue-200", // Completed
            4: "bg-red-50 text-red-700 border-red-200", // Cancelled
            5: "bg-gray-50 text-gray-700 border-gray-200", // No Show
        };
        return colors[statusId] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    const getStatusText = (statusId) => {
        const statuses = {
            1: "Pending",
            2: "Confirmed",
            3: "Completed",
            4: "Cancelled",
            5: "No Show",
        };
        return statuses[statusId] || "Unknown";
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${clinic.name} - Dashboard`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Compact Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb--100 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                        <Building2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Welcome back, {auth?.user?.name}! 👋
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        {format(
                                            new Date(),
                                            "EEEE, MMMM d, yyyy"
                                        )}{" "}
                                        • {clinic.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="gap-2 bg-white/25 text-white border-white/40 hover:bg-white/35 backdrop-blur-sm text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Activity className="h-4 w-4" />
                                    Dashboard
                                </Button>
                                <Button
                                    size="sm"
                                    className="gap-2 bg-white text-blue-600 hover:bg-blue-50 text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Patient
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
                    {/* Enhanced Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Users className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Patients Today
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {today_appointments?.length || 0}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-600">
                                                +12% from yesterday
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Users className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Total Patients
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {stats?.total_patients || 0}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-600">
                                                +8% this month
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Stethoscope className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Today's Treatments
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {todayTreatments?.length || 0}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                            <span className="text-xs text-green-600">
                                                +15% from yesterday
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <FileText className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Pending Requests
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            0
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <TrendingDown className="h-3 w-3 text-red-500" />
                                            <span className="text-xs text-red-600">
                                                -5% from yesterday
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Statistics & Appointments */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Appointments Statistics */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                                                <BarChart3 className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">
                                                    Appointments Statistics
                                                </CardTitle>
                                                <p className="text-sm text-gray-600">
                                                    Weekly appointment trends
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-blue-50"
                                                >
                                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                                </Button>
                                                <span className="text-sm font-medium text-gray-700">
                                                    October 2024
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-blue-50"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white">
                                                <option>Week</option>
                                                <option>Month</option>
                                                <option>Year</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart data={appointmentData}>
                                                <defs>
                                                    <linearGradient
                                                        id="appointmentsGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <linearGradient
                                                        id="treatmentsGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#10B981"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#10B981"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#E5E7EB"
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    stroke="#6B7280"
                                                    fontSize={12}
                                                />
                                                <YAxis
                                                    stroke="#6B7280"
                                                    fontSize={12}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            "white",
                                                        border: "1px solid #E5E7EB",
                                                        borderRadius: "8px",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="appointments"
                                                    stroke="#3B82F6"
                                                    strokeWidth={3}
                                                    fill="url(#appointmentsGradient)"
                                                    name="Appointments"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="treatments"
                                                    stroke="#10B981"
                                                    strokeWidth={3}
                                                    fill="url(#treatmentsGradient)"
                                                    name="Treatments"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Upcoming Appointments */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
                                                <Calendar className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl">
                                                    Upcoming Appointments
                                                </CardTitle>
                                                <p className="text-sm text-gray-600">
                                                    Today's schedule and
                                                    upcoming visits
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        >
                                            <Link
                                                href={route(
                                                    "clinic.appointments.index",
                                                    { clinic: clinic.id }
                                                )}
                                            >
                                                View All{" "}
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Calendar Widget */}
                                        <div className="md:col-span-1">
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                                <div className="text-center mb-4">
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                        October 2024
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Today:{" "}
                                                        {format(
                                                            new Date(),
                                                            "EEEE, MMM d"
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-7 gap-1 text-xs">
                                                    {[
                                                        "S",
                                                        "M",
                                                        "T",
                                                        "W",
                                                        "T",
                                                        "F",
                                                        "S",
                                                    ].map((day) => (
                                                        <div
                                                            key={day}
                                                            className="text-center text-gray-500 py-2 font-semibold"
                                                        >
                                                            {day}
                                                        </div>
                                                    ))}
                                                    {Array.from(
                                                        { length: 31 },
                                                        (_, i) => i + 1
                                                    ).map((day) => (
                                                        <div
                                                            key={day}
                                                            className={`text-center py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-blue-100 ${
                                                                day === 25
                                                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                                    : day ===
                                                                          26 ||
                                                                      day === 27
                                                                    ? "bg-blue-100 text-blue-700 font-semibold"
                                                                    : "text-gray-700 hover:text-blue-700"
                                                            }`}
                                                        >
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 pt-3 border-t border-blue-200">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                                                        <span className="text-gray-600">
                                                            Today
                                                        </span>
                                                        <div className="w-3 h-3 bg-blue-100 rounded-full ml-3"></div>
                                                        <span className="text-gray-600">
                                                            Appointments
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Appointment List */}
                                        <div className="md:col-span-2">
                                            {today_appointments &&
                                            today_appointments.length > 0 ? (
                                                <div className="space-y-3">
                                                    {today_appointments
                                                        .slice(0, 4)
                                                        .map(
                                                            (
                                                                appointment,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        appointment.id
                                                                    }
                                                                    className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-md transform hover:-translate-y-1"
                                                                    style={{
                                                                        animationDelay: `${
                                                                            index *
                                                                            100
                                                                        }ms`,
                                                                    }}
                                                                >
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="relative">
                                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                                                                <span className="text-sm font-bold text-white">
                                                                                    {appointment.patient?.name?.charAt(
                                                                                        0
                                                                                    ) ||
                                                                                        "P"}
                                                                                </span>
                                                                            </div>
                                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-gray-900 text-sm">
                                                                                {appointment
                                                                                    .patient
                                                                                    ?.name ||
                                                                                    "Unknown Patient"}
                                                                            </p>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <Clock className="h-3 w-3 text-blue-500" />
                                                                                <p className="text-xs text-gray-600">
                                                                                    {format(
                                                                                        new Date(
                                                                                            `${appointment.appointment_date} ${appointment.appointment_time}`
                                                                                        ),
                                                                                        "h:mm a"
                                                                                    )}{" "}
                                                                                    •{" "}
                                                                                    {appointment
                                                                                        .appointment_type
                                                                                        ?.name ||
                                                                                        "General"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <Badge
                                                                            className={`${getStatusColor(
                                                                                appointment.status_id
                                                                            )} text-xs px-3 py-1 font-semibold shadow-sm`}
                                                                        >
                                                                            {getStatusText(
                                                                                appointment.status_id
                                                                            )}
                                                                        </Badge>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-gray-500 text-sm">
                                                        No appointments
                                                        scheduled
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Treatment Statistics */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                                            <PieChart className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl">
                                                Treatment Distribution
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Types of treatments performed
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="h-64">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={treatmentData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={100}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {treatmentData.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor:
                                                                "white",
                                                            border: "1px solid #E5E7EB",
                                                            borderRadius: "8px",
                                                            boxShadow:
                                                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900">
                                                Treatment Breakdown
                                            </h3>
                                            {treatmentData.map(
                                                (treatment, index) => (
                                                    <div
                                                        key={treatment.name}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-4 h-4 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ],
                                                                }}
                                                            ></div>
                                                            <span className="text-sm text-gray-700">
                                                                {treatment.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {
                                                                    treatment.value
                                                                }
                                                                %
                                                            </span>
                                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        width: `${treatment.value}%`,
                                                                        backgroundColor:
                                                                            COLORS[
                                                                                index %
                                                                                    COLORS.length
                                                                            ],
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Quick Actions & Latest Patients */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Zap className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">
                                                Quick Actions
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Common tasks and shortcuts
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        asChild
                                        className="w-full justify-start gap-3 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.patients.create",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <UserCheck className="h-4 w-4" />
                                            Add New Patient
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full justify-start gap-3 h-12"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.appointments.create",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <Calendar className="h-4 w-4" />
                                            Schedule Appointment
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full justify-start gap-3 h-12"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.treatments.create",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <Stethoscope className="h-4 w-4" />
                                            Record Treatment
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full justify-start gap-3 h-12"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.inventory.create",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <Package className="h-4 w-4" />
                                            Add Inventory
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Latest Patients */}
                            <Card className="border-0 shadow-sm bg-white">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">
                                            Latest Patients
                                        </CardTitle>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            size="sm"
                                            className="text-emerald-600 hover:text-emerald-700"
                                        >
                                            <Link
                                                href={route(
                                                    "clinic.patients.index",
                                                    { clinic: clinic.id }
                                                )}
                                            >
                                                View All{" "}
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {recent_patients &&
                                    recent_patients.length > 0 ? (
                                        <div className="space-y-3">
                                            {recent_patients
                                                .slice(0, 3)
                                                .map((patient, index) => (
                                                    <div
                                                        key={patient.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                                <span className="text-xs font-semibold text-emerald-600">
                                                                    {(
                                                                        patient.first_name ||
                                                                        "P"
                                                                    )
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">
                                                                    {
                                                                        patient.first_name
                                                                    }{" "}
                                                                    {
                                                                        patient.last_name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-600">
                                                                    {format(
                                                                        new Date(
                                                                            patient.created_at
                                                                        ),
                                                                        "MMM d, yyyy"
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                                                        >
                                                            Active
                                                        </Badge>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">
                                                No patients yet
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Low Stock Alert */}
                            {lowStockItems && lowStockItems.length > 0 && (
                                <Card className="border-0 shadow-sm bg-white border-l-4 border-l-orange-500">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-orange-900">
                                                    Low Stock Alert
                                                </CardTitle>
                                                <p className="text-sm text-orange-700">
                                                    Items that need attention
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {lowStockItems
                                                .slice(0, 3)
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="p-2 bg-orange-50 rounded border border-orange-200"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium text-orange-900 text-sm">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-xs text-orange-700">
                                                                    Stock:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }{" "}
                                                                    {item.unit}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="bg-orange-100 text-orange-700 border-orange-300 text-xs"
                                                            >
                                                                Low Stock
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-orange-200">
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="w-full gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
                                            >
                                                <Link
                                                    href={route(
                                                        "clinic.inventory.index",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    <Package className="h-4 w-4" />
                                                    Manage Inventory
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
