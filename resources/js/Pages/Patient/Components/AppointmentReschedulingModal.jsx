import React, { useState } from "react";
import { X, Calendar, Clock, FileText, User, AlertCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";

export default function AppointmentReschedulingModal({
    showModal,
    onClose,
    appointment,
    onConfirm,
    loading = false,
}) {
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!showModal || !appointment) return null;

    // Get minimum date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    // Get maximum date (3 months from now)
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate.toISOString().split("T")[0];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!newDate || !newTime) {
            setError("Please select both date and time.");
            return;
        }

        // Check if the new date is in the future
        const selectedDateTime = new Date(`${newDate} ${newTime}`);
        const now = new Date();

        if (selectedDateTime <= now) {
            setError("Please select a future date and time.");
            return;
        }

        onConfirm({
            new_date: newDate,
            new_time: newTime,
            reason: reason.trim() || null,
        });
    };

    const handleClose = () => {
        setNewDate("");
        setNewTime("");
        setReason("");
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
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Reschedule Appointment
                    </h2>
                    <p className="text-gray-600">
                        Select a new date and time for your appointment
                    </p>
                </div>

                {/* Current Appointment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                        Current Appointment
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Date *
                            </label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                value={newDate}
                                min={getMinDate()}
                                max={getMaxDate()}
                                onChange={(e) => setNewDate(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Time *
                            </label>
                            <input
                                type="time"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Rescheduling (Optional)
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                            placeholder="Please provide a reason for rescheduling this appointment..."
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Information Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                            Important Information
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>
                                • The clinic will be notified of your
                                rescheduling request
                            </li>
                            <li>
                                • Your new appointment time is subject to
                                availability
                            </li>
                            <li>
                                • You will receive confirmation once approved
                            </li>
                            <li>
                                • Please arrive 10 minutes before your new
                                scheduled time
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
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Rescheduling...
                                </>
                            ) : (
                                "Reschedule Appointment"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
