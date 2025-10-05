import React, { useState } from "react";
import {
    X,
    AlertTriangle,
    Calendar,
    Clock,
    FileText,
    User,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

export default function AppointmentCancellationModal({
    showModal,
    onClose,
    appointment,
    onConfirm,
    loading = false,
}) {
    const [cancellationReason, setCancellationReason] = useState("");
    const [error, setError] = useState("");

    if (!showModal || !appointment) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!cancellationReason.trim()) {
            setError("Please provide a reason for cancellation.");
            return;
        }

        onConfirm(cancellationReason);
    };

    const handleClose = () => {
        setCancellationReason("");
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div
                className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-2xl w-[95vw] sm:w-full relative mx-2 sm:mx-4 max-h-[85vh] overflow-y-auto"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#d1d5db #f3f4f6",
                }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full p-2 hover:bg-gray-100"
                    onClick={handleClose}
                    aria-label="Close cancellation modal"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Compact Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Cancel Appointment
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Are you sure you want to cancel this appointment?
                        </p>
                    </div>
                </div>

                {/* Compact Appointment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Appointment Details
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Current appointment information
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-semibold text-gray-700">
                                    Clinic
                                </span>
                            </div>
                            <p className="text-sm text-gray-900">
                                {appointment.clinic?.name || "Clinic"}
                            </p>
                        </div>
                        {appointment.reason && (
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <div className="flex items-center gap-2 mb-1">
                                    <FileText className="w-4 h-4 text-orange-600" />
                                    <span className="text-xs font-semibold text-gray-700">
                                        Reason
                                    </span>
                                </div>
                                <p className="text-sm text-gray-900">
                                    {appointment.reason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Cancellation *
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                            value={cancellationReason}
                            onChange={(e) =>
                                setCancellationReason(e.target.value)
                            }
                            rows={3}
                            placeholder="Please provide a reason for cancelling this appointment..."
                            required
                        />
                        {error && (
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        )}
                    </div>

                    {/* Compact Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                            </div>
                            <h4 className="font-medium text-red-900">
                                Important Notice
                            </h4>
                        </div>
                        <ul className="text-sm text-red-800 space-y-1">
                            <li>• This action cannot be undone</li>
                            <li>• You will need to book a new appointment</li>
                            <li>• Cancellation policies may apply</li>
                            <li>
                                • The clinic will be notified of this
                                cancellation
                            </li>
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-6 py-2"
                        >
                            Keep Appointment
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Cancelling...
                                </>
                            ) : (
                                "Cancel Appointment"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
