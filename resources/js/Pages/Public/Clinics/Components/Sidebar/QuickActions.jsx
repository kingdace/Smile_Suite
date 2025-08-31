import React from "react";
import {
    Calendar,
    Star,
    Phone,
    Mail,
    MapPin,
    Clock,
    Users,
    Award,
} from "lucide-react";

export default function QuickActions({ onBookAppointment, clinic }) {
    // Safety check for clinic data
    if (!clinic) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Quick Actions
                </h3>
                <p className="text-gray-500">
                    Clinic information not available.
                </p>
            </div>
        );
    }

    const handleCall = () => {
        if (clinic.phone) {
            window.open(`tel:${clinic.phone}`, "_self");
        }
    };

    const handleEmail = () => {
        if (clinic.email) {
            window.open(`mailto:${clinic.email}`, "_self");
        }
    };

    const handleGetDirections = () => {
        if (clinic.address) {
            const encodedAddress = encodeURIComponent(clinic.address);
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
                "_blank"
            );
        }
    };

    const getCurrentStatus = () => {
        try {
            if (!clinic.operating_hours)
                return {
                    status: "unknown",
                    text: "Hours not available",
                    color: "text-gray-500",
                };

            const now = new Date();
            const currentDay = now
                .toLocaleDateString("en-US", {
                    weekday: "long",
                })
                .toLowerCase();
            const currentTime = now.getHours() * 100 + now.getMinutes();

            const todayHours = clinic.operating_hours[currentDay];
            if (!todayHours || !todayHours.open || !todayHours.close) {
                return {
                    status: "closed",
                    text: "Closed today",
                    color: "text-red-500",
                };
            }

            const openTime = parseInt(todayHours.open.replace(":", ""));
            const closeTime = parseInt(todayHours.close.replace(":", ""));

            if (currentTime >= openTime && currentTime <= closeTime) {
                return {
                    status: "open",
                    text: "Open now",
                    color: "text-green-500",
                };
            } else if (currentTime < openTime) {
                return {
                    status: "closed",
                    text: `Opens at ${todayHours.open}`,
                    color: "text-orange-500",
                };
            } else {
                return {
                    status: "closed",
                    text: "Closed for today",
                    color: "text-red-500",
                };
            }
        } catch (error) {
            console.error("Error getting clinic status:", error);
            return {
                status: "unknown",
                text: "Status unavailable",
                color: "text-gray-500",
            };
        }
    };

    const currentStatus = getCurrentStatus();

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Quick Actions
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Get started with your visit
                </p>
            </div>

            {/* Status Indicator */}
            <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Status:</span>
                    </div>
                    <div
                        className={`flex items-center gap-1.5 ${currentStatus.color}`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${
                                currentStatus.status === "open"
                                    ? "bg-green-500"
                                    : currentStatus.status === "closed"
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                            }`}
                        ></div>
                        <span className="text-sm font-medium">
                            {currentStatus.text}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 space-y-4">
                {/* Primary Action - Book Appointment */}
                <button
                    onClick={onBookAppointment}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-105 hover:shadow-lg shadow-md"
                >
                    <Calendar className="w-6 h-6" />
                    Book Appointment
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={handleCall}
                        disabled={!clinic.phone}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Phone className="w-5 h-5" />
                        <span className="text-sm font-medium">Call</span>
                    </button>

                    <button
                        onClick={handleEmail}
                        disabled={!clinic.email}
                        className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Mail className="w-5 h-5" />
                        <span className="text-sm font-medium">Email</span>
                    </button>
                </div>

                {/* Get Directions */}
                <button
                    onClick={handleGetDirections}
                    disabled={!clinic.address}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Get Directions</span>
                </button>

                {/* View Reviews */}
                <button
                    onClick={() => {
                        const reviewsSection =
                            document.getElementById("reviews-section");
                        if (reviewsSection) {
                            reviewsSection.scrollIntoView({
                                behavior: "smooth",
                            });
                        }
                    }}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl transition-all duration-200 hover:scale-105"
                >
                    <Star className="w-5 h-5" />
                    <span className="font-medium">View Reviews</span>
                </button>
            </div>

            {/* Quick Stats */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-center">
                    {clinic.staff &&
                        Array.isArray(clinic.staff) &&
                        clinic.staff.length > 0 && (
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {clinic.staff.length}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Staff Members
                                </div>
                            </div>
                        )}

                    {clinic.average_rating &&
                        typeof clinic.average_rating === "number" &&
                        !isNaN(clinic.average_rating) && (
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {clinic.average_rating.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-600">
                                    Rating
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
