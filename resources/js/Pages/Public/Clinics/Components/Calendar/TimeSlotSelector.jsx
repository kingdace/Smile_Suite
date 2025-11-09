import React, { useState, useEffect } from "react";
import { Clock, Loader2 } from "lucide-react";
import axios from "axios";

export default function TimeSlotSelector({ clinic, selectedDate, selectedTime, onTimeSelect, duration = 30 }) {
    const [availableSlots, setAvailableSlots] = useState({ morning: [], afternoon: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch available slots when date changes
    useEffect(() => {
        if (!selectedDate || !clinic?.id) {
            setAvailableSlots({ morning: [], afternoon: [] });
            return;
        }

        const fetchSlots = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(window.route("public.clinics.available-slots", clinic.id), {
                    params: {
                        date: selectedDate,
                        duration: duration,
                    },
                });

                if (response.data.success) {
                    const slots = response.data.slots || { morning: [], afternoon: [] };
                    setAvailableSlots(slots);
                    
                    // If no slots available, show a helpful message instead of error
                    const totalSlots = (slots.morning || []).length + (slots.afternoon || []).length;
                    if (totalSlots === 0) {
                        // This is not an error - just no availability
                        setError(null); // Clear any previous errors
                    }
                } else {
                    setError(response.data.message || response.data.error || "Failed to load available time slots");
                    setAvailableSlots({ morning: [], afternoon: [] });
                }
            } catch (err) {
                console.error("Error fetching available slots:", err);
                // More detailed error handling
                if (err.response) {
                    // Server responded with error
                    const status = err.response.status;
                    const data = err.response.data;
                    
                    if (status === 422) {
                        // Validation error
                        const validationErrors = data?.errors;
                        if (validationErrors?.date) {
                            setError(validationErrors.date[0] || "Invalid date selected");
                        } else {
                            setError(data?.message || "Invalid date or time selection");
                        }
                    } else if (status === 404) {
                        setError("Clinic not found");
                    } else if (status === 500) {
                        setError(data?.message || "Server error. Please try again later.");
                    } else {
                        setError(data?.message || data?.error || "Failed to load available time slots");
                    }
                    console.error("Server error:", {
                        status,
                        data,
                        date: selectedDate,
                    });
                } else if (err.request) {
                    // Request was made but no response
                    setError("Unable to connect to server. Please check your internet connection.");
                    console.error("Network error:", err.request);
                } else {
                    // Something else happened
                    setError("An unexpected error occurred. Please try again.");
                    console.error("Error:", err.message);
                }
                setAvailableSlots({ morning: [], afternoon: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [selectedDate, clinic?.id, duration]);

    // Format time slot (HH:mm) to display format (H:MM AM/PM)
    const formatTimeSlot = (time) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    // Get next slot time for display
    const getNextSlotTime = (time) => {
        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        date.setMinutes(date.getMinutes() + duration);
        const nextHour = date.getHours();
        const nextMinute = date.getMinutes();
        const ampm = nextHour >= 12 ? "PM" : "AM";
        const displayHour = nextHour % 12 || 12;
        return `${displayHour}:${nextMinute.toString().padStart(2, "0")} ${ampm}`;
    };

    // Render time slot button - Enhanced
    const renderTimeSlot = (time) => {
        const isSelected = selectedTime === time;
        const displayTime = formatTimeSlot(time);

        return (
            <button
                key={time}
                type="button"
                onClick={() => onTimeSelect(time)}
                    className={`
                    px-3 py-2 rounded-lg border-2 text-xs font-bold transition-all duration-200
                    ${
                        isSelected
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-700 shadow-lg scale-105 ring-2 ring-blue-400 ring-offset-1"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
                    }
                    active:scale-95
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                `}
                title={`${displayTime} - ${getNextSlotTime(time)} (${duration} minutes)`}
            >
                {displayTime}
            </button>
        );
    };

    if (!selectedDate) {
        return (
            <div className="w-full p-3 text-center text-gray-500">
                <Clock className="w-6 h-6 mx-auto mb-1.5 text-gray-400" />
                <p className="text-xs">Select a date to view available time slots</p>
            </div>
        );
    }

    // Skeleton loader for time slots
    const renderSkeleton = () => {
        return (
            <div className="w-full animate-pulse space-y-3">
                {/* Morning skeleton */}
                <div>
                    <div className="w-20 h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded-md"></div>
                        ))}
                    </div>
                </div>
                {/* Afternoon skeleton */}
                <div>
                    <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded-md"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return renderSkeleton();
    }

    if (error) {
        return (
            <div className="w-full p-3 text-center">
                <p className="text-xs text-red-500">{error}</p>
            </div>
        );
    }

    const hasSlots = availableSlots.morning.length > 0 || availableSlots.afternoon.length > 0;

    // Show error state first (if there's an actual error)
    if (error && !loading) {
        return (
            <div className="w-full p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                <p className="text-xs font-medium text-red-600 mb-1">Error Loading Slots</p>
                <p className="text-[10px] text-red-500 break-words">{error}</p>
            </div>
        );
    }

    // Format date to YYYY-MM-DD in local timezone (avoid UTC conversion issues)
    const formatDateLocal = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Show helpful message when no slots available (not an error state)
    if (!hasSlots && !loading && !error) {
        // Check if it's today (using local timezone)
        const todayLocal = formatDateLocal(new Date());
        const isToday = selectedDate === todayLocal;
        const currentHour = new Date().getHours();
        
        return (
            <div className="w-full p-4 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-xs font-medium text-gray-700 mb-1">
                    {isToday && currentHour >= 17 
                        ? "No more available slots for today" 
                        : "No available time slots for this date"}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 px-2">
                    {isToday 
                        ? "All slots for today have been booked or have passed. Please select another date."
                        : "This date may be fully booked or the clinic is closed. Please try another date."}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-gray-800">Available Time Slots</h4>
                        <p className="text-[9px] text-gray-500">{duration}-minute appointments</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', maxHeight: '240px' }}>
                {/* Morning Slots */}
                {availableSlots.morning.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <h5 className="text-[10px] font-bold text-gray-700 px-2 py-0.5 bg-orange-50 rounded-full border border-orange-200">
                                MORNING • Until 12:00 PM
                            </h5>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                            {availableSlots.morning.map((time) => renderTimeSlot(time))}
                        </div>
                    </div>
                )}

                {/* Afternoon Slots */}
                {availableSlots.afternoon.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <h5 className="text-[10px] font-bold text-gray-700 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-200">
                                AFTERNOON • From 1:00 PM
                            </h5>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                            {availableSlots.afternoon.map((time) => renderTimeSlot(time))}
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Time Display - Enhanced */}
            {selectedTime && (
                <div className="mt-3 p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg shadow-sm">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium text-blue-800">Selected Time:</span>
                            <span className="text-xs font-bold text-blue-900">
                                {formatTimeSlot(selectedTime)} - {getNextSlotTime(selectedTime)}
                            </span>
                        </div>
                        <div className="text-[9px] text-blue-700 font-medium">
                            Duration: {duration} minutes
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

