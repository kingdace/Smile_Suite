import React, { useState } from "react";
import {
    Star,
    MessageCircle,
    User,
    Calendar,
    ThumbsUp,
    ThumbsDown,
} from "lucide-react";
import { getInitials, getAvatarColor } from "../Shared/utils";

export default function ReviewsSection({ clinic, auth, reviews }) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [sortBy, setSortBy] = useState("recent");

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Reviews & Ratings
                </h3>
                <p className="text-gray-500">
                    No reviews yet. Be the first to share your experience!
                </p>
            </div>
        );
    }

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const sortedReviews = [...reviews].sort((a, b) => {
        switch (sortBy) {
            case "recent":
                return new Date(b.created_at) - new Date(a.created_at);
            case "rating":
                return b.rating - a.rating;
            case "oldest":
                return new Date(a.created_at) - new Date(b.created_at);
            default:
                return 0;
        }
    });

    const displayedReviews = showAllReviews
        ? sortedReviews
        : sortedReviews.slice(0, 3);
    const averageRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;

    return (
        <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200/50 shadow-sm mb-6">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700 tracking-wide">
                        Patient Reviews
                    </span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                    What our{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        patients say
                    </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Read authentic reviews from our patients and discover why
                    they choose us for their dental care.
                </p>
            </div>

            {/* Overall Rating Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 mb-10 border border-blue-200 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Rating Display */}
                    <div className="text-center">
                        <div className="text-5xl font-bold text-blue-600 mb-3">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex items-center justify-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                        star <= averageRating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 font-medium">
                            Based on {reviews.length} reviews
                        </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2.5">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviews.filter(
                                (r) => r.rating === rating
                            ).length;
                            const percentage = (count / reviews.length) * 100;
                            return (
                                <div
                                    key={rating}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex items-center gap-1 w-16">
                                        <span className="text-sm text-gray-600">
                                            {rating}
                                        </span>
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    </div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-3">
                        <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {reviews.length}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                Total Reviews
                            </div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-2xl shadow-md border border-green-100 hover:shadow-lg transition-all duration-300">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {Math.round(
                                    (reviews.filter((r) => r.rating >= 4)
                                        .length /
                                        reviews.length) *
                                        100
                                )}
                                %
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                Would Recommend
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-gray-700">
                        Sort by:
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="rating">Highest Rated</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
                <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold text-sm hover:bg-blue-50 rounded-lg transition-all duration-300 border border-blue-200 hover:border-blue-300"
                >
                    {showAllReviews
                        ? "Show Less"
                        : `Show All ${reviews.length} Reviews`}
                </button>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {displayedReviews.map((review, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden"
                    >
                        {/* Review Header */}
                        <div className="p-5 pb-3">
                            <div className="flex items-start gap-3 mb-3">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm ${getAvatarColor(
                                            review.user?.name || "Anonymous"
                                        )}`}
                                    >
                                        {getInitials(
                                            review.user?.name || "Anonymous"
                                        )}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 mb-1 text-lg">
                                        {review.user?.name || "Anonymous"}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span className="font-medium">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${
                                                star <= review.rating
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span
                                    className={`text-sm font-medium ${getRatingColor(
                                        review.rating
                                    )}`}
                                >
                                    {review.rating}/5
                                </span>
                            </div>

                            {/* Review Title */}
                            {review.title && (
                                <h5 className="font-semibold text-gray-900 mb-2">
                                    {review.title}
                                </h5>
                            )}
                        </div>

                        {/* Review Content */}
                        <div className="px-5 pb-4">
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                {review.content ||
                                    "No review content provided."}
                            </p>

                            {/* Review Actions */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <button className="flex items-center gap-1 hover:text-green-600 transition-all duration-300 font-medium">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Helpful</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-red-600 transition-all duration-300 font-medium">
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>Not Helpful</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More / Show Less */}
            {reviews.length > 3 && (
                <div className="text-center">
                    <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <MessageCircle className="w-5 h-5" />
                        {showAllReviews
                            ? "Show Less Reviews"
                            : `Load All ${reviews.length} Reviews`}
                    </button>
                </div>
            )}

            {/* Leave Review CTA */}
            <div className="mt-12 text-center">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-6 border border-blue-200 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Share Your Experience
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                        Help other patients by sharing your experience with our
                        clinic. Your feedback is valuable to us and our
                        community.
                    </p>
                    {auth ? (
                        <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                            <MessageCircle className="w-5 h-5" />
                            Leave a Review
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-gray-600">
                                Please sign in to leave a review.
                            </p>
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors">
                                Sign In to Review
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
