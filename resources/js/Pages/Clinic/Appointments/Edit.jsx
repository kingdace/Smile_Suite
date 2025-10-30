import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useToast, ToastContainer } from "@/Components/ui/toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Switch } from "@/Components/ui/switch";
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Stethoscope,
    FileText,
    AlertTriangle,
    Save,
    X,
    CheckCircle,
    DollarSign,
    Package,
    MessageSquare,
    Bell,
    Phone,
    Mail,
    Pencil,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { format, parseISO } from "date-fns";

export default function Edit({
    auth,
    clinic,
    appointment,
    types,
    statuses,
    dentists,
    services,
}) {
    const { toasts, removeToast, showSuccess, showError } = useToast();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Helper function to clean notes by removing SMS reminder data
    const cleanNotes = (notes) => {
        if (!notes) return "";
        // Remove SMS reminder data like [sms_reminder_2025-10-27]
        return notes.replace(/\[sms_reminder_[\d-]+\]/g, '').trim();
    };
    
    // Helper function to format datetime for datetime-local input (converts to local timezone)
    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return "";
        try {
            const date = new Date(dateTimeString);
            // Get local date components
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            // Format: YYYY-MM-DDTHH:mm (in local timezone)
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch (error) {
            console.error("Error formatting datetime:", error);
            return "";
        }
    };

    // Helper function to format date for date input (converts to local timezone)
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            // Format: YYYY-MM-DD (in local timezone)
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    const { data, setData, put, processing, errors, isDirty } = useForm({
        appointment_type_id: String(appointment.appointment_type_id || ""),
        appointment_status_id: String(appointment.appointment_status_id || ""),
        assigned_to: String(appointment.assigned_to || "unassigned"),
        scheduled_at: formatDateTimeForInput(appointment.scheduled_at),
        ended_at: formatDateTimeForInput(appointment.ended_at),
        duration: String(appointment.duration || 30),
        reason: appointment.reason || "",
        notes: cleanNotes(appointment.notes),
        cancellation_reason: appointment.cancellation_reason || "",
        payment_status: appointment.payment_status || "pending",
        service_id: String(appointment.service_id || "none"),
        is_follow_up: Boolean(appointment.is_follow_up),
        previous_visit_date: formatDateForInput(
            appointment.previous_visit_date
        ),
        previous_visit_notes: appointment.previous_visit_notes || "",
        send_reminder: false,
        reminder_type: "email", // email, sms, both
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Convert form data to proper types for backend
        const submitData = {
            appointment_type_id: parseInt(data.appointment_type_id) || null,
            appointment_status_id: parseInt(data.appointment_status_id) || null,
            assigned_to: data.assigned_to === 'unassigned' ? 'unassigned' : String(data.assigned_to),
            scheduled_at: data.scheduled_at,
            ended_at: data.ended_at,
            duration: parseInt(data.duration) || 30,
            reason: data.reason || '',
            notes: data.notes || '',
            cancellation_reason: data.cancellation_reason || '',
            payment_status: data.payment_status || 'pending',
            service_id: data.service_id === 'none' ? null : String(data.service_id),
            is_follow_up: Boolean(data.is_follow_up),
            previous_visit_date: data.previous_visit_date || '',
            previous_visit_notes: data.previous_visit_notes || '',
            send_reminder: Boolean(data.send_reminder),
            reminder_type: data.reminder_type || 'email'
        };

        // Validate required fields before submission
        if (!submitData.appointment_type_id || !submitData.appointment_status_id) {
            showError(
                "Validation Error",
                "Please select both appointment type and status."
            );
            return;
        }
        
        router.put(route("clinic.appointments.update", [clinic.id, appointment.id]), submitData, {
            onSuccess: (page) => {
                showSuccess(
                    "Success!",
                    "Appointment updated successfully."
                );
                setHasUnsavedChanges(false);
            },
            onError: (errors) => {
                // Check if there are specific validation errors
                if (errors && Object.keys(errors).length > 0) {
                    const errorMessages = Object.values(errors).flat().join(', ');
                    showError(
                        "Validation Error",
                        errorMessages
                    );
                } else {
                    showError(
                        "Error",
                        "Failed to update appointment. Please check the form and try again."
                    );
                }
            },
            preserveScroll: true
        });
        
        return false; // Prevent any default form submission
    };

    const handleCancel = (e) => {
        e.preventDefault();
        if (isDirty) {
            const confirmed = window.confirm(
                "You have unsaved changes. Are you sure you want to leave without saving?"
            );
            if (!confirmed) {
                return;
            }
        }
        window.location.href = route("clinic.appointments.show", [clinic.id, appointment.id]);
    };

    const getStatusColor = (statusName) => {
        const colors = {
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
            Completed: "bg-green-100 text-green-800 border-green-300",
            Cancelled: "bg-red-100 text-red-800 border-red-300",
            "No Show": "bg-gray-100 text-gray-800 border-gray-300",
        };
        return (
            colors[statusName] || "bg-gray-100 text-gray-800 border-gray-300"
        );
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            partial: "bg-orange-100 text-orange-800 border-orange-300",
            paid: "bg-green-100 text-green-800 border-green-300",
            insurance: "bg-blue-100 text-blue-800 border-blue-300",
        };
        return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Appointment
                </h2>
            }
        >
            <Head title="Edit Appointment" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Enhanced Header Section */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mb-6 rounded-xl shadow-2xl">
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>

                        <div className="relative px-6 py-4">
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                                {/* Left side - Appointment info */}
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="p-2.5 bg-white/25 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg">
                                            <Pencil className="h-5 w-5 text-white" />
                                        </div>
                                        {/* Status indicator dot */}
                                        <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                                            appointment.status?.name === 'Confirmed' ? 'bg-green-400' :
                                            appointment.status?.name === 'Pending' ? 'bg-yellow-400' :
                                            appointment.status?.name === 'Completed' ? 'bg-blue-400' :
                                            appointment.status?.name === 'Cancelled' ? 'bg-red-400' :
                                            'bg-gray-400'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Link
                                                href={route("clinic.appointments.show", [clinic.id, appointment.id])}
                                                className="text-white/80 hover:text-white transition-colors text-xs"
                                            >
                                                Appointment #{appointment.id}
                                            </Link>
                                            <span className="text-white/60 text-xs">/</span>
                                            <span className="text-white font-semibold text-xs">Edit</span>
                                        </div>
                                        <h1 className="text-xl font-bold text-white">
                                            {appointment.patient?.first_name} {appointment.patient?.last_name}
                                        </h1>
                                        <p className="text-white/80 text-xs mt-0.5">
                                            {format(parseISO(appointment.scheduled_at), "EEEE, MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Right side - Back button */}
                                <Link
                                    href={route("clinic.appointments.show", [clinic.id, appointment.id])}
                                >
                                    <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm transition-all shadow-lg">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back to Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Patient Information Card - Read Only */}
                    <Card className="shadow-lg border-0 bg-gradient-to-r from-cyan-50 to-blue-50 mb-8">
                        <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-white">
                                    <User className="h-6 w-6" />
                                    Patient Information
                                </CardTitle>
                                <Link
                                    href={route("clinic.patients.show", [
                                        clinic.id,
                                        appointment.patient_id,
                                    ])}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 rounded-lg text-xs font-medium text-white transition-colors shadow-sm"
                                >
                                    <User className="h-3.5 w-3.5" />
                                    View Full Profile
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                        <User className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Patient Name
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {appointment.patient?.first_name}{" "}
                                            {appointment.patient?.last_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Phone className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-semibold text-gray-900">
                                            {appointment.patient?.phone_number ||
                                                "Not provided"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Mail className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold text-gray-900 text-sm truncate">
                                            {appointment.patient?.email ||
                                                "Not provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <form onSubmit={handleSubmit} method="POST" action="#">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <Calendar className="h-6 w-6" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="appointment_type_id"
                                                    className="flex items-center gap-2"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    Appointment Type
                                                </Label>
                                                <Select
                                                    value={
                                                        data.appointment_type_id
                                                    }
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "appointment_type_id",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {types.map((type) => (
                                                            <SelectItem
                                                                key={type.id}
                                                                value={String(type.id)}
                                                            >
                                                                {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.appointment_type_id && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.appointment_type_id
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="appointment_status_id"
                                                    className="flex items-center gap-2"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Status
                                                </Label>
                                                <Select
                                                    value={
                                                        data.appointment_status_id
                                                    }
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "appointment_status_id",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statuses.map(
                                                            (status) => (
                                                                <SelectItem
                                                                    key={
                                                                        status.id
                                                                    }
                                                                    value={
                                                                        String(status.id)
                                                                    }
                                                                >
                                                                    {
                                                                        status.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.appointment_status_id && (
                                                    <p className="text-sm text-red-500">
                                                        {
                                                            errors.appointment_status_id
                                                        }
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="assigned_to"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Stethoscope className="h-4 w-4" />
                                                    Assigned Dentist
                                                </Label>
                                                <Select
                                                    value={data.assigned_to}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "assigned_to",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select dentist" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="unassigned">
                                                            Not assigned
                                                        </SelectItem>
                                                        {dentists.map(
                                                            (dentist) => (
                                                                <SelectItem
                                                                    key={
                                                                        dentist.id
                                                                    }
                                                                    value={
                                                                        String(dentist.id)
                                                                    }
                                                                >
                                                                    {
                                                                        dentist.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.assigned_to && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.assigned_to}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="service_id"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Package className="h-4 w-4" />
                                                    Service
                                                </Label>
                                                <Select
                                                    value={data.service_id}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "service_id",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">
                                                            No service
                                                        </SelectItem>
                                                        {services?.map(
                                                            (service) => (
                                                                <SelectItem
                                                                    key={
                                                                        service.id
                                                                    }
                                                                    value={
                                                                        String(service.id)
                                                                    }
                                                                >
                                                                    {
                                                                        service.name
                                                                    }{" "}
                                                                    - ₱
                                                                    {
                                                                        service.price
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.service_id && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.service_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Schedule Information */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800">
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <Clock className="h-6 w-6" />
                                            Schedule Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="scheduled_at"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                    Date & Time
                                                </Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={data.scheduled_at}
                                                    onChange={(e) =>
                                                        setData(
                                                            "scheduled_at",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.scheduled_at && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.scheduled_at}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="duration"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Clock className="h-4 w-4" />
                                                    Duration (minutes)
                                                </Label>
                                                <Select
                                                    value={data.duration}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "duration",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select duration" />
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
                                                {errors.duration && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.duration}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="ended_at"
                                                    className="flex items-center gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    End Date & Time
                                                </Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={data.ended_at}
                                                    onChange={(e) =>
                                                        setData(
                                                            "ended_at",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                {errors.ended_at && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.ended_at}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Information */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800">
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <DollarSign className="h-6 w-6" />
                                            Payment Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="payment_status"
                                                    className="flex items-center gap-2"
                                                >
                                                    <DollarSign className="h-4 w-4" />
                                                    Payment Status
                                                </Label>
                                                <Select
                                                    value={data.payment_status}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "payment_status",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">
                                                            Pending
                                                        </SelectItem>
                                                        <SelectItem value="partial">
                                                            Partial
                                                        </SelectItem>
                                                        <SelectItem value="paid">
                                                            Paid
                                                        </SelectItem>
                                                        <SelectItem value="insurance">
                                                            Insurance
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.payment_status && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.payment_status}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="is_follow_up"
                                                    className="flex items-center gap-2"
                                                >
                                                    <AlertTriangle className="h-4 w-4" />
                                                    Follow-up Appointment
                                                </Label>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id="is_follow_up"
                                                        checked={
                                                            data.is_follow_up
                                                        }
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            setData(
                                                                "is_follow_up",
                                                                checked
                                                            )
                                                        }
                                                    />
                                                    <Label htmlFor="is_follow_up">
                                                        Mark as follow-up
                                                    </Label>
                                                </div>
                                                {errors.is_follow_up && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.is_follow_up}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {data.is_follow_up && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="previous_visit_date">
                                                        Previous Visit Date
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        value={
                                                            data.previous_visit_date
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "previous_visit_date",
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {errors.previous_visit_date && (
                                                        <p className="text-sm text-red-500">
                                                            {
                                                                errors.previous_visit_date
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="previous_visit_notes">
                                                        Previous Visit Notes
                                                    </Label>
                                                    <Textarea
                                                        value={
                                                            data.previous_visit_notes
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "previous_visit_notes",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Notes from previous visit..."
                                                    />
                                                    {errors.previous_visit_notes && (
                                                        <p className="text-sm text-red-500">
                                                            {
                                                                errors.previous_visit_notes
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Notes and Additional Information */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-gray-600 via-gray-700 to-slate-800">
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <FileText className="h-6 w-6" />
                                            Notes & Additional Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="reason">
                                                    Reason for Visit
                                                </Label>
                                                <Input
                                                    type="text"
                                                    value={data.reason}
                                                    onChange={(e) =>
                                                        setData(
                                                            "reason",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter reason for visit..."
                                                />
                                                {errors.reason && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.reason}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="notes">
                                                    Notes
                                                </Label>
                                                <Textarea
                                                    value={data.notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            "notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter appointment notes..."
                                                    rows={4}
                                                />
                                                {errors.notes && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.notes}
                                                    </p>
                                                )}
                                            </div>

                                            {data.appointment_status_id ==
                                                4 && (
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="cancellation_reason"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Cancellation Reason
                                                    </Label>
                                                    <Textarea
                                                        value={
                                                            data.cancellation_reason
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "cancellation_reason",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter cancellation reason..."
                                                        rows={3}
                                                    />
                                                    {errors.cancellation_reason && (
                                                        <p className="text-sm text-red-500">
                                                            {
                                                                errors.cancellation_reason
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Reminder Settings */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5" />
                                            Reminder Settings
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="send_reminder"
                                                checked={data.send_reminder}
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        "send_reminder",
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label htmlFor="send_reminder">
                                                Send reminder
                                            </Label>
                                        </div>

                                        {data.send_reminder && (
                                            <div className="space-y-2">
                                                <Label htmlFor="reminder_type">
                                                    Reminder Type
                                                </Label>
                                                <Select
                                                    value={data.reminder_type}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "reminder_type",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select reminder type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="email">
                                                            Email
                                                        </SelectItem>
                                                        <SelectItem value="sms">
                                                            SMS
                                                        </SelectItem>
                                                        <SelectItem value="both">
                                                            Both
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Current Information - Compact */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <User className="h-5 w-5" />
                                            Current Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-700">Status</span>
                                                <Badge
                                                    className={getStatusColor(
                                                        appointment.status?.name
                                                    )}
                                                >
                                                    {appointment.status?.name}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-700">Payment</span>
                                                <Badge
                                                    className={getPaymentStatusColor(
                                                        appointment.payment_status
                                                    )}
                                                >
                                                    {appointment.payment_status
                                                        ?.charAt(0)
                                                        .toUpperCase() +
                                                        appointment.payment_status?.slice(1)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                                <span className="text-sm font-medium text-gray-700">Created</span>
                                                <span className="text-sm text-gray-600">
                                                    {format(
                                                        new Date(appointment.created_at),
                                                        "MMM d, yyyy"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-sm font-medium text-gray-700">Created By</span>
                                                <span className="text-sm text-gray-600">
                                                    {appointment.creator?.name || 'System'}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="sticky top-6">
                                    <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                <Button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                                                    size="lg"
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {processing
                                                        ? "Updating..."
                                                        : "Update Appointment"}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full border-gray-300 hover:bg-gray-50"
                                                    onClick={handleCancel}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </AuthenticatedLayout>
    );
}
