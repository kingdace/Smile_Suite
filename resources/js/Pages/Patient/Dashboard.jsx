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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    My Appointments
                </CardTitle>
            </CardHeader>
            <CardContent>
                {appointments.length > 0 ? (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
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
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No Appointments Yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                            You haven't booked any appointments yet.
                        </p>
                        <Link href="/clinics">
                            <Button className="flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Find Clinics
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.name} href={action.href}>
                                <div
                                    className={`${action.color} text-white p-6 rounded-xl transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1`}
                                >
                                    <div className="flex flex-col items-center text-center gap-3">
                                        <div className="p-3 bg-white/20 rounded-lg">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">
                                                {action.name}
                                            </h4>
                                            <p className="text-sm opacity-90">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
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
            color: "text-blue-600",
            bgColor: "bg-blue-100",
        },
        {
            name: "Total Appointments",
            value: totalAppointments,
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-100",
        },
        {
            name: "Upcoming",
            value: upcomingAppointments,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.name}>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div
                                    className={`${stat.bgColor} p-3 rounded-lg`}
                                >
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.name}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
        <div className="min-h-screen bg-gray-100">
            <Head title="Patient Dashboard - Smile Suite" />

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name || auth?.user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Here's your dental health overview across all connected
                        clinics
                    </p>
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
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                        Connected Clinics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {clinicRecords
                                            .slice(0, 3)
                                            .map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Building2 className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {
                                                                    record
                                                                        .clinic
                                                                        ?.name
                                                                }
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    record
                                                                        .clinic
                                                                        ?.address
                                                                }
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
                                                    >
                                                        View All Clinics
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
