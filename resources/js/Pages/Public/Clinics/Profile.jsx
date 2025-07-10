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
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon fix for default icon issue in Leaflet
const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
});

export default function ClinicProfile({ clinic }) {
    const { auth } = usePage().props;
    console.log("auth:", auth); // Debug: See what auth is when logged out or in
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [userLocation, setUserLocation] = useState(null);
    const mapRef = useRef();
    const [lightboxImg, setLightboxImg] = useState(null);
    const [galleryImages, setGalleryImages] = useState(
        clinic.gallery_images || []
    );

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
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-white py-8 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
                    <img
                        src={clinic.logo_url || "/images/clinic-logo.png"}
                        alt={clinic.name}
                        className="h-32 w-32 rounded-2xl object-cover bg-gray-100 shadow-lg border-4 border-white"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-extrabold text-blue-900">
                                {clinic.name}
                            </h1>
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold gap-1">
                                <CheckCircle className="w-4 h-4" /> Verified
                            </span>
                        </div>
                        <p className="text-lg text-gray-700 mb-2">
                            {clinic.address}
                        </p>
                        {clinic.description && (
                            <p className="text-gray-500 mb-2">
                                {clinic.description}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-4">
                            {clinic.contact_number && (
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Phone className="w-4 h-4" />{" "}
                                    {clinic.contact_number}
                                </span>
                            )}
                            {clinic.email && (
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4" /> {clinic.email}
                                </span>
                            )}
                            {clinic.website && (
                                <a
                                    href={clinic.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:underline"
                                >
                                    <Globe className="w-4 h-4" /> Website
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
                    <div className="bg-white rounded-2xl shadow p-8 mb-8 border border-blue-100">
                        <div className="mb-6">
                            <h2 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3 mb-1">
                                <ImageIcon className="w-7 h-7 text-blue-400" />{" "}
                                Gallery
                            </h2>
                            <div className="text-gray-500 text-base font-medium">
                                A glimpse inside our clinic. Click any photo to
                                enlarge.
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {galleryImages && galleryImages.length > 0 ? (
                                galleryImages.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        className="relative group w-full h-36 md:h-40 bg-white rounded-xl overflow-hidden border border-blue-100 shadow-md focus:outline-none transition-all duration-300"
                                        style={{
                                            minWidth: 0,
                                            animation: `fadeIn 0.7s ${
                                                idx * 0.07
                                            }s both`,
                                        }}
                                        onClick={() =>
                                            setLightboxImg(img.image_url)
                                        }
                                        tabIndex={0}
                                        aria-label="View image"
                                    >
                                        <img
                                            src={img.image_url}
                                            alt="Clinic gallery"
                                            className="object-cover w-full h-full transition-transform duration-200 rounded-xl"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2 md:col-span-4 text-gray-400 italic flex items-center gap-2 justify-center min-h-[100px]">
                                    <ImageIcon className="w-6 h-6" /> No images
                                    yet.
                                </div>
                            )}
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
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-400" /> Services
                            & Specialties
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Placeholder services */}
                            {[
                                "General Dentistry",
                                "Dental Cleaning",
                                "Cavity Fillings",
                                "Root Canal Treatment",
                                "Braces/Orthodontics",
                                "Dental Implants",
                                "Cosmetic Dentistry",
                                "Pediatric Dentistry",
                            ].map((service, i) => (
                                <div
                                    key={i}
                                    className="flex items-center p-3 bg-gray-50 rounded-lg gap-3"
                                >
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span className="text-gray-700">
                                        {service}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-4 italic">
                            * Services may vary. Please contact the clinic for
                            specific services and pricing.
                        </p>
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
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-400" /> Doctors &
                            Staff
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Placeholder staff */}
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-4 bg-gray-50 rounded-lg p-4"
                                >
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">
                                            Dr. Jane Doe
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            Dentist
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            Team info coming soon.
                        </p>
                    </div>

                    {/* Reviews & Ratings */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-400" /> Reviews
                            & Ratings
                        </h2>
                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className="w-5 h-5 text-yellow-300"
                                    fill="#fde68a"
                                />
                            ))}
                            <span className="text-gray-700 font-semibold ml-2">
                                5.0
                            </span>
                            <span className="text-gray-400">(0 reviews)</span>
                        </div>
                        <div className="space-y-4">
                            {/* Placeholder reviews */}
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="bg-gray-50 rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-5 h-5 text-blue-400" />
                                        <span className="font-semibold text-gray-800">
                                            Patient Name
                                        </span>
                                        <span className="text-xs text-gray-400 ml-2">
                                            Just now
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((j) => (
                                            <Star
                                                key={j}
                                                className="w-4 h-4 text-yellow-300"
                                                fill="#fde68a"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600">
                                        This clinic is great! Review content
                                        coming soon.
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200">
                            Leave a Review
                        </button>
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
        </GuestLayout>
    );
}
