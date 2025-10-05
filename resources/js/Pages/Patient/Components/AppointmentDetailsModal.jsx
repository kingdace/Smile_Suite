import React from "react";
import {
    X,
    Calendar,
    Clock,
    User,
    Building2,
    FileText,
    Stethoscope,
    Phone,
    Mail,
    MapPin,
    AlertCircle,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

export default function AppointmentDetailsModal({
    showModal,
    onClose,
    appointment,
    loading = false,
}) {
    if (!showModal || !appointment) return null;

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case "confirmed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "completed":
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-details-title"
            aria-describedby="appointment-details-description"
        >
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 max-w-2xl w-[95vw] sm:w-full relative mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
                    onClick={onClose}
                    aria-label="Close appointment details modal"
                >
                    <X className="w-6 h-6" aria-hidden="true" />
                </button>

                <div className="text-center mb-6">
                    <h2
                        id="appointment-details-title"
                        className="text-2xl font-bold text-gray-900 mb-2"
                    >
                        Appointment Details
                    </h2>
                    <p
                        id="appointment-details-description"
                        className="text-gray-600"
                    >
                        View your appointment information
                    </p>
                </div>

                {loading ? (
                    <div
                        className="flex items-center justify-center py-8"
                        role="status"
                        aria-live="polite"
                    >
                        <div
                            className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"
                            aria-hidden="true"
                        ></div>
                        <span className="ml-2 text-gray-600">
                            Loading appointment details...
                        </span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Status and Basic Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(appointment.status?.name)}
                                    <Badge
                                        className={getStatusColor(
                                            appointment.status?.name
                                        )}
                                    >
                                        {appointment.status?.name || "Unknown"}
                                    </Badge>
                                </div>
                                <div className="text-sm text-gray-500">
                                    ID: #{appointment.id}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {appointment.clinic?.name || "Clinic"}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-gray-600">
                                        {new Date(
                                            appointment.scheduled_at
                                        ).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-gray-600">
                                        {new Date(
                                            appointment.scheduled_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Clinic Information */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Clinic Information
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                        {appointment.clinic?.name ||
                                            "Clinic Name"}
                                    </span>
                                </div>
                                {appointment.clinic?.contact_number && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {appointment.clinic.contact_number}
                                        </span>
                                    </div>
                                )}
                                {appointment.clinic?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {appointment.clinic.email}
                                        </span>
                                    </div>
                                )}
                                {appointment.clinic?.street_address && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {appointment.clinic.street_address}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Appointment Details */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Appointment Details
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Reason for Visit
                                    </label>
                                    <p className="text-sm text-gray-900">
                                        {appointment.reason ||
                                            "No reason specified"}
                                    </p>
                                </div>

                                {appointment.service && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Service
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {appointment.service.name}
                                            {appointment.service.price && (
                                                <span className="ml-2 text-green-600 font-medium">
                                                    - ₱
                                                    {appointment.service.price}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}

                                {appointment.assignedDentist && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Assigned Dentist
                                        </label>
                                        <p className="text-sm text-gray-900 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {appointment.assignedDentist.name}
                                        </p>
                                    </div>
                                )}

                                {appointment.type && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Appointment Type
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {appointment.type.name}
                                        </p>
                                    </div>
                                )}

                                {appointment.notes && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">
                                            Notes
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {appointment.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Important Information */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Important Information
                            </h4>
                            <ul className="text-sm text-amber-800 space-y-1">
                                <li>
                                    • Please arrive 10 minutes before your
                                    scheduled time
                                </li>
                                <li>
                                    • Bring a valid ID and any relevant medical
                                    records
                                </li>
                                <li>
                                    • Contact the clinic if you need to make any
                                    changes
                                </li>
                                <li>• Cancellation policies may apply</li>
                            </ul>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
