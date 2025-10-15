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

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {clinic.staff.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group flex flex-col min-h-[320px] w-full"
                    >
                        {/* Header with Avatar and Role */}
                        <div className="relative p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar - Made More Prominent and Showcasing */}
                                <div className="mb-6">
                                    {member.avatar_url ? (
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
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
                                            className={`w-32 h-32 rounded-full bg-gradient-to-br ${getRoleColor(
                                                member.role
                                            )} flex items-center justify-center text-3xl text-white font-bold shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                                        >
                                            {getInitials(member.name)}
                                        </div>
                                    )}
                                </div>

                                {/* Name and Role */}
                                <div className="w-full">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                        {getDentistDisplayName(member)}
                                    </h3>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getRoleBadgeColor(
                                            member.role
                                        )}`}
                                    >
                                        <span className="mr-2">
                                            {getRoleIcon(member.role)}
                                        </span>
                                        {member.role.charAt(0).toUpperCase() +
                                            member.role.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information - Centered */}
                        <div className="flex-1 px-6 py-4 space-y-3 flex flex-col items-center">
                            {member.email && (
                                <div className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                                    <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-sm hover:underline truncate"
                                    >
                                        {member.email}
                                    </a>
                                </div>
                            )}

                            {member.phone && (
                                <div className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors duration-300">
                                    <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <a
                                        href={`tel:${member.phone}`}
                                        className="text-sm hover:underline"
                                    >
                                        {member.phone}
                                    </a>
                                </div>
                            )}

                            {member.location && (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <span className="text-sm">
                                        {member.location}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Experience (if available) */}
                        {member.experience && (
                            <div className="px-6 pb-6">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <span className="font-medium">
                                        {member.experience} years experience
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Team Highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="text-center p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-blue-900 mb-3">
                        Experienced Team
                    </h4>
                    <p className="text-blue-700 text-sm leading-relaxed">
                        Our staff brings years of combined experience in dental
                        care.
                    </p>
                </div>

                <div className="text-center p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Award className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-green-900 mb-3">
                        Certified Professionals
                    </h4>
                    <p className="text-green-700 text-sm leading-relaxed">
                        All team members are licensed and continuously trained.
                    </p>
                </div>

                <div className="text-center p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Star className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-purple-900 mb-3">
                        Patient-Focused
                    </h4>
                    <p className="text-purple-700 text-sm leading-relaxed">
                        We prioritize your comfort and satisfaction in
                        everything we do.
                    </p>
                </div>
            </div>

            {/* CTA Section */}
        </div>
    );
}
