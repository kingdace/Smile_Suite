import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Stethoscope,
    Shield,
    Award,
    Clock,
    AlertTriangle,
    Edit,
    Building2,
    Star,
    Activity,
    CheckCircle,
    XCircle,
} from "lucide-react";

export default function Show({ auth, user }) {
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const roleColors = {
        clinic_admin: "bg-purple-100 text-purple-700 border-purple-200",
        dentist: "bg-blue-100 text-blue-700 border-blue-200",
        staff: "bg-green-100 text-green-700 border-green-200",
    };

    const roleIcons = {
        clinic_admin: Shield,
        dentist: Stethoscope,
        staff: User,
    };

    const RoleIcon = roleIcons[user.role] || User;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="My Profile" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Enhanced Header */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl mb-8">
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative px-8 py-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-2xl font-bold text-white">
                                                {getInitials(user.name)}
                                            </span>
                                        </div>
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                                                user.is_active
                                                    ? "bg-green-500"
                                                    : "bg-gray-400"
                                            }`}
                                        ></div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white mb-2">
                                            {user.name}
                                        </h1>
                                        <div className="flex items-center gap-4 text-blue-100">
                                            <div className="flex items-center gap-2">
                                                <RoleIcon className="h-4 w-4" />
                                                <span className="text-sm font-medium capitalize">
                                                    {user.role.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                <span className="text-sm font-medium">
                                                    {user.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                                    >
                                        <Link
                                            href={route("clinic.profile.edit")}
                                        >
                                            <Edit className="h-4 w-4" />
                                            Edit Profile
                                        </Link>
                                    </Button>
                                    {user.role === "dentist" && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
                                        >
                                            <Link
                                                href={route(
                                                    "clinic.dashboard",
                                                    { clinic: user.clinic_id }
                                                )}
                                            >
                                                <Activity className="h-4 w-4" />
                                                View Schedule
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                        {/* Main Content - Personal & Professional Information */}
                        <div className="xl:col-span-3 space-y-6">
                            {/* Basic Information */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-500">
                                                Full Name
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {user.name}
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-500">
                                                Email Address
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-900">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        {user.phone_number && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-500">
                                                    Phone Number
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <p className="text-gray-900">
                                                        {user.phone_number}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-500">
                                                Member Since
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <p className="text-gray-900">
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Professional Information (for dentists) */}
                            {user.role === "dentist" && (
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Stethoscope className="h-5 w-5 text-blue-600" />
                                            Professional Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {user.license_number ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium text-gray-500">
                                                        License Number
                                                    </label>
                                                    <p className="text-gray-900 font-medium text-lg">
                                                        {user.license_number}
                                                    </p>
                                                </div>
                                                {user.years_experience && (
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-medium text-gray-500">
                                                            Years of Experience
                                                        </label>
                                                        <p className="text-gray-900 text-lg">
                                                            {
                                                                user.years_experience
                                                            }{" "}
                                                            years
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Stethoscope className="h-10 w-10 text-blue-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                                    Professional Information Not
                                                    Set
                                                </h3>
                                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                    Complete your professional
                                                    profile to help patients
                                                    learn more about you and
                                                    build trust.
                                                </p>
                                                <Button
                                                    asChild
                                                    size="lg"
                                                    className="gap-2"
                                                >
                                                    <Link
                                                        href={route(
                                                            "clinic.profile.edit"
                                                        )}
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                        Complete Profile
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}

                                        {user.bio && (
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-gray-500">
                                                    Bio
                                                </label>
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <p className="text-gray-700 leading-relaxed text-base">
                                                        {user.bio}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {user.specialties &&
                                            user.specialties.length > 0 && (
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Specialties
                                                    </label>
                                                    <div className="flex flex-wrap gap-3">
                                                        {user.specialties.map(
                                                            (
                                                                specialty,
                                                                index
                                                            ) => (
                                                                <Badge
                                                                    key={index}
                                                                    variant="outline"
                                                                    className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium"
                                                                >
                                                                    {specialty}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        {user.qualifications &&
                                            user.qualifications.length > 0 && (
                                                <div className="space-y-3">
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Qualifications
                                                    </label>
                                                    <div className="space-y-3">
                                                        {user.qualifications.map(
                                                            (
                                                                qualification,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                                                >
                                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                        <Award className="h-4 w-4 text-blue-600" />
                                                                    </div>
                                                                    <span className="text-gray-700 font-medium">
                                                                        {
                                                                            qualification
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Working Hours (for dentists) */}
                            {user.role === "dentist" && user.working_hours && (
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            Working Hours
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Your weekly availability schedule
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(
                                                user.working_hours
                                            ).map(([day, hours]) => (
                                                <div
                                                    key={day}
                                                    className={`flex items-center justify-between p-4 rounded-lg border ${
                                                        hours
                                                            ? "bg-green-50 border-green-200"
                                                            : "bg-gray-50 border-gray-200"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-3 h-3 rounded-full ${
                                                                hours
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-400"
                                                            }`}
                                                        ></div>
                                                        <span className="font-medium text-gray-700 capitalize">
                                                            {day}
                                                        </span>
                                                    </div>
                                                    <span
                                                        className={`font-medium ${
                                                            hours
                                                                ? "text-green-700"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {hours
                                                            ? `${hours.start} - ${hours.end}`
                                                            : "Day off"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Sidebar - Additional Info */}
                        <div className="xl:col-span-1 space-y-6">
                            {/* Emergency Contact */}
                            {user.role === "dentist" &&
                                (user.emergency_contact ||
                                    user.emergency_phone) && (
                                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                                Emergency Contact
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {user.emergency_contact && (
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Contact Person
                                                    </label>
                                                    <p className="text-gray-900">
                                                        {user.emergency_contact}
                                                    </p>
                                                </div>
                                            )}
                                            {user.emergency_phone && (
                                                <div className="space-y-1">
                                                    <label className="text-sm font-medium text-gray-500">
                                                        Emergency Phone
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <p className="text-gray-900">
                                                            {
                                                                user.emergency_phone
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Clinic Information */}
                            {user.clinic && (
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                            Clinic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-500">
                                                Clinic Name
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {user.clinic.name}
                                            </p>
                                        </div>
                                        {user.clinic.address && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-500">
                                                    Address
                                                </label>
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                                    <p className="text-gray-700 text-sm">
                                                        {user.clinic.address}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {user.clinic.phone && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-gray-500">
                                                    Clinic Phone
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <p className="text-gray-900">
                                                        {user.clinic.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Account Status */}
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                        Account Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-500">
                                            Status
                                        </span>
                                        <Badge
                                            className={
                                                user.is_active
                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                    : "bg-red-100 text-red-700 border-red-200"
                                            }
                                        >
                                            {user.is_active ? (
                                                <>
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Active
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Inactive
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-500">
                                            Role
                                        </span>
                                        <Badge
                                            className={roleColors[user.role]}
                                        >
                                            <RoleIcon className="w-3 h-3 mr-1" />
                                            {user.role
                                                .replace("_", " ")
                                                .toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-500">
                                            Last Updated
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {new Date(
                                                user.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
