import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Users,
    Building2,
    UsersRound,
    Activity,
    ArrowRight,
    FileText,
    TrendingUp,
    BarChart3,
    Calendar,
    Clock,
    Eye,
    Plus,
    CheckCircle,
    AlertCircle,
    Home,
    Settings,
    Shield,
    Database,
    PieChart,
    Bell,
    Search,
} from "lucide-react";

export default function AdminDashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout auth={auth} hideSidebar={true}>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 bg-white/70 backdrop-blur-sm border-r border-gray-200/50 min-h-screen p-6 shadow-xl">
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div>
                                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Activity className="w-3 h-3" />
                                    Quick Actions
                                </h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route("admin.users.index")}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-blue-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-blue-200/50"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-sm">
                                            Manage Users
                                        </span>
                                    </Link>

                                    <Link
                                        href={route("admin.clinics.index")}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-green-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-green-200/50"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                            <Building2 className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-sm">
                                            View Clinics
                                        </span>
                                    </Link>

                                    <Link
                                        href={route("admin.clinics.create")}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-emerald-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-emerald-200/50"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                            <Plus className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-sm">
                                            Create Clinic
                                        </span>
                                    </Link>

                                    <Link
                                        href={route(
                                            "admin.clinic-requests.index"
                                        )}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-orange-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-orange-200/50"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-sm">
                                            View Requests
                                        </span>
                                    </Link>

                                    <Link
                                        href={route(
                                            "admin.subscriptions.index"
                                        )}
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-purple-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-purple-200/50"
                                    >
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-semibold text-sm">
                                            Subscriptions
                                        </span>
                                    </Link>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="pt-6 border-t border-gray-200/50">
                                <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Database className="w-3 h-3" />
                                    System Status
                                </h3>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 p-4 rounded-xl border border-green-300/50 shadow-lg backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-700">
                                                System Health
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-md">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Healthy
                                            </span>
                                        </div>
                                        <div className="w-full bg-green-200/50 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full w-full animate-pulse shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 p-4 rounded-xl border border-blue-300/50 shadow-lg backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Database
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-500 text-white shadow-md">
                                                <Database className="w-3 h-3 mr-1" />
                                                Online
                                            </span>
                                        </div>
                                        <div className="w-full bg-blue-200/50 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full w-full shadow-sm"></div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-100/80 to-violet-100/80 p-4 rounded-xl border border-purple-300/50 shadow-lg backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-gray-700">
                                                Uptime
                                            </span>
                                            <span className="text-sm font-bold text-purple-600">
                                                99.9%
                                            </span>
                                        </div>
                                        <div className="w-full bg-purple-200/50 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full w-full shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {/* Page Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        Dashboard Overview
                                    </h2>
                                    <p className="text-gray-600 mt-2 text-lg">
                                        Monitor your dental clinic management
                                        system
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-gradient-to-r from-purple-100/80 to-pink-100/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-purple-200/50 shadow-lg">
                                        <span className="text-sm font-bold text-gray-700">
                                            {new Date().toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Total Users */}
                            <div className="bg-gradient-to-br from-blue-50/90 via-white/80 to-blue-100/60 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                                            <Users className="w-7 h-7 text-white" />
                                        </div>
                                        {/* Animated glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-500/30 rounded-2xl animate-pulse"></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>+12%</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">
                                    Total Users
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 mb-1">
                                    {stats?.total_users || 0}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    Active system users
                                </p>
                            </div>

                            {/* Active Clinics */}
                            <div className="bg-gradient-to-br from-green-50/90 via-white/80 to-emerald-100/60 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200/50 p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                                            <Building2 className="w-7 h-7 text-white" />
                                        </div>
                                        {/* Animated glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-2xl animate-pulse"></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Active</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">
                                    Active Clinics
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 mb-1">
                                    {stats?.active_clinics || 0}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    Registered dental clinics
                                </p>
                            </div>

                            {/* Total Patients */}
                            <div className="bg-gradient-to-br from-purple-50/90 via-white/80 to-violet-100/60 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                                            <UsersRound className="w-7 h-7 text-white" />
                                        </div>
                                        {/* Animated glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-violet-500/30 rounded-2xl animate-pulse"></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>+8%</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">
                                    Total Patients
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 mb-1">
                                    {stats?.total_patients || 0}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    Registered patients
                                </p>
                            </div>

                            {/* Pending Requests */}
                            <div className="bg-gradient-to-br from-orange-50/90 via-white/80 to-red-100/60 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200/50 p-6 hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                                            <FileText className="w-7 h-7 text-white" />
                                        </div>
                                        {/* Animated glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-red-500/30 rounded-2xl animate-pulse"></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-orange-600 text-sm font-bold">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Pending</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">
                                    Pending Requests
                                </h3>
                                <p className="text-4xl font-bold text-gray-900 mb-1">
                                    {stats?.pending_clinic_requests || 0}
                                </p>
                                <p className="text-sm text-gray-500 font-medium">
                                    Awaiting approval
                                </p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Clinics */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <Building2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Recent Clinics
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Latest registered clinics
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {stats?.recent_clinics?.map(
                                        (clinic, index) => (
                                            <div
                                                key={clinic.id}
                                                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all duration-200 group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-green-600 font-semibold text-sm">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {clinic.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {clinic.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href={route(
                                                        "admin.clinics.show",
                                                        clinic.id
                                                    )}
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 group-hover:scale-105"
                                                >
                                                    View
                                                    <ArrowRight className="w-4 h-4 ml-1" />
                                                </Link>
                                            </div>
                                        )
                                    )}
                                    {(!stats?.recent_clinics ||
                                        stats.recent_clinics.length === 0) && (
                                        <div className="text-center py-8 text-gray-500">
                                            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>No recent clinics</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Users */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Recent Users
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Latest registered users
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {stats?.recent_users?.map((user, index) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-gray-400 text-sm">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                        </div>
                                    ))}
                                    {(!stats?.recent_users ||
                                        stats.recent_users.length === 0) && (
                                        <div className="text-center py-8 text-gray-500">
                                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>No recent users</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
