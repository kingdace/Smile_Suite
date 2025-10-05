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
    Plus,
    Search,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import SiteHeader from "@/Components/SiteHeader";

export default function PatientTreatmentsIndex({
    auth,
    user,
    treatments,
    clinicRecords,
}) {
    const getStatusColor = (status) => {
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

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "in_progress":
                return <Clock className="w-4 h-4 text-blue-500" />;
            case "scheduled":
                return <Calendar className="w-4 h-4 text-yellow-500" />;
            case "cancelled":
                return <FileText className="w-4 h-4 text-red-500" />;
            default:
                return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <Head title="My Treatments - Smile Suite" />

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                My Treatments
                            </h2>
                            <p className="text-gray-600 mt-2 text-lg">
                                Your dental treatment history across all
                                connected clinics
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-200/50 shadow-lg">
                                <span className="text-sm font-bold text-gray-700">
                                    {new Date().toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Connected Clinics
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {clinicRecords?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                    <Stethoscope className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Total Treatments
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {treatments?.data?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Completed
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
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
                </div>

                {/* Treatments List */}
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Treatment History
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Your complete dental treatment records
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        {treatments?.data && treatments.data.length > 0 ? (
                            <div className="space-y-4">
                                {treatments.data.map((treatment) => (
                                    <div
                                        key={treatment.id || Math.random()}
                                        className="bg-gradient-to-r from-gray-50/50 to-white/50 rounded-xl border border-gray-100/50 p-6 hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    {getStatusIcon(
                                                        treatment.status
                                                    )}
                                                    <Badge
                                                        className={getStatusColor(
                                                            treatment.status
                                                        )}
                                                    >
                                                        {treatment.status ||
                                                            "Unknown"}
                                                    </Badge>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            treatment.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900 mb-2">
                                                            {treatment.service
                                                                ?.name ||
                                                                "Treatment"}
                                                        </h4>
                                                        <div className="space-y-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="w-4 h-4" />
                                                                <span>
                                                                    {
                                                                        treatment
                                                                            .clinic
                                                                            ?.name
                                                                    }
                                                                </span>
                                                            </div>
                                                            {treatment.dentist && (
                                                                <div className="flex items-center gap-2">
                                                                    <User className="w-4 h-4" />
                                                                    <span>
                                                                        {
                                                                            treatment
                                                                                .dentist
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {treatment.appointment && (
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>
                                                                        {new Date(
                                                                            treatment.appointment.scheduled_at
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {treatment.notes && (
                                                            <div>
                                                                <h5 className="font-medium text-gray-900 mb-1">
                                                                    Treatment
                                                                    Notes
                                                                </h5>
                                                                <p className="text-sm text-gray-600">
                                                                    {
                                                                        treatment.notes
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                        {treatment.cost && (
                                                            <div className="mt-2">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                    Cost: ₱
                                                                    {treatment.cost.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ml-4">
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
                                                            className="flex items-center gap-2"
                                                        >
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
                                                        View Details
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Stethoscope className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    No Treatments Yet
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    You haven't received any treatments yet.
                                    Book an appointment to get started with your
                                    dental care journey!
                                </p>
                                <Link href="/clinics">
                                    <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 text-lg font-semibold">
                                        <Plus className="w-5 h-5" />
                                        Find Clinics
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
