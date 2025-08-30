import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import {
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    CreditCard,
} from "lucide-react";

export default function PaymentVerificationDialog({
    isOpen,
    onClose,
    subscriptionRequest,
    onVerify,
}) {
    const [verificationNotes, setVerificationNotes] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleVerify = async (status) => {
        if (status === "verified" && !verificationNotes.trim()) {
            alert(
                "Please provide verification notes for payment verification."
            );
            return;
        }

        setIsProcessing(true);
        try {
            await onVerify(status, verificationNotes);
            onClose();
        } catch (error) {
            console.error("Verification failed:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!subscriptionRequest) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        Payment Verification
                    </DialogTitle>
                    <DialogDescription>
                        Review payment details and verify or reject the payment
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Payment Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-600">
                                    Request ID:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    #{subscriptionRequest.id}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">
                                    Amount:
                                </span>
                                <span className="ml-2 text-gray-900">
                                    ₱
                                    {subscriptionRequest.calculated_amount?.toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">
                                    Payment Method:
                                </span>
                                <span className="ml-2 text-gray-900 capitalize">
                                    {subscriptionRequest.payment_method?.replace(
                                        "_",
                                        " "
                                    ) || "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-600">
                                    Reference Number:
                                </span>
                                <span className="ml-2 text-gray-900 font-mono">
                                    {subscriptionRequest.reference_number ||
                                        "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    {subscriptionRequest.payment_method && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-900 mb-3">
                                Payment Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                {subscriptionRequest.sender_name && (
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">
                                            Sender Name:
                                        </span>
                                        <span className="text-blue-900 font-medium">
                                            {subscriptionRequest.sender_name}
                                        </span>
                                    </div>
                                )}
                                {subscriptionRequest.sender_number && (
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">
                                            Sender Number:
                                        </span>
                                        <span className="text-blue-900 font-medium">
                                            {subscriptionRequest.sender_number}
                                        </span>
                                    </div>
                                )}
                                {subscriptionRequest.amount_sent && (
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">
                                            Amount Sent:
                                        </span>
                                        <span className="text-blue-900 font-medium">
                                            ₱
                                            {subscriptionRequest.amount_sent.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                {subscriptionRequest.payment_received_at && (
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">
                                            Received At:
                                        </span>
                                        <span className="text-blue-900 font-medium">
                                            {new Date(
                                                subscriptionRequest.payment_received_at
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Verification Notes */}
                    <div>
                        <Label htmlFor="verification-notes">
                            Verification Notes
                        </Label>
                        <Textarea
                            id="verification-notes"
                            placeholder="Enter verification notes or reason for rejection..."
                            value={verificationNotes}
                            onChange={(e) =>
                                setVerificationNotes(e.target.value)
                            }
                            className="mt-2"
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleVerify("rejected")}
                            disabled={isProcessing}
                            className="flex items-center gap-2"
                        >
                            <XCircle className="w-4 h-4" />
                            Reject Payment
                        </Button>
                        <Button
                            onClick={() => handleVerify("verified")}
                            disabled={isProcessing}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Verify Payment
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

