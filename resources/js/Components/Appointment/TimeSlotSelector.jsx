import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import axios from "axios";

export default function TimeSlotSelector({
    clinic,
    selectedDentist,
    selectedDate,
    selectedTime,
    onDateChange,
    onTimeChange,
    onDentistChange,
    dentists,
    error,
    disabled = false,
}) {
    const [availableSlots, setAvailableSlots] = useState({
        morning: [],
        afternoon: [],
    });
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [slotError, setSlotError] = useState("");

    // Fetch available slots when dentist or date changes
    useEffect(() => {
        if (selectedDentist && selectedDate) {
            fetchAvailableSlots();
        } else {
            setAvailableSlots({ morning: [], afternoon: [] });
        }
    }, [selectedDentist, selectedDate]);

    const fetchAvailableSlots = async () => {
        if (!selectedDentist || !selectedDate) return;

        setIsLoadingSlots(true);
        setSlotError("");

        try {
            const response = await axios.get(
                route("clinic.dentist-schedules.get-available-slots", {
                    clinic: clinic.id,
                }),
                {
                    params: {
                        dentist_id: selectedDentist,
                        date: selectedDate,
                        duration: 30, // Default duration
                    },
                }
            );

            if (response.data.success) {
                setAvailableSlots(response.data.slots);
            } else {
                setSlotError("Failed to load available slots");
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
            setSlotError("Failed to load available slots");
            setAvailableSlots({ morning: [], afternoon: [] });
        } finally {
            setIsLoadingSlots(false);
        }
    };

    const handleDateChange = (date) => {
        onDateChange(date);
        onTimeChange(""); // Clear selected time when date changes
    };

    const handleDentistChange = (dentistId) => {
        onDentistChange(dentistId);
        onTimeChange(""); // Clear selected time when dentist changes
    };

    const handleTimeSelect = (time) => {
        onTimeChange(time);
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const formatTimeSlot = (time) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const renderTimeSlots = (slots, period) => {
        if (slots.length === 0) {
            return (
                <div className="text-sm text-gray-500 text-center py-4">
                    No available slots
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-2">
                {slots.map((time) => (
                    <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTimeSelect(time)}
                        disabled={disabled}
                        className="text-xs"
                    >
                        {formatTimeSlot(time)}
                    </Button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Dentist Selection */}
            <div className="space-y-2">
                <Label htmlFor="dentist">Select Dentist</Label>
                <Select
                    value={selectedDentist || ""}
                    onValueChange={handleDentistChange}
                    disabled={disabled}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a dentist" />
                    </SelectTrigger>
                    <SelectContent>
                        {dentists.map((dentist) => (
                            <SelectItem
                                key={dentist.id}
                                value={dentist.id.toString()}
                            >
                                {dentist.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={getMinDate()}
                        disabled={disabled || !selectedDentist}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDentist && selectedDate && (
                <div className="space-y-3">
                    <Label>Select Time</Label>

                    {isLoadingSlots ? (
                        <div className="flex items-center justify-center py-4">
                            <Clock className="animate-spin h-4 w-4 mr-2" />
                            <span className="text-sm text-gray-500">
                                Loading available slots...
                            </span>
                        </div>
                    ) : slotError ? (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600">
                                {slotError}
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Morning Slots */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Morning
                                </h4>
                                {renderTimeSlots(
                                    availableSlots.morning,
                                    "morning"
                                )}
                            </div>

                            {/* Afternoon Slots */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Afternoon
                                </h4>
                                {renderTimeSlots(
                                    availableSlots.afternoon,
                                    "afternoon"
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
