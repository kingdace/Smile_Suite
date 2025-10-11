import { useState } from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
    CreditCard,
    Smartphone,
    QrCode,
    CheckCircle,
    Clock,
    Building2,
    Crown,
    Zap,
} from "lucide-react";
import SmileyDy from "@/Components/Chatbot/SmileyDy";

export default function SubscriptionPayment({
    request,
    token,
    paymentMethods,
}) {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({
        sender_name: "",
        sender_number: "",
        reference_number: "",
        amount_sent: "",
    });

    const handlePaymentMethodSelect = (method) => {
        setSelectedMethod(method);
    };

    const handleInputChange = (field, value) => {
        setPaymentDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedMethod) {
            alert("Please select a payment method");
            return;
        }

        if (selectedMethod === "gcash" || selectedMethod === "paymaya") {
            // For QR code methods, require sender details and reference number
            if (
                !paymentDetails.sender_name ||
                !paymentDetails.sender_number ||
                !paymentDetails.reference_number
            ) {
                alert(
                    "Please provide sender name, number, and reference number"
                );
                return;
            }
        } else if (selectedMethod === "bank_transfer") {
            // For bank transfer, require all fields
            if (
                !paymentDetails.sender_name ||
                !paymentDetails.reference_number ||
                !paymentDetails.amount_sent
            ) {
                alert("Please fill in all required fields");
                return;
            }
        }

        setIsProcessing(true);

        try {
            const response = await fetch(
                `/subscription/payment/${token}/success`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify({
                        payment_method: selectedMethod,
                        payment_details: paymentDetails,
                    }),
                }
            );

            const result = await response.json();

            if (result.success) {
                // Show success message with reference number
                const successMessage = `Payment submitted successfully!\n\nReference Number: ${result.reference_number}\n\nOur admin team will verify and activate your subscription within 24 hours.`;
                alert(successMessage);

                // Redirect to success page
                window.location.href = result.redirect_url;
            } else {
                alert("Payment failed: " + result.message);
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment processing failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const getPlanIcon = (plan) => {
        switch (plan) {
            case "premium":
                return <Crown className="w-5 h-5 text-yellow-500" />;
            case "enterprise":
                return <Building2 className="w-5 h-5 text-purple-500" />;
            default:
                return <Zap className="w-5 h-5 text-blue-500" />;
        }
    };

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case "gcash":
                return <Smartphone className="w-5 h-5 text-green-500" />;
            case "paymaya":
                return <Smartphone className="w-5 h-5 text-blue-500" />;
            case "bank_transfer":
                return <CreditCard className="w-5 h-5 text-gray-500" />;
            default:
                return <CreditCard className="w-5 h-5" />;
        }
    };

    const getQRCodeImage = (method) => {
        switch (method) {
            case "gcash":
                return "/icons/gcashqr.png";
            case "paymaya":
                return "/icons/paymayaqr.png";
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Complete Subscription Payment" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Complete Your Subscription Payment
                        </h1>
                        <p className="text-gray-600">
                            Please complete your payment to activate your
                            subscription
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Payment Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5" />
                                    Subscription Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Clinic:
                                    </span>
                                    <span className="font-medium">
                                        {request.clinic.name}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Request Type:
                                    </span>
                                    <Badge
                                        variant={
                                            request.request_type === "upgrade"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {request.request_type === "upgrade"
                                            ? "Upgrade"
                                            : "Renewal"}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Plan:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {getPlanIcon(
                                            request.request_type === "upgrade"
                                                ? request.requested_plan
                                                : request.current_plan
                                        )}
                                        <span className="font-medium capitalize">
                                            {request.request_type === "upgrade"
                                                ? request.requested_plan
                                                : request.current_plan}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Duration:
                                    </span>
                                    <span className="font-medium">
                                        {request.duration_months} month(s)
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Amount:
                                    </span>
                                    <span className="text-2xl font-bold text-green-600">
                                        ₱{request.calculated_amount}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Payment Deadline:</span>
                                    <span>
                                        {new Date(
                                            request.payment_deadline
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Payment Methods */}
                                    <div className="space-y-3">
                                        {paymentMethods.map((method) => (
                                            <div
                                                key={method.id}
                                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                    selectedMethod === method.id
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() =>
                                                    handlePaymentMethodSelect(
                                                        method.id
                                                    )
                                                }
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value={method.id}
                                                        checked={
                                                            selectedMethod ===
                                                            method.id
                                                        }
                                                        onChange={() =>
                                                            handlePaymentMethodSelect(
                                                                method.id
                                                            )
                                                        }
                                                        className="text-blue-600"
                                                    />
                                                    <div className="flex items-center gap-2">
                                                        {getPaymentMethodIcon(
                                                            method.id
                                                        )}
                                                        <span className="font-medium">
                                                            {method.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* QR Code Display */}
                                    {selectedMethod &&
                                        (selectedMethod === "gcash" ||
                                            selectedMethod === "paymaya") && (
                                            <div className="text-center space-y-4">
                                                <div className="bg-white p-4 rounded-lg border">
                                                    <img
                                                        src={getQRCodeImage(
                                                            selectedMethod
                                                        )}
                                                        alt={`${selectedMethod} QR Code`}
                                                        className="mx-auto w-48 h-48 object-contain"
                                                    />
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Scan the QR code with your{" "}
                                                    {selectedMethod === "gcash"
                                                        ? "GCash"
                                                        : "PayMaya"}{" "}
                                                    app to complete payment
                                                </p>
                                            </div>
                                        )}

                                    {/* Payment Details Form */}
                                    {selectedMethod && (
                                        <div className="space-y-4">
                                            <h3 className="font-medium">
                                                Payment Details
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Help text for GCash/PayMaya users */}
                                                {(selectedMethod === "gcash" ||
                                                    selectedMethod ===
                                                        "paymaya") && (
                                                    <div className="col-span-2">
                                                        <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md border border-blue-200">
                                                            <strong>
                                                                Note:
                                                            </strong>{" "}
                                                            After completing
                                                            your payment via{" "}
                                                            {selectedMethod ===
                                                            "gcash"
                                                                ? "GCash"
                                                                : "PayMaya"}
                                                            , please provide the
                                                            reference number
                                                            from your
                                                            transaction receipt.
                                                            This helps our admin
                                                            team verify your
                                                            payment quickly.
                                                        </p>
                                                    </div>
                                                )}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Sender Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            paymentDetails.sender_name
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "sender_name",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter sender name"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Sender Number *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            paymentDetails.sender_number
                                                        }
                                                        onChange={(e) =>
                                                            handleInputChange(
                                                                "sender_number",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter sender number"
                                                        required
                                                    />
                                                </div>

                                                {(selectedMethod ===
                                                    "bank_transfer" ||
                                                    selectedMethod ===
                                                        "gcash" ||
                                                    selectedMethod ===
                                                        "paymaya") && (
                                                    <>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Reference Number
                                                                *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    paymentDetails.reference_number
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "reference_number",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Enter reference number"
                                                                required
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Found in your{" "}
                                                                {selectedMethod ===
                                                                "gcash"
                                                                    ? "GCash"
                                                                    : selectedMethod ===
                                                                      "paymaya"
                                                                    ? "PayMaya"
                                                                    : "bank"}{" "}
                                                                transaction
                                                                receipt
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Amount Sent *
                                                            </label>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={
                                                                    paymentDetails.amount_sent
                                                                }
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "amount_sent",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Enter amount sent"
                                                                required
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={
                                            !selectedMethod || isProcessing
                                        }
                                        className="w-full"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Complete Payment
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Important Notes */}
                    <Card className="mt-8">
                        <CardContent className="pt-6">
                            <h3 className="font-medium text-gray-900 mb-3">
                                Important Notes:
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>
                                    • Payment will be verified by our admin team
                                    within 24 hours
                                </li>
                                <li>
                                    • Your subscription will be activated once
                                    payment is confirmed
                                </li>
                                <li>
                                    • Please keep your payment reference for
                                    verification
                                </li>
                                <li>
                                    • Contact support if you encounter any
                                    issues
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* SmileyDy Chatbot */}
            <SmileyDy position="right" />
        </>
    );
}
