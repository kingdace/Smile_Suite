import React from "react";
import {
    Star,
    User,
    MessageCircle,
    Calendar,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import { getInitials, getAvatarColor } from "../Shared/utils";

const REVIEW_CATEGORIES = {
    professionalism: "Professionalism",
    communication: "Communication",
    treatment_quality: "Treatment Quality",
    bedside_manner: "Bedside Manner",
};

export default function DoctorReviewCard({
    review,
    showCategoryBreakdown = false,
}) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return "text-green-600";
        if (rating >= 4.0) return "text-blue-600";
        if (rating >= 3.5) return "text-yellow-600";
        return "text-gray-600";
    };

    const getRatingBgColor = (rating) => {
        if (rating >= 4.5) return "bg-green-100";
        if (rating >= 4.0) return "bg-blue-100";
        if (rating >= 3.5) return "bg-yellow-100";
        return "bg-gray-100";
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 transition-all duration-200">
            {/* Review Header */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${getAvatarColor(
                            review.patient?.user?.name ||
                                review.patient?.first_name ||
                                "Anonymous"
                        )}`}
                    >
                        {getInitials(
                            review.patient?.user?.name ||
                                review.patient?.first_name ||
                                "Anonymous"
                        )}
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                        {review.patient?.user?.name ||
                            (review.patient?.first_name &&
                            review.patient?.last_name
                                ? `${review.patient.first_name} ${review.patient.last_name}`
                                : "Anonymous")}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(review.created_at)}</span>
                    </div>
                </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-3 h-3 ${
                                star <= review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                            }`}
                        />
                    ))}
                </div>
                <span
                    className={`text-xs font-medium ${getRatingColor(
                        review.rating
                    )}`}
                >
                    {review.rating}/5
                </span>
            </div>

            {/* Review Title */}
            {review.title && (
                <h5 className="font-medium text-gray-900 mb-2 text-sm">
                    {review.title}
                </h5>
            )}

            {/* Review Content */}
            <p className="text-gray-700 text-xs leading-relaxed">
                {review.content || "No review content provided."}
            </p>
        </div>
    );
}
