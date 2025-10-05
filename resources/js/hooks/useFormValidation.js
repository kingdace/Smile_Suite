import { useState, useCallback } from "react";

// Common validation patterns
export const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    strongPassword:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    numeric: /^\d+$/,
    decimal: /^\d*\.?\d+$/,
    url: /^https?:\/\/.+/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    time: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    postalCode: /^\d{5}(-\d{4})?$/,
    ssn: /^\d{3}-\d{2}-\d{4}$/,
};

// Common validation messages
export const validationMessages = {
    required: "This field is required",
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number",
    password:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    strongPassword:
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character",
    minLength: (min) => `Must be at least ${min} characters long`,
    maxLength: (max) => `Must be no more than ${max} characters long`,
    min: (min) => `Must be at least ${min}`,
    max: (max) => `Must be no more than ${max}`,
    pattern: "Please enter a valid format",
    match: "Values do not match",
    unique: "This value is already taken",
    futureDate: "Please select a future date",
    pastDate: "Please select a past date",
    age: (min) => `Must be at least ${min} years old`,
};

// Validation functions
export const validators = {
    required: (value) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
            return validationMessages.required;
        }
        return null;
    },

    email: (value) => {
        if (value && !validationPatterns.email.test(value)) {
            return validationMessages.email;
        }
        return null;
    },

    phone: (value) => {
        if (
            value &&
            !validationPatterns.phone.test(value.replace(/[\s\-\(\)]/g, ""))
        ) {
            return validationMessages.phone;
        }
        return null;
    },

    password: (value) => {
        if (value && !validationPatterns.password.test(value)) {
            return validationMessages.password;
        }
        return null;
    },

    strongPassword: (value) => {
        if (value && !validationPatterns.strongPassword.test(value)) {
            return validationMessages.strongPassword;
        }
        return null;
    },

    minLength: (min) => (value) => {
        if (value && value.length < min) {
            return validationMessages.minLength(min);
        }
        return null;
    },

    maxLength: (max) => (value) => {
        if (value && value.length > max) {
            return validationMessages.maxLength(max);
        }
        return null;
    },

    min: (min) => (value) => {
        const numValue = Number(value);
        if (value && !isNaN(numValue) && numValue < min) {
            return validationMessages.min(min);
        }
        return null;
    },

    max: (max) => (value) => {
        const numValue = Number(value);
        if (value && !isNaN(numValue) && numValue > max) {
            return validationMessages.max(max);
        }
        return null;
    },

    pattern:
        (regex, message = validationMessages.pattern) =>
        (value) => {
            if (value && !regex.test(value)) {
                return message;
            }
            return null;
        },

    match:
        (matchValue, message = validationMessages.match) =>
        (value) => {
            if (value && value !== matchValue) {
                return message;
            }
            return null;
        },

    futureDate: (value) => {
        if (value) {
            const date = new Date(value);
            const now = new Date();
            if (date <= now) {
                return validationMessages.futureDate;
            }
        }
        return null;
    },

    pastDate: (value) => {
        if (value) {
            const date = new Date(value);
            const now = new Date();
            if (date >= now) {
                return validationMessages.pastDate;
            }
        }
        return null;
    },

    age: (minAge) => (value) => {
        if (value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            if (age < minAge) {
                return validationMessages.age(minAge);
            }
        }
        return null;
    },

    custom: (validator) => validator,
};

