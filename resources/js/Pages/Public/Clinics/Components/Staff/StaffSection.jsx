import React from "react";
import { Users, Mail, Phone, MapPin, Award, Star } from "lucide-react";
import { getInitials, getAvatarColor } from "../Shared/utils";

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {clinic.staff.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden group flex flex-col h-full"
                    >
                        {/* Header with Avatar and Role */}
                        <div className="relative p-3 sm:p-5 pb-2 sm:pb-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${getRoleColor(
                                            member.role
                                        )} flex items-center justify-center text-base sm:text-xl text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300`}
                                    >
                                        {getInitials(member.name)}
                                    </div>
                                </div>

                                {/* Name and Role */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                        {member.name}
                                    </h3>
                                    <span
                                        className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                                            member.role
                                        )}`}
                                    >
                                        <span className="mr-1.5 sm:mr-2">
                                            {getRoleIcon(member.role)}
                                        </span>
                                        {member.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="px-3 sm:px-5 pb-3 sm:pb-4 space-y-1.5 sm:space-y-2">
                            {member.email && (
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-300">
                                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="text-xs sm:text-sm hover:underline truncate"
                                    >
                                        {member.email}
                                    </a>
                                </div>
                            )}

                            {member.phone && (
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-green-600 transition-colors duration-300">
                                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                    <a
                                        href={`tel:${member.phone}`}
                                        className="text-xs sm:text-sm hover:underline"
                                    >
                                        {member.phone}
                                    </a>
                                </div>
                            )}

                            {member.location && (
                                <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm">
                                        {member.location}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Profile Meta (always renders to keep layout consistent) */}
                        <div className="px-3 sm:px-5 pb-3 sm:pb-4 space-y-2 sm:space-y-3">
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                                    {isClinicalRole(member.role)
                                        ? "Specialties"
                                        : "Responsibilities"}
                                </h4>
                                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                                    {isClinicalRole(member.role) ? (
                                        member.specialties &&
                                        member.specialties.length > 0 ? (
                                            member.specialties.map(
                                                (specialty, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                                                    >
                                                        {specialty}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 text-gray-500 text-xs rounded-full border border-gray-200">
                                                Not specified
                                            </span>
                                        )
                                    ) : (
                                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                                            {member.role}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {member.experience && (
                                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                                    <span className="font-medium">
                                        {member.experience} years experience
                                    </span>
                                </div>
                            )}

                            {member.education && (
                                <div className="text-xs sm:text-sm text-gray-600">
                                    <span className="font-semibold">
                                        Education:
                                    </span>{" "}
                                    {member.education}
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="px-3 sm:px-5 pb-3 sm:pb-5 mt-auto">
                            <button
                                onClick={onBookAppointment}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg text-xs sm:text-sm"
                            >
                                Book with {member.name.split(" ")[0]}
                            </button>
                        </div>
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
