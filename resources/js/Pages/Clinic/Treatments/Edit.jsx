import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import {
    CalendarIcon,
    Loader2,
    ArrowLeft,
    Users,
    Stethoscope,
    Tag,
    DollarSign,
    Clock,
    FileText,
    Activity,
    ClipboardList,
    Lightbulb,
    Pill,
    AlertTriangle,
    Heart,
    Package,
    TrendingUp,
    Shield,
    CreditCard,
    PlusCircle,
    X,
    Circle,
    ClipboardPlus,
    Image,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import FileUpload from "@/Components/FileUpload";
import DentalChart from "@/Components/DentalChart";
import TreatmentTemplates from "@/Components/TreatmentTemplates";

export default function Edit({
    auth,
    treatment,
    patients,
    dentists,
    services,
    appointments = [],
}) {
    const [showTemplates, setShowTemplates] = useState(false);
    const [showDentalChart, setShowDentalChart] = useState(false);

    // Show loading state if treatment data is not available
    if (!treatment) {
        return (
            <AuthenticatedLayout
                auth={auth}
                isClinicPage={true}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Loading Treatment...
                    </h2>
                }
            >
                <Head title="Loading Treatment..." />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span>Loading treatment data...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const { data, setData, put, processing, errors, reset } = useForm({
        patient_id: treatment?.patient_id?.toString() || "",
        dentist_id: treatment?.user_id?.toString() || "",
        service_id: treatment?.service_id
            ? treatment.service_id.toString()
            : "none",
        name: treatment?.name || "",
        description: treatment?.description || "",
        cost: treatment?.cost || "",
        status: treatment?.status || "scheduled",
        start_date: treatment?.start_date
            ? new Date(treatment.start_date)
            : undefined,
        end_date: treatment?.end_date
            ? new Date(treatment.end_date)
            : undefined,
        notes: treatment?.notes || "",
        diagnosis: treatment?.diagnosis || "",
        recommendations: treatment?.recommendations || "",
        tooth_numbers: treatment?.tooth_numbers || [],
        prescriptions: treatment?.prescriptions || [],
        follow_up_notes: treatment?.follow_up_notes || "",
        materials_used: treatment?.materials_used || [],
        insurance_info: treatment?.insurance_info || [],
        payment_status: treatment?.payment_status || "pending",
        vital_signs: treatment?.vital_signs || [],
        allergies: treatment?.allergies || "",
        medical_history: treatment?.medical_history || "",
        consent_forms: treatment?.consent_forms || [],
        treatment_phase: treatment?.treatment_phase || "no_phase",
        outcome: treatment?.outcome || "no_outcome",
        next_appointment_date: treatment?.next_appointment_date
            ? new Date(treatment.next_appointment_date)
            : undefined,
        estimated_duration_minutes: treatment?.estimated_duration_minutes || "",
        appointment_id: treatment?.appointment_id || "no_appointment",
        procedures_details: treatment?.procedures_details || [],
        images: treatment?.images || [],
        imageFiles: [],
    });

    const statuses = [
        { value: "scheduled", label: "Scheduled" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const paymentStatuses = [
        { value: "pending", label: "Pending" },
        { value: "partial", label: "Partial" },
        { value: "completed", label: "Completed" },
    ];

    const treatmentPhases = [
        { value: "initial", label: "Initial" },
        { value: "treatment", label: "Treatment" },
        { value: "follow_up", label: "Follow-up" },
        { value: "maintenance", label: "Maintenance" },
    ];

    const outcomes = [
        { value: "successful", label: "Successful" },
        { value: "partial", label: "Partial" },
        { value: "failed", label: "Failed" },
        { value: "pending", label: "Pending" },
    ];

    const submit = (e) => {
        e.preventDefault();
        put(
            route("clinic.treatments.update", {
                clinic: auth.clinic_id,
                treatment: treatment?.id,
            })
        );
    };

    const addArrayItem = (field) => {
        setData(field, [...data[field], ""]);
    };

    const updateArrayItem = (field, index, value) => {
        const newArray = [...data[field]];
        newArray[index] = value;
        setData(field, newArray);
    };

    const removeArrayItem = (field, index) => {
        const newArray = data[field].filter((_, i) => i !== index);
        setData(field, newArray);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            isClinicPage={true}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Treatment: {treatment?.name || "Loading..."}
                </h2>
            }
        >
            <Head
                title={`Edit Treatment: ${treatment?.name || "Loading..."}`}
            />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-lg rounded-xl border-0">
                        <form onSubmit={submit} className="space-y-8">
                            <CardHeader className="px-6 py-6 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={route(
                                                "clinic.treatments.show",
                                                {
                                                    clinic: auth.clinic_id,
                                                    treatment: treatment?.id,
                                                }
                                            )}
                                            className="text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Link>
                                        <CardTitle className="text-2xl font-bold text-gray-900">
                                            Edit Treatment
                                        </CardTitle>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link
                                            href={route(
                                                "clinic.treatments.show",
                                                {
                                                    clinic: auth.clinic_id,
                                                    treatment: treatment?.id,
                                                }
                                            )}
                                        >
                                            <Button variant="outline" size="sm">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            size="sm"
                                        >
                                            {processing && (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Update Treatment
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="px-6 pb-6 space-y-8">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="name">
                                                Treatment Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="service_id">
                                                Service
                                            </Label>
                                            <Select
                                                onValueChange={(value) => {
                                                    setData(
                                                        "service_id",
                                                        value
                                                    );
                                                    if (
                                                        value &&
                                                        value !== "none"
                                                    ) {
                                                        const selectedService =
                                                            services.find(
                                                                (s) =>
                                                                    s.id.toString() ===
                                                                    value
                                                            );
                                                        if (selectedService) {
                                                            setData(
                                                                "cost",
                                                                selectedService.price ||
                                                                    ""
                                                            );
                                                            setData(
                                                                "estimated_duration_minutes",
                                                                selectedService.duration_minutes ||
                                                                    ""
                                                            );
                                                        }
                                                    }
                                                }}
                                                value={data.service_id}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select a service" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        No Service Selected
                                                    </SelectItem>
                                                    {services.map((service) => (
                                                        <SelectItem
                                                            key={service.id}
                                                            value={service.id.toString()}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">
                                                                    {
                                                                        service.name
                                                                    }
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    {
                                                                        service.category
                                                                    }{" "}
                                                                    • ₱
                                                                    {
                                                                        service.price
                                                                    }{" "}
                                                                    •{" "}
                                                                    {
                                                                        service.duration_minutes
                                                                    }
                                                                    min
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.service_id}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                            rows={4}
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <Label htmlFor="cost">
                                                Cost (₱)
                                            </Label>
                                            <Input
                                                id="cost"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.cost}
                                                onChange={(e) =>
                                                    setData(
                                                        "cost",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <InputError
                                                message={errors.cost}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="estimated_duration_minutes">
                                                Duration (minutes)
                                            </Label>
                                            <Input
                                                id="estimated_duration_minutes"
                                                type="number"
                                                min="1"
                                                value={
                                                    data.estimated_duration_minutes
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "estimated_duration_minutes",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <InputError
                                                message={
                                                    errors.estimated_duration_minutes
                                                }
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="status">
                                                Status
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData("status", value)
                                                }
                                                value={data.status}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statuses.map((status) => (
                                                        <SelectItem
                                                            key={status.value}
                                                            value={status.value}
                                                        >
                                                            {status.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.status}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Patient & Dentist Information */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        Patient & Dentist Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="patient_id">
                                                Patient
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData("patient_id", value)
                                                }
                                                value={data.patient_id}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select a patient" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(patients || []).map(
                                                        (patient) => (
                                                            <SelectItem
                                                                key={patient.id}
                                                                value={patient.id.toString()}
                                                            >
                                                                {patient.user
                                                                    ?.name ||
                                                                    "Unknown Patient"}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.patient_id}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="dentist_id">
                                                Dentist
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData("dentist_id", value)
                                                }
                                                value={data.dentist_id}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select a dentist" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(dentists || []).map(
                                                        (dentist) => (
                                                            <SelectItem
                                                                key={dentist.id}
                                                                value={dentist.id.toString()}
                                                            >
                                                                {dentist.name ||
                                                                    "Unknown Dentist"}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.dentist_id}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Related Appointment */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        Related Appointment
                                    </h3>

                                    <div>
                                        <Label htmlFor="appointment_id">
                                            Appointment
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setData("appointment_id", value)
                                            }
                                            value={data.appointment_id}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select an appointment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="no_appointment">
                                                    No Appointment
                                                </SelectItem>
                                                {(appointments || []).map(
                                                    (appointment) => (
                                                        <SelectItem
                                                            key={appointment.id}
                                                            value={appointment.id.toString()}
                                                        >
                                                            {format(
                                                                new Date(
                                                                    appointment.scheduled_at
                                                                ),
                                                                "PPP"
                                                            )}{" "}
                                                            -{" "}
                                                            {appointment.patient
                                                                ?.name ||
                                                                "Unknown Patient"}{" "}
                                                            (
                                                            {appointment.type ||
                                                                "Unknown Type"}
                                                            )
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.appointment_id}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Scheduling */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        Scheduling
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <Label>Start Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal mt-1",
                                                            !data.start_date &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {data.start_date
                                                            ? format(
                                                                  data.start_date,
                                                                  "PPP"
                                                              )
                                                            : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            data.start_date
                                                        }
                                                        onSelect={(date) =>
                                                            setData(
                                                                "start_date",
                                                                date
                                                            )
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={errors.start_date}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label>End Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal mt-1",
                                                            !data.end_date &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {data.end_date
                                                            ? format(
                                                                  data.end_date,
                                                                  "PPP"
                                                              )
                                                            : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={data.end_date}
                                                        onSelect={(date) =>
                                                            setData(
                                                                "end_date",
                                                                date
                                                            )
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={errors.end_date}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label>Next Appointment Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal mt-1",
                                                            !data.next_appointment_date &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {data.next_appointment_date
                                                            ? format(
                                                                  data.next_appointment_date,
                                                                  "PPP"
                                                              )
                                                            : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            data.next_appointment_date
                                                        }
                                                        onSelect={(date) =>
                                                            setData(
                                                                "next_appointment_date",
                                                                date
                                                            )
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={
                                                    errors.next_appointment_date
                                                }
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Clinical Information */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                        Clinical Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="diagnosis">
                                                Diagnosis
                                            </Label>
                                            <Textarea
                                                id="diagnosis"
                                                value={data.diagnosis}
                                                onChange={(e) =>
                                                    setData(
                                                        "diagnosis",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                                rows={3}
                                                placeholder="Enter diagnosis details..."
                                            />
                                            <InputError
                                                message={errors.diagnosis}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="allergies">
                                                Allergies
                                            </Label>
                                            <Textarea
                                                id="allergies"
                                                value={data.allergies}
                                                onChange={(e) =>
                                                    setData(
                                                        "allergies",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                                rows={3}
                                                placeholder="Enter patient allergies..."
                                            />
                                            <InputError
                                                message={errors.allergies}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="medical_history">
                                            Medical History
                                        </Label>
                                        <Textarea
                                            id="medical_history"
                                            value={data.medical_history}
                                            onChange={(e) =>
                                                setData(
                                                    "medical_history",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                            rows={3}
                                            placeholder="Enter relevant medical history..."
                                        />
                                        <InputError
                                            message={errors.medical_history}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="treatment_phase">
                                                Treatment Phase
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData(
                                                        "treatment_phase",
                                                        value
                                                    )
                                                }
                                                value={data.treatment_phase}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select phase" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="no_phase">
                                                        No Phase
                                                    </SelectItem>
                                                    {treatmentPhases.map(
                                                        (phase) => (
                                                            <SelectItem
                                                                key={
                                                                    phase.value
                                                                }
                                                                value={
                                                                    phase.value
                                                                }
                                                            >
                                                                {phase.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.treatment_phase}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="outcome">
                                                Outcome
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData("outcome", value)
                                                }
                                                value={data.outcome}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select outcome" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="no_outcome">
                                                        No Outcome
                                                    </SelectItem>
                                                    {outcomes.map((outcome) => (
                                                        <SelectItem
                                                            key={outcome.value}
                                                            value={
                                                                outcome.value
                                                            }
                                                        >
                                                            {outcome.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.outcome}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Teeth Involved */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Circle className="h-5 w-5 text-blue-600" />
                                        Teeth Involved
                                    </h3>

                                    <div className="space-y-3">
                                        {(data.tooth_numbers || []).map(
                                            (tooth, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <Input
                                                        value={tooth}
                                                        onChange={(e) =>
                                                            updateArrayItem(
                                                                "tooth_numbers",
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g., 12, 13, 14"
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "tooth_numbers",
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                addArrayItem("tooth_numbers")
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add Tooth Number
                                        </Button>
                                    </div>
                                </div>

                                {/* Prescriptions */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Pill className="h-5 w-5 text-blue-600" />
                                        Prescriptions
                                    </h3>

                                    <div className="space-y-3">
                                        {(data.prescriptions || []).map(
                                            (prescription, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <Input
                                                        value={prescription}
                                                        onChange={(e) =>
                                                            updateArrayItem(
                                                                "prescriptions",
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter prescription details..."
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "prescriptions",
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                addArrayItem("prescriptions")
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add Prescription
                                        </Button>
                                    </div>
                                </div>

                                {/* Materials Used */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-blue-600" />
                                        Materials Used
                                    </h3>

                                    <div className="space-y-3">
                                        {(data.materials_used || []).map(
                                            (material, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <Input
                                                        value={material}
                                                        onChange={(e) =>
                                                            updateArrayItem(
                                                                "materials_used",
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter material details..."
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            removeArrayItem(
                                                                "materials_used",
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                addArrayItem("materials_used")
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add Material
                                        </Button>
                                    </div>
                                </div>

                                {/* Procedures Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <ClipboardPlus className="h-5 w-5 text-blue-600" />
                                        Procedures Details
                                    </h3>

                                    <div className="space-y-4">
                                        {(data.procedures_details || []).map(
                                            (procedure, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <div className="flex-1 space-y-2">
                                                        <Input
                                                            value={
                                                                procedure.step ||
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const newProcedures =
                                                                    [
                                                                        ...data.procedures_details,
                                                                    ];
                                                                newProcedures[
                                                                    index
                                                                ].step =
                                                                    e.target.value;
                                                                setData(
                                                                    "procedures_details",
                                                                    newProcedures
                                                                );
                                                            }}
                                                            placeholder={`Step ${
                                                                index + 1
                                                            }`}
                                                            className="flex-1"
                                                        />
                                                        <Textarea
                                                            value={
                                                                procedure.notes ||
                                                                ""
                                                            }
                                                            onChange={(e) => {
                                                                const newProcedures =
                                                                    [
                                                                        ...data.procedures_details,
                                                                    ];
                                                                newProcedures[
                                                                    index
                                                                ].notes =
                                                                    e.target.value;
                                                                setData(
                                                                    "procedures_details",
                                                                    newProcedures
                                                                );
                                                            }}
                                                            placeholder="Detailed notes for this step"
                                                            rows="3"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newProcedures =
                                                                data.procedures_details.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index
                                                                );
                                                            setData(
                                                                "procedures_details",
                                                                newProcedures
                                                            );
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setData("procedures_details", [
                                                    ...data.procedures_details,
                                                    { step: "", notes: "" },
                                                ])
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add Procedure Step
                                        </Button>
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Image className="h-5 w-5 text-blue-600" />
                                        Treatment Images
                                    </h3>

                                    <div className="space-y-3">
                                        {(data.images || []).map(
                                            (url, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2"
                                                >
                                                    <Input
                                                        value={url}
                                                        onChange={(e) => {
                                                            const newImages = [
                                                                ...data.images,
                                                            ];
                                                            newImages[index] =
                                                                e.target.value;
                                                            setData(
                                                                "images",
                                                                newImages
                                                            );
                                                        }}
                                                        placeholder="Enter image URL"
                                                        className="flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const newImages =
                                                                data.images.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index
                                                                );
                                                            setData(
                                                                "images",
                                                                newImages
                                                            );
                                                        }}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setData("images", [
                                                    ...data.images,
                                                    "",
                                                ])
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Add Image URL
                                        </Button>
                                    </div>
                                </div>

                                {/* Notes & Recommendations */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <ClipboardList className="h-5 w-5 text-blue-600" />
                                        Notes & Recommendations
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="notes">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) =>
                                                    setData(
                                                        "notes",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                                rows={4}
                                                placeholder="Enter treatment notes..."
                                            />
                                            <InputError
                                                message={errors.notes}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="recommendations">
                                                Recommendations
                                            </Label>
                                            <Textarea
                                                id="recommendations"
                                                value={data.recommendations}
                                                onChange={(e) =>
                                                    setData(
                                                        "recommendations",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                                rows={4}
                                                placeholder="Enter post-treatment recommendations..."
                                            />
                                            <InputError
                                                message={errors.recommendations}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="follow_up_notes">
                                            Follow-up Notes
                                        </Label>
                                        <Textarea
                                            id="follow_up_notes"
                                            value={data.follow_up_notes}
                                            onChange={(e) =>
                                                setData(
                                                    "follow_up_notes",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                            rows={3}
                                            placeholder="Enter follow-up instructions..."
                                        />
                                        <InputError
                                            message={errors.follow_up_notes}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Payment & Status */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-blue-600" />
                                        Payment & Status
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="payment_status">
                                                Payment Status
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData(
                                                        "payment_status",
                                                        value
                                                    )
                                                }
                                                value={data.payment_status}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentStatuses.map(
                                                        (status) => (
                                                            <SelectItem
                                                                key={
                                                                    status.value
                                                                }
                                                                value={
                                                                    status.value
                                                                }
                                                            >
                                                                {status.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.payment_status}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
