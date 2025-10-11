import React from "react";
import {
    Stethoscope,
    DollarSign,
    Calendar,
    Star,
    Clock,
    Award,
} from "lucide-react";

export default function ServicesSection({ clinic, onBookAppointment }) {
    const getServiceIcon = (serviceName) => {
        const name = serviceName.toLowerCase();
        if (name.includes("cleaning") || name.includes("hygiene")) return "🦷";
        if (
            name.includes("filling") ||
            name.includes("crown") ||
            name.includes("root canal")
        )
            return "🔧";
        if (name.includes("extraction") || name.includes("implant"))
            return "🦷";
        if (name.includes("braces") || name.includes("orthodontics"))
            return "🦷";
        if (name.includes("checkup") || name.includes("examination"))
            return "🔍";
        return "🦷";
    };

    const getServiceCategory = (serviceName) => {
        const name = serviceName.toLowerCase();
        if (
            name.includes("cleaning") ||
            name.includes("hygiene") ||
            name.includes("whitening")
        )
            return "Preventive";
        if (
            name.includes("filling") ||
            name.includes("crown") ||
            name.includes("root canal")
        )
            return "Restorative";
        if (name.includes("extraction") || name.includes("implant"))
            return "Surgical";
        if (name.includes("braces") || name.includes("orthodontics"))
            return "Orthodontics";
        if (name.includes("checkup") || name.includes("examination"))
            return "Diagnostic";
        return "General";
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case "Preventive":
                return "bg-green-100 text-green-700 border-green-200";
            case "Restorative":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Surgical":
                return "bg-red-100 text-red-700 border-red-200";
            case "Orthodontics":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "Diagnostic":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    if (!clinic.services || clinic.services.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Services
                </h3>
                <p className="text-gray-500">
                    Service information will appear here when available.
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Section Header */}
            <div className="text-center mb-6 sm:mb-12">
                <div className="inline-flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-5 py-1.5 sm:py-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border border-blue-200/50 shadow-sm mb-3 sm:mb-6">
                    <Stethoscope className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-600" />
                    <span className="text-xs sm:text-sm font-semibold text-blue-700 tracking-wide">
                        Our Services
                    </span>
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mb-3 sm:mb-6">
                    Comprehensive{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        dental care
                    </span>
                </h2>
                <p className="text-sm sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                    {clinic.services.length} services available
                </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {clinic.services.map((service, index) => {
                    const category = getServiceCategory(service.name);
                    const categoryColor = getCategoryColor(category);

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-lg sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden group"
                        >
                            {/* Service Header */}
                            <div className="p-2.5 sm:p-4 pb-2 sm:pb-3">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                    {/* Service Icon */}
                                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-2xl shadow-sm group-hover:shadow-md transition-all duration-300">
                                        {getServiceIcon(service.name)}
                                    </div>

                                    {/* Category Badge */}
                                    <span
                                        className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold border ${categoryColor}`}
                                    >
                                        {category}
                                    </span>
                                </div>

                                {/* Service Name */}
                                <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {service.name}
                                </h3>

                                {/* Service Description */}
                                {service.description && (
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-1.5 sm:mb-3 line-clamp-2">
                                        {service.description}
                                    </p>
                                )}

                                {/* Service Meta */}
                                <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-500 mb-1.5 sm:mb-3">
                                    {service.duration && (
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{service.duration}</span>
                                        </div>
                                    )}

                                    {service.popular && (
                                        <div className="flex items-center gap-1 text-yellow-600">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span>Popular</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Service Footer */}
                            <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4">
                                {/* Price Section */}
                                {service.price && (
                                    <div className="mb-1.5 sm:mb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-right">
                                                <div className="text-base sm:text-xl font-bold text-gray-900">
                                                    ₱
                                                    {service.price.toLocaleString()}
                                                </div>
                                                {service.original_price &&
                                                    service.original_price >
                                                        service.price && (
                                                        <div className="text-xs sm:text-sm text-gray-500 line-through">
                                                            ₱
                                                            {service.original_price.toLocaleString()}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Book Now Button */}
                                <button
                                    onClick={onBookAppointment}
                                    className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Book Now
                                </button>

                                {/* Special Offers */}
                                {service.special_offer && (
                                    <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                                            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600" />
                                            <span className="text-yellow-700 font-medium">
                                                {service.special_offer}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
