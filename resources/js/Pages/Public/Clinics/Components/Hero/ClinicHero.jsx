import React from "react";
import {
    Phone,
    Mail,
    Calendar,
    CheckCircle,
    Building2,
    MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ClinicHero({ clinic, onBookAppointment }) {
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
            <div className="relative h-40 sm:h-56 md:h-64 w-full overflow-hidden">
                {clinic.banner_url && typeof clinic.banner_url === "string" ? (
                    <img
                        src={clinic.banner_url}
                        alt={`${clinic.name || "Clinic"} banner`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-700"></div>
                )}

                {/* Decorative Visual Elements */}
                {/* Floating geometric shapes */}
                <div className="absolute top-8 left-8 w-16 h-16 border-2 border-white/20 rounded-full"></div>
                <div className="absolute top-16 right-16 w-8 h-8 bg-white/10 rounded-lg transform rotate-45"></div>
                <div className="absolute bottom-12 left-20 w-12 h-12 border-2 border-white/15 rounded-full"></div>
                <div className="absolute bottom-8 right-8 w-6 h-6 bg-white/20 rounded-full"></div>

                {/* Decorative lines */}
                <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="absolute bottom-1/4 right-0 w-40 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent transform -rotate-45"></div>

                {/* Medical/dental symbols */}
                <div className="absolute top-12 right-1/3 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 rounded-full"></div>
                </div>
                <div className="absolute bottom-16 left-1/3 w-6 h-6 border border-white/25 rounded-lg transform rotate-45"></div>

                {/* Overlay gradient for readability */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Main Content Card - IMPROVED Glassmorphism */}
            <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 absolute inset-0 flex items-center justify-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between bg-white/10 backdrop-blur-2xl rounded-2xl lg:rounded-3xl shadow-3xl p-4 sm:p-6 lg:p-8 border border-white/30 gap-4 sm:gap-6 lg:gap-8 my-8 sm:my-0"
                >
                    {/* Left Side: Logo + Name + Verified Badge + Status */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 text-center lg:text-left">
                        {/* Logo */}
                        <div className="relative">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden ring-2 sm:ring-4 ring-white/40">
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
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                                    {clinic.name || "Clinic Name"}
                                </h1>
                                {/* Verified Badge */}
                                <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 rounded-full shadow-md">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    <span className="text-white font-semibold text-xs sm:text-sm">
                                        Verified
                                    </span>
                                </div>
                            </div>

                            {/* Clinic Description */}
                            {clinic.description &&
                                typeof clinic.description === "string" && (
                                    <p className="text-sm sm:text-base lg:text-lg text-blue-100 max-w-2xl">
                                        {clinic.description}
                                    </p>
                                )}
                        </div>
                    </div>

                    {/* Right Side: Contact Info + Book Button */}
                    <div className="flex flex-col items-center lg:items-end gap-4 w-full lg:w-auto">
                        {/* Combined Contact Badge */}
                        <div className="w-full sm:w-64 flex flex-col gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-blue-400/40 text-white shadow-lg text-center">
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
                                    <span className="text-white font-medium text-xs sm:text-sm">
                                        {clinic.contact_number}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Book Appointment Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onBookAppointment}
                            className="w-full sm:w-64 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2 border-2 border-white/20"
                        >
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                            Book Appointment
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
