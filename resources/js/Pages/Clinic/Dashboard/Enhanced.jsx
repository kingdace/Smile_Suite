import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Calendar,
    Clock,
    Users,
    UserCheck,
    CalendarCheck,
    CalendarX,
    TrendingUp,
    DollarSign,
    Activity,
    Plus,
    Settings,
    BarChart3,
    FileText,
    Package,
    CreditCard,
    AlertCircle,
    CheckCircle,
    XCircle,
    ArrowRight,
    CalendarDays,
    UserPlus,
    Stethoscope,
} from "lucide-react";

export default function EnhancedDashboard({
    auth,
    clinic,
    stats,
    recentAppointments,
    upcomingAppointments,
    scheduleStats,
}) {
    const [activeTab, setActiveTab] = useState("overview");

    const quickActions = [
        {
            title: "New Appointment",
            description: "Create a new appointment",
            icon: CalendarCheck,
            href: route("clinic.appointments.create-simplified", {
                clinic: clinic.id,
            }),
            color: "bg-blue-500",
        },
        {
            title: "Manage Schedules",
            description: "Set dentist availability",
            icon: Calendar,
            href: route("clinic.dentist-schedules.index", {
                clinic: clinic.id,
            }),
            color: "bg-green-500",
        },
        {
            title: "Add Patient",
            description: "Register new patient",
            icon: UserPlus,
            href: route("clinic.patients.create", { clinic: clinic.id }),
            color: "bg-purple-500",
        },
        {
            title: "View Reports",
            description: "Analytics and insights",
            icon: BarChart3,
            href: route("clinic.reports.index", { clinic: clinic.id }),
            color: "bg-orange-500",
        },
    ];

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
            case "scheduled":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
            case "no-show":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
            case "completed":
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case "pending":
            case "scheduled":
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case "cancelled":
            case "no-show":
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Enhanced Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Enhanced Dashboard
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Welcome back, {auth.user.name}! Here's
                                    what's happening at {clinic.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={route("clinic.settings.index", {
                                            clinic: clinic.id,
                                        })}
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {quickActions.map((action, index) => (
                                <Card
                                    key={index}
                                    className="hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <Link href={action.href} className="block">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`p-3 rounded-lg ${action.color} text-white`}
                                                >
                                                    <action.icon className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {action.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {action.description}
                                                    </p>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </CardContent>
                                    </Link>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <Tabs className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger
                                active={activeTab === "overview"}
                                onClick={() => setActiveTab("overview")}
                            >
                                Overview
                            </TabsTrigger>
                            <TabsTrigger
                                active={activeTab === "appointments"}
                                onClick={() => setActiveTab("appointments")}
                            >
                                Appointments
                            </TabsTrigger>
                            <TabsTrigger
                                active={activeTab === "schedules"}
                                onClick={() => setActiveTab("schedules")}
                            >
                                Schedules
                            </TabsTrigger>
                            <TabsTrigger
                                active={activeTab === "analytics"}
                                onClick={() => setActiveTab("analytics")}
                            >
                                Analytics
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <TabsContent className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Total Patients
                                            </CardTitle>
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats?.total_patients || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                +
                                                {stats?.new_patients_this_month ||
                                                    0}{" "}
                                                this month
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Today's Appointments
                                            </CardTitle>
                                            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats?.today_appointments || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {stats?.completed_today || 0}{" "}
                                                completed
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Active Dentists
                                            </CardTitle>
                                            <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                {stats?.active_dentists || 0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {stats?.available_today || 0}{" "}
                                                available today
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Monthly Revenue
                                            </CardTitle>
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-2xl font-bold">
                                                $
                                                {stats?.monthly_revenue?.toLocaleString() ||
                                                    0}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                +{stats?.revenue_growth || 0}%
                                                from last month
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Recent Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Activity className="h-5 w-5" />
                                                Recent Appointments
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {recentAppointments
                                                    ?.slice(0, 5)
                                                    .map((appointment) => (
                                                        <div
                                                            key={appointment.id}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                <div>
                                                                    <p className="font-medium text-sm">
                                                                        {appointment
                                                                            .patient
                                                                            ?.name ||
                                                                            "Unknown Patient"}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {appointment
                                                                            .appointment_type
                                                                            ?.name ||
                                                                            "General Checkup"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    appointment
                                                                        .status
                                                                        ?.name
                                                                )}
                                                            >
                                                                {appointment
                                                                    .status
                                                                    ?.name ||
                                                                    "Unknown"}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                {(!recentAppointments ||
                                                    recentAppointments.length ===
                                                        0) && (
                                                    <p className="text-gray-500 text-center py-4">
                                                        No recent appointments
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CalendarDays className="h-5 w-5" />
                                                Upcoming Appointments
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {upcomingAppointments
                                                    ?.slice(0, 5)
                                                    .map((appointment) => (
                                                        <div
                                                            key={appointment.id}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <div>
                                                                    <p className="font-medium text-sm">
                                                                        {appointment
                                                                            .patient
                                                                            ?.name ||
                                                                            "Unknown Patient"}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {new Date(
                                                                            appointment.scheduled_at
                                                                        ).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    appointment
                                                                        .status
                                                                        ?.name
                                                                )}
                                                            >
                                                                {appointment
                                                                    .status
                                                                    ?.name ||
                                                                    "Unknown"}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                {(!upcomingAppointments ||
                                                    upcomingAppointments.length ===
                                                        0) && (
                                                    <p className="text-gray-500 text-center py-4">
                                                        No upcoming appointments
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        )}

                        {/* Appointments Tab */}
                        {activeTab === "appointments" && (
                            <TabsContent className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>Appointment Management</span>
                                            <Button asChild>
                                                <Link
                                                    href={route(
                                                        "clinic.appointments.create-simplified",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    New Appointment
                                                </Link>
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {stats?.confirmed_appointments ||
                                                        0}
                                                </div>
                                                <div className="text-sm text-green-600">
                                                    Confirmed
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                                <div className="text-2xl font-bold text-yellow-600">
                                                    {stats?.pending_appointments ||
                                                        0}
                                                </div>
                                                <div className="text-sm text-yellow-600">
                                                    Pending
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {stats?.cancelled_appointments ||
                                                        0}
                                                </div>
                                                <div className="text-sm text-red-600">
                                                    Cancelled
                                                </div>
                                            </div>
                                        </div>

                                        <Button asChild className="w-full">
                                            <Link
                                                href={route(
                                                    "clinic.appointments.index",
                                                    { clinic: clinic.id }
                                                )}
                                            >
                                                View All Appointments
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}

                        {/* Schedules Tab */}
                        {activeTab === "schedules" && (
                            <TabsContent className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>Schedule Management</span>
                                            <Button asChild>
                                                <Link
                                                    href={route(
                                                        "clinic.dentist-schedules.index",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Manage Schedules
                                                </Link>
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {scheduleStats && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="font-medium mb-3">
                                                        Dentist Availability
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {scheduleStats.dentist_availability?.map(
                                                            (dentist) => (
                                                                <div
                                                                    key={
                                                                        dentist.id
                                                                    }
                                                                    className="flex items-center justify-between"
                                                                >
                                                                    <span className="text-sm">
                                                                        {
                                                                            dentist.name
                                                                        }
                                                                    </span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                                                            <div
                                                                                className="bg-green-500 h-2 rounded-full"
                                                                                style={{
                                                                                    width: `${dentist.availability_percentage}%`,
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                dentist.availability_percentage
                                                                            }
                                                                            %
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-3">
                                                        Weekly Schedule Overview
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {scheduleStats.weekly_overview?.map(
                                                            (day) => (
                                                                <div
                                                                    key={
                                                                        day.day
                                                                    }
                                                                    className="flex items-center justify-between"
                                                                >
                                                                    <span className="text-sm">
                                                                        {
                                                                            day.name
                                                                        }
                                                                    </span>
                                                                    <Badge variant="outline">
                                                                        {
                                                                            day.available_dentists
                                                                        }{" "}
                                                                        available
                                                                    </Badge>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === "analytics" && (
                            <TabsContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Patient Growth
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-blue-600">
                                                    +
                                                    {stats?.patient_growth_rate ||
                                                        0}
                                                    %
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    This month
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Appointment Success Rate
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-600">
                                                    {stats?.appointment_success_rate ||
                                                        0}
                                                    %
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Completed vs Scheduled
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Reports</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="h-auto p-4 flex flex-col items-center"
                                            >
                                                <Link
                                                    href={route(
                                                        "clinic.reports.patients",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    <Users className="h-8 w-8 mb-2" />
                                                    <span>Patient Report</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="h-auto p-4 flex flex-col items-center"
                                            >
                                                <Link
                                                    href={route(
                                                        "clinic.reports.appointments",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    <Calendar className="h-8 w-8 mb-2" />
                                                    <span>
                                                        Appointment Report
                                                    </span>
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="h-auto p-4 flex flex-col items-center"
                                            >
                                                <Link
                                                    href={route(
                                                        "clinic.reports.revenue",
                                                        { clinic: clinic.id }
                                                    )}
                                                >
                                                    <DollarSign className="h-8 w-8 mb-2" />
                                                    <span>Revenue Report</span>
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
