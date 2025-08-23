import { Head, useForm } from "@inertiajs/react";
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
import { Link } from "@inertiajs/react";
import { useState } from "react";
import PatientSelector from "@/Components/Appointment/PatientSelector";
import TimeSlotSelector from "@/Components/Appointment/TimeSlotSelector";

const APPOINTMENT_REASONS = [
    {
        id: "cleaning",
        label: "Teeth Cleaning",
        icon: "🦷",
        color: "bg-blue-100 text-blue-700",
    },
    {
        id: "checkup",
        label: "Regular Checkup",
        icon: "👁️",
        color: "bg-green-100 text-green-700",
    },
    {
        id: "whitening",
        label: "Teeth Whitening",
        icon: "✨",
        color: "bg-purple-100 text-purple-700",
    },
    {
        id: "filling",
        label: "Dental Filling",
        icon: "🔧",
        color: "bg-orange-100 text-orange-700",
    },
    {
        id: "extraction",
        label: "Tooth Extraction",
        icon: "🦷",
        color: "bg-red-100 text-red-700",
    },
    {
        id: "root_canal",
        label: "Root Canal",
        icon: "🔬",
        color: "bg-indigo-100 text-indigo-700",
    },
    {
        id: "crown",
        label: "Dental Crown",
        icon: "👑",
        color: "bg-yellow-100 text-yellow-700",
    },
    {
        id: "bridge",
        label: "Dental Bridge",
        icon: "🌉",
        color: "bg-teal-100 text-teal-700",
    },
    {
        id: "denture",
        label: "Denture",
        icon: "🦷",
        color: "bg-pink-100 text-pink-700",
    },
    {
        id: "braces",
        label: "Braces/Orthodontics",
        icon: "🦷",
        color: "bg-cyan-100 text-cyan-700",
    },
    {
        id: "implant",
        label: "Dental Implant",
        icon: "🦷",
        color: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "other",
        label: "Other",
        icon: "📋",
        color: "bg-gray-100 text-gray-700",
    },
];

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
}) {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedDentist, setSelectedDentist] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedReason, setSelectedReason] = useState("");
    const [showCustomReason, setShowCustomReason] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleReasonChange = (reason) => {
        setSelectedReason(reason);
        setData("reason", reason);
        setShowCustomReason(reason === "other");
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
        selectedReason;

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
                                    {/* Appointment Reason */}
                                    <div>
                                        <Label className="text-base font-semibold mb-3 block">
                                            Appointment Reason
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {APPOINTMENT_REASONS.map(
                                                (reason) => (
                                                    <button
                                                        key={reason.id}
                                                        type="button"
                                                        onClick={() =>
                                                            handleReasonChange(
                                                                reason.id
                                                            )
                                                        }
                                                        className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                                                            selectedReason ===
                                                            reason.id
                                                                ? "border-blue-500 bg-blue-50 shadow-md"
                                                                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-2xl">
                                                                {reason.icon}
                                                            </span>
                                                            <span className="font-medium text-sm">
                                                                {reason.label}
                                                            </span>
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                        {showCustomReason && (
                                            <div className="mt-4">
                                                <Label htmlFor="custom_reason">
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
                                                    placeholder="Enter custom reason..."
                                                    className="mt-1"
                                                />
                                            </div>
                                        )}
                                    </div>

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
                                </CardContent>
                            </Card>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
