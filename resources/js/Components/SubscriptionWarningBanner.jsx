import React, { useState } from "react";
import {
    AlertTriangle,
    Clock,
    Calendar,
    CreditCard,
    AlertCircle,
    ExternalLink,
    Mail,
    Phone,
    X,
} from "lucide-react";
import SubscriptionRequestDialog from "@/Components/SubscriptionRequestDialog";

export default function SubscriptionWarningBanner({ clinic, className = "" }) {
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState(null);

    if (!clinic) return null;

    const getStatusInfo = () => {
        const status = clinic.subscription_status;
        const now = new Date();

        switch (status) {
            case "trial":
                if (clinic.trial_ends_at) {
                    const trialEnd = new Date(clinic.trial_ends_at);
                    const timeLeft = trialEnd - now;
                    const daysLeft = Math.floor(
                        timeLeft / (1000 * 60 * 60 * 24)
                    );
                    const hoursLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutesLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    // Show warning if less than 3 days or less than 1 hour
                    if (
                        (daysLeft <= 3 && daysLeft > 0) ||
                        (daysLeft === 0 && hoursLeft <= 1)
                    ) {
                        let timeMessage = "";
                        if (daysLeft > 0) {
                            timeMessage = `${daysLeft} day${
                                daysLeft > 1 ? "s" : ""
                            }`;
                            if (hoursLeft > 0) {
                                timeMessage += ` and ${hoursLeft} hour${
                                    hoursLeft > 1 ? "s" : ""
                                }`;
                            }
                        } else if (hoursLeft > 0) {
                            timeMessage = `${hoursLeft} hour${
                                hoursLeft > 1 ? "s" : ""
                            }`;
                            if (minutesLeft > 0) {
                                timeMessage += ` and ${minutesLeft} minute${
                                    minutesLeft > 1 ? "s" : ""
                                }`;
                            }
                        } else {
                            timeMessage = `${minutesLeft} minute${
                                minutesLeft > 1 ? "s" : ""
                            }`;
                        }

                        return {
                            type: "warning",
                            icon: <Clock className="w-5 h-5" />,
                            title: "Trial Ending Soon",
                            message: `Your free trial ends in ${timeMessage}. Upgrade to continue using all features.`,
                            action: "Upgrade Now",
                            actionType: "upgrade",
                        };
                    } else if (timeLeft <= 0) {
                        return {
                            type: "danger",
                            icon: <AlertTriangle className="w-5 h-5" />,
                            title: "Trial Expired",
                            message:
                                "Your free trial has expired. Please upgrade to continue using the system.",
                            action: "Upgrade Now",
                            actionType: "upgrade",
                        };
                    }
                }
                return null;

            case "grace_period":
                if (clinic.subscription_end_date) {
                    const endDate = new Date(clinic.subscription_end_date);
                    const timeLeft = endDate - now;
                    const daysLeft = Math.floor(
                        timeLeft / (1000 * 60 * 60 * 24)
                    );
                    const hoursLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutesLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    let timeMessage = "";
                    if (Math.abs(daysLeft) > 0) {
                        timeMessage = `${Math.abs(daysLeft)} day${
                            Math.abs(daysLeft) > 1 ? "s" : ""
                        }`;
                        if (Math.abs(hoursLeft) > 0) {
                            timeMessage += ` and ${Math.abs(hoursLeft)} hour${
                                Math.abs(hoursLeft) > 1 ? "s" : ""
                            }`;
                        }
                    } else if (Math.abs(hoursLeft) > 0) {
                        timeMessage = `${Math.abs(hoursLeft)} hour${
                            Math.abs(hoursLeft) > 1 ? "s" : ""
                        }`;
                        if (Math.abs(minutesLeft) > 0) {
                            timeMessage += ` and ${Math.abs(
                                minutesLeft
                            )} minute${Math.abs(minutesLeft) > 1 ? "s" : ""}`;
                        }
                    } else {
                        timeMessage = `${Math.abs(minutesLeft)} minute${
                            Math.abs(minutesLeft) > 1 ? "s" : ""
                        }`;
                    }

                    return {
                        type: "warning",
                        icon: <AlertCircle className="w-5 h-5" />,
                        title: "Payment Required",
                        message: `Your subscription has expired. You have ${timeMessage} remaining in grace period. Please renew to avoid suspension.`,
                        action: "Renew Subscription",
                        actionType: "renew",
                    };
                }
                return null;

            case "suspended":
                return {
                    type: "danger",
                    icon: <AlertTriangle className="w-5 h-5" />,
                    title: "Account Suspended",
                    message:
                        "Your account has been suspended due to non-payment. Please contact support to reactivate your account.",
                    action: "Contact Support",
                    actionType: "support",
                };

            case "active":
                if (clinic.subscription_end_date) {
                    const endDate = new Date(clinic.subscription_end_date);
                    const timeLeft = endDate - now;
                    const daysLeft = Math.floor(
                        timeLeft / (1000 * 60 * 60 * 24)
                    );
                    const hoursLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutesLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    // Show warning for short durations (7 days or less, or any short time for testing)
                    if (
                        (daysLeft <= 7 && daysLeft >= 0) ||
                        (daysLeft === 0 && (hoursLeft > 0 || minutesLeft > 0))
                    ) {
                        let timeMessage = "";
                        if (daysLeft > 0) {
                            timeMessage = `${daysLeft} day${
                                daysLeft > 1 ? "s" : ""
                            }`;
                            if (hoursLeft > 0) {
                                timeMessage += ` and ${hoursLeft} hour${
                                    hoursLeft > 1 ? "s" : ""
                                }`;
                            }
                        } else if (hoursLeft > 0) {
                            timeMessage = `${hoursLeft} hour${
                                hoursLeft > 1 ? "s" : ""
                            }`;
                            if (minutesLeft > 0) {
                                timeMessage += ` and ${minutesLeft} minute${
                                    minutesLeft > 1 ? "s" : ""
                                }`;
                            }
                        } else if (minutesLeft > 0) {
                            timeMessage = `${minutesLeft} minute${
                                minutesLeft > 1 ? "s" : ""
                            }`;
                        }

                        // Determine warning type based on time remaining
                        let warningType = "info";
                        let warningTitle = "Subscription Renewal";
                        let warningMessage = `Your subscription will renew in ${timeMessage}.`;

                        if (
                            daysLeft === 0 &&
                            hoursLeft === 0 &&
                            minutesLeft <= 5
                        ) {
                            warningType = "warning";
                            warningTitle = "Subscription Expiring Soon";
                            warningMessage = `Your subscription expires in ${timeMessage}. Please renew to continue.`;
                        } else if (daysLeft === 0 && hoursLeft <= 1) {
                            warningType = "warning";
                            warningTitle = "Subscription Expiring Soon";
                            warningMessage = `Your subscription expires in ${timeMessage}. Please renew to continue.`;
                        }

                        return {
                            type: warningType,
                            icon:
                                warningType === "warning" ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : (
                                    <Calendar className="w-5 h-5" />
                                ),
                            title: warningTitle,
                            message: warningMessage,
                            action: "View Details",
                            actionType: "details",
                        };
                    }
                }
                return null;

            default:
                return null;
        }
    };

    const statusInfo = getStatusInfo();
    if (!statusInfo) return null;

    const getBannerStyles = () => {
        switch (statusInfo.type) {
            case "danger":
                return "bg-red-50 border-red-200 text-red-800";
            case "warning":
                return "bg-yellow-50 border-yellow-200 text-yellow-800";
            case "info":
                return "bg-blue-50 border-blue-200 text-blue-800";
            default:
                return "bg-gray-50 border-gray-200 text-gray-800";
        }
    };

    const getButtonStyles = () => {
        switch (statusInfo.type) {
            case "danger":
                return "bg-red-600 hover:bg-red-700 text-white";
            case "warning":
                return "bg-yellow-600 hover:bg-yellow-700 text-white";
            case "info":
                return "bg-blue-600 hover:bg-blue-700 text-white";
            default:
                return "bg-gray-600 hover:bg-gray-700 text-white";
        }
    };

    const handleAction = (actionType) => {
        switch (actionType) {
            case "upgrade":
                setDialogType("upgrade");
                setDialogOpen(true);
                break;
            case "renew":
                setDialogType("renew");
                setDialogOpen(true);
                break;
            case "support":
                setShowSupportModal(true);
                break;
            case "details":
                // Navigate to subscription details page
                window.location.href = route("clinic.subscription.index");
                break;
            default:
                console.log("Unknown action:", actionType);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setDialogType(null);
    };

    const handleUpgradeSubmit = async (selectedPlan = "premium") => {
        const response = await fetch(route("clinic.subscription.upgrade"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify({
                new_plan: selectedPlan,
                duration_months: 1,
                message: "Requested via subscription warning banner",
            }),
        });

        try {
            const result = await response.json();
            return result;
        } catch (parseError) {
            console.error("Failed to parse response:", parseError);
            return {
                success: false,
                message:
                    "Received invalid response from server. Please try again or contact support.",
            };
        }
    };

    const handleRenewSubmit = async () => {
        const response = await fetch(route("clinic.subscription.renew"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute("content"),
            },
            body: JSON.stringify({
                duration_months: 1,
                message: "Requested via subscription warning banner",
            }),
        });

        try {
            const result = await response.json();
            return result;
        } catch (parseError) {
            console.error("Failed to parse response:", parseError);
            return {
                success: false,
                message:
                    "Received invalid response from server. Please try again or contact support.",
            };
        }
    };

    return (
        <>
            <div
                className={`border rounded-lg p-4 mb-6 ${getBannerStyles()} ${className}`}
            >
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        {statusInfo.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold mb-1">
                            {statusInfo.title}
                        </h3>
                        <p className="text-sm mb-3">{statusInfo.message}</p>
                        <div className="flex gap-2">
                            <button
                                className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors duration-200 ${getButtonStyles()}`}
                                onClick={() =>
                                    handleAction(statusInfo.actionType)
                                }
                            >
                                {statusInfo.action}
                            </button>
                            {/* Show Need Help button for all action types */}
                            <button
                                className="px-4 py-2 text-xs font-medium rounded-lg transition-colors duration-200 bg-gray-600 hover:bg-gray-700 text-white"
                                onClick={() => setShowSupportModal(true)}
                            >
                                Need Help?
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade/Renew Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                {statusInfo.actionType === "upgrade"
                                    ? "Upgrade Your Plan"
                                    : "Renew Subscription"}
                            </h3>
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-medium mb-2">
                                Available Plans:
                            </h4>
                            <div className="space-y-3">
                                <div className="border rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h5 className="font-medium">
                                                Basic Plan
                                            </h5>
                                            <p className="text-sm text-gray-600">
                                                Perfect for small clinics
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ₱999/month
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                or ₱9,999/year
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border rounded-lg p-3 bg-blue-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h5 className="font-medium">
                                                Premium Plan
                                            </h5>
                                            <p className="text-sm text-gray-600">
                                                For growing practices
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ₱1,999/month
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                or ₱19,999/year
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border rounded-lg p-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h5 className="font-medium">
                                                Enterprise Plan
                                            </h5>
                                            <p className="text-sm text-gray-600">
                                                For large clinics
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ₱2,999/month
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                or ₱29,999/year
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                                onClick={async () => {
                                    try {
                                        const response = await fetch(
                                            statusInfo.actionType === "upgrade"
                                                ? route(
                                                      "clinic.subscription.upgrade"
                                                  )
                                                : route(
                                                      "clinic.subscription.renew"
                                                  ),
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type":
                                                        "application/json",
                                                    "X-CSRF-TOKEN": document
                                                        .querySelector(
                                                            'meta[name="csrf-token"]'
                                                        )
                                                        .getAttribute(
                                                            "content"
                                                        ),
                                                },
                                                body: JSON.stringify({
                                                    new_plan: "premium", // Default to premium for upgrade
                                                    duration_months: 1,
                                                    message: `Requested via ${statusInfo.actionType} button`,
                                                }),
                                            }
                                        );

                                        const result = await response.json();

                                        if (result.success) {
                                            alert(result.message);
                                            setShowUpgradeModal(false);
                                        } else {
                                            alert("Error: " + result.message);
                                        }
                                    } catch (error) {
                                        console.error("Request failed:", error);
                                        alert(
                                            "Request failed. Please try again or contact support."
                                        );
                                    }
                                }}
                            >
                                {statusInfo.actionType === "upgrade"
                                    ? "Upgrade Now"
                                    : "Renew Now"}
                            </button>
                            <button
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium"
                                onClick={() => setShowUpgradeModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Support Modal */}
            {showSupportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Contact Support
                            </h3>
                            <button
                                onClick={() => setShowSupportModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">
                                Our support team is here to help you with any
                                questions about your subscription.
                            </p>

                            <div className="space-y-3">
                                <a
                                    href="mailto:support@smilesuite.com"
                                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Mail className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="font-medium">
                                            Email Support
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            support@smilesuite.com
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                                </a>

                                <a
                                    href="tel:+631234567890"
                                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Phone className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="font-medium">
                                            Phone Support
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            +63 123 456 7890
                                        </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                                </a>
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Support Hours:</strong>{" "}
                                    Monday-Friday, 8 AM - 6 PM (PHT)
                                </p>
                            </div>
                        </div>

                        <button
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium"
                            onClick={() => setShowSupportModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Custom Dialog */}
            <SubscriptionRequestDialog
                isOpen={dialogOpen}
                onClose={handleDialogClose}
                requestType={dialogType}
                onSubmit={
                    dialogType === "upgrade"
                        ? handleUpgradeSubmit
                        : handleRenewSubmit
                }
                isTrial={clinic?.subscription_status === "trial"}
            />
        </>
    );
}
