import React from "react";
import {
    Phone,
    Mail,
    Calendar,
    CheckCircle,
    Building2,
    MapPin,
    Star,
    StarHalf,
    Share2,
    Award,
    ShieldCheck,
    Navigation,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ClinicHero({ clinic, onBookAppointment }) {
    const rating = clinic?.review_stats?.average_rating || 0;
    const reviewCount = clinic?.review_stats?.review_count || 0;

    const renderStars = (value) => {
        const full = Math.floor(value);
        const hasHalf = value - full >= 0.5;
        const empty = 5 - full - (hasHalf ? 1 : 0);
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: full }).map((_, i) => (
                    <Star
                        key={`s-full-${i}`}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                ))}
                {hasHalf && (
                    <StarHalf className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
                {Array.from({ length: empty }).map((_, i) => (
                    <Star
                        key={`s-empty-${i}`}
                        className="w-4 h-4 text-yellow-200"
                    />
                ))}
            </div>
        );
    };

    const clinicUrl = typeof window !== "undefined" ? window.location.href : "";
    const mapUrl =
        clinic?.latitude && clinic?.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${clinic.latitude},${clinic.longitude}`
              )}`
            : clinic?.street_address
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${clinic.street_address} ${
                      clinic.city_municipality_code || ""
                  }`
              )}`
            : null;

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: clinic?.name || "Smile Suite Clinic",
                    text:
                        clinic?.description ||
                        "Check out this clinic on Smile Suite",
                    url: clinicUrl,
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(clinicUrl);
            }
        } catch (e) {}
    };
    if (!clinic) {
        return (
            <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        Clinic Information
                    </h1>
                    <p className="text-blue-100 text-base">
                        Clinic details are not available.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full">
            {/* Banner Image */}
            <div className="relative h-[14rem] sm:h-[16rem] md:h-[18rem] w-full overflow-hidden">
                {clinic.banner_url && typeof clinic.banner_url === "string" ? (
                    <img
                        src={clinic.banner_url}
                        alt={`${clinic.name || "Clinic"} banner`}
                        className="w-full h-full object-cover blur-[1px]"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-200 via-sky-200 to-blue-100"></div>
                )}

                {/* Decorative Visual Elements */}
                {/* Floating geometric shapes */}
                {/* Decorative Visual Elements */}
                {/* Floating geometric shapes */}
                <div className="absolute top-8 left-8 w-16 h-16 border-2 border-teal-400/100 rounded-full"></div>
                <div className="absolute top-16 right-16 w-8 h-8 bg-cyan-500/50 rounded-md transform rotate-48"></div>
                <div className="absolute bottom-12 left-20 w-12 h-12 border-2 border-teal-400/100 rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-6 h-6 bg-cyan-400/100 rounded-full"></div>

                {/* Decorative lines */}
                <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-teal-400/100 to-transparent"></div>
                <div className="absolute bottom-1/4 right-0 w-40 h-px bg-gradient-to-r from-transparent via-cyan-400/100 to-transparent"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-teal-400/100 to-transparent transform -rotate-45"></div>

                {/* Medical/dental symbols */}
                <div className="absolute top-12 right-1/3 w-8 h-8 border border-cyan-600/100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-teal-500/100 rounded-full"></div>
                </div>
                <div className="absolute bottom-16 left-1/3 w-6 h-6 border border-cyan-500/50 rounded-lg transform rotate-45"></div>

                {/* Soft overlay gradients for readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/40 via-teal-50/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-100/10 to-cyan-100/30"></div>

                {/* Subtle dental pattern (dots) */}
                <div className="pointer-events-none absolute inset-20 opacity-50">
                    <svg
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="dots"
                                x="0"
                                y="0"
                                width="40"
                                height="40"
                                patternUnits="userSpaceOnUse"
                            >
                                <circle cx="1" cy="1" r="1" fill="#99f6e4" />{" "}
                                {/* teal-200 */}
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                </div>
            </div>

            {/* Main Content Card - IMPROVED Glassmorphism */}
            <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 absolute inset-0 flex items-center justify-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between bg-white/60 backdrop-blur-xl rounded-lg lg:rounded-xl shadow-2xl p-2 sm:p-3 lg:p-4 border border-white/60 gap-2 sm:gap-3 lg:gap-4 my-2 sm:my-0"
                >
                    {/* Left Side: Logo + Name + Verified Badge + Status */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 text-center lg:text-left ml-2">
                        {/* Logo */}
                        <div className="relative">
                            {/* Decorative corner elements */}
                            <div className="w-18 h-18 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden ring-2 sm:ring-4 ring-cyan-500/30">
                                {clinic.logo_url &&
                                typeof clinic.logo_url === "string" ? (
                                    <img
                                        src={clinic.logo_url}
                                        alt={`${clinic.name || "Clinic"} logo`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Clinic Info Group */}
                        <div className="flex flex-col gap-2 sm:gap-3">
                            {/* Name and Verified Badge Row */}
                            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                    {clinic.name || "Clinic Name"}
                                </h1>
                                {/* Verified Badge */}
                                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-100 text-emerald-700 rounded-full shadow-md border border-emerald-200">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="font-semibold text-xs sm:text-sm">
                                        Verified
                                    </span>
                                </div>
                            </div>
                            {/* Clinic Description */}
                            {clinic.description &&
                                typeof clinic.description === "string" && (
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl">
                                        {clinic.description}
                                    </p>
                                )}

                            {/* Badges & Social Proof */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                                    <Award className="w-3.5 h-3.5" /> Top Rated
                                    Clinic
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-medium">
                                    <ShieldCheck className="w-3.5 h-3.5" />{" "}
                                    Clean & Safe Facility
                                </span>
                                {reviewCount > 0 && (
                                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                                        {renderStars(rating)}
                                        <span className="ml-1">
                                            {rating.toFixed(1)} ({reviewCount}{" "}
                                            reviews)
                                        </span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Subtle decorative element (desktop only) */}
                    <div
                        className="hidden lg:flex items-center justify-center px-5"
                        aria-hidden="true"
                    >
                        <div className="relative w-12 h-12">
                            {/* Soft circular gradient glow */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-500/10 via-teal-500/10 to-transparent blur-xl"></div>
                            {/* Minimal smile/dental-inspired glyph */}
                            <svg
                                viewBox="0 0 64 64"
                                className="relative z-10 w-10 h-10 mx-auto text-sky-600/70"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="17"
                                    className="opacity-60"
                                />
                                <path
                                    d="M22 36c3 4 8 6 10 6s7-2 10-6"
                                    className="opacity-80"
                                />
                                <path
                                    d="M26 28h0M38 28h0"
                                    className="opacity-60"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Right Side: Contact Info + Book Button */}
                    <div className="flex flex-col items-center lg:items-end gap-3 w-full lg:w-auto relative">
                        {/* Combined Contact Badge */}
                        <div className="w-full sm:w-64 flex flex-col gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-200 text-gray-800 shadow-lg text-center mr-4 relative">
                            {/* Email */}
                            {clinic.email && (
                                <div className="flex items-center justify-center gap-2">
                                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="font-medium text-xs sm:text-sm">
                                        {clinic.email}
                                    </span>
                                </div>
                            )}
                            {/* Phone */}
                            {clinic.contact_number && (
                                <div className="flex items-center justify-center gap-2">
                                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="font-medium text-xs sm:text-sm">
                                        {clinic.contact_number}
                                    </span>
                                </div>
                            )}
                            {/* Location */}
                            <div className="flex items-center justify-center gap-2">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="text-gray-700 font-medium text-xs sm:text-sm truncate max-w-[220px]">
                                    {clinic.street_address ||
                                        clinic.city_municipality_code ||
                                        clinic.region_code ||
                                        "Location available"}
                                </span>
                            </div>
                        </div>

                        {/* Book Appointment Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onBookAppointment}
                            className="w-full sm:w-60 px-3 sm:px-3 py-2 sm:py-2.5 bg-gradient-to-r from-teal-700 to-sky-700 text-white font-semibold text-sm sm:text-sm rounded-lg sm:rounded-xl shadow-xl hover:from-teal-750 hover:to-sky-700 transition-all duration-300 flex items-center justify-center gap-2 border border-white/30 mr-6 relative"
                        >
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                            Book Appointment
                        </motion.button>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 mr-1.5 relative">
                            {clinic.contact_number && (
                                <a
                                    href={`tel:${clinic.contact_number}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white text-gray-700 text-xs border border-gray-200 hover:bg-gray-50 transition relative"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/10 to-teal-500/5 rounded-md blur-sm opacity-0 hover:opacity-100 transition-opacity"></div>
                                    <Phone className="w-3.5 h-3.5 relative z-10" />
                                    <span className="relative z-10">
                                        Call Now
                                    </span>
                                </a>
                            )}
                            {mapUrl && (
                                <a
                                    href={mapUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white text-gray-700 text-xs border border-gray-200 hover:bg-gray-50 transition relative"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/10 to-cyan-500/5 rounded-md blur-sm opacity-0 hover:opacity-100 transition-opacity"></div>
                                    <Navigation className="w-3.5 h-3.5 relative z-10" />
                                    <span className="relative z-10">
                                        Directions
                                    </span>
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white text-gray-700 text-xs border border-gray-200 hover:bg-gray-50 transition relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400/10 to-pink-500/5 rounded-md blur-sm opacity-0 hover:opacity-100 transition-opacity"></div>
                                <Share2 className="w-3.5 h-3.5 relative z-10" />
                                <span className="relative z-10">Share</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
