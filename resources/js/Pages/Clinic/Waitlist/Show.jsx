import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Phone,
    CheckCircle,
    XCircle,
    Loader2,
    Plus,
} from "lucide-react";

export default function Show({ auth, clinic, waitlist }) {
    const [actionLoading, setActionLoading] = useState({
        contacted: false,
        scheduled: false,
        cancelled: false,
        delete: false,
    });

    const getStatusColor = (status) => {
        const colors = {
            active: "bg-green-100 text-green-800",
            contacted: "bg-blue-100 text-blue-800",
            scheduled: "bg-purple-100 text-purple-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-600";
    };

    const getPriorityColor = (priority) => {
        const colors = {
            urgent: "bg-red-100 text-red-800 border-red-300 shadow-sm",
            high: "bg-orange-100 text-orange-800 border-orange-300 shadow-sm",
            normal: "bg-blue-100 text-blue-800 border-blue-300 shadow-sm",
            low: "bg-gray-100 text-gray-600 border-gray-300 shadow-sm",
        };
        return (
            colors[priority] ||
            "bg-gray-100 text-gray-600 border-gray-300 shadow-sm"
        );
    };

    const handleMarkAsContacted = () => {
        setActionLoading((prev) => ({ ...prev, contacted: true }));
        router.patch(
            route("clinic.waitlist.mark-contacted", [clinic.id, waitlist.id]),
            {},
            {
                onSuccess: () =>
                    setActionLoading((prev) => ({ ...prev, contacted: false })),
                onError: () =>
                    setActionLoading((prev) => ({ ...prev, contacted: false })),
            }
        );
    };

    const handleMarkAsScheduled = () => {
        setActionLoading((prev) => ({ ...prev, scheduled: true }));
        router.patch(
            route("clinic.waitlist.mark-scheduled", [clinic.id, waitlist.id]),
            {},
            {
                onSuccess: () =>
                    setActionLoading((prev) => ({ ...prev, scheduled: false })),
                onError: () =>
                    setActionLoading((prev) => ({ ...prev, scheduled: false })),
            }
        );
    };

    const handleMarkAsCancelled = () => {
        if (confirm("Are you sure?")) {
            setActionLoading((prev) => ({ ...prev, cancelled: true }));
            router.patch(
                route("clinic.waitlist.mark-cancelled", [
                    clinic.id,
                    waitlist.id,
                ]),
                {},
                {
                    onSuccess: () =>
                        setActionLoading((prev) => ({
                            ...prev,
                            cancelled: false,
                        })),
                    onError: () =>
                        setActionLoading((prev) => ({
                            ...prev,
                            cancelled: false,
                        })),
                }
            );
        }
    };

    const handleDelete = () => {
        if (confirm("Are you sure?")) {
            setActionLoading((prev) => ({ ...prev, delete: true }));
            router.delete(
                route("clinic.waitlist.destroy", [clinic.id, waitlist.id]),
                {
                    onSuccess: () =>
                        router.visit(route("clinic.waitlist.index", clinic.id)),
                    onError: () =>
                        setActionLoading((prev) => ({
                            ...prev,
                            delete: false,
                        })),
                }
            );
        }
    };

    const handleConvertToAppointment = () => {
        router.visit(
            route("clinic.appointments.create-simplified", clinic.id),
            {
                data: {
                    patient_id: waitlist.patient_id,
                    assigned_to: waitlist.preferred_dentist_id,
                    service_id: waitlist.service_id,
                    reason: waitlist.reason,
                    notes: waitlist.notes,
                    from_waitlist: waitlist.id,
                },
            }
        );
    };

    if (!waitlist) {
        return (
            <AuthenticatedLayout auth={auth}>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center justify-between">
                    <Link
                        href={route("clinic.waitlist.index", clinic.id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Waitlist</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("clinic.waitlist.edit", [
                                clinic.id,
                                waitlist.id,
                            ])}
                        >
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                            disabled={actionLoading.delete}
                        >
                            {actionLoading.delete ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Delete
                        </Button>
                    </div>
                </div>
            }
        >
            <Head
                title={`Waitlist Entry - ${waitlist.patient?.first_name} ${waitlist.patient?.last_name}`}
            />

            {/* Compact Blue Hero Section */}
            <div className="relative mx-5 mb-6 overflow-hidden">
                {/* Blue gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl opacity-95"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-2xl opacity-80"></div>

                {/* Subtle floating elements */}
                <div className="absolute top-2 right-6 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-6 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl"></div>

                {/* Main container */}
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        {/* Left side - Patient info */}
                        <div className="flex items-center gap-4">
                            {/* Compact avatar */}
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                                    <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="h-5 w-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {/* Status indicator */}
                                <div
                                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md ${
                                        getStatusColor(
                                            waitlist.status
                                        ).includes("green")
                                            ? "bg-green-400"
                                            : getStatusColor(
                                                  waitlist.status
                                              ).includes("blue")
                                            ? "bg-blue-400"
                                            : getStatusColor(
                                                  waitlist.status
                                              ).includes("purple")
                                            ? "bg-purple-400"
                                            : "bg-red-400"
                                    }`}
                                ></div>
                            </div>

                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-white tracking-tight">
                                    {waitlist.patient?.first_name}{" "}
                                    {waitlist.patient?.last_name}
                                </h1>
                                <div className="flex items-center gap-3 text-white/90 text-sm">
                                    <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                        #{waitlist.id}
                                    </span>
                                    <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                        <svg
                                            className="h-3 w-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        {new Date(
                                            waitlist.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Status badges */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${
                                        getStatusColor(
                                            waitlist.status
                                        ).includes("green")
                                            ? "bg-green-500/80 border border-green-400/50"
                                            : getStatusColor(
                                                  waitlist.status
                                              ).includes("blue")
                                            ? "bg-blue-500/80 border border-blue-400/50"
                                            : getStatusColor(
                                                  waitlist.status
                                              ).includes("purple")
                                            ? "bg-purple-500/80 border border-purple-400/50"
                                            : "bg-red-500/80 border border-red-400/50"
                                    }`}
                                >
                                    {waitlist.status.charAt(0).toUpperCase() +
                                        waitlist.status.slice(1)}
                                </div>
                                <div
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg backdrop-blur-sm ${
                                        getPriorityColor(
                                            waitlist.priority
                                        ).includes("red")
                                            ? "bg-red-500/80 border border-red-400/50"
                                            : getPriorityColor(
                                                  waitlist.priority
                                              ).includes("orange")
                                            ? "bg-orange-500/80 border border-orange-400/50"
                                            : getPriorityColor(
                                                  waitlist.priority
                                              ).includes("blue")
                                            ? "bg-blue-500/80 border border-blue-400/50"
                                            : "bg-gray-500/80 border border-gray-400/50"
                                    }`}
                                >
                                    {waitlist.priority.charAt(0).toUpperCase() +
                                        waitlist.priority.slice(1)}{" "}
                                    Priority
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div className="flex items-center gap-3 text-white/80 text-xs">
                                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <svg
                                        className="h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                    {waitlist.contact_attempts || 0} attempts
                                </span>
                                <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <svg
                                        className="h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {waitlist.estimated_duration || 30}m
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Content Layout with Cards */}
            <div className="mx-5">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Main Info Cards */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Modern Info Cards */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Patient Information Card */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg
                                                className="h-6 w-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Patient Info
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Full Name
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {
                                                        waitlist.patient
                                                            ?.first_name
                                                    }{" "}
                                                    {
                                                        waitlist.patient
                                                            ?.last_name
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Email
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {waitlist.patient?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Phone
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {
                                                        waitlist.patient
                                                            ?.phone_number
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details Card */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg
                                                className="h-6 w-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Appointment Details
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Service
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {waitlist.service?.name ||
                                                        "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Dentist
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {waitlist.preferred_dentist
                                                        ?.name || "Any dentist"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Duration
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {waitlist.estimated_duration ||
                                                        30}{" "}
                                                    minutes
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule & Contact Info */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Preferred Schedule */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg
                                                className="h-6 w-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Preferred Schedule
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                                <p className="text-sm text-gray-500">
                                                    Start Date
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {waitlist.preferred_start_date
                                                        ? new Date(
                                                              waitlist.preferred_start_date
                                                          ).toLocaleDateString()
                                                        : "Not specified"}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                                <p className="text-sm text-gray-500">
                                                    End Date
                                                </p>
                                                <p className="font-semibold text-gray-800">
                                                    {waitlist.preferred_end_date
                                                        ? new Date(
                                                              waitlist.preferred_end_date
                                                          ).toLocaleDateString()
                                                        : "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Preferred Days
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {waitlist.preferred_days
                                                    ? waitlist.preferred_days.join(
                                                          ", "
                                                      )
                                                    : "Any day"}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Time Range
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {waitlist.preferred_start_time &&
                                                waitlist.preferred_end_time
                                                    ? `${new Date(
                                                          waitlist.preferred_start_time
                                                      ).toLocaleTimeString()} - ${new Date(
                                                          waitlist.preferred_end_time
                                                      ).toLocaleTimeString()}`
                                                    : "Any time"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact History */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg
                                                className="h-6 w-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Contact History
                                        </h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Contact Attempts
                                            </p>
                                            <p className="text-2xl font-bold text-orange-600">
                                                {waitlist.contact_attempts || 0}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Last Contact
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {waitlist.last_contact_attempt
                                                    ? new Date(
                                                          waitlist.last_contact_attempt
                                                      ).toLocaleString()
                                                    : "Never"}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Contacted At
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {waitlist.contacted_at
                                                    ? new Date(
                                                          waitlist.contacted_at
                                                      ).toLocaleString()
                                                    : "Not contacted"}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Scheduled At
                                            </p>
                                            <p className="font-semibold text-gray-800">
                                                {waitlist.scheduled_at
                                                    ? new Date(
                                                          waitlist.scheduled_at
                                                      ).toLocaleString()
                                                    : "Not scheduled"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        {(waitlist.reason ||
                            waitlist.notes ||
                            waitlist.contact_notes) && (
                            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <svg
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Additional Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {waitlist.reason && (
                                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="h-4 w-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="font-bold text-blue-900">
                                                    Reason for Visit
                                                </h3>
                                            </div>
                                            <p className="text-blue-800 leading-relaxed">
                                                {waitlist.reason}
                                            </p>
                                        </div>
                                    )}

                                    {waitlist.notes && (
                                        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="h-4 w-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="font-bold text-green-900">
                                                    Notes
                                                </h3>
                                            </div>
                                            <p className="text-green-800 leading-relaxed">
                                                {waitlist.notes}
                                            </p>
                                        </div>
                                    )}

                                    {waitlist.contact_notes && (
                                        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-sm">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                                    <svg
                                                        className="h-4 w-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="font-bold text-purple-900">
                                                    Contact Notes
                                                </h3>
                                            </div>
                                            <p className="text-purple-800 leading-relaxed">
                                                {waitlist.contact_notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Timeline & Actions */}
                    <div className="space-y-6">
                        {/* Modern Timeline */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Timeline
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-sm">
                                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <svg
                                            className="h-5 w-5 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-900">
                                            Created
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            {new Date(
                                                waitlist.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {waitlist.contacted_at && (
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-sm">
                                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-green-900">
                                                Contacted
                                            </p>
                                            <p className="text-sm text-green-700">
                                                {new Date(
                                                    waitlist.contacted_at
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {waitlist.scheduled_at && (
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-sm">
                                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-purple-900">
                                                Scheduled
                                            </p>
                                            <p className="text-sm text-purple-700">
                                                {new Date(
                                                    waitlist.scheduled_at
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {waitlist.expires_at && (
                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200 shadow-sm">
                                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg
                                                className="h-5 w-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-orange-900">
                                                Expires
                                            </p>
                                            <p className="text-sm text-orange-700">
                                                {new Date(
                                                    waitlist.expires_at
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ultra Modern Quick Actions */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg
                                        className="h-6 w-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Quick Actions
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {waitlist.status === "active" && (
                                    <Button
                                        onClick={handleMarkAsContacted}
                                        disabled={actionLoading.contacted}
                                        className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            {actionLoading.contacted ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Phone className="h-5 w-5" />
                                            )}
                                            <span className="font-semibold">
                                                Mark as Contacted
                                            </span>
                                        </div>
                                    </Button>
                                )}

                                {waitlist.status === "contacted" && (
                                    <Button
                                        onClick={handleMarkAsScheduled}
                                        disabled={actionLoading.scheduled}
                                        className="h-16 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            {actionLoading.scheduled ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <CheckCircle className="h-5 w-5" />
                                            )}
                                            <span className="font-semibold">
                                                Mark as Scheduled
                                            </span>
                                        </div>
                                    </Button>
                                )}

                                {["active", "contacted"].includes(
                                    waitlist.status
                                ) && (
                                    <Button
                                        onClick={handleMarkAsCancelled}
                                        disabled={actionLoading.cancelled}
                                        className="h-16 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
                                    >
                                        <div className="flex items-center gap-3">
                                            {actionLoading.cancelled ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                            <span className="font-semibold">
                                                Mark as Cancelled
                                            </span>
                                        </div>
                                    </Button>
                                )}

                                <Button
                                    onClick={handleConvertToAppointment}
                                    className="h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <Plus className="h-5 w-5" />
                                        <span className="font-semibold">
                                            Convert to Appointment
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
