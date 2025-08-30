import React from "react";
import { CheckCircle, AlertTriangle, Clock, XCircle, Info } from "lucide-react";

export default function SubscriptionStatusIndicator({ clinic }) {
    if (!clinic) return null;

    const getStatusInfo = () => {
        const status = clinic.subscription_status;
        const now = new Date();

        switch (status) {
            case "active":
                if (clinic.subscription_end_date) {
                    const endDate = new Date(clinic.subscription_end_date);
                    const timeLeft = endDate - now;
                    const daysLeft = Math.floor(
                        timeLeft / (1000 * 60 * 60 * 24)
                    );

                    if (daysLeft <= 7 && daysLeft >= 0) {
                        return {
                            type: "warning",
                            icon: <Clock className="w-4 h-4" />,
                            text: `${daysLeft} day${
                                daysLeft !== 1 ? "s" : ""
                            } left`,
                            color: "text-yellow-600",
                            bgColor: "bg-yellow-100",
                            borderColor: "border-yellow-200",
                        };
                    }
                }
                return {
                    type: "success",
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: "Active",
                    color: "text-green-600",
                    bgColor: "bg-green-100",
                    borderColor: "border-green-200",
                };

            case "trial":
                if (clinic.trial_ends_at) {
                    const trialEnd = new Date(clinic.trial_ends_at);
                    const timeLeft = trialEnd - now;
                    const daysLeft = Math.floor(
                        timeLeft / (1000 * 60 * 60 * 24)
                    );

                    if (daysLeft <= 3 && daysLeft >= 0) {
                        return {
                            type: "warning",
                            icon: <Clock className="w-4 h-4" />,
                            text: `Trial: ${daysLeft} day${
                                daysLeft !== 1 ? "s" : ""
                            } left`,
                            color: "text-yellow-600",
                            bgColor: "bg-yellow-100",
                            borderColor: "border-yellow-200",
                        };
                    }
                }
                return {
                    type: "info",
                    icon: <Info className="w-4 h-4" />,
                    text: "Trial",
                    color: "text-blue-600",
                    bgColor: "bg-blue-100",
                    borderColor: "border-blue-200",
                };

            case "grace_period":
                return {
                    type: "warning",
                    icon: <AlertTriangle className="w-4 h-4" />,
                    text: "Grace Period",
                    color: "text-orange-600",
                    bgColor: "bg-orange-100",
                    borderColor: "border-orange-200",
                };

            case "suspended":
                return {
                    type: "danger",
                    icon: <XCircle className="w-4 h-4" />,
                    text: "Suspended",
                    color: "text-red-600",
                    bgColor: "bg-red-100",
                    borderColor: "border-red-200",
                };

            default:
                return {
                    type: "info",
                    icon: <Info className="w-4 h-4" />,
                    text: "Unknown",
                    color: "text-gray-600",
                    bgColor: "bg-gray-100",
                    borderColor: "border-gray-200",
                };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.color}`}
        >
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
        </div>
    );
}

