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
            <div className="sr-only">
                <h1>My Treatments</h1>
                <p>View your dental treatment history and records</p>
            </div>

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

                {/* Enhanced Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <SlideIn direction="up" delay={0}>
                        <Card className="bg-gradient-to-br from-blue-50/80 via-white/70 to-blue-50/40 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-6 h-6 text-white" />
                                </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                                            Clinics
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                        {clinicRecords?.length || 0}
                                    </p>
                                </div>
                            </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    <span>Connected</span>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={100}>
                        <Card className="bg-gradient-to-br from-green-50/80 via-white/70 to-green-50/40 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Stethoscope className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-green-600 uppercase tracking-wide">
                                            Treatments
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                        {treatments?.data?.length || 0}
                                    </p>
                                </div>
                            </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Activity className="w-4 h-4 text-blue-500" />
                                    <span>Total Sessions</span>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={200}>
                        <Card className="bg-gradient-to-br from-emerald-50/80 via-white/70 to-emerald-50/40 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">
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
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Heart className="w-4 h-4 text-red-500" />
                                    <span>Success Rate</span>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideIn>

                    <SlideIn direction="up" delay={300}>
                        <Card className="bg-gradient-to-br from-purple-50/80 via-white/70 to-purple-50/40 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                                            Quality
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            4.8
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Shield className="w-4 h-4 text-purple-500" />
                                    <span>Avg Rating</span>
                                </div>
                        </CardContent>
                    </Card>
                    </SlideIn>
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
                            <div className="space-y-6">
                                {treatments.data.map((treatment, index) => (
                                    <SlideIn
                                        key={treatment.id || Math.random()}
                                        direction="up"
                                        delay={index * 100}
                                    >
                                        <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20 rounded-2xl border border-gray-200/50 p-8 hover:shadow-xl hover:border-blue-300/50 transition-all duration-300 group">
                                            {/* Header with Status and Date */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        {getStatusIcon(treatment.status)}
                                                </div>
                                                    <div>
                                                        <Badge
                                                            className={cn(
                                                                getStatusColor(treatment.status),
                                                                "text-sm font-semibold px-3 py-1 rounded-full"
                                                            )}
                                                        >
                                                            {treatment.status || "Unknown"}
                                                        </Badge>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(treatment.created_at).toLocaleDateString("en-US", {
                                                                weekday: "long",
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>

                                            {/* Treatment Information */}
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                                {/* Service Details */}
                                                <div className="lg:col-span-2">
                                                    <h4 className="text-xl font-bold text-gray-900 mb-4">
                                                        {treatment.service?.name || "Dental Treatment"}
                                                    </h4>
                                                    
                                                    {/* Clinic and Dentist Info */}
                                                    <div className="space-y-3 mb-4">
                                                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                                <Building2 className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {treatment.clinic?.name || "Clinic"}
                                                                </p>
                                                                <p className="text-xs text-gray-600">
                                                                    {treatment.clinic?.street_address || "Address not available"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {treatment.dentist && (
                                                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                                                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                                                    <User className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        Dr. {treatment.dentist.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        Dentist
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {treatment.appointment && (
                                                            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-white/50">
                                                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                                    <Calendar className="w-4 h-4 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {new Date(treatment.appointment.scheduled_at).toLocaleDateString("en-US", {
                                                                            weekday: "long",
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        })}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {new Date(treatment.appointment.scheduled_at).toLocaleTimeString("en-US", {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Cost and Notes */}
                                                <div className="space-y-4">
                                                    {treatment.cost && (
                                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <DollarSign className="w-5 h-5 text-green-600" />
                                                                <span className="text-sm font-semibold text-green-700">
                                                                    Treatment Cost
                                                                </span>
                                                            </div>
                                                            <p className="text-2xl font-bold text-green-800">
                                                                ₱{treatment.cost.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {treatment.notes && (
                                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FileText className="w-5 h-5 text-blue-600" />
                                                                <span className="text-sm font-semibold text-blue-700">
                                                                    Treatment Notes
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 line-clamp-3">
                                                                {treatment.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex justify-end pt-4 border-t border-gray-200/50">
                                                {treatment.id && treatment.id > 0 ? (
                                                    <Link
                                                        href={route(
                                                            "patient.treatments.show",
                                                            treatment.id
                                                        )}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="flex items-center gap-2 bg-white/80 hover:bg-white border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
                                                        >
                                                            View Full Details
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                                                        disabled
                                                    >
                                                        View Full Details
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
                                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-8 group">
                                        <Stethoscope className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        No Treatments Yet
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                                        You haven't received any dental treatments yet. 
                                        Book an appointment with one of our partner clinics 
                                        to start your dental care journey!
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link href="/clinics">
                                            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                                <Plus className="w-5 h-5" />
                                                Find Clinics
                                            </Button>
                                        </Link>
                                        <Link href="/appointments">
                                            <Button 
                                                variant="outline" 
                                                className="flex items-center gap-2 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300"
                                            >
                                                <Calendar className="w-5 h-5" />
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
