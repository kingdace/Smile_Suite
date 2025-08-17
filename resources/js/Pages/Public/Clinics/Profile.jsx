import GuestLayout from "@/Layouts/GuestLayout";
import { Link, usePage, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import {
    Star,
    User,
    Users,
    MapPin,
    Phone,
    Mail,
    Globe,
    CheckCircle,
    Image as ImageIcon,
    ShieldCheck,
    Accessibility,
    ChevronRight,
    Clock,
    LayoutGrid,
    Calendar,
    X,
    Search,
    Package,
    DollarSign,
    Activity,
    Info,
    Stethoscope,
    GraduationCap,
    Briefcase,
    ThumbsUp,
    Flag,
    MessageSquare,
    Plus,
    AlertCircle,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ClinicGallerySwiper.css"; // Add this import for custom Swiper styles

// Custom marker icon fix for default icon issue in Leaflet
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

// Add helper for avatar initials
function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
}

// Add helper for avatar colors
function getAvatarColor(name) {
    const colors = [
        "bg-blue-500",
        "bg-purple-500",
        "bg-green-500",
        "bg-orange-50",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-red-500",
        "bg-teal-50",
    ];
    if (!name) return colors[0];
    const code = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return colors[code % colors.length];
}

export default function ClinicProfile({ clinic }) {
    const { auth } = usePage().props;
    console.log("auth:", auth); // Debug: See what auth is when logged out or in
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef();
    const [lightboxImg, setLightboxImg] = useState(null);
    const [galleryImages, setGalleryImages] = useState(
        clinic.gallery_images || []
    );
    const [showAllReviews, setShowAllReviews] = useState(false);

    const REASONS = [
        { id: "cleaning", label: "Teeth Cleaning" },
        { id: "checkup", label: "Regular Checkup" },
        { id: "whitening", label: "Teeth Whitening" },
        { id: "filling", label: "Dental Filling" },
        { id: "extraction", label: "Tooth Extraction" },
        { id: "root_canal", label: "Root Canal" },
        { id: "crown", label: "Dental Crown" },
        { id: "braces", label: "Braces/Orthodontics" },
        { id: "implant", label: "Dental Implant" },
        { id: "other", label: "Other" },
    ];

    const { data, setData, processing, errors, reset } = useForm({
        date: "",
        time: "",
        reason: "",
        notes: "",
    });

    const {
        data: reviewData,
        setData: setReviewData,
        processing: reviewProcessing,
        errors: reviewErrors,
        reset: resetReview,
    } = useForm({
        rating: 5,
        title: "",
        content: "",
    });

    const handleBookAppointment = () => {
        if (!auth || !auth.user || auth.user.role !== "patient") {
            // Not logged in as patient: redirect to login with return URL
            router.visit(route("login"), {
                data: { return: window.location.pathname },
            });
        } else {
            setShowBookingModal(true);
        }
    };

    const handleLeaveReview = () => {
        if (!auth || !auth.user || auth.user.role !== "patient") {
            // Not logged in as patient: redirect to login with return URL
            router.visit(route("login"), {
                data: { return: window.location.pathname },
            });
            return;
        }

        // Simply open the review modal - no appointment check needed
        setShowReviewModal(true);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                route("public.clinics.reviews.store", { clinic: clinic.id }),
                {
                    rating: reviewData.rating,
                    title: reviewData.title,
                    content: reviewData.content,
                }
            );

            setSuccessMessage("Review submitted successfully!");
            resetReview();
            setShowReviewModal(false);

            // Reload the page to show the new review
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Validation errors
                const errs = error.response.data.errors;
                Object.keys(errs).forEach((field) => {
                    reviewErrors[field] = errs[field][0];
                });
            } else {
                setSuccessMessage("An error occurred. Please try again.");
            }
        }
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        try {
            const response = await axios.post(
                route("public.clinics.book-appointment", { clinic: clinic.id }),
                {
                    date: data.date,
                    time: data.time,
                    reason: data.reason,
                    notes: data.notes,
                }
            );
            setSuccessMessage("Appointment request submitted successfully.");
            reset();
            setTimeout(() => {
                setShowBookingModal(false);
                setSuccessMessage("");
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Validation errors
                const errs = error.response.data.errors;
                Object.keys(errs).forEach((field) => {
                    errors[field] = errs[field][0];
                });
            } else {
                setSuccessMessage("An error occurred. Please try again.");
            }
        }
    };

    const handleShowMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation([latitude, longitude]);
                if (mapRef.current) {
                    const map = mapRef.current;
                    map.flyTo([latitude, longitude], 15);
                }
            },
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied!");
        });
    };

    return (
        <GuestLayout>
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 py-12 border-b relative overflow-hidden">
                {/* Enhanced pattern overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-blue-800/25"></div>
                {/* Dynamic geometric patterns */}
                <div className="absolute inset-0 opacity-8">
                    <div className="absolute top-8 right-8 w-40 h-40 border-2 border-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-8 left-8 w-32 h-32 border-2 border-white/20 transform rotate-45"></div>
                    <div className="absolute top-1/3 left-1/3 w-20 h-20 border border-white/25 rounded-full"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-16 h-16 border border-white/15 transform -rotate-30"></div>
                </div>
                {/* Subtle mesh gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-500/20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative">
                        <div className="relative group">
                            {/* Enhanced logo container with better styling */}
                            <div className="relative">
                                <img
                                    src={
                                        clinic.logo_url ||
                                        "/images/clinic-logo.png"
                                    }
                                    alt={clinic.name}
                                    className="h-36 w-36 rounded-3xl object-cover bg-white shadow-2xl border-4 border-white/40 group-hover:scale-105 transition-all duration-300"
                                    onError={(e) => {
                                        e.target.src =
                                            "/images/clinic-logo.png";
                                    }}
                                />
                                {/* Enhanced verification badge */}
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl border-3 border-white">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                {/* Animated glow effect */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/30 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                                {/* Subtle border glow */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-transparent"></div>
                            </div>
                            {/* Floating particles effect */}
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-bounce"></div>
                            <div
                                className="absolute -bottom-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full opacity-60 animate-bounce"
                                style={{ animationDelay: "0.5s" }}
                            ></div>
                        </div>
                    </div>
                    <div className="flex-1">
                        {/* Enhanced title section */}
                        <div className="flex items-center gap-3 mb-3">
                            <h1 className="text-4xl font-bold text-white">
                                {clinic.name}
                            </h1>
                            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-semibold gap-1 shadow-md border border-green-400/30">
                                <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                        </div>

                        {/* Address and description */}
                        <p className="text-lg text-blue-100 mb-3 font-medium">
                            {clinic.address}
                        </p>
                        {clinic.description && (
                            <p className="text-blue-50 mb-4 leading-relaxed max-w-2xl text-base">
                                {clinic.description}
                            </p>
                        )}

                        {/* Enhanced contact information */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {clinic.contact_number && (
                                <span className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 group">
                                    <div className="p-1.5 bg-blue-500/30 rounded-lg group-hover:bg-blue-500/50 transition-colors duration-300">
                                        <Phone className="w-4 h-4 text-blue-200" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {clinic.contact_number}
                                    </span>
                                </span>
                            )}
                            {clinic.email && (
                                <span className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 group">
                                    <div className="p-1.5 bg-blue-500/30 rounded-lg group-hover:bg-blue-500/50 transition-colors duration-300">
                                        <Mail className="w-4 h-4 text-blue-200" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                        {clinic.email}
                                    </span>
                                </span>
                            )}
                            {clinic.website && (
                                <a
                                    href={clinic.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 group"
                                >
                                    <div className="p-1.5 bg-blue-500/30 rounded-lg group-hover:bg-blue-500/50 transition-colors duration-300">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-sm">
                                        Website
                                    </span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left/Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Gallery */}
                    <div className="bg-white rounded-2xl border border-blue-100 p-6 mb-8 w-full">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                                <ImageIcon className="w-6 h-6 text-blue-400" />{" "}
                                Gallery
                            </h2>
                            <div className="border-b border-blue-100 my-2" />
                            <div className="text-gray-500 text-base font-normal mt-1">
                                A glimpse inside our clinic. Swipe or use arrows
                                to browse.
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="w-full max-w-2xl mx-auto">
                                {galleryImages && galleryImages.length > 0 ? (
                                    <div className="relative">
                                        <Swiper
                                            modules={[
                                                Navigation,
                                                Pagination,
                                                A11y,
                                            ]}
                                            spaceBetween={0}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            className="rounded-2xl"
                                            style={{ paddingBottom: "1.5rem" }}
                                        >
                                            {galleryImages.map((img, idx) => (
                                                <SwiperSlide
                                                    key={img.id || idx}
                                                >
                                                    <button
                                                        className="w-full aspect-[16/9] flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden focus:outline-none border border-blue-100 h-64 md:h-80"
                                                        style={{
                                                            minHeight: "16rem",
                                                            maxHeight: "20rem",
                                                        }}
                                                        onClick={() =>
                                                            setLightboxImg(
                                                                img.image_url
                                                            )
                                                        }
                                                        tabIndex={0}
                                                        aria-label="View image"
                                                    >
                                                        <img
                                                            src={img.image_url}
                                                            alt="Clinic gallery"
                                                            className="object-cover w-full h-full rounded-2xl"
                                                        />
                                                    </button>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 italic flex items-center gap-2 justify-center min-h-[100px]">
                                        <ImageIcon className="w-6 h-6" /> No
                                        images yet.
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Lightbox Modal */}
                        {lightboxImg && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                                onClick={() => setLightboxImg(null)}
                                tabIndex={-1}
                                aria-modal="true"
                                role="dialog"
                            >
                                <img
                                    src={lightboxImg}
                                    alt="Large view"
                                    className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-lg border-4 border-white"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    className="absolute top-4 right-4 bg-white/80 hover:bg-red-500 hover:text-white text-gray-700 rounded-full p-2 shadow"
                                    onClick={() => setLightboxImg(null)}
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            About {clinic.name}
                        </h2>
                        {clinic.description ? (
                            <p className="text-gray-600 leading-relaxed">
                                {clinic.description}
                            </p>
                        ) : (
                            <p className="text-gray-500 italic">
                                No description available.
                            </p>
                        )}
                    </div>

                    {/* Services & Specialties */}
                    <div className="bg-white rounded-2xl border border-blue-100 p-6 mb-8">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                                <Package className="w-6 h-6 text-blue-400" />{" "}
                                Services & Specialties
                            </h2>
                            <div className="border-b border-blue-100 my-2" />
                            <div className="text-gray-500 text-base font-normal mt-1">
                                Comprehensive dental services offered by our
                                clinic.
                            </div>
                        </div>

                        {clinic.services && clinic.services.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {clinic.services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Package className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {service.name}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Activity className="w-4 h-4 text-green-600" />
                                                <span className="text-xs text-green-600 font-medium">
                                                    Active
                                                </span>
                                            </div>
                                        </div>

                                        {service.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {service.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between">
                                            {service.price ? (
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                    <span className="font-semibold text-green-600">
                                                        ₱
                                                        {parseFloat(
                                                            service.price
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-gray-500">
                                                    <Info className="w-4 h-4" />
                                                    <span className="text-sm">
                                                        Price on request
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                onClick={handleBookAppointment}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full transition-colors duration-200"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Package className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Services Coming Soon
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    This clinic is setting up their service
                                    offerings. Please contact them directly for
                                    available services.
                                </p>
                                <button
                                    onClick={handleBookAppointment}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Book Appointment
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Operating Hours */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-blue-400" />{" "}
                            Operating Hours
                        </h2>
                        {clinic.operating_hours &&
                        Object.keys(clinic.operating_hours).length > 0 ? (
                            (() => {
                                const daysOfWeek = [
                                    { id: "monday", label: "Monday" },
                                    { id: "tuesday", label: "Tuesday" },
                                    { id: "wednesday", label: "Wednesday" },
                                    { id: "thursday", label: "Thursday" },
                                    { id: "friday", label: "Friday" },
                                    { id: "saturday", label: "Saturday" },
                                    { id: "sunday", label: "Sunday" },
                                ];
                                const todayIdx = new Date().getDay(); // 0=Sunday, 1=Monday...
                                const todayKey =
                                    daysOfWeek[
                                        todayIdx === 0 ? 6 : todayIdx - 1
                                    ].id;
                                const now = new Date();
                                const pad = (n) =>
                                    n.toString().padStart(2, "0");
                                const nowStr =
                                    pad(now.getHours()) +
                                    ":" +
                                    pad(now.getMinutes());
                                const todayHours =
                                    clinic.operating_hours[todayKey];
                                let openNow = false;
                                if (
                                    todayHours &&
                                    Array.isArray(todayHours) &&
                                    todayHours.length === 2
                                ) {
                                    openNow =
                                        nowStr >= todayHours[0] &&
                                        nowStr < todayHours[1];
                                }
                                // Helper to format 24h to 12h
                                const format12h = (time) => {
                                    if (!time) return "";
                                    let [h, m] = time.split(":");
                                    h = parseInt(h, 10);
                                    const ampm = h >= 12 ? "PM" : "AM";
                                    h = h % 12;
                                    if (h === 0) h = 12;
                                    return `${pad(h)}:${m} ${ampm}`;
                                };
                                return (
                                    <>
                                        <div className="mb-3 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                    openNow
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                                aria-live="polite"
                                                title={
                                                    todayHours &&
                                                    Array.isArray(todayHours) &&
                                                    todayHours.length === 2
                                                        ? `Today's hours: ${format12h(
                                                              todayHours[0]
                                                          )} – ${format12h(
                                                              todayHours[1]
                                                          )}`
                                                        : "Closed today"
                                                }
                                            >
                                                {openNow
                                                    ? "Open now"
                                                    : "Closed now"}
                                            </span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow border border-blue-100">
                                                <thead>
                                                    <tr>
                                                        <th className="py-2 px-3 text-gray-700 font-semibold border-r border-blue-50">
                                                            Day
                                                        </th>
                                                        <th className="py-2 px-3 text-gray-700 font-semibold">
                                                            Hours
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {daysOfWeek.map(
                                                        (day, idx) => {
                                                            const hours =
                                                                clinic
                                                                    .operating_hours[
                                                                    day.id
                                                                ];
                                                            const isToday =
                                                                day.id ===
                                                                todayKey;
                                                            return (
                                                                <tr
                                                                    key={day.id}
                                                                    className={
                                                                        isToday
                                                                            ? "bg-blue-50 font-bold"
                                                                            : "hover:bg-gray-50 transition"
                                                                    }
                                                                >
                                                                    <td className="py-2 px-3 capitalize border-r border-blue-50 rounded-l-xl">
                                                                        {
                                                                            day.label
                                                                        }
                                                                    </td>
                                                                    <td className="py-2 px-3 rounded-r-xl">
                                                                        {hours &&
                                                                        Array.isArray(
                                                                            hours
                                                                        ) &&
                                                                        hours.length ===
                                                                            2 ? (
                                                                            <span>
                                                                                {format12h(
                                                                                    hours[0]
                                                                                )}{" "}
                                                                                –{" "}
                                                                                {format12h(
                                                                                    hours[1]
                                                                                )}
                                                                            </span>
                                                                        ) : (
                                                                            <span
                                                                                className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"
                                                                                aria-label="Closed"
                                                                            >
                                                                                Closed
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">
                                            <span className="inline-block bg-blue-50 px-2 py-1 rounded">
                                                All times are shown in local
                                                time. For emergencies, please
                                                call the clinic directly.
                                            </span>
                                        </div>
                                    </>
                                );
                            })()
                        ) : (
                            <p className="text-gray-500 italic">
                                Operating hours not available. Please contact
                                the clinic directly for their schedule.
                            </p>
                        )}
                    </div>

                    {/* Doctors & Staff */}
                    <div className="bg-white rounded-2xl border border-blue-100 p-6 mb-8">
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                                <Users className="w-6 h-6 text-blue-400" />{" "}
                                Doctors & Staff
                            </h2>
                            <div className="border-b border-blue-100 my-2" />
                            <div className="text-gray-500 text-base font-normal mt-1">
                                Meet our dedicated team of dental professionals.
                            </div>
                        </div>

                        {clinic.staff && clinic.staff.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {clinic.staff.map((member) => {
                                    const getRoleIcon = (role) => {
                                        switch (role) {
                                            case "dentist":
                                                return (
                                                    <Stethoscope className="w-5 h-5 text-blue-600" />
                                                );
                                            case "staff":
                                                return (
                                                    <Briefcase className="w-5 h-5 text-green-600" />
                                                );
                                            default:
                                                return (
                                                    <User className="w-5 h-5 text-gray-600" />
                                                );
                                        }
                                    };

                                    const getRoleLabel = (role) => {
                                        switch (role) {
                                            case "dentist":
                                                return "Dentist";
                                            case "staff":
                                                return "Staff";
                                            default:
                                                return "Team Member";
                                        }
                                    };

                                    const getRoleColor = (role) => {
                                        switch (role) {
                                            case "dentist":
                                                return "bg-blue-100 text-blue-700";
                                            case "staff":
                                                return "bg-green-100 text-green-700";
                                            default:
                                                return "bg-gray-100 text-gray-700";
                                        }
                                    };

                                    return (
                                        <div
                                            key={member.id}
                                            className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:scale-105"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border-2 border-blue-200">
                                                        {member.name ? (
                                                            <span className="text-blue-700 font-semibold text-lg">
                                                                {member.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        ) : (
                                                            <User className="w-6 h-6 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-lg">
                                                            {member.name ||
                                                                "Team Member"}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {getRoleIcon(
                                                                member.role
                                                            )}
                                                            <span
                                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                                                                    member.role
                                                                )}`}
                                                            >
                                                                {getRoleLabel(
                                                                    member.role
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {member.email && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span className="truncate">
                                                        {member.email}
                                                    </span>
                                                </div>
                                            )}

                                            {member.phone_number && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span>
                                                        {member.phone_number}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Users className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Team Information Coming Soon
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Our team information is being updated.
                                    Please contact the clinic directly for more
                                    information about our staff.
                                </p>
                                <button
                                    onClick={handleBookAppointment}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Book Appointment
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Reviews & Ratings */}
                    <div className="bg-white rounded-2xl border border-blue-100 p-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold text-blue-900">
                                        Reviews & Ratings
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        Share your experience with this clinic
                                    </p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <div className="flex items-center gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <=
                                                (clinic.review_stats
                                                    ?.average_rating || 0)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                            fill={
                                                star <=
                                                (clinic.review_stats
                                                    ?.average_rating || 0)
                                                    ? "#fde68a"
                                                    : "none"
                                            }
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-bold text-blue-900">
                                    {clinic.review_stats?.average_rating || 0}{" "}
                                    <span className="text-sm font-normal text-gray-500">
                                        out of 5
                                    </span>
                                </span>
                                <span className="text-xs text-gray-500">
                                    {clinic.review_stats?.review_count || 0}{" "}
                                    reviews
                                </span>
                            </div>
                        </div>

                        {/* Review Form */}
                        {auth?.user?.role === "patient" && (
                            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                                            auth.user.name
                                        )} flex items-center justify-center text-white font-bold text-base`}
                                    >
                                        {getInitials(auth.user.name)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-blue-900">
                                                Share your experience
                                            </span>
                                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                You
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() =>
                                                        setReviewData(
                                                            "rating",
                                                            star
                                                        )
                                                    }
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        className={`w-5 h-5 ${
                                                            reviewData.rating >=
                                                            star
                                                                ? "text-yellow-400"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder="Write your review here..."
                                            className="w-full border border-blue-100 rounded-lg px-3 py-2 text-sm resize-none mb-2"
                                            rows={3}
                                            value={reviewData.content}
                                            onChange={(e) =>
                                                setReviewData(
                                                    "content",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                placeholder="Title (optional)"
                                                className="flex-1 border border-blue-100 rounded-lg px-3 py-2 text-sm"
                                                value={reviewData.title}
                                                onChange={(e) =>
                                                    setReviewData(
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <button
                                                onClick={handleReviewSubmit}
                                                disabled={
                                                    !reviewData.content.trim() ||
                                                    reviewProcessing
                                                }
                                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm disabled:bg-gray-300"
                                            >
                                                {reviewProcessing
                                                    ? "Posting..."
                                                    : "Post Review"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Sign in prompt for guests */}
                        {!auth?.user && (
                            <div className="text-center mb-6">
                                <button
                                    onClick={() =>
                                        router.visit(route("login"), {
                                            data: {
                                                return: window.location
                                                    .pathname,
                                            },
                                        })
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Sign in to Review
                                </button>
                            </div>
                        )}
                        <div className="border-t border-blue-100 mb-6" />
                        {/* Reviews List (scrollable, max height for 2–3 reviews) */}
                        {clinic.reviews && clinic.reviews.length > 0 ? (
                            <div
                                className="overflow-y-auto"
                                style={{ maxHeight: "420px" }}
                            >
                                <div className="space-y-4">
                                    {clinic.reviews.map((review) => {
                                        const isCurrentUser =
                                            auth?.user &&
                                            review.patient?.user?.id ===
                                                auth.user.id;
                                        const name =
                                            review.patient?.user?.name ||
                                            review.patient?.first_name ||
                                            "Anonymous";
                                        return (
                                            <div
                                                key={review.id}
                                                className="bg-blue-50 border border-blue-100 rounded-xl p-4"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`w-10 h-10 rounded-full ${getAvatarColor(
                                                            name
                                                        )} flex items-center justify-center text-white font-bold text-base`}
                                                    >
                                                        {getInitials(name)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-blue-900">
                                                                {name}
                                                            </span>
                                                            {isCurrentUser && (
                                                                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                                    You
                                                                </span>
                                                            )}
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                {
                                                                    review.formatted_date
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1 mb-1">
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`w-4 h-4 ${
                                                                        star <=
                                                                        review.rating
                                                                            ? "text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                    fill={
                                                                        star <=
                                                                        review.rating
                                                                            ? "#fde68a"
                                                                            : "none"
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                        {review.title && (
                                                            <div className="font-medium text-gray-900 mb-2">
                                                                {review.title}
                                                            </div>
                                                        )}
                                                        <div className="text-gray-700 text-sm leading-relaxed mb-1">
                                                            {review.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No reviews yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Be the first to share your experience with
                                    this clinic.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right/Sidebar Column */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-blue-400" />{" "}
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 justify-center transition-colors duration-200"
                                onClick={handleBookAppointment}
                            >
                                <Calendar className="w-5 h-5" /> Book
                                Appointment
                            </button>
                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 justify-center transition-colors duration-200">
                                <Star className="w-5 h-5 text-yellow-400" />{" "}
                                View Reviews
                            </button>
                            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 justify-center transition-colors duration-200">
                                <MapPin className="w-5 h-5 text-blue-400" /> Get
                                Directions
                            </button>
                        </div>
                    </div>

                    {/* Accessibility & Trust */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-blue-400" />{" "}
                            Accessibility & Trust
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold gap-1">
                                <ShieldCheck className="w-4 h-4" /> DOH
                                Accredited
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold gap-1">
                                <Accessibility className="w-4 h-4" /> Wheelchair
                                Accessible
                            </span>
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold gap-1">
                                <CheckCircle className="w-4 h-4" /> COVID-Safe
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                            Accreditation and accessibility info coming soon.
                        </p>
                    </div>

                    {/* Location & Map */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin
                                className="w-5 h-5 text-blue-500"
                                aria-label="Location icon"
                            />{" "}
                            Location
                        </h3>
                        <div className="bg-blue-50 border border-blue-100 rounded-xl h-64 flex items-center justify-center overflow-hidden shadow-sm">
                            {clinic.latitude && clinic.longitude ? (
                                <MapContainer
                                    center={[clinic.latitude, clinic.longitude]}
                                    zoom={16}
                                    scrollWheelZoom={false}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        minHeight: 256,
                                        borderRadius: "0.75rem",
                                        boxShadow:
                                            "0 2px 8px 0 rgba(30, 64, 175, 0.08)",
                                    }}
                                    whenCreated={(mapInstance) => {
                                        mapRef.current = mapInstance;
                                    }}
                                    aria-label="Clinic location map"
                                    title="Clinic location map"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker
                                        position={[
                                            clinic.latitude,
                                            clinic.longitude,
                                        ]}
                                        icon={markerIcon}
                                        title="Clinic location"
                                    >
                                        <Popup>
                                            {clinic.name}
                                            <br />
                                            {clinic.street_address}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            ) : (
                                <div className="text-center text-gray-500 w-full">
                                    Location not set. Please contact the clinic
                                    for directions.
                                </div>
                            )}
                        </div>
                        <div className="my-4 border-t border-blue-100" />
                        <div className="flex flex-col gap-1 mb-2">
                            <span className="text-base text-gray-700 font-semibold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-400" />{" "}
                                {clinic.street_address}
                            </span>
                            {clinic.latitude && clinic.longitude && (
                                <span className="text-xs text-gray-400 ml-1 select-all">
                                    Lat: {clinic.latitude}, Lng:{" "}
                                    {clinic.longitude}
                                </span>
                            )}
                        </div>
                        {clinic.latitude && clinic.longitude && (
                            <button
                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2 justify-center shadow transition-colors duration-200 text-base"
                                onClick={() =>
                                    window.open(
                                        `https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`,
                                        "_blank"
                                    )
                                }
                                aria-label="Get directions"
                            >
                                <MapPin className="w-5 h-5 text-white" /> Get
                                Directions
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 mt-16">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="space-y-8 xl:col-span-1">
                            <h3 className="text-2xl font-bold text-white">
                                Smile Suite
                            </h3>
                            <p className="text-gray-300 text-base">
                                Cloud-based dental clinic management solution
                                designed to streamline your practice operations.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                            <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                        Platform
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                        <li>
                                            <Link
                                                href="/#features"
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route(
                                                    "public.clinics.index"
                                                )}
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                Find Clinics
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-12 md:mt-0">
                                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                        Support
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                        <li>
                                            <Link
                                                href="/#about"
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("login")}
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                Login
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-700 pt-8">
                        <p className="text-base text-gray-400 xl:text-center">
                            &copy; 2024 Smile Suite. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowBookingModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Book Appointment
                        </h2>
                        <form
                            onSubmit={handleBookingSubmit}
                            className="space-y-4"
                        >
                            {successMessage && (
                                <div className="mb-2 p-2 bg-green-100 text-green-700 rounded text-center text-sm">
                                    {successMessage}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded px-3 py-2"
                                    value={data.date}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={(e) =>
                                        setData("date", e.target.value)
                                    }
                                    required
                                />
                                {errors.date && (
                                    <div className="text-red-600 text-sm">
                                        {errors.date}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full border rounded px-3 py-2"
                                    value={data.time}
                                    onChange={(e) =>
                                        setData("time", e.target.value)
                                    }
                                    required
                                />
                                {errors.time && (
                                    <div className="text-red-600 text-sm">
                                        {errors.time}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Visit
                                </label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={data.reason}
                                    onChange={(e) =>
                                        setData("reason", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a reason</option>
                                    {REASONS.map((r) => (
                                        <option key={r.id} value={r.label}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.reason && (
                                    <div className="text-red-600 text-sm">
                                        {errors.reason}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes (optional)
                                </label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    rows={3}
                                />
                                {errors.notes && (
                                    <div className="text-red-600 text-sm">
                                        {errors.notes}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    onClick={() => {
                                        setShowBookingModal(false);
                                        reset();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowReviewModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Leave a Review
                        </h2>
                        <form
                            onSubmit={handleReviewSubmit}
                            className="space-y-4"
                        >
                            {successMessage && (
                                <div className="mb-2 p-2 bg-green-100 text-green-700 rounded text-center text-sm">
                                    {successMessage}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rating
                                </label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 cursor-pointer ${
                                                reviewData.rating >= i
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }`}
                                            onClick={() =>
                                                setReviewData("rating", i)
                                            }
                                            onMouseEnter={() =>
                                                setReviewData("rating", i)
                                            }
                                            onMouseLeave={() =>
                                                setReviewData(
                                                    "rating",
                                                    reviewData.rating
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                                {reviewErrors.rating && (
                                    <div className="text-red-600 text-sm">
                                        {reviewErrors.rating}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title (optional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={reviewData.title}
                                    onChange={(e) =>
                                        setReviewData("title", e.target.value)
                                    }
                                />
                                {reviewErrors.title && (
                                    <div className="text-red-600 text-sm">
                                        {reviewErrors.title}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Review (required)
                                </label>
                                <textarea
                                    className="w-full border rounded px-3 py-2"
                                    value={reviewData.content}
                                    onChange={(e) =>
                                        setReviewData("content", e.target.value)
                                    }
                                    rows={4}
                                    required
                                />
                                {reviewErrors.content && (
                                    <div className="text-red-600 text-sm">
                                        {reviewErrors.content}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        resetReview();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                    disabled={reviewProcessing}
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </GuestLayout>
    );
}
