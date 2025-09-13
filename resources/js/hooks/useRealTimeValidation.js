import { useState, useCallback, useEffect, useRef } from "react";
import { useFormValidation } from "./useFormValidation";

export function useRealTimeValidation() {
    const {
        validateEmail,
        validatePhone,
        validateRequired,
        validateLength,
        validateNumber,
        validateCoordinate,
        errors: validationErrors,
        setError,
        clearError,
    } = useFormValidation();

    const [fieldErrors, setFieldErrors] = useState({});
    const [fieldStates, setFieldStates] = useState({}); // 'idle', 'validating', 'valid', 'invalid'
    const [debounceTimers, setDebounceTimers] = useState({});

    // Debounced validation function
    const debouncedValidate = useCallback(
        (fieldName, value, validator, delay = 500) => {
            // Clear existing timer
            if (debounceTimers[fieldName]) {
                clearTimeout(debounceTimers[fieldName]);
            }

            // Set field to validating state
            setFieldStates((prev) => ({
                ...prev,
                [fieldName]: "validating",
            }));

            // Set new timer
            const timer = setTimeout(() => {
                const error = validator(value, fieldName);

                setFieldStates((prev) => ({
                    ...prev,
                    [fieldName]: error ? "invalid" : "valid",
                }));

                setFieldErrors((prev) => ({
                    ...prev,
                    [fieldName]: error,
                }));

                if (error) {
                    setError(fieldName, error);
                } else {
                    clearError(fieldName);
                }
            }, delay);

            setDebounceTimers((prev) => ({
                ...prev,
                [fieldName]: timer,
            }));
        },
        [debounceTimers, setError, clearError]
    );

    // Field-specific validators
    const validators = {
        clinic_name: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return `${fieldName} is required`;
            }
            if (value.length < 2) {
                return `${fieldName} must be at least 2 characters`;
            }
            if (value.length > 100) {
                return `${fieldName} must be less than 100 characters`;
            }
            return null;
        },

        name: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return `${fieldName} is required`;
            }
            if (value.length < 2) {
                return `${fieldName} must be at least 2 characters`;
            }
            if (value.length > 100) {
                return `${fieldName} must be less than 100 characters`;
            }
            return null;
        },

        email: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Email is optional
            }
            if (!validateEmail(value)) {
                return "Please enter a valid email address";
            }
            return null;
        },

        clinic_email: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Email is optional
            }
            if (!validateEmail(value)) {
                return "Please enter a valid email address";
            }
            return null;
        },

        phone: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Phone is optional
            }
            if (!validatePhone(value)) {
                return "Please enter a valid Philippine phone number (e.g., 09XX-XXX-XXXX)";
            }
            return null;
        },

        contact_number: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Phone is optional
            }
            if (!validatePhone(value)) {
                return "Please enter a valid Philippine phone number (e.g., 09XX-XXX-XXXX)";
            }
            return null;
        },

        address: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return `${fieldName} is required`;
            }
            if (value.length < 10) {
                return `${fieldName} must be at least 10 characters`;
            }
            return null;
        },

        license_number: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // License number is optional
            }
            if (value.length < 3) {
                return `${fieldName} must be at least 3 characters`;
            }
            return null;
        },

        description: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Description is optional
            }
            if (value.length > 500) {
                return `${fieldName} must be less than 500 characters`;
            }
            return null;
        },

        website: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Website is optional
            }
            try {
                new URL(value);
                return null;
            } catch {
                return "Please enter a valid website URL (e.g., https://example.com)";
            }
        },

        latitude: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Latitude is optional
            }
            const num = parseFloat(value);
            if (isNaN(num)) {
                return "Latitude must be a valid number";
            }
            if (num < -90 || num > 90) {
                return "Latitude must be between -90 and 90";
            }
            return null;
        },

        longitude: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Longitude is optional
            }
            const num = parseFloat(value);
            if (isNaN(num)) {
                return "Longitude must be a valid number";
            }
            if (num < -180 || num > 180) {
                return "Longitude must be between -180 and 180";
            }
            return null;
        },

        password: (value, fieldName) => {
            if (!value || value.trim() === "") {
                return null; // Password is optional for updates
            }
            if (value.length < 8) {
                return "Password must be at least 8 characters";
            }
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
            }
            return null;
        },

        password_confirmation: (value, fieldName, allValues) => {
            if (!value || value.trim() === "") {
                return null; // Password confirmation is optional if password is empty
            }
            if (allValues.password && value !== allValues.password) {
                return "Passwords do not match";
            }
            return null;
        },
    };

    // Validate field in real-time
    const validateField = useCallback(
        (fieldName, value, allValues = {}) => {
            const validator = validators[fieldName];
            if (!validator) return;

            // Special handling for password confirmation
            if (fieldName === "password_confirmation") {
                debouncedValidate(fieldName, value, (val) =>
                    validator(val, fieldName, allValues)
                );
            } else {
                debouncedValidate(fieldName, value, (val) =>
                    validator(val, fieldName)
                );
            }
        },
        [debouncedValidate, validators]
    );

    // Clear field validation
    const clearFieldValidation = useCallback(
        (fieldName) => {
            setFieldStates((prev) => ({
                ...prev,
                [fieldName]: "idle",
            }));
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
            clearError(fieldName);
        },
        [clearError]
    );

    // Get field state
    const getFieldState = useCallback(
        (fieldName) => {
            return fieldStates[fieldName] || "idle";
        },
        [fieldStates]
    );

    // Get field error
    const getFieldError = useCallback(
        (fieldName) => {
            return (
                fieldErrors[fieldName] || validationErrors[fieldName] || null
            );
        },
        [fieldErrors, validationErrors]
    );

    // Check if field is valid
    const isFieldValid = useCallback(
        (fieldName) => {
            return (
                getFieldState(fieldName) === "valid" &&
                !getFieldError(fieldName)
            );
        },
        [getFieldState, getFieldError]
    );

    // Check if field is invalid
    const isFieldInvalid = useCallback(
        (fieldName) => {
            return (
                getFieldState(fieldName) === "invalid" ||
                !!getFieldError(fieldName)
            );
        },
        [getFieldState, getFieldError]
    );

    // Check if field is validating
    const isFieldValidating = useCallback(
        (fieldName) => {
            return getFieldState(fieldName) === "validating";
        },
        [getFieldState]
    );

    // Clear all validations
    const clearAllValidations = useCallback(() => {
        setFieldStates({});
        setFieldErrors({});
        // Clear all debounce timers
        Object.values(debounceTimers).forEach((timer) => clearTimeout(timer));
        setDebounceTimers({});
    }, [debounceTimers]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Object.values(debounceTimers).forEach((timer) =>
                clearTimeout(timer)
            );
        };
    }, [debounceTimers]);

    return {
        validateField,
        clearFieldValidation,
        clearAllValidations,
        getFieldState,
        getFieldError,
        isFieldValid,
        isFieldInvalid,
        isFieldValidating,
        fieldErrors,
        fieldStates,
    };
}
