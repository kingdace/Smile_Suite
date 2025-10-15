import React from "react";
import { Users, Mail, Phone, MapPin, Award, Star } from "lucide-react";
import { getInitials, getAvatarColor } from "../Shared/utils";
import { getDentistDisplayName } from "@/Helpers/DentistHelper";
import { ImageHelper } from "@/Helpers/ImageHelper";

export default function StaffSection({ clinic, onBookAppointment }) {
    if (!clinic.staff || clinic.staff.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Doctors & Staff
                </h3>
                <p className="text-gray-500">
                    Staff information will appear here when available.
                </p>
            </div>
        );
    }

    const getRoleIcon = (role) => {
        const roleLower = role.toLowerCase();
        if (roleLower.includes("dentist") || roleLower.includes("doctor"))
            return "🦷";
        if (roleLower.includes("hygienist")) return "✨";
        if (roleLower.includes("assistant")) return "👩‍⚕️";
        if (roleLower.includes("nurse")) return "🏥";
        if (roleLower.includes("receptionist")) return "📞";
        return "👨‍⚕️";
    };

    const getRoleColor = (role) => {
        const roleLower = role.toLowerCase();
        if (roleLower.includes("dentist") || roleLower.includes("doctor"))
            return "from-blue-500 to-blue-600";
        if (roleLower.includes("hygienist"))
            return "from-green-500 to-green-600";
        if (roleLower.includes("assistant"))
            return "from-purple-500 to-purple-600";
        if (roleLower.includes("nurse")) return "from-red-500 to-red-600";
        if (roleLower.includes("receptionist"))
            return "from-orange-500 to-orange-600";
        return "from-gray-500 to-gray-600";
    };

    const getRoleBadgeColor = (role) => {
        const roleLower = role.toLowerCase();
        if (roleLower.includes("dentist") || roleLower.includes("doctor"))
            return "bg-blue-100 text-blue-700 border-blue-200";
        if (roleLower.includes("hygienist"))
            return "bg-green-100 text-green-700 border-green-200";
        if (roleLower.includes("assistant"))
            return "bg-purple-100 text-purple-700 border-purple-200";
        if (roleLower.includes("nurse"))
            return "bg-red-100 text-red-700 border-red-200";
        if (roleLower.includes("receptionist"))
            return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    const isClinicalRole = (role) => {
        const r = role.toLowerCase();
        return (
            r.includes("dentist") ||
            r.includes("doctor") ||
            r.includes("hygienist")
        );
    };

    return (
        <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-4 sm:mb-8">
                <div className="inline-flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1.5 sm:py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200/50 shadow-sm mb-3 sm:mb-6">
                    <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
                        Our Team
                    </span>
                </div>
                <h2 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3 sm:mb-6">
                    Meet our{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        dental professionals
                    </span>
                </h2>
                <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Our experienced team is dedicated to providing you with the
                    highest quality dental care in a comfortable and welcoming
                    environment.
                </p>
            </div>

            {/* Staff Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {clinic.staff
                    .sort((a, b) => {
                        // Sort dentists first, then staff
                        const aIsDentist = a.role?.toLowerCase().includes('dentist') || a.role?.toLowerCase().includes('doctor');
                        const bIsDentist = b.role?.toLowerCase().includes('dentist') || b.role?.toLowerCase().includes('doctor');
                        
                        if (aIsDentist && !bIsDentist) return -1; // a (dentist) comes first
                        if (!aIsDentist && bIsDentist) return 1;  // b (dentist) comes first
                        return 0; // same type, maintain original order
                    })
                    .map((member, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group flex flex-col min-h-[280px] sm:min-h-[320px] w-full"
                    >
                        {/* Header with Avatar and Role - Mobile Compact */}
                        <div className="relative p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar - Mobile Responsive Size */}
                                <div className="mb-3 sm:mb-4 lg:mb-6">
                                    {member.avatar_url ? (
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 sm:border-4 border-white shadow-lg sm:shadow-xl group-hover:shadow-xl sm:group-hover:shadow-2xl group-hover:scale-105 sm:group-hover:scale-110 transition-all duration-300">
                                            <img
                                                src={ImageHelper.getImageUrl(
                                                    member.avatar_url
                                                )}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br ${getRoleColor(
                                                member.role
                                            )} flex items-center justify-center text-xl sm:text-2xl lg:text-3xl text-white font-bold shadow-lg sm:shadow-xl group-hover:shadow-xl sm:group-hover:shadow-2xl group-hover:scale-105 sm:group-hover:scale-110 transition-all duration-300`}
                                        >
                                            {getInitials(member.name)}
                                        </div>
                                    )}
                                </div>

                                {/* Name and Role - Mobile Optimized */}
                                <div className="w-full">
                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                        {getDentistDisplayName(member)}
                                    </h3>
                                    <span
                                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border ${getRoleBadgeColor(
                                            member.role
                                        )}`}
                                    >
                                        <span className="mr-1 sm:mr-2 text-xs sm:text-sm">
                                            {getRoleIcon(member.role)}
                                        </span>
                                        <span className="truncate">
                                            {member.role.charAt(0).toUpperCase() +
                                                member.role.slice(1)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information - Mobile Compact */}
                        <div className="flex-1 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 space-y-2 sm:space-y-3 flex flex-col items-center">
                            {member.email && (
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300 w-full justify-center">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-xs sm:text-sm hover:underline truncate max-w-[200px] sm:max-w-none"
                                        title={member.email}
                                    >
                                        {member.email}
                                    </a>
                                </div>
                            )}

                            {member.phone && (
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-green-600 transition-colors duration-300 w-full justify-center">
                                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                                    <a
                                        href={`tel:${member.phone}`}
                                        className="text-xs sm:text-sm hover:underline"
                                    >
                                        {member.phone}
                                    </a>
                                </div>
                            )}

                            {member.location && (
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 w-full justify-center">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none" title={member.location}>
                                        {member.location}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Experience (if available) - Mobile Compact */}
                        {member.experience && (
                            <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6">
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 justify-center">
                                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                                    <span className="font-medium">
                                        {member.experience} years experience
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Team Highlights - Mobile Optimized */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                <div className="text-center p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl lg:rounded-2xl border border-blue-200 shadow-sm sm:shadow-md hover:shadow-md sm:hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-blue-900 mb-2 sm:mb-3">
                        Experienced Team
                    </h4>
                    <p className="text-blue-700 text-xs sm:text-sm leading-relaxed">
                        Our staff brings years of combined experience in dental
                        care.
                    </p>
                </div>

                <div className="text-center p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl lg:rounded-2xl border border-green-200 shadow-sm sm:shadow-md hover:shadow-md sm:hover:shadow-lg transition-all duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-green-900 mb-2 sm:mb-3">
                        Certified Professionals
                    </h4>
                    <p className="text-green-700 text-xs sm:text-sm leading-relaxed">
                        All team members are licensed and continuously trained.
                    </p>
                </div>

                <div className="text-center p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl lg:rounded-2xl border border-purple-200 shadow-sm sm:shadow-md hover:shadow-md sm:hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-sm">
                        <Star className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-purple-900 mb-2 sm:mb-3">
                        Patient-Focused
                    </h4>
                    <p className="text-purple-700 text-xs sm:text-sm leading-relaxed">
                        We prioritize your comfort and satisfaction in
                        everything we do.
                    </p>
                </div>
            </div>

            {/* CTA Section */}
        </div>
    );
}
