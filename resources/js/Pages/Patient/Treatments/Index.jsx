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
        <div className="min-h-screen bg-gray-100">
            <Head title="My Treatments - Smile Suite" />

            {/* Site Header */}
            <SiteHeader />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Stethoscope className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                My Treatments
                            </h1>
                            <p className="text-gray-600">
                                Your dental treatment history across all
                                connected clinics
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Connected Clinics
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {clinicRecords?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Stethoscope className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Treatments
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {treatments?.data?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">
                                        Completed
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
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
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Treatment History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {treatments?.data && treatments.data.length > 0 ? (
                            <div className="space-y-4">
                                {treatments.data.map((treatment) => (
                                    <div
                                        key={treatment.id || Math.random()}
                                        className="border rounded-lg p-6 hover:bg-gray-50 transition-colors"
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

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                                        Dr.{" "}
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
                                <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Treatments Yet
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    You haven't received any treatments yet.
                                    Book an appointment to get started!
                                </p>
                                <Link href="/clinics">
                                    <Button className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
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
