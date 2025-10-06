import React, { useRef, useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Save,
    Settings,
    User,
    Building2,
    Clock,
    MapPin,
    Image,
    Calendar,
} from "lucide-react";

// Import new components
import ClinicInfoSection from "@/Components/Clinic/Profile/ClinicInfoSection";
import OperatingHoursSection from "@/Components/Clinic/Profile/OperatingHoursSection";
import LocationSection from "@/Components/Clinic/Profile/LocationSection";
import GallerySection from "@/Components/Clinic/Profile/GallerySection";
import UserInfoSection from "@/Components/Clinic/Profile/UserInfoSection";
import HolidayManagementSection from "@/Components/Clinic/Profile/HolidayManagementSection";

// Import custom hooks
import { useRealTimeValidation } from "@/hooks/useRealTimeValidation";

// Import UI components
import {
    LoadingSpinner,
    LoadingButton,
    ProgressBar,
} from "@/Components/ui/loading-spinner";
import { ToastContainer, useToast } from "@/Components/ui/toast";
import {
    ValidatedInput,
    ValidatedTextarea,
} from "@/Components/ui/validated-input";

export default function Index({
    user,
    clinic,
    users,
    plan,
    limit,
    count,
    errors,
    success,
    auth,
}) {
    const isAdmin = user.role === "clinic_admin";

    // State for UI - initialize from URL parameter or default to "clinic"
    const [activeTab, setActiveTab] = useState(() => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("tab") || "clinic";
    });

    // Form data
    const { data, setData, post, processing } = useForm({
        clinic_name: clinic?.name || "",
        contact_number: clinic?.contact_number || "",
        clinic_email: clinic?.email || "",
        license_number: clinic?.license_number || "",
        description: clinic?.description || "",
        logo: null,
        latitude: clinic?.latitude || "",
        longitude: clinic?.longitude || "",
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        operating_hours: clinic?.operating_hours || {},
        gallery_images: clinic?.gallery_images || [],
        active_tab: activeTab,
    });

    // Custom hooks - removed complex validation, using simple validation instead
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitProgress, setSubmitProgress] = useState(0);

    // Real-time validation
    const {
        validateField,
        clearFieldValidation,
        getFieldError,
        isFieldValid,
        isFieldInvalid,
        isFieldValidating,
    } = useRealTimeValidation();

    // Toast notifications
    const { toasts, removeToast, showSuccess, showError } = useToast();

    const [isLoading, setIsLoading] = useState(false);

    // Handle input changes with real-time validation
    const handleInputChange = (fieldName, value) => {
        setData(fieldName, value);
        validateField(fieldName, value, { ...data, [fieldName]: value });
    };

    // Handle form submission - simplified like the original
    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation for clinic settings
        if (activeTab === "clinic") {
            if (!data.clinic_name || data.clinic_name.trim() === "") {
                showError("Validation Error", "Clinic name is required.");
                return;
            }
            if (!data.clinic_email || data.clinic_email.trim() === "") {
                showError("Validation Error", "Clinic email is required.");
                return;
            }
        }

        // Set submitting state
        setIsSubmitting(true);
        setSubmitProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setSubmitProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + 10;
            });
        }, 100);

        // Submit the form
        post(route("clinic.profile.update"), {
            ...data,
            active_tab: activeTab,
            forceFormData: true,
            onSuccess: () => {
                clearInterval(progressInterval);
                setSubmitProgress(100);
                showSuccess("Success", "Profile updated successfully!");
                setTimeout(() => {
                    setIsSubmitting(false);
                    router.reload();
                }, 500);
            },
            onError: (errors) => {
                clearInterval(progressInterval);
                setIsSubmitting(false);
                console.log("Backend validation errors:", errors);
                showError(
                    "Update Failed",
                    "Please check the errors and try again."
                );
            },
        });
    };

    // Tab configuration
    const tabs = [
        {
            id: "clinic",
            label: "Clinic Settings",
            icon: Building2,
            description: "Manage clinic information and settings",
        },
        {
            id: "user",
            label: "User Account",
            icon: User,
            description: "Manage your user account",
        },
        {
            id: "hours",
            label: "Operating Hours",
            icon: Clock,
            description: "Set clinic operating hours",
        },
        {
            id: "location",
            label: "Location",
            icon: MapPin,
            description: "Set clinic location on map",
        },
        {
            id: "gallery",
            label: "Gallery",
            icon: Image,
            description: "Manage clinic gallery images",
        },
        {
            id: "holidays",
            label: "Holidays",
            icon: Calendar,
            description: "Manage clinic holidays",
        },
    ];

    // Update form data when clinic data becomes available
    React.useEffect(() => {
        if (clinic && clinic.name) {
            setData((prev) => ({
                ...prev,
                clinic_name: clinic.name || "",
                contact_number: clinic.contact_number || "",
                clinic_email: clinic.email || "",
                license_number: clinic.license_number || "",
                description: clinic.description || "",
                latitude: clinic.latitude || "",
                longitude: clinic.longitude || "",
                operating_hours: clinic.operating_hours || {},
                gallery_images: clinic.gallery_images || [],
            }));
        }
    }, [clinic, setData]);

    // Update active_tab in form data when tab changes
    React.useEffect(() => {
        setData("active_tab", activeTab);
    }, [activeTab, setData]);

    // Update URL when tab changes to preserve state on refresh
    React.useEffect(() => {
        const url = new URL(window.location);
        url.searchParams.set("tab", activeTab);
        window.history.replaceState({}, "", url);
    }, [activeTab]);

    // Callback for operating hours changes
    const handleOperatingHoursChange = React.useCallback(
        (hours) => {
            setData("operating_hours", hours);
        },
        [setData]
    );

    // Callback for gallery changes
    const handleGalleryChange = React.useCallback(
        (images) => {
            setData("gallery_images", images);
        },
        [setData]
    );

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Clinic Profile
                </h2>
            }
        >
            <Head title="Clinic Profile" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-green-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        {success}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.message && (
                        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">
                                        {errors.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100 max-w-6xl mx-auto">
                        {/* Modern Tab Navigation */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                            <nav className="flex justify-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 overflow-x-auto">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative py-3 px-3 sm:px-4 md:px-6 font-medium text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 md:gap-3 transition-all duration-200 rounded-t-lg whitespace-nowrap min-w-[80px] sm:min-w-[100px] flex-shrink-0 ${
                                                activeTab === tab.id
                                                    ? "bg-white text-blue-700 shadow-sm border-t-2 border-l-2 border-r-2 border-blue-200 -mb-px"
                                                    : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                                            }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                                    activeTab === tab.id
                                                        ? "text-blue-600"
                                                        : ""
                                                }`}
                                            />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white min-h-[600px] transition-all duration-300">
                            {/* Progress Bar */}
                            {isSubmitting && (
                                <div className="mb-6">
                                    <ProgressBar
                                        progress={submitProgress}
                                        className="mb-2"
                                    />
                                    <p className="text-sm text-gray-600 text-center">
                                        Updating your profile...
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Clinic Settings Tab */}
                                {activeTab === "clinic" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <ClinicInfoSection
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                isAdmin={isAdmin}
                                                validateField={validateField}
                                                getFieldError={getFieldError}
                                                isFieldValid={isFieldValid}
                                                isFieldInvalid={isFieldInvalid}
                                                isFieldValidating={
                                                    isFieldValidating
                                                }
                                                handleInputChange={
                                                    handleInputChange
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* User Account Tab */}
                                {activeTab === "user" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <UserInfoSection
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                isAdmin={isAdmin}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Operating Hours Tab */}
                                {activeTab === "hours" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <OperatingHoursSection
                                                initialOperatingHours={
                                                    data.operating_hours
                                                }
                                                errors={errors}
                                                onOperatingHoursChange={
                                                    handleOperatingHoursChange
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Location Tab */}
                                {activeTab === "location" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <LocationSection
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Gallery Tab */}
                                {activeTab === "gallery" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <GallerySection
                                                initialGalleryImages={
                                                    clinic?.gallery_images || []
                                                }
                                                errors={errors}
                                                onGalleryChange={
                                                    handleGalleryChange
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Holidays Tab */}
                                {activeTab === "holidays" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                                            <HolidayManagementSection
                                                clinicId={clinic?.id}
                                                initialHolidays={
                                                    clinic?.holidays || []
                                                }
                                                errors={errors}
                                                showSuccess={showSuccess}
                                                showError={showError}
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Submit Button */}
                                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-10 rounded-2xl p-8 border border-blue-100 shadow-lg">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                        <div className="text-center sm:text-left">
                                            <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                                    <Save className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-gray-900">
                                                        Save Changes
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        Update your clinic
                                                        profile settings
                                                    </p>
                                                </div>
                                            </div>
                                            {isSubmitting && (
                                                <div className="text-sm text-blue-600 font-medium">
                                                    Please wait while we save
                                                    your changes...
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <LoadingButton
                                                type="submit"
                                                loading={isSubmitting}
                                                loadingText="Saving..."
                                                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-600 hover:from-blue-700 hover:via-indigo-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
                                            >
                                                <Save className="h-5 w-5 mr-2" />
                                                Save Changes
                                            </LoadingButton>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notifications */}
            <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
        </AuthenticatedLayout>
    );
}
