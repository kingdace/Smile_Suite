import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Loader2, CheckCircle, XCircle, Crown, Zap, Info } from "lucide-react";

export default function SubscriptionRequestDialog({
    isOpen,
    onClose,
    requestType,
    onSubmit,
    isTrial = false,
    clinic = null,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Set default plan when dialog opens for upgrades
    useEffect(() => {
        if (isOpen && requestType === "upgrade" && !selectedPlan) {
            // For basic plans, default to premium (most common choice)
            if (clinic?.subscription_plan === "basic") {
                setSelectedPlan("premium");
            }
        }
    }, [isOpen, requestType, clinic?.subscription_plan, selectedPlan]);

    const handleSubmit = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            let response;

            if (requestType === "upgrade" && selectedPlan) {
                // For upgrades, pass the selected plan
                response = await onSubmit(selectedPlan);
            } else {
                // For renewals, use default behavior
                response = await onSubmit();
            }

            setResult(response);
        } catch (error) {
            setResult({
                success: false,
                message: error.message || "Request failed. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setResult(null);
            setSelectedPlan(null);
            onClose();
        }
    };

    const getDialogContent = () => {
        if (result) {
            return (
                <div className="text-center py-4">
                    {result.success ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Request Sent Successfully!
                                </h3>
                                <p className="text-gray-600 mb-3">
                                    {result.message}
                                </p>

                                {/* Show additional details if available */}
                                {result.amount && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <Info className="w-4 h-4" />
                                            Request Details
                                        </h4>
                                        <div className="space-y-2 text-sm text-blue-800">
                                            <div className="flex justify-between">
                                                <span>Request ID:</span>
                                                <span className="font-mono">
                                                    {result.request_id}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Amount:</span>
                                                <span className="font-semibold">
                                                    ₱
                                                    {result.amount.toLocaleString()}
                                                </span>
                                            </div>
                                            {result.plan_details && (
                                                <div className="flex justify-between">
                                                    <span>Plan:</span>
                                                    <span className="font-semibold">
                                                        {
                                                            result.plan_details
                                                                .name
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                            {result.duration_days && (
                                                <div className="flex justify-between">
                                                    <span>Duration:</span>
                                                    <span className="font-semibold">
                                                        {result.duration_days}{" "}
                                                        days
                                                    </span>
                                                </div>
                                            )}
                                            {result.new_end_date && (
                                                <div className="flex justify-between">
                                                    <span>New End Date:</span>
                                                    <span className="font-semibold">
                                                        {result.new_end_date}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Request Failed
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    {result.message}
                                </p>
                                {result.error && (
                                    <p className="text-sm text-red-500 mt-1">
                                        Error: {result.error}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="text-center py-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {requestType === "upgrade" ? (
                            <Crown className="w-6 h-6 text-blue-600" />
                        ) : (
                            <Zap className="w-6 h-6 text-blue-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {requestType === "upgrade"
                                ? "Upgrade Subscription"
                                : "Renew Subscription"}
                        </h3>
                        <p className="text-gray-600 mb-2">
                            {requestType === "upgrade"
                                ? "Request an upgrade to a higher plan. You will receive payment instructions via email within 24 hours."
                                : "Request to renew your subscription. You will receive payment instructions via email within 24 hours."}
                        </p>

                        {/* Show current plan info */}
                        {clinic && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-left">
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Current Plan
                                </h4>
                                <div className="text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Plan:</span>
                                        <span className="font-medium capitalize">
                                            {clinic.subscription_plan ||
                                                "Basic"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <span className="font-medium capitalize">
                                            {clinic.subscription_status ||
                                                "Active"}
                                        </span>
                                    </div>
                                    {clinic.subscription_end_date && (
                                        <div className="flex justify-between">
                                            <span>Expires:</span>
                                            <span className="font-medium">
                                                {new Date(
                                                    clinic.subscription_end_date
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Plan Selection Form for Upgrades */}
                        {requestType === "upgrade" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left">
                                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                                    <Crown className="w-4 h-4" />
                                    Select Upgrade Plan
                                </h4>

                                {/* Plan Options */}
                                <div className="space-y-2">
                                    {/* Premium Plan Option */}
                                    <div
                                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                                            selectedPlan === "premium"
                                                ? "bg-blue-100 border-blue-400"
                                                : "bg-white border-blue-200 hover:border-blue-300"
                                        }`}
                                        onClick={() =>
                                            setSelectedPlan("premium")
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <Zap className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-900">
                                                    Premium Plan
                                                </h5>
                                                <p className="text-sm text-gray-600">
                                                    Advanced features & priority
                                                    support
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600">
                                                ₱1,999
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                monthly
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enterprise Plan Option */}
                                    <div
                                        className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors cursor-pointer ${
                                            selectedPlan === "enterprise"
                                                ? "bg-purple-100 border-purple-400"
                                                : "bg-white border-blue-200 hover:border-blue-300"
                                        }`}
                                        onClick={() =>
                                            setSelectedPlan("enterprise")
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                                <Crown className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-gray-900">
                                                    Enterprise Plan
                                                </h5>
                                                <p className="text-sm text-gray-600">
                                                    Full features & dedicated
                                                    support
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-purple-600">
                                                ₱2,999
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                monthly
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected Plan Summary */}
                                {selectedPlan && (
                                    <div className="mt-3 p-2.5 bg-blue-100 border border-blue-300 rounded-lg">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-blue-900">
                                                Selected Plan:
                                            </span>
                                            <span className="font-semibold text-blue-900 capitalize">
                                                {selectedPlan}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm mt-1">
                                            <span className="font-medium text-blue-900">
                                                Monthly Price:
                                            </span>
                                            <span className="font-semibold text-blue-900">
                                                ₱
                                                {selectedPlan === "premium"
                                                    ? 1999
                                                    : 2999}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-blue-600 mt-3">
                                    💡 Choose your monthly plan. You'll receive
                                    payment instructions via email.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {result
                            ? result.success
                                ? "Success"
                                : "Error"
                            : requestType === "upgrade"
                            ? "Upgrade Subscription"
                            : "Renew Subscription"}
                    </DialogTitle>
                    <DialogDescription>
                        {result
                            ? result.success
                                ? "Your request has been processed"
                                : "There was an issue with your request"
                            : "Please confirm your subscription request"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {getDialogContent()}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    {!result && (
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    )}

                    {!result ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                isLoading ||
                                (requestType === "upgrade" && !selectedPlan)
                            }
                            className={
                                requestType === "upgrade"
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    {requestType === "upgrade" ? (
                                        <>
                                            <Crown className="w-4 h-4 mr-2" />
                                            {selectedPlan
                                                ? `Upgrade to ${
                                                      selectedPlan
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                      selectedPlan.slice(1)
                                                  }`
                                                : "Select a Plan"}
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            Renew
                                        </>
                                    )}
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button onClick={handleClose}>
                            {result.success ? "Great!" : "Try Again"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
