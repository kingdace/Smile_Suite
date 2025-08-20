import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Pencil,
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Heart,
    Shield,
    FileText,
    Activity,
    Clock,
    Users,
    AlertCircle,
} from "lucide-react";

export default function Show({ auth, patient }) {
    const formatDate = (date) => {
        return date ? format(new Date(date), "MMMM d, yyyy") : "Not specified";
    };

    const getAddressString = () => {
        const parts = [];
        if (patient.address_details) parts.push(patient.address_details);
        if (patient.barangay_name) parts.push(patient.barangay_name);
        if (patient.city_municipality_name)
            parts.push(patient.city_municipality_name);
        if (patient.province_name) parts.push(patient.province_name);
        if (patient.region_name) parts.push(patient.region_name);
        if (patient.postal_code) parts.push(patient.postal_code);
        return parts.length > 0 ? parts.join(", ") : "Not specified";
    };

    const getPatientStatus = () => {
        if (
            !patient.last_dental_visit ||
            patient.last_dental_visit === "No previous visit"
        )
            return "new";

        // Handle string values for last_dental_visit
        if (
            patient.last_dental_visit.includes("Within 3 months") ||
            patient.last_dental_visit.includes("Within 6 months") ||
            patient.last_dental_visit.includes("Within 1 year")
        ) {
            return "active";
        }

        if (patient.last_dental_visit.includes("More than 1 year")) {
            return "inactive";
        }

        // Default to inactive for any other values
        return "inactive";
    };

    const getStatusBadge = () => {
        const status = getPatientStatus();
        const variants = {
            new: "secondary",
            active: "default",
            inactive: "outline",
        };
        const colors = {
            new: "bg-blue-100 text-blue-700 border-blue-200",
            active: "bg-green-100 text-green-700 border-green-200",
            inactive: "bg-gray-100 text-gray-700 border-gray-200",
        };

        return (
            <Badge className={`${colors[status]} text-xs font-medium`}>
                {status === "new"
                    ? "New Patient"
                    : status === "active"
                    ? "Active"
                    : "Inactive"}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Patient Details" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-8 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                        <User className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Patient Details
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        {patient.first_name} {patient.last_name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge()}

                                {/* Quick Actions */}
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={route(
                                            "clinic.appointments.create",
                                            {
                                                clinic: auth.clinic_id,
                                                patient_id: patient.id,
                                            }
                                        )}
                                    >
                                        <Button
                                            size="sm"
                                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            <Calendar className="h-4 w-4" />
                                            Schedule
                                        </Button>
                                    </Link>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-2 bg-white/90 text-blue-600 border-blue-200 hover:bg-blue-50 text-sm px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        onClick={() => {
                                            if (patient.phone_number) {
                                                window.open(
                                                    `tel:${patient.phone_number}`,
                                                    "_blank"
                                                );
                                            } else {
                                                alert(
                                                    "No phone number available"
                                                );
                                            }
                                        }}
                                    >
                                        <Phone className="h-4 w-4" />
                                        Call
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-2 bg-white/90 text-purple-600 border-purple-200 hover:bg-purple-50 text-sm px-3 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        onClick={() => {
                                            if (patient.email) {
                                                window.open(
                                                    `mailto:${patient.email}`,
                                                    "_blank"
                                                );
                                            } else {
                                                alert(
                                                    "No email address available"
                                                );
                                            }
                                        }}
                                    >
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Button>
                                </div>

                                <Link
                                    href={route("clinic.patients.edit", {
                                        clinic: auth.clinic_id,
                                        patient: patient.id,
                                    })}
                                >
                                    <Button
                                        size="sm"
                                        className="gap-2 bg-white text-blue-600 hover:bg-blue-50 text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit Patient
                                    </Button>
                                </Link>
                                <Link
                                    href={route("clinic.patients.index", {
                                        clinic: auth.clinic_id,
                                    })}
                                >
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2 bg-white/25 text-white border-white/40 hover:bg-white/35 backdrop-blur-sm text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to List
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-12">
                    {/* Patient Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Calendar className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Last Visit
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {patient.last_dental_visit ||
                                                "Never"}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Clock className="h-3 w-3 text-blue-500" />
                                            <span className="text-xs text-blue-600">
                                                {patient.last_dental_visit
                                                    ? "Last visit"
                                                    : "No visits"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Activity className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Total Appointments
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {patient.appointments?.length || 0}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Activity className="h-3 w-3 text-emerald-500" />
                                            <span className="text-xs text-emerald-600">
                                                All time
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <FileText className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Total Treatments
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {patient.treatments?.length || 0}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <FileText className="h-3 w-3 text-purple-500" />
                                            <span className="text-xs text-purple-600">
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Shield className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">
                                            Age
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {patient.date_of_birth
                                                ? new Date().getFullYear() -
                                                  new Date(
                                                      patient.date_of_birth
                                                  ).getFullYear()
                                                : "N/A"}
                                        </p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Users className="h-3 w-3 text-orange-500" />
                                            <span className="text-xs text-orange-600">
                                                Years old
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                                        <User className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Patient Information
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Complete patient details and medical
                                            information
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge()}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                1
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Personal Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Basic personal details and
                                                demographics
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <User className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Full Name
                                                </p>
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {patient.first_name}{" "}
                                                    {patient.last_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                                            <div className="p-2 bg-emerald-500 rounded-lg">
                                                <Calendar className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Date of Birth
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    {formatDate(
                                                        patient.date_of_birth
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                            <div className="p-2 bg-purple-500 rounded-lg">
                                                <Heart className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Gender
                                                </p>
                                                <p className="font-bold text-gray-900 capitalize">
                                                    {patient.gender ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                            <div className="p-2 bg-orange-500 rounded-lg">
                                                <Shield className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Marital Status
                                                </p>
                                                <p className="font-bold text-gray-900 capitalize">
                                                    {patient.marital_status ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                                            <div className="p-2 bg-red-500 rounded-lg">
                                                <Activity className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Blood Type
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    {patient.blood_type ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                2
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Contact Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Contact details and address
                                                information
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                                            <div className="p-2 bg-emerald-500 rounded-lg">
                                                <Mail className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Email Address
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    {patient.email ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <Phone className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Phone Number
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    {patient.phone_number ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                            <div className="p-2 bg-purple-500 rounded-lg mt-1">
                                                <MapPin className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Complete Address
                                                </p>
                                                <p className="font-bold text-gray-900 leading-relaxed">
                                                    {getAddressString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                                            <div className="p-2 bg-indigo-500 rounded-lg">
                                                <FileText className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Occupation
                                                </p>
                                                <p className="font-bold text-gray-900">
                                                    {patient.occupation ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl border border-cyan-200">
                                            <div className="p-2 bg-cyan-500 rounded-lg">
                                                <Shield className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Category
                                                </p>
                                                <p className="font-bold text-gray-900 capitalize">
                                                    {patient.category
                                                        ? patient.category.replace(
                                                              "_",
                                                              " "
                                                          )
                                                        : "Not categorized"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact Information */}
                            <div className="mt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            3
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Emergency Contact
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Emergency contact information for
                                            urgent situations
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                                        <div className="p-2 bg-red-500 rounded-lg">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 font-medium">
                                                Contact Name
                                            </p>
                                            <p className="font-bold text-gray-900">
                                                {patient.emergency_contact_name ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                                        <div className="p-2 bg-red-500 rounded-lg">
                                            <Phone className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 font-medium">
                                                Contact Number
                                            </p>
                                            <p className="font-bold text-gray-900">
                                                {patient.emergency_contact_number ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                                        <div className="p-2 bg-red-500 rounded-lg">
                                            <Users className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 font-medium">
                                                Relationship
                                            </p>
                                            <p className="font-bold text-gray-900">
                                                {patient.emergency_contact_relationship ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Insurance Information */}
                            <div className="mt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            4
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Insurance Information
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Insurance provider and policy
                                            details
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                                        <div className="p-2 bg-indigo-500 rounded-lg">
                                            <Shield className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 font-medium">
                                                Insurance Provider
                                            </p>
                                            <p className="font-bold text-gray-900">
                                                {patient.insurance_provider ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
                                        <div className="p-2 bg-indigo-500 rounded-lg">
                                            <FileText className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-600 font-medium">
                                                Policy Number
                                            </p>
                                            <p className="font-bold text-gray-900">
                                                {patient.insurance_policy_number ||
                                                    "Not specified"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information */}
                            <div className="mt-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            5
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Medical Information
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Medical history, allergies, and
                                            dental records
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-purple-500 rounded-lg mt-1">
                                                <FileText className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium mb-2">
                                                    Medical History
                                                </p>
                                                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                                    {patient.medical_history ||
                                                        "No medical history recorded"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-orange-500 rounded-lg mt-1">
                                                <AlertCircle className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium mb-2">
                                                    Allergies
                                                </p>
                                                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                                    {patient.allergies ||
                                                        "No known allergies"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-500 rounded-lg mt-1">
                                                <Calendar className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-600 font-medium mb-2">
                                                    Last Dental Visit
                                                </p>
                                                <p className="text-gray-900">
                                                    {patient.last_dental_visit ||
                                                        "No previous visits recorded"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {patient.notes && (
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-gray-500 rounded-lg mt-1">
                                                    <FileText className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600 font-medium mb-2">
                                                        Additional Notes
                                                    </p>
                                                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                                        {patient.notes}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="appointments" className="mt-8">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
                            <TabsTrigger
                                value="appointments"
                                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                            >
                                <Calendar className="h-4 w-4 mr-2" />
                                Appointments
                            </TabsTrigger>
                            <TabsTrigger
                                value="treatments"
                                className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Treatments
                            </TabsTrigger>
                            <TabsTrigger
                                value="payments"
                                className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                Payments
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="appointments" className="mt-6">
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                                                <Calendar className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Appointments
                                                </CardTitle>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Patient appointment history
                                                    and scheduled visits
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {patient.appointments
                                                        ?.length || 0}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Total Appointments
                                                </p>
                                            </div>
                                            <Link
                                                href={route(
                                                    "clinic.appointments.create",
                                                    {
                                                        clinic: auth.clinic_id,
                                                        patient_id: patient.id,
                                                    }
                                                )}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                    Schedule New
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {patient.appointments &&
                                    patient.appointments.length > 0 ? (
                                        <div className="space-y-4">
                                            {patient.appointments.map(
                                                (appointment) => (
                                                    <div
                                                        key={appointment.id}
                                                        className="group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div className="p-2 bg-blue-500 rounded-lg">
                                                                        <Calendar className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 text-lg">
                                                                            {appointment.title ||
                                                                                "Appointment"}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-600">
                                                                            {formatDate(
                                                                                appointment.start_time
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {appointment.notes && (
                                                                    <p className="text-gray-700 ml-11">
                                                                        {
                                                                            appointment.notes
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <Badge
                                                                className={`ml-4 ${
                                                                    appointment.status ===
                                                                    "completed"
                                                                        ? "bg-green-100 text-green-700 border-green-200"
                                                                        : appointment.status ===
                                                                          "cancelled"
                                                                        ? "bg-red-100 text-red-700 border-red-200"
                                                                        : "bg-blue-100 text-blue-700 border-blue-200"
                                                                }`}
                                                            >
                                                                {appointment.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    appointment.status.slice(
                                                                        1
                                                                    )}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <Calendar className="h-8 w-8 text-blue-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No Appointments Found
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                This patient hasn't had any
                                                appointments yet. Schedule their
                                                first appointment to get
                                                started.
                                            </p>
                                            <div className="flex items-center justify-center gap-4">
                                                <Link
                                                    href={route(
                                                        "clinic.appointments.create",
                                                        {
                                                            clinic: auth.clinic_id,
                                                            patient_id:
                                                                patient.id,
                                                        }
                                                    )}
                                                >
                                                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                                        <Calendar className="h-4 w-4" />
                                                        Schedule First
                                                        Appointment
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    className="gap-2"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                    View Calendar
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="treatments" className="mt-6">
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                                                <FileText className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Treatments
                                                </CardTitle>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Dental treatments and
                                                    procedures performed
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {patient.treatments
                                                        ?.length || 0}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Total Treatments
                                                </p>
                                            </div>
                                            <Link
                                                href={route(
                                                    "clinic.treatments.create",
                                                    {
                                                        clinic: auth.clinic_id,
                                                        patient_id: patient.id,
                                                    }
                                                )}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Add Treatment
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {patient.treatments &&
                                    patient.treatments.length > 0 ? (
                                        <div className="space-y-4">
                                            {patient.treatments.map(
                                                (treatment) => (
                                                    <div
                                                        key={treatment.id}
                                                        className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div className="p-2 bg-purple-500 rounded-lg">
                                                                        <FileText className="h-4 w-4 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-bold text-gray-900 text-lg">
                                                                            {treatment.name ||
                                                                                "Treatment"}
                                                                        </h4>
                                                                        <p className="text-sm text-gray-600">
                                                                            {formatDate(
                                                                                treatment.date
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                {treatment.notes && (
                                                                    <p className="text-gray-700 ml-11">
                                                                        {
                                                                            treatment.notes
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="text-right ml-4">
                                                                <div className="text-2xl font-bold text-purple-600">
                                                                    ₱
                                                                    {treatment.cost?.toLocaleString() ||
                                                                        "0"}
                                                                </div>
                                                                <p className="text-sm text-gray-600">
                                                                    Treatment
                                                                    Cost
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <FileText className="h-8 w-8 text-purple-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No Treatments Found
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                No treatments have been recorded
                                                for this patient yet. Add their
                                                first treatment to track their
                                                dental care.
                                            </p>
                                            <div className="flex items-center justify-center gap-4">
                                                <Link
                                                    href={route(
                                                        "clinic.treatments.create",
                                                        {
                                                            clinic: auth.clinic_id,
                                                            patient_id:
                                                                patient.id,
                                                        }
                                                    )}
                                                >
                                                    <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                                                        <FileText className="h-4 w-4" />
                                                        Add First Treatment
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    className="gap-2"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    View Treatment History
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="payments" className="mt-6">
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm">
                                                <Shield className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Payments
                                                </CardTitle>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Payment history and
                                                    financial records
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-emerald-600">
                                                    ₱
                                                    {(
                                                        patient.payments?.reduce(
                                                            (sum, payment) =>
                                                                sum +
                                                                (payment.amount ||
                                                                    0),
                                                            0
                                                        ) || 0
                                                    ).toLocaleString()}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Total Paid
                                                </p>
                                            </div>
                                            <Link
                                                href={route(
                                                    "clinic.payments.create",
                                                    {
                                                        clinic: auth.clinic_id,
                                                        patient_id: patient.id,
                                                    }
                                                )}
                                            >
                                                <Button
                                                    size="sm"
                                                    className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                    Record Payment
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {patient.payments &&
                                    patient.payments.length > 0 ? (
                                        <div className="space-y-4">
                                            {patient.payments.map((payment) => (
                                                <div
                                                    key={payment.id}
                                                    className="group p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="p-2 bg-emerald-500 rounded-lg">
                                                                    <Shield className="h-4 w-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-gray-900 text-lg">
                                                                        {payment.payment_method ||
                                                                            "Payment"}
                                                                    </h4>
                                                                    <p className="text-sm text-gray-600">
                                                                        {formatDate(
                                                                            payment.payment_date
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {payment.notes && (
                                                                <p className="text-gray-700 ml-11">
                                                                    {
                                                                        payment.notes
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right ml-4">
                                                            <div className="text-2xl font-bold text-emerald-600">
                                                                ₱
                                                                {payment.amount?.toLocaleString() ||
                                                                    "0"}
                                                            </div>
                                                            <p className="text-sm text-gray-600">
                                                                Amount Paid
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="p-4 bg-emerald-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                <Shield className="h-8 w-8 text-emerald-600" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No Payments Found
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                No payment records have been
                                                found for this patient. Record
                                                their first payment to track
                                                financial transactions.
                                            </p>
                                            <div className="flex items-center justify-center gap-4">
                                                <Link
                                                    href={route(
                                                        "clinic.payments.create",
                                                        {
                                                            clinic: auth.clinic_id,
                                                            patient_id:
                                                                patient.id,
                                                        }
                                                    )}
                                                >
                                                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                                                        <Shield className="h-4 w-4" />
                                                        Record First Payment
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    className="gap-2"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                    View Payment History
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
