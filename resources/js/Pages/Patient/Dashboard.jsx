import { Head, usePage, Link } from "@inertiajs/react";
import { Calendar, Hospital, User, ArrowRight } from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";

export default function Dashboard() {
    const { auth, patients = [], appointments = [] } = usePage().props;
    const upcomingCount = appointments.length;
    const clinicsCount = patients.length;

    return (
        <div className="min-h-screen bg-gray-100">
            <SiteHeader />
            <Head title="Patient Dashboard" />
            <div className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Summary */}
                    <div className="col-span-1 bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
                        <div className="bg-blue-50 border border-blue-100 rounded-full p-3 mb-3">
                            <User className="w-10 h-10 text-blue-500" />
                        </div>
                        <div className="font-semibold text-lg text-gray-900">
                            {auth.user.name}
                        </div>
                        <div className="text-gray-500 text-sm mb-2">
                            {auth.user.email}
                        </div>
                        <Link
                            href="/patient/profile"
                            className="text-blue-600 hover:underline text-sm mt-2"
                        >
                            View Profile
                        </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="col-span-2 grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                            <Calendar className="w-8 h-8 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {upcomingCount}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Upcoming Appointments
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                            <Hospital className="w-8 h-8 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {clinicsCount}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    Connected Clinics
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Appointments & Clinics */}
                <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">
                                Upcoming Appointments
                            </h4>
                            <Link
                                href="/patient/appointments"
                                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        {appointments.length === 0 ? (
                            <p className="text-gray-500">
                                No upcoming appointments.
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {appointments.slice(0, 3).map((appt) => (
                                    <li
                                        key={appt.id}
                                        className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <span>
                                            <span className="font-medium text-blue-700">
                                                {appt.clinic?.name ||
                                                    "Unknown Clinic"}
                                            </span>
                                            <span className="ml-2 text-gray-500 text-sm">
                                                {new Date(
                                                    appt.scheduled_at
                                                ).toLocaleString()}
                                            </span>
                                        </span>
                                        <span className="text-gray-500 text-xs mt-1 sm:mt-0">
                                            Status:{" "}
                                            {appt.status?.name ||
                                                appt.status ||
                                                "N/A"}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Connected Clinics */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">
                                Connected Clinics
                            </h4>
                            <Link
                                href="/patient/clinics"
                                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        {patients.length === 0 ? (
                            <p className="text-gray-500">
                                You are not connected to any clinics yet.
                            </p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {patients.slice(0, 3).map((patient) => (
                                    <li
                                        key={patient.id}
                                        className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <span>
                                            <span className="font-medium text-blue-700">
                                                {patient.clinic?.name ||
                                                    "Unknown Clinic"}
                                            </span>
                                            <span className="ml-2 text-gray-500 text-sm">
                                                {patient.clinic?.address ||
                                                    "No address"}
                                            </span>
                                        </span>
                                        <span className="text-gray-500 text-xs mt-1 sm:mt-0">
                                            Patient Record ID: {patient.id}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
