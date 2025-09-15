import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Eye, EyeOff } from "lucide-react";

export function ValidatedInput({
    name,
    type = "text",
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    isValid,
    isInvalid,
    isValidating,
    required = false,
    disabled = false,
    className = "",
    inputClassName = "",
    showPasswordToggle = false,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType =
        showPasswordToggle && type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    const getInputClasses = () => {
        let classes = `block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${inputClassName}`;

        if (disabled) {
            classes += " bg-gray-50 text-gray-500 cursor-not-allowed";
        } else if (isInvalid) {
            classes +=
                " border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50";
        } else if (isValid) {
            classes +=
                " border-green-300 focus:border-green-500 focus:ring-green-500 bg-green-50";
        } else if (isFocused) {
            classes +=
                " border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50";
        } else {
            classes +=
                " border-gray-300 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-400";
        }

        return classes;
    };

    const getIconClasses = () => {
        if (isValidating) return "text-blue-500";
        if (isInvalid) return "text-red-500";
        if (isValid) return "text-green-500";
        return "text-gray-400";
    };

    const renderIcon = () => {
        if (isValidating) {
            return <Loader2 className="h-5 w-5 animate-spin" />;
        }
        if (isInvalid) {
            return <XCircle className="h-5 w-5" />;
        }
        if (isValid) {
            return <CheckCircle className="h-5 w-5" />;
        }
        return null;
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-800"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={getInputClasses()}
                    {...props}
                />

                {/* Validation Icon */}
                {(isValidating || isInvalid || isValid) && (
                    <div
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center ${getIconClasses()}`}
                    >
                        {renderIcon()}
                    </div>
                )}

                {/* Password Toggle */}
                {showPasswordToggle && type === "password" && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-10 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                        ) : (
                            <Eye className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {error}
                </p>
            )}

            {/* Success Message */}
            {isValid && !error && (
                <p className="text-sm text-green-600 flex items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    Looks good!
                </p>
            )}
        </div>
    );
}

export function ValidatedTextarea({
    name,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    isValid,
    isInvalid,
    isValidating,
    required = false,
    disabled = false,
    rows = 3,
    className = "",
    inputClassName = "",
    ...props
}) {
    const [isFocused, setIsFocused] = useState(false);

    const getTextareaClasses = () => {
        let classes = `block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 resize-vertical ${inputClassName}`;

        if (disabled) {
            classes += " bg-gray-50 text-gray-500 cursor-not-allowed";
        } else if (isInvalid) {
            classes +=
                " border-red-300 focus:border-red-500 focus:ring-red-500";
        } else if (isValid) {
            classes +=
                " border-green-300 focus:border-green-500 focus:ring-green-500";
        } else if (isFocused) {
            classes +=
                " border-blue-300 focus:border-blue-500 focus:ring-blue-500";
        } else {
            classes +=
                " border-gray-300 focus:border-blue-500 focus:ring-blue-500";
        }

        return classes;
    };

    const getIconClasses = () => {
        if (isValidating) return "text-blue-500";
        if (isInvalid) return "text-red-500";
        if (isValid) return "text-green-500";
        return "text-gray-400";
    };

    const renderIcon = () => {
        if (isValidating) {
            return <Loader2 className="h-5 w-5 animate-spin" />;
        }
        if (isInvalid) {
            return <XCircle className="h-5 w-5" />;
        }
        if (isValid) {
            return <CheckCircle className="h-5 w-5" />;
        }
        return null;
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-semibold text-gray-800"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    onFocus={() => setIsFocused(true)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    className={getTextareaClasses()}
                    {...props}
                />

                {/* Validation Icon */}
                {(isValidating || isInvalid || isValid) && (
                    <div
                        className={`absolute top-3 right-3 ${getIconClasses()}`}
                    >
                        {renderIcon()}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    {error}
                </p>
            )}

            {/* Success Message */}
            {isValid && !error && (
                <p className="text-sm text-green-600 flex items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    Looks good!
                </p>
            )}
        </div>
    );
}
