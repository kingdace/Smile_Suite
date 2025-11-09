import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

export default function AppointmentCalendar({ clinic, selectedDate, onDateSelect, duration = 30 }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [availabilityStatus, setAvailabilityStatus] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get first and last day of current month view
    const getMonthBounds = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { firstDay, lastDay };
    };

    // Fetch availability status for the visible month
    const fetchAvailability = useCallback(async () => {
        if (!clinic?.id) return;

        setLoading(true);
        setError(null);

        try {
            const { firstDay, lastDay } = getMonthBounds(currentMonth);
            
            // Format dates in local timezone to avoid UTC conversion issues
            const formatDateLocal = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            // Fetch availability for the month
            const response = await axios.get(window.route("public.clinics.availability-status", clinic.id), {
                params: {
                    start_date: formatDateLocal(firstDay),
                    end_date: formatDateLocal(lastDay),
                    duration: duration,
                },
            });

            if (response.data.success) {
                setAvailabilityStatus(response.data.availability || {});
            } else {
                setError("Failed to load availability");
            }
        } catch (err) {
            console.error("Error fetching availability:", err);
            setError("Failed to load availability");
        } finally {
            setLoading(false);
        }
    }, [clinic?.id, currentMonth, duration]);

    // Fetch availability when month changes
    useEffect(() => {
        fetchAvailability();
    }, [fetchAvailability]);

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    // Navigate to next month
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    // Get days in month
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Check if date is today
    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Format date to YYYY-MM-DD in local timezone (avoid UTC conversion issues)
    const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Check if date is in the past
    const isPastDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate < today;
    };

    // Check if date is selected
    const isSelected = (date) => {
        if (!selectedDate) return false;
        const selected = new Date(selectedDate + 'T00:00:00'); // Parse as local date
        return (
            date.getDate() === selected.getDate() &&
            date.getMonth() === selected.getMonth() &&
            date.getFullYear() === selected.getFullYear()
        );
    };

    // Get availability status for a date
    const getAvailabilityStatus = (date) => {
        const dateKey = formatDateLocal(date);
        return availabilityStatus[dateKey] || "closed";
    };

    // Get status color - Enhanced
    const getStatusColor = (status, date) => {
        if (isPastDate(date)) {
            return "bg-gray-50 text-gray-300 border-gray-200";
        }

        switch (status) {
            case "available":
                return "bg-green-50 hover:bg-green-100 hover:border-green-500 hover:shadow-sm text-green-800 border-green-300 font-semibold";
            case "limited":
                return "bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-500 hover:shadow-sm text-yellow-800 border-yellow-300 font-semibold";
            case "full":
                return "bg-red-50 text-red-700 border-red-300";
            case "closed":
            default:
                return "bg-gray-50 text-gray-400 border-gray-200";
        }
    };

    // Handle date click
    const handleDateClick = (date) => {
        if (isPastDate(date)) return;
        const status = getAvailabilityStatus(date);
        if (status === "closed" || status === "full") return;

        // Use local timezone formatting to avoid UTC conversion issues
        const dateString = formatDateLocal(date);
        onDateSelect(dateString);
    };

    // Render calendar
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const status = getAvailabilityStatus(date);
            const dateIsToday = isToday(date);
            const dateIsSelected = isSelected(date);
            const dateIsPast = isPastDate(date);

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDateClick(date)}
                    disabled={dateIsPast || status === "closed" || status === "full"}
                    className={`
                        h-9 w-full rounded-lg border-2 text-xs font-semibold transition-all duration-200
                        ${getStatusColor(status, date)}
                        ${dateIsToday ? "ring-2 ring-blue-400 ring-offset-1" : ""}
                        ${dateIsSelected ? "ring-2 ring-blue-600 ring-offset-1 shadow-md scale-105 z-10" : ""}
                        disabled:opacity-40 disabled:cursor-not-allowed
                        active:scale-95
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    `}
                    title={
                        dateIsPast
                            ? "Past date"
                            : status === "available"
                            ? "Available slots"
                            : status === "limited"
                            ? "Limited slots"
                            : status === "full"
                            ? "Fully booked"
                            : "Closed"
                    }
                >
                    <span className={dateIsSelected ? "text-blue-900" : ""}>{day}</span>
                </button>
            );
        }

        return (
            <div className="w-full">
                {/* Calendar Header - Enhanced */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all text-gray-500 hover:shadow-sm"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="text-center">
                        <h3 className="text-sm font-bold text-gray-900">
                            {monthNames[currentMonth.getMonth()]}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-medium">
                            {currentMonth.getFullYear()}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={goToNextMonth}
                        className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all text-gray-500 hover:shadow-sm"
                        aria-label="Next month"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Weekday Headers - Enhanced */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="text-center text-[10px] font-bold text-gray-600 py-1.5 bg-gray-50 rounded"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid - Enhanced */}
                <div className="grid grid-cols-7 gap-1">{days}</div>

                {/* Legend - Enhanced */}
                <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2 text-[9px]">
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-sm"></div>
                            <span className="text-gray-600 font-medium">Available</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm"></div>
                            <span className="text-gray-600 font-medium">Limited</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm"></div>
                            <span className="text-gray-600 font-medium">Full</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-300 shadow-sm"></div>
                            <span className="text-gray-600 font-medium">Closed</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Skeleton loader for calendar
    const renderSkeleton = () => {
        return (
            <div className="w-full animate-pulse">
                {/* Header skeleton */}
                <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                    <div className="w-32 h-5 bg-gray-200 rounded"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                </div>
                
                {/* Weekday headers skeleton */}
                <div className="grid grid-cols-7 gap-0.5 mb-1.5">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                </div>
                
                {/* Calendar grid skeleton */}
                <div className="grid grid-cols-7 gap-0.5">
                    {[...Array(35)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded-md"></div>
                    ))}
                </div>
                
                {/* Legend skeleton */}
                <div className="mt-3 flex gap-2.5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-16 h-3 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {loading && renderSkeleton()}
            {error && (
                <div className="text-center py-3 text-xs text-red-500 bg-red-50 rounded-md p-2">{error}</div>
            )}
            {!loading && !error && renderCalendar()}
        </div>
    );
}

