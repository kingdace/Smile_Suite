import React, { useState } from "react";
import { X, Star, User, MessageCircle, XCircle } from "lucide-react";

const REVIEW_CATEGORIES = {
    professionalism: {
        5: "Excellent",
        4: "Good",
        3: "Average",
        2: "Poor",
        1: "Very Poor",
    },
    communication: {
        5: "Excellent",
        4: "Good",
        3: "Average",
        2: "Poor",
        1: "Very Poor",
    },
    treatment_quality: {
        5: "Excellent",
        4: "Good",
        3: "Average",
        2: "Poor",
        1: "Very Poor",
    },
    bedside_manner: {
        5: "Excellent",
        4: "Good",
        3: "Average",
        2: "Poor",
        1: "Very Poor",
    },
};

export default function DoctorReviewModal({
    isOpen,
    onClose,
    doctor,
    clinic,
    onReviewSubmitted,
}) {
    const [overallRating, setOverallRating] = useState(0);
    const [categoryRatings, setCategoryRatings] = useState({
        professionalism: 0,
        communication: 0,
        treatment_quality: 0,
        bedside_manner: 0,
    });
    const [formData, setFormData] = useState({
        rating: 0,
        title: "",
        content: "",
        staff_id: doctor?.id || null,
        professionalism_rating: 0,
        communication_rating: 0,
        treatment_quality_rating: 0,
        bedside_manner_rating: 0,
        comment: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleOverallRatingChange = (rating) => {
        setOverallRating(rating);
        setFormData((prev) => ({ ...prev, rating }));
    };

    const handleCategoryRatingChange = (category, rating) => {
        setCategoryRatings((prev) => ({
            ...prev,
            [category]: rating,
        }));
        setFormData((prev) => ({ ...prev, [`${category}_rating`]: rating }));
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate that all required fields are filled
        if (overallRating === 0) {
            setErrors({ rating: "Please provide an overall rating." });
            return;
        }

        if (Object.values(categoryRatings).some((rating) => rating === 0)) {
            setErrors({ categories: "Please rate all categories." });
            return;
        }

        if (!formData.content || formData.content.length < 10) {
            setErrors({
                content:
                    "Please provide a review content (minimum 10 characters).",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare the request data
            const requestData = {
                rating: formData.rating,
                title: formData.title,
                content: formData.content,
                staff_id: formData.staff_id,
                professionalism_rating: formData.professionalism_rating,
                communication_rating: formData.communication_rating,
                treatment_quality_rating: formData.treatment_quality_rating,
                bedside_manner_rating: formData.bedside_manner_rating,
                comment: formData.comment,
            };

            console.log("Submitting doctor review with data:", requestData);
            console.log("Clinic ID:", clinic.id);
            console.log("Doctor ID:", doctor.id);

            // Make API call to submit the doctor review
            const response = await fetch(`/clinics/${clinic.id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content"),
                    Accept: "application/json",
                },
                body: JSON.stringify(requestData),
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            const responseData = await response.json();
            console.log("Response data:", responseData);

            if (!response.ok) {
                // Handle validation errors
                if (response.status === 422 && responseData.errors) {
                    const errorMessages = Object.values(
                        responseData.errors
                    ).flat();
                    setErrors({
                        general:
                            errorMessages[0] ||
                            "Please check your input and try again.",
                    });
                    return;
                }

                // Handle "already reviewed" error (400 status)
                if (response.status === 400 && responseData.message) {
                    setErrors({ general: responseData.message });
                    return;
                }

                // Handle other errors
                if (responseData.message) {
                    setErrors({ general: responseData.message });
                } else {
                    setErrors({
                        general: "Failed to submit review. Please try again.",
                    });
                }
                return;
            }

            const newReview = responseData.review;

            // Call the callback to update parent state
            if (onReviewSubmitted) {
                onReviewSubmitted(newReview);
            }

            // Reset form
            setFormData({
                rating: 0,
                title: "",
                content: "",
                staff_id: doctor?.id || null,
                professionalism_rating: 0,
                communication_rating: 0,
                treatment_quality_rating: 0,
                bedside_manner_rating: 0,
                comment: "",
            });
            setOverallRating(0);
            setCategoryRatings({
                professionalism: 0,
                communication: 0,
                treatment_quality: 0,
                bedside_manner: 0,
            });

            onClose();
        } catch (error) {
            console.error("Error submitting doctor review:", error);
            console.error("Error details:", {
                message: error.message,
                name: error.name,
                stack: error.stack,
            });

            // Check if it's a network error or parsing error
            if (error.name === "TypeError" && error.message.includes("fetch")) {
                setErrors({
                    general:
                        "Network error. Please check your connection and try again.",
                });
            } else if (error.name === "SyntaxError") {
                setErrors({
                    general: "Server error. Please try again later.",
                });
            } else {
                setErrors({
                    general: "An unexpected error occurred. Please try again.",
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            rating: 0,
            title: "",
            content: "",
            staff_id: doctor?.id || null,
            professionalism_rating: 0,
            communication_rating: 0,
            treatment_quality_rating: 0,
            bedside_manner_rating: 0,
            comment: "",
        });
        setOverallRating(0);
        setCategoryRatings({
            professionalism: 0,
            communication: 0,
            treatment_quality: 0,
            bedside_manner: 0,
        });
        onClose();
    };

    if (!isOpen || !doctor) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Review Dr. {doctor.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Share your experience with this doctor
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* General Error Display */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <XCircle className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">
                                        {errors.general}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Overall Rating */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Overall Rating *
                        </label>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                        handleOverallRatingChange(star)
                                    }
                                    className={`p-1 transition-colors ${
                                        star <= overallRating
                                            ? "text-yellow-400"
                                            : "text-gray-300 hover:text-yellow-300"
                                    }`}
                                >
                                    <Star className="w-8 h-8 fill-current" />
                                </button>
                            ))}
                            <span className="ml-3 text-sm text-gray-600">
                                {overallRating > 0 &&
                                    `${overallRating}/5 stars`}
                            </span>
                        </div>
                        {errors.rating && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.rating}
                            </p>
                        )}
                    </div>

                    {/* Category Ratings */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Rate your experience in each category *
                        </label>
                        <div className="space-y-4">
                            {Object.entries(REVIEW_CATEGORIES).map(
                                ([category, options]) => (
                                    <div
                                        key={category}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 capitalize">
                                                {category.replace("_", " ")}
                                            </label>
                                        </div>
                                        <div className="flex-1 max-w-xs">
                                            <select
                                                value={
                                                    categoryRatings[category]
                                                }
                                                onChange={(e) =>
                                                    handleCategoryRatingChange(
                                                        category,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value={0}>
                                                    Select rating
                                                </option>
                                                {Object.entries(options).map(
                                                    ([rating, label]) => (
                                                        <option
                                                            key={rating}
                                                            value={rating}
                                                        >
                                                            {rating} - {label}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        {errors.categories && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.categories}
                            </p>
                        )}
                    </div>

                    {/* Review Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Review Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                handleInputChange("title", e.target.value)
                            }
                            placeholder="Brief title for your review (optional)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Review Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Review *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) =>
                                handleInputChange("content", e.target.value)
                            }
                            placeholder="Share your experience with this doctor (minimum 10 characters)"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                                {formData.content.length}/1000 characters
                            </span>
                            {formData.content.length < 10 &&
                                formData.content.length > 0 && (
                                    <span className="text-xs text-red-500">
                                        Minimum 10 characters required
                                    </span>
                                )}
                        </div>
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.content}
                            </p>
                        )}
                    </div>

                    {/* Optional Comment */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) =>
                                handleInputChange("comment", e.target.value)
                            }
                            placeholder="Any additional thoughts or suggestions (optional)"
                            rows={2}
                            maxLength={200}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">
                                {formData.comment.length}/200 characters
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                overallRating === 0 ||
                                Object.values(categoryRatings).some(
                                    (rating) => rating === 0
                                ) ||
                                !formData.content ||
                                formData.content.length < 10
                            }
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
