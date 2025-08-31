import React from "react";
import {
    Shield,
    Award,
    CheckCircle,
    Users,
    Clock,
    Star,
    Heart,
    Zap,
} from "lucide-react";

export default function AccessibilityTrust({ clinic }) {
    const getAccessibilityFeatures = () => {
        const features = [];

        if (clinic.wheelchair_accessible) {
            features.push({
                icon: Users,
                label: "Wheelchair Accessible",
                description: "Full accessibility for mobility needs",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
            });
        }

        if (clinic.family_friendly) {
            features.push({
                icon: Heart,
                label: "Family Friendly",
                description: "Welcoming environment for all ages",
                color: "text-pink-600",
                bgColor: "bg-pink-50",
                borderColor: "border-pink-200",
            });
        }

        if (clinic.extended_hours) {
            features.push({
                icon: Clock,
                label: "Extended Hours",
                description: "Flexible scheduling options",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
            });
        }

        if (clinic.certified_professionals) {
            features.push({
                icon: Award,
                label: "Certified Professionals",
                description: "Licensed and continuously trained",
                color: "text-purple-600",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200",
            });
        }

        // Default features if none specified
        if (features.length === 0) {
            features.push(
                {
                    icon: Shield,
                    label: "Professional Care",
                    description: "Experienced dental professionals",
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                },
                {
                    icon: CheckCircle,
                    label: "Quality Service",
                    description: "Committed to excellence",
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                }
            );
        }

        return features;
    };

    const getTrustBadges = () => {
        const badges = [];

        if (clinic.verified) {
            badges.push({
                icon: Shield,
                label: "Verified Clinic",
                description: "Authenticated and verified by Smile Suite",
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                highlight: true,
            });
        }

        if (clinic.licensed_insured) {
            badges.push({
                icon: Award,
                label: "Licensed & Insured",
                description: "Fully licensed and insured practice",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
            });
        }

        if (clinic.highly_rated) {
            badges.push({
                icon: Star,
                label: "Highly Rated",
                description: "Consistently excellent patient feedback",
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
            });
        }

        // Default badges if none specified
        if (badges.length === 0) {
            badges.push({
                icon: Shield,
                label: "Trusted Practice",
                description: "Reliable dental care provider",
                color: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
            });
        }

        return badges;
    };

    const accessibilityFeatures = getAccessibilityFeatures();
    const trustBadges = getTrustBadges();

    return (
        <div className="space-y-5">
            {/* Accessibility Features */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        Accessibility Features
                    </h3>
                </div>
                <div className="p-5">
                    <div className="space-y-3">
                        {accessibilityFeatures.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 p-3 rounded-xl border ${feature.borderColor} ${feature.bgColor} hover:shadow-md transition-all duration-300`}
                                >
                                    <div
                                        className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                                    >
                                        <IconComponent
                                            className={`w-6 h-6 ${feature.color}`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className={`font-bold ${feature.color} mb-1 text-lg`}
                                        >
                                            {feature.label}
                                        </h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Trust & Verification */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="px-5 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Trust & Verification
                    </h3>
                </div>
                <div className="p-5">
                    <div className="space-y-3">
                        {trustBadges.map((badge, index) => {
                            const IconComponent = badge.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                                        badge.borderColor
                                    } ${
                                        badge.bgColor
                                    } hover:shadow-md transition-all duration-300 ${
                                        badge.highlight
                                            ? "ring-2 ring-green-200 ring-offset-2"
                                            : ""
                                    }`}
                                >
                                    <div
                                        className={`w-12 h-12 ${badge.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                                    >
                                        <IconComponent
                                            className={`w-6 h-6 ${badge.color}`}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4
                                                className={`font-bold ${badge.color} text-lg`}
                                            >
                                                {badge.label}
                                            </h4>
                                            {badge.highlight && (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {badge.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Additional Trust Indicators */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-gray-900 mb-4 text-center text-lg">
                    Why Choose Us?
                </h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium">
                            Patient-centered approach
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium">
                            Modern dental technology
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium">
                            Comprehensive care plans
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium">
                            Emergency care available
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
