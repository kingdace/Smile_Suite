import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Toast({
    message,
    type = "success",
    isVisible,
    onClose,
}) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
    const borderColor =
        type === "success" ? "border-green-200" : "border-red-200";
    const textColor = type === "success" ? "text-green-800" : "text-red-800";
    const iconColor = type === "success" ? "text-green-500" : "text-red-500";
    const Icon = type === "success" ? CheckCircle : XCircle;

    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
            <div
                className={`max-w-sm w-full ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4`}
            >
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${textColor}`}>
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className={`inline-flex ${textColor} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
