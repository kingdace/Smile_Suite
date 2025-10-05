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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div
                className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-2xl w-[95vw] sm:w-full relative mx-2 sm:mx-4 max-h-[85vh] overflow-y-auto"
                style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#d1d5db #f3f4f6",
                }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-2 hover:bg-gray-100"
                    onClick={handleClose}
                    aria-label="Close rescheduling modal"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>

                {/* Compact Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Reschedule Appointment
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Select a new date and time for your appointment
                        </p>
                    </div>
                </div>

                {/* Compact Current Appointment Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Current Appointment
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Your existing appointment details
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

                    {/* Compact Information Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-blue-600" />
                            </div>
                            <h4 className="font-medium text-blue-900">
                                Important Information
                            </h4>
                        </div>
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

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                            className="px-6 py-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
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
