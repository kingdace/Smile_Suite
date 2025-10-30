import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { format } from "date-fns";
import {
    ArrowLeft,
    Pencil,
    Calendar,
    Clock,
    User,
    Stethoscope,
    Phone,
    Mail,
    MapPin,
    FileText,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    CalendarDays,
    CalendarClock,
    Package,
    DollarSign,
    MessageSquare,
    Trash2,
    Copy,
    Share2,
    Printer,
    Send,
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Show({ auth, clinic, appointment, flash }) {
    // Helper function to clean notes by removing SMS reminder data
    const cleanNotes = (notes) => {
        if (!notes) return "";
        // Remove SMS reminder data like [sms_reminder_2025-10-27]
        return notes.replace(/\[sms_reminder_[\d-]+\]/g, '').trim();
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

    const getTypeColor = (typeName) => {
        const colors = {
            "Walk-in": "bg-purple-100 text-purple-800 border-purple-300",
            "Phone Call": "bg-indigo-100 text-indigo-800 border-indigo-300",
            "Online Booking": "bg-cyan-100 text-cyan-800 border-cyan-300",
            "Follow-up": "bg-orange-100 text-orange-800 border-orange-300",
            Emergency: "bg-red-100 text-red-800 border-red-300",
        };
        return colors[typeName] || "bg-gray-100 text-gray-800 border-gray-300";
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

    const formatPhoneNumber = (phone) => {
        if (!phone) return "Not provided";
        // Format Philippine phone numbers
        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.length === 11 && cleaned.startsWith("09")) {
            return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
        }
        return phone;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Appointment Details
                </h2>
            }
        >
            <Head title="Appointment Details" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Success Message */}
                {flash?.success && (
                    <div className="max-w-7xl mx-auto px-6 pt-2">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-sm mb-4">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="font-medium">
                                    {flash.success}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

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
                                            <Calendar className="h-5 w-5 text-white" />
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
                                                href={route("clinic.appointments.index", clinic.id)}
                                                className="text-white/80 hover:text-white transition-colors text-xs"
                                            >
                                                Appointments
                                            </Link>
                                            <span className="text-white/60 text-xs">/</span>
                                            <span className="text-white font-semibold text-xs">Appointment #{appointment.id}</span>
                                        </div>
                                        <h1 className="text-xl font-bold text-white">
                                            {appointment.patient?.first_name} {appointment.patient?.last_name}
                                        </h1>
                                        <p className="text-white/80 text-xs mt-0.5">
                                            {format(new Date(appointment.scheduled_at), "EEEE, MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Right side - Action buttons */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(`Appointment #${appointment.id}`)}
                                        className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                                    >
                                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                                        Copy ID
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.print()}
                                        className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
                                    >
                                        <Printer className="h-3.5 w-3.5 mr-1.5" />
                                        Print
                                    </Button>
                                    <Link href={route("clinic.appointments.edit", [clinic.id, appointment.id])}>
                                        <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm transition-all shadow-lg">
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Edit Appointment
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Appointment Status Card */}
                            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
                                    <CardTitle className="flex items-center gap-3 text-white">
                                        <Calendar className="h-6 w-6" />
                                        Appointment Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Type
                                                    </p>
                                                    <Badge
                                                        className={`${getTypeColor(
                                                            appointment.type
                                                                ?.name
                                                        )}`}
                                                    >
                                                        {appointment.type?.name}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Status
                                                    </p>
                                                    <Badge
                                                        className={`${getStatusColor(
                                                            appointment.status
                                                                ?.name
                                                        )}`}
                                                    >
                                                        {
                                                            appointment.status
                                                                ?.name
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Clock className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Duration
                                                    </p>
                                                    <p className="font-semibold">
                                                        {appointment.duration ||
                                                            30}{" "}
                                                        minutes
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <DollarSign className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Payment Status
                                                    </p>
                                                    <Badge
                                                        className={`${getPaymentStatusColor(
                                                            appointment.payment_status
                                                        )}`}
                                                    >
                                                        {appointment.payment_status
                                                            ?.charAt(0)
                                                            .toUpperCase() +
                                                            appointment.payment_status?.slice(
                                                                1
                                                            )}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Patient-Initiated Changes Alert */}
                            {appointment.status?.name === "Cancelled" &&
                                appointment.cancelled_at &&
                                appointment.cancellation_reason && (
                                    <Card className="shadow-lg border-0 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500">
                                        <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600">
                                            <CardTitle className="flex items-center gap-3 text-white">
                                                <AlertCircle className="h-6 w-6" />
                                                Patient Cancellation
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                        <XCircle className="h-5 w-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Cancelled by Patient
                                                        </p>
                                                        <p className="font-semibold text-red-800">
                                                            {format(
                                                                new Date(
                                                                    appointment.cancelled_at
                                                                ),
                                                                "MMM d, yyyy 'at' h:mm a"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 rounded-lg">
                                                        <MessageSquare className="h-5 w-5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Reason
                                                        </p>
                                                        <p className="font-semibold text-gray-800">
                                                            {
                                                                appointment.cancellation_reason
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 p-4 bg-white/80 rounded-lg border border-red-200">
                                                    <p className="text-sm text-gray-700 mb-3">
                                                        <strong>
                                                            Quick Actions:
                                                        </strong>
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-green-300 text-green-700 hover:bg-green-50"
                                                            onClick={() => {
                                                                // Copy patient contact info to clipboard
                                                                const contactInfo = `Patient: ${appointment.patient?.first_name} ${appointment.patient?.last_name}\nEmail: ${appointment.patient?.email}\nPhone: ${appointment.patient?.phone_number}`;
                                                                copyToClipboard(
                                                                    contactInfo
                                                                );
                                                            }}
                                                        >
                                                            <Copy className="h-4 w-4 mr-2" />
                                                            Copy Contact Info
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                                            onClick={() => {
                                                                // Open email client
                                                                const subject = `Re: Appointment Cancellation - ${appointment.patient?.first_name} ${appointment.patient?.last_name}`;
                                                                const body = `Dear ${appointment.patient?.first_name},\n\nThank you for notifying us about your appointment cancellation. We understand that ${appointment.cancellation_reason}.\n\nWe would be happy to reschedule your appointment at a more convenient time. Please let us know your preferred dates and times.\n\nBest regards,\n${clinic.name}`;
                                                                window.open(
                                                                    `mailto:${
                                                                        appointment
                                                                            .patient
                                                                            ?.email
                                                                    }?subject=${encodeURIComponent(
                                                                        subject
                                                                    )}&body=${encodeURIComponent(
                                                                        body
                                                                    )}`
                                                                );
                                                            }}
                                                        >
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Send Email
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Patient Reschedule Alert */}
                            {appointment.notes &&
                                cleanNotes(appointment.notes).includes(
                                    "Rescheduled by patient"
                                ) && (
                                    <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-l-blue-500">
                                        <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600">
                                            <CardTitle className="flex items-center gap-3 text-white">
                                                <CalendarClock className="h-6 w-6" />
                                                Patient Reschedule
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <CalendarClock className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Rescheduled by
                                                            Patient
                                                        </p>
                                                        <p className="font-semibold text-blue-800">
                                                            New time:{" "}
                                                            {format(
                                                                new Date(
                                                                    appointment.scheduled_at
                                                                ),
                                                                "MMM d, yyyy 'at' h:mm a"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                                        <MessageSquare className="h-5 w-5 text-cyan-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Notes
                                                        </p>
                                                        <p className="font-semibold text-gray-800">
                                                            {cleanNotes(appointment.notes)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 p-4 bg-white/80 rounded-lg border border-blue-200">
                                                    <p className="text-sm text-gray-700 mb-3">
                                                        <strong>
                                                            Quick Actions:
                                                        </strong>
                                                    </p>
                                                    <div className="flex gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-green-300 text-green-700 hover:bg-green-50"
                                                            onClick={() => {
                                                                // Copy patient contact info to clipboard
                                                                const contactInfo = `Patient: ${appointment.patient?.first_name} ${appointment.patient?.last_name}\nEmail: ${appointment.patient?.email}\nPhone: ${appointment.patient?.phone_number}`;
                                                                copyToClipboard(
                                                                    contactInfo
                                                                );
                                                            }}
                                                        >
                                                            <Copy className="h-4 w-4 mr-2" />
                                                            Copy Contact Info
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                                            onClick={() => {
                                                                // Open email client
                                                                const subject = `Re: Appointment Reschedule - ${appointment.patient?.first_name} ${appointment.patient?.last_name}`;
                                                                const body = `Dear ${
                                                                    appointment
                                                                        .patient
                                                                        ?.first_name
                                                                },\n\nThank you for updating your appointment time. We have confirmed your new appointment for ${format(
                                                                    new Date(
                                                                        appointment.scheduled_at
                                                                    ),
                                                                    "MMMM d, yyyy 'at' h:mm a"
                                                                )}.\n\nIf you need to make any further changes, please don't hesitate to contact us.\n\nBest regards,\n${
                                                                    clinic.name
                                                                }`;
                                                                window.open(
                                                                    `mailto:${
                                                                        appointment
                                                                            .patient
                                                                            ?.email
                                                                    }?subject=${encodeURIComponent(
                                                                        subject
                                                                    )}&body=${encodeURIComponent(
                                                                        body
                                                                    )}`
                                                                );
                                                            }}
                                                        >
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Send Confirmation
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Follow-up Appointment Alert */}
                            {(appointment.is_follow_up || appointment.previous_visit_date || appointment.previous_visit_notes) && (
                                <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-l-orange-500">
                                    <CardHeader className="bg-gradient-to-r from-orange-600 to-yellow-600">
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <AlertCircle className="h-6 w-6" />
                                            Follow-up Appointment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {appointment.previous_visit_date && (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 rounded-lg">
                                                        <Calendar className="h-5 w-5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">Previous Visit</p>
                                                        <p className="font-semibold text-orange-800">
                                                            {format(new Date(appointment.previous_visit_date), "MMMM d, yyyy")}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {appointment.previous_visit_notes && (
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                                        <FileText className="h-5 w-5 text-yellow-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600 mb-2">Previous Visit Notes</p>
                                                        <p className="text-gray-800 bg-white p-3 rounded-lg border border-orange-200">
                                                            {appointment.previous_visit_notes}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {!appointment.previous_visit_date && !appointment.previous_visit_notes && appointment.is_follow_up && (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 rounded-lg">
                                                        <AlertCircle className="h-5 w-5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-orange-800">
                                                            This is marked as a follow-up appointment
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            No previous visit details recorded
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Patient Information Card */}
                            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800">
                                    <CardTitle className="flex items-center gap-3 text-white">
                                        <User className="h-6 w-6" />
                                        Patient Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <User className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Full Name
                                                    </p>
                                                    <p className="font-semibold">
                                                        {
                                                            appointment.patient
                                                                ?.first_name
                                                        }{" "}
                                                        {
                                                            appointment.patient
                                                                ?.last_name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Mail className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Email
                                                    </p>
                                                    <p className="font-semibold">
                                                        {appointment.patient
                                                            ?.email ||
                                                            "Not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-cyan-100 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-cyan-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Date of Birth
                                                    </p>
                                                    <p className="font-semibold">
                                                        {appointment.patient
                                                            ?.date_of_birth
                                                            ? format(
                                                                  new Date(
                                                                      appointment.patient.date_of_birth
                                                                  ),
                                                                  "MMMM d, yyyy"
                                                              )
                                                            : "Not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Phone className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Phone Number
                                                    </p>
                                                    <p className="font-semibold">
                                                        {formatPhoneNumber(
                                                            appointment.patient
                                                                ?.phone_number
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-pink-100 rounded-lg">
                                                    <User className="h-5 w-5 text-pink-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Gender
                                                    </p>
                                                    <p className="font-semibold">
                                                        {appointment.patient
                                                            ?.gender
                                                            ? appointment.patient.gender
                                                                  .charAt(0)
                                                                  .toUpperCase() +
                                                              appointment.patient.gender.slice(
                                                                  1
                                                              )
                                                            : "Not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <MapPin className="h-5 w-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Address
                                                    </p>
                                                    <p className="font-semibold">
                                                        {appointment.patient
                                                            ?.address_details ||
                                                            appointment.patient
                                                                ?.street_address ||
                                                            appointment.patient
                                                                ?.address ||
                                                            "Not provided"}
                                                    </p>
                                                    {(appointment.patient
                                                        ?.barangay_name ||
                                                        appointment.patient
                                                            ?.city_municipality_name ||
                                                        appointment.patient
                                                            ?.province_name) && (
                                                        <p className="text-sm text-gray-500">
                                                            {appointment.patient
                                                                ?.barangay_name &&
                                                                `${appointment.patient.barangay_name}`}
                                                            {appointment.patient
                                                                ?.city_municipality_name &&
                                                                appointment
                                                                    .patient
                                                                    ?.barangay_name &&
                                                                ", "}
                                                            {appointment.patient
                                                                ?.city_municipality_name &&
                                                                `${appointment.patient.city_municipality_name}`}
                                                            {appointment.patient
                                                                ?.province_name &&
                                                                (appointment
                                                                    .patient
                                                                    ?.city_municipality_name ||
                                                                    appointment
                                                                        .patient
                                                                        ?.barangay_name) &&
                                                                ", "}
                                                            {appointment.patient
                                                                ?.province_name &&
                                                                `${appointment.patient.province_name}`}
                                                            {appointment.patient
                                                                ?.postal_code &&
                                                                ` ${appointment.patient.postal_code}`}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Appointment Details Card */}
                            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800">
                                    <CardTitle className="flex items-center gap-3 text-white">
                                        <FileText className="h-6 w-6" />
                                        Appointment Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <CalendarDays className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Scheduled Date & Time
                                                    </p>
                                                    <p className="font-semibold">
                                                        {format(
                                                            new Date(
                                                                appointment.scheduled_at
                                                            ),
                                                            "EEEE, MMMM d, yyyy"
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {format(
                                                            new Date(
                                                                appointment.scheduled_at
                                                            ),
                                                            "h:mm a"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {appointment.ended_at && (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                        <ClockIcon className="h-5 w-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Ended Date & Time
                                                        </p>
                                                        <p className="font-semibold">
                                                            {format(
                                                                new Date(
                                                                    appointment.ended_at
                                                                ),
                                                                "EEEE, MMMM d, yyyy"
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {format(
                                                                new Date(
                                                                    appointment.ended_at
                                                                ),
                                                                "h:mm a"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-100 rounded-lg">
                                                    <Stethoscope className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Assigned Dentist
                                                    </p>
                                                    <p className="font-semibold">
                                                        {appointment
                                                            .assigned_dentist
                                                            ?.name ||
                                                            "Not assigned"}
                                                    </p>
                                                </div>
                                            </div>
                                            {appointment.service && (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                                        <Package className="h-5 w-5 text-cyan-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">
                                                            Service
                                                        </p>
                                                        <p className="font-semibold">
                                                            {
                                                                appointment
                                                                    .service
                                                                    .name
                                                            }
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <p className="text-sm font-semibold text-cyan-600">
                                                                ₱{appointment.service.price}
                                                            </p>
                                                            {appointment.service.duration_minutes && (
                                                                <>
                                                                    <span className="text-gray-400">•</span>
                                                                    <p className="text-sm text-gray-500">
                                                                        {appointment.service.duration_minutes} min
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Treatments Section */}
                            {appointment.treatments && appointment.treatments.length > 0 && (
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-800">
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <Stethoscope className="h-6 w-6" />
                                            Treatments Performed ({appointment.treatments.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {appointment.treatments.map((treatment, index) => (
                                                <div
                                                    key={treatment.id || index}
                                                    className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-gray-900 text-lg">
                                                            {treatment.service?.name || treatment.treatment_name || "Treatment"}
                                                        </h4>
                                                        {treatment.total_cost && (
                                                            <Badge className="bg-green-100 text-green-800 border-green-300 text-sm px-3 py-1">
                                                                ₱{parseFloat(treatment.total_cost).toLocaleString()}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                                                        {treatment.dentist && (
                                                            <div className="flex items-center gap-2">
                                                                <Stethoscope className="h-4 w-4 text-cyan-600" />
                                                                <div>
                                                                    <span className="text-gray-600">Dentist:</span>{" "}
                                                                    <span className="font-medium">{treatment.dentist.name}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {treatment.status && (
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                                <div>
                                                                    <span className="text-gray-600">Status:</span>{" "}
                                                                    <Badge className={`ml-1 ${
                                                                        treatment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        treatment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1).replace('_', ' ')}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {treatment.tooth_number && (
                                                            <div className="flex items-center gap-2">
                                                                <Package className="h-4 w-4 text-purple-600" />
                                                                <div>
                                                                    <span className="text-gray-600">Tooth:</span>{" "}
                                                                    <span className="font-medium">#{treatment.tooth_number}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {treatment.notes && (
                                                        <div className="mt-3 p-3 bg-white rounded border border-cyan-100">
                                                            <p className="text-sm text-gray-600 mb-1 font-medium">Treatment Notes:</p>
                                                            <p className="text-sm text-gray-700">{treatment.notes}</p>
                                                        </div>
                                                    )}

                                                    {treatment.id && (
                                                        <div className="mt-3 flex gap-2">
                                                            <Link href={route('clinic.treatments.show', [clinic.id, treatment.id])}>
                                                                <Button size="sm" variant="outline" className="border-cyan-300 text-cyan-700 hover:bg-cyan-50">
                                                                    <FileText className="h-3 w-3 mr-1" />
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Notes and Additional Information */}
                            {(appointment.reason ||
                                (appointment.notes && cleanNotes(appointment.notes)) ||
                                appointment.cancellation_reason) && (
                                <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                    <CardHeader className="bg-gradient-to-r from-gray-600 via-gray-700 to-slate-800">
                                        <CardTitle className="flex items-center gap-3 text-white">
                                            <FileText className="h-6 w-6" />
                                            Additional Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {appointment.reason && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                                        Reason for Visit
                                                    </p>
                                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                        {appointment.reason}
                                                    </p>
                                                </div>
                                            )}
                                            {appointment.notes && cleanNotes(appointment.notes) && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                                        Notes
                                                    </p>
                                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                        {cleanNotes(appointment.notes)}
                                                    </p>
                                                </div>
                                            )}
                                            {appointment.cancellation_reason && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                                        Cancellation Reason
                                                    </p>
                                                    <p className="text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200">
                                                        {
                                                            appointment.cancellation_reason
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Reminder
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Reschedule
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        View History
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Appointment History */}
                            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Appointment History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1.5 bg-blue-100 rounded-full">
                                                <CheckCircle className="h-3 w-3 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Created
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {format(
                                                        new Date(
                                                            appointment.created_at
                                                        ),
                                                        "MMM d, yyyy h:mm a"
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    by{" "}
                                                    {
                                                        appointment.creator
                                                            ?.first_name
                                                    }{" "}
                                                    {
                                                        appointment.creator
                                                            ?.last_name
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {appointment.confirmed_at && (
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-green-100 rounded-full">
                                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Confirmed
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {format(
                                                            new Date(
                                                                appointment.confirmed_at
                                                            ),
                                                            "MMM d, yyyy h:mm a"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {appointment.cancelled_at && (
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-red-100 rounded-full">
                                                    <XCircle className="h-3 w-3 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        Cancelled
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {format(
                                                            new Date(
                                                                appointment.cancelled_at
                                                            ),
                                                            "MMM d, yyyy h:mm a"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start gap-3">
                                            <div className="p-1.5 bg-gray-100 rounded-full">
                                                <Clock className="h-3 w-3 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Last Updated
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {format(
                                                        new Date(
                                                            appointment.updated_at
                                                        ),
                                                        "MMM d, yyyy h:mm a"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Related Information */}
                            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Related Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Patient ID
                                            </span>
                                            <span className="text-sm font-medium">
                                                {appointment.patient?.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Appointment ID
                                            </span>
                                            <span className="text-sm font-medium">
                                                #{appointment.id}
                                            </span>
                                        </div>
                                        {appointment.assigned_dentist && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Dentist ID
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {
                                                        appointment
                                                            .assigned_dentist.id
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {appointment.service && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">
                                                    Service ID
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {appointment.service.id}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
