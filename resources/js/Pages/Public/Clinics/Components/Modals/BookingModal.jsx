import React from "react";
import { X, Calendar, Clock, FileText, MessageSquare } from "lucide-react";

export default function BookingModal({
    showModal,
    onClose,
    onSubmit,
    data,
    setData,
    errors,
    successMessage,
    processing,
}) {
    const REASONS = [
        { id: 1, label: "General Check-up" },
        { id: 2, label: "Cleaning" },
        { id: 3, label: "Cavity Filling" },
        { id: 4, label: "Root Canal" },
        { id: 5, label: "Tooth Extraction" },
        { id: 6, label: "Braces Consultation" },
        { id: 7, label: "Emergency" },
        { id: 8, label: "Other" },
    ];

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative mx-4">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Book Appointment
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    {successMessage && (
                        <div className="mb-2 p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm border border-green-200">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date
                        </label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={data.date}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setData("date", e.target.value)}
                            required
                        />
                        {errors.date && (
                            <div className="text-red-600 text-sm mt-1">
                                {errors.date}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Time
                        </label>
                        <input
                            type="time"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={data.time}
                            onChange={(e) => setData("time", e.target.value)}
                            required
                        />
                        {errors.time && (
                            <div className="text-red-600 text-sm mt-1">
                                {errors.time}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Reason for Visit
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            required
                        >
                            <option value="">Select a reason</option>
                            {REASONS.map((r) => (
                                <option key={r.id} value={r.label}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        {errors.reason && (
                            <div className="text-red-600 text-sm mt-1">
                                {errors.reason}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Notes (optional)
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                            placeholder="Any additional information or special requests..."
                        />
                        {errors.notes && (
                            <div className="text-red-600 text-sm mt-1">
                                {errors.notes}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 font-medium"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={processing}
                        >
                            {processing ? "Booking..." : "Book Appointment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
