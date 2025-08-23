import { Head, useForm } from "@inertiajs/react";
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
} from "lucide-react";
import { Link } from "@inertiajs/react";
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
    // Helper function to format datetime for datetime-local input
    const formatDateTimeForInput = (dateTimeString) => {
        if (!dateTimeString) return "";
        try {
            const date = new Date(dateTimeString);
            return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
        } catch (error) {
            console.error("Error formatting datetime:", error);
            return "";
        }
    };

    // Helper function to format date for date input
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        } catch (error) {
            console.error("Error formatting date:", error);
            return "";
        }
    };

    const { data, setData, put, processing, errors } = useForm({
        appointment_type_id: appointment.appointment_type_id,
        appointment_status_id: appointment.appointment_status_id,
        assigned_to: appointment.assigned_to || "unassigned",
        scheduled_at: formatDateTimeForInput(appointment.scheduled_at),
        ended_at: formatDateTimeForInput(appointment.ended_at),
        duration: String(appointment.duration || 30),
        reason: appointment.reason || "",
        notes: appointment.notes || "",
        cancellation_reason: appointment.cancellation_reason || "",
        payment_status: appointment.payment_status || "pending",
        service_id: appointment.service_id || "none",
        is_follow_up: appointment.is_follow_up || false,
        previous_visit_date: formatDateForInput(
            appointment.previous_visit_date
        ),
        previous_visit_notes: appointment.previous_visit_notes || "",
        send_reminder: false,
        reminder_type: "email", // email, sms, both
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("clinic.appointments.update", [clinic.id, appointment.id]));
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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href={route("clinic.appointments.show", [
                                    clinic.id,
                                    appointment.id,
                                ])}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Details
                            </Link>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Edit Appointment #{appointment.id}
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Patient: {appointment.patient?.first_name}{" "}
                                    {appointment.patient?.last_name}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                    className={getStatusColor(
                                        appointment.status?.name
                                    )}
                                >
                                    {appointment.status?.name}
                                </Badge>
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
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
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
                                                                value={type.id}
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
                                                                        status.id
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
                                                                        dentist.id
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
                                                                        service.id
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

                                {/* Current Appointment Info */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Current Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Patient
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {
                                                        appointment.patient
                                                            ?.first_name
                                                    }{" "}
                                                    {
                                                        appointment.patient
                                                            ?.last_name
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Current Status
                                                </span>
                                                <Badge
                                                    className={getStatusColor(
                                                        appointment.status?.name
                                                    )}
                                                >
                                                    {appointment.status?.name}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Payment Status
                                                </span>
                                                <Badge
                                                    className={getPaymentStatusColor(
                                                        appointment.payment_status
                                                    )}
                                                >
                                                    {appointment.payment_status
                                                        ?.charAt(0)
                                                        .toUpperCase() +
                                                        appointment.payment_status?.slice(
                                                            1
                                                        )}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Created
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {format(
                                                        new Date(
                                                            appointment.created_at
                                                        ),
                                                        "MMM d, yyyy"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {processing
                                                    ? "Updating..."
                                                    : "Update Appointment"}
                                            </Button>

                                            <Link
                                                href={route(
                                                    "clinic.appointments.show",
                                                    [clinic.id, appointment.id]
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
