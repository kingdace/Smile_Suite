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
    Heart,
    Shield,
    ChevronRight,
    Eye,
    Timer,
} from "lucide-react";
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
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Compact Page Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                My Treatments
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Your dental treatment history across all
                                connected clinics
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
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
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                                {treatments?.data?.length || 0} Total
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Enhanced Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <SlideIn direction="up" delay={0}>
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Clinics
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {clinicRecords?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={100}>
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Stethoscope className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Treatments
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {treatments?.data?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={200}>
                        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Completed
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
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
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Star className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">
                                            Quality
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
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
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Treatment History
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Your complete dental treatment records
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {treatments?.data && treatments.data.length > 0 ? (
                            <div className="space-y-4">
                                {treatments.data.map((treatment, index) => (
                                    <SlideIn
                                        key={treatment.id || Math.random()}
                                        direction="up"
                                        delay={index * 100}
                                    >
                                        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
                                            {/* Header with Status and Date */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        className={cn(
                                                            getStatusColor(
                                                                treatment.status
                                                            ),
                                                            "px-3 py-1 text-sm font-semibold flex items-center gap-2"
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            treatment.status
                                                        )}
                                                        {treatment.status ||
                                                            "Unknown"}
                                                    </Badge>
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(
                                                            treatment.created_at
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>

                                            {/* Treatment Information Grid */}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                                                {/* Service and Clinic Info */}
                                                <div className="lg:col-span-2 space-y-4">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                                                            {treatment.service
                                                                ?.name ||
                                                                treatment.name ||
                                                                "Dental Treatment"}
                                                        </h4>
                                                        {treatment.service
                                                            ?.description && (
                                                            <p className="text-gray-600 text-sm">
                                                                {
                                                                    treatment
                                                                        .service
                                                                        .description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Clinic and Dentist Info */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
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
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">
                                                                    {treatment
                                                                        .clinic
                                                                        ?.name ||
                                                                        "Clinic"}
                                                                </p>
                                                                <p className="text-xs text-gray-600">
                                                                    {treatment
                                                                        .clinic
                                                                        ?.street_address ||
                                                                        "Address not available"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {treatment.dentist && (
                                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-gray-900 text-sm">
                                                                        Dr.{" "}
                                                                        {
                                                                            treatment
                                                                                .dentist
                                                                                .name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        Dentist
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Appointment Info */}
                                                    {treatment.appointment && (
                                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">
                                                                    {new Date(
                                                                        treatment.appointment.scheduled_at
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            weekday:
                                                                                "long",
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        }
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-600">
                                                                    {new Date(
                                                                        treatment.appointment.scheduled_at
                                                                    ).toLocaleTimeString(
                                                                        "en-US",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Cost and Additional Info */}
                                                <div className="space-y-4">
                                                    {treatment.cost && (
                                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                                <span className="text-sm font-semibold text-green-700">
                                                                    Treatment
                                                                    Cost
                                                                </span>
                                                            </div>
                                                            <p className="text-xl font-bold text-green-800">
                                                                ₱
                                                                {treatment.cost.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {treatment.estimated_duration_minutes && (
                                                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Timer className="w-4 h-4 text-orange-600" />
                                                                <span className="text-sm font-semibold text-orange-700">
                                                                    Duration
                                                                </span>
                                                            </div>
                                                            <p className="text-lg font-bold text-orange-800">
                                                                {Math.floor(
                                                                    treatment.estimated_duration_minutes /
                                                                        60
                                                                )}
                                                                h{" "}
                                                                {treatment.estimated_duration_minutes %
                                                                    60}
                                                                m
                                                            </p>
                                                        </div>
                                                    )}

                                                    {treatment.notes && (
                                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FileText className="w-4 h-4 text-blue-600" />
                                                                <span className="text-sm font-semibold text-blue-700">
                                                                    Notes
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                                {
                                                                    treatment.notes
                                                                }
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                                {treatment.id &&
                                                treatment.id > 0 ? (
                                                    <Link
                                                        href={route(
                                                            "patient.treatments.show",
                                                            treatment.id
                                                        )}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 text-blue-700"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Details
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                                                        disabled
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </SlideIn>
                                ))}
                            </div>
                        ) : (
                            <FadeIn>
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Stethoscope className="w-10 h-10 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        No Treatments Yet
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                        You haven't received any dental
                                        treatments yet. Book an appointment with
                                        one of our partner clinics to start your
                                        dental care journey!
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link href="/clinics">
                                            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                                <Plus className="w-4 h-4" />
                                                Find Clinics
                                            </Button>
                                        </Link>
                                        <Link href="/appointments">
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 px-6 py-3 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
                                            >
                                                <Calendar className="w-4 h-4" />
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
