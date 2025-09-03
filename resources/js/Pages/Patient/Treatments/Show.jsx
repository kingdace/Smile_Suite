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
        <div className="min-h-screen bg-gray-100">
            <Head
                title={`Treatment Details - ${
                    treatment?.service?.name || "Treatment"
                }`}
            />

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-6">
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

                {/* Placeholder Notice */}
                {isPlaceholder && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <FileText className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-orange-800">
                                    Treatment Not Available
                                </h3>
                                <p className="text-sm text-orange-700">
                                    This treatment record could not be found or
                                    may not be available yet. Please contact
                                    your clinic for more information.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Stethoscope className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {treatment?.service?.name ||
                                    treatment?.name ||
                                    "Treatment Details"}
                            </h1>
                            <p className="text-gray-600">
                                Treatment information and history
                            </p>
                        </div>
                    </div>
                </div>

                {/* Treatment Status Card */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {getStatusIcon(treatment?.status)}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Treatment Status
                                    </h3>
                                    <Badge
                                        className={getStatusColor(
                                            treatment?.status
                                        )}
                                    >
                                        {treatment?.status || "Unknown"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">
                                    Treatment Date
                                </p>
                                <p className="font-medium text-gray-900">
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
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Clinic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">
                                        {treatment?.clinic?.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {treatment?.clinic?.address}
                                    </p>
                                </div>
                                {treatment?.clinic?.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>📞</span>
                                        <span>{treatment.clinic.phone}</span>
                                    </div>
                                )}
                                {treatment?.clinic?.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>✉️</span>
                                        <span>{treatment.clinic.email}</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dentist Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-green-600" />
                                Dentist Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {treatment?.dentist ? (
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Dr. {treatment.dentist.name}
                                        </h4>
                                        {treatment.dentist.specialization && (
                                            <p className="text-sm text-gray-600">
                                                {
                                                    treatment.dentist
                                                        .specialization
                                                }
                                            </p>
                                        )}
                                    </div>
                                    {treatment.dentist.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>📞</span>
                                            <span>
                                                {treatment.dentist.phone}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500">
                                    No dentist assigned
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Appointment Details */}
                {treatment?.appointment && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-600" />
                                Related Appointment
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">
                                        Appointment Details
                                    </h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(
                                                    treatment.appointment.scheduled_at
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {new Date(
                                                    treatment.appointment.scheduled_at
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        {treatment.appointment.reason && (
                                            <div>
                                                <span className="font-medium">
                                                    Reason:{" "}
                                                </span>
                                                <span>
                                                    {
                                                        treatment.appointment
                                                            .reason
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {treatment.appointment.notes && (
                                    <div>
                                        <h5 className="font-medium text-gray-900 mb-2">
                                            Appointment Notes
                                        </h5>
                                        <p className="text-sm text-gray-600">
                                            {treatment.appointment.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Treatment Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-orange-600" />
                            Treatment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Service Information
                                </h4>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">
                                            Service:{" "}
                                        </span>
                                        <span>
                                            {treatment?.service?.name || "N/A"}
                                        </span>
                                    </div>
                                    {treatment?.service?.description && (
                                        <div>
                                            <span className="font-medium">
                                                Description:{" "}
                                            </span>
                                            <span>
                                                {treatment.service.description}
                                            </span>
                                        </div>
                                    )}
                                    {treatment?.cost && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="font-medium">
                                                Cost:{" "}
                                            </span>
                                            <span className="font-semibold text-green-600">
                                                ₱
                                                {treatment.cost.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {treatment?.notes && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">
                                        Treatment Notes
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {treatment.notes}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
