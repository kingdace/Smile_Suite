import { Head, Link } from "@inertiajs/react";
import {
    Stethoscope,
    Calendar,
    User,
    Building2,
    Clock,
    CheckCircle,
    FileText,
    ArrowRight,
    ArrowLeft,
    Plus,
    Search,
    MapPin,
    Phone,
    Mail,
    DollarSign,
    Star,
    TrendingUp,
    Activity,
    ChevronRight,
    Timer,
    Eye,
} from "lucide-react";
import { getDentistDisplayName } from "@/Helpers/DentistHelper";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import SiteHeader from "@/Components/SiteHeader";
import { FadeIn, SlideIn } from "@/Components/ui/loading";
import { cn } from "@/lib/utils";

export default function PatientTreatmentsIndex({
    auth,
    user,
    treatments,
    clinicRecords,
}) {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-200";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "scheduled":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "in_progress":
                return <Clock className="w-4 h-4 text-blue-600" />;
            case "scheduled":
                return <Calendar className="w-4 h-4 text-yellow-600" />;
            case "cancelled":
                return <FileText className="w-4 h-4 text-red-600" />;
            default:
                return <FileText className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <Head title="My Treatments - Smile Suite" />
            <div className="sr-only">
                <h1>My Treatments</h1>
                <p>View your dental treatment history and records</p>
            </div>

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
                {/* Compact Page Header */}
                <div className="mb-4 sm:mb-6">
                    {/* Mobile Layout */}
                    <div className="flex flex-col sm:hidden gap-3">
                        <div className="flex items-center justify-between">
                            <Link href={route("patient.dashboard")}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1 px-2 py-1 text-xs"
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Back
                                </Button>
                            </Link>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-2 py-1 text-xs">
                                {treatments?.data?.length || 0} Total
                            </Badge>
                        </div>
                        <div className="text-center">
                            <h1 className="text-lg font-bold text-gray-900">
                                My Treatments
                            </h1>
                            <p className="text-gray-600 text-xs">
                                Your dental treatment history across all
                                connected clinics
                            </p>
                        </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                        <div className="flex-1">
                            <Link href={route("patient.dashboard")}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 hover:bg-gray-50"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-1 text-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                My Treatments
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Your dental treatment history across all
                                connected clinics
                            </p>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                                {treatments?.data?.length || 0} Total
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Enhanced Statistics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <SlideIn direction="up" delay={0}>
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-2 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Clinics
                                        </p>
                                        <p className="text-sm sm:text-lg font-bold text-gray-900">
                                            {clinicRecords?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={100}>
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-2 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Treatments
                                        </p>
                                        <p className="text-sm sm:text-lg font-bold text-gray-900">
                                            {treatments?.data?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={200}>
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-2 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Completed
                                        </p>
                                        <p className="text-sm sm:text-lg font-bold text-gray-900">
                                            {treatments?.data?.filter(
                                                (t) =>
                                                    t.status?.toLowerCase() ===
                                                    "completed"
                                            ).length || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={300}>
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-2 sm:p-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Quality
                                        </p>
                                        <p className="text-sm sm:text-lg font-bold text-gray-900">
                                            4.8
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>
                </div>

                {/* Treatments List */}
                <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 p-3 sm:p-4 md:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                        Treatment History
                                    </h3>
                                    <p className="text-gray-600 text-xs sm:text-sm">
                                        Your complete dental treatment records
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 md:p-6">
                        {treatments?.data && treatments.data.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {treatments.data.map((treatment, index) => (
                                    <SlideIn
                                        key={treatment.id || Math.random()}
                                        direction="up"
                                        delay={index * 100}
                                    >
                                        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
                                            {/* Header with Status and Date */}
                                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <Badge
                                                        className={cn(
                                                            getStatusColor(
                                                                treatment.status
                                                            ),
                                                            "px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold flex items-center gap-1 sm:gap-2"
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            treatment.status
                                                        )}
                                                        {treatment.status ||
                                                            "Unknown"}
                                                    </Badge>
                                                    <div className="text-xs sm:text-sm text-gray-600">
                                                        {new Date(
                                                            treatment.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                                </div>
                                            </div>

                                            {/* Treatment Information - Improved Layout */}
                                            <div className="space-y-4 mb-4">
                                                {/* Top: Service Name & Cost */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                                                            {treatment.service
                                                                ?.name ||
                                                                treatment.name ||
                                                                "Dental Treatment"}
                                                        </h4>
                                                        {treatment.service
                                                            ?.description && (
                                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                                {
                                                                    treatment
                                                                        .service
                                                                        .description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Cost - Prominent */}
                                                    {treatment.cost && (
                                                        <div className="flex-shrink-0 text-right">
                                                            <p className="text-xs text-gray-500 mb-0.5">
                                                                Cost
                                                            </p>
                                                            <p className="text-2xl font-bold text-green-600">
                                                                ₱
                                                                {treatment.cost.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Provider Info - 3 Column Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {/* Clinic */}
                                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                                                            <img
                                                                src={
                                                                    treatment
                                                                        .clinic
                                                                        ?.logo_url ||
                                                                    "/images/clinic-logo.png"
                                                                }
                                                                alt={`${
                                                                    treatment
                                                                        .clinic
                                                                        ?.name ||
                                                                    "Clinic"
                                                                } Logo`}
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.src =
                                                                        "/images/clinic-logo.png";
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-gray-500">
                                                                Clinic
                                                            </p>
                                                            <p className="font-semibold text-sm text-gray-900 truncate">
                                                                {treatment
                                                                    .clinic
                                                                    ?.name ||
                                                                    "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Dentist */}
                                                    {treatment.dentist && (
                                                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <User className="w-5 h-5 text-green-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs text-gray-500">
                                                                    Dentist
                                                                </p>
                                                                <p className="font-semibold text-sm text-gray-900 truncate">
                                                                    {getDentistDisplayName(
                                                                        treatment.dentist
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Appointment */}
                                                    {treatment.appointment && (
                                                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <Calendar className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs text-gray-500">
                                                                    Appointment
                                                                </p>
                                                                <p className="font-semibold text-sm text-gray-900 truncate">
                                                                    {new Date(
                                                                        treatment.appointment.scheduled_at
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            month: "short",
                                                                            day: "numeric",
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Additional Info - Inline Badges */}
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    {treatment.estimated_duration_minutes && (
                                                        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-full border border-orange-200 font-medium">
                                                            <Timer className="w-3 h-3" />
                                                            {Math.floor(
                                                                treatment.estimated_duration_minutes /
                                                                    60
                                                            )}
                                                            h{" "}
                                                            {treatment.estimated_duration_minutes %
                                                                60}
                                                            m
                                                        </span>
                                                    )}
                                                    {treatment.notes && (
                                                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 font-medium">
                                                            <FileText className="w-3 h-3" />
                                                            Has notes
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button - Compact */}
                                            <div className="flex justify-end pt-3 border-t border-gray-200">
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
                                                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 px-3 py-1.5 text-xs h-8"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="opacity-50 cursor-not-allowed flex items-center gap-1.5 px-3 py-1.5 text-xs h-8"
                                                        disabled
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View Details
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </SlideIn>
                                ))}
                            </div>
                        ) : (
                            <FadeIn>
                                <div className="text-center py-8 sm:py-12 md:py-16">
                                    <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                        <Stethoscope className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                                        No Treatments Yet
                                    </h3>
                                    <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
                                        You haven't received any dental
                                        treatments yet. Book an appointment with
                                        one of our partner clinics to start your
                                        dental care journey!
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                                        <Link href="/clinics">
                                            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                Find Clinics
                                            </Button>
                                        </Link>
                                        <Link href="/appointments">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 text-sm sm:text-base"
                                            >
                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                                Book Appointment
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </FadeIn>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
