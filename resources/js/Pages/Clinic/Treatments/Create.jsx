import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import TreatmentInventorySelector from "@/Components/TreatmentInventorySelector";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    CalendarIcon,
    Loader2,
    Users,
    Stethoscope,
    Tag,
    FileText,
    DollarSign,
    ClipboardPlus,
    ClipboardList,
    Image,
    Lightbulb,
    CheckCircle,
    CalendarDays,
    PlusCircle,
    CalendarCheck,
    Circle,
    Pill,
    AlertTriangle,
    Heart,
    Package,
    Activity,
    TrendingUp,
    Shield,
    CreditCard,
    X,
    ArrowLeft,
    Save,
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

export default function Create({
    auth,
    patients,
    dentists,
    services = [],
    appointments = [],
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: "",
        dentist_id: "",
        service_id: "none",
        name: "",
        description: "",
        cost: "",
        status: "scheduled",
        start_date: undefined,
        end_date: undefined,
        notes: "",
        diagnosis: "",
        procedures_details: [],
        images: [],
        imageFiles: [],
        recommendations: "",
        appointment_id: "",
        tooth_numbers: [],
        prescriptions: [],
        follow_up_notes: "",
        materials_used: [],
        inventory_items: [],
        insurance_info: [],
        payment_status: "pending",
        vital_signs: [],
        allergies: "",
        medical_history: "",
        consent_forms: [],
        treatment_phase: "none",
        outcome: "none",
        next_appointment_date: undefined,
        estimated_duration_minutes: "",
    });

    const [showTemplates, setShowTemplates] = useState(false);
    const [showDentalChart, setShowDentalChart] = useState(false);

    const statuses = [
        { value: "scheduled", label: "Scheduled" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const handleTemplateSelect = (template) => {
        setData({
            name: template.name,
            description: template.description,
            estimated_duration_minutes: template.estimatedDuration.toString(),
            cost: template.estimatedCost.toString(),
            procedures_details: template.procedures,
            tooth_numbers: template.commonTeeth,
            materials_used: template.materials,
            prescriptions: template.prescriptions,
            follow_up_notes: template.followUpNotes,
        });
        setShowTemplates(false);
    };

    const handleTeethChange = (teeth) => {
        setData("tooth_numbers", teeth);
    };

    const submit = (e) => {
        e.preventDefault();
        console.log(
            "Submitting treatment with appointment_id:",
            data.appointment_id
        );
        console.log("Full form data:", data);

        // Create FormData for file uploads
        const formData = new FormData();

        // Add all form data
        Object.keys(data).forEach((key) => {
            if (key === "imageFiles") {
                // Handle file uploads
                if (data.imageFiles && data.imageFiles.length > 0) {
                    data.imageFiles.forEach((file, index) => {
                        formData.append(`imageFiles[${index}]`, file);
                    });
                }
            } else if (
                key === "procedures_details" ||
                key === "tooth_numbers" ||
                key === "prescriptions" ||
                key === "materials_used" ||
                key === "insurance_info" ||
                key === "vital_signs" ||
                key === "consent_forms" ||
                key === "images"
            ) {
                // Handle arrays
                if (data[key] && data[key].length > 0) {
                    data[key].forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                }
            } else if (key === "inventory_items") {
                // Handle inventory_items array with object structure
                if (data[key] && data[key].length > 0) {
                    data[key].forEach((item, index) => {
                        formData.append(
                            `${key}[${index}][inventory_id]`,
                            item.inventory_id
                        );
                        formData.append(
                            `${key}[${index}][quantity_used]`,
                            item.quantity_used
                        );
                        if (item.notes) {
                            formData.append(
                                `${key}[${index}][notes]`,
                                item.notes
                            );
                        }
                    });
                }
            } else if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        // Use router.post for file uploads
        router.post(
            route("clinic.treatments.store", { clinic: auth.clinic_id }),
            formData,
            {
                forceFormData: true,
                onSuccess: () => {
                    console.log("Treatment created successfully");
                },
                onError: (errors) => {
                    console.error("Errors:", errors);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            isClinicPage={true}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("clinic.treatments.index", {
                                clinic: auth.clinic_id,
                            })}
                            className="inline-flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Treatments
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Create New Treatment
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Create Treatment" />

            <div className="py-1">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-10">
                    {/* Main Container */}
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-blue-800 mb-1">
                                            New Treatment Record
                                        </h1>
                                        <p className="text-blue-600 text-sm">
                                            Create a comprehensive treatment
                                            plan for your patient
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className="text-sm text-blue-600 font-medium">
                                                Quick Start
                                            </div>
                                            <div className="text-xs text-blue-500">
                                                Use templates to speed up
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setShowTemplates(!showTemplates)
                                            }
                                            className="bg-white hover:bg-blue-50 border-blue-200"
                                        >
                                            <FileText className="h-4 w-4 mr-2" />
                                            {showTemplates ? "Hide" : "Show"}{" "}
                                            Templates
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Templates Section */}
                        {showTemplates && (
                            <div className="border-b border-gray-200">
                                <div className="p-6">
                                    <TreatmentTemplates
                                        onTemplateSelect={handleTemplateSelect}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Form Content */}
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-5">
                                {/* Patient & Dentist Information */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <Users className="h-5 w-5 text-blue-600" />
                                            Patient & Dentist Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {/* Patient Select */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="patient_id"
                                                    className="font-medium text-gray-700 text-sm"
                                                >
                                                    Patient *
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "patient_id",
                                                            value
                                                        )
                                                    }
                                                    value={data.patient_id}
                                                >
                                                    <SelectTrigger className="w-full h-10 text-sm">
                                                        <SelectValue placeholder="Select a patient" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {patients &&
                                                            patients.map(
                                                                (patient) => (
                                                                    <SelectItem
                                                                        key={
                                                                            patient.id
                                                                        }
                                                                        value={patient.id.toString()}
                                                                        className="text-sm"
                                                                    >
                                                                        {patient.user
                                                                            ? patient
                                                                                  .user
                                                                                  .name
                                                                            : `${
                                                                                  patient.first_name ||
                                                                                  ""
                                                                              } ${
                                                                                  patient.last_name ||
                                                                                  ""
                                                                              }`}
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

                                            {/* Dentist Select */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="dentist_id"
                                                    className="font-medium text-gray-700 text-sm"
                                                >
                                                    Dentist *
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "dentist_id",
                                                            value
                                                        )
                                                    }
                                                    value={data.dentist_id}
                                                >
                                                    <SelectTrigger className="w-full h-10 text-sm">
                                                        <SelectValue placeholder="Select a dentist" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dentists &&
                                                            dentists.map(
                                                                (dentist) => (
                                                                    <SelectItem
                                                                        key={
                                                                            dentist.id
                                                                        }
                                                                        value={dentist.id.toString()}
                                                                    >
                                                                        {
                                                                            dentist.name
                                                                        }
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
                                    </CardContent>
                                </Card>

                                {/* Treatment Details */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <Tag className="h-5 w-5 text-blue-600" />
                                            Treatment Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-8">
                                            {/* Basic Information */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Treatment Name */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="name"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Treatment Name *
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full h-10 text-sm"
                                                        placeholder="Enter treatment name"
                                                    />
                                                    <InputError
                                                        message={errors.name}
                                                        className="mt-2"
                                                    />
                                                </div>

                                                {/* Cost */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="cost"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Cost (₱)
                                                    </Label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                            <span className="text-gray-500 text-lg">
                                                                ₱
                                                            </span>
                                                        </div>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            className="pl-8 w-full h-10 text-sm"
                                                            value={data.cost}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "cost",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                    <InputError
                                                        message={errors.cost}
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="description"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
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
                                                    className="w-full text-sm"
                                                    rows="3"
                                                    placeholder="Describe the treatment plan..."
                                                />
                                                <InputError
                                                    message={errors.description}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Diagnosis */}
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="diagnosis"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
                                                    Diagnosis
                                                </Label>
                                                <Textarea
                                                    id="diagnosis"
                                                    value={data.diagnosis || ""}
                                                    onChange={(e) =>
                                                        setData(
                                                            "diagnosis",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-sm"
                                                    rows="3"
                                                    placeholder="Enter diagnosis details..."
                                                />
                                                <InputError
                                                    message={errors.diagnosis}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Service & Appointment */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <CalendarCheck className="h-5 w-5 text-blue-600" />
                                            Service & Appointment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Related Appointment */}
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="appointment_id"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
                                                    Related Appointment
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "appointment_id",
                                                            value
                                                        )
                                                    }
                                                    value={data.appointment_id}
                                                >
                                                    <SelectTrigger className="w-full h-10 text-sm">
                                                        <SelectValue placeholder="Select an appointment" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {appointments &&
                                                            appointments.length >
                                                                0 &&
                                                            appointments.map(
                                                                (
                                                                    appointment
                                                                ) => (
                                                                    <SelectItem
                                                                        key={
                                                                            appointment.id
                                                                        }
                                                                        value={appointment.id.toString()}
                                                                    >
                                                                        {format(
                                                                            new Date(
                                                                                appointment.scheduled_at
                                                                            ),
                                                                            "PPP"
                                                                        )}{" "}
                                                                        -{" "}
                                                                        {appointment
                                                                            .patient
                                                                            ?.name ||
                                                                            "Unknown Patient"}{" "}
                                                                        (
                                                                        {appointment.type ||
                                                                            "No Type"}
                                                                        )
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={
                                                        errors.appointment_id
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Service Selection */}
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="service_id"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
                                                    Service
                                                </Label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        setData(
                                                            "service_id",
                                                            value
                                                        );
                                                        // Auto-fill cost and duration if service is selected
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
                                                            if (
                                                                selectedService
                                                            ) {
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
                                                    <SelectTrigger className="w-full h-10 text-sm">
                                                        <SelectValue placeholder="Select a service (optional)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">
                                                            No Service Selected
                                                        </SelectItem>
                                                        {services &&
                                                        services.length > 0 ? (
                                                            services.map(
                                                                (service) => (
                                                                    <SelectItem
                                                                        key={
                                                                            service.id
                                                                        }
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
                                                                                •
                                                                                ₱
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
                                                                )
                                                            )
                                                        ) : (
                                                            <SelectItem
                                                                value="none"
                                                                disabled
                                                            >
                                                                No services
                                                                available.
                                                                Please create
                                                                services first.
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.service_id}
                                                    className="mt-2"
                                                />
                                                {(!services ||
                                                    services.length === 0) && (
                                                    <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                                        💡 No services created
                                                        yet. You can still
                                                        create a treatment
                                                        without linking it to a
                                                        service, or create
                                                        services first in the
                                                        Services section.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Clinical Information */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-blue-600" />
                                            Clinical Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-8">
                                            {/* Medical Information */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Allergies */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="allergies"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Allergies
                                                    </Label>
                                                    <Textarea
                                                        id="allergies"
                                                        value={
                                                            data.allergies || ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "allergies",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full text-base"
                                                        rows="3"
                                                        placeholder="Enter patient allergies..."
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.allergies
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                {/* Medical History */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="medical_history"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Medical History
                                                    </Label>
                                                    <Textarea
                                                        id="medical_history"
                                                        value={
                                                            data.medical_history ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "medical_history",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full text-base"
                                                        rows="3"
                                                        placeholder="Enter relevant medical history..."
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.medical_history
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>

                                            {/* Treatment Status */}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                                {/* Treatment Phase */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="treatment_phase"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Treatment Phase
                                                    </Label>
                                                    <Select
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            setData(
                                                                "treatment_phase",
                                                                value
                                                            )
                                                        }
                                                        value={
                                                            data.treatment_phase
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full h-10 text-sm">
                                                            <SelectValue placeholder="Select phase" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                No Phase
                                                            </SelectItem>
                                                            <SelectItem value="initial">
                                                                Initial
                                                            </SelectItem>
                                                            <SelectItem value="treatment">
                                                                Treatment
                                                            </SelectItem>
                                                            <SelectItem value="follow_up">
                                                                Follow-up
                                                            </SelectItem>
                                                            <SelectItem value="maintenance">
                                                                Maintenance
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            errors.treatment_phase
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                {/* Outcome */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="outcome"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Outcome
                                                    </Label>
                                                    <Select
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            setData(
                                                                "outcome",
                                                                value
                                                            )
                                                        }
                                                        value={data.outcome}
                                                    >
                                                        <SelectTrigger className="w-full h-10 text-sm">
                                                            <SelectValue placeholder="Select outcome" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                No Outcome
                                                            </SelectItem>
                                                            <SelectItem value="successful">
                                                                Successful
                                                            </SelectItem>
                                                            <SelectItem value="partial">
                                                                Partial
                                                            </SelectItem>
                                                            <SelectItem value="failed">
                                                                Failed
                                                            </SelectItem>
                                                            <SelectItem value="pending">
                                                                Pending
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={errors.outcome}
                                                        className="mt-2"
                                                    />
                                                </div>

                                                {/* Payment Status */}
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="payment_status"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Payment Status
                                                    </Label>
                                                    <Select
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            setData(
                                                                "payment_status",
                                                                value
                                                            )
                                                        }
                                                        value={
                                                            data.payment_status
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full h-10 text-sm">
                                                            <SelectValue placeholder="Select payment status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">
                                                                Pending
                                                            </SelectItem>
                                                            <SelectItem value="partial">
                                                                Partial
                                                            </SelectItem>
                                                            <SelectItem value="completed">
                                                                Completed
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError
                                                        message={
                                                            errors.payment_status
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Dental Chart & Clinical Details */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <Circle className="h-5 w-5 text-blue-600" />
                                            Dental Chart & Clinical Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-8">
                                            {/* Teeth Involved */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="font-semibold text-gray-700 text-base flex items-center gap-2">
                                                        <Circle className="h-4 w-4" />
                                                        Teeth Involved
                                                    </Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setShowDentalChart(
                                                                !showDentalChart
                                                            )
                                                        }
                                                        className="bg-white hover:bg-blue-50 text-sm px-3 py-1"
                                                    >
                                                        {showDentalChart
                                                            ? "Hide Chart"
                                                            : "Show Chart"}
                                                    </Button>
                                                </div>

                                                {/* Dental Chart Section */}
                                                {showDentalChart && (
                                                    <div className="border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                                                        <DentalChart
                                                            selectedTeeth={
                                                                data.tooth_numbers
                                                            }
                                                            onTeethChange={
                                                                handleTeethChange
                                                            }
                                                            className="mb-4"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Selected Teeth Display - Always Visible */}
                                            {data.tooth_numbers &&
                                                data.tooth_numbers.length >
                                                    0 && (
                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm font-semibold text-blue-800">
                                                                    Selected
                                                                    Teeth
                                                                </span>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-blue-100 text-blue-700"
                                                                >
                                                                    {
                                                                        data
                                                                            .tooth_numbers
                                                                            .length
                                                                    }
                                                                </Badge>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setData(
                                                                        "tooth_numbers",
                                                                        []
                                                                    )
                                                                }
                                                                className="h-7 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                                                            >
                                                                Clear All
                                                            </Button>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {data.tooth_numbers.map(
                                                                (
                                                                    tooth,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-blue-300 shadow-sm hover:shadow-md transition-shadow"
                                                                    >
                                                                        <span className="text-sm font-semibold text-blue-700">
                                                                            {
                                                                                tooth
                                                                            }
                                                                        </span>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                const newToothNumbers =
                                                                                    (
                                                                                        data.tooth_numbers ||
                                                                                        []
                                                                                    ).filter(
                                                                                        (
                                                                                            _,
                                                                                            i
                                                                                        ) =>
                                                                                            i !==
                                                                                            index
                                                                                    );
                                                                                setData(
                                                                                    "tooth_numbers",
                                                                                    newToothNumbers
                                                                                );
                                                                            }}
                                                                            className="h-5 w-5 p-0 hover:bg-red-100 rounded-full"
                                                                        >
                                                                            <X className="h-3 w-3 text-red-500" />
                                                                        </Button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {/* Manual Input Section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        placeholder="Enter tooth number (e.g., 12, 13, 14)"
                                                        className="flex-1 h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        onKeyPress={(e) => {
                                                            if (
                                                                e.key ===
                                                                "Enter"
                                                            ) {
                                                                e.preventDefault();
                                                                const value =
                                                                    e.target.value.trim();
                                                                if (
                                                                    value &&
                                                                    !data.tooth_numbers?.includes(
                                                                        value
                                                                    )
                                                                ) {
                                                                    setData(
                                                                        "tooth_numbers",
                                                                        [
                                                                            ...(data.tooth_numbers ||
                                                                                []),
                                                                            value,
                                                                        ]
                                                                    );
                                                                    e.target.value =
                                                                        "";
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            const input =
                                                                document.querySelector(
                                                                    'input[placeholder*="tooth number"]'
                                                                );
                                                            const value =
                                                                input?.value?.trim();
                                                            if (
                                                                value &&
                                                                !data.tooth_numbers?.includes(
                                                                    value
                                                                )
                                                            ) {
                                                                setData(
                                                                    "tooth_numbers",
                                                                    [
                                                                        ...(data.tooth_numbers ||
                                                                            []),
                                                                        value,
                                                                    ]
                                                                );
                                                                input.value =
                                                                    "";
                                                            }
                                                        }}
                                                        className="h-10 px-4 text-sm bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                                                    >
                                                        <PlusCircle className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Circle className="h-3 w-3" />
                                                    <span>
                                                        Press Enter to add tooth
                                                        number, or use the
                                                        dental chart above
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Prescriptions & Materials */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Prescriptions */}
                                            <div className="space-y-4">
                                                <Label className="font-semibold text-gray-700 text-base flex items-center gap-2">
                                                    <Pill className="h-4 w-4" />
                                                    Prescriptions
                                                </Label>
                                                <div className="space-y-3">
                                                    {data.prescriptions &&
                                                        data.prescriptions.map(
                                                            (
                                                                prescription,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex gap-2"
                                                                >
                                                                    <Input
                                                                        value={
                                                                            prescription
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const newPrescriptions =
                                                                                [
                                                                                    ...(data.prescriptions ||
                                                                                        []),
                                                                                ];
                                                                            newPrescriptions[
                                                                                index
                                                                            ] =
                                                                                e.target.value;
                                                                            setData(
                                                                                "prescriptions",
                                                                                newPrescriptions
                                                                            );
                                                                        }}
                                                                        placeholder="Enter prescription details..."
                                                                        className="flex-1"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const newPrescriptions =
                                                                                (
                                                                                    data.prescriptions ||
                                                                                    []
                                                                                ).filter(
                                                                                    (
                                                                                        _,
                                                                                        i
                                                                                    ) =>
                                                                                        i !==
                                                                                        index
                                                                                );
                                                                            setData(
                                                                                "prescriptions",
                                                                                newPrescriptions
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
                                                            setData(
                                                                "prescriptions",
                                                                [
                                                                    ...(data.prescriptions ||
                                                                        []),
                                                                    "",
                                                                ]
                                                            )
                                                        }
                                                        className="flex items-center gap-2"
                                                    >
                                                        <PlusCircle className="h-4 w-4" />
                                                        Add Prescription
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Materials Used */}
                                            <div className="space-y-4">
                                                <Label className="font-semibold text-gray-700 text-base flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Materials Used
                                                </Label>
                                                <div className="space-y-3">
                                                    {data.materials_used &&
                                                        data.materials_used.map(
                                                            (
                                                                material,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex gap-2"
                                                                >
                                                                    <Input
                                                                        value={
                                                                            material
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const newMaterials =
                                                                                [
                                                                                    ...(data.materials_used ||
                                                                                        []),
                                                                                ];
                                                                            newMaterials[
                                                                                index
                                                                            ] =
                                                                                e.target.value;
                                                                            setData(
                                                                                "materials_used",
                                                                                newMaterials
                                                                            );
                                                                        }}
                                                                        placeholder="Enter material details..."
                                                                        className="flex-1"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const newMaterials =
                                                                                (
                                                                                    data.materials_used ||
                                                                                    []
                                                                                ).filter(
                                                                                    (
                                                                                        _,
                                                                                        i
                                                                                    ) =>
                                                                                        i !==
                                                                                        index
                                                                                );
                                                                            setData(
                                                                                "materials_used",
                                                                                newMaterials
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
                                                            setData(
                                                                "materials_used",
                                                                [
                                                                    ...(data.materials_used ||
                                                                        []),
                                                                    "",
                                                                ]
                                                            )
                                                        }
                                                        className="flex items-center gap-2"
                                                    >
                                                        <PlusCircle className="h-4 w-4" />
                                                        Add Material
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inventory Items Used - Full Width Section */}
                                        <div className="mt-8 -mx-8 px-8 py-6 bg-gradient-to-r from-white-50 to-indigo-50 border-t border-gray-200">
                                            <div className="flex items-center justify-center mb-6"></div>
                                            <div className="w-full">
                                                <TreatmentInventorySelector
                                                    clinicId={
                                                        auth.user.clinic.id
                                                    }
                                                    value={data.inventory_items}
                                                    onChange={(items) =>
                                                        setData(
                                                            "inventory_items",
                                                            items
                                                        )
                                                    }
                                                    disabled={processing}
                                                    showCosts={true}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Follow-up Notes */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-blue-600" />
                                            Follow-up Notes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="follow_up_notes"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
                                                    Follow-up Notes
                                                </Label>
                                                <Textarea
                                                    id="follow_up_notes"
                                                    value={
                                                        data.follow_up_notes ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "follow_up_notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-base"
                                                    rows="3"
                                                    placeholder="Enter follow-up instructions..."
                                                />
                                                <InputError
                                                    message={
                                                        errors.follow_up_notes
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Scheduling */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <CalendarDays className="h-5 w-5 text-blue-600" />
                                            Scheduling & Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Status */}
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="status"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
                                                    Status
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setData("status", value)
                                                    }
                                                    value={data.status}
                                                >
                                                    <SelectTrigger className="w-full h-10 text-sm">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statuses.map(
                                                            (status) => (
                                                                <SelectItem
                                                                    key={
                                                                        status.value
                                                                    }
                                                                    value={
                                                                        status.value
                                                                    }
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.status}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Dates */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="start_date"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Start Date
                                                    </Label>
                                                    <Input
                                                        id="start_date"
                                                        type="date"
                                                        value={
                                                            data.start_date
                                                                ? format(
                                                                      new Date(
                                                                          data.start_date
                                                                      ),
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "start_date",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full h-10 text-sm"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.start_date
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="end_date"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        End Date
                                                    </Label>
                                                    <Input
                                                        id="end_date"
                                                        type="date"
                                                        value={
                                                            data.end_date
                                                                ? format(
                                                                      new Date(
                                                                          data.end_date
                                                                      ),
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "end_date",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full h-10 text-sm"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.end_date
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="next_appointment_date"
                                                        className="font-semibold text-gray-700 text-base"
                                                    >
                                                        Next Appointment
                                                    </Label>
                                                    <Input
                                                        id="next_appointment_date"
                                                        type="date"
                                                        value={
                                                            data.next_appointment_date
                                                                ? format(
                                                                      new Date(
                                                                          data.next_appointment_date
                                                                      ),
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "next_appointment_date",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full h-10 text-sm"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.next_appointment_date
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Procedures Details */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <ClipboardList className="h-5 w-5 text-blue-600" />
                                            Procedures Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            {data.procedures_details &&
                                                data.procedures_details.map(
                                                    (procedure, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-gray-50 relative shadow-sm"
                                                        >
                                                            <div className="flex-1 space-y-4 w-full">
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`procedure-step-${index}`}
                                                                        className="text-sm font-medium mb-2 block"
                                                                    >
                                                                        Step{" "}
                                                                        {index +
                                                                            1}
                                                                    </Label>
                                                                    <Input
                                                                        id={`procedure-step-${index}`}
                                                                        type="text"
                                                                        value={
                                                                            procedure.step ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const newProcedures =
                                                                                [
                                                                                    ...(data.procedures_details ||
                                                                                        []),
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
                                                                        placeholder="e.g., Dental Cleaning"
                                                                        className="w-full h-12 text-base"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`procedure-notes-${index}`}
                                                                        className="text-sm font-medium mb-2 block"
                                                                    >
                                                                        Notes
                                                                    </Label>
                                                                    <Textarea
                                                                        id={`procedure-notes-${index}`}
                                                                        value={
                                                                            procedure.notes ||
                                                                            ""
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const newProcedures =
                                                                                [
                                                                                    ...(data.procedures_details ||
                                                                                        []),
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
                                                                        className="w-full text-base"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => {
                                                                    const newProcedures =
                                                                        (
                                                                            data.procedures_details ||
                                                                            []
                                                                        ).filter(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i !==
                                                                                index
                                                                        );
                                                                    setData(
                                                                        "procedures_details",
                                                                        newProcedures
                                                                    );
                                                                }}
                                                                className="flex-shrink-0 mt-4 sm:mt-0 h-10 w-10 rounded-full"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    )
                                                )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setData(
                                                        "procedures_details",
                                                        [
                                                            ...(data.procedures_details ||
                                                                []),
                                                            {
                                                                step: "",
                                                                notes: "",
                                                            },
                                                        ]
                                                    )
                                                }
                                                className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 py-3 h-12 text-base"
                                            >
                                                <PlusCircle className="h-5 w-5" />
                                                Add Procedure Step
                                            </Button>
                                        </div>
                                        <InputError
                                            message={errors.procedures_details}
                                            className="mt-2"
                                        />
                                    </CardContent>
                                </Card>

                                {/* Images Upload */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <Image className="h-5 w-5 text-blue-600" />
                                            Treatment Images
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <FileUpload
                                            files={data.imageFiles}
                                            onFilesChange={(files) =>
                                                setData("imageFiles", files)
                                            }
                                            accept="image/*"
                                            multiple={true}
                                            maxFiles={10}
                                        />

                                        {/* URL Inputs for existing images */}
                                        {data.images &&
                                            data.images.length > 0 && (
                                                <div className="mt-6 space-y-4">
                                                    <Label className="text-sm font-medium">
                                                        Image URLs:
                                                    </Label>
                                                    {data.images &&
                                                        data.images.map(
                                                            (url, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex gap-2"
                                                                >
                                                                    <Input
                                                                        value={
                                                                            url
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            const newImages =
                                                                                [
                                                                                    ...(data.images ||
                                                                                        []),
                                                                                ];
                                                                            newImages[
                                                                                index
                                                                            ] =
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
                                                                                (
                                                                                    data.images ||
                                                                                    []
                                                                                ).filter(
                                                                                    (
                                                                                        _,
                                                                                        i
                                                                                    ) =>
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
                                                                ...(data.images ||
                                                                    []),
                                                                "",
                                                            ])
                                                        }
                                                        className="flex items-center gap-2"
                                                    >
                                                        <PlusCircle className="h-4 w-4" />
                                                        Add Image URL
                                                    </Button>
                                                </div>
                                            )}

                                        <InputError
                                            message={errors.images}
                                            className="mt-2"
                                        />
                                    </CardContent>
                                </Card>

                                {/* Recommendations & Notes */}
                                <Card className="shadow-md border border-gray-200">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 py-4">
                                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                            <Lightbulb className="h-5 w-5 text-blue-600" />
                                            Recommendations & Notes
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-8">
                                            {/* Recommendations */}
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="recommendations"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
                                                    Recommendations
                                                </Label>
                                                <Textarea
                                                    id="recommendations"
                                                    value={
                                                        data.recommendations ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "recommendations",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-sm"
                                                    rows="4"
                                                    placeholder="Enter post-treatment recommendations..."
                                                />
                                                <InputError
                                                    message={
                                                        errors.recommendations
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Notes */}
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="notes"
                                                    className="font-semibold text-gray-700 text-base"
                                                >
                                                    Additional Notes
                                                </Label>
                                                <Textarea
                                                    id="notes"
                                                    value={data.notes || ""}
                                                    onChange={(e) =>
                                                        setData(
                                                            "notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-sm"
                                                    rows="3"
                                                    placeholder="Add any additional notes about the treatment..."
                                                />
                                                <InputError
                                                    message={errors.notes}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <Link
                                        href={route("clinic.treatments.index", {
                                            clinic: auth.clinic_id,
                                        })}
                                        className="inline-flex items-center px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 uppercase tracking-wider shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-8 py-3 bg-blue-600 border border-transparent rounded-lg font-semibold text-sm text-white uppercase tracking-wider shadow-md hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        {processing && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        <Save className="h-4 w-4 mr-2" />
                                        Create Treatment
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
