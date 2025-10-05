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
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                                        <User className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                                            My Profile
                                        </h2>
                                        <p className="text-gray-600 text-lg">
                                            Manage your personal information and
                                            clinic records
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-3 py-1">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Verified Account
                                            </Badge>
                                            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-3 py-1">
                                                <Activity className="w-3 h-3 mr-1" />
                                                Active Patient
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-6 py-4 rounded-2xl border border-blue-200/50 shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" />
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
                                    <Link href={route("patient.profile.edit")}>
                                        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                            <Edit className="w-5 h-5" />
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
                            {/* Enhanced Personal Information */}
                            <SlideIn direction="up" delay={0}>
                                <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 rounded-2xl border border-gray-200/50 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    Personal Information
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Your account details and
                                                    contact information
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                            <UserCheck className="w-5 h-5 text-blue-600" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-gradient-to-r from-white/80 to-blue-50/50 rounded-2xl border border-blue-200/50 p-6 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                                                    Full Name
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-bold text-xl">
                                                {user.name}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-white/80 to-green-50/50 rounded-2xl border border-green-200/50 p-6 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                                    <Mail className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                                                    Email Address
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-bold text-lg break-all">
                                                {user.email}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-white/80 to-purple-50/50 rounded-2xl border border-purple-200/50 p-6 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                                                    Phone Number
                                                </span>
                                            </div>
                                            <p className="text-gray-900 font-bold text-lg">
                                                {user.phone_number ||
                                                    "Not provided"}
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-white/80 to-orange-50/50 rounded-2xl border border-orange-200/50 p-6 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                                    <Award className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                                                    Account Type
                                                </span>
                                            </div>
                                            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                                                <Shield className="w-3 h-3 mr-1" />
                                                Smile Suite Patient
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </SlideIn>

                            {/* Enhanced Clinic Records */}
                            <SlideIn direction="up" delay={200}>
                                <div className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 rounded-2xl border border-gray-200/50 shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <FileText className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">
                                                    Clinic Records (
                                                    {patients.length})
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Your patient records across
                                                    all connected clinics
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    {patients.length === 0 ? (
                                        <FadeIn>
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group">
                                                    <FileText className="w-10 h-10 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-3">
                                                    No Clinic Records Yet
                                                </h4>
                                                <p className="text-gray-600 text-lg max-w-md mx-auto mb-6">
                                                    Your clinic records will
                                                    appear here once you visit
                                                    clinics and book
                                                    appointments.
                                                </p>
                                                <Link href="/clinics">
                                                    <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                                        <Building2 className="w-5 h-5" />
                                                        Find Clinics
                                                    </Button>
                                                </Link>
                                            </div>
                                        </FadeIn>
                                    ) : (
                                        <div className="space-y-6">
                                            {patients.map((patient, index) => (
                                                <SlideIn
                                                    key={patient.id}
                                                    direction="up"
                                                    delay={index * 100}
                                                >
                                                    <div className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 rounded-2xl border border-gray-200/50 p-8 hover:shadow-xl hover:border-green-300/50 transition-all duration-300 group">
                                                        <div className="flex items-center justify-between mb-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                                    <Building2 className="w-6 h-6 text-white" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-gray-900">
                                                                        {
                                                                            patient
                                                                                .clinic
                                                                                .name
                                                                        }
                                                                    </h3>
                                                                    <p className="text-gray-600 text-sm">
                                                                        Patient
                                                                        Record
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-4 py-2 text-sm font-semibold">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                ID: {patient.id}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                            <div className="bg-gradient-to-r from-white/80 to-blue-50/50 rounded-xl border border-blue-200/50 p-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <User className="w-4 h-4 text-blue-600" />
                                                                    <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                                                                        Patient
                                                                        Name
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-900 font-bold text-lg">
                                                                    {
                                                                        patient.first_name
                                                                    }{" "}
                                                                    {
                                                                        patient.last_name
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="bg-gradient-to-r from-white/80 to-green-50/50 rounded-xl border border-green-200/50 p-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Phone className="w-4 h-4 text-green-600" />
                                                                    <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">
                                                                        Phone
                                                                        Number
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-900 font-bold text-lg">
                                                                    {
                                                                        patient.phone_number
                                                                    }
                                                                </p>
                                                            </div>

                                                            <div className="bg-gradient-to-r from-white/80 to-purple-50/50 rounded-xl border border-purple-200/50 p-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Activity className="w-4 h-4 text-purple-600" />
                                                                    <span className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                                                                        Status
                                                                    </span>
                                                                </div>
                                                                <Badge
                                                                    className={cn(
                                                                        "px-3 py-1 text-sm font-semibold",
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

                                                            <div className="bg-gradient-to-r from-white/80 to-orange-50/50 rounded-xl border border-orange-200/50 p-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Award className="w-4 h-4 text-orange-600" />
                                                                    <span className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                                                                        Category
                                                                    </span>
                                                                </div>
                                                                <p className="text-gray-900 font-bold text-lg">
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
                                                                        <p className="text-gray-900 font-bold text-lg">
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
                                                                        <p className="text-gray-900 font-bold text-lg">
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
                                                                            <p className="text-gray-900 font-bold text-lg">
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
                            {/* Enhanced Quick Stats */}
                            <SlideIn direction="left" delay={300}>
                                <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Quick Stats
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            Your profile overview and activity
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/80 rounded-2xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-5 h-5 text-blue-600" />
                                                    <span className="text-gray-700 font-semibold">
                                                        Connected Clinics
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Building2 className="w-4 h-4 text-blue-600" />
                                                </div>
                                            </div>
                                            <span className="text-3xl font-bold text-blue-600">
                                                {patients.length}
                                            </span>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50/80 to-green-100/80 rounded-2xl p-6 border border-green-200/50 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                    <span className="text-gray-700 font-semibold">
                                                        Active Records
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Activity className="w-4 h-4 text-green-600" />
                                                </div>
                                            </div>
                                            <span className="text-3xl font-bold text-green-600">
                                                {
                                                    patients.filter(
                                                        (p) =>
                                                            p.status ===
                                                            "active"
                                                    ).length
                                                }
                                            </span>
                                        </div>

                                        <div className="bg-gradient-to-r from-purple-50/80 to-purple-100/80 rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg transition-all duration-300 group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Star className="w-5 h-5 text-purple-600" />
                                                    <span className="text-gray-700 font-semibold">
                                                        Profile Complete
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Award className="w-4 h-4 text-purple-600" />
                                                </div>
                                            </div>
                                            <span className="text-3xl font-bold text-purple-600">
                                                {user.phone_number
                                                    ? "100%"
                                                    : "75%"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </SlideIn>

                            {/* Enhanced Quick Actions */}
                            <SlideIn direction="left" delay={400}>
                                <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-8 hover:shadow-2xl transition-all duration-300">
                                    <div className="mb-8">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                <Edit className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Quick Actions
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 text-sm">
                                            Navigate to important pages and
                                            features
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <Link href={route("patient.dashboard")}>
                                            <div className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-blue-100/80 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg border border-transparent hover:border-blue-200/50">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                                    <Calendar className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-lg">
                                                        View Dashboard
                                                    </span>
                                                    <p className="text-sm text-gray-500">
                                                        Overview and
                                                        appointments
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link
                                            href={route("patient.profile.edit")}
                                        >
                                            <div className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50/80 hover:to-purple-100/80 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg border border-transparent hover:border-purple-200/50">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                                    <Edit className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-lg">
                                                        Edit Profile
                                                    </span>
                                                    <p className="text-sm text-gray-500">
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
                                            <div className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50/80 hover:to-green-100/80 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-lg border border-transparent hover:border-green-200/50">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg">
                                                    <FileText className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-lg">
                                                        Treatment History
                                                    </span>
                                                    <p className="text-sm text-gray-500">
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
