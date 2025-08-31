import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ClinicGallery({ galleryImages }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [lightboxImg, setLightboxImg] = useState(null);
    const [showLightbox, setShowLightbox] = useState(false);

    // Auto-advance carousel
    useEffect(() => {
        if (!isPlaying || galleryImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === galleryImages.length - 1 ? 0 : prev + 1
            );
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [isPlaying, galleryImages.length]);

    if (!galleryImages || galleryImages.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Gallery Images Yet
                </h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                    We're working on adding photos of our clinic facilities.
                    Check back soon to see our modern dental environment!
                </p>
            </div>
        );
    }

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setLightboxImg(galleryImages[index]);
        setShowLightbox(true);
    };

    const closeLightbox = () => {
        setShowLightbox(false);
        setLightboxImg(null);
    };

    const nextImage = () => {
        const nextIndex =
            currentImageIndex === galleryImages.length - 1
                ? 0
                : currentImageIndex + 1;
        setCurrentImageIndex(nextIndex);
        setLightboxImg(galleryImages[nextIndex]);
    };

    const prevImage = () => {
        const prevIndex =
            currentImageIndex === 0
                ? galleryImages.length - 1
                : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setLightboxImg(galleryImages[prevIndex]);
    };

    return (
        <div className="relative">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Column - Image Carousel */}
                <div className="relative">
                    {/* Main Carousel Image */}
                    <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden rounded-xl lg:rounded-2xl shadow-xl bg-gray-100">
                        <img
                            src={
                                galleryImages[currentImageIndex]?.image_url ||
                                galleryImages[currentImageIndex]?.url ||
                                galleryImages[currentImageIndex]
                            }
                            alt={`Clinic gallery image ${
                                currentImageIndex + 1
                            }`}
                            className="w-full h-full object-cover transition-all duration-500"
                            style={{ imageRendering: "auto" }}
                        />

                        {/* Minimal overlay for controls visibility */}
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    {/* Compact Navigation Controls */}
                    <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2 flex items-center justify-between z-10">
                        <button
                            onClick={() => {
                                setCurrentImageIndex((prev) =>
                                    prev === 0
                                        ? galleryImages.length - 1
                                        : prev - 1
                                );
                            }}
                            className="bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => {
                                setCurrentImageIndex((prev) =>
                                    prev === galleryImages.length - 1
                                        ? 0
                                        : prev + 1
                                );
                            }}
                            className="bg-white/30 backdrop-blur-sm hover:bg-white/50 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Compact Thumbnail Dots */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1.5">
                            {galleryImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                        index === currentImageIndex
                                            ? "bg-white scale-110"
                                            : "bg-white/60 hover:bg-white/80"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Text Content */}
                <div className="flex flex-col justify-center items-center text-center h-full space-y-4 sm:space-y-6">
                    {/* Gallery Badge */}
                    <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200/50 shadow-sm">
                        <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2z"
                            />
                        </svg>
                        <span className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
                            Our Gallery
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
                        See our{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            clinic in action
                        </span>
                    </h2>

                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-md px-4">
                        Take a virtual tour of our modern facilities and see why
                        patients choose us for their dental care. Our
                        state-of-the-art equipment and comfortable environment
                        ensure the best experience for every patient.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Professional Environment
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            Modern Equipment
                        </span>
                    </div>
                </div>
            </div>

            {/* Lightbox Modal */}
            {showLightbox && lightboxImg && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-6xl max-h-full">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300 z-10"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300 z-10"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        {/* Main Image */}
                        <img
                            src={
                                lightboxImg.image_url ||
                                lightboxImg.url ||
                                lightboxImg
                            }
                            alt="Gallery image"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                            {currentImageIndex + 1} of {galleryImages.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
