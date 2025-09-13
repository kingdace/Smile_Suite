import { useState, useCallback } from "react";

export function useFormValidation() {
    const [errors, setErrors] = useState({});
    const [isValidating, setIsValidating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitProgress, setSubmitProgress] = useState(0);

    // Email validation
    const validateEmail = useCallback((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, []);

    // Philippine phone number validation - FIXED FOR PHILIPPINE NUMBERS
    const validatePhone = useCallback((phone) => {
        if (!phone) return true; // Allow empty phone numbers

        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, "");

        // Philippine mobile numbers: 09XX-XXX-XXXX (11 digits starting with 09)
        // Philippine landline: 02-XXXX-XXXX or 0XX-XXX-XXXX (10-11 digits)
        const philippineMobileRegex = /^09\d{9}$/; // 11 digits starting with 09
        const philippineLandlineRegex = /^0[2-9]\d{7,8}$/; // 10-11 digits starting with 02-09

        return (
            philippineMobileRegex.test(cleanPhone) ||
            philippineLandlineRegex.test(cleanPhone)
        );
    }, []);

    // Required field validation
    const validateRequired = useCallback((value, fieldName) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            return `${fieldName} is required`;
        }
        return null;
    }, []);

    // Length validation
    const validateLength = useCallback((value, min, max, fieldName) => {
        if (value && (value.length < min || value.length > max)) {
            return `${fieldName} must be between ${min} and ${max} characters`;
        }
        return null;
    }, []);

    // Number validation
    const validateNumber = useCallback((value, fieldName) => {
        if (value && isNaN(value)) {
            return `${fieldName} must be a valid number`;
        }
        return null;
    }, []);

    // Coordinate validation
    const validateCoordinate = useCallback((value, fieldName) => {
        if (value) {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                return `${fieldName} must be a valid number`;
            }

            // Check latitude range (-90 to 90)
            if (fieldName.toLowerCase().includes("latitude")) {
                if (numValue < -90 || numValue > 90) {
                    return `${fieldName} must be between -90 and 90`;
                }
            }
            // Check longitude range (-180 to 180)
            else if (fieldName.toLowerCase().includes("longitude")) {
                if (numValue < -180 || numValue > 180) {
                    return `${fieldName} must be between -180 and 180`;
                }
            }
        }
        return null;
    }, []);

    // Clinic form validation
    const validateClinicForm = useCallback(
        (data) => {
            setIsValidating(true);
            const newErrors = {};

            // Clinic name validation
            const nameError = validateRequired(data.clinic_name, "Clinic name");
            if (nameError) {
                newErrors.clinic_name = nameError;
            }

            // Email validation
            if (data.clinic_email && !validateEmail(data.clinic_email)) {
                newErrors.clinic_email = "Please enter a valid email address";
            }

            // Phone validation - FIXED FOR PHILIPPINE NUMBERS
            if (data.contact_number && !validatePhone(data.contact_number)) {
                newErrors.contact_number =
                    "Please enter a valid Philippine phone number (e.g., 09XX-XXX-XXXX)";
            }

            // Address validation (if address field exists)
            if (data.address) {
                const addressError = validateRequired(data.address, "Address");
                if (addressError) newErrors.address = addressError;
            }

            // Description validation
            if (data.description && data.description.length > 500) {
                newErrors.description =
                    "Description must be less than 500 characters";
            }

            // Website validation
            if (data.website) {
                try {
                    new URL(data.website);
                } catch {
                    newErrors.website = "Please enter a valid website URL";
                }
            }

            // Coordinates validation - only validate if values are provided and not empty
            if (
                data.latitude &&
                data.latitude.trim() !== "" &&
                !validateCoordinate(data.latitude, "Latitude")
            ) {
                newErrors.latitude = "Please enter a valid latitude";
            }
            if (
                data.longitude &&
                data.longitude.trim() !== "" &&
                !validateCoordinate(data.longitude, "Longitude")
            ) {
                newErrors.longitude = "Please enter a valid longitude";
            }

            setErrors(newErrors);
            setIsValidating(false);
            return Object.keys(newErrors).length === 0;
        },
        [validateRequired, validateEmail, validatePhone, validateCoordinate]
    );

    // Clinic Settings form validation (only clinic info fields)
    const validateClinicSettingsForm = useCallback(
        (data) => {
            setIsValidating(true);
            const newErrors = {};

            // Clinic name validation
            const nameError = validateRequired(data.clinic_name, "Clinic name");
            if (nameError) {
                newErrors.clinic_name = nameError;
            }

            // Email validation
            if (data.clinic_email && !validateEmail(data.clinic_email)) {
                newErrors.clinic_email = "Please enter a valid email address";
            }

            // Phone validation - FIXED FOR PHILIPPINE NUMBERS
            if (data.contact_number && !validatePhone(data.contact_number)) {
                newErrors.contact_number =
                    "Please enter a valid Philippine phone number (e.g., 09XX-XXX-XXXX)";
            }

            // Description validation
            if (data.description && data.description.length > 500) {
                newErrors.description =
                    "Description must be less than 500 characters";
            }

            setErrors(newErrors);
            setIsValidating(false);
            return Object.keys(newErrors).length === 0;
        },
        [validateRequired, validateEmail, validatePhone]
    );

    // Location form validation (only latitude/longitude fields)
    const validateLocationForm = useCallback(
        (data) => {
            setIsValidating(true);
            const newErrors = {};

            // Coordinates validation - only validate if values are provided and not empty
            if (data.latitude && data.latitude.trim() !== "") {
                const latError = validateCoordinate(data.latitude, "Latitude");
                if (latError) {
                    newErrors.latitude = latError;
                }
            }
            if (data.longitude && data.longitude.trim() !== "") {
                const lngError = validateCoordinate(
                    data.longitude,
                    "Longitude"
                );
                if (lngError) {
                    newErrors.longitude = lngError;
                }
            }

            setErrors(newErrors);
            setIsValidating(false);
            return Object.keys(newErrors).length === 0;
        },
        [validateCoordinate]
    );

    // User form validation
    const validateUserForm = useCallback(
        (data) => {
            setIsValidating(true);
            const newErrors = {};

            // Name validation
            const nameError = validateRequired(data.name, "Name");
            if (nameError) newErrors.name = nameError;

            // Email validation
            if (data.email && !validateEmail(data.email)) {
                newErrors.email = "Please enter a valid email address";
            }

            // Phone validation - FIXED FOR PHILIPPINE NUMBERS
            if (data.phone && !validatePhone(data.phone)) {
                newErrors.phone =
                    "Please enter a valid Philippine phone number (e.g., 09XX-XXX-XXXX)";
            }

            // Password validation (only if password is provided)
            if (data.password) {
                if (data.password.length < 8) {
                    newErrors.password =
                        "Password must be at least 8 characters";
                }
                if (data.password !== data.password_confirmation) {
                    newErrors.password_confirmation = "Passwords do not match";
                }
            }

            setErrors(newErrors);
            setIsValidating(false);
            return Object.keys(newErrors).length === 0;
        },
        [validateRequired, validateEmail, validatePhone]
    );

    // Clear all errors
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    // Set specific error
    const setError = useCallback((field, message) => {
        setErrors((prev) => ({
            ...prev,
            [field]: message,
        }));
    }, []);

    // Clear specific error
    const clearError = useCallback((field) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    // Submit with progress tracking
    const submitWithProgress = useCallback(async (submitFunction) => {
        setIsSubmitting(true);
        setSubmitProgress(0);

        try {
            // Simulate progress steps
            setSubmitProgress(25);
            await new Promise((resolve) => setTimeout(resolve, 100));

            setSubmitProgress(50);
            await new Promise((resolve) => setTimeout(resolve, 100));

            setSubmitProgress(75);
            const result = await submitFunction();

            setSubmitProgress(100);
            await new Promise((resolve) => setTimeout(resolve, 200));

            return result;
        } finally {
            setIsSubmitting(false);
            setSubmitProgress(0);
        }
    }, []);

    return {
        errors,
        isValidating,
        isSubmitting,
        submitProgress,
        validateClinicForm,
        validateClinicSettingsForm,
        validateLocationForm,
        validateUserForm,
        validateEmail,
        validatePhone,
        validateRequired,
        validateLength,
        validateNumber,
        validateCoordinate,
        clearErrors,
        setError,
        clearError,
        submitWithProgress,
    };
}
