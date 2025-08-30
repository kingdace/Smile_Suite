import { useState } from "react";
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

    const handleSubmit = async () => {
        setIsLoading(true);
        setResult(null);

        try {
            const response = await onSubmit();
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
            onClose();
        }
    };

    const getDialogContent = () => {
        if (result) {
            return (
                <div className="text-center py-6">
                    {result.success ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Request Sent Successfully!
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {result.message}
                                </p>

                                {/* Show additional details if available */}
                                {result.amount && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
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
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Request Failed
                                </h3>
                                <p className="text-gray-600">
                                    {result.message}
                                </p>
                                {result.error && (
                                    <p className="text-sm text-red-500 mt-2">
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
            <div className="text-center py-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        {requestType === "upgrade" ? (
                            <Crown className="w-8 h-8 text-blue-600" />
                        ) : (
                            <Zap className="w-8 h-8 text-blue-600" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {requestType === "upgrade"
                                ? "Upgrade Subscription"
                                : "Renew Subscription"}
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {requestType === "upgrade"
                                ? "Request an upgrade to a higher plan. You will receive payment instructions via email within 24 hours."
                                : `Request to ${
                                      isTrial
                                          ? "extend your trial"
                                          : "renew your subscription"
                                  }. You will receive payment instructions via email within 24 hours.`}
                        </p>

                        {/* Show current plan info */}
                        {clinic && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left">
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
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
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

                {getDialogContent()}

                <div className="flex justify-end gap-3">
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
                            disabled={isLoading}
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
                                            Upgrade Now
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            {isTrial ? "Extend Trial" : "Renew"}
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
