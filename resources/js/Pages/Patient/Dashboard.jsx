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
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";

// Patient Portal Sidebar Component
const PatientSidebar = ({ auth, activeRoute, isCollapsed, setIsCollapsed }) => {
    const navigation = [
        // Main Navigation
        {
            name: "Dashboard",
            href: route("patient.dashboard"),
            routeName: "patient.dashboard",
            icon: LayoutDashboard,
            description: "Overview and statistics",
        },
        {
            name: "My Profile",
            href: route("patient.profile"),
            routeName: "patient.profile",
            icon: User,
            description: "Personal information",
        },

        // Healthcare Management
        {
            name: "Appointments",
            href: "#", // Placeholder
            routeName: "patient.appointments",
            icon: Calendar,
            description: "Schedule management",
        },
        {
            name: "Treatment History",
            href: "#", // Placeholder
            routeName: "patient.treatments",
            icon: Stethoscope,
            description: "Medical records",
        },
        {
            name: "Clinic Records",
            href: "#", // Placeholder
            routeName: "patient.clinics",
            icon: Building2,
            description: "Connected clinics",
        },
    ];

    return (
        <div
            className={cn(
                "fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-gradient-to-b from-blue-800 via-blue-700 to-blue-900 border-r border-blue-600/50 flex flex-col",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700/50 flex-shrink-0">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src="/images/smile-suite-logo.png"
                                alt="Smile Suite"
                                className="w-8 h-8 object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-lg font-bold text-white tracking-tight">
                                Smile Suite
                            </div>
                            <div className="text-xs text-slate-400">
                                Patient Portal
                            </div>
                        </div>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                >
                    <ChevronRight
                        className={cn(
                            "w-4 h-4 transition-transform",
                            isCollapsed && "rotate-180"
                        )}
                    />
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto custom-scrollbar">
                {/* Main Navigation */}
                <div className="mb-4">
                    {!isCollapsed && (
                        <div className="px-3 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                            Main
                        </div>
                    )}
                    {navigation.slice(0, 2).map((item) => {
                        const isActive = activeRoute === item.routeName;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1",
                                    isActive
                                        ? "bg-blue-400/20 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-400/10"
                                        : "text-blue-100 hover:text-white hover:bg-blue-600/50"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 mr-3 transition-colors",
                                        isActive
                                            ? "text-blue-200"
                                            : "text-blue-200 group-hover:text-white"
                                    )}
                                />
                                {!isCollapsed && (
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-blue-300 group-hover:text-blue-200">
                                            {item.description}
                                        </div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Healthcare Management */}
                <div className="mb-4">
                    {!isCollapsed && (
                        <div className="px-3 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
                            Healthcare
                        </div>
                    )}
                    {navigation.slice(2, 5).map((item) => {
                        const isActive = activeRoute === item.routeName;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1",
                                    isActive
                                        ? "bg-blue-400/20 text-blue-200 border border-blue-400/30 shadow-lg shadow-blue-400/10"
                                        : "text-blue-100 hover:text-white hover:bg-blue-600/50"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 mr-3 transition-colors",
                                        isActive
                                            ? "text-blue-200"
                                            : "text-blue-200 group-hover:text-white"
                                    )}
                                />
                                {!isCollapsed && (
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {item.name}
                                        </div>
                                        <div className="text-xs text-blue-300 group-hover:text-blue-200">
                                            {item.description}
                                        </div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Profile Section - Fixed at bottom */}
            <div className="border-t border-blue-600/50 p-3 flex-shrink-0">
                <div className="flex items-center space-x-2.5 mb-2">
                    <Avatar className="w-7 h-7 ring-2 ring-white/30 shadow-sm">
                        <AvatarImage src={auth.user.profile_photo_url} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                            {auth.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-blue-100 truncate leading-tight">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-blue-300 truncate leading-tight">
                                {auth.user.email}
                            </p>
                        </div>
                    )}
                </div>

                {/* Settings and Logout Buttons */}
                <div className="space-y-0.5">
                    <Link href="#">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-blue-100 hover:text-white hover:bg-blue-600/50 py-1.5 h-8 text-xs"
                        >
                            <Settings className="w-3.5 h-3.5 mr-2" />
                            {!isCollapsed && "Settings"}
                        </Button>
                    </Link>
                    <Link href={route("logout")} method="post" as="button">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-blue-100 hover:text-white hover:bg-blue-600/50 py-1.5 h-8 text-xs"
                        >
                            <LogOut className="w-3.5 h-3.5 mr-2" />
                            {!isCollapsed && "Logout"}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { auth, clinicRecords = [] } = usePage().props;
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Calculate totals
    const totalClinics = clinicRecords.length;
    const totalAppointments = clinicRecords.reduce(
        (sum, record) => sum + (record.appointments?.length || 0),
        0
    );
    const totalTreatments = clinicRecords.reduce(
        (sum, record) => sum + (record.treatments?.length || 0),
        0
    );
    const totalPayments = clinicRecords.reduce(
        (sum, record) => sum + (record.payments?.length || 0),
        0
    );

    // Sample data for enhanced features
    const healthScore = 85;
    const upcomingAppointments = [
        {
            id: 1,
            clinic: "Bright Smile Dental Clinic",
            date: "2024-01-15",
            time: "10:00 AM",
            type: "Regular Checkup",
            status: "confirmed",
        },
        {
            id: 2,
            clinic: "Perfect Teeth Dental Care",
            date: "2024-01-20",
            time: "2:30 PM",
            type: "Cleaning",
            status: "pending",
        },
    ];

    const recentActivities = [
        {
            id: 1,
            type: "appointment",
            title: "Appointment scheduled",
            description: "Regular checkup at Bright Smile Dental",
            date: "2 hours ago",
            icon: Calendar,
            color: "text-blue-500",
        },
        {
            id: 2,
            type: "treatment",
            title: "Treatment completed",
            description: "Dental cleaning at Perfect Teeth",
            date: "1 day ago",
            icon: Stethoscope,
            color: "text-green-500",
        },
        {
            id: 3,
            type: "payment",
            title: "Payment received",
            description: "Payment for consultation",
            date: "2 days ago",
            icon: DollarSign,
            color: "text-purple-500",
        },
    ];

    const quickActions = [
        {
            name: "Book Appointment",
            description: "Schedule a new dental visit",
            icon: Plus,
            href: "#",
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            name: "View Records",
            description: "Access your medical history",
            icon: FileText,
            href: "#",
            color: "bg-green-500 hover:bg-green-600",
        },
        {
            name: "Make Payment",
            description: "Pay outstanding bills",
            icon: CreditCard,
            href: "#",
            color: "bg-purple-500 hover:bg-purple-600",
        },
        {
            name: "Find Clinics",
            description: "Discover nearby dental clinics",
            icon: Search,
            href: "#",
            color: "bg-orange-500 hover:bg-orange-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50/30 to-cyan-100/50">
            <Head title="Patient Dashboard - Smile Suite" />

            {/* Sidebar */}
            <PatientSidebar
                auth={auth}
                activeRoute="patient.dashboard"
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Main Content */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    isCollapsed ? "ml-16" : "ml-64"
                )}
            >
                {/* Top Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 backdrop-blur-md border-b border-blue-500/20 sticky top-0 z-30 shadow-lg">
                    <div className="flex items-center justify-between h-16 px-4 md:px-6">
                        <div className="flex items-center gap-2 md:gap-4">
                            {/* Welcome Section */}
                            <div className="hidden sm:block">
                                <h1 className="text-xl md:text-2xl font-bold text-white">
                                    Welcome back, {auth.user.name}! 👋
                                </h1>
                                <p className="text-blue-100 text-sm">
                                    Here's your dental health overview across
                                    all connected clinics
                                </p>
                            </div>
                            <div className="sm:hidden">
                                <h1 className="text-lg font-bold text-white">
                                    Dashboard
                                </h1>
                            </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center space-x-2 md:space-x-3">
                            {/* Search - Hidden on mobile */}
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 pr-4 py-2 border border-white/20 bg-white/15 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 text-white placeholder-blue-200 text-sm w-64"
                                />
                            </div>

                            {/* Notifications */}
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 px-3 py-2"
                            >
                                <Bell className="w-4 h-4 md:mr-2" />
                                <span className="hidden md:inline">
                                    Notifications
                                </span>
                            </Button>

                            {/* User Menu */}
                            <div className="flex items-center space-x-2 md:space-x-3">
                                <Avatar className="w-8 h-8 ring-2 ring-white/30">
                                    <AvatarImage
                                        src={auth.user.profile_photo_url}
                                    />
                                    <AvatarFallback className="bg-white/25 text-white text-xs font-medium">
                                        {auth.user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block">
                                    <p className="text-sm font-semibold text-white">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-xs text-blue-100 font-medium">
                                        Patient
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="p-6 space-y-6">
                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-blue-100 text-sm font-medium">
                                            Connected Clinics
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {totalClinics}
                                        </p>
                                        <p className="text-blue-200 text-xs mt-1">
                                            Active partnerships
                                        </p>
                                    </div>
                                    <div className="bg-blue-400/20 p-3 rounded-full">
                                        <Building2 className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-green-100 text-sm font-medium">
                                            Total Appointments
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {totalAppointments}
                                        </p>
                                        <p className="text-green-200 text-xs mt-1">
                                            Scheduled visits
                                        </p>
                                    </div>
                                    <div className="bg-green-400/20 p-3 rounded-full">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-purple-100 text-sm font-medium">
                                            Treatments
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {totalTreatments}
                                        </p>
                                        <p className="text-purple-200 text-xs mt-1">
                                            Completed procedures
                                        </p>
                                    </div>
                                    <div className="bg-purple-400/20 p-3 rounded-full">
                                        <Stethoscope className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-orange-100 text-sm font-medium">
                                            Payments
                                        </p>
                                        <p className="text-3xl font-bold">
                                            {totalPayments}
                                        </p>
                                        <p className="text-orange-200 text-xs mt-1">
                                            Processed transactions
                                        </p>
                                    </div>
                                    <div className="bg-orange-400/20 p-3 rounded-full">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Health Score and Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Health Score Card */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-red-500" />
                                    Dental Health Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-slate-900 mb-2">
                                        {healthScore}%
                                    </div>
                                    <Progress
                                        value={healthScore}
                                        className="h-3"
                                    />
                                    <p className="text-sm text-slate-600 mt-2">
                                        Excellent oral health status
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">
                                            Last Checkup
                                        </span>
                                        <span className="font-medium">
                                            2 weeks ago
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">
                                            Next Appointment
                                        </span>
                                        <span className="font-medium text-blue-600">
                                            Jan 15, 2024
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">
                                            Insurance Status
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="text-green-600 border-green-600"
                                        >
                                            Active
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {quickActions.map((action) => (
                                        <Link
                                            key={action.name}
                                            href={action.href}
                                        >
                                            <Button
                                                className={`w-full h-auto p-4 flex flex-col items-center gap-2 text-white ${action.color} transition-all duration-200 hover:scale-105`}
                                            >
                                                <action.icon className="w-6 h-6" />
                                                <div className="text-center">
                                                    <div className="font-semibold">
                                                        {action.name}
                                                    </div>
                                                    <div className="text-xs opacity-90">
                                                        {action.description}
                                                    </div>
                                                </div>
                                            </Button>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Upcoming Appointments and Recent Activities */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upcoming Appointments */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        Upcoming Appointments
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {upcomingAppointments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-600">
                                            No upcoming appointments
                                        </p>
                                        <Button className="mt-4" size="sm">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Book Appointment
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {upcomingAppointments.map(
                                            (appointment) => (
                                                <div
                                                    key={appointment.id}
                                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-blue-100 p-2 rounded-full">
                                                            <Calendar className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">
                                                                {
                                                                    appointment.clinic
                                                                }
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {
                                                                    appointment.type
                                                                }
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {
                                                                    appointment.date
                                                                }{" "}
                                                                at{" "}
                                                                {
                                                                    appointment.time
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant={
                                                            appointment.status ===
                                                            "confirmed"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className="ml-2"
                                                    >
                                                        {appointment.status}
                                                    </Badge>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-green-500" />
                                    Recent Activities
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-start gap-3"
                                        >
                                            <div
                                                className={`bg-slate-100 p-2 rounded-full ${activity.color}`}
                                            >
                                                <activity.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {activity.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Health Tips and Resources */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-800">
                                    <Sparkles className="w-5 h-5" />
                                    Daily Health Tip
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="bg-white/60 p-4 rounded-lg border border-emerald-200">
                                        <h4 className="font-semibold text-emerald-900 mb-2">
                                            Proper Brushing Technique
                                        </h4>
                                        <p className="text-emerald-800 text-sm">
                                            Brush your teeth for at least 2
                                            minutes twice daily using gentle,
                                            circular motions. Don't forget to
                                            clean your tongue for fresh breath!
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                                    >
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Read More Tips
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <Shield className="w-5 h-5" />
                                    Emergency Contacts
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-blue-200">
                                        <div>
                                            <p className="font-medium text-blue-900">
                                                Emergency Dental
                                            </p>
                                            <p className="text-blue-700 text-sm">
                                                24/7 Hotline
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-300 text-blue-700"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Call Now
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-blue-200">
                                        <div>
                                            <p className="font-medium text-blue-900">
                                                Insurance Support
                                            </p>
                                            <p className="text-blue-700 text-sm">
                                                Claims & Coverage
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-300 text-blue-700"
                                        >
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Contact
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #475569, #64748b);
                    border-radius: 8px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, #64748b, #94a3b8);
                    transform: scaleX(1.3);
                    box-shadow: 0 0 8px rgba(148, 163, 184, 0.3);
                }
            `}</style>
        </div>
    );
}
