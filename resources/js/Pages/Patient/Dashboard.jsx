import { Head, usePage, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    Calendar,
    User,
    FileText,
    LayoutDashboard,
    Bell,
    Settings,
    Heart,
    Stethoscope,
    DollarSign,
    Plus,
    Search,
    Building2,
    CreditCard,
    Eye,
    MoreVertical,
    ChevronRight,
    BookOpen,
    Shield,
    Sparkles,
    Activity,
    Zap,
    MessageCircle,
    LogOut,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    RefreshCw,
    AlertTriangle,
    HelpCircle,
    ArrowRight,
    ChevronLeft,
    MapPin,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Spinner,
    Skeleton,
    CardSkeleton,
    AppointmentCardSkeleton,
    StatCardSkeleton,
    QuickActionSkeleton,
    LoadingOverlay,
    FadeIn,
    SlideIn,
} from "@/Components/ui/loading";
import { Progress } from "@/Components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import { cn } from "@/lib/utils";
import SiteHeader from "@/Components/SiteHeader";
import AppointmentDetailsModal from "./Components/AppointmentDetailsModal";
import AppointmentCancellationModal from "./Components/AppointmentCancellationModal";
import AppointmentReschedulingModal from "./Components/AppointmentReschedulingModal";

// Enhanced Appointments Section Component
const AppointmentsSection = ({ appointments = [] }) => {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const appointmentsPerPage = 5;

    const formatAppointmentNotes = (notes) => {
        if (!notes) return null;

        // Check if it's a system-generated reschedule message
        if (notes.includes("Reschedule") || notes.includes("BROAWS")) {
            // Count reschedule attempts
            const rescheduleCount = (notes.match(/Reschedule/g) || []).length;

            // Extract meaningful reasons (filter out system codes)
            const reasonMatches = notes.match(/Reason: ([^.]+)/g);
            const meaningfulReasons = [];

            if (reasonMatches) {
                reasonMatches.forEach((match) => {
                    const reason = match.replace("Reason: ", "").trim();
                    // Filter out system codes and meaningless text
                    if (
                        reason &&
                        !reason.includes("BROAWS") &&
                        !reason.includes("qwe") &&
                        !reason.includes("No available slots") &&
                        reason.length > 3
                    ) {
                        meaningfulReasons.push(reason);
                    }
                });
            }

            let formattedNote = "📅 Rescheduled";

            if (rescheduleCount > 1) {
                formattedNote += ` (${rescheduleCount}x)`;
            }

            if (meaningfulReasons.length > 0) {
                // Show the most recent meaningful reason
                const lastReason =
                    meaningfulReasons[meaningfulReasons.length - 1];
                formattedNote += ` - ${lastReason}`;
            }

            // Check if appointment was approved
            if (notes.includes("approved by clinic")) {
                formattedNote += " ✅";
            }

            return formattedNote;
        }

        // Check for other system messages
        if (notes.includes("denied by clinic")) {
            return "❌ Reschedule request denied";
        }

        if (notes.includes("cancelled")) {
            return "🚫 Appointment cancelled";
        }

        // For regular notes, clean up and format nicely
        const cleanNotes = notes.trim();
        if (cleanNotes.length > 80) {
            return cleanNotes.substring(0, 80) + "...";
        }

        return cleanNotes;
    };
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case "pending reschedule":
                return <Clock className="w-4 h-4 text-orange-500" />;
            case "confirmed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-500" />;
            case "completed":
                return <CheckCircle className="w-4 h-4 text-blue-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "pending reschedule":
                return "bg-orange-100 text-orange-800";
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            case "completed":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleViewDetails = async (appointment) => {
        setSelectedAppointment(appointment);
        setLoading(true);
        setShowDetailsModal(true);
        setLoading(false);
    };

    const handleCancelAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowCancelModal(true);
    };

    const handleRescheduleAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowRescheduleModal(true);
    };

    const handleConfirmCancel = async (cancellationReason) => {
        if (!selectedAppointment) return;

        setLoading(true);
        try {
            router.post(
                route("patient.appointments.cancel", selectedAppointment.id),
                {
                    cancellation_reason: cancellationReason,
                },
                {
                    onSuccess: () => {
                        setShowCancelModal(false);
                        setSelectedAppointment(null);
                        // Page will refresh automatically due to redirect
                    },
                    onError: (errors) => {
                        console.error("Cancellation failed:", errors);
                        setLoading(false);
                    },
                }
            );
        } catch (error) {
            console.error("Cancellation error:", error);
            setLoading(false);
        }
    };

    const handleConfirmReschedule = async (rescheduleData) => {
        if (!selectedAppointment) return;

        setLoading(true);
        try {
            router.post(
                route(
                    "patient.appointments.reschedule",
                    selectedAppointment.id
                ),
                rescheduleData,
                {
                    onSuccess: () => {
                        setShowRescheduleModal(false);
                        setSelectedAppointment(null);
                        // Page will refresh automatically due to redirect
                    },
                    onError: (errors) => {
                        console.error("Rescheduling failed:", errors);
                        setLoading(false);
                    },
                }
            );
        } catch (error) {
            console.error("Rescheduling error:", error);
            setLoading(false);
        }
    };

    const closeModals = () => {
        setShowDetailsModal(false);
        setShowCancelModal(false);
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
        setLoading(false);
    };

    // Pagination logic
    const totalPages = Math.ceil(appointments.length / appointmentsPerPage);
    const startIndex = (currentPage - 1) * appointmentsPerPage;
    const endIndex = startIndex + appointmentsPerPage;
    const currentAppointments = appointments.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            My Appointments
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Your latest dental appointments (
                            {appointments.length} total)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <div className="flex gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 p-0"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 p-0"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                </div>
            </div>
            <div>
                {appointments.length > 0 ? (
                    <div className="space-y-4">
                        {currentAppointments.map((appointment, index) => (
                            <SlideIn
                                key={appointment.id}
                                direction="up"
                                delay={index * 100}
                            >
                                <div
                                    className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group cursor-pointer shadow-lg"
                                    role="article"
                                    aria-label={`Appointment at ${
                                        appointment.clinic?.name || "Clinic"
                                    } on ${new Date(
                                        appointment.scheduled_at
                                    ).toLocaleDateString()}`}
                                    onClick={() =>
                                        handleViewDetails(appointment)
                                    }
                                >
                                    {/* Enhanced Header with Status and Visual Elements */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "w-4 h-4 rounded-full shadow-sm",
                                                        appointment.status?.name?.toLowerCase() ===
                                                            "confirmed" ||
                                                            appointment.status?.name?.toLowerCase() ===
                                                                "pending"
                                                            ? "bg-blue-500"
                                                            : appointment.status?.name?.toLowerCase() ===
                                                              "completed"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    )}
                                                />
                                                <Badge
                                                    className={cn(
                                                        getStatusColor(
                                                            appointment.status
                                                                ?.name
                                                        ),
                                                        "px-3 py-1 text-sm font-semibold"
                                                    )}
                                                    role="status"
                                                    aria-label={`Appointment status: ${
                                                        appointment.status
                                                            ?.name || "Unknown"
                                                    }`}
                                                >
                                                    {appointment.status?.name ||
                                                        "Unknown"}
                                                </Badge>
                                            </div>
                                            {/* Show special indicators for patient actions */}
                                            {appointment.status?.name ===
                                                "Pending Reschedule" && (
                                                <Badge className="text-xs font-bold px-3 py-1 rounded-full border bg-orange-100 text-orange-700 border-orange-300 shadow-sm">
                                                    Awaiting Clinic Response
                                                </Badge>
                                            )}
                                            {appointment.status?.name ===
                                                "Cancelled" &&
                                                appointment.cancelled_at && (
                                                    <Badge className="text-xs font-bold px-3 py-1 rounded-full border bg-red-100 text-red-700 border-red-300 shadow-sm">
                                                        You Cancelled
                                                    </Badge>
                                                )}
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Compact Clinic Information */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                                <img
                                                    src={
                                                        appointment.clinic
                                                            ?.logo_url ||
                                                        "/images/clinic-logo.png"
                                                    }
                                                    alt={`${
                                                        appointment.clinic
                                                            ?.name || "Clinic"
                                                    } Logo`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/images/clinic-logo.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 text-lg mb-1">
                                                    {appointment.clinic?.name ||
                                                        "Dental Clinic"}
                                                </h4>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="w-3 h-3 text-blue-500" />
                                                    <p className="text-xs line-clamp-1">
                                                        {appointment.clinic
                                                            ?.street_address ||
                                                            "Address not available"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compact Date and Time Information */}
                                    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                                    <Calendar className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-base">
                                                        {new Date(
                                                            appointment.scheduled_at
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="w-3 h-3 text-purple-500" />
                                                        <span className="text-sm font-medium">
                                                            {new Date(
                                                                appointment.scheduled_at
                                                            ).toLocaleTimeString(
                                                                "en-US",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-purple-600">
                                                    {new Date(
                                                        appointment.scheduled_at
                                                    ).getDate()}
                                                </div>
                                                <div className="text-xs text-gray-500 uppercase">
                                                    {new Date(
                                                        appointment.scheduled_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        { month: "short" }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compact Additional Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                        {appointment.dentist && (
                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                                                        <User className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                                            Dentist
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            Dr.{" "}
                                                            {
                                                                appointment
                                                                    .dentist
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {appointment.reason && (
                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                        <FileText className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                                                            Reason
                                                        </p>
                                                        <p className="text-sm text-gray-900 line-clamp-2">
                                                            {appointment.reason}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Compact Notes Section */}
                                    {formatAppointmentNotes(
                                        appointment.notes
                                    ) && (
                                        <div className="bg-white rounded-lg p-3 mb-4 border border-yellow-200 shadow-sm">
                                            <div className="flex items-start gap-2">
                                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-md flex items-center justify-center">
                                                    <AlertCircle className="w-3 h-3 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">
                                                        Notes
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatAppointmentNotes(
                                                            appointment.notes
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Compact Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                                        <div className="flex items-center gap-2">
                                            {appointment.status?.name?.toLowerCase() ===
                                                "pending" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 rounded-lg text-xs font-semibold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelAppointment(
                                                            appointment
                                                        );
                                                    }}
                                                    aria-label={`Cancel appointment at ${
                                                        appointment.clinic
                                                            ?.name || "Clinic"
                                                    } on ${new Date(
                                                        appointment.scheduled_at
                                                    ).toLocaleDateString()}`}
                                                >
                                                    <XCircle className="w-3 h-3" />
                                                    Cancel
                                                </Button>
                                            )}
                                            {appointment.status?.name?.toLowerCase() ===
                                                "confirmed" && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 rounded-lg text-xs font-semibold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRescheduleAppointment(
                                                            appointment
                                                        );
                                                    }}
                                                    aria-label={`Reschedule appointment at ${
                                                        appointment.clinic
                                                            ?.name || "Clinic"
                                                    } on ${new Date(
                                                        appointment.scheduled_at
                                                    ).toLocaleDateString()}`}
                                                >
                                                    <Clock className="w-3 h-3" />
                                                    Reschedule
                                                </Button>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex items-center gap-1 px-4 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewDetails(appointment);
                                            }}
                                            aria-label={`View details for appointment at ${
                                                appointment.clinic?.name ||
                                                "Clinic"
                                            } on ${new Date(
                                                appointment.scheduled_at
                                            ).toLocaleDateString()}`}
                                        >
                                            <Eye className="w-3 h-3" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </SlideIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                            No Appointments Yet
                        </h4>
                        <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                            Book your first appointment today to get started!
                        </p>
                        <Link href="/clinics">
                            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <Plus className="w-5 h-5" />
                                Find Clinics
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pagination Controls */}
                {appointments.length > appointmentsPerPage && (
                    <div className="mt-8 pt-6 border-t border-gray-200/50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(endIndex, appointments.length)} of{" "}
                                {appointments.length} appointments
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <Button
                                            key={page}
                                            variant={
                                                page === currentPage
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`w-8 h-8 p-0 ${
                                                page === currentPage
                                                    ? "bg-blue-500 text-white"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AppointmentDetailsModal
                showModal={showDetailsModal}
                onClose={closeModals}
                appointment={selectedAppointment}
                loading={loading}
            />

            <AppointmentCancellationModal
                showModal={showCancelModal}
                onClose={closeModals}
                appointment={selectedAppointment}
                onConfirm={handleConfirmCancel}
                loading={loading}
            />

            <AppointmentReschedulingModal
                showModal={showRescheduleModal}
                onClose={closeModals}
                appointment={selectedAppointment}
                onConfirm={handleConfirmReschedule}
                loading={loading}
            />
        </div>
    );
};

// Enhanced Quick Actions Component
const QuickActions = ({ loading = false }) => {
    const actions = [
        {
            name: "Book Appointment",
            description: "Schedule a new appointment",
            icon: Calendar,
            href: "/clinics",
            color: "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
            hoverBg: "hover:from-blue-50/80 hover:to-indigo-100/80",
            hoverBorder: "hover:border-blue-200/50",
            badge: "Popular",
            badgeColor: "bg-blue-100 text-blue-700",
        },
        {
            name: "My Profile",
            description: "Manage your information",
            icon: User,
            href: route("patient.profile"),
            color: "bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
            hoverBg: "hover:from-emerald-50/80 hover:to-teal-100/80",
            hoverBorder: "hover:border-emerald-200/50",
        },
        {
            name: "My Treatments",
            description: "View treatment history",
            icon: Stethoscope,
            href: route("patient.treatments.index"),
            color: "bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700",
            hoverBg: "hover:from-purple-50/80 hover:to-violet-100/80",
            hoverBorder: "hover:border-purple-200/50",
        },
        {
            name: "Find Clinics",
            description: "Discover nearby clinics",
            icon: Building2,
            href: "/clinics",
            color: "bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700",
            hoverBg: "hover:from-rose-50/80 hover:to-pink-100/80",
            hoverBorder: "hover:border-rose-200/50",
        },
    ];

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-6 sm:p-8">
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Quick Actions
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Access your most important features
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <QuickActionSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <FadeIn className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Quick Actions
                        </h3>
                        <p className="text-gray-600 text-xs">
                            Access your most important features and services
                        </p>
                    </div>
                </div>
            </div>
            <nav
                className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
                role="navigation"
                aria-label="Quick actions menu"
            >
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <SlideIn
                            key={action.name}
                            direction="up"
                            delay={index * 100}
                        >
                            <Link href={action.href}>
                                <div
                                    className={`relative flex flex-col items-center gap-3 px-4 py-5 text-gray-700 hover:text-gray-900 ${action.hoverBg} rounded-xl transition-all duration-300 group shadow-sm hover:shadow-lg border border-transparent ${action.hoverBorder} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105 min-h-[100px] justify-center`}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${action.name} - ${action.description}`}
                                >
                                    {/* Badge */}
                                    {action.badge && (
                                        <div
                                            className={`absolute -top-1 -right-1 px-2 py-1 text-xs font-bold rounded-full ${action.badgeColor} shadow-md z-10`}
                                        >
                                            {action.badge}
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}
                                        aria-hidden="true"
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="text-center space-y-1">
                                        <h4 className="font-bold text-sm mb-1">
                                            {action.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 leading-tight">
                                            {action.description}
                                        </p>
                                    </div>

                                    {/* Hover indicator */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-1">
                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </Link>
                        </SlideIn>
                    );
                })}
            </nav>
        </FadeIn>
    );
};

// Enhanced Treatments Overview Component
const TreatmentsOverview = ({ treatments = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const treatmentsPerPage = 3;

    const getTreatmentStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "in_progress":
                return <Clock className="w-4 h-4 text-blue-500" />;
            case "scheduled":
                return <Calendar className="w-4 h-4 text-yellow-500" />;
            case "cancelled":
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getTreatmentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "in_progress":
                return "bg-blue-100 text-blue-800";
            case "scheduled":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const totalPages = Math.ceil((treatments?.length || 0) / treatmentsPerPage);
    const startIndex = (currentPage - 1) * treatmentsPerPage;
    const endIndex = startIndex + treatmentsPerPage;
    const currentTreatments = (treatments || []).slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                        <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Treatment History
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Your dental treatment records ({(treatments?.length || 0)} total)
                        </p>
                    </div>
                </div>
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
            </div>
            <div>
                {(treatments?.length || 0) > 0 ? (
                    <div className="space-y-4">
                        {currentTreatments.map((treatment, index) => (
                            <SlideIn
                                key={treatment.id}
                                direction="up"
                                delay={index * 100}
                            >
                                <div
                                    className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 group cursor-pointer shadow-lg"
                                    role="article"
                                    aria-label={`Treatment: ${
                                        treatment.name || "Treatment"
                                    } at ${treatment.clinic?.name || "Clinic"}`}
                                >
                                    {/* Enhanced Header with Status and Visual Elements */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "w-4 h-4 rounded-full shadow-sm",
                                                        treatment.status?.toLowerCase() ===
                                                            "completed"
                                                            ? "bg-green-500"
                                                            : treatment.status?.toLowerCase() ===
                                                              "in_progress"
                                                            ? "bg-blue-500"
                                                            : treatment.status?.toLowerCase() ===
                                                              "scheduled"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    )}
                                                />
                                                <Badge
                                                    className={cn(
                                                        getTreatmentStatusColor(
                                                            treatment.status
                                                        ),
                                                        "px-3 py-1 text-sm font-semibold"
                                                    )}
                                                    role="status"
                                                    aria-label={`Treatment status: ${
                                                        treatment.status ||
                                                        "Unknown"
                                                    }`}
                                                >
                                                    {treatment.status ||
                                                        "Unknown"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                                            <ChevronRight className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Compact Clinic Information */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-purple-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                                <img
                                                    src={
                                                        treatment.clinic
                                                            ?.logo_url ||
                                                        "/images/clinic-logo.png"
                                                    }
                                                    alt={`${
                                                        treatment.clinic
                                                            ?.name || "Clinic"
                                                    } Logo`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/images/clinic-logo.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 text-lg mb-1">
                                                    {treatment.clinic?.name ||
                                                        "Dental Clinic"}
                                                </h4>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <MapPin className="w-3 h-3 text-purple-500" />
                                                    <p className="text-xs line-clamp-1">
                                                        {treatment.clinic
                                                            ?.street_address ||
                                                            "Address not available"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compact Treatment Information */}
                                    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                                    <Stethoscope className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-base">
                                                        {treatment.name ||
                                                            "Dental Treatment"}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FileText className="w-3 h-3 text-violet-500" />
                                                        <span className="text-sm font-medium">
                                                            {treatment.service
                                                                ?.name ||
                                                                "General Treatment"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-violet-600">
                                                    {treatment.cost
                                                        ? `₱${treatment.cost.toLocaleString()}`
                                                        : "N/A"}
                                                </div>
                                                <div className="text-xs text-gray-500 uppercase">
                                                    Cost
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compact Additional Information */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                        {treatment.dentist && (
                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-md flex items-center justify-center">
                                                        <User className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                                            Dentist
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            Dr.{" "}
                                                            {
                                                                treatment
                                                                    .dentist
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {treatment.start_date && (
                                            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                                                        <Calendar className="w-3 h-3 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                                                            Date
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-900">
                                                            {new Date(
                                                                treatment.start_date
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Compact Notes Section */}
                                    {treatment.notes && (
                                        <div className="bg-white rounded-lg p-3 mb-4 border border-yellow-200 shadow-sm">
                                            <div className="flex items-start gap-2">
                                                <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-md flex items-center justify-center">
                                                    <AlertCircle className="w-3 h-3 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">
                                                        Notes
                                                    </p>
                                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {treatment.notes}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Compact Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                                        <div className="flex items-center gap-2">
                                            {treatment.id &&
                                            treatment.id > 0 ? (
                                                <Link
                                                    href={route(
                                                        "patient.treatments.show",
                                                        treatment.id
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex items-center gap-1 px-4 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold"
                                                        aria-label={`View details for treatment: ${
                                                            treatment.name ||
                                                            "Treatment"
                                                        }`}
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View Details
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex items-center gap-1 px-4 py-1.5 opacity-50 cursor-not-allowed text-xs font-semibold"
                                                    disabled
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    View Details
                                                </Button>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500">
                                                ID: #{treatment.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SlideIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Stethoscope className="w-10 h-10 text-violet-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                            No Treatments Yet
                        </h4>
                        <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                            Your treatment history will appear here after your
                            first dental visit!
                        </p>
                        <Link href="/clinics">
                            <Button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 px-6 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <Plus className="w-5 h-5" />
                                Find Clinics
                            </Button>
                        </Link>
                    </div>
                )}

                {/* Pagination Controls */}
                {(treatments?.length || 0) > treatmentsPerPage && (
                    <div className="mt-8 pt-6 border-t border-gray-200/50">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(endIndex, treatments?.length || 0)} of{" "}
                                {treatments?.length || 0} treatments
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <Button
                                            key={page}
                                            variant={
                                                page === currentPage
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`w-8 h-8 p-0 ${
                                                page === currentPage
                                                    ? "bg-violet-500 text-white"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-2"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Statistics Component
const StatisticsSection = ({ clinicRecords = [], loading = false }) => {
    const totalClinics = clinicRecords.length;
    const totalAppointments = clinicRecords.reduce(
        (sum, record) => sum + (record.appointments_count || 0),
        0
    );
    const upcomingAppointments = clinicRecords.reduce(
        (sum, record) => sum + (record.upcoming_appointments || 0),
        0
    );

    const stats = [
        {
            name: "Connected Clinics",
            value: totalClinics,
            icon: Building2,
            gradient: "from-emerald-50/90 via-white/80 to-teal-100/60",
            border: "border-emerald-200/50",
            iconBg: "from-emerald-500 to-teal-600",
            iconGlow: "from-emerald-400/30 to-teal-500/30",
            trend: "+2",
            trendText: "New",
            trendColor: "text-emerald-600",
        },
        {
            name: "Total Appointments",
            value: totalAppointments,
            icon: Calendar,
            gradient: "from-orange-50/90 via-white/80 to-amber-100/60",
            border: "border-orange-200/50",
            iconBg: "from-orange-500 to-amber-600",
            iconGlow: "from-orange-400/30 to-amber-500/30",
            trend: "Active",
            trendText: "Active",
            trendColor: "text-orange-600",
        },
        {
            name: "Upcoming",
            value: upcomingAppointments,
            icon: Clock,
            gradient: "from-rose-50/90 via-white/80 to-pink-100/60",
            border: "border-rose-200/50",
            iconBg: "from-rose-500 to-pink-600",
            iconGlow: "from-rose-400/30 to-pink-500/30",
            trend: "Soon",
            trendText: "Soon",
            trendColor: "text-rose-600",
        },
    ];

    return (
        <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            role="region"
            aria-label="Statistics overview"
        >
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={stat.name}
                        className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-sm rounded-xl shadow-lg border ${stat.border} p-4 hover:shadow-xl transition-all duration-300 group hover:scale-102`}
                        role="article"
                        aria-label={`${stat.name} statistic`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="relative">
                                <div
                                    className={`w-10 h-10 bg-gradient-to-br ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300`}
                                    role="img"
                                    aria-label={`${stat.name} icon`}
                                >
                                    <Icon
                                        className="w-5 h-5 text-white"
                                        aria-hidden="true"
                                    />
                                </div>
                                {/* Animated glow effect */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.iconGlow} rounded-xl animate-pulse`}
                                    aria-hidden="true"
                                ></div>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`flex items-center gap-1 ${stat.trendColor} text-xs font-bold`}
                                    aria-label={`Status: ${stat.trend}`}
                                >
                                    <CheckCircle
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                    />
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-base font-bold text-gray-700 mb-1">
                            {stat.name}
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                            {stat.value}
                        </p>
                        <p className="text-sm text-gray-500 font-medium">
                            {stat.trendText === "New"
                                ? "Connected clinics"
                                : stat.trendText === "Active"
                                ? "All-time appointments"
                                : "Scheduled visits"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default function PatientDashboard({
    auth,
    user,
    clinicRecords,
    appointments = [],
    treatments = [],
    flash,
    loading = false,
}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            only: ["appointments", "treatments", "clinicRecords"],
        });
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // Enhanced stats with better categorization
    const enhancedStats = {
        health: {
            totalTreatments: treatments?.length || 0,
            completedTreatments:
                treatments?.filter((t) => t.status === "completed")?.length ||
                0,
            upcomingAppointments:
                appointments?.filter(
                    (a) => new Date(a.appointment_date) > new Date()
                )?.length || 0,
            healthScore:
                treatments?.length > 0
                    ? Math.round(
                          (treatments.filter((t) => t.status === "completed")
                              .length /
                              treatments.length) *
                              100
                      )
                    : 0,
        },
        appointments: {
            total: appointments?.length || 0,
            upcoming:
                appointments?.filter(
                    (a) => new Date(a.appointment_date) > new Date()
                )?.length || 0,
            completed:
                appointments?.filter((a) => a.status === "completed")?.length ||
                0,
            cancelled:
                appointments?.filter((a) => a.status === "cancelled")?.length ||
                0,
        },
        clinics: {
            total: clinicRecords?.length || 0,
            active:
                clinicRecords?.filter((c) => c.status === "active")?.length ||
                0,
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <Head title="Patient Dashboard - Smile Suite" />
            <div className="sr-only">
                <h1>Patient Dashboard</h1>
                <p>Welcome to your dental health management portal</p>
            </div>

            {/* Site Header */}
            <SiteHeader />

            {/* Success Message */}
            {flash?.success && (
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-sm">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="font-medium">{flash.success}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Container */}
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 lg:py-8">
                <div className="bg-gradient-to-br from-blue-50 via-blue-80 to-cyan-80 rounded-2xl shadow-2xl border border-blue-200/50 overflow-hidden">
                    {/* Enhanced Header Section */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                        <div className="relative">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div
                                        className="relative"
                                        role="img"
                                        aria-label="Dashboard icon"
                                    >
                                        <div className="p-2 sm:p-3 bg-white/25 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                            <LayoutDashboard
                                                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                            Patient Dashboard
                                        </h1>
                                        <p className="text-blue-100 text-xs sm:text-sm font-medium">
                                            Welcome back,{" "}
                                            <span className="font-semibold">
                                                {user?.name || auth?.user?.name}
                                            </span>
                                            !
                                            <span className="hidden sm:inline">
                                                {" "}
                                                Here's your dental health
                                                overview
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-blue-200/50 shadow-lg"
                                        role="img"
                                        aria-label="Current date"
                                    >
                                        <time
                                            className="text-xs sm:text-sm font-bold text-gray-700"
                                            dateTime={new Date().toISOString()}
                                        >
                                            {new Date().toLocaleDateString(
                                                "en-US",
                                                {
                                                    weekday: "short",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                }
                                            )}
                                        </time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
                        {/* Statistics */}
                        <div className="mb-8">
                            <StatisticsSection clinicRecords={clinicRecords} />
                        </div>

                        {/* Quick Actions Section */}
                        <div className="mb-8">
                            <QuickActions />
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Appointments Section */}
                            <div>
                                <AppointmentsSection
                                    appointments={appointments}
                                />
                            </div>

                            {/* Treatments Overview Section */}
                            <div>
                                <TreatmentsOverview treatments={treatments} />
                            </div>
                        </div>

                        {/* Connected Clinics Section - Full Width */}
                        {clinicRecords && clinicRecords.length > 0 && (
                            <div className="mt-8">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                                                <Building2 className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    Connected Clinics
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    Your trusted dental partners
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="w-4 h-4 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {clinicRecords
                                            .slice(0, 6)
                                            .map((record) => (
                                                <div
                                                    key={record.id}
                                                    className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-4 hover:shadow-md transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center shadow-sm">
                                                            <Building2 className="w-6 h-6 text-emerald-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                {
                                                                    record
                                                                        .clinic
                                                                        ?.name
                                                                }
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                {
                                                                    record
                                                                        .clinic
                                                                        ?.address
                                                                }
                                                            </p>
                                                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                                <span>
                                                                    Appointments:
                                                                </span>
                                                                <span className="font-medium">
                                                                    {record.appointments_count ||
                                                                        0}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        {clinicRecords.length > 6 && (
                                            <div className="col-span-full text-center pt-2">
                                                <Link href="/clinics">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-teal-100"
                                                    >
                                                        View All Clinics
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
