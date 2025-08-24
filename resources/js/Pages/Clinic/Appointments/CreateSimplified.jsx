import { Head, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Stethoscope,
    FileText,
    CheckCircle,
    AlertCircle,
    Plus,
    CalendarCheck,
    UserCheck,
    CreditCard,
    MessageSquare,
    Zap,
    Sparkles,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import PatientSelector from "@/Components/Appointment/PatientSelector";
import TimeSlotSelector from "@/Components/Appointment/TimeSlotSelector";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";

// Helper function to get service color based on category
const getServiceColor = (category) => {
    const colors = {
        general: "bg-blue-100 text-blue-700",
        cosmetic: "bg-purple-100 text-purple-700",
        orthodontics: "bg-indigo-100 text-indigo-700",
        surgery: "bg-red-100 text-red-700",
        pediatric: "bg-pink-100 text-pink-700",
        emergency: "bg-orange-100 text-orange-700",
        preventive: "bg-green-100 text-green-700",
        restorative: "bg-teal-100 text-teal-700",
        endodontics: "bg-cyan-100 text-cyan-700",
        periodontics: "bg-emerald-100 text-emerald-700",
        prosthodontics: "bg-gray-100 text-gray-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
};

const PAYMENT_STATUSES = [
    {
        value: "pending",
        label: "Pending",
        icon: Clock,
        color: "text-yellow-600",
    },
    {
        value: "paid",
        label: "Paid",
        icon: CheckCircle,
        color: "text-green-600",
    },
    {
        value: "partial",
        label: "Partial",
        icon: AlertCircle,
        color: "text-orange-600",
    },
    {
        value: "insurance",
        label: "Insurance",
        icon: CreditCard,
        color: "text-blue-600",
    },
];

export default function CreateSimplified({
    auth,
    clinic,
    types,
    statuses,
    dentists,
    services,
}) {
    const { flash } = usePage().props;

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDentist, setSelectedDentist] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [conflictData, setConflictData] = useState(null);
    const [waitlistPriority, setWaitlistPriority] = useState("normal");
    const [contactMethod, setContactMethod] = useState("phone");

    const walkInType = types.find((t) => t.name === "Walk-in");
    const confirmedStatus = statuses.find((s) => s.name === "Confirmed");

    const { data, setData, post, processing, errors, reset } = useForm({
        clinic_id: clinic.id,
        patient_id: "",
        assigned_to: "",
        scheduled_at: "",
        duration: 30,
        appointment_type_id: walkInType ? walkInType.id : "",
        payment_status: "pending",
        reason: "",
        notes: "",
        service_id: "",
    });

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setData("patient_id", patient.id);
        if (currentStep === 1) setCurrentStep(2);
    };

    const handleDentistChange = (dentistId) => {
        setSelectedDentist(dentistId);
        setData("assigned_to", dentistId);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
        if (selectedDate && time) {
            const scheduledAt = `${selectedDate}T${time}:00`;
            setData("scheduled_at", scheduledAt);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        post(route("clinic.appointments.store", clinic.id), {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const getStepStatus = (step) => {
        if (step < currentStep) return "completed";
        if (step === currentStep) return "current";
        return "upcoming";
    };

    const canProceedToStep2 = selectedPatient;
    const canProceedToStep3 =
        selectedPatient && selectedDentist && selectedDate && selectedTime;
    const canSubmit =
        selectedPatient &&
        selectedDentist &&
        selectedDate &&
        selectedTime &&
        (data.service_id || data.reason);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Create Appointment" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {/* Enhanced Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href={route(
                                    "clinic.appointments.index",
                                    clinic.id
                                )}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Appointments
                            </Link>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full shadow-lg">
                                    <CalendarCheck className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">
                                        Create New Appointment
                                    </h1>
                                    <p className="text-gray-600 mt-2 text-lg">
                                        Schedule a new appointment for your
                                        patient
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-4">
                                {[
                                    {
                                        step: 1,
                                        title: "Select Patient",
                                        icon: User,
                                    },
                                    {
                                        step: 2,
                                        title: "Choose Schedule",
                                        icon: Calendar,
                                    },
                                    {
                                        step: 3,
                                        title: "Appointment Details",
                                        icon: FileText,
                                    },
                                ].map(({ step, title, icon: Icon }) => (
                                    <div
                                        key={step}
                                        className="flex items-center"
                                    >
                                        <div
                                            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                                                getStepStatus(step) ===
                                                "completed"
                                                    ? "bg-green-500 border-green-500 text-white"
                                                    : getStepStatus(step) ===
                                                      "current"
                                                    ? "bg-blue-500 border-blue-500 text-white"
                                                    : "bg-white border-gray-300 text-gray-400"
                                            }`}
                                        >
                                            {getStepStatus(step) ===
                                            "completed" ? (
                                                <CheckCircle className="h-6 w-6" />
                                            ) : (
                                                <Icon className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <p
                                                className={`text-sm font-medium ${
                                                    getStepStatus(step) ===
                                                    "completed"
                                                        ? "text-green-600"
                                                        : getStepStatus(
                                                              step
                                                          ) === "current"
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {title}
                                            </p>
                                        </div>
                                        {step < 3 && (
                                            <div
                                                className={`w-16 h-0.5 mx-4 ${
                                                    getStepStatus(step) ===
                                                    "completed"
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1: Patient Selection */}
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <UserCheck className="h-6 w-6 text-blue-600" />
                                    Step 1: Select Patient
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <PatientSelector
                                    clinic={clinic}
                                    onPatientSelect={handlePatientSelect}
                                    selectedPatient={selectedPatient}
                                />
                                {selectedPatient && (
                                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-semibold text-green-800">
                                                    {selectedPatient.first_name}{" "}
                                                    {selectedPatient.last_name}
                                                </p>
                                                <p className="text-sm text-green-600">
                                                    {selectedPatient.email} •{" "}
                                                    {
                                                        selectedPatient.phone_number
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Step 2: Schedule Selection */}
                        {canProceedToStep2 && (
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                        Step 2: Choose Schedule
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <TimeSlotSelector
                                        clinic={clinic}
                                        onDentistChange={handleDentistChange}
                                        onDateChange={handleDateChange}
                                        onTimeChange={handleTimeChange}
                                        selectedDentist={selectedDentist}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        dentists={dentists}
                                    />
                                    {canProceedToStep3 && (
                                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <p className="font-semibold text-green-800">
                                                        Schedule Confirmed
                                                    </p>
                                                    <p className="text-sm text-green-600">
                                                        {selectedDate} at{" "}
                                                        {selectedTime}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 3: Appointment Details */}
                        {canProceedToStep3 && (
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <FileText className="h-6 w-6 text-purple-600" />
                                        Step 3: Appointment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {/* Service Selection */}
                                    <div>
                                        <Label className="text-base font-semibold mb-3 block">
                                            Select Service
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {services && services.length > 0 ? (
                                                services.map((service) => (
                                                    <button
                                                        key={service.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setData(
                                                                "service_id",
                                                                service.id
                                                            );
                                                            setData(
                                                                "reason",
                                                                service.name
                                                            );
                                                            setData(
                                                                "duration",
                                                                service.duration_minutes ||
                                                                    30
                                                            );
                                                        }}
                                                        className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                                                            data.service_id ===
                                                            service.id
                                                                ? "border-blue-500 bg-blue-50 shadow-md"
                                                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                                        }`}
                                                    >
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <span
                                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceColor(
                                                                        service.category
                                                                    )}`}
                                                                >
                                                                    {
                                                                        service.category
                                                                    }
                                                                </span>
                                                                <span className="text-sm font-semibold text-gray-900">
                                                                    ₱
                                                                    {
                                                                        service.price
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 mb-1">
                                                                    {
                                                                        service.name
                                                                    }
                                                                </h4>
                                                                {service.description && (
                                                                    <p className="text-sm text-gray-600 mb-2">
                                                                        {
                                                                            service.description
                                                                        }
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {service.duration_minutes ||
                                                                            30}{" "}
                                                                        min
                                                                    </span>
                                                                    {service.code && (
                                                                        <span>
                                                                            Code:{" "}
                                                                            {
                                                                                service.code
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {service.dentists &&
                                                                service.dentists
                                                                    .length >
                                                                    0 && (
                                                                    <div className="pt-2 border-t border-gray-100">
                                                                        <p className="text-xs text-gray-500 mb-1">
                                                                            Available
                                                                            Dentists:
                                                                        </p>
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {service.dentists
                                                                                .slice(
                                                                                    0,
                                                                                    3
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        dentist
                                                                                    ) => (
                                                                                        <span
                                                                                            key={
                                                                                                dentist.id
                                                                                            }
                                                                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                                                                        >
                                                                                            {
                                                                                                dentist.name
                                                                                            }
                                                                                        </span>
                                                                                    )
                                                                                )}
                                                                            {service
                                                                                .dentists
                                                                                .length >
                                                                                3 && (
                                                                                <span className="text-xs text-gray-500">
                                                                                    +
                                                                                    {service
                                                                                        .dentists
                                                                                        .length -
                                                                                        3}{" "}
                                                                                    more
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center py-8">
                                                    <div className="text-gray-400 mb-2">
                                                        <Stethoscope className="h-12 w-12 mx-auto" />
                                                    </div>
                                                    <p className="text-gray-500">
                                                        No services available
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Please add services in
                                                        the Services Management
                                                        section
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Reason (if no service selected) */}
                                    {!data.service_id && (
                                        <div>
                                            <Label
                                                htmlFor="custom_reason"
                                                className="text-base font-semibold mb-3 block"
                                            >
                                                Custom Reason
                                            </Label>
                                            <Input
                                                id="custom_reason"
                                                value={data.reason}
                                                onChange={(e) =>
                                                    setData(
                                                        "reason",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter custom reason if no service selected..."
                                                className="mt-1"
                                            />
                                        </div>
                                    )}

                                    {/* Duration */}
                                    <div>
                                        <Label
                                            htmlFor="duration"
                                            className="text-base font-semibold mb-3 block"
                                        >
                                            Duration (minutes)
                                        </Label>
                                        <Select
                                            value={data.duration.toString()}
                                            onValueChange={(value) =>
                                                setData(
                                                    "duration",
                                                    parseInt(value)
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">
                                                    15 minutes
                                                </SelectItem>
                                                <SelectItem value="30">
                                                    30 minutes
                                                </SelectItem>
                                                <SelectItem value="45">
                                                    45 minutes
                                                </SelectItem>
                                                <SelectItem value="60">
                                                    1 hour
                                                </SelectItem>
                                                <SelectItem value="90">
                                                    1.5 hours
                                                </SelectItem>
                                                <SelectItem value="120">
                                                    2 hours
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Payment Status */}
                                    <div>
                                        <Label className="text-base font-semibold mb-3 block">
                                            Payment Status
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {PAYMENT_STATUSES.map((status) => (
                                                <button
                                                    key={status.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setData(
                                                            "payment_status",
                                                            status.value
                                                        )
                                                    }
                                                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                                                        data.payment_status ===
                                                        status.value
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-200 bg-white hover:border-gray-300"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <status.icon
                                                            className={`h-4 w-4 ${status.color}`}
                                                        />
                                                        <span className="font-medium text-sm">
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <Label
                                            htmlFor="notes"
                                            className="text-base font-semibold mb-3 block"
                                        >
                                            Additional Notes
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                            placeholder="Any additional notes or special instructions..."
                                            rows={4}
                                            className="resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Submit Button */}
                        {canSubmit && (
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    disabled={processing || isSubmitting}
                                    className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    {processing || isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating Appointment...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <CalendarCheck className="h-5 w-5" />
                                            Create Appointment
                                        </div>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Error Display */}
                        {Object.keys(errors).length > 0 && (
                            <Card className="border-red-200 bg-red-50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <AlertCircle className="h-5 w-5" />
                                        <span className="font-semibold">
                                            Please fix the following errors:
                                        </span>
                                    </div>
                                    <ul className="mt-2 ml-6 text-red-600">
                                        {Object.entries(errors).map(
                                            ([field, error]) => (
                                                <li key={field}>• {error}</li>
                                            )
                                        )}
                                    </ul>

                                    {/* Show waitlist option for conflicts */}
                                    {flash.conflict_detected && (
                                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                                                <Clock className="h-5 w-5" />
                                                <span className="font-semibold">
                                                    Alternative Option Available
                                                </span>
                                            </div>
                                            <p className="text-blue-600 mb-3">
                                                This time slot is already
                                                booked. Would you like to add
                                                this patient to our waitlist?
                                                We'll contact you when a slot
                                                becomes available.
                                            </p>
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    setConflictData(
                                                        flash.conflict_data
                                                    );
                                                    setShowConflictModal(true);
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Clock className="h-4 w-4 mr-2" />
                                                Add to Waitlist
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </form>
                </div>
            </div>

            {/* Conflict Resolution Modal */}
            <Dialog
                open={showConflictModal}
                onOpenChange={setShowConflictModal}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            Add to Waitlist
                        </DialogTitle>
                        <DialogDescription>
                            Add this patient to our waitlist. We'll contact you
                            when a slot becomes available.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Priority Selection */}
                        <div>
                            <Label className="text-sm font-medium">
                                Priority Level
                            </Label>
                            <Select
                                value={waitlistPriority}
                                onValueChange={setWaitlistPriority}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urgent">
                                        Urgent - Emergency cases
                                    </SelectItem>
                                    <SelectItem value="high">
                                        High - Important procedures
                                    </SelectItem>
                                    <SelectItem value="normal">
                                        Normal - Regular checkups
                                    </SelectItem>
                                    <SelectItem value="low">
                                        Low - Cosmetic procedures
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Contact Method */}
                        <div>
                            <Label className="text-sm font-medium">
                                Preferred Contact Method
                            </Label>
                            <Select
                                value={contactMethod}
                                onValueChange={setContactMethod}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phone">
                                        Phone Call
                                    </SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="sms">
                                        SMS/Text
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowConflictModal(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    if (conflictData) {
                                        const waitlistData = {
                                            ...conflictData,
                                            priority: waitlistPriority,
                                            preferred_contact_method:
                                                contactMethod,
                                        };

                                        router.post(
                                            route(
                                                "clinic.appointments.add-to-waitlist",
                                                clinic.id
                                            ),
                                            waitlistData,
                                            {
                                                onSuccess: () => {
                                                    setShowConflictModal(false);
                                                    setConflictData(null);
                                                    reset();
                                                },
                                            }
                                        );
                                    }
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Add to Waitlist
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
