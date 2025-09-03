import GuestLayout from "@/Layouts/GuestLayout";
import { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import ClinicHero from "./Components/Hero/ClinicHero";
import ClinicGallery from "./Components/Gallery/ClinicGallery";
import ClinicAbout from "./Components/About/ClinicAbout";
import ServicesSection from "./Components/Services/ServicesSection";
import OperatingHours from "./Components/Hours/OperatingHours";
import StaffSection from "./Components/Staff/StaffSection";
import ReviewsSection from "./Components/Reviews/ReviewsSection";
import AccessibilityTrust from "./Components/Sidebar/AccessibilityTrust";
import LocationMap from "./Components/Sidebar/LocationMap";
import Footer from "./Components/Shared/Footer";
import BookingModal from "./Components/Modals/BookingModal";
import ReviewModal from "./Components/Modals/ReviewModal";
import { getInitials, getAvatarColor } from "./Components/Shared/utils";

export default function ClinicProfile({ clinic, auth }) {
    const { flash } = usePage().props;
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Form state for booking
    const { data, setData, post, processing, errors, reset } = useForm({
        date: "",
        time: "",
        reason: "",
        notes: "",
        service_id: "",
    });

    const handleBookAppointment = () => {
        // Check if user is authenticated and is a patient
        if (!auth?.user) {
            // Redirect to login with return URL
            window.location.href = `/login?redirect=${encodeURIComponent(
                window.location.pathname
            )}`;
            return;
        }

        if (auth.user.role !== "patient") {
            alert(
                "Only patients can book appointments. Please log in with a patient account."
            );
            return;
        }

        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        reset(); // Reset form data
    };

    const handleSubmitBooking = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!data.date || !data.time || (!data.reason && !data.service_id)) {
            alert(
                "Please fill in all required fields (Date, Time, and either Reason or Service)."
            );
            return;
        }

        // Submit the booking
        post(route("public.clinics.book-appointment", clinic.id), {
            onSuccess: () => {
                setShowBookingModal(false);
                reset();
                // Success message will be shown via flash message from backend
            },
            onError: (errors) => {
                console.error("Booking errors:", errors);
                // Error messages will be shown via form errors
            },
        });
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
    };

    return (
        <GuestLayout>
            <Head title={`${clinic.name} - Dental Clinic Profile`} />

            {/* Main Content Wrapper */}
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white pt-32 sm:pt-0 pb-16 sm:pb-0">
                    <ClinicHero
                        clinic={clinic}
                        onBookAppointment={handleBookAppointment}
                    />
                </section>

                {/* Success Message */}
                {flash.success && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                            <div className="flex items-center">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {flash.success}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Section */}
                <section className="pt-12 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-10 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ClinicGallery galleryImages={clinic.gallery_images} />
                    </div>
                </section>

                {/* Services Section */}
                <section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pt-8 lg:pt-10 bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ServicesSection
                            clinic={clinic}
                            onBookAppointment={handleBookAppointment}
                        />
                    </div>
                </section>

                {/* Operating Hours Section */}
                <section className="py-6 sm:py-8 lg:py-10 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <OperatingHours clinic={clinic} />
                    </div>
                </section>

                {/* Staff Section */}
                <section className="py-6 sm:pt-8 lg:pt-10 bg-gradient-to-r from-blue-50 to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <StaffSection
                            clinic={clinic}
                            onBookAppointment={handleBookAppointment}
                        />
                    </div>
                </section>

                {/* Sidebar Content Section */}
                <section className="py-12 sm:py-14 lg:py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            <AccessibilityTrust clinic={clinic} />
                            <LocationMap clinic={clinic} />
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="py-12 sm:py-14 lg:py-16 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ReviewsSection
                            clinic={clinic}
                            auth={auth}
                            reviews={clinic.reviews}
                        />
                    </div>
                </section>

                {/* Footer */}
                <section className="bg-gray-900 text-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Footer />
                    </div>
                </section>
            </div>

            {/* Modals */}
            <BookingModal
                showModal={showBookingModal}
                onClose={handleCloseBookingModal}
                onSubmit={handleSubmitBooking}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                clinic={clinic}
            />
            <ReviewModal
                isOpen={showReviewModal}
                onClose={handleCloseReviewModal}
                clinic={clinic}
            />
        </GuestLayout>
    );
}
