import React from "react";
import {
    X,
    Calendar,
    Clock,
    FileText,
    MessageSquare,
    AlertCircle,
    Stethoscope,
} from "lucide-react";

export default function BookingModal({
    showModal,
    onClose,
    onSubmit,
    data,
    setData,
    errors,
    processing,
    clinic,
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

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    // Get maximum date (1 year from today)
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        return maxDate.toISOString().split("T")[0];
    };

    if (!showModal) return null;

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
                    onClick={onClose}
                    aria-label="Close booking modal"
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
                            Book Appointment
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Schedule your visit at {clinic?.name}
                        </p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Preferred Date *
                        </label>
                        <input
                            type="date"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                errors.date
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={data.date}
                            min={getMinDate()}
                            max={getMaxDate()}
                            onChange={(e) => setData("date", e.target.value)}
                            required
                        />
                        {errors.date && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.date}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Preferred Time *
                        </label>
                        <input
                            type="time"
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                errors.time
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={data.time}
                            onChange={(e) => setData("time", e.target.value)}
                            required
                        />
                        {errors.time && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.time}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            We'll do our best to accommodate your preferred time
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4" />
                            Service Needed
                        </label>
                        <select
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                errors.service_id
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={data.service_id}
                            onChange={(e) => {
                                setData("service_id", e.target.value);
                                // Auto-fill reason if service is selected
                                if (e.target.value) {
                                    const selectedService =
                                        clinic?.services?.find(
                                            (s) => s.id == e.target.value
                                        );
                                    if (selectedService) {
                                        setData("reason", selectedService.name);
                                    }
                                }
                            }}
                        >
                            <option value="">
                                Select a service (optional)
                            </option>
                            {clinic?.services?.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}{" "}
                                    {service.price ? `- ₱${service.price}` : ""}
                                </option>
                            ))}
                        </select>
                        {errors.service_id && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.service_id}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Optional: Help us understand what service you need
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Reason for Visit {!data.service_id ? "*" : ""}
                        </label>
                        <select
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                errors.reason
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            required={!data.service_id}
                        >
                            <option value="">Select a reason</option>
                            {REASONS.map((r) => (
                                <option key={r.id} value={r.label}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                        {errors.reason && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.reason}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Additional Notes
                        </label>
                        <textarea
                            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                                errors.notes
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300"
                            }`}
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            rows={3}
                            placeholder="Any additional information, special requests, or concerns..."
                        />
                        {errors.notes && (
                            <div className="text-red-600 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.notes}
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Optional: Help us better prepare for your visit
                        </p>
                    </div>

                    {/* Compact Important Information */}
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
                                • This is a booking request that requires clinic
                                approval
                            </li>
                            <li>
                                • You'll receive a confirmation email once
                                approved
                            </li>
                            <li>
                                • The clinic will contact you to confirm the
                                exact time and assigned dentist
                            </li>
                            <li>
                                • If you selected a service, the clinic will
                                confirm the specific service and pricing
                            </li>
                            <li>
                                • Please arrive 10 minutes before your scheduled
                                time
                            </li>
                        </ul>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 font-medium"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </>
                            ) : (
                                "Submit Booking Request"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
