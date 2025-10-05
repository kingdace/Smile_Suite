import React, { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-details-title"
            aria-describedby="appointment-details-description"
        >
            <div
                className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-2xl w-[95vw] sm:w-full relative mx-2 sm:mx-4 max-h-[85vh] overflow-y-auto"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#d1d5db #f3f4f6",
                }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-2 hover:bg-gray-100"
                    onClick={onClose}
                    aria-label="Close appointment details modal"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Compact Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2
                            id="appointment-details-title"
                            className="text-xl font-bold text-gray-900"
                        >
                            Appointment Details
                        </h2>
                        <p
                            id="appointment-details-description"
                            className="text-gray-500 text-sm"
                        >
                            Complete information about your appointment
                        </p>
                    </div>
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
                        {/* Compact Status and Basic Info */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        {getStatusIcon(
                                            appointment.status?.name
                                        )}
                                    </div>
                                    <div>
                                        <Badge
                                            className={cn(
                                                getStatusColor(
                                                    appointment.status?.name
                                                ),
                                                "text-xs font-semibold px-3 py-1"
                                            )}
                                        >
                                            {appointment.status?.name ||
                                                "Unknown"}
                                        </Badge>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Status
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">
                                        ID
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                        #{appointment.id}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {appointment.clinic?.name ||
                                        "Dental Clinic"}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {appointment.service?.name ||
                                        "General Checkup"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                        <span className="text-xs font-semibold text-gray-700">
                                            Date
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900">
                                        {new Date(
                                            appointment.scheduled_at
                                        ).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-green-600" />
                                        <span className="text-xs font-semibold text-gray-700">
                                            Time
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900">
                                        {new Date(
                                            appointment.scheduled_at
                                        ).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Compact Clinic Information */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">
                                        Clinic Information
                                    </h4>
                                    <p className="text-gray-500 text-sm">
                                        Complete clinic details
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Building2 className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-semibold text-gray-700">
                                                Clinic Name
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900 font-medium">
                                            {appointment.clinic?.name ||
                                                "Clinic Name"}
                                        </p>
                                    </div>

                                    {appointment.clinic?.contact_number && (
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Phone className="w-4 h-4 text-green-600" />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    Phone
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-900">
                                                {
                                                    appointment.clinic
                                                        .contact_number
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {appointment.clinic?.email && (
                                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Mail className="w-4 h-4 text-purple-600" />
                                                <span className="text-xs font-semibold text-gray-700">
                                                    Email
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-900">
                                                {appointment.clinic.email}
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className="w-4 h-4 text-orange-600" />
                                            <span className="text-xs font-semibold text-gray-700">
                                                Address
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-900">
                                            {appointment.clinic
                                                ?.street_address ||
                                                "Address not available"}
                                        </p>
                                    </div>
                                </div>
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
