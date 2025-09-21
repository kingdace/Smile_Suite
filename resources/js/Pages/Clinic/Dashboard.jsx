import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import TimeRangeSelector from "@/Components/Dashboard/TimeRangeSelector";
import KPIWidget from "@/Components/Dashboard/KPIWidget";
import InteractiveChart from "@/Components/Dashboard/InteractiveChart";
import DashboardCustomizer from "@/Components/Dashboard/DashboardCustomizer";

import {
    Calendar,
    Users,
    Package,
    Clock,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Stethoscope,
    AlertTriangle,
    Building2,
    Activity,
    UserCheck,
    Bell,
    Zap,
    ChevronRight,
    MoreVertical,
    CalendarClock,
    Star,
    Heart,
    Award,
    Eye,
    Sparkles,
    Target,
    CheckCircle,
    Plus,
    BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useState, useEffect } from "react";

export default function Dashboard({
    auth,
    clinic,
    stats,
    today_appointments,
    upcoming_appointments,
    recent_patients,
    lowStockItems,
    todayTreatments,
    patientCancelledAppointments,
    patientRescheduledAppointments,
    // New props from enhanced controller
    metrics,
    current_time_range,
    available_time_ranges,
    revenue_metrics,
    appointment_metrics,
    satisfaction_metrics,
    chart_data,
}) {
    // State for dashboard customization and real-time updates
    const [timeRange, setTimeRange] = useState(current_time_range || "week");
    const [loading, setLoading] = useState(false);
    const [dashboardWidgets, setDashboardWidgets] = useState([
        { id: "revenue", title: "Revenue Metrics", visible: true },
        { id: "appointments", title: "Appointment Efficiency", visible: true },
        { id: "satisfaction", title: "Patient Satisfaction", visible: true },
        { id: "charts", title: "Interactive Charts", visible: true },
    ]);

    // Use real data from backend or fallback to sample data
    const appointmentData = chart_data?.appointment_chart || [
        { name: "Mon", appointments: 12, treatments: 8 },
        { name: "Tue", appointments: 19, treatments: 15 },
        { name: "Wed", appointments: 15, treatments: 12 },
        { name: "Thu", appointments: 23, treatments: 18 },
        { name: "Fri", appointments: 18, treatments: 14 },
        { name: "Sat", appointments: 8, treatments: 6 },
        { name: "Sun", appointments: 5, treatments: 3 },
    ];

    const treatmentData = chart_data?.service_distribution || [
        { name: "Consultation", value: 35, color: "#3B82F6" },
        { name: "Cleaning", value: 25, color: "#10B981" },
        { name: "Extraction", value: 20, color: "#F59E0B" },
        { name: "Root Canal", value: 15, color: "#EF4444" },
        { name: "Other", value: 5, color: "#8B5CF6" },
    ];

    // Handle time range changes
    const handleTimeRangeChange = (newRange) => {
        setLoading(true);
        setTimeRange(newRange);
        router.visit(route("clinic.dashboard", { clinic: clinic.id }), {
            data: { range: newRange },
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    };

    // Handle dashboard layout changes
    const handleLayoutChange = (newWidgets) => {
        setDashboardWidgets(newWidgets);
        // Save to localStorage for now, can be enhanced to save to backend
        localStorage.setItem("dashboard_layout", JSON.stringify(newWidgets));
    };

    const handleResetLayout = () => {
        const defaultWidgets = [
            { id: "revenue", title: "Revenue Metrics", visible: true },
            {
                id: "appointments",
                title: "Appointment Efficiency",
                visible: true,
            },
            {
                id: "satisfaction",
                title: "Patient Satisfaction",
                visible: true,
            },
            { id: "charts", title: "Interactive Charts", visible: true },
        ];
        return defaultWidgets;
    };

    // Load saved layout on component mount
    useEffect(() => {
        const savedLayout = localStorage.getItem("dashboard_layout");
        if (savedLayout) {
            try {
                setDashboardWidgets(JSON.parse(savedLayout));
            } catch (error) {
                console.error("Error loading dashboard layout:", error);
            }
        }
    }, []);

    // Real-time updates setup (placeholder for Laravel Echo integration)
    useEffect(() => {
        // TODO: Set up Laravel Echo subscription for real-time updates
        // window.Echo?.private(`clinic.${clinic.id}`)
        //     .listen('AppointmentUpdated', (e) => {
        //         // Handle real-time appointment updates
        //     })
        //     .listen('PaymentCompleted', (e) => {
        //         // Handle real-time payment updates
        //     })
        //     .listen('ReviewCreated', (e) => {
        //         // Handle real-time review updates
        //     });
        // return () => {
        //     window.Echo?.leave(`clinic.${clinic.id}`);
        // };
    }, [clinic.id]);

    const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    const getStatusColor = (statusId) => {
        const colors = {
            1: "bg-amber-50 text-amber-700 border-amber-200", // Pending
            2: "bg-emerald-50 text-emerald-700 border-emerald-200", // Confirmed
            3: "bg-blue-50 text-blue-700 border-blue-200", // Completed
            4: "bg-red-50 text-red-700 border-red-200", // Cancelled
            5: "bg-gray-50 text-gray-700 border-gray-200", // No Show
            6: "bg-orange-50 text-orange-700 border-orange-200", // Pending Reschedule
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
            6: "Pending Reschedule",
        };
        return statuses[statusId] || "Unknown";
    };

    // Enhanced brand colors for vibrant theming - Blue, Indigo, Cyan, Teal theme
    const brandColors = {
        primary: "#3b82f6", // blue-500
        secondary: "#10b981", // emerald-500
        info: "#06b6d4", // cyan-500
        indigo: "#6366f1", // indigo-500
        teal: "#14b8a6", // teal-500
        warning: "#f59e0b", // amber-500
        danger: "#ef4444", // red-500
        success: "#22c55e", // green-500
        orange: "#f97316", // orange-500
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${clinic.name} - Dashboard`} />

            <div className="-mt-4 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                {/* Floating Header */}
                <div className="pt-4">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-lg shadow-2xl backdrop-blur-sm border border-white/20">
                            <div className="px-6 py-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                                                <Building2 className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-xl font-bold text-white drop-shadow-sm">
                                                    {clinic.name}
                                                </h1>
                                                <p className="text-sm text-blue-100 font-medium">
                                                    {format(
                                                        new Date(),
                                                        "EEEE, MMM d, yyyy"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <TimeRangeSelector
                                            value={timeRange}
                                            onChange={handleTimeRangeChange}
                                            availableRanges={
                                                available_time_ranges
                                            }
                                            loading={loading}
                                        />
                                        <DashboardCustomizer
                                            widgets={dashboardWidgets}
                                            onLayoutChange={handleLayoutChange}
                                            onResetLayout={handleResetLayout}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 -mt-1">
                    {/* Key Performance Indicators - TOP PRIORITY */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Today's Appointments */}
                        <Card className="border-t-1 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 mb-1">
                                            Today's Appointments
                                        </p>
                                        <p className="text-3xl font-bold text-blue-900">
                                            {today_appointments?.length || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                                            <span className="text-sm text-emerald-600 font-medium">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Patients */}
                        <Card className="border-t-1 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-emerald-700 mb-1">
                                            Total Patients
                                        </p>
                                        <p className="text-3xl font-bold text-emerald-900">
                                            {stats?.total_patients || 0}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                                            <span className="text-sm text-emerald-600 font-medium">
                                                Growing
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Revenue (if available) */}
                        <Card className="border-t-1 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-indigo-700 mb-1">
                                            Revenue ({timeRange})
                                        </p>
                                        <p className="text-3xl font-bold text-indigo-900">
                                            ₱
                                            {revenue_metrics?.current_revenue
                                                ? Number(
                                                      revenue_metrics.current_revenue
                                                  ).toLocaleString()
                                                : "0"}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            {revenue_metrics?.trend_direction ===
                                            "up" ? (
                                                <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                            )}
                                            <span
                                                className={`text-sm font-medium ${
                                                    revenue_metrics?.trend_direction ===
                                                    "up"
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {revenue_metrics?.trend_percentage
                                                    ? `${Math.abs(
                                                          revenue_metrics.trend_percentage
                                                      )}%`
                                                    : "0%"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Patient Satisfaction */}
                        <Card className="border-t-1 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-teal-700 mb-1">
                                            Satisfaction
                                        </p>
                                        <div className="flex items-baseline">
                                            <p className="text-3xl font-bold text-teal-900">
                                                {satisfaction_metrics?.average_rating
                                                    ? Number(
                                                          satisfaction_metrics.average_rating
                                                      ).toFixed(1)
                                                    : "0.0"}
                                            </p>
                                            <span className="text-lg text-teal-600 ml-1">
                                                /5
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-2">
                                            <Star className="h-4 w-4 text-teal-500 mr-1" />
                                            <span className="text-sm text-teal-600 font-medium">
                                                {satisfaction_metrics?.total_reviews ||
                                                    0}{" "}
                                                reviews
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Heart className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Priority Section: Appointment Schedule & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Appointment Schedule - Takes 2/3 width */}
                        <div className="lg:col-span-2">
                            {/* Enhanced Appointment Schedule */}
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-300 h-full">
                                <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                                <Calendar className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-white">
                                                    Appointment Schedule
                                                </CardTitle>
                                                <p className="text-blue-100 font-medium">
                                                    Today & Upcoming
                                                    appointments
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                            >
                                                <Link
                                                    href={route(
                                                        "clinic.appointments.calendar",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    <CalendarClock className="h-4 w-4 mr-2" />
                                                    Calendar View
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                                className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                            >
                                                <Link
                                                    href={route(
                                                        "clinic.appointments.index",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    View All
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {/* Today's Appointments Section - Taller */}
                                    <div className="mb-6 flex-1">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                            <h3 className="text-base font-semibold text-blue-900">
                                                Today -{" "}
                                                {format(
                                                    new Date(),
                                                    "MMM d, yyyy"
                                                )}
                                            </h3>
                                            <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                                                {today_appointments?.length ||
                                                    0}{" "}
                                                appointments
                                            </Badge>
                                        </div>

                                        {today_appointments &&
                                        today_appointments.length > 0 ? (
                                            <div className="space-y-2 min-h-[200px]">
                                                {today_appointments
                                                    .slice(0, 5)
                                                    .map(
                                                        (
                                                            appointment,
                                                            index
                                                        ) => (
                                                            <div
                                                                key={
                                                                    appointment.id
                                                                }
                                                                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                                                                        {(
                                                                            appointment
                                                                                .patient
                                                                                ?.first_name ||
                                                                            appointment
                                                                                .patient
                                                                                ?.name ||
                                                                            "P"
                                                                        )
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-medium text-blue-900 text-sm">
                                                                            {appointment
                                                                                .patient
                                                                                ?.first_name &&
                                                                            appointment
                                                                                .patient
                                                                                ?.last_name
                                                                                ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                                                                : appointment
                                                                                      .patient
                                                                                      ?.name ||
                                                                                  "Unknown Patient"}
                                                                        </p>
                                                                        <div className="flex items-center space-x-2 text-xs text-blue-600">
                                                                            <Clock className="h-3 w-3" />
                                                                            <span>
                                                                                {(() => {
                                                                                    try {
                                                                                        if (
                                                                                            appointment.scheduled_at
                                                                                        ) {
                                                                                            return format(
                                                                                                new Date(
                                                                                                    appointment.scheduled_at
                                                                                                ),
                                                                                                "h:mm a"
                                                                                            );
                                                                                        }
                                                                                        return "Time not set";
                                                                                    } catch {
                                                                                        return "Time not set";
                                                                                    }
                                                                                })()}
                                                                            </span>
                                                                            <span>
                                                                                •
                                                                            </span>
                                                                            <span>
                                                                                {appointment
                                                                                    .appointment_type
                                                                                    ?.name ||
                                                                                    "General"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Badge
                                                                    className={`${getStatusColor(
                                                                        appointment.appointment_status_id
                                                                    )} text-xs px-2 py-1 shadow-sm`}
                                                                >
                                                                    {getStatusText(
                                                                        appointment.appointment_status_id
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                        )
                                                    )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-200 min-h-[200px] flex flex-col justify-center">
                                                <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                                                <p className="text-blue-600 font-medium text-sm">
                                                    No appointments today
                                                </p>
                                                <p className="text-blue-500 text-xs mt-1">
                                                    Your schedule is clear!
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upcoming Appointments Section - Shorter */}
                                    {upcoming_appointments &&
                                        upcoming_appointments.length > 0 && (
                                            <div className="flex-shrink-0">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                                    <h3 className="text-sm font-medium text-emerald-900">
                                                        Upcoming Appointments
                                                    </h3>
                                                    <Badge className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1">
                                                        Next{" "}
                                                        {
                                                            upcoming_appointments.slice(
                                                                0,
                                                                3
                                                            ).length
                                                        }
                                                    </Badge>
                                                </div>

                                                <div className="space-y-1">
                                                    {upcoming_appointments
                                                        .slice(0, 3)
                                                        .map(
                                                            (
                                                                appointment,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        appointment.id
                                                                    }
                                                                    className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors duration-200 border border-emerald-200"
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                                                                            {(
                                                                                appointment
                                                                                    .patient
                                                                                    ?.first_name ||
                                                                                appointment
                                                                                    .patient
                                                                                    ?.name ||
                                                                                "P"
                                                                            )
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-emerald-900 text-sm">
                                                                                {appointment
                                                                                    .patient
                                                                                    ?.first_name &&
                                                                                appointment
                                                                                    .patient
                                                                                    ?.last_name
                                                                                    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                                                                    : appointment
                                                                                          .patient
                                                                                          ?.name ||
                                                                                      "Unknown Patient"}
                                                                            </p>
                                                                            <div className="flex items-center space-x-2 text-xs text-emerald-600">
                                                                                <CalendarClock className="h-3 w-3" />
                                                                                <span>
                                                                                    {(() => {
                                                                                        try {
                                                                                            if (
                                                                                                appointment.scheduled_at
                                                                                            ) {
                                                                                                return format(
                                                                                                    new Date(
                                                                                                        appointment.scheduled_at
                                                                                                    ),
                                                                                                    "MMM d, h:mm a"
                                                                                                );
                                                                                            }
                                                                                            return "Date not set";
                                                                                        } catch {
                                                                                            return "Date not set";
                                                                                        }
                                                                                    })()}
                                                                                </span>
                                                                                <span>
                                                                                    •
                                                                                </span>
                                                                                <span>
                                                                                    {appointment
                                                                                        .appointment_type
                                                                                        ?.name ||
                                                                                        "General"}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <Badge
                                                                        className={`${getStatusColor(
                                                                            appointment.appointment_status_id
                                                                        )} text-xs px-2 py-1 shadow-sm`}
                                                                    >
                                                                        {getStatusText(
                                                                            appointment.appointment_status_id
                                                                        )}
                                                                    </Badge>
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions - Takes 1/3 width */}
                        <div>
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-cyan-50 to-teal-50 hover:shadow-2xl transition-all duration-300 h-full">
                                <CardHeader className="pb-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                            <Zap className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-white">
                                                Quick Actions
                                            </CardTitle>
                                            <p className="text-cyan-100 font-medium">
                                                Common tasks & shortcuts
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <Button
                                        asChild
                                        className="w-full justify-start h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.patients.create",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <UserCheck className="h-6 w-6 mr-4" />
                                            <div className="text-left">
                                                <div className="font-bold text-base">
                                                    Add Patient
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    Register new patient
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        className="w-full justify-start h-16 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.appointments.create-simplified",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <Calendar className="h-6 w-6 mr-4" />
                                            <div className="text-left">
                                                <div className="font-bold text-base">
                                                    Book Appointment
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    Schedule new visit
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        className="w-full justify-start h-16 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.treatments.create",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <Stethoscope className="h-6 w-6 mr-4" />
                                            <div className="text-left">
                                                <div className="font-bold text-base">
                                                    Record Treatment
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    Log treatment details
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        className="w-full justify-start h-16 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.payments.create",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <DollarSign className="h-6 w-6 mr-4" />
                                            <div className="text-left">
                                                <div className="font-bold text-base">
                                                    Process Payment
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    Record transaction
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        className="w-full justify-start h-16 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.dentist-schedules.index",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            <Clock className="h-6 w-6 mr-4" />
                                            <div className="text-left">
                                                <div className="font-bold text-base">
                                                    Manage Schedules
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    Dentist availability
                                                </div>
                                            </div>
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Analytics Charts Section */}
                    {(chart_data || revenue_metrics || appointment_metrics) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Revenue Chart */}
                            {chart_data?.revenue_chart && (
                                <Card className="border-0 shadow-lg bg-white">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-slate-900">
                                                    Revenue Trends
                                                </CardTitle>
                                                <p className="text-sm text-slate-500">
                                                    Revenue over time (
                                                    {timeRange})
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <AreaChart
                                                    data={
                                                        chart_data.revenue_chart
                                                    }
                                                >
                                                    <defs>
                                                        <linearGradient
                                                            id="revenueGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="5%"
                                                                stopColor={
                                                                    brandColors.secondary
                                                                }
                                                                stopOpacity={
                                                                    0.3
                                                                }
                                                            />
                                                            <stop
                                                                offset="95%"
                                                                stopColor={
                                                                    brandColors.secondary
                                                                }
                                                                stopOpacity={0}
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="#e2e8f0"
                                                    />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#64748b"
                                                        fontSize={12}
                                                    />
                                                    <YAxis
                                                        stroke="#64748b"
                                                        fontSize={12}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor:
                                                                "white",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "8px",
                                                            boxShadow:
                                                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="revenue"
                                                        stroke={
                                                            brandColors.secondary
                                                        }
                                                        strokeWidth={2}
                                                        fill="url(#revenueGradient)"
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Appointments Chart */}
                            {chart_data?.appointment_chart && (
                                <Card className="border-0 shadow-lg bg-white">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-slate-900">
                                                    Appointment Volume
                                                </CardTitle>
                                                <p className="text-sm text-slate-500">
                                                    Appointments over time (
                                                    {timeRange})
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-64">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={
                                                        chart_data.appointment_chart
                                                    }
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="#e2e8f0"
                                                    />
                                                    <XAxis
                                                        dataKey="date"
                                                        stroke="#64748b"
                                                        fontSize={12}
                                                    />
                                                    <YAxis
                                                        stroke="#64748b"
                                                        fontSize={12}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor:
                                                                "white",
                                                            border: "1px solid #e2e8f0",
                                                            borderRadius: "8px",
                                                            boxShadow:
                                                                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="count"
                                                        fill={
                                                            brandColors.primary
                                                        }
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Secondary Content Grid - Recent Patients & Alerts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Recent Patients */}
                        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-emerald-50 to-green-50 hover:shadow-2xl transition-all duration-300">
                            <CardHeader className="pb-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-semibold text-white">
                                                Recent Patients
                                            </CardTitle>
                                            <p className="text-emerald-100 font-normal">
                                                Latest registrations
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                    >
                                        <Link
                                            href={route(
                                                "clinic.patients.index",
                                                { clinic: clinic.id }
                                            )}
                                        >
                                            View All
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {recent_patients &&
                                recent_patients.length > 0 ? (
                                    <div className="space-y-4">
                                        {recent_patients
                                            .slice(0, 4)
                                            .map((patient) => (
                                                <div
                                                    key={patient.id}
                                                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl hover:from-emerald-100 hover:to-green-100 transition-all duration-300 border border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                                >
                                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                        {(
                                                            patient.first_name ||
                                                            "P"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-emerald-900 text-sm truncate">
                                                            {patient.first_name}{" "}
                                                            {patient.last_name}
                                                        </p>
                                                        <p className="text-xs text-emerald-600 font-normal">
                                                            {(() => {
                                                                try {
                                                                    return patient.created_at
                                                                        ? format(
                                                                              new Date(
                                                                                  patient.created_at
                                                                              ),
                                                                              "MMM d, yyyy"
                                                                          )
                                                                        : "Recently";
                                                                } catch {
                                                                    return "Recently";
                                                                }
                                                            })()}
                                                        </p>
                                                    </div>
                                                    <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-300 font-medium shadow-sm px-2 py-1">
                                                        New
                                                    </Badge>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border-2 border-dashed border-emerald-300">
                                        <Users className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                                        <p className="text-emerald-700 font-medium text-base">
                                            No recent patients
                                        </p>
                                        <p className="text-emerald-600 text-sm mt-2">
                                            New registrations will appear here
                                        </p>
                                        <Button
                                            asChild
                                            className="mt-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg"
                                        >
                                            <Link
                                                href={route(
                                                    "clinic.patients.create",
                                                    { clinic: clinic.id }
                                                )}
                                            >
                                                <UserCheck className="h-4 w-4 mr-2" />
                                                Add First Patient
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Alerts & Notifications */}
                        {lowStockItems?.length > 0 ||
                        patientCancelledAppointments?.length > 0 ? (
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-amber-50 to-orange-50 hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="pb-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                            <Bell className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-semibold text-white">
                                                Alerts & Notifications
                                            </CardTitle>
                                            <p className="text-amber-100 font-normal">
                                                Items requiring attention
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    {/* Low Stock Items */}
                                    {lowStockItems?.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 hover:border-amber-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                                    <AlertTriangle className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-amber-900 text-sm">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-amber-700 font-normal">
                                                        Stock: {item.quantity}{" "}
                                                        {item.unit}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-amber-100 text-amber-700 border-amber-300 text-xs font-medium shadow-sm px-2 py-1">
                                                Low Stock
                                            </Badge>
                                        </div>
                                    ))}

                                    {/* Patient Changes */}
                                    {patientCancelledAppointments
                                        ?.slice(0, 2)
                                        .map((appointment) => (
                                            <div
                                                key={`cancelled-${appointment.id}`}
                                                className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                                                        <CalendarClock className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-red-900 text-sm">
                                                            {
                                                                appointment
                                                                    .patient
                                                                    ?.first_name
                                                            }{" "}
                                                            {
                                                                appointment
                                                                    .patient
                                                                    ?.last_name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-red-700 font-normal">
                                                            Cancelled
                                                            appointment
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-red-100 text-red-700 border-red-300 text-xs font-medium shadow-sm px-2 py-1">
                                                    Cancelled
                                                </Badge>
                                            </div>
                                        ))}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300">
                                <CardHeader className="pb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                            <CheckCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-white">
                                                All Clear!
                                            </CardTitle>
                                            <p className="text-green-100 font-medium">
                                                No alerts at this time
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="text-center py-12 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-dashed border-green-300">
                                        <Sparkles className="h-16 w-16 text-green-400 mx-auto mb-4" />
                                        <p className="text-green-700 font-bold text-lg">
                                            Everything looks great!
                                        </p>
                                        <p className="text-green-600 text-sm mt-2">
                                            No urgent items need your attention
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Service Distribution Chart */}
                    {chart_data?.service_distribution &&
                        chart_data.service_distribution.length > 0 && (
                            <div className="mb-8">
                                <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-indigo-50 to-blue-50 hover:shadow-2xl transition-all duration-300">
                                    <CardHeader className="pb-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                                <Activity className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-semibold text-white">
                                                    Service Distribution
                                                </CardTitle>
                                                <p className="text-indigo-100 font-normal">
                                                    Popular services (
                                                    {timeRange})
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="h-64">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={
                                                                chart_data.service_distribution
                                                            }
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={50}
                                                            outerRadius={100}
                                                            paddingAngle={3}
                                                            dataKey="value"
                                                        >
                                                            {chart_data.service_distribution.map(
                                                                (
                                                                    entry,
                                                                    index
                                                                ) => {
                                                                    const colors =
                                                                        [
                                                                            brandColors.primary,
                                                                            brandColors.secondary,
                                                                            brandColors.info,
                                                                            brandColors.teal,
                                                                            brandColors.indigo,
                                                                        ];
                                                                    return (
                                                                        <Cell
                                                                            key={`cell-${index}`}
                                                                            fill={
                                                                                colors[
                                                                                    index %
                                                                                        colors.length
                                                                                ]
                                                                            }
                                                                        />
                                                                    );
                                                                }
                                                            )}
                                                        </Pie>
                                                        <Tooltip
                                                            contentStyle={{
                                                                backgroundColor:
                                                                    "white",
                                                                border: "1px solid #e2e8f0",
                                                                borderRadius:
                                                                    "12px",
                                                                boxShadow:
                                                                    "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                                                                fontSize:
                                                                    "14px",
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="space-y-4">
                                                {chart_data.service_distribution
                                                    .slice(0, 5)
                                                    .map((service, index) => {
                                                        const colors = [
                                                            brandColors.primary,
                                                            brandColors.secondary,
                                                            brandColors.info,
                                                            brandColors.teal,
                                                            brandColors.indigo,
                                                        ];
                                                        return (
                                                            <div
                                                                key={
                                                                    service.name
                                                                }
                                                                className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
                                                            >
                                                                <div className="flex items-center space-x-4">
                                                                    <div
                                                                        className="w-6 h-6 rounded-full shadow-lg border-2 border-white"
                                                                        style={{
                                                                            backgroundColor:
                                                                                colors[
                                                                                    index %
                                                                                        colors.length
                                                                                ],
                                                                        }}
                                                                    />
                                                                    <span className="text-sm text-indigo-900 font-medium">
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs font-medium shadow-sm px-2 py-1">
                                                                    {
                                                                        service.value
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
