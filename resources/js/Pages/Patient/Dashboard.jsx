import { Head, usePage, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Calendar,
    User,
    FileText,
    LayoutDashboard,
    Bell,
    Settings,
    Heart,
    Stethoscope,
    DollarSign,
    Plus,
    Search,
    Building2,
    CreditCard,
    Eye,
    MoreVertical,
    ChevronRight,
    BookOpen,
    Shield,
    Sparkles,
    Activity,
    Zap,
    MessageCircle,
    LogOut,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";
import SiteHeader from "@/Components/SiteHeader";

// Appointments Section Component
const AppointmentsSection = ({ appointments = [] }) => {
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case "confirmed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "completed":
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            My Appointments
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Your latest dental appointments
                        </p>
                    </div>
                </div>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
            </div>
            <div>
                {appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4 hover:shadow-md transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusIcon(
                                                appointment.status?.name
                                            )}
                                            <Badge
                                                className={getStatusColor(
                                                    appointment.status?.name
                                                )}
                                            >
                                                {appointment.status?.name ||
                                                    "Unknown"}
                                            </Badge>
                                        </div>
                                        <h4 className="font-semibold text-gray-900">
                                            {appointment.clinic?.name ||
                                                "Clinic"}
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {new Date(
                                                appointment.scheduled_at
                                            ).toLocaleDateString()}{" "}
                                            at{" "}
                                            {new Date(
                                                appointment.scheduled_at
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {appointment.reason ||
                                                "No reason specified"}
                                        </p>
                                        {appointment.notes && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Notes: {appointment.notes}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {appointment.status?.name?.toLowerCase() ===
                                            "pending" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                            No Appointments Yet
                        </h4>
                        <p className="text-gray-600 text-sm mb-4">
                            Book your first appointment today to get started!
                        </p>
                        <Link href="/clinics">
                            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                                <Plus className="w-4 h-4" />
                                Find Clinics
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

// Quick Actions Component
const QuickActions = () => {
    const actions = [
        {
            name: "Book Appointment",
            description: "Schedule a new appointment",
            icon: Calendar,
            href: "/clinics",
            color: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
        },
        {
            name: "My Profile",
            description: "Manage your information",
            icon: User,
            href: route("patient.profile"),
            color: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
        },
        {
            name: "My Treatments",
            description: "View treatment history",
            icon: Stethoscope,
            href: route("patient.treatments.index"),
            color: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
        },
        {
            name: "Find Clinics",
            description: "Discover nearby clinics",
            icon: Building2,
            href: "/clinics",
            color: "bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
        },
    ];

    return (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Quick Actions
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                    Access your most important features
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link key={action.name} href={action.href}>
                            <div className="flex items-center gap-3 px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-blue-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-blue-200/50">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm">
                                        {action.name}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {action.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

// Statistics Component
const StatisticsSection = ({ clinicRecords = [] }) => {
    const totalClinics = clinicRecords.length;
    const totalAppointments = clinicRecords.reduce(
        (sum, record) => sum + (record.appointments_count || 0),
        0
    );
    const upcomingAppointments = clinicRecords.reduce(
        (sum, record) => sum + (record.upcoming_appointments || 0),
        0
    );

    const stats = [
        {
            name: "Connected Clinics",
            value: totalClinics,
            icon: Building2,
            gradient: "from-blue-50/90 via-white/80 to-blue-100/60",
            border: "border-blue-200/50",
            iconBg: "from-blue-500 to-blue-600",
            iconGlow: "from-blue-400/30 to-blue-500/30",
            trend: "+2",
            trendText: "New",
        },
        {
            name: "Total Appointments",
            value: totalAppointments,
            icon: Calendar,
            gradient: "from-green-50/90 via-white/80 to-emerald-100/60",
            border: "border-green-200/50",
            iconBg: "from-green-500 to-emerald-600",
            iconGlow: "from-green-400/30 to-emerald-500/30",
            trend: "Active",
            trendText: "Active",
        },
        {
            name: "Upcoming",
            value: upcomingAppointments,
            icon: Clock,
            gradient: "from-purple-50/90 via-white/80 to-violet-100/60",
            border: "border-purple-200/50",
            iconBg: "from-purple-500 to-violet-600",
            iconGlow: "from-purple-400/30 to-violet-500/30",
            trend: "Soon",
            trendText: "Soon",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.name}
                        className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-sm rounded-xl shadow-lg border ${stat.border} p-4 hover:shadow-xl transition-all duration-300 group hover:scale-102`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="relative">
                                <div
                                    className={`w-10 h-10 bg-gradient-to-br ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300`}
                                >
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                {/* Animated glow effect */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.iconGlow} rounded-xl animate-pulse`}
                                ></div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-base font-bold text-gray-700 mb-1">
                            {stat.name}
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                            {stat.trendText === "New"
                                ? "Connected clinics"
                                : stat.trendText === "Active"
                                ? "All-time appointments"
                                : "Scheduled visits"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default function PatientDashboard({
    auth,
    user,
    clinicRecords,
    appointments = [],
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <Head title="Patient Dashboard - Smile Suite" />

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Patient Dashboard
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">
                                Welcome back, {user?.name || auth?.user?.name}!
                                Here's your dental health overview
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-200/50 shadow-lg">
                                <span className="text-sm font-bold text-gray-700">
                                    {new Date().toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mb-8">
                    <StatisticsSection clinicRecords={clinicRecords} />
                </div>

                {/* Quick Actions Section */}
                <div className="mb-8">
                    <QuickActions />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Appointments Section */}
                    <div>
                        <AppointmentsSection appointments={appointments} />
                    </div>

                    {/* Connected Clinics Section */}
                    {clinicRecords && clinicRecords.length > 0 && (
                        <div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <Building2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Connected Clinics
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Your trusted dental partners
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {clinicRecords.slice(0, 3).map((record) => (
                                        <div
                                            key={record.id}
                                            className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4 hover:shadow-md transition-all duration-300 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                                                    <Building2 className="w-6 h-6 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {record.clinic?.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {record.clinic?.address}
                                                    </p>
                                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                        <span>
                                                            Appointments:
                                                        </span>
                                                        <span className="font-medium">
                                                            {record.appointments_count ||
                                                                0}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {clinicRecords.length > 3 && (
                                        <div className="text-center pt-2">
                                            <Link href="/clinics">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700 hover:from-green-100 hover:to-emerald-100"
                                                >
                                                    View All Clinics
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
