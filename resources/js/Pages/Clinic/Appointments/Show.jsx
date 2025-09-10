import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
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

export default function Show({ auth, clinic, appointment }) {
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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header with Actions */}
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

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Appointment #{appointment.id}
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    {format(
                                        new Date(appointment.scheduled_at),
                                        "EEEE, MMMM d, yyyy"
                                    )}{" "}
                                    at{" "}
                                    {format(
                                        new Date(appointment.scheduled_at),
                                        "h:mm a"
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        copyToClipboard(
                                            `Appointment #${appointment.id}`
                                        )
                                    }
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy ID
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.print()}
                                >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                </Button>
                                <Link
                                    href={route("clinic.appointments.edit", [
                                        clinic.id,
                                        appointment.id,
                                    ])}
                                >
                                    <Button>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit Appointment
                                    </Button>
                                </Link>
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
                                appointment.notes.includes(
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
                                                            {appointment.notes}
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
                                                        {appointment.assigned_dentist &&
                                                        appointment
                                                            .assigned_dentist
                                                            .name
                                                            ? `Dr. ${appointment.assigned_dentist.name}`
                                                            : "Not assigned"}
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
                                                        <p className="text-sm text-gray-500">
                                                            ₱
                                                            {
                                                                appointment
                                                                    .service
                                                                    .price
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Notes and Additional Information */}
                            {(appointment.reason ||
                                appointment.notes ||
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
                                            {appointment.notes && (
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 mb-2">
                                                        Notes
                                                    </p>
                                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                        {appointment.notes}
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
