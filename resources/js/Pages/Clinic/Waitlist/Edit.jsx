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
import { Checkbox } from "@/Components/ui/checkbox";
import { Link } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    User,
    Calendar,
    Clock,
    Phone,
    Mail,
    MessageSquare,
    AlertTriangle,
    FileText,
    Users,
    Sparkles,
    Heart,
    Star,
} from "lucide-react";
import { useState } from "react";

export default function Edit({
    auth,
    clinic,
    waitlist,
    patients,
    dentists,
    services,
    appointmentTypes,
}) {
    const { data, setData, put, processing, errors } = useForm({
        patient_id: waitlist.patient_id || "",
        preferred_dentist_id: waitlist.preferred_dentist_id || null,
        service_id: waitlist.service_id || null,
        appointment_type_id: waitlist.appointment_type_id || null,
        reason: waitlist.reason || "",
        notes: waitlist.notes || "",
        priority: waitlist.priority || "normal",
        status: waitlist.status || "active",
        preferred_start_date: waitlist.preferred_start_date || "",
        preferred_end_date: waitlist.preferred_end_date || "",
        preferred_days: waitlist.preferred_days || [],
        preferred_start_time: waitlist.preferred_start_time || "",
        preferred_end_time: waitlist.preferred_end_time || "",
        contact_method: waitlist.contact_method || "any",
        contact_notes: waitlist.contact_notes || "",
        estimated_duration: waitlist.estimated_duration || 60,
    });

    const [selectedDays, setSelectedDays] = useState(
        waitlist.preferred_days || []
    );

    const handleDayToggle = (day) => {
        const newDays = selectedDays.includes(day)
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];
        setSelectedDays(newDays);
        setData("preferred_days", newDays);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("clinic.waitlist.update", [clinic.id, waitlist.id]));
    };

    const daysOfWeek = [
        { value: 0, label: "Sunday" },
        { value: 1, label: "Monday" },
        { value: 2, label: "Tuesday" },
        { value: 3, label: "Wednesday" },
        { value: 4, label: "Thursday" },
        { value: 5, label: "Friday" },
        { value: 6, label: "Saturday" },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("clinic.waitlist.show", [
                                clinic.id,
                                waitlist.id,
                            ])}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Details
                            </Button>
                        </Link>
                        <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg">
                            <Users className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Edit Waitlist Entry
                            </h2>
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-500" />
                                Update patient waitlist information
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Edit Waitlist Entry" />

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Patient Information */}
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            Patient Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="patient_id">Patient *</Label>
                            <Select
                                value={data.patient_id}
                                onValueChange={(value) =>
                                    setData("patient_id", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem
                                            key={patient.id}
                                            value={patient.id}
                                        >
                                            {patient.first_name}{" "}
                                            {patient.last_name} -{" "}
                                            {patient.email}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.patient_id && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.patient_id}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Appointment Details */}
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            Appointment Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="preferred_dentist_id">
                                    Preferred Dentist
                                </Label>
                                <Select
                                    value={data.preferred_dentist_id || ""}
                                    onValueChange={(value) =>
                                        setData(
                                            "preferred_dentist_id",
                                            value || null
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any dentist" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dentists.map((dentist) => (
                                            <SelectItem
                                                key={dentist.id}
                                                value={dentist.id}
                                            >
                                                {dentist.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.preferred_dentist_id && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.preferred_dentist_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="service_id">Service</Label>
                                <Select
                                    value={data.service_id || ""}
                                    onValueChange={(value) =>
                                        setData("service_id", value || null)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a service" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map((service) => (
                                            <SelectItem
                                                key={service.id}
                                                value={service.id}
                                            >
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.service_id && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.service_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="appointment_type_id">
                                    Appointment Type
                                </Label>
                                <Select
                                    value={data.appointment_type_id || ""}
                                    onValueChange={(value) =>
                                        setData(
                                            "appointment_type_id",
                                            value || null
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select appointment type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {appointmentTypes.map((type) => (
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
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.appointment_type_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="estimated_duration">
                                    Estimated Duration (minutes) *
                                </Label>
                                <Input
                                    id="estimated_duration"
                                    type="number"
                                    min="15"
                                    max="240"
                                    value={data.estimated_duration}
                                    onChange={(e) =>
                                        setData(
                                            "estimated_duration",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.estimated_duration && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.estimated_duration}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="reason">Reason</Label>
                            <Input
                                id="reason"
                                value={data.reason}
                                onChange={(e) =>
                                    setData("reason", e.target.value)
                                }
                                placeholder="Reason for appointment"
                            />
                            {errors.reason && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.reason}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Additional notes"
                                rows={3}
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.notes}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Priority and Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Priority & Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="priority">Priority *</Label>
                                <Select
                                    value={data.priority}
                                    onValueChange={(value) =>
                                        setData("priority", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="normal">
                                            Normal
                                        </SelectItem>
                                        <SelectItem value="high">
                                            High
                                        </SelectItem>
                                        <SelectItem value="urgent">
                                            Urgent
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.priority && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.priority}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData("status", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="contacted">
                                            Contacted
                                        </SelectItem>
                                        <SelectItem value="scheduled">
                                            Scheduled
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                        <SelectItem value="expired">
                                            Expired
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Preferred Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Preferred Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="preferred_start_date">
                                    Preferred Start Date
                                </Label>
                                <Input
                                    id="preferred_start_date"
                                    type="date"
                                    value={data.preferred_start_date}
                                    onChange={(e) =>
                                        setData(
                                            "preferred_start_date",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.preferred_start_date && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.preferred_start_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="preferred_end_date">
                                    Preferred End Date
                                </Label>
                                <Input
                                    id="preferred_end_date"
                                    type="date"
                                    value={data.preferred_end_date}
                                    onChange={(e) =>
                                        setData(
                                            "preferred_end_date",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.preferred_end_date && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.preferred_end_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="preferred_start_time">
                                    Preferred Start Time
                                </Label>
                                <Input
                                    id="preferred_start_time"
                                    type="time"
                                    value={data.preferred_start_time}
                                    onChange={(e) =>
                                        setData(
                                            "preferred_start_time",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.preferred_start_time && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.preferred_start_time}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="preferred_end_time">
                                    Preferred End Time
                                </Label>
                                <Input
                                    id="preferred_end_time"
                                    type="time"
                                    value={data.preferred_end_time}
                                    onChange={(e) =>
                                        setData(
                                            "preferred_end_time",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.preferred_end_time && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.preferred_end_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <Label>Preferred Days</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                {daysOfWeek.map((day) => (
                                    <div
                                        key={day.value}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`day-${day.value}`}
                                            checked={selectedDays.includes(
                                                day.value
                                            )}
                                            onCheckedChange={() =>
                                                handleDayToggle(day.value)
                                            }
                                        />
                                        <Label
                                            htmlFor={`day-${day.value}`}
                                            className="text-sm"
                                        >
                                            {day.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {errors.preferred_days && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.preferred_days}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                                <Phone className="h-5 w-5 text-white" />
                            </div>
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="contact_method">
                                Preferred Contact Method *
                            </Label>
                            <Select
                                value={data.contact_method}
                                onValueChange={(value) =>
                                    setData("contact_method", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phone">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Phone
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="email">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="sms">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            SMS
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="any">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Any Method
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.contact_method && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.contact_method}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="contact_notes">Contact Notes</Label>
                            <Textarea
                                id="contact_notes"
                                value={data.contact_notes}
                                onChange={(e) =>
                                    setData("contact_notes", e.target.value)
                                }
                                placeholder="Notes about contact preferences or attempts"
                                rows={3}
                            />
                            {errors.contact_notes && (
                                <p className="text-sm text-red-600 mt-1">
                                    {errors.contact_notes}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6">
                    <Link
                        href={route("clinic.waitlist.show", [
                            clinic.id,
                            waitlist.id,
                        ])}
                    >
                        <Button
                            type="button"
                            variant="outline"
                            className="border-2 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
