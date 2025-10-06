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
import EnhancedDashboardLayout from "@/Components/Dashboard/EnhancedDashboardLayout";
import EnhancedKPICard from "@/Components/Dashboard/EnhancedKPICard";
import AdvancedChart from "@/Components/Dashboard/AdvancedChart";
import SmartWidget from "@/Components/Dashboard/SmartWidget";

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
    staff_performance_metrics,
    chart_data,
    patient_demographics,
    treatment_success,
    peak_hours,
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

    // Enhanced brand colors for vibrant theming - Blue, Teal, Green theme
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
            <Head title={`${clinic.name} - Enhanced Dashboard`} />

            <EnhancedDashboardLayout
                clinic={clinic}
                stats={stats}
                todayAppointments={today_appointments}
                upcomingAppointments={upcoming_appointments}
                recentPatients={recent_patients}
                lowStockItems={lowStockItems}
                revenueMetrics={revenue_metrics}
                appointmentMetrics={appointment_metrics}
                satisfactionMetrics={satisfaction_metrics}
                staffPerformanceMetrics={staff_performance_metrics}
                chartData={chart_data}
                patientDemographics={patient_demographics}
                treatmentSuccess={treatment_success}
                peakHours={peak_hours}
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
                loading={loading}
            />
        </AuthenticatedLayout>
    );
}
