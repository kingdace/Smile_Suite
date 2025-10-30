import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Stethoscope,
    Calendar,
    User,
    Building2,
    Clock,
    CheckCircle,
    FileText,
    ArrowLeft,
    DollarSign,
    MapPin,
    Phone,
    Mail,
    Pill,
    Heart,
    Shield,
    Activity,
    Image as ImageIcon,
    Star,
    AlertCircle,
    CalendarDays,
    Timer,
    ClipboardList,
    Lightbulb,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import SiteHeader from "@/Components/SiteHeader";
import { cn } from "@/lib/utils";
import { getDentistDisplayName } from "@/Helpers/DentistHelper";
import ImprovedDentalChart from "@/Components/ImprovedDentalChart/DentalChart";

export default function PatientTreatmentShow({
    auth,
    user,
    treatment,
    isPlaceholder = false,
}) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "scheduled":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            case "not_found":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "in_progress":
                return <Clock className="w-4 h-4 text-blue-600" />;
            case "scheduled":
                return <Calendar className="w-4 h-4 text-yellow-600" />;
            case "cancelled":
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            case "not_found":
                return <AlertCircle className="w-4 h-4 text-orange-600" />;
            default:
                return <FileText className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <Head
                title={`Treatment Details - ${
                    treatment?.service?.name || treatment?.name || "Treatment"
                }`}
            />

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
                {/* Compact Page Header */}
                <div className="mb-4 sm:mb-6">
                    {/* Mobile Layout */}
                    <div className="flex flex-col sm:hidden gap-3">
                        <div className="flex items-center justify-between">
                            <Link href={route("patient.treatments.index")}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back
                                </Button>
                            </Link>
                            <Badge
                                className={cn(
                                    getStatusColor(treatment?.status),
                                    "px-2 py-1 text-xs font-semibold flex items-center gap-1"
                                )}
                            >
                                {getStatusIcon(treatment?.status)}
                                {treatment?.status || "Unknown"}
                            </Badge>
                        </div>
                        <div className="text-center">
                            <h1 className="text-lg font-bold text-gray-900">
                                {treatment?.service?.name ||
                                    treatment?.name ||
                                    "Treatment Details"}
                            </h1>
                            <p className="text-gray-600 text-xs">
                                Treatment ID: #{treatment?.id || "N/A"}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Treatment Date
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {treatment?.created_at
                                    ? new Date(
                                          treatment.created_at
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="flex-1">
                            <Link href={route("patient.treatments.index")}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 hover:bg-gray-50"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Treatments
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {treatment?.service?.name ||
                                    treatment?.name ||
                                    "Treatment Details"}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Treatment ID: #{treatment?.id || "N/A"}
                            </p>
                        </div>
                        <div className="flex-1 flex justify-end items-center gap-3">
                            <Badge
                                className={cn(
                                    getStatusColor(treatment?.status),
                                    "px-3 py-1 text-sm font-semibold flex items-center gap-2"
                                )}
                            >
                                {getStatusIcon(treatment?.status)}
                                {treatment?.status || "Unknown"}
                            </Badge>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">
                                    Treatment Date
                                </p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {treatment?.created_at
                                        ? new Date(
                                              treatment.created_at
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Placeholder Notice */}
                {isPlaceholder && (
                    <div className="mb-4 sm:mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-3 sm:p-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-orange-900 text-sm sm:text-base">
                                    Treatment Not Available
                                </h3>
                                <p className="text-orange-800 text-xs sm:text-sm">
                                    This treatment record could not be found.
                                    Please contact your clinic for more
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TOP SECTION: Two Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Left Column - Main Treatment Info */}
                    <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">
                        {/* Treatment Overview Card */}
                        <Card className="bg-white border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 p-3 sm:p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                Treatment Overview
                                            </h3>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Service and cost information
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 md:p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Service Info */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                                Service Details
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                                <p className="font-bold text-gray-900 text-base sm:text-lg">
                                                    {treatment?.service?.name ||
                                                        treatment?.name ||
                                                        "N/A"}
                                                </p>
                                                {treatment?.service
                                                    ?.description && (
                                                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                                                        {
                                                            treatment.service
                                                                .description
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {treatment?.cost && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                                    Cost
                                                </h4>
                                                <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                                                                ₱
                                                                {treatment.cost.toLocaleString()}
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                Total cost
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timeline Info */}
                                    <div className="space-y-3 sm:space-y-4">
                                        <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                            Timeline
                                        </h4>
                                        <div className="space-y-2 sm:space-y-3">
                                            {treatment?.start_date && (
                                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            Start Date
                                                        </p>
                                                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                            {new Date(
                                                                treatment.start_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {treatment?.end_date && (
                                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            End Date
                                                        </p>
                                                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                            {new Date(
                                                                treatment.end_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {treatment?.estimated_duration_minutes && (
                                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-orange-50 rounded-lg">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            Duration
                                                        </p>
                                                        <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                            {Math.floor(
                                                                treatment.estimated_duration_minutes /
                                                                    60
                                                            )}
                                                            h{" "}
                                                            {treatment.estimated_duration_minutes %
                                                                60}
                                                            m
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Medical Information Card - Fixed Height */}
                        <Card className="bg-white border-0 shadow-lg flex-1">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-3 sm:p-4 md:p-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                            Medical Information
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            Diagnosis, outcome, and
                                            recommendations
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent
                                className="p-3 sm:p-4 md:p-6 overflow-y-auto"
                                style={{ maxHeight: "600px" }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {/* Diagnosis & Outcome */}
                                    <div className="space-y-3 sm:space-y-4">
                                        {treatment?.diagnosis && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                                    Diagnosis
                                                </h4>
                                                <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                                        </div>
                                                        <p className="text-gray-900 font-medium text-xs sm:text-sm">
                                                            {
                                                                treatment.diagnosis
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {treatment?.outcome && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                                    Outcome
                                                </h4>
                                                <div className="bg-emerald-50 rounded-lg p-3 sm:p-4">
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                            <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                                                        </div>
                                                        <p className="text-gray-900 font-medium capitalize text-xs sm:text-sm">
                                                            {treatment.outcome}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Next Appointment & Recommendations */}
                                    <div className="space-y-3 sm:space-y-4">
                                        {treatment?.next_appointment_date && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                                    Next Appointment
                                                </h4>
                                                <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                            <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                                {new Date(
                                                                    treatment.next_appointment_date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                Scheduled
                                                                follow-up
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {treatment?.recommendations && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                                                    Recommendations
                                                </h4>
                                                <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                                                        </div>
                                                        <p className="text-gray-900 text-xs sm:text-sm">
                                                            {
                                                                treatment.recommendations
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Treatment Notes */}
                                {treatment?.notes && (
                                    <div className="mt-4 sm:mt-6">
                                        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                                            Treatment Notes
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                                            <p className="text-gray-900 whitespace-pre-wrap text-xs sm:text-sm">
                                                {treatment.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Sidebar Info */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Clinic Information Card */}
                        <Card className="bg-white border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 p-3 sm:p-4 md:p-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                            Clinic
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            Healthcare provider
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 md:p-6">
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="text-center">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl mx-auto mb-2 sm:mb-3 overflow-hidden border-2 border-gray-200 shadow-sm">
                                            <img
                                                src={
                                                    treatment?.clinic
                                                        ?.logo_url ||
                                                    "/images/clinic-logo.png"
                                                }
                                                alt={`${
                                                    treatment?.clinic?.name ||
                                                    "Clinic"
                                                } Logo`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "/images/clinic-logo.png";
                                                }}
                                            />
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">
                                            {treatment?.clinic?.name ||
                                                "Clinic Name"}
                                        </h4>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            {treatment?.clinic
                                                ?.street_address ||
                                                "Address not available"}
                                        </p>
                                    </div>

                                    <div className="space-y-2 sm:space-y-3">
                                        {treatment?.clinic?.contact_number && (
                                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Phone
                                                    </p>
                                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                        {
                                                            treatment.clinic
                                                                .contact_number
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {treatment?.clinic?.email && (
                                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Email
                                                    </p>
                                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                        {treatment.clinic.email}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dentist Information Card */}
                        {treatment?.dentist && (
                            <Card className="bg-white border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-3 sm:p-4 md:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                Dentist
                                            </h3>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Healthcare professional
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-100 rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                                                <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">
                                                {getDentistDisplayName(
                                                    treatment.dentist
                                                )}
                                            </h4>
                                            {treatment.dentist.specialties &&
                                                treatment.dentist.specialties
                                                    .length > 0 && (
                                                    <p className="text-gray-600 text-xs sm:text-sm">
                                                        {treatment.dentist.specialties.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                )}
                                        </div>

                                        {treatment.dentist.phone_number && (
                                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                        Phone
                                                    </p>
                                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                        {
                                                            treatment.dentist
                                                                .phone_number
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Related Appointment Card */}
                        {treatment?.appointment && (
                            <Card className="bg-white border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100 p-3 sm:p-4 md:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                Appointment
                                            </h3>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Related visit details
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Date
                                                </p>
                                                <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                    {new Date(
                                                        treatment.appointment.scheduled_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm text-gray-600">
                                                    Time
                                                </p>
                                                <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                    {new Date(
                                                        treatment.appointment.scheduled_at
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {treatment.appointment.reason && (
                                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                                    Reason
                                                </p>
                                                <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                    {
                                                        treatment.appointment
                                                            .reason
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {treatment.appointment.notes && (
                                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                                                    Notes
                                                </p>
                                                <p className="text-gray-900 text-xs sm:text-sm">
                                                    {
                                                        treatment.appointment
                                                            .notes
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                {/* BOTTOM SECTION: Full Width Cards */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Dental Chart Card */}
                    {treatment?.tooth_numbers &&
                        Array.isArray(treatment.tooth_numbers) &&
                        treatment.tooth_numbers.length > 0 && (
                            <Card className="bg-white border-0 shadow-lg overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100 p-3 sm:p-4 md:p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                                <svg
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                    Dental Chart
                                                </h3>
                                                <p className="text-gray-600 text-xs sm:text-sm">
                                                    Teeth involved in this
                                                    treatment
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-blue-500 text-white border-blue-600 px-3 py-1.5 text-sm font-semibold">
                                            {treatment.tooth_numbers.length}{" "}
                                            {treatment.tooth_numbers.length ===
                                            1
                                                ? "Tooth"
                                                : "Teeth"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                    {/* Simple indicator */}
                                    <p className="text-sm text-gray-600 mb-3 text-center">
                                        <span className="inline-flex items-center gap-1.5">
                                            <svg
                                                className="w-4 h-4 text-blue-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="font-medium">
                                                Blue highlighted teeth were
                                                treated
                                            </span>
                                        </span>
                                    </p>

                                    {/* Dental Chart */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <ImprovedDentalChart
                                            selectedTeeth={treatment.tooth_numbers.map(
                                                Number
                                            )}
                                            onToothSelect={() => {}}
                                            readOnly={true}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {/* Procedures Details Card */}
                    {treatment?.procedures_details &&
                        Array.isArray(treatment.procedures_details) &&
                        treatment.procedures_details.length > 0 && (
                            <Card className="bg-white border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-3 sm:p-4 md:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                Procedures Performed
                                            </h3>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Details of treatments provided
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                    <div className="space-y-3">
                                        {treatment.procedures_details.map(
                                            (procedure, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-indigo-50 rounded-lg p-3 sm:p-4 border border-indigo-100"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <span className="text-xs font-bold text-indigo-600">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            {typeof procedure ===
                                                            "string" ? (
                                                                <p className="text-gray-900 text-sm">
                                                                    {procedure}
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    {procedure.name && (
                                                                        <p className="font-semibold text-gray-900 text-sm mb-1">
                                                                            {
                                                                                procedure.name
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    {procedure.description && (
                                                                        <p className="text-gray-700 text-xs">
                                                                            {
                                                                                procedure.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {/* Follow-up Instructions Card */}
                    {treatment?.follow_up_notes && (
                        <Card className="bg-white border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-100 p-3 sm:p-4 md:p-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                            Follow-up Instructions
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">
                                            Important care instructions for you
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 md:p-6">
                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                    <p className="text-gray-900 text-sm whitespace-pre-wrap leading-relaxed">
                                        {treatment.follow_up_notes}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Images Gallery Card */}
                    {treatment?.images &&
                        Array.isArray(treatment.images) &&
                        treatment.images.length > 0 && (
                            <Card className="bg-white border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 p-3 sm:p-4 md:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                Treatment Images
                                            </h3>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Before and after photos
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        {treatment.images.map(
                                            (image, index) => (
                                                <div
                                                    key={index}
                                                    className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 cursor-pointer group"
                                                >
                                                    <img
                                                        src={
                                                            typeof image ===
                                                            "string"
                                                                ? image
                                                                : image.url
                                                        }
                                                        alt={`Treatment image ${
                                                            index + 1
                                                        }`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "/images/placeholder-image.png";
                                                        }}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {/* Prescriptions Card */}
                    {treatment?.prescriptions &&
                        Array.isArray(treatment.prescriptions) &&
                        treatment.prescriptions.length > 0 && (
                            <Card className="bg-white border-0 shadow-lg">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 p-3 sm:p-4 md:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                Prescriptions
                                            </h3>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Medications and instructions
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3 sm:p-4 md:p-6">
                                    <div className="space-y-3 sm:space-y-4">
                                        {treatment.prescriptions.map(
                                            (prescription, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100"
                                                >
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <Pill className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                                {prescription.medication ||
                                                                    prescription.name ||
                                                                    `Prescription ${
                                                                        index +
                                                                        1
                                                                    }`}
                                                            </h4>
                                                            {prescription.dosage && (
                                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                                    <span className="font-medium">
                                                                        Dosage:
                                                                    </span>{" "}
                                                                    {
                                                                        prescription.dosage
                                                                    }
                                                                </p>
                                                            )}
                                                            {prescription.instructions && (
                                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                                    <span className="font-medium">
                                                                        Instructions:
                                                                    </span>{" "}
                                                                    {
                                                                        prescription.instructions
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>
            </main>
        </div>
    );
}
