import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Badge } from "@/Components/ui/badge";
import {
    Trash2,
    Pencil,
    ArrowLeft,
    Tag,
    DollarSign,
    CalendarDays,
    FileText,
    ClipboardPlus,
    ClipboardList,
    Image,
    Lightbulb,
    Users,
    Stethoscope,
    NotebookPen,
    ReceiptText,
    Pill,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Heart,
    Shield,
    Calendar,
    TrendingUp,
    Package,
    CreditCard,
    FileImage,
    FileText as FileTextIcon,
    Activity,
    Zap,
    Circle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { format } from "date-fns";
import ImageGallery from "@/Components/ImageGallery";

export default function Show({ auth, treatment }) {
    useEffect(() => {
        console.log("Treatment prop changed:", treatment);
        console.log("Appointment data:", treatment.appointment);
    }, [treatment]);

    const { delete: destroy } = useForm({});

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this treatment?")) {
            destroy(
                route("clinic.treatments.destroy", {
                    clinic: auth.clinic_id,
                    treatment: treatment.id,
                })
            );
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500 text-white";
            case "in_progress":
                return "bg-blue-500 text-white";
            case "scheduled":
                return "bg-yellow-500 text-white";
            case "cancelled":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const getPaymentStatusBadgeVariant = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "partial":
                return "bg-yellow-100 text-yellow-800";
            case "pending":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getOutcomeBadgeVariant = (outcome) => {
        switch (outcome) {
            case "successful":
                return "bg-green-100 text-green-800";
            case "partial":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "pending":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDuration = (minutes) => {
        if (!minutes) return "Not specified";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins} minutes`;
    };

    const renderArrayData = (data, title) => {
        if (!data || data.length === 0) {
            return (
                <div className="text-gray-500 text-sm italic">
                    No {title.toLowerCase()} recorded
                </div>
            );
        }
        return (
            <div className="space-y-2">
                {data.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        {typeof item === "object" ? JSON.stringify(item) : item}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            isClinicPage={true}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Treatment Details
                </h2>
            }
        >
            <Head title={`Treatment: ${treatment.name}`} />

            <div key={treatment.id} className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Enhanced Header Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl">
                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>

                        <div className="relative p-8">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                {/* Left side - Treatment info */}
                                <div className="flex items-center gap-6">
                                    {/* Treatment icon */}
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                                            <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center">
                                                <NotebookPen className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        {/* Status indicator */}
                                        <div
                                            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-md ${
                                                treatment.status === "completed"
                                                    ? "bg-green-400"
                                                    : treatment.status ===
                                                      "in_progress"
                                                    ? "bg-blue-400"
                                                    : treatment.status ===
                                                      "scheduled"
                                                    ? "bg-yellow-400"
                                                    : "bg-red-400"
                                            }`}
                                        ></div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={route(
                                                    "clinic.treatments.index",
                                                    {
                                                        clinic: auth.clinic_id,
                                                    }
                                                )}
                                                className="text-white/80 hover:text-white transition-colors"
                                            >
                                                <ArrowLeft className="h-5 w-5" />
                                            </Link>
                                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                                {treatment.name}
                                            </h1>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/90 text-sm">
                                            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                                                <FileText className="h-3 w-3" />
                                                #{treatment.id}
                                            </span>
                                            <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                                                <Calendar className="h-3 w-3" />
                                                {format(
                                                    new Date(
                                                        treatment.created_at
                                                    ),
                                                    "PPP"
                                                )}
                                            </span>
                                            {treatment.patient && (
                                                <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                                                    <Users className="h-3 w-3" />
                                                    {
                                                        treatment.patient
                                                            .full_name
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Status badges and actions */}
                                <div className="flex flex-col gap-4">
                                    {/* Status badges */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${
                                                treatment.status === "completed"
                                                    ? "bg-green-500/80 border border-green-400/50"
                                                    : treatment.status ===
                                                      "in_progress"
                                                    ? "bg-blue-500/80 border border-blue-400/50"
                                                    : treatment.status ===
                                                      "scheduled"
                                                    ? "bg-yellow-500/80 border border-yellow-400/50"
                                                    : "bg-red-500/80 border border-red-400/50"
                                            }`}
                                        >
                                            {treatment.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                treatment.status
                                                    .slice(1)
                                                    .replace("_", " ")}
                                        </div>
                                        <div
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${
                                                treatment.payment_status ===
                                                "completed"
                                                    ? "bg-green-500/80 border border-green-400/50"
                                                    : treatment.payment_status ===
                                                      "partial"
                                                    ? "bg-yellow-500/80 border border-yellow-400/50"
                                                    : "bg-red-500/80 border border-red-400/50"
                                            }`}
                                        >
                                            {treatment.payment_status
                                                ? treatment.payment_status
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  treatment.payment_status.slice(
                                                      1
                                                  )
                                                : "Pending"}{" "}
                                            Payment
                                        </div>
                                        {treatment.outcome && (
                                            <div
                                                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${
                                                    treatment.outcome ===
                                                    "successful"
                                                        ? "bg-green-500/80 border border-green-400/50"
                                                        : treatment.outcome ===
                                                          "partial"
                                                        ? "bg-yellow-500/80 border border-yellow-400/50"
                                                        : "bg-red-500/80 border border-red-400/50"
                                                }`}
                                            >
                                                {treatment.outcome
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    treatment.outcome.slice(
                                                        1
                                                    )}{" "}
                                                Outcome
                                            </div>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3">
                                        <Link
                                            href={route(
                                                "clinic.treatments.edit",
                                                {
                                                    clinic: auth.clinic_id,
                                                    treatment: treatment.id,
                                                }
                                            )}
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit Treatment
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDelete}
                                            className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600/80 border-red-400/50 text-white backdrop-blur-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                        {/* Main Content - 3/5 width */}
                        <div className="xl:col-span-3">
                            {/* Patient & Dentist Information */}
                            <Card className="bg-white shadow-md rounded-xl border-0 mb-6">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        Patient & Dentist Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Patient
                                            </p>
                                            <Link
                                                href={route(
                                                    "clinic.patients.show",
                                                    {
                                                        clinic: auth.clinic_id,
                                                        patient:
                                                            treatment.patient
                                                                .id,
                                                    }
                                                )}
                                                className="text-blue-600 hover:underline text-lg font-semibold"
                                            >
                                                {treatment.patient?.full_name ||
                                                    "N/A"}
                                            </Link>
                                        </div>
                                        {treatment.appointment && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Related Appointment
                                                </p>
                                                <p className="text-base">
                                                    {format(
                                                        new Date(
                                                            treatment.appointment.scheduled_at
                                                        ),
                                                        "PPP"
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4" />
                                                Dentist
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {treatment.dentist?.name ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                        {treatment.service && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                    <Tag className="h-4 w-4" />
                                                    Service
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-semibold">
                                                        {treatment.service.name}
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {
                                                            treatment.service
                                                                .category
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Treatment Details */}
                            <Card className="bg-white shadow-md rounded-xl border-0 mb-6">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        Treatment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                Cost
                                            </p>
                                            <p className="text-2xl font-bold text-green-600">
                                                ₱
                                                {parseFloat(
                                                    treatment.cost
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Duration
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {formatDuration(
                                                    treatment.estimated_duration_minutes
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Description
                                        </p>
                                        <p className="text-base leading-relaxed bg-gray-50 p-4 rounded-lg">
                                            {treatment.description ||
                                                "No description provided."}
                                        </p>
                                    </div>

                                    {treatment.diagnosis && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                Diagnosis
                                            </p>
                                            <p className="text-base leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
                                                {treatment.diagnosis}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4" />
                                                Start Date
                                            </p>
                                            <p className="text-base font-semibold">
                                                {treatment.start_date
                                                    ? format(
                                                          new Date(
                                                              treatment.start_date
                                                          ),
                                                          "PPP"
                                                      )
                                                    : "Not specified"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4" />
                                                End Date
                                            </p>
                                            <p className="text-base font-semibold">
                                                {treatment.end_date
                                                    ? format(
                                                          new Date(
                                                              treatment.end_date
                                                          ),
                                                          "PPP"
                                                      )
                                                    : "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    {treatment.treatment_phase && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Treatment Phase
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="text-sm"
                                            >
                                                {treatment.treatment_phase
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    treatment.treatment_phase
                                                        .slice(1)
                                                        .replace("_", " ")}
                                            </Badge>
                                        </div>
                                    )}

                                    {treatment.notes && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                <ClipboardList className="h-4 w-4" />
                                                Notes
                                            </p>
                                            <p className="text-base leading-relaxed bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-200">
                                                {treatment.notes}
                                            </p>
                                        </div>
                                    )}

                                    {treatment.recommendations && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                <Lightbulb className="h-4 w-4" />
                                                Recommendations
                                            </p>
                                            <p className="text-base leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-200">
                                                {treatment.recommendations}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Clinical Documentation */}
                            <Card className="bg-white shadow-md rounded-xl border-0 mb-6">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-blue-600" />
                                        Clinical Documentation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    {treatment.tooth_numbers &&
                                        treatment.tooth_numbers.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                                                    <Circle className="h-4 w-4" />
                                                    Teeth Involved (
                                                    {
                                                        treatment.tooth_numbers
                                                            .length
                                                    }
                                                    )
                                                </p>

                                                {/* Visual Dental Chart */}
                                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-4">
                                                    <h4 className="text-sm font-semibold text-blue-800 mb-3 text-center">
                                                        Dental Chart - Selected
                                                        Teeth
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {/* Upper Teeth */}
                                                        <div className="space-y-2">
                                                            <h5 className="text-xs font-medium text-blue-700 text-center border-b border-blue-200 pb-1">
                                                                Upper Teeth
                                                                (Maxillary)
                                                            </h5>
                                                            <div className="flex justify-center gap-1">
                                                                {Array.from(
                                                                    {
                                                                        length: 16,
                                                                    },
                                                                    (_, i) => {
                                                                        const toothNumber =
                                                                            i +
                                                                            1;
                                                                        const isSelected =
                                                                            treatment.tooth_numbers.includes(
                                                                                toothNumber.toString()
                                                                            );
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    toothNumber
                                                                                }
                                                                                className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${
                                                                                    isSelected
                                                                                        ? "bg-blue-500 text-white border-blue-600 shadow-lg scale-110"
                                                                                        : "bg-white text-gray-400 border-gray-300"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    toothNumber
                                                                                }
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Lower Teeth */}
                                                        <div className="space-y-2">
                                                            <h5 className="text-xs font-medium text-blue-700 text-center border-b border-blue-200 pb-1">
                                                                Lower Teeth
                                                                (Mandibular)
                                                            </h5>
                                                            <div className="flex justify-center gap-1">
                                                                {Array.from(
                                                                    {
                                                                        length: 16,
                                                                    },
                                                                    (_, i) => {
                                                                        const toothNumber =
                                                                            i +
                                                                            17;
                                                                        const isSelected =
                                                                            treatment.tooth_numbers.includes(
                                                                                toothNumber.toString()
                                                                            );
                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    toothNumber
                                                                                }
                                                                                className={`w-6 h-6 rounded border-2 flex items-center justify-center text-xs font-bold transition-all ${
                                                                                    isSelected
                                                                                        ? "bg-blue-500 text-white border-blue-600 shadow-lg scale-110"
                                                                                        : "bg-white text-gray-400 border-gray-300"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    toothNumber
                                                                                }
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Selected Teeth List */}
                                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                    <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                        <Circle className="h-4 w-4 text-blue-600" />
                                                        Selected Teeth Details
                                                    </h5>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                        {treatment.tooth_numbers.map(
                                                            (tooth, index) => {
                                                                const toothNumber =
                                                                    parseInt(
                                                                        tooth
                                                                    );
                                                                const quadrant =
                                                                    toothNumber <=
                                                                    8
                                                                        ? "UR"
                                                                        : toothNumber <=
                                                                          16
                                                                        ? "UL"
                                                                        : toothNumber <=
                                                                          24
                                                                        ? "LL"
                                                                        : "LR";
                                                                const quadrantColors =
                                                                    {
                                                                        UR: "bg-red-100 text-red-800 border-red-200",
                                                                        UL: "bg-blue-100 text-blue-800 border-blue-200",
                                                                        LL: "bg-green-100 text-green-800 border-green-200",
                                                                        LR: "bg-yellow-100 text-yellow-800 border-yellow-200",
                                                                    };

                                                                return (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className={`p-2 rounded-lg border text-xs font-semibold text-center ${quadrantColors[quadrant]}`}
                                                                    >
                                                                        <div className="font-bold text-sm">
                                                                            {
                                                                                tooth
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs opacity-75">
                                                                            Quadrant{" "}
                                                                            {
                                                                                quadrant
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {treatment.allergies && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4" />
                                                Allergies
                                            </p>
                                            <p className="text-base bg-red-50 p-3 rounded-lg border-l-4 border-red-200">
                                                {treatment.allergies}
                                            </p>
                                        </div>
                                    )}

                                    {treatment.medical_history && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                <Heart className="h-4 w-4" />
                                                Medical History
                                            </p>
                                            <p className="text-base bg-purple-50 p-3 rounded-lg border-l-4 border-purple-200">
                                                {treatment.medical_history}
                                            </p>
                                        </div>
                                    )}

                                    {treatment.prescriptions &&
                                        treatment.prescriptions.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <Pill className="h-4 w-4" />
                                                    Prescriptions
                                                </p>
                                                {renderArrayData(
                                                    treatment.prescriptions,
                                                    "Prescriptions"
                                                )}
                                            </div>
                                        )}

                                    {treatment.materials_used &&
                                        treatment.materials_used.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Materials Used
                                                </p>
                                                {renderArrayData(
                                                    treatment.materials_used,
                                                    "Materials"
                                                )}
                                            </div>
                                        )}

                                    {treatment.follow_up_notes && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Follow-up Notes
                                            </p>
                                            <p className="text-base bg-orange-50 p-3 rounded-lg border-l-4 border-orange-200">
                                                {treatment.follow_up_notes}
                                            </p>
                                        </div>
                                    )}

                                    {treatment.next_appointment_date && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Next Appointment
                                            </p>
                                            <p className="text-base font-semibold text-blue-600">
                                                {format(
                                                    new Date(
                                                        treatment.next_appointment_date
                                                    ),
                                                    "PPP"
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Images & Documents */}
                            <Card className="bg-white shadow-md rounded-xl border-0 mb-6">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <FileImage className="h-5 w-5 text-blue-600" />
                                        Images & Documents (
                                        {treatment.images?.length || 0})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {treatment.images &&
                                    treatment.images.length > 0 ? (
                                        <div className="space-y-4">
                                            {/* Image Gallery */}
                                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border-2 border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                    <FileImage className="h-4 w-4 text-blue-600" />
                                                    Treatment Images & X-rays
                                                </h4>
                                                <ImageGallery
                                                    images={treatment.images}
                                                    onImagesChange={() => {}} // Read-only in show page
                                                />
                                            </div>

                                            {/* Image Details */}
                                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                    <FileTextIcon className="h-4 w-4 text-blue-600" />
                                                    Image Information
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="text-sm">
                                                        <span className="font-medium text-gray-600">
                                                            Total Images:
                                                        </span>
                                                        <span className="ml-2 font-semibold text-blue-600">
                                                            {
                                                                treatment.images
                                                                    .length
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="font-medium text-gray-600">
                                                            Upload Date:
                                                        </span>
                                                        <span className="ml-2 font-semibold text-blue-600">
                                                            {format(
                                                                new Date(
                                                                    treatment.updated_at
                                                                ),
                                                                "PPP"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FileImage className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                                No Images Available
                                            </h4>
                                            <p className="text-gray-500 text-sm">
                                                No images or documents have been
                                                uploaded for this treatment.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - 2/5 width */}
                        <div className="xl:col-span-2 flex flex-col gap-6 xl:sticky xl:top-6">
                            {/* Quick Actions */}
                            <Card className="bg-white shadow-md rounded-xl border-0 min-h-[300px]">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-blue-600" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Schedule Follow-up
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <CreditCard className="h-4 w-4 mr-2" />
                                        Process Payment
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <FileTextIcon className="h-4 w-4 mr-2" />
                                        Generate Report
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Pill className="h-4 w-4 mr-2" />
                                        Add Prescription
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        View Patient History
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Schedule Next Visit
                                    </Button>

                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 text-center">
                                            Quick access to common treatment
                                            actions
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Treatment Timeline */}
                            <Card className="bg-white shadow-md rounded-xl border-0 min-h-[350px]">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        Treatment Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Treatment Created
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {format(
                                                        new Date(
                                                            treatment.created_at
                                                        ),
                                                        "PPP"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        {treatment.start_date && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Treatment Started
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {format(
                                                            new Date(
                                                                treatment.start_date
                                                            ),
                                                            "PPP"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {treatment.end_date && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Treatment Completed
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {format(
                                                            new Date(
                                                                treatment.end_date
                                                            ),
                                                            "PPP"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {treatment.next_appointment_date && (
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Next Appointment
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {format(
                                                            new Date(
                                                                treatment.next_appointment_date
                                                            ),
                                                            "PPP"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Additional timeline items for better balance */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-400">
                                                    Treatment Updated
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {format(
                                                        new Date(
                                                            treatment.updated_at
                                                        ),
                                                        "PPP"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-400">
                                                    Records Created
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Treatment documentation
                                                    completed
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 text-center">
                                            Treatment progress timeline
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Insurance Information */}
                            {treatment.insurance_info &&
                                treatment.insurance_info.length > 0 && (
                                    <Card className="bg-white shadow-md rounded-xl border-0 min-h-[150px]">
                                        <CardHeader className="px-6 py-4 border-b">
                                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-blue-600" />
                                                Insurance Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {renderArrayData(
                                                treatment.insurance_info,
                                                "Insurance Information"
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
