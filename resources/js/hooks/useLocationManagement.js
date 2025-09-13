import { useState, useCallback } from "react";

export function useLocationManagement(
    initialLatitude = "",
    initialLongitude = ""
) {
    const [latitude, setLatitude] = useState(initialLatitude);
    const [longitude, setLongitude] = useState(initialLongitude);
    const [isMapLoading, setIsMapLoading] = useState(false);

    // Update coordinates
    const updateCoordinates = useCallback((lat, lng) => {
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
    }, []);

    // Set coordinates from map click
    const handleMapClick = useCallback(
        (latlng) => {
            updateCoordinates(latlng.lat, latlng.lng);
        },
        [updateCoordinates]
    );

    // Validate coordinates
    const validateCoordinates = useCallback(() => {
        const errors = {};

        if (latitude) {
            const lat = parseFloat(latitude);
            if (isNaN(lat) || lat < -90 || lat > 90) {
                errors.latitude = "Latitude must be between -90 and 90";
            }
        }

        if (longitude) {
            const lng = parseFloat(longitude);
            if (isNaN(lng) || lng < -180 || lng > 180) {
                errors.longitude = "Longitude must be between -180 and 180";
            }
        }

        return errors;
    }, [latitude, longitude]);

    // Get map center coordinates
    const getMapCenter = useCallback(() => {
        const lat = parseFloat(latitude) || 13.41; // Default to Philippines
        const lng = parseFloat(longitude) || 122.56;
        return [lat, lng];
    }, [latitude, longitude]);

    // Check if coordinates are valid
    const hasValidCoordinates = useCallback(() => {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        return (
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
        );
    }, [latitude, longitude]);

    // Reset coordinates
    const resetCoordinates = useCallback(() => {
        setLatitude(initialLatitude);
        setLongitude(initialLongitude);
    }, [initialLatitude, initialLongitude]);

    // Get coordinates for form submission
    const getCoordinatesForSubmission = useCallback(() => {
        return {
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
        };
    }, [latitude, longitude]);

    return {
        // State
        latitude,
        longitude,
        isMapLoading,

        // Actions
        setLatitude,
        setLongitude,
        updateCoordinates,
        handleMapClick,
        validateCoordinates,
        getMapCenter,
        hasValidCoordinates,
        resetCoordinates,
        getCoordinatesForSubmission,
        setIsMapLoading,
    };
}

