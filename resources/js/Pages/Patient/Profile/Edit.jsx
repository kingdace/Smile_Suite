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
import InputError from "@/Components/InputError";
import {
    FormField,
    ValidatedInput,
    ValidatedTextarea,
    ErrorMessage,
    SuccessMessage,
    FormStatus,
    FormProgress,
    FormFieldGroup,
} from "@/Components/ui/form-validation";
import { usePatientFormValidation } from "@/hooks/useFormValidation";
import { FadeIn, SlideIn } from "@/Components/ui/loading";

export default function PatientProfileEdit({ user, patients, flash }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        phone_number: user.phone_number || "",
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zip_code: user.zip_code || "",
        emergency_contact_name: user.emergency_contact_name || "",
        emergency_contact_phone: user.emergency_contact_phone || "",
        medical_history: user.medical_history || "",
        allergies: user.allergies || "",
        medications: user.medications || "",
    });

    const {
        values,
        errors: validationErrors,
        touched,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit: validateAndSubmit,
        formStats,
    } = usePatientFormValidation(data);

    const handleSubmit = (e) => {
        e.preventDefault();
        validateAndSubmit(async (validatedData) => {
            put(route("patient.profile.update"), {
                data: validatedData,
            });
        });
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

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Edit Profile
                                </h2>
                                <p className="text-gray-600 mt-2 text-lg">
                                    Update your account information
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-blue-100/80 to-cyan-100/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-200/50 shadow-lg">
                                    <span className="text-sm font-bold text-gray-700">
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
                                <Link href={route("patient.profile")}>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Profile
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <FadeIn>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left side (Main form) */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Form Progress */}
                                    <FormProgress
                                        current={formStats.completedFields}
                                        total={formStats.totalFields}
                                        className="mb-6"
                                    />

                                    {/* Success Message */}
                                    {showSuccess && (
                                        <SuccessMessage
                                            message="Profile updated successfully!"
                                            className="mb-6"
                                        />
                                    )}

                                    {/* Personal Information */}
                                    <SlideIn direction="up" delay={100}>
                                        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                                            <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900">
                                                            Account Information
                                                        </h3>
                                                        <p className="text-gray-500 text-sm">
                                                            Update your personal
                                                            details
                                                        </p>
                                                    </div>
                                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <FormFieldGroup>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <FormField
                                                            label="Full Name"
                                                            required
                                                            error={
                                                                touched.name
                                                                    ? validationErrors.name
                                                                    : null
                                                            }
                                                        >
                                                            <ValidatedInput
                                                                id="name"
                                                                type="text"
                                                                value={
                                                                    values.name
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setData(
                                                                        "name",
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    handleChange(
                                                                        "name",
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                onBlur={() =>
                                                                    handleBlur(
                                                                        "name"
                                                                    )
                                                                }
                                                                placeholder="Enter your full name"
                                                                error={
                                                                    touched.name
                                                                        ? validationErrors.name
                                                                        : null
                                                                }
                                                                success={
                                                                    touched.name &&
                                                                    !validationErrors.name &&
                                                                    values.name
                                                                }
                                                            />
                                                        </FormField>

                                                        <FormField
                                                            label="Phone Number"
                                                            required
                                                            error={
                                                                touched.phone_number
                                                                    ? validationErrors.phone_number
                                                                    : null
                                                            }
                                                        >
                                                            <ValidatedInput
                                                                id="phone_number"
                                                                type="tel"
                                                                value={
                                                                    values.phone_number
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setData(
                                                                        "phone_number",
                                                                        e.target
                                                                            .value
                                                                    );
                                                                    handleChange(
                                                                        "phone_number",
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                                onBlur={() =>
                                                                    handleBlur(
                                                                        "phone_number"
                                                                    )
                                                                }
                                                                placeholder="Enter your phone number"
                                                                error={
                                                                    touched.phone_number
                                                                        ? validationErrors.phone_number
                                                                        : null
                                                                }
                                                                success={
                                                                    touched.phone_number &&
                                                                    !validationErrors.phone_number &&
                                                                    values.phone_number
                                                                }
                                                            />
                                                        </FormField>

                                                        <FormField
                                                            label="Email Address"
                                                            description="Email address cannot be changed. Contact support if needed."
                                                        >
                                                            <ValidatedInput
                                                                id="email"
                                                                type="email"
                                                                value={
                                                                    user.email
                                                                }
                                                                disabled
                                                                className="bg-gray-100/50 border-gray-200/50 text-gray-600"
                                                            />
                                                        </FormField>
                                                    </div>
                                                </FormFieldGroup>
                                            </CardContent>
                                        </Card>
                                    </SlideIn>

                                    {/* Clinic Records Information */}
                                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        Clinic Records (
                                                        {patients.length})
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">
                                                        Your medical records
                                                        from connected clinics
                                                    </p>
                                                </div>
                                                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                                <div className="flex items-start gap-3">
                                                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-semibold text-blue-900 mb-1">
                                                            Clinic Records are
                                                            Read-Only
                                                        </h4>
                                                        <p className="text-blue-800 text-sm">
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
                                                <div className="text-center py-8">
                                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-500">
                                                        No clinic records found
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Your clinic records will
                                                        appear here once you
                                                        visit clinics.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {patients.map((patient) => (
                                                        <div
                                                            key={patient.id}
                                                            className="border rounded-lg p-4 bg-gray-50"
                                                        >
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <h3 className="font-semibold text-gray-900">
                                                                    {
                                                                        patient
                                                                            .clinic
                                                                            .name
                                                                    }
                                                                </h3>
                                                                <span className="text-sm text-gray-500">
                                                                    (Patient ID:{" "}
                                                                    {patient.id}
                                                                    )
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 text-lg font-semibold"
                                        >
                                            <Save className="w-5 h-5" />
                                            {processing
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Quick Stats */}
                                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50">
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                Quick Stats
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-4">
                                            <div className="bg-gradient-to-r from-blue-50/50 to-white/50 rounded-xl border border-blue-100/50 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <User className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Account Status
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            Active
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-r from-green-50/50 to-white/50 rounded-xl border border-green-100/50 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <FileText className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">
                                                            Clinic Records
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            {patients.length}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Quick Actions */}
                                    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                                        <CardHeader className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-b border-blue-100/50">
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                Quick Actions
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-3">
                                            <Link
                                                href={route(
                                                    "patient.dashboard"
                                                )}
                                                className="block"
                                            >
                                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">
                                                        Dashboard
                                                    </span>
                                                </div>
                                            </Link>
                                            <Link
                                                href={route("patient.profile")}
                                                className="block"
                                            >
                                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <User className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700">
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
