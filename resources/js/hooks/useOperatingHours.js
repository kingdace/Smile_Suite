import { useState, useCallback } from "react";

const DAYS_OF_WEEK = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
];

export function useOperatingHours(initialOperatingHours = {}) {
    // Initialize operating days state
    const [operatingDays, setOperatingDays] = useState(() => {
        // Default: all days closed
        const initial = {};
        DAYS_OF_WEEK.forEach((day) => {
            initial[day.id] = { open: "", close: "", closed: true };
        });

        if (initialOperatingHours) {
            Object.entries(initialOperatingHours).forEach(([day, hours]) => {
                if (Array.isArray(hours) && hours.length === 2) {
                    initial[day] = {
                        open: hours[0],
                        close: hours[1],
                        closed: false,
                    };
                } else {
                    initial[day] = { open: "", close: "", closed: true };
                }
            });
        }
        return initial;
    });

    // Quick setup state
    const [quickDays, setQuickDays] = useState([]);
    const [quickOpen, setQuickOpen] = useState("");
    const [quickClose, setQuickClose] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Validate hours function
    const validateHours = useCallback((days) => {
        const errors = {};
        Object.entries(days).forEach(([day, { open, close, closed }]) => {
            if (!closed && open && close && open >= close) {
                errors[day] = "Open time must be before close time.";
            }
        });
        return errors;
    }, []);

    // Handle operating day change
    const handleOperatingDayChange = useCallback(
        (day, field, value) => {
            setOperatingDays((prev) => {
                const updated = {
                    ...prev,
                    [day]: {
                        ...prev[day],
                        [field]: value,
                        closed: field === "closed" ? value : prev[day].closed,
                    },
                };
                setValidationErrors(validateHours(updated));
                return updated;
            });
        },
        [validateHours]
    );

    // Handle quick apply
    const handleQuickApply = useCallback(() => {
        setOperatingDays((prev) => {
            const updated = { ...prev };
            quickDays.forEach((day) => {
                updated[day] = {
                    open: quickOpen,
                    close: quickClose,
                    closed: false,
                };
            });
            setValidationErrors(validateHours(updated));
            return updated;
        });
    }, [quickDays, quickOpen, quickClose, validateHours]);

    // Handle copy previous day
    const handleCopyPreviousDay = useCallback((dayIdx) => {
        if (dayIdx === 0) return;
        const prevDay = DAYS_OF_WEEK[dayIdx - 1].id;
        setOperatingDays((prev) => ({
            ...prev,
            [DAYS_OF_WEEK[dayIdx].id]: { ...prev[prevDay] },
        }));
    }, []);

    // Handle set all days
    const handleSetAll = useCallback(() => {
        if (!quickOpen || !quickClose) return;
        setOperatingDays((prev) => {
            const updated = { ...prev };
            DAYS_OF_WEEK.forEach((day) => {
                updated[day.id] = {
                    open: quickOpen,
                    close: quickClose,
                    closed: false,
                };
            });
            setValidationErrors(validateHours(updated));
            return updated;
        });
    }, [quickOpen, quickClose, validateHours]);

    // Format operating hours for submission
    const formatOperatingHours = useCallback(() => {
        return Object.fromEntries(
            Object.entries(operatingDays).map(
                ([day, { open, close, closed }]) =>
                    closed ? [day, null] : [day, [open, close]]
            )
        );
    }, [operatingDays]);

    // Format time to 12-hour format
    const format12h = useCallback((time) => {
        if (!time) return "";
        let [h, m] = time.split(":");
        h = parseInt(h, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12;
        if (h === 0) h = 12;
        return `${h}:${m} ${ampm}`;
    }, []);

    return {
        // State
        operatingDays,
        quickDays,
        quickOpen,
        quickClose,
        validationErrors,

        // Actions
        setQuickDays,
        setQuickOpen,
        setQuickClose,
        handleOperatingDayChange,
        handleQuickApply,
        handleCopyPreviousDay,
        handleSetAll,
        formatOperatingHours,
        format12h,

        // Constants
        DAYS_OF_WEEK,
    };
}

