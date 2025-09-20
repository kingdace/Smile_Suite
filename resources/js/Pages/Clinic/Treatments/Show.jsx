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
    Package,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Heart,
    Shield,
    Calendar,
    TrendingUp,
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
        console.log("Inventory items:", treatment?.inventoryItems);
        console.log(
            "Inventory items count:",
            treatment?.inventoryItems?.length
        );
        console.log("Inventory deducted:", treatment?.inventory_deducted);
        console.log("Treatment keys:", Object.keys(treatment || {}));
        console.log("Inventory items type:", typeof treatment?.inventoryItems);
        console.log(
            "Inventory items is array:",
            Array.isArray(treatment?.inventoryItems)
        );
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

                    {/* Two-Column Layout for Patient & Dentist Information */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6">
                        {/* Patient & Dentist Information - 3/5 width */}
                        <div className="xl:col-span-3">
                            <Card className="bg-white shadow-md rounded-xl border-0 h-full">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        Patient & Dentist Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        {/* Patient Information */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                                            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                                                <Users className="h-5 w-5" />
                                                Patient Details
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                                        Patient Name
                                                    </p>
                                                    <Link
                                                        href={route(
                                                            "clinic.patients.show",
                                                            {
                                                                clinic: auth.clinic_id,
                                                                patient:
                                                                    treatment
                                                                        .patient
                                                                        ?.id,
                                                            }
                                                        )}
                                                        className="text-blue-600 hover:underline text-lg font-semibold"
                                                    >
                                                        {treatment.patient
                                                            ?.full_name ||
                                                            "N/A"}
                                                    </Link>
                                                </div>
                                                {treatment.patient
                                                    ?.date_of_birth && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Age
                                                        </p>
                                                        <p className="text-base">
                                                            {new Date().getFullYear() -
                                                                new Date(
                                                                    treatment.patient.date_of_birth
                                                                ).getFullYear()}{" "}
                                                            years old
                                                        </p>
                                                    </div>
                                                )}
                                                {treatment.patient
                                                    ?.phone_number && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Phone
                                                        </p>
                                                        <p className="text-base">
                                                            {
                                                                treatment
                                                                    .patient
                                                                    .phone_number
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {treatment.patient?.email && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Email
                                                        </p>
                                                        <p className="text-base">
                                                            {
                                                                treatment
                                                                    .patient
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dentist Information */}
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                                            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                                                <Stethoscope className="h-5 w-5" />
                                                Dentist Details
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-1">
                                                        Dentist Name
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {treatment.dentist
                                                            ?.name || "N/A"}
                                                    </p>
                                                </div>
                                                {treatment.dentist?.email && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Email
                                                        </p>
                                                        <p className="text-base">
                                                            {
                                                                treatment
                                                                    .dentist
                                                                    .email
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                {treatment.dentist
                                                    ?.phone_number && (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Phone
                                                        </p>
                                                        <p className="text-base">
                                                            {
                                                                treatment
                                                                    .dentist
                                                                    .phone_number
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Service Information */}
                                        {treatment.service && (
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                                                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                                                    <Tag className="h-5 w-5" />
                                                    Service Details
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Service Name
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-semibold">
                                                                {
                                                                    treatment
                                                                        .service
                                                                        .name
                                                                }
                                                            </span>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    treatment
                                                                        .service
                                                                        .category
                                                                }
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {treatment.service
                                                        .description && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                                Description
                                                            </p>
                                                            <p className="text-base text-gray-700">
                                                                {
                                                                    treatment
                                                                        .service
                                                                        .description
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    {treatment.service
                                                        .price && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                                Service Price
                                                            </p>
                                                            <p className="text-lg font-semibold text-green-600">
                                                                ₱
                                                                {parseFloat(
                                                                    treatment
                                                                        .service
                                                                        .price
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Appointment Information */}
                                        {treatment.appointment && (
                                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
                                                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                                                    <Calendar className="h-5 w-5" />
                                                    Related Appointment
                                                </h3>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                                            Scheduled Date
                                                        </p>
                                                        <p className="text-base font-semibold">
                                                            {format(
                                                                new Date(
                                                                    treatment.appointment.scheduled_at
                                                                ),
                                                                "PPP"
                                                            )}
                                                        </p>
                                                    </div>
                                                    {treatment.appointment
                                                        .type && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                                Appointment Type
                                                            </p>
                                                            <p className="text-base">
                                                                {
                                                                    treatment
                                                                        .appointment
                                                                        .type
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                    {treatment.appointment
                                                        .status && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                                Status
                                                            </p>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    treatment
                                                                        .appointment
                                                                        .status
                                                                        .name
                                                                }
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - 2/5 width */}
                        <div className="xl:col-span-2 flex flex-col gap-6 xl:sticky xl:top-6">
                            {/* Quick Actions */}
                            <Card className="bg-white shadow-md rounded-xl border-0 flex-1">
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
                            <Card className="bg-white shadow-md rounded-xl border-0 flex-1">
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

                            {/* Treatment Metrics */}
                            <Card className="bg-white shadow-md rounded-xl border-0 flex-1">
                                <CardHeader className="px-6 py-4 border-b">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-blue-600" />
                                        Treatment Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {treatment.estimated_duration_minutes ||
                                                    0}
                                            </div>
                                            <div className="text-sm text-blue-600">
                                                Minutes
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                {treatment.tooth_numbers
                                                    ? treatment.tooth_numbers
                                                          .length
                                                    : 0}
                                            </div>
                                            <div className="text-sm text-green-600">
                                                Teeth
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {treatment.inventoryItems
                                                    ? treatment.inventoryItems
                                                          .length
                                                    : 0}
                                            </div>
                                            <div className="text-sm text-purple-600">
                                                Items
                                            </div>
                                        </div>
                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {treatment.images
                                                    ? treatment.images.length
                                                    : 0}
                                            </div>
                                            <div className="text-sm text-orange-600">
                                                Images
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    Treatment Phase
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {treatment.treatment_phase
                                                        ? treatment.treatment_phase
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          treatment.treatment_phase
                                                              .slice(1)
                                                              .replace("_", " ")
                                                        : "Not specified"}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    Outcome
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {treatment.outcome
                                                        ? treatment.outcome
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          treatment.outcome.slice(
                                                              1
                                                          )
                                                        : "Not specified"}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    Inventory Deducted
                                                </span>
                                                <Badge
                                                    variant={
                                                        treatment.inventory_deducted
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {treatment.inventory_deducted
                                                        ? "Yes"
                                                        : "No"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs text-gray-500 text-center">
                                            Treatment statistics and metrics
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Full-Width Layout for Remaining Sections */}
                    <div className="space-y-6">
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

                                {/* Procedures Details */}
                                {treatment.procedures_details &&
                                    treatment.procedures_details.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                                                <ClipboardPlus className="h-4 w-4" />
                                                Treatment Procedures (
                                                {
                                                    treatment.procedures_details
                                                        .length
                                                }
                                                )
                                            </p>
                                            <div className="space-y-3">
                                                {treatment.procedures_details.map(
                                                    (procedure, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                                    {index + 1}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-blue-900 mb-2">
                                                                        Step{" "}
                                                                        {index +
                                                                            1}
                                                                    </h4>
                                                                    {procedure.step && (
                                                                        <p className="text-gray-700 mb-2 leading-relaxed">
                                                                            {
                                                                                procedure.step
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    {procedure.notes && (
                                                                        <div className="bg-white/60 p-3 rounded border-l-3 border-blue-300">
                                                                            <p className="text-sm text-gray-600">
                                                                                <span className="font-medium">
                                                                                    Notes:
                                                                                </span>{" "}
                                                                                {
                                                                                    procedure.notes
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
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
                                                {treatment.tooth_numbers.length}
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
                                                                        i + 1;
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
                                                                        i + 17;
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
                                                                parseInt(tooth);
                                                            const quadrant =
                                                                toothNumber <= 8
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
                                                                    key={index}
                                                                    className={`p-2 rounded-lg border text-xs font-semibold text-center ${quadrantColors[quadrant]}`}
                                                                >
                                                                    <div className="font-bold text-sm">
                                                                        {tooth}
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

                                {/* Debug Info */}
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                                    <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                                        Debug Info:
                                    </h4>
                                    <p className="text-xs text-yellow-700">
                                        Inventory Items:{" "}
                                        {treatment?.inventoryItems
                                            ? "EXISTS"
                                            : "NULL"}{" "}
                                        | Count:{" "}
                                        {treatment?.inventoryItems?.length || 0}{" "}
                                        | Type:{" "}
                                        {typeof treatment?.inventoryItems} | Is
                                        Array:{" "}
                                        {Array.isArray(
                                            treatment?.inventoryItems
                                        )
                                            ? "YES"
                                            : "NO"}{" "}
                                        | Deducted:{" "}
                                        {treatment?.inventory_deducted
                                            ? "YES"
                                            : "NO"}
                                    </p>
                                </div>

                                {/* Inventory Items Used */}
                                {(() => {
                                    console.log("Condition check:", {
                                        hasInventoryItems:
                                            !!treatment.inventoryItems,
                                        isArray: Array.isArray(
                                            treatment.inventoryItems
                                        ),
                                        length: treatment.inventoryItems
                                            ?.length,
                                        condition:
                                            treatment.inventoryItems &&
                                            treatment.inventoryItems.length > 0,
                                    });
                                    return (
                                        treatment.inventoryItems &&
                                        treatment.inventoryItems.length > 0
                                    );
                                })() && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            Inventory Items Used (
                                            {treatment.inventoryItems.length})
                                        </p>
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                                            <div className="space-y-4">
                                                {treatment.inventoryItems.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-3 mb-2">
                                                                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                                            {index +
                                                                                1}
                                                                        </div>
                                                                        <div>
                                                                            <h4 className="font-semibold text-gray-900">
                                                                                {item
                                                                                    .inventory
                                                                                    ?.name ||
                                                                                    "Unknown Item (Deleted)"}
                                                                            </h4>
                                                                            {item
                                                                                .inventory
                                                                                ?.description && (
                                                                                <p className="text-sm text-gray-600">
                                                                                    {
                                                                                        item
                                                                                            .inventory
                                                                                            .description
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                                                        <div className="bg-blue-50 p-3 rounded-lg">
                                                                            <p className="text-xs font-medium text-blue-600 mb-1">
                                                                                Quantity
                                                                                Used
                                                                            </p>
                                                                            <p className="text-lg font-bold text-blue-800">
                                                                                {
                                                                                    item.quantity_used
                                                                                }{" "}
                                                                                units
                                                                            </p>
                                                                        </div>
                                                                        <div className="bg-green-50 p-3 rounded-lg">
                                                                            <p className="text-xs font-medium text-green-600 mb-1">
                                                                                Unit
                                                                                Cost
                                                                            </p>
                                                                            <p className="text-lg font-bold text-green-800">
                                                                                ₱
                                                                                {parseFloat(
                                                                                    item.unit_cost
                                                                                ).toLocaleString(
                                                                                    "en-PH",
                                                                                    {
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2,
                                                                                    }
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div className="bg-purple-50 p-3 rounded-lg">
                                                                            <p className="text-xs font-medium text-purple-600 mb-1">
                                                                                Total
                                                                                Cost
                                                                            </p>
                                                                            <p className="text-lg font-bold text-purple-800">
                                                                                ₱
                                                                                {parseFloat(
                                                                                    item.total_cost
                                                                                ).toLocaleString(
                                                                                    "en-PH",
                                                                                    {
                                                                                        minimumFractionDigits: 2,
                                                                                        maximumFractionDigits: 2,
                                                                                    }
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {item.notes && (
                                                                        <div className="mt-3 bg-yellow-50 p-3 rounded-lg border-l-3 border-yellow-300">
                                                                            <p className="text-sm text-gray-700">
                                                                                <span className="font-medium text-yellow-800">
                                                                                    Notes:
                                                                                </span>{" "}
                                                                                {
                                                                                    item.notes
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}

                                                {/* Inventory Summary */}
                                                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-xl border-2 border-blue-300">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-blue-900 mb-1">
                                                                Inventory
                                                                Summary
                                                            </h4>
                                                            <p className="text-sm text-blue-700">
                                                                {
                                                                    treatment
                                                                        .inventoryItems
                                                                        .length
                                                                }{" "}
                                                                items used in
                                                                this treatment
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-blue-900">
                                                                ₱
                                                                {treatment.inventoryItems
                                                                    .reduce(
                                                                        (
                                                                            sum,
                                                                            item
                                                                        ) =>
                                                                            sum +
                                                                            parseFloat(
                                                                                item.total_cost
                                                                            ),
                                                                        0
                                                                    )
                                                                    .toLocaleString(
                                                                        "en-PH",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        }
                                                                    )}
                                                            </p>
                                                            <p className="text-sm text-blue-700">
                                                                Total Cost
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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

                                {/* Vital Signs */}
                                {treatment.vital_signs &&
                                    treatment.vital_signs.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                Vital Signs
                                            </p>
                                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {treatment.vital_signs.map(
                                                        (vital, index) => (
                                                            <div
                                                                key={index}
                                                                className="bg-white rounded-lg p-4 border border-green-200 shadow-sm"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-sm font-medium text-green-800">
                                                                            {vital.type ||
                                                                                `Vital ${
                                                                                    index +
                                                                                    1
                                                                                }`}
                                                                        </p>
                                                                        <p className="text-2xl font-bold text-green-600">
                                                                            {vital.value ||
                                                                                vital.reading ||
                                                                                "N/A"}
                                                                        </p>
                                                                    </div>
                                                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                                        <Activity className="h-5 w-5 text-green-600" />
                                                                    </div>
                                                                </div>
                                                                {vital.unit && (
                                                                    <p className="text-xs text-green-600 mt-1">
                                                                        {
                                                                            vital.unit
                                                                        }
                                                                    </p>
                                                                )}
                                                                {vital.notes && (
                                                                    <p className="text-xs text-gray-500 mt-2">
                                                                        {
                                                                            vital.notes
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
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

                                {/* Consent Forms */}
                                {treatment.consent_forms &&
                                    treatment.consent_forms.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-4 flex items-center gap-2">
                                                <Shield className="h-4 w-4" />
                                                Consent Forms (
                                                {treatment.consent_forms.length}
                                                )
                                            </p>
                                            <div className="space-y-3">
                                                {treatment.consent_forms.map(
                                                    (consent, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                                    <Shield className="h-4 w-4" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-purple-900 mb-2">
                                                                        {consent.title ||
                                                                            consent.name ||
                                                                            `Consent Form ${
                                                                                index +
                                                                                1
                                                                            }`}
                                                                    </h4>
                                                                    {consent.description && (
                                                                        <p className="text-gray-700 mb-2 leading-relaxed">
                                                                            {
                                                                                consent.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    {consent.signed_date && (
                                                                        <p className="text-sm text-purple-600 mb-2">
                                                                            <span className="font-medium">
                                                                                Signed:
                                                                            </span>{" "}
                                                                            {format(
                                                                                new Date(
                                                                                    consent.signed_date
                                                                                ),
                                                                                "PPP"
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                    {consent.signed_by && (
                                                                        <p className="text-sm text-purple-600 mb-2">
                                                                            <span className="font-medium">
                                                                                Signed
                                                                                by:
                                                                            </span>{" "}
                                                                            {
                                                                                consent.signed_by
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    {consent.notes && (
                                                                        <div className="bg-white/60 p-3 rounded border-l-3 border-purple-300">
                                                                            <p className="text-sm text-gray-600">
                                                                                <span className="font-medium">
                                                                                    Notes:
                                                                                </span>{" "}
                                                                                {
                                                                                    consent.notes
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>

                        {/* Payment Information */}
                        <Card className="bg-white shadow-md rounded-xl border-0 mb-6">
                            <CardHeader className="px-6 py-4 border-b">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-green-800">
                                                Total Cost
                                            </h3>
                                            <DollarSign className="h-6 w-6 text-green-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-green-600">
                                            ₱
                                            {parseFloat(
                                                treatment.cost
                                            ).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-green-600 mt-2">
                                            Treatment cost
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-blue-800">
                                                Inventory Cost
                                            </h3>
                                            <Package className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {treatment.inventoryItems &&
                                            treatment.inventoryItems.length > 0
                                                ? `₱${treatment.inventoryItems
                                                      .reduce(
                                                          (sum, item) =>
                                                              sum +
                                                              parseFloat(
                                                                  item.total_cost
                                                              ),
                                                          0
                                                      )
                                                      .toLocaleString()}`
                                                : "₱0"}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-2">
                                            {treatment.inventoryItems
                                                ? treatment.inventoryItems
                                                      .length
                                                : 0}{" "}
                                            items used
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-purple-800">
                                                Payment Status
                                            </h3>
                                            <CreditCard className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                treatment.payment_status ===
                                                "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : treatment.payment_status ===
                                                      "partial"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {treatment.payment_status
                                                ? treatment.payment_status
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  treatment.payment_status.slice(
                                                      1
                                                  )
                                                : "Pending"}
                                        </div>
                                        <p className="text-sm text-purple-600 mt-2">
                                            Current status
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <ReceiptText className="h-5 w-5" />
                                        Payment Breakdown
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                            <span className="text-gray-600">
                                                Treatment Cost
                                            </span>
                                            <span className="font-semibold">
                                                ₱
                                                {parseFloat(
                                                    treatment.cost
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        {treatment.inventoryItems &&
                                            treatment.inventoryItems.length >
                                                0 && (
                                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                                    <span className="text-gray-600">
                                                        Inventory Items
                                                    </span>
                                                    <span className="font-semibold">
                                                        ₱
                                                        {treatment.inventoryItems
                                                            .reduce(
                                                                (sum, item) =>
                                                                    sum +
                                                                    parseFloat(
                                                                        item.total_cost
                                                                    ),
                                                                0
                                                            )
                                                            .toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
                                            <span className="text-lg font-semibold text-gray-800">
                                                Total Amount
                                            </span>
                                            <span className="text-lg font-bold text-blue-600">
                                                ₱
                                                {(
                                                    parseFloat(treatment.cost) +
                                                    (treatment.inventoryItems
                                                        ? treatment.inventoryItems.reduce(
                                                              (sum, item) =>
                                                                  sum +
                                                                  parseFloat(
                                                                      item.total_cost
                                                                  ),
                                                              0
                                                          )
                                                        : 0)
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment History */}
                                {treatment.payments &&
                                    treatment.payments.length > 0 && (
                                        <div className="bg-gray-50 rounded-xl p-6">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                                <ReceiptText className="h-5 w-5" />
                                                Payment History
                                            </h4>
                                            <div className="space-y-3">
                                                {treatment.payments.map(
                                                    (payment) => (
                                                        <div
                                                            key={payment.id}
                                                            className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200"
                                                        >
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-semibold text-gray-800">
                                                                        ₱
                                                                        {parseFloat(
                                                                            payment.amount
                                                                        ).toLocaleString()}
                                                                    </span>
                                                                    <span
                                                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                            payment.status ===
                                                                            "completed"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : payment.status ===
                                                                                  "pending"
                                                                                ? "bg-yellow-100 text-yellow-800"
                                                                                : "bg-red-100 text-red-800"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            payment.status
                                                                        }
                                                                    </span>
                                                                    <span className="text-sm text-gray-600">
                                                                        {payment.payment_method?.replace(
                                                                            "_",
                                                                            " "
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-500 mt-1">
                                                                    {
                                                                        payment.reference_number
                                                                    }{" "}
                                                                    •{" "}
                                                                    {new Date(
                                                                        payment.payment_date
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                            <Link
                                                                href={route(
                                                                    "clinic.payments.show",
                                                                    [
                                                                        auth.clinic_id,
                                                                        payment.id,
                                                                    ]
                                                                )}
                                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                            >
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Payment Actions */}
                                <div className="flex gap-3">
                                    <Link
                                        href={
                                            route(
                                                "clinic.payments.create",
                                                auth.clinic_id
                                            ) +
                                            `?treatment_id=${
                                                treatment.id
                                            }&patient_id=${
                                                treatment.patient_id
                                            }&amount=${(
                                                parseFloat(treatment.cost) +
                                                (treatment.inventoryItems?.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        parseFloat(
                                                            item.total_cost
                                                        ),
                                                    0
                                                ) || 0)
                                            ).toFixed(2)}`
                                        }
                                        className="flex-1"
                                    >
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Process Payment
                                        </Button>
                                    </Link>
                                    <Button
                                        className="flex-1"
                                        variant="outline"
                                    >
                                        <ReceiptText className="h-4 w-4 mr-2" />
                                        Generate Invoice
                                    </Button>
                                </div>
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

                        {/* Related Treatments */}
                        <Card className="bg-white shadow-md rounded-xl border-0 mb-6">
                            <CardHeader className="px-6 py-4 border-b">
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Related Treatments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                                        Related Treatments
                                    </h4>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Other treatments for this patient will
                                        be displayed here.
                                    </p>
                                    <Button variant="outline" size="sm">
                                        <Users className="h-4 w-4 mr-2" />
                                        View Patient History
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
