import { Head, Link } from "@inertiajs/react";
import {
    User,
    Edit,
    Phone,
    Mail,
    MapPin,
    Calendar,
    FileText,
    AlertTriangle,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

export default function PatientProfileShow({ user, patients }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <SiteHeader />
            <Head title="My Profile" />
            <div className="sr-only">
                <h1>My Profile</h1>
                <p>Manage your personal information and account settings</p>
            </div>

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    My Profile
                                </h2>
                                <p className="text-gray-600 mt-2 text-lg">
                                    Manage your personal information and clinic
                                    records
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-200/50 shadow-lg">
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
                                <Link href={route("patient.profile.edit")}>
                                    <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                                        <Edit className="w-4 h-4" />
                                        Edit Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Main Profile Card */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Personal Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Personal Information
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Your account details and contact
                                                information
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                                Full Name
                                            </label>
                                            <p className="text-gray-900 font-semibold text-lg">
                                                {user.name}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                                Email
                                            </label>
                                            <p className="text-gray-900 font-semibold text-lg">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                                Phone Number
                                            </label>
                                            <p className="text-gray-900 font-semibold text-lg">
                                                {user.phone_number ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <label className="text-sm font-medium text-gray-500 mb-2 block">
                                                Account Type
                                            </label>
                                            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                                                Smile Suite Patient
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Clinic Records */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Clinic Records (
                                                {patients.length})
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Your patient records across all
                                                connected clinics
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-green-600" />
                                    </div>
                                </div>
                                <div>
                                    {patients.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                No Clinic Records Yet
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                Your clinic records will appear
                                                here once you visit clinics and
                                                book appointments.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {patients.map((patient, index) => (
                                                <div
                                                    key={patient.id}
                                                    className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-6 hover:shadow-md transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                                                <FileText className="w-4 h-4 text-green-600" />
                                                            </div>
                                                            <h3 className="font-bold text-gray-900 text-lg">
                                                                {
                                                                    patient
                                                                        .clinic
                                                                        .name
                                                                }
                                                            </h3>
                                                        </div>
                                                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                                                            ID: {patient.id}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Name
                                                            </label>
                                                            <p className="font-medium">
                                                                {
                                                                    patient.first_name
                                                                }{" "}
                                                                {
                                                                    patient.last_name
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Phone
                                                            </label>
                                                            <p className="font-medium">
                                                                {
                                                                    patient.phone_number
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Status
                                                            </label>
                                                            <Badge
                                                                variant={
                                                                    patient.status ===
                                                                    "active"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                                className="mt-1"
                                                            >
                                                                {patient.status}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Category
                                                            </label>
                                                            <p className="font-medium">
                                                                {
                                                                    patient.category_display_name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Medical Information */}
                                                    {(patient.medical_history ||
                                                        patient.allergies) && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Medical
                                                                Information
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {patient.medical_history && (
                                                                    <div>
                                                                        <label className="text-xs text-gray-500">
                                                                            Medical
                                                                            History
                                                                        </label>
                                                                        <p className="text-sm text-gray-700">
                                                                            {
                                                                                patient.medical_history
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {patient.allergies && (
                                                                    <div>
                                                                        <label className="text-xs text-gray-500">
                                                                            Allergies
                                                                        </label>
                                                                        <p className="text-sm text-gray-700">
                                                                            {
                                                                                patient.allergies
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Emergency Contact */}
                                                    {patient.emergency_contact_name && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Emergency
                                                                Contact
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <label className="text-gray-500">
                                                                        Name
                                                                    </label>
                                                                    <p className="font-medium">
                                                                        {
                                                                            patient.emergency_contact_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-gray-500">
                                                                        Phone
                                                                    </label>
                                                                    <p className="font-medium">
                                                                        {
                                                                            patient.emergency_contact_number
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {patient.emergency_contact_relationship && (
                                                                    <div>
                                                                        <label className="text-gray-500">
                                                                            Relationship
                                                                        </label>
                                                                        <p className="font-medium">
                                                                            {
                                                                                patient.emergency_contact_relationship
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <User className="w-5 h-5 text-blue-600" />
                                        Quick Stats
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Your profile overview
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50/50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 font-medium">
                                                Connected Clinics
                                            </span>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {patients.length}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50/50 to-green-100/50 rounded-xl p-4 border border-green-200/50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-700 font-medium">
                                                Active Records
                                            </span>
                                            <span className="text-2xl font-bold text-green-600">
                                                {
                                                    patients.filter(
                                                        (p) =>
                                                            p.status ===
                                                            "active"
                                                    ).length
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Edit className="w-5 h-5 text-purple-600" />
                                        Quick Actions
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        Navigate to important pages
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <Link href={route("patient.dashboard")}>
                                        <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-blue-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-blue-200/50">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                                <Calendar className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-semibold text-sm">
                                                View Dashboard
                                            </span>
                                        </div>
                                    </Link>
                                    <Link href={route("patient.profile.edit")}>
                                        <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-purple-100/80 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md border border-transparent hover:border-purple-200/50">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                                <Edit className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="font-semibold text-sm">
                                                Edit Profile
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
