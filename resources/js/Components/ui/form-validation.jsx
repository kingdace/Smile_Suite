import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

// Form Field Wrapper Component
export const FormField = ({
    children,
    className = "",
    error = null,
    success = false,
    required = false,
    label = "",
    description = "",
    ...props
}) => {
    return (
        <div className={cn("space-y-2", className)} {...props}>
            {label && (
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}
            <div className="relative">
                {children}
                {error && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                )}
                {success && !error && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                )}
            </div>
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

// Enhanced Input Component
export const ValidatedInput = ({
    type = "text",
    value = "",
    onChange = () => {},
    onBlur = () => {},
    placeholder = "",
    error = null,
    success = false,
    disabled = false,
    required = false,
    className = "",
    validationRules = {},
    showPasswordToggle = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const inputType =
        showPasswordToggle && type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    const handleBlur = (e) => {
        setHasInteracted(true);
        setIsFocused(false);
        onBlur(e);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const getInputClasses = () => {
        const baseClasses =
            "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

        if (error) {
            return cn(
                baseClasses,
                "border-red-300 bg-red-50 text-red-900 placeholder-red-400",
                "focus:border-red-500 focus:ring-red-200",
                className
            );
        }

        if (success) {
            return cn(
                baseClasses,
                "border-green-300 bg-green-50 text-green-900 placeholder-green-400",
                "focus:border-green-500 focus:ring-green-200",
                className
            );
        }

        if (isFocused) {
            return cn(
                baseClasses,
                "border-blue-300 bg-blue-50 text-gray-900 placeholder-gray-500",
                "focus:border-blue-500 focus:ring-blue-200",
                className
            );
        }

        return cn(
            baseClasses,
            "border-gray-300 bg-white text-gray-900 placeholder-gray-500",
            "focus:border-blue-500 focus:ring-blue-200",
            "hover:border-gray-400",
            disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
            className
        );
    };

    return (
        <div className="relative">
            <input
                type={inputType}
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={getInputClasses()}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${props.id}-error` : undefined}
                {...props}
            />
            {showPasswordToggle && type === "password" && (
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                </button>
            )}
        </div>
    );
};

// Enhanced Textarea Component
export const ValidatedTextarea = ({
    value = "",
    onChange = () => {},
    onBlur = () => {},
    placeholder = "",
    error = null,
    success = false,
    disabled = false,
    required = false,
    className = "",
    rows = 3,
    maxLength = null,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur(e);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const getTextareaClasses = () => {
        const baseClasses =
            "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-vertical";

        if (error) {
            return cn(
                baseClasses,
                "border-red-300 bg-red-50 text-red-900 placeholder-red-400",
                "focus:border-red-500 focus:ring-red-200",
                className
            );
        }

        if (success) {
            return cn(
                baseClasses,
                "border-green-300 bg-green-50 text-green-900 placeholder-green-400",
                "focus:border-green-500 focus:ring-green-200",
                className
            );
        }

        if (isFocused) {
            return cn(
                baseClasses,
                "border-blue-300 bg-blue-50 text-gray-900 placeholder-gray-500",
                "focus:border-blue-500 focus:ring-blue-200",
                className
            );
        }

        return cn(
            baseClasses,
            "border-gray-300 bg-white text-gray-900 placeholder-gray-500",
            "focus:border-blue-500 focus:ring-blue-200",
            "hover:border-gray-400",
            disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
            className
        );
    };

    return (
        <div className="relative">
            <textarea
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                maxLength={maxLength}
                className={getTextareaClasses()}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${props.id}-error` : undefined}
                {...props}
            />
            {maxLength && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {value.length}/{maxLength}
                </div>
            )}
        </div>
    );
};

// Enhanced Select Component
export const ValidatedSelect = ({
    value = "",
    onChange = () => {},
    onBlur = () => {},
    options = [],
    placeholder = "Select an option",
    error = null,
    success = false,
    disabled = false,
    required = false,
    className = "",
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur(e);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const getSelectClasses = () => {
        const baseClasses =
            "w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none bg-white";

        if (error) {
            return cn(
                baseClasses,
                "border-red-300 bg-red-50 text-red-900",
                "focus:border-red-500 focus:ring-red-200",
                className
            );
        }

        if (success) {
            return cn(
                baseClasses,
                "border-green-300 bg-green-50 text-green-900",
                "focus:border-green-500 focus:ring-green-200",
                className
            );
        }

        if (isFocused) {
            return cn(
                baseClasses,
                "border-blue-300 bg-blue-50 text-gray-900",
                "focus:border-blue-500 focus:ring-blue-200",
                className
            );
        }

        return cn(
            baseClasses,
            "border-gray-300 text-gray-900",
            "focus:border-blue-500 focus:ring-blue-200",
            "hover:border-gray-400",
            disabled && "bg-gray-100 text-gray-500 cursor-not-allowed",
            className
        );
    };

    return (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={disabled}
                required={required}
                className={getSelectClasses()}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? `${props.id}-error` : undefined}
                {...props}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );
};

// Validation Rules Hook
export const useValidation = (initialValues = {}, rules = {}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(false);

    // Validation rules
    const validationRules = {
        required: (value) =>
            !value || value.trim() === "" ? "This field is required" : null,
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return value && !emailRegex.test(value)
                ? "Please enter a valid email address"
                : null;
        },
        phone: (value) => {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            return value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))
                ? "Please enter a valid phone number"
                : null;
        },
        minLength: (min) => (value) =>
            value && value.length < min
                ? `Must be at least ${min} characters`
                : null,
        maxLength: (max) => (value) =>
            value && value.length > max
                ? `Must be no more than ${max} characters`
                : null,
        pattern: (regex, message) => (value) =>
            value && !regex.test(value) ? message : null,
        custom: (validator) => validator,
    };

    const validateField = (name, value) => {
        const fieldRules = rules[name] || [];
        for (const rule of fieldRules) {
            let error = null;

            if (typeof rule === "string") {
                error = validationRules[rule]?.(value);
            } else if (typeof rule === "function") {
                error = rule(value);
            } else if (rule.type && validationRules[rule.type]) {
                error = validationRules[rule.type](rule.value)(value);
            }

            if (error) return error;
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};
        let formIsValid = true;

        Object.keys(rules).forEach((field) => {
            const error = validateField(field, values[field]);
            if (error) {
                newErrors[field] = error;
                formIsValid = false;
            }
        });

        setErrors(newErrors);
        setIsValid(formIsValid);
        return formIsValid;
    };

    const setValue = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const setTouchedField = (name) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleBlur = (name) => {
        setTouchedField(name);
        const error = validateField(name, values[name]);
        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsValid(false);
    };

    return {
        values,
        errors,
        touched,
        isValid,
        setValue,
        setTouchedField,
        handleBlur,
        validateForm,
        reset,
    };
};

