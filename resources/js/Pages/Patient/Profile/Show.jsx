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
    Shield,
    Heart,
    Activity,
    Clock,
    Star,
    CheckCircle,
    Building2,
    UserCheck,
    Award,
    TrendingUp,
    ArrowLeft,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { FadeIn, SlideIn } from "@/Components/ui/loading";
import { cn } from "@/lib/utils";

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
                    {/* Enhanced Page Header */}
                    <FadeIn>
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <Link href={route("patient.dashboard")}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-2 hover:bg-gray-50"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back to Dashboard
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex-1 text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        My Profile
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        Manage your personal information and
                                        clinic records
                                    </p>
                                </div>
                                <div className="flex-1 flex justify-end items-center gap-3">
                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-3 py-1 text-sm font-semibold flex items-center gap-2">
                                        <Shield className="w-3 h-3" />
                                        Verified Account
                                    </Badge>
                                    <Link href={route("patient.profile.edit")}>
                                        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                            <Edit className="w-4 h-4" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Main Profile Card */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Compact Personal Information */}
                            <SlideIn direction="up" delay={0}>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
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

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                                                    <User className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                                                    Full Name
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-bold text-base">
                                                {user.name}
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-md flex items-center justify-center">
                                                    <Mail className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                                    Email Address
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-bold text-sm break-all">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-md flex items-center justify-center">
                                                    <Phone className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                                                    Phone Number
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-bold text-sm">
                                                {user.phone_number ||
                                                    "Not provided"}
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-md flex items-center justify-center">
                                                    <Award className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                                                    Account Type
                                                </span>
                                            </div>
                                            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1 text-xs font-semibold">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Smile Suite Patient
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </SlideIn>

                            {/* Compact Clinic Records */}
                            <SlideIn direction="up" delay={200}>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
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
                                    {patients.length === 0 ? (
                                        <FadeIn>
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                                                    <FileText className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">
                                                    No Clinic Records Yet
                                                </h4>
                                                <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                                                    Your clinic records will
                                                    appear here once you visit
                                                    clinics and book
                                                    appointments.
                                                </p>
                                                <Link href="/clinics">
                                                    <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                                        <Building2 className="w-4 h-4" />
                                                        Find Clinics
                                                    </Button>
                                                </Link>
                                            </div>
                                        </FadeIn>
                                    ) : (
                                        <div className="space-y-4">
                                            {patients.map((patient, index) => (
                                                <SlideIn
                                                    key={patient.id}
                                                    direction="up"
                                                    delay={index * 100}
                                                >
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-green-300 transition-all duration-300 group">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
                                                                    <Building2 className="w-5 h-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-base font-bold text-gray-900">
                                                                        {
                                                                            patient
                                                                                .clinic
                                                                                .name
                                                                        }
                                                                    </h3>
                                                                    <p className="text-gray-600 text-xs">
                                                                        Patient
                                                                        Record
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-3 py-1 text-xs font-semibold">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                ID: {patient.id}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <User className="w-3 h-3 text-blue-600" />
                                                                    <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                                                                        Patient
                                                                        Name
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-900 font-bold text-sm">
                                                                    {
                                                                        patient.first_name
                                                                    }{" "}
                                                                    {
                                                                        patient.last_name
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Phone className="w-3 h-3 text-green-600" />
                                                                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                                                        Phone
                                                                        Number
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-900 font-bold text-sm">
                                                                    {
                                                                        patient.phone_number
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Activity className="w-3 h-3 text-purple-600" />
                                                                    <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                                                                        Status
                                                                    </span>
                                                                </div>
                                                                <Badge
                                                                    className={cn(
                                                                        "px-2 py-1 text-xs font-semibold",
                                                                        patient.status ===
                                                                            "active"
                                                                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                                                            : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                                                                    )}
                                                                >
                                                                    {
                                                                        patient.status
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Award className="w-3 h-3 text-orange-600" />
                                                                    <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                                                                        Category
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-900 font-bold text-sm">
                                                                    {
                                                                        patient.category_display_name
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Enhanced Medical Information */}
                                                        {(patient.medical_history ||
                                                            patient.allergies) && (
                                                            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200/50 mb-6">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                                                                        <Heart className="w-4 h-4 text-white" />
                                                                    </div>
                                                                    <h4 className="text-lg font-bold text-gray-900">
                                                                        Medical
                                                                        Information
                                                                    </h4>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {patient.medical_history && (
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-red-200/50">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <FileText className="w-4 h-4 text-red-600" />
                                                                                <span className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                                                                                    Medical
                                                                                    History
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm text-gray-700">
                                                                                {
                                                                                    patient.medical_history
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {patient.allergies && (
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-red-200/50">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                                                                <span className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                                                                                    Allergies
                                                                                </span>
                                                                            </div>
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

                                                        {/* Enhanced Emergency Contact */}
                                                        {patient.emergency_contact_name && (
                                                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200/50">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                                        <AlertTriangle className="w-4 h-4 text-white" />
                                                                    </div>
                                                                    <h4 className="text-lg font-bold text-gray-900">
                                                                        Emergency
                                                                        Contact
                                                                    </h4>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="bg-white/80 rounded-lg p-4 border border-yellow-200/50">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <User className="w-4 h-4 text-yellow-600" />
                                                                            <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
                                                                                Contact
                                                                                Name
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-gray-900 font-semibold text-sm">
                                                                            {
                                                                                patient.emergency_contact_name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="bg-white/80 rounded-lg p-4 border border-yellow-200/50">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Phone className="w-4 h-4 text-yellow-600" />
                                                                            <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
                                                                                Phone
                                                                                Number
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-gray-900 font-semibold text-sm">
                                                                            {
                                                                                patient.emergency_contact_number
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    {patient.emergency_contact_relationship && (
                                                                        <div className="bg-white/80 rounded-lg p-4 border border-yellow-200/50">
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <Heart className="w-4 h-4 text-yellow-600" />
                                                                                <span className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
                                                                                    Relationship
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-gray-900 font-semibold text-sm">
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
                                                </SlideIn>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </SlideIn>
                        </div>

                        {/* Enhanced Sidebar */}
                        <div className="space-y-6">
                            {/* Compact Quick Stats */}
                            <SlideIn direction="left" delay={300}>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Quick Stats
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Your profile overview and
                                                activity
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-blue-600" />
                                                    <span className="text-gray-700 font-semibold text-sm">
                                                        Connected Clinics
                                                    </span>
                                                </div>
                                                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                                    <Building2 className="w-3 h-3 text-blue-600" />
                                                </div>
                                            </div>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {patients.length}
                                            </span>
                                        </div>

                                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span className="text-gray-700 font-semibold text-sm">
                                                        Active Records
                                                    </span>
                                                </div>
                                                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                                                    <Activity className="w-3 h-3 text-green-600" />
                                                </div>
                                            </div>
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

                                        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-4 h-4 text-purple-600" />
                                                    <span className="text-gray-700 font-semibold text-sm">
                                                        Profile Complete
                                                    </span>
                                                </div>
                                                <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                                                    <Award className="w-3 h-3 text-purple-600" />
                                                </div>
                                            </div>
                                            <span className="text-2xl font-bold text-purple-600">
                                                {user.phone_number
                                                    ? "100%"
                                                    : "75%"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </SlideIn>

                            {/* Compact Quick Actions */}
                            <SlideIn direction="left" delay={400}>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                                            <Edit className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Quick Actions
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                Navigate to important pages and
                                                features
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Link href={route("patient.dashboard")}>
                                            <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 group border border-transparent hover:border-blue-200">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-sm">
                                                        View Dashboard
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Overview and
                                                        appointments
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route("patient.profile.edit")}
                                        >
                                            <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 group border border-transparent hover:border-purple-200">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm">
                                                    <Edit className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-sm">
                                                        Edit Profile
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        Update personal
                                                        information
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route(
                                                "patient.treatments.index"
                                            )}
                                        >
                                            <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 group border border-transparent hover:border-green-200">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-sm">
                                                    <FileText className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-sm">
                                                        Treatment History
                                                    </span>
                                                    <p className="text-xs text-gray-500">
                                                        View your dental records
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </SlideIn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
