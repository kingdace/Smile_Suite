import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Checkbox } from "@/Components/ui/checkbox";
import moment from "moment";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Check,
    ChevronsUpDown,
    Search,
    Stethoscope,
    CalendarDays,
    Clock,
    ClipboardList,
    NotebookPen,
    CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import { toast } from "react-hot-toast";

const APPOINTMENT_REASONS = [
    { id: "cleaning", label: "Teeth Cleaning" },
    { id: "checkup", label: "Regular Checkup" },
    { id: "whitening", label: "Teeth Whitening" },
    { id: "filling", label: "Dental Filling" },
    { id: "extraction", label: "Tooth Extraction" },
    { id: "root_canal", label: "Root Canal" },
    { id: "crown", label: "Dental Crown" },
    { id: "bridge", label: "Dental Bridge" },
    { id: "denture", label: "Denture" },
    { id: "braces", label: "Braces/Orthodontics" },
    { id: "implant", label: "Dental Implant" },
    { id: "other", label: "Other" },
];

export default function Create({ auth, clinic, types, statuses, dentists }) {
    console.log("Statuses prop:", statuses);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [patientInput, setPatientInput] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [availableSlots, setAvailableSlots] = useState({
        morning: [],
        afternoon: [],
    });
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedReasons, setSelectedReasons] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [selectedNotes, setSelectedNotes] = useState("");
    const [selectedReason, setSelectedReason] = useState("");
    const [showCustomReason, setShowCustomReason] = useState(false);

    const walkInType = types.find((t) => t.name === "Walk-in");
    const confirmedStatus = statuses.find((s) => s.name === "Confirmed");
    const { data, setData, post, processing, errors, reset } = useForm({
        clinic_id: clinic.id,
        patient_id: "",
        assigned_to: "",
        scheduled_at: "",
        ended_at: "",
        appointment_type_id: walkInType ? walkInType.id : "",
        appointment_status_id: confirmedStatus ? confirmedStatus.id : "",
        payment_status: "",
        reason: "",
        notes: "",
    });

    const debouncedSearch = useCallback(
        debounce((value) => {
            setIsLoading(true);
            const searchUrl = route("clinic.patients.search", {
                clinic: clinic.id,
                search: value,
            });
            console.log("Debounced search. URL:", searchUrl);
            axios
                .get(searchUrl)
                .then((response) => {
                    console.log(
                        "Debounced search successful. Response data:",
                        response.data
                    );
                    setPatients(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Error in debounced patient search:",
                        error.response ? error.response.data : error.message
                    );
                    setPatients([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 300), // 300ms debounce
        [clinic.id]
    );

    useEffect(() => {
        // Initial load when popover opens or component mounts (if popover is initially open)
        // Only fetch if no patients are loaded and input is empty (first time opening)
        if (open && patients.length === 0 && patientInput === "") {
            debouncedSearch(""); // Load all patients initially
        }
    }, [open, patients.length, patientInput, debouncedSearch]);

    const handlePatientInputChange = (value) => {
        setPatientInput(value);
        // We no longer set 'open(true)' here, let the Popover's onOpenChange handle it.
        // The debouncedSearch will handle the API call based on value.
        debouncedSearch(value);
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setData("patient_id", patient.id);
        setPatientInput(`${patient.first_name} ${patient.last_name}`);
        setOpen(false);
    };

    const handleDentistChange = (dentistId) => {
        console.log("handleDentistChange called with:", dentistId);
        setData("assigned_to", dentistId);
        // Update selectedDentist state for display purposes
        const chosenDentist = dentists.find((d) => d.id === Number(dentistId));
        setSelectedDentist(chosenDentist);
        console.log("data.assigned_to after setData:", dentistId);
        setSelectedTime(""); // Reset selected time
        setAvailableSlots({ morning: [], afternoon: [] }); // Clear available slots
        if (selectedDate) {
            console.log(
                "Fetching slots for dentist:",
                dentistId,
                "date:",
                selectedDate
            );
            fetchAvailableSlots(dentistId, selectedDate);
        }
    };

    const handleDateChange = (date) => {
        console.log("handleDateChange called with:", date);
        setSelectedDate(date);
        setSelectedTime(""); // Reset selected time
        setAvailableSlots({ morning: [], afternoon: [] }); // Clear available slots
        if (data.assigned_to) {
            console.log(
                "Fetching slots for dentist:",
                data.assigned_to,
                "date:",
                date
            );
            fetchAvailableSlots(data.assigned_to, date);
        }
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "pm" : "am";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    const fetchAvailableSlots = async (dentistId, date) => {
        try {
            console.log(
                "Fetching slots from API for dentist:",
                dentistId,
                "date:",
                date
            );
            const response = await axios.get(
                route("clinic.dentist-schedules.available-slots", {
                    clinic: clinic.id,
                    dentist_id: dentistId,
                    date: date,
                })
            );
            console.log("API response:", response.data);
            console.log("Available slots:", response.data.slots);
            setAvailableSlots(
                response.data.slots || { morning: [], afternoon: [] }
            );
            console.log("Set Available slots state:", availableSlots);
        } catch (error) {
            console.error("Error fetching available slots:", error);
            console.error("Error details:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("Error URL:", error.config?.url);
            setAvailableSlots({ morning: [], afternoon: [] });
        }
    };

    // Add debug logs for the disabled condition
    console.log("Select disabled condition:", {
        selectedDate: selectedDate,
        availableSlots: availableSlots,
        slotsLength:
            availableSlots.morning.length + availableSlots.afternoon.length,
        isDisabled:
            !selectedDate ||
            availableSlots.morning.length + availableSlots.afternoon.length ===
                0,
    });

    const handleTimeChange = (time) => {
        setSelectedTime(time);
        const [hours, minutes] = time.split(":");
        const scheduledAt = new Date(selectedDate);
        scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // Set ended_at to 1 hour after scheduled_at
        const endedAt = new Date(scheduledAt);
        endedAt.setHours(scheduledAt.getHours() + 1);

        setData({
            ...data,
            scheduled_at: scheduledAt.toISOString(),
            ended_at: endedAt.toISOString(),
        });
    };

    // Add a function to handle payment status changes
    const handlePaymentStatusChange = (value) => {
        console.log("Payment status changing to:", value);
        setData("payment_status", value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("handleSubmit triggered!");
        console.log("Form data before submission:", {
            ...data,
            payment_status: data.payment_status || "pending",
        });

        // Ensure payment_status is set to a valid value
        if (
            !data.payment_status ||
            !["pending", "paid", "partial"].includes(data.payment_status)
        ) {
            setData("payment_status", "pending");
        }

        // Log the final data being sent
        console.log("Final form data being sent:", data);

        post(route("clinic.appointments.store", clinic.id), {
            onSuccess: () => {
                toast.success("Appointment created successfully!");
                reset();
            },
            onError: (errors) => {
                console.error("Error creating appointment:", errors);
                console.error("Form data that caused the error:", data);
                Object.values(errors).forEach((error) => toast.error(error));
            },
        });
    };

    const handleReasonChange = (reasonId, checked) => {
        let newReasons;
        if (checked) {
            newReasons = [...selectedReasons, reasonId];
            if (reasonId === "other") {
                setShowCustomReason(true);
            }
        } else {
            newReasons = selectedReasons.filter((id) => id !== reasonId);
            if (reasonId === "other") {
                setShowCustomReason(false);
                setData("custom_reason", "");
            }
        }
        setSelectedReasons(newReasons);

        const reasonLabels = newReasons
            .map((id) => {
                if (id === "other") {
                    return data.custom_reason || "Other";
                }
                return APPOINTMENT_REASONS.find((r) => r.id === id)?.label;
            })
            .filter(Boolean);

        setData("reason", reasonLabels.join(", "));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Appointment
                </h2>
            }
        >
            <Head title="Create Appointment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href={route("clinic.appointments.index", clinic)}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Appointments
                            </Button>
                        </Link>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create Appointment</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Patient Selection */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="patient_id"
                                        className="flex items-center gap-2 text-md font-semibold"
                                    >
                                        <Search className="h-4 w-4" /> Patient
                                    </Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className={`w-full justify-between ${
                                                    !selectedPatient
                                                        ? "text-muted-foreground"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center flex-grow">
                                                    {selectedPatient
                                                        ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
                                                        : "Search for a patient..."}
                                                </div>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder="Search patient by name, email or phone..."
                                                    value={patientInput}
                                                    onValueChange={
                                                        handlePatientInputChange
                                                    }
                                                />
                                                <CommandList className="max-h-[300px] overflow-y-auto">
                                                    {isLoading && (
                                                        <CommandEmpty>
                                                            Loading patients...
                                                        </CommandEmpty>
                                                    )}
                                                    {!isLoading &&
                                                        patients.length === 0 &&
                                                        patientInput && (
                                                            <CommandEmpty>
                                                                No patient
                                                                found.
                                                            </CommandEmpty>
                                                        )}
                                                    {!isLoading &&
                                                        patients.length === 0 &&
                                                        !patientInput && (
                                                            <CommandEmpty>
                                                                Start typing to
                                                                search for
                                                                patients.
                                                            </CommandEmpty>
                                                        )}
                                                    <CommandGroup>
                                                        {patients.map(
                                                            (patient) => (
                                                                <CommandItem
                                                                    key={
                                                                        patient.id
                                                                    }
                                                                    value={`${patient.first_name} ${patient.last_name} ${patient.email} ${patient.phone_number}`}
                                                                    onSelect={() =>
                                                                        handlePatientSelect(
                                                                            patient
                                                                        )
                                                                    }
                                                                    className={cn(
                                                                        "flex items-center justify-between p-2 cursor-pointer",
                                                                        selectedPatient?.id ===
                                                                            patient.id &&
                                                                            "bg-gray-100"
                                                                    )}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedPatient?.id ===
                                                                                patient.id
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="flex flex-col text-sm flex-grow">
                                                                        <span className="font-medium">
                                                                            {
                                                                                patient.first_name
                                                                            }{" "}
                                                                            {
                                                                                patient.last_name
                                                                            }
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {patient.email ||
                                                                                patient.phone_number}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            )
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.patient_id && (
                                        <p className="text-sm text-red-600">
                                            {errors.patient_id}
                                        </p>
                                    )}
                                </div>

                                {/* Selected Patient Info Card */}
                                {selectedPatient && (
                                    <div className="p-4 border rounded-md shadow-sm bg-gray-50 flex items-center">
                                        <div className="flex-shrink-0 mr-4">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-8 h-8 text-gray-500"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">
                                                {selectedPatient.first_name}{" "}
                                                {selectedPatient.last_name}
                                            </p>
                                            {(selectedPatient.email ||
                                                selectedPatient.phone_number) && (
                                                <p className="text-gray-600 text-sm">
                                                    {selectedPatient.email && (
                                                        <>
                                                            Email:{" "}
                                                            {
                                                                selectedPatient.email
                                                            }
                                                            {selectedPatient.phone_number &&
                                                                " "}
                                                        </>
                                                    )}
                                                    {selectedPatient.phone_number && (
                                                        <>
                                                            Phone:{" "}
                                                            {
                                                                selectedPatient.phone_number
                                                            }
                                                        </>
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Dentist Selection */}
                                <div className="space-y-2 relative">
                                    <Label
                                        htmlFor="assigned_to"
                                        className="flex items-center gap-2 text-md font-semibold"
                                    >
                                        <Stethoscope className="h-4 w-4" />{" "}
                                        Dentist
                                    </Label>
                                    <Select
                                        onValueChange={handleDentistChange}
                                        value={data.assigned_to}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a dentist">
                                                {selectedDentist
                                                    ? selectedDentist.name
                                                    : "Select a dentist"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent
                                            position="popper"
                                            className="w-full z-50"
                                        >
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Dentists
                                                </SelectLabel>
                                                <SelectSeparator />
                                                {dentists &&
                                                dentists.length > 0 ? (
                                                    dentists.map((dentist) => (
                                                        <SelectItem
                                                            key={dentist.id}
                                                            value={String(
                                                                dentist.id
                                                            )}
                                                        >
                                                            {dentist.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem
                                                        value="no-dentists"
                                                        disabled
                                                    >
                                                        No dentists available
                                                    </SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.assigned_to && (
                                        <p className="text-sm text-red-600">
                                            {errors.assigned_to}
                                        </p>
                                    )}
                                    {selectedDentist && (
                                        <div className="mt-2 p-3 border rounded-md bg-blue-50 text-blue-800 text-sm">
                                            Selected: {selectedDentist.name}{" "}
                                            (Email: {selectedDentist.email})
                                        </div>
                                    )}
                                </div>

                                {/* Date and Time Selection (Side-by-side within single column) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Date Selection */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="date"
                                            className="flex items-center gap-2 text-md font-semibold"
                                        >
                                            <CalendarDays className="h-4 w-4" />{" "}
                                            Date
                                        </Label>
                                        <Input
                                            type="date"
                                            id="date"
                                            value={selectedDate}
                                            onChange={(e) =>
                                                handleDateChange(e.target.value)
                                            }
                                            min={moment().format("YYYY-MM-DD")}
                                            className="w-full"
                                        />
                                        {errors.scheduled_at && (
                                            <p className="text-sm text-red-600">
                                                {errors.scheduled_at}
                                            </p>
                                        )}
                                    </div>

                                    {/* Time Selection */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="time"
                                            className="flex items-center gap-2 text-md font-semibold"
                                        >
                                            <Clock className="h-4 w-4" /> Time
                                        </Label>
                                        <Select
                                            onValueChange={handleTimeChange}
                                            value={selectedTime}
                                            disabled={
                                                !selectedDate ||
                                                (availableSlots.morning
                                                    .length === 0 &&
                                                    availableSlots.afternoon
                                                        .length === 0)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select available time">
                                                    {selectedTime
                                                        ? formatTime(
                                                              selectedTime
                                                          )
                                                        : "Select available time"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSlots.morning.length >
                                                    0 && (
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Morning
                                                        </SelectLabel>
                                                        {Array.isArray(
                                                            availableSlots.morning
                                                        ) &&
                                                            availableSlots.morning.map(
                                                                (slot) => (
                                                                    <SelectItem
                                                                        key={
                                                                            slot.start
                                                                        }
                                                                        value={
                                                                            slot.start
                                                                        }
                                                                    >
                                                                        {formatTime(
                                                                            slot.start
                                                                        )}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                    </SelectGroup>
                                                )}
                                                {availableSlots.afternoon
                                                    .length > 0 && (
                                                    <>
                                                        {availableSlots.morning
                                                            .length > 0 && (
                                                            <SelectSeparator />
                                                        )}
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Afternoon
                                                            </SelectLabel>
                                                            {Array.isArray(
                                                                availableSlots.afternoon
                                                            ) &&
                                                                availableSlots.afternoon.map(
                                                                    (slot) => (
                                                                        <SelectItem
                                                                            key={
                                                                                slot.start
                                                                            }
                                                                            value={
                                                                                slot.start
                                                                            }
                                                                        >
                                                                            {formatTime(
                                                                                slot.start
                                                                            )}
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                        </SelectGroup>
                                                    </>
                                                )}
                                                {availableSlots.morning
                                                    .length === 0 &&
                                                    availableSlots.afternoon
                                                        .length === 0 && (
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                No slots
                                                                available
                                                            </SelectLabel>
                                                        </SelectGroup>
                                                    )}
                                            </SelectContent>
                                        </Select>
                                        {errors.scheduled_at && (
                                            <p className="text-sm text-red-600">
                                                {errors.scheduled_at}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Reason for Visit */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-md font-semibold">
                                        <ClipboardList className="h-4 w-4" />{" "}
                                        Reason for Visit
                                    </Label>
                                    <div className="flex flex-col space-y-2">
                                        {APPOINTMENT_REASONS.map((reason) => (
                                            <div
                                                key={reason.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`reason-${reason.id}`}
                                                    checked={selectedReasons.includes(
                                                        reason.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleReasonChange(
                                                            reason.id,
                                                            checked
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`reason-${reason.id}`}
                                                >
                                                    {reason.label}
                                                </Label>
                                            </div>
                                        ))}
                                        {/* Custom reason checkbox */}
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="reason-other"
                                                checked={showCustomReason}
                                                onCheckedChange={
                                                    setShowCustomReason
                                                }
                                            />
                                            <Label
                                                htmlFor="reason-other"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Other
                                            </Label>
                                        </div>
                                    </div>
                                    {showCustomReason && (
                                        <Input
                                            type="text"
                                            placeholder="Specify reason"
                                            value={data.reason}
                                            onChange={(e) =>
                                                setData(
                                                    "reason",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                        />
                                    )}
                                    {errors.reason && (
                                        <p className="text-sm text-red-600">
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="notes"
                                        className="flex items-center gap-2 text-md font-semibold"
                                    >
                                        <NotebookPen className="h-4 w-4" />{" "}
                                        Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        className="min-h-[100px]"
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-600">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Payment Status */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="payment_status"
                                        className="flex items-center gap-2 text-md font-semibold"
                                    >
                                        <CreditCard className="h-4 w-4" />{" "}
                                        Payment Status
                                    </Label>
                                    <Select
                                        value={data.payment_status}
                                        onValueChange={
                                            handlePaymentStatusChange
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="partial">
                                                Partial
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_status && (
                                        <p className="text-sm text-red-500">
                                            {errors.payment_status}
                                        </p>
                                    )}
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "clinic.appointments.index",
                                                    clinic
                                                )
                                            )
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Create Appointment
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
