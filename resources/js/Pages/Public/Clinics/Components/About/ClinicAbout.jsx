import React from "react";
import { Info, Award, Heart, Shield, Users, Clock } from "lucide-react";

export default function ClinicAbout({ clinic }) {
    if (
        !clinic.description &&
        !clinic.staff &&
        !clinic.operating_hours &&
        !clinic.average_rating &&
        !clinic.verified &&
        !clinic.established_year &&
        !clinic.patients_served
    ) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    About Information
                </h3>
                <p className="text-gray-500">
                    Clinic description will appear here when available.
                </p>
            </div>
        );
    }

    const getClinicFeatures = () => {
        const features = [];

        if (clinic.staff && clinic.staff.length > 0) {
            features.push({
                icon: Users,
                label: `${clinic.staff.length} Professional Staff`,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
            });
        }

        if (clinic.operating_hours) {
            features.push({
                icon: Clock,
                label: "Flexible Hours",
                color: "text-green-600",
                bgColor: "bg-green-50",
            });
        }

        if (clinic.average_rating && clinic.average_rating >= 4.0) {
            features.push({
                icon: Award,
                label: "Highly Rated",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
            });
        }

        if (clinic.verified) {
            features.push({
                icon: Shield,
                label: "Verified Clinic",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
            });
        }

        return features;
    };

    const features = getClinicFeatures();

    return (
        <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 sm:mb-6">
                    Learn more about{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        our practice
                    </span>
                </h2>
                <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Discover what makes our dental clinic the preferred choice
                    for patients seeking quality care and exceptional service.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center">
                {/* Left Column: Description */}
                <div className="space-y-6 sm:space-y-8">
                    {clinic.description ? (
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 text-base sm:text-xl leading-relaxed">
                                {clinic.description}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center lg:text-left">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4 sm:mb-6 shadow-lg">
                                <Info className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                                About Our Clinic
                            </h3>
                            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                                We are committed to providing exceptional dental
                                care in a comfortable and welcoming environment.
                                Our team of experienced professionals is
                                dedicated to helping you achieve optimal oral
                                health.
                            </p>
                        </div>
                    )}

                    {/* Feature Highlights */}
                    {features.length > 0 && (
                        <div className="pt-2 sm:pt-4">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                                What Sets Us Apart
                            </h4>
                            <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border ${feature.bgColor} hover:shadow-md transition-all duration-300`}
                                    >
                                        <div
                                            className={`p-2 sm:p-3 rounded-xl bg-white shadow-sm ${feature.color}`}
                                        >
                                            <feature.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className="text-gray-700 font-semibold text-base sm:text-lg">
                                            {feature.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Stats & Info */}
                <div className="space-y-6 sm:space-y-8">
                    {/* Key Statistics */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        {clinic.established_year && (
                            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="text-2xl sm:text-4xl font-bold text-blue-700 mb-2 sm:mb-3">
                                    {clinic.established_year}
                                </div>
                                <div className="text-blue-600 font-semibold text-sm sm:text-lg">
                                    Established
                                </div>
                            </div>
                        )}

                        {clinic.patients_served && (
                            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="text-2xl sm:text-4xl font-bold text-green-700 mb-2 sm:mb-3">
                                    {clinic.patients_served}+
                                </div>
                                <div className="text-green-600 font-semibold text-sm sm:text-lg">
                                    Patients Served
                                </div>
                            </div>
                        )}

                        {clinic.staff && clinic.staff.length > 0 && (
                            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="text-2xl sm:text-4xl font-bold text-purple-700 mb-2 sm:mb-3">
                                    {clinic.staff.length}
                                </div>
                                <div className="text-purple-600 font-semibold text-sm sm:text-lg">
                                    Team Members
                                </div>
                            </div>
                        )}

                        {clinic.average_rating && (
                            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                <div className="text-2xl sm:text-4xl font-bold text-yellow-700 mb-2 sm:mb-3">
                                    {clinic.average_rating.toFixed(1)}
                                </div>
                                <div className="text-yellow-600 font-semibold text-sm sm:text-lg">
                                    Average Rating
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-200">
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                            Practice Highlights
                        </h4>
                        <div className="space-y-3 sm:space-y-4">
                            {clinic.verified && (
                                <div className="flex items-center gap-3 sm:gap-4 text-green-700 p-2.5 sm:p-3 bg-green-50 rounded-xl border border-green-100">
                                    <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="font-semibold text-base sm:text-lg">
                                        Verified & Accredited Clinic
                                    </span>
                                </div>
                            )}
                            {clinic.operating_hours && (
                                <div className="flex items-center gap-3 sm:gap-4 text-blue-700 p-2.5 sm:p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="font-semibold text-base sm:text-lg">
                                        Flexible Operating Hours
                                    </span>
                                </div>
                            )}
                            {clinic.average_rating &&
                                clinic.average_rating >= 4.0 && (
                                    <div className="flex items-center gap-3 sm:gap-4 text-yellow-700 p-2.5 sm:p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                                        <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                                        <span className="font-semibold text-base sm:text-lg">
                                            Highly Rated by Patients
                                        </span>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
