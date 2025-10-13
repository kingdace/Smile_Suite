import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    User,
    Save,
    ArrowLeft,
    Phone,
    Mail,
    AlertTriangle,
    FileText,
    CheckCircle,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { SuccessMessage } from "@/Components/ui/form-validation";
import { FadeIn, SlideIn } from "@/Components/ui/loading";

export default function PatientProfileEdit({ user, patients, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        phone_number: user.phone_number || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("patient.profile.update"));
    };

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }
    }, [flash?.success]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/20">
            <SiteHeader />
            <Head title="Edit Profile" />

            <div className="py-4 sm:py-6 md:py-8">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-4 sm:mb-6 md:mb-8">
                        {/* Mobile Layout */}
                        <div className="flex flex-col sm:hidden gap-3">
                            <div className="flex items-center justify-between">
                                <Link href={route("patient.profile")}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-1 px-2 py-1 text-xs"
                                    >
                                        <ArrowLeft className="w-3 h-3" />
                                        Back
                                    </Button>
                                </Link>
                                <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-2 py-1 rounded-md border border-blue-200/50 shadow-sm">
                                    <span className="text-xs font-bold text-gray-700">
                                        {new Date().toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Edit Profile
                                </h2>
                                <p className="text-gray-600 text-xs">
                                    Update your account information
                                </p>
                            </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:flex items-center justify-between">
                            <div className="flex-1">
                                <Link href={route("patient.profile")}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 hover:bg-gray-50"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Profile
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex-1 text-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Edit Profile
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Update your account information
                                </p>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-blue-200/50 shadow-sm">
                                    <span className="text-xs font-bold text-gray-700">
                                        {new Date().toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <FadeIn>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                                {/* Left side (Main form) */}
                                <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                                    {/* Success Message */}
                                    {showSuccess && (
                                        <SuccessMessage
                                            message="Profile updated successfully!"
                                            className="mb-3 sm:mb-4 md:mb-6"
                                        />
                                    )}

                                    {/* Personal Information */}
                                    <SlideIn direction="up" delay={100}>
                                        <Card className="bg-white border-0 shadow-lg">
                                            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 p-3 sm:p-4 md:p-6">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                            Account Information
                                                        </h3>
                                                        <p className="text-gray-500 text-xs sm:text-sm">
                                                            Update your personal
                                                            details
                                                        </p>
                                                    </div>
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-3 sm:p-4 md:p-6">
                                                <div className="space-y-4 sm:space-y-6">
                                                    <div>
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 block"
                                                        >
                                                            Full Name *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) =>
                                                                setData(
                                                                    "name",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Enter your full name"
                                                            className="w-full text-sm sm:text-base"
                                                        />
                                                        {errors.name && (
                                                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                                                {errors.name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label
                                                            htmlFor="phone_number"
                                                            className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 block"
                                                        >
                                                            Phone Number *
                                                        </Label>
                                                        <Input
                                                            id="phone_number"
                                                            type="tel"
                                                            value={
                                                                data.phone_number
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    "phone_number",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Enter your phone number"
                                                            className="w-full text-sm sm:text-base"
                                                        />
                                                        {errors.phone_number && (
                                                            <p className="text-red-500 text-xs sm:text-sm mt-1">
                                                                {
                                                                    errors.phone_number
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <Label
                                                            htmlFor="email"
                                                            className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2 block"
                                                        >
                                                            Email Address
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={user.email}
                                                            disabled
                                                            className="w-full bg-gray-100 border-gray-200 text-gray-600 text-sm sm:text-base"
                                                        />
                                                        <p className="text-gray-500 text-xs mt-1">
                                                            Email address cannot
                                                            be changed. Contact
                                                            support if needed.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </SlideIn>

                                    {/* Clinic Records Information */}
                                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50 p-3 sm:p-4 md:p-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                                        Clinic Records (
                                                        {patients.length})
                                                    </h3>
                                                    <p className="text-gray-500 text-xs sm:text-sm">
                                                        Your medical records
                                                        from connected clinics
                                                    </p>
                                                </div>
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-4 md:p-6">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                                                <div className="flex items-start gap-2 sm:gap-3">
                                                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                                                            Clinic Records are
                                                            Read-Only
                                                        </h4>
                                                        <p className="text-blue-800 text-xs sm:text-sm">
                                                            Your clinic records
                                                            are managed by your
                                                            healthcare providers
                                                            to ensure accuracy
                                                            and compliance with
                                                            medical standards.
                                                            If you need to
                                                            update any
                                                            information, please
                                                            contact the clinic
                                                            directly.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {patients.length === 0 ? (
                                                <div className="text-center py-4 sm:py-6 md:py-8">
                                                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                                                    <p className="text-gray-500 text-sm sm:text-base">
                                                        No clinic records found
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-400">
                                                        Your clinic records will
                                                        appear here once you
                                                        visit clinics.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 sm:space-y-4">
                                                    {patients.map((patient) => (
                                                        <div
                                                            key={patient.id}
                                                            className="border rounded-lg p-3 sm:p-4 bg-gray-50"
                                                        >
                                                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                                    {
                                                                        patient
                                                                            .clinic
                                                                            .name
                                                                    }
                                                                </h3>
                                                                <span className="text-xs sm:text-sm text-gray-500">
                                                                    (Patient ID:{" "}
                                                                    {patient.id}
                                                                    )
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                                                <div>
                                                                    <span className="text-gray-500">
                                                                        Name:
                                                                    </span>
                                                                    <p className="font-medium">
                                                                        {
                                                                            patient.first_name
                                                                        }{" "}
                                                                        {
                                                                            patient.last_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-500">
                                                                        Phone:
                                                                    </span>
                                                                    <p className="font-medium">
                                                                        {
                                                                            patient.phone_number
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Submit Button */}
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base md:text-lg font-semibold"
                                        >
                                            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                            {processing
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Quick Stats */}
                                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50 p-3 sm:p-4 md:p-6">
                                            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                                                Quick Stats
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                                            <div className="bg-gradient-to-r from-blue-50/50 to-white/50 rounded-xl border border-blue-100/50 p-3 sm:p-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            Account Status
                                                        </p>
                                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                            Active
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-green-50/50 to-white/50 rounded-xl border border-green-100/50 p-3 sm:p-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            Clinic Records
                                                        </p>
                                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                                            {patients.length}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Quick Actions */}
                                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50 p-3 sm:p-4 md:p-6">
                                            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                                                Quick Actions
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
                                            <Link
                                                href={route(
                                                    "patient.dashboard"
                                                )}
                                                className="block"
                                            >
                                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                        Dashboard
                                                    </span>
                                                </div>
                                            </Link>
                                            <Link
                                                href={route("patient.profile")}
                                                className="block"
                                            >
                                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                                        View Profile
                                                    </span>
                                                </div>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </form>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
