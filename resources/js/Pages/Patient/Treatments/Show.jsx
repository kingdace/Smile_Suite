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
import { cn } from "@/lib/utils";

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
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Compact Page Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
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
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {treatment?.service?.name ||
                                        treatment?.name ||
                                        "Treatment Details"}
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Treatment ID: #{treatment?.id || "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
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
                    <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-orange-900">
                                    Treatment Not Available
                                </h3>
                                <p className="text-orange-800 text-sm">
                                    This treatment record could not be found.
                                    Please contact your clinic for more
                                    information.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Treatment Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Treatment Overview Card */}
                        <Card className="bg-white border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Stethoscope className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Treatment Overview
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Service and cost information
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Service Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">
                                                Service Details
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="font-bold text-gray-900 text-lg">
                                                    {treatment?.service?.name ||
                                                        treatment?.name ||
                                                        "N/A"}
                                                </p>
                                                {treatment?.service
                                                    ?.description && (
                                                    <p className="text-gray-600 text-sm mt-1">
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
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Cost
                                                </h4>
                                                <div className="bg-green-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <DollarSign className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-2xl font-bold text-green-600">
                                                                ₱
                                                                {treatment.cost.toLocaleString()}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Total cost
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Timeline Info */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900 mb-2">
                                            Timeline
                                        </h4>
                                        <div className="space-y-3">
                                            {treatment?.start_date && (
                                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Start Date
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(
                                                                treatment.start_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {treatment?.end_date && (
                                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            End Date
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            {new Date(
                                                                treatment.end_date
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {treatment?.estimated_duration_minutes && (
                                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                        <Timer className="w-4 h-4 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Duration
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
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

                        {/* Medical Information Card */}
                        <Card className="bg-white border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Medical Information
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Diagnosis, outcome, and
                                            recommendations
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Diagnosis & Outcome */}
                                    <div className="space-y-4">
                                        {treatment?.diagnosis && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Diagnosis
                                                </h4>
                                                <div className="bg-red-50 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                            <Heart className="w-4 h-4 text-red-600" />
                                                        </div>
                                                        <p className="text-gray-900 font-medium">
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
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Outcome
                                                </h4>
                                                <div className="bg-emerald-50 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                            <Activity className="w-4 h-4 text-emerald-600" />
                                                        </div>
                                                        <p className="text-gray-900 font-medium capitalize">
                                                            {treatment.outcome}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Next Appointment & Recommendations */}
                                    <div className="space-y-4">
                                        {treatment?.next_appointment_date && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Next Appointment
                                                </h4>
                                                <div className="bg-indigo-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                            <CalendarDays className="w-4 h-4 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {new Date(
                                                                    treatment.next_appointment_date
                                                                ).toLocaleDateString()}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
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
                                                <h4 className="font-semibold text-gray-900 mb-2">
                                                    Recommendations
                                                </h4>
                                                <div className="bg-yellow-50 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                            <Star className="w-4 h-4 text-yellow-600" />
                                                        </div>
                                                        <p className="text-gray-900 text-sm">
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
                                    <div className="mt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Treatment Notes
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900 whitespace-pre-wrap text-sm">
                                                {treatment.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Prescriptions Card */}
                        {treatment?.prescriptions &&
                            Array.isArray(treatment.prescriptions) &&
                            treatment.prescriptions.length > 0 && (
                                <Card className="bg-white border-0 shadow-lg">
                                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Pill className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Prescriptions
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Medications and instructions
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {treatment.prescriptions.map(
                                                (prescription, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-green-50 rounded-lg p-4 border border-green-100"
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                                <Pill className="w-4 h-4 text-green-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900">
                                                                    {prescription.medication ||
                                                                        prescription.name ||
                                                                        `Prescription ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                </h4>
                                                                {prescription.dosage && (
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        <span className="font-medium">
                                                                            Dosage:
                                                                        </span>{" "}
                                                                        {
                                                                            prescription.dosage
                                                                        }
                                                                    </p>
                                                                )}
                                                                {prescription.instructions && (
                                                                    <p className="text-sm text-gray-600 mt-1">
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

                    {/* Right Column - Sidebar Info */}
                    <div className="space-y-6">
                        {/* Clinic Information Card */}
                        <Card className="bg-white border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Clinic
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Healthcare provider
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-xl mx-auto mb-3 overflow-hidden border-2 border-gray-200 shadow-sm">
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
                                        <h4 className="font-bold text-gray-900 text-lg">
                                            {treatment?.clinic?.name ||
                                                "Clinic Name"}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {treatment?.clinic
                                                ?.street_address ||
                                                "Address not available"}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {treatment?.clinic?.contact_number && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Phone
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {
                                                            treatment.clinic
                                                                .contact_number
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {treatment?.clinic?.email && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Mail className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Email
                                                    </p>
                                                    <p className="font-semibold text-gray-900 text-sm">
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
                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <User className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Dentist
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Healthcare professional
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                                <User className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-lg">
                                                {treatment.dentist.name}
                                            </h4>
                                            {treatment.dentist.specialties &&
                                                treatment.dentist.specialties
                                                    .length > 0 && (
                                                    <p className="text-gray-600 text-sm">
                                                        {treatment.dentist.specialties.join(
                                                            ", "
                                                        )}
                                                    </p>
                                                )}
                                        </div>

                                        {treatment.dentist.phone_number && (
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <Phone className="w-4 h-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Phone
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
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
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Appointment
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Related visit details
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Date
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(
                                                        treatment.appointment.scheduled_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Time
                                                </p>
                                                <p className="font-semibold text-gray-900">
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
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Reason
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {
                                                        treatment.appointment
                                                            .reason
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {treatment.appointment.notes && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Notes
                                                </p>
                                                <p className="text-gray-900 text-sm">
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
            </main>
        </div>
    );
}