// Error Message Component
export const ErrorMessage = ({ error, className = "", showIcon = true }) => {
    if (!error) return null;

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-sm text-red-600 animate-fade-in",
                className
            )}
        >
            {showIcon && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{error}</span>
        </div>
    );
};

// Success Message Component
export const SuccessMessage = ({
    message,
    className = "",
    showIcon = true,
}) => {
    if (!message) return null;

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-sm text-green-600 animate-fade-in",
                className
            )}
        >
            {showIcon && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{message}</span>
        </div>
    );
};

// Form Status Component
export const FormStatus = ({
    status = "idle", // idle, loading, success, error
    message = "",
    className = "",
}) => {
    const statusConfig = {
        idle: { color: "text-gray-500", icon: null },
        loading: { color: "text-blue-600", icon: "⏳" },
        success: { color: "text-green-600", icon: "✅" },
        error: { color: "text-red-600", icon: "❌" },
    };

    const config = statusConfig[status] || statusConfig.idle;

    if (status === "idle" || !message) return null;

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-sm font-medium animate-fade-in",
                config.color,
                className
            )}
        >
            {config.icon && <span>{config.icon}</span>}
            <span>{message}</span>
        </div>
    );
};

// Form Progress Component
export const FormProgress = ({ current = 0, total = 0, className = "" }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;

    return (
        <div className={cn("w-full", className)}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                    Form Progress
                </span>
                <span className="text-sm text-gray-500">
                    {current} of {total} fields completed
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// Form Field Group Component
export const FormFieldGroup = ({
    children,
    title = "",
    description = "",
    className = "",
    ...props
}) => {
    return (
        <div className={cn("space-y-4", className)} {...props}>
            {(title || description) && (
                <div className="space-y-1">
                    {title && (
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    )}
                    {description && (
                        <p className="text-sm text-gray-600">{description}</p>
                    )}
                </div>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    );
};
