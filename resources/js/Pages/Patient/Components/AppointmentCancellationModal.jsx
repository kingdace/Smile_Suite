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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative mx-4 max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={handleClose}
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Cancel Appointment
                    </h2>
                    <p className="text-gray-600">
                        Are you sure you want to cancel this appointment?
                    </p>
                </div>

                {/* Appointment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Appointment Details
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
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
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                                {new Date(
                                    appointment.scheduled_at
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                                {appointment.clinic?.name || "Clinic"}
                            </span>
                        </div>
                        {appointment.reason && (
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">
                                    {appointment.reason}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-900 mb-2">
                            Important Notice
                        </h4>
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

                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Keep Appointment
                        </Button>
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white"
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
