import React from "react";
import { Star, User, Award, TrendingUp } from "lucide-react";

const REVIEW_CATEGORIES = {
    professionalism: "Professionalism",
    communication: "Communication",
    treatment_quality: "Treatment Quality",
    bedside_manner: "Bedside Manner",
};

export default function DoctorPerformanceSummary({ doctor, categoryRatings }) {
    const getRatingColor = (rating) => {
        const numRating = typeof rating === "number" ? rating : 0;
        if (numRating >= 4.5) return "text-green-600";
        if (numRating >= 4.0) return "text-blue-600";
        if (numRating >= 3.5) return "text-yellow-600";
        return "text-gray-600";
    };

    const getRatingBgColor = (rating) => {
        const numRating = typeof rating === "number" ? rating : 0;
        if (numRating >= 4.5) return "bg-green-100 border-green-200";
        if (numRating >= 4.0) return "bg-blue-100 border-blue-200";
        if (numRating >= 3.5) return "bg-yellow-100 border-yellow-200";
        return "bg-gray-100 border-gray-200";
    };

    const formatRating = (rating) => {
        if (typeof rating === "number" && !isNaN(rating)) {
            return rating.toFixed(1);
        }
        return "0.0";
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {doctor.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">
                                {doctor.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                    <Award className="w-2 h-2 mr-1" />
                                    Dentist
                                </div>
                                {doctor.years_experience && (
                                    <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                        <TrendingUp className="w-2 h-2 mr-1" />
                                        {doctor.years_experience} years
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-blue-600 mb-1">
                            {formatRating(doctor.average_rating)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                        star <= (doctor.average_rating || 0)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-600">
                            {doctor.review_count || 0} reviews
                        </p>
                    </div>
                </div>
            </div>

            {/* Performance Breakdown */}
            <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Performance Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-2">
                    {Object.entries(REVIEW_CATEGORIES).map(([key, label]) => {
                        const rating = categoryRatings?.[`avg_${key}`];
                        const formattedRating = formatRating(rating);

                        return (
                            <div
                                key={key}
                                className={`p-2 rounded-lg border ${getRatingBgColor(
                                    rating
                                )}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-700">
                                        {label}
                                    </span>
                                    <span
                                        className={`text-xs font-bold ${getRatingColor(
                                            rating
                                        )}`}
                                    >
                                        {formattedRating}/5
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-2 h-2 ${
                                                star <= (rating || 0)
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Specialties - Fixed height container */}
            <div className="px-4 pb-3 h-16 flex flex-col justify-center">
                {doctor.specialties && doctor.specialties.length > 0 ? (
                    <div>
                        <h5 className="text-xs font-semibold text-gray-700 mb-1">
                            Specialties
                        </h5>
                        <div className="flex flex-wrap gap-1">
                            {doctor.specialties.map((specialty, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                                >
                                    {specialty}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
}
