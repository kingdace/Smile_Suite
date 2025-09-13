import React from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function OperatingHours({ clinic }) {
    if (!clinic.operating_hours) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Operating Hours
                </h3>
                <p className="text-gray-500">
                    Operating hours information will appear here when available.
                </p>
            </div>
        );
    }

    const getCurrentStatus = () => {
        try {
            const now = new Date();
            const currentDay = now
                .toLocaleDateString("en-US", {
                    weekday: "long",
                })
                .toLowerCase();
            const currentTime = now.getHours() * 100 + now.getMinutes();

            const todayHours = clinic.operating_hours[currentDay];
            let openTime, closeTime;

            // Handle both array format [open, close] and object format {open, close}
            if (Array.isArray(todayHours) && todayHours.length === 2) {
                openTime = todayHours[0];
                closeTime = todayHours[1];
            } else if (todayHours && todayHours.open && todayHours.close) {
                openTime = todayHours.open;
                closeTime = todayHours.close;
            } else {
                // No valid hours data
                return {
                    status: "closed",
                    text: "Closed today",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    icon: AlertCircle,
                };
            }

            const openTimeInt = parseInt(openTime.replace(":", ""));
            const closeTimeInt = parseInt(closeTime.replace(":", ""));

            if (currentTime >= openTimeInt && currentTime <= closeTimeInt) {
                return {
                    status: "open",
                    text: "Open now",
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    icon: CheckCircle,
                };
            } else if (currentTime < openTimeInt) {
                return {
                    status: "closed",
                    text: `Opens at ${openTime}`,
                    color: "text-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                    icon: Clock,
                };
            } else {
                return {
                    status: "closed",
                    text: "Closed for today",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    icon: AlertCircle,
                };
            }
        } catch (error) {
            return {
                status: "unknown",
                text: "Status unavailable",
                color: "text-gray-600",
                bgColor: "bg-gray-50",
                borderColor: "border-gray-200",
                icon: Clock,
            };
        }
    };

    const currentStatus = getCurrentStatus();
    const StatusIcon = currentStatus.icon;

    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    const dayNames = {
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
    };

    return (
        <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200/50 shadow-sm mb-6">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700 tracking-wide">
                        Operating Hours
                    </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                    When we're{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        available
                    </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Plan your visit with our convenient operating hours. We're
                    here to serve you with flexible scheduling options.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Current Status & Hours */}
                <div className="space-y-8">
                    {/* Current Status Card */}
                    <div
                        className={`${currentStatus.bgColor} ${currentStatus.borderColor} border-2 rounded-2xl p-5 shadow-lg`}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-14 h-14 ${currentStatus.bgColor} rounded-2xl flex items-center justify-center shadow-sm`}
                            >
                                <StatusIcon
                                    className={`w-7 h-7 ${currentStatus.color}`}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Current Status
                                </h3>
                                <p
                                    className={`text-xl font-semibold ${currentStatus.color}`}
                                >
                                    {currentStatus.text}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Operating Hours Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                Weekly Schedule
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {days.map((day, index) => {
                                const dayHours = clinic.operating_hours[day];
                                const isToday =
                                    day ===
                                    new Date()
                                        .toLocaleDateString("en-US", {
                                            weekday: "long",
                                        })
                                        .toLowerCase();

                                // Handle both array format [open, close] and object format {open, close}
                                let isClosed, openTime, closeTime;
                                if (
                                    Array.isArray(dayHours) &&
                                    dayHours.length === 2
                                ) {
                                    openTime = dayHours[0];
                                    closeTime = dayHours[1];
                                    isClosed = !openTime || !closeTime;
                                } else if (
                                    dayHours &&
                                    dayHours.open &&
                                    dayHours.close
                                ) {
                                    openTime = dayHours.open;
                                    closeTime = dayHours.close;
                                    isClosed = false;
                                } else {
                                    isClosed = true;
                                }

                                return (
                                    <div
                                        key={day}
                                        className={`px-5 py-3 flex items-center justify-between transition-colors duration-200 hover:bg-gray-50 ${
                                            isToday
                                                ? "bg-blue-50 border-l-4 border-blue-500"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`font-semibold ${
                                                    isToday
                                                        ? "text-blue-900"
                                                        : "text-gray-900"
                                                }`}
                                            >
                                                {dayNames[day]}
                                            </span>
                                            {isToday && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                    Today
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            {isClosed ? (
                                                <span className="text-red-600 font-semibold">
                                                    Closed
                                                </span>
                                            ) : (
                                                <span className="text-gray-700 font-semibold">
                                                    {openTime} - {closeTime}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Additional Info & Features */}
                <div className="space-y-5">
                    {/* Quick Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="font-bold text-blue-900 text-lg">
                                    Extended Hours
                                </h4>
                            </div>
                            <p className="text-blue-700 text-sm leading-relaxed">
                                We offer flexible scheduling to accommodate your
                                busy lifestyle.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                                    <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="font-bold text-green-900 text-lg">
                                    Same-Day Appointments
                                </h4>
                            </div>
                            <p className="text-green-700 text-sm leading-relaxed">
                                Emergency appointments available for urgent
                                dental care needs.
                            </p>
                        </div>
                    </div>

                    {/* Emergency Information */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 border border-red-200 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-sm">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="font-bold text-red-900 text-lg">
                                Emergency Care
                            </h4>
                        </div>
                        <p className="text-red-700 text-sm mb-4 leading-relaxed">
                            For dental emergencies outside of regular hours,
                            please call us directly.
                        </p>
                        {clinic.phone && (
                            <div className="flex items-center gap-2 text-red-700 font-semibold">
                                <span>Emergency:</span>
                                <a
                                    href={`tel:${clinic.phone}`}
                                    className="hover:underline hover:text-red-800 transition-colors"
                                >
                                    {clinic.phone}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Additional Notes */}
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <h4 className="font-bold text-gray-900 mb-4 text-lg">
                            Important Notes
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="leading-relaxed">
                                    All times are shown in local time
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="leading-relaxed">
                                    Please arrive 10 minutes before your
                                    appointment
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="leading-relaxed">
                                    Holiday hours may vary - call ahead to
                                    confirm
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
