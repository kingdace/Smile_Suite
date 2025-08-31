import React from "react";
import { X, Star } from "lucide-react";

export default function ReviewModal({
    showModal,
    onClose,
    onSubmit,
    reviewData,
    setReviewData,
    reviewErrors,
    successMessage,
    reviewProcessing,
}) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative mx-4">
                <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-900">
                    Leave a Review
                </h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    {successMessage && (
                        <div className="mb-2 p-3 bg-green-100 text-green-700 rounded-lg text-center text-sm border border-green-200">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                                        reviewData.rating >= i
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                    onClick={() => setReviewData("rating", i)}
                                    onMouseEnter={() =>
                                        setReviewData("rating", i)
                                    }
                                    onMouseLeave={() =>
                                        setReviewData(
                                            "rating",
                                            reviewData.rating
                                        )
                                    }
                                />
                            ))}
                        </div>
                        {reviewErrors.rating && (
                            <div className="text-red-600 text-sm mt-1">
                                {reviewErrors.rating}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (optional)
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={reviewData.title}
                            onChange={(e) =>
                                setReviewData("title", e.target.value)
                            }
                            placeholder="Brief title for your review..."
                        />
                        {reviewErrors.title && (
                            <div className="text-red-600 text-sm mt-1">
                                {reviewErrors.title}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Review (required)
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            value={reviewData.content}
                            onChange={(e) =>
                                setReviewData("content", e.target.value)
                            }
                            rows={4}
                            required
                            placeholder="Share your experience with this clinic..."
                        />
                        {reviewErrors.content && (
                            <div className="text-red-600 text-sm mt-1">
                                {reviewErrors.content}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200 font-medium"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={reviewProcessing}
                        >
                            {reviewProcessing
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
