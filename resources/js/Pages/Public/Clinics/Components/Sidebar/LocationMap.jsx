import React, { useState, useEffect } from "react";
import { MapPin, Copy, Navigation, ExternalLink } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getAvatarColor } from "../Shared/utils";

export default function LocationMap({ clinic }) {
    const [userLocation, setUserLocation] = useState(null);
    const [showUserLocation, setShowUserLocation] = useState(false);

    // Default coordinates (Manila, Philippines)
    const defaultLat = 14.5995;
    const defaultLng = 120.9842;

    // Use clinic coordinates if available, otherwise use defaults
    const clinicLat = clinic.latitude
        ? parseFloat(clinic.latitude)
        : defaultLat;
    const clinicLng = clinic.longitude
        ? parseFloat(clinic.longitude)
        : defaultLng;

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(clinic.address);
            // You could add a toast notification here
        } catch (err) {
            console.error("Failed to copy address:", err);
        }
    };

    const handleGetDirections = () => {
        const encodedAddress = encodeURIComponent(clinic.address);
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
            "_blank"
        );
    };

    const handleShowMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setShowUserLocation(true);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // You could add a toast notification here
                }
            );
        }
    };

    if (!clinic.address && !clinic.latitude && !clinic.longitude) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Location & Map
                </h3>
                <p className="text-gray-500">
                    Location information will appear here when available.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    Location & Map
                </h3>
            </div>

            <div className="p-3 sm:p-5">
                {/* Address Display */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                                Clinic Address
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                                {clinic.address}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                            onClick={handleCopyAddress}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-50 text-blue-700 font-medium rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 text-xs sm:text-sm"
                        >
                            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Copy Address
                        </button>
                        <button
                            onClick={handleGetDirections}
                            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-green-50 text-green-700 font-medium rounded-lg sm:rounded-xl hover:bg-green-100 transition-colors border border-green-200 text-xs sm:text-sm"
                        >
                            <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Get Directions
                        </button>
                    </div>
                </div>

                {/* Interactive Map */}
                <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                            Interactive Map
                        </h4>
                        <button
                            onClick={handleShowMyLocation}
                            className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                showUserLocation
                                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <Navigation className="w-3 h-3" />
                            {showUserLocation
                                ? "Location Shown"
                                : "Show My Location"}
                        </button>
                    </div>

                    <div className="w-full h-48 sm:h-64 rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden bg-gray-100">
                        <MapContainer
                            center={[clinicLat, clinicLng]}
                            zoom={15}
                            style={{ height: "100%", width: "100%" }}
                            className="rounded-xl"
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* Clinic Marker */}
                            <Marker
                                position={[clinicLat, clinicLng]}
                                icon={
                                    new L.Icon({
                                        iconUrl:
                                            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                                        iconSize: [25, 41],
                                        iconAnchor: [12, 41],
                                        popupAnchor: [1, -34],
                                        shadowUrl:
                                            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                                        shadowSize: [41, 41],
                                    })
                                }
                            />

                            {/* User Location Marker */}
                            {userLocation && showUserLocation && (
                                <Marker
                                    position={[
                                        userLocation.lat,
                                        userLocation.lng,
                                    ]}
                                    icon={L.divIcon({
                                        className: "user-location-marker",
                                        html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>',
                                        iconSize: [16, 16],
                                    })}
                                />
                            )}
                        </MapContainer>
                    </div>
                </div>

                {/* Additional Location Info */}
                <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>Map shows approximate location</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-gray-400" />
                        <span>
                            For exact directions, use the Directions button
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <span>Click map to interact and zoom</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleShowMyLocation}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                        >
                            {showUserLocation
                                ? "Hide My Location"
                                : "Show My Location"}
                        </button>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                clinic.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors flex items-center gap-1"
                        >
                            Open in Google Maps
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
