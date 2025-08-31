import GuestLayout from "@/Layouts/GuestLayout";
import { useState } from "react";
import { Head } from "@inertiajs/react";
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
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const handleBookAppointment = () => {
        setShowBookingModal(true);
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
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

                {/* Gallery Section */}
                <section className="pt-12 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-10 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ClinicGallery galleryImages={clinic.gallery_images} />
                    </div>
                </section>

                {/* Services Section */}
                <section className="pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8 lg:pb-10 bg-gradient-to-br from-blue-50 to-cyan-50">
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
                isOpen={showBookingModal}
                onClose={handleCloseBookingModal}
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