// Main form validation hook
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);

    // Validate a single field
    const validateField = useCallback(
        (fieldName, value) => {
            const fieldRules = validationRules[fieldName] || [];

            for (const rule of fieldRules) {
                let error = null;

                if (typeof rule === "string" && validators[rule]) {
                    error = validators[rule](value);
                } else if (typeof rule === "function") {
                    error = rule(value);
                } else if (rule && typeof rule === "object") {
                    if (rule.type && validators[rule.type]) {
                        const validator = validators[rule.type];
                        error =
                            typeof validator === "function"
                                ? validator(rule.value)(value)
                                : validator(value);
                    }
                }

                if (error) {
                    return error;
                }
            }

            return null;
        },
        [validationRules]
    );

    // Validate all fields
    const validateForm = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach((fieldName) => {
            const error = validateField(fieldName, values[fieldName]);
            if (error) {
                newErrors[fieldName] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [values, validationRules, validateField]);

    // Set field value
    const setValue = useCallback(
        (fieldName, value) => {
            setValues((prev) => ({ ...prev, [fieldName]: value }));

            // Clear error when user starts typing
            if (errors[fieldName]) {
                setErrors((prev) => ({ ...prev, [fieldName]: null }));
            }
        },
        [errors]
    );

    // Set multiple field values
    const setMultipleValues = useCallback((newValues) => {
        setValues((prev) => ({ ...prev, ...newValues }));
    }, [setValues]);

    // Handle field blur
    const handleBlur = useCallback(
        (fieldName) => {
            setTouched((prev) => ({ ...prev, [fieldName]: true }));

            const error = validateField(fieldName, values[fieldName]);
            if (error) {
                setErrors((prev) => ({ ...prev, [fieldName]: error }));
            }
        },
        [values, validateField]
    );

    // Handle field change
    const handleChange = useCallback(
        (fieldName, value) => {
            setValue(fieldName, value);
        },
        [setValue]
    );

    // Reset form
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
        setSubmitCount(0);
    }, [initialValues]);

    // Submit form
    const handleSubmit = useCallback(
        async (onSubmit) => {
            setIsSubmitting(true);
            setSubmitCount((prev) => prev + 1);

            // Mark all fields as touched
            const allTouched = Object.keys(validationRules).reduce(
                (acc, field) => {
                    acc[field] = true;
                    return acc;
                },
                {}
            );
            setTouched(allTouched);

            const isValid = validateForm();

            if (isValid && onSubmit) {
                try {
                    await onSubmit(values);
                } catch (error) {
                    console.error("Form submission error:", error);
                }
            }

            setIsSubmitting(false);
            return isValid;
        },
        [values, validateForm, validationRules]
    );

    // Get field props for form components
    const getFieldProps = useCallback(
        (fieldName) => {
            return {
                value: values[fieldName] || "",
                onChange: (e) => handleChange(fieldName, e.target.value),
                onBlur: () => handleBlur(fieldName),
                error: touched[fieldName] ? errors[fieldName] : null,
                touched: touched[fieldName] || false,
            };
        },
        [values, errors, touched, handleChange, handleBlur]
    );

    // Check if form is valid
    const isValid =
        Object.keys(errors).length === 0 &&
        Object.keys(validationRules).every(
            (field) => values[field] && values[field].toString().trim() !== ""
        );

    // Get form statistics
    const formStats = {
        totalFields: Object.keys(validationRules).length,
        completedFields: Object.keys(validationRules).filter(
            (field) => values[field] && values[field].toString().trim() !== ""
        ).length,
        errorFields: Object.keys(errors).length,
        touchedFields: Object.keys(touched).length,
        completionPercentage: Math.round(
            (Object.keys(validationRules).filter(
                (field) =>
                    values[field] && values[field].toString().trim() !== ""
            ).length /
                Object.keys(validationRules).length) *
                100
        ),
    };

    return {
        // Values
        values,
        errors,
        touched,
        isSubmitting,
        submitCount,
        isValid,

        // Actions
        setValue,
        setMultipleValues,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        validateForm,
        validateField,

        // Helpers
        getFieldProps,
        formStats,
    };
};

// Specific form validation hooks
export const usePatientFormValidation = (initialValues = {}) => {
    const validationRules = {
        firstName: ["required", validators.minLength(2)],
        lastName: ["required", validators.minLength(2)],
        email: ["required", "email"],
        phone: ["required", "phone"],
        dateOfBirth: ["required", validators.age(0)],
        address: ["required", validators.minLength(10)],
        city: ["required", validators.minLength(2)],
        state: ["required"],
        zipCode: [
            "required",
            validators.pattern(validationPatterns.postalCode),
        ],
        emergencyContactName: ["required", validators.minLength(2)],
        emergencyContactPhone: ["required", "phone"],
        medicalHistory: [validators.maxLength(1000)],
        allergies: [validators.maxLength(500)],
        medications: [validators.maxLength(500)],
    };

    return useFormValidation(initialValues, validationRules);
};

export const useAppointmentFormValidation = (initialValues = {}) => {
    const validationRules = {
        clinicId: ["required"],
        serviceId: ["required"],
        appointmentDate: ["required", "futureDate"],
        appointmentTime: ["required"],
        reason: ["required", validators.minLength(10)],
        notes: [validators.maxLength(500)],
        preferredDentist: [],
    };

    return useFormValidation(initialValues, validationRules);
};

export const useLoginFormValidation = (initialValues = {}) => {
    const validationRules = {
        email: ["required", "email"],
        password: ["required", validators.minLength(6)],
        remember: [],
    };

    return useFormValidation(initialValues, validationRules);
};

export const useRegistrationFormValidation = (initialValues = {}) => {
    const validationRules = {
        firstName: ["required", validators.minLength(2)],
        lastName: ["required", validators.minLength(2)],
        email: ["required", "email"],
        password: ["required", "strongPassword"],
        confirmPassword: ["required", validators.match(initialValues.password)],
        phone: ["required", "phone"],
        dateOfBirth: ["required", validators.age(13)],
        terms: ["required"],
    };

    return useFormValidation(initialValues, validationRules);
};
