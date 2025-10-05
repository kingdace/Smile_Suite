import { Head, Link } from "@inertiajs/react";
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
    Image,
    Star,
    AlertCircle,
    CalendarDays,
    Timer,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import SiteHeader from "@/Components/SiteHeader";

export default function PatientTreatmentShow({
    auth,
    user,
    treatment,
    isPlaceholder = false,
}) {
    // Debug: Log the treatment data
    console.log('PatientTreatmentShow Debug:', {
        user,
        treatment,
        isPlaceholder,
        treatmentData: treatment,
    });
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "scheduled":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "not_found":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "in_progress":
                return <Clock className="w-5 h-5 text-blue-500" />;
            case "scheduled":
                return <Calendar className="w-5 h-5 text-yellow-500" />;
            case "cancelled":
                return <FileText className="w-5 h-5 text-red-500" />;
            case "not_found":
                return <FileText className="w-5 h-5 text-orange-500" />;
            default:
                return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <Head
                title={`Treatment Details - ${
                    treatment?.service?.name || "Treatment"
                }`}
            />

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {treatment?.service?.name ||
                                    treatment?.name ||
                                    "Treatment Details"}
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">
                                Treatment information and history
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-200/50 shadow-lg">
                                <span className="text-sm font-bold text-gray-700">
                                    {new Date().toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <Link href={route("patient.treatments.index")}>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Treatments
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Placeholder Notice */}
                {isPlaceholder && (
                    <div className="mb-6 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 backdrop-blur-sm border border-orange-200/50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-orange-900">
                                    Treatment Not Available
                                </h3>
                                <p className="text-orange-800 mt-1">
                                    This treatment record could not be found or
                                    may not be available yet. Please contact
                                    your clinic for more information.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Treatment Status Card */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
                    <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Treatment Status
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Current status and treatment date
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                {getStatusIcon(treatment?.status)}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Stethoscope className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900">
                                        Treatment Status
                                    </h4>
                                    <Badge
                                        className={`${getStatusColor(
                                            treatment?.status
                                        )} px-3 py-1 text-sm font-semibold`}
                                    >
                                        {treatment?.status || "Unknown"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    Treatment Date
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                    {new Date(
                                        treatment?.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Treatment Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Clinic Information */}
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Clinic Information
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Healthcare provider details
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                    <h4 className="font-bold text-gray-900 text-lg">
                                        {treatment?.clinic?.name}
                                    </h4>
                                    <p className="text-gray-600 mt-1">
                                        {treatment?.clinic?.address}
                                    </p>
                                </div>
                                {treatment?.clinic?.phone && (
                                    <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <span className="text-green-600">
                                                    📞
                                                </span>
                                            </div>
                                            <span className="text-gray-700 font-medium">
                                                {treatment.clinic.phone}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {treatment?.clinic?.email && (
                                    <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-blue-600">
                                                    ✉️
                                                </span>
                                            </div>
                                            <span className="text-gray-700 font-medium">
                                                {treatment.clinic.email}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dentist Information */}
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 border-b border-green-100/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Dentist Information
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Healthcare professional details
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-green-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {treatment?.dentist ? (
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                        <h4 className="font-bold text-gray-900 text-lg">
                                            {treatment.dentist.name}
                                        </h4>
                                        {treatment.dentist.specialization && (
                                            <p className="text-gray-600 mt-1">
                                                {
                                                    treatment.dentist
                                                        .specialization
                                                }
                                            </p>
                                        )}
                                    </div>
                                    {treatment.dentist.phone && (
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-green-600">
                                                        📞
                                                    </span>
                                                </div>
                                                <span className="text-gray-700 font-medium">
                                                    {treatment.dentist.phone}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-medium">
                                        No dentist assigned
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Appointment Details */}
                {treatment?.appointment && (
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
                        <CardHeader className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-b border-purple-100/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Related Appointment
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        Appointment details and notes
                                    </p>
                                </div>
                                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                        Appointment Details
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Date
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(
                                                            treatment.appointment.scheduled_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Clock className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Time
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(
                                                            treatment.appointment.scheduled_at
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {treatment.appointment.reason && (
                                            <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Reason
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {
                                                            treatment
                                                                .appointment
                                                                .reason
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {treatment.appointment.notes && (
                                    <div>
                                        <h5 className="font-bold text-gray-900 mb-4 text-lg">
                                            Appointment Notes
                                        </h5>
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <p className="text-gray-700">
                                                {treatment.appointment.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Treatment Details */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-6">
                    <CardHeader className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 border-b border-orange-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Treatment Details
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Service information and treatment notes
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-orange-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Service Information */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                    Service Information
                                </h4>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                        <p className="text-sm text-gray-500">
                                            Service
                                        </p>
                                        <p className="font-bold text-gray-900 text-lg">
                                            {treatment?.service?.name || treatment?.name || "N/A"}
                                        </p>
                                    </div>
                                    {treatment?.service?.description && (
                                        <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                            <p className="text-sm text-gray-500">
                                                Description
                                            </p>
                                            <p className="text-gray-700">
                                                {treatment.service.description}
                                            </p>
                                        </div>
                                    )}
                                    {treatment?.cost && (
                                        <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Cost
                                                    </p>
                                                    <p className="font-bold text-green-600 text-lg">
                                                        ₱{treatment.cost.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Treatment Timeline */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                    Treatment Timeline
                                </h4>
                                <div className="space-y-3">
                                    {treatment?.start_date && (
                                        <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl border border-blue-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Start Date
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(treatment.start_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {treatment?.end_date && (
                                        <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl border border-purple-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        End Date
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(treatment.end_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {treatment?.estimated_duration_minutes && (
                                        <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/50 rounded-xl border border-orange-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <Timer className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Duration
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {Math.floor(treatment.estimated_duration_minutes / 60)}h {treatment.estimated_duration_minutes % 60}m
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Medical Information */}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                    Medical Information
                                </h4>
                                <div className="space-y-3">
                                    {treatment?.diagnosis && (
                                        <div className="bg-gradient-to-r from-red-50/50 to-rose-50/50 rounded-xl border border-red-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                    <Heart className="w-4 h-4 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Diagnosis
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {treatment.diagnosis}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {treatment?.outcome && (
                                        <div className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-xl border border-emerald-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <Activity className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Outcome
                                                    </p>
                                                    <p className="font-semibold text-gray-900 capitalize">
                                                        {treatment.outcome}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {treatment?.next_appointment_date && (
                                        <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-xl border border-indigo-100/50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                    <CalendarDays className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Next Appointment
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {new Date(treatment.next_appointment_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Treatment Notes */}
                        {treatment?.notes && (
                            <div className="mt-6">
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                    Treatment Notes
                                </h4>
                                <div className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {treatment.notes}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {treatment?.recommendations && (
                            <div className="mt-6">
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                    Recommendations
                                </h4>
                                <div className="bg-gradient-to-r from-yellow-50/50 to-amber-50/50 rounded-xl border border-yellow-100/50 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <Star className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap">
                                            {treatment.recommendations}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Prescriptions */}
                        {treatment?.prescriptions && Array.isArray(treatment.prescriptions) && treatment.prescriptions.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                    Prescriptions
                                </h4>
                                <div className="space-y-3">
                                    {treatment.prescriptions.map((prescription, index) => (
                                        <div key={index} className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl border border-green-100/50 p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Pill className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {prescription.medication || prescription.name || `Prescription ${index + 1}`}
                                                    </p>
                                                    {prescription.dosage && (
                                                        <p className="text-sm text-gray-600">
                                                            Dosage: {prescription.dosage}
                                                        </p>
                                                    )}
                                                    {prescription.instructions && (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Instructions: {prescription.instructions}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
