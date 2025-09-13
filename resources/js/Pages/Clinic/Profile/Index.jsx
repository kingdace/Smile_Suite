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
import { useFormValidation } from "@/hooks/useFormValidation";
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

    // Custom hooks
    const {
        validateClinicForm,
        validateClinicSettingsForm,
        validateLocationForm,
        validateUserForm,
        errors: validationErrors,
        isSubmitting,
        submitProgress,
        submitWithProgress,
    } = useFormValidation();

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

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form based on active tab
        let isValid = false;
        if (activeTab === "clinic") {
            // Only validate clinic settings fields (name, email, phone, description)
            isValid = validateClinicSettingsForm(data);
        } else if (activeTab === "user") {
            // Validate user account fields
            isValid = validateUserForm(data);
        } else if (activeTab === "location") {
            // Only validate location fields (latitude, longitude)
            isValid = validateLocationForm(data);
        } else if (activeTab === "hours") {
            // Operating hours validation - always valid for now
            isValid = true;
        } else {
            // For other tabs (gallery, holidays), always valid
            isValid = true;
        }

        if (!isValid) {
            showError(
                "Validation Error",
                "Please fix the errors before submitting."
            );
            return;
        }

        try {
            await submitWithProgress(async () => {
                return new Promise((resolve, reject) => {
                    post(route("clinic.profile.update"), {
                        ...data,
                        active_tab: activeTab,
                        onSuccess: () => {
                            showSuccess(
                                "Success",
                                "Profile updated successfully!"
                            );
                            // Use Inertia reload to preserve current tab state
                            router.reload();
                            resolve();
                        },
                        onError: (errors) => {
                            console.log("Backend validation errors:", errors);
                            showError(
                                "Update Failed",
                                "Please check the errors and try again."
                            );
                            reject(errors);
                        },
                    });
                });
            });
        } catch (error) {
            console.error("Form submission error:", error);
        }
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-700">{success}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.message && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700">{errors.message}</p>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8 px-6">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                                activeTab === tab.id
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 bg-gray-50 min-h-[600px]">
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
                                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    <Building2 className="h-5 w-5 text-blue-600" />
                                                    Clinic Settings
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Manage your clinic's basic
                                                    information and settings.
                                                </p>
                                            </div>
                                            <ClinicInfoSection
                                                data={data}
                                                setData={setData}
                                                errors={{
                                                    ...errors,
                                                    ...validationErrors,
                                                }}
                                                isAdmin={isAdmin}
                                                validateField={validateField}
                                                getFieldError={getFieldError}
                                                isFieldValid={isFieldValid}
                                                isFieldInvalid={isFieldInvalid}
                                                isFieldValidating={
                                                    isFieldValidating
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* User Account Tab */}
                                {activeTab === "user" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                    User Account
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Manage your user account
                                                    information and password.
                                                </p>
                                            </div>
                                            <UserInfoSection
                                                data={data}
                                                setData={setData}
                                                errors={{
                                                    ...errors,
                                                    ...validationErrors,
                                                }}
                                                isAdmin={isAdmin}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Operating Hours Tab */}
                                {activeTab === "hours" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-blue-600" />
                                                    Operating Hours
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Set your clinic's operating
                                                    hours for each day of the
                                                    week.
                                                </p>
                                            </div>
                                            <OperatingHoursSection
                                                initialOperatingHours={
                                                    data.operating_hours
                                                }
                                                errors={{
                                                    ...errors,
                                                    ...validationErrors,
                                                }}
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
                                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    <MapPin className="h-5 w-5 text-blue-600" />
                                                    Clinic Location
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Set your clinic's location
                                                    on the map to help patients
                                                    find you.
                                                </p>
                                            </div>
                                            <LocationSection
                                                data={data}
                                                setData={setData}
                                                errors={{
                                                    ...errors,
                                                    ...validationErrors,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Gallery Tab */}
                                {activeTab === "gallery" && (
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    <Image className="h-5 w-5 text-blue-600" />
                                                    Clinic Gallery
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Upload and manage images to
                                                    showcase your clinic.
                                                </p>
                                            </div>
                                            <GallerySection
                                                initialGalleryImages={
                                                    clinic?.gallery_images || []
                                                }
                                                errors={{
                                                    ...errors,
                                                    ...validationErrors,
                                                }}
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
                                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                                    <Calendar className="h-5 w-5 text-blue-600" />
                                                    Holiday Management
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Manage clinic holidays to
                                                    prevent appointments on
                                                    those dates.
                                                </p>
                                            </div>
                                            <HolidayManagementSection
                                                initialHolidays={
                                                    clinic?.holidays || []
                                                }
                                                errors={{
                                                    ...errors,
                                                    ...validationErrors,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900">
                                                Save Changes
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Click save to update your clinic
                                                profile settings.
                                            </p>
                                        </div>
                                        <LoadingButton
                                            type="submit"
                                            loading={isSubmitting}
                                            loadingText="Saving..."
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </LoadingButton>
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
