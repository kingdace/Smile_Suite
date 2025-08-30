import React from "react";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function CompactSubscriptionStatus({ clinic }) {
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
                    const hoursLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    const minutesLeft = Math.floor(
                        (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                    );

                    if (daysLeft <= 7 && daysLeft >= 0) {
                        return {
                            icon: <Clock className="w-4 h-4" />,
                            text: `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`,
                            color: "text-yellow-400",
                            bgColor: "bg-yellow-400/10",
                            borderColor: "border-yellow-400/20",
                        };
                    }
                }
                return {
                    icon: <CheckCircle className="w-4 h-4" />,
                    text: "Active",
                    color: "text-green-400",
                    bgColor: "bg-green-400/10",
                    borderColor: "border-green-400/20",
                };

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

                    return {
                        icon: <Clock className="w-4 h-4" />,
                        text: `Trial: ${daysLeft}d ${hoursLeft}h ${minutesLeft}m`,
                        color: "text-blue-400",
                        bgColor: "bg-blue-400/10",
                        borderColor: "border-blue-400/20",
                    };
                }
                return {
                    icon: <Clock className="w-4 h-4" />,
                    text: "Trial",
                    color: "text-blue-400",
                    bgColor: "bg-blue-400/10",
                    borderColor: "border-blue-400/20",
                };

            case "grace_period":
                return {
                    icon: <AlertTriangle className="w-4 h-4" />,
                    text: "Grace Period",
                    color: "text-orange-400",
                    bgColor: "bg-orange-400/10",
                    borderColor: "border-orange-400/20",
                };

            case "suspended":
                return {
                    icon: <XCircle className="w-4 h-4" />,
                    text: "Suspended",
                    color: "text-red-400",
                    bgColor: "bg-red-400/10",
                    borderColor: "border-red-400/20",
                };

            default:
                return null;
        }
    };

    const statusInfo = getStatusInfo();
    if (!statusInfo) return null;

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.color}`}
        >
            {statusInfo.icon}
            <span className="text-xs">{statusInfo.text}</span>
        </div>
    );
}

