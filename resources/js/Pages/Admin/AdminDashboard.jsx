import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Users,
    Building2,
    UsersRound,
    Activity,
    ArrowRight,
    FileText,
} from "lucide-react";

export default function AdminDashboard({ auth, stats }) {
    return (
        <AuthenticatedLayout auth={auth} hideSidebar={true}>
            <Head title="Admin Dashboard" />

            <div className="py-6">
                <div className="max-w-full px-4 sm:px-6 lg:px-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                        Total Users
                                    </h3>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {stats?.total_users || 0}
                                    </p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                        Active Clinics
                                    </h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        {stats?.active_clinics || 0}
                                    </p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <Building2 className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                        Total Patients
                                    </h3>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {stats?.total_patients || 0}
                                    </p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <UsersRound className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                                        Pending Requests
                                    </h3>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {stats?.pending_clinic_requests || 0}
                                    </p>
                                </div>
                                <div className="bg-orange-100 p-3 rounded-full">
                                    <FileText className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Management Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Users Management */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Users Management
                                </h3>
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Manage system users, their roles, and
                                permissions.
                            </p>
                            <Link
                                href={route("admin.users.index")}
                                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                Manage Users
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>

                        {/* Clinics Management */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Clinics Management
                                </h3>
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Building2 className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Manage dental clinics, their subscriptions, and
                                settings.
                            </p>
                            <div className="space-x-4">
                                <Link
                                    href={route("admin.clinics.index")}
                                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    View Clinics
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                                <Link
                                    href={route("admin.clinics.create")}
                                    className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                                >
                                    Create Clinic
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>

                        {/* Clinic Registration Requests */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Registration Requests
                                </h3>
                                <div className="bg-orange-100 p-2 rounded-full">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                            <p className="text-gray-600 mb-6">
                                Review and manage clinic registration requests
                                from new applicants.
                            </p>
                            <Link
                                href={route("admin.clinic-requests.index")}
                                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                            >
                                View Requests
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent Clinics */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Recent Clinics
                                </h3>
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Activity className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {stats?.recent_clinics?.map((clinic) => (
                                    <div
                                        key={clinic.id}
                                        className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 px-2 rounded-md transition-colors duration-200"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {clinic.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {clinic.email}
                                            </p>
                                        </div>
                                        <Link
                                            href={route(
                                                "admin.clinics.show",
                                                clinic.id
                                            )}
                                            className="text-blue-500 hover:text-blue-600 flex items-center"
                                        >
                                            View
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Users */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Recent Users
                                </h3>
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {stats?.recent_users?.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between border-b pb-3 hover:bg-gray-50 px-2 rounded-md transition-colors duration-200"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        {/* Optionally, you could add an Edit button here to open the modal on the Users page */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
