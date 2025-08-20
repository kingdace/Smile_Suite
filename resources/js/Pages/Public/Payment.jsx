import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    CreditCard,
    CheckCircle,
    AlertCircle,
    Loader2,
    Shield,
    Lock,
    Smartphone,
    Building,
    MapPin,
    Mail,
    Phone,
    Star,
    Zap,
    CheckCircle2,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import axios from "axios";

const PaymentForm = ({ request, token, paymentMethods }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);

    const handlePaymentMethodSelect = async (method) => {
        setSelectedMethod(method);
        setError(null);

        try {
            // Create payment intent
            const intentResponse = await axios.post(
                route("payment.create-intent", { token })
            );

            setPaymentIntentId(intentResponse.data.payment_intent_id);
        } catch (err) {
            setError("Failed to initialize payment. Please try again.");
        }
    };

    const handlePayment = async () => {
        if (!selectedMethod || !paymentIntentId) {
            setError("Please select a payment method first.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Simulate payment processing
            await axios.post(route("payment.success", { token }), {
                payment_intent_id: paymentIntentId,
                payment_method: selectedMethod.key,
            });

            setSuccess(true);
        } catch (err) {
            setError(
                err.response?.data?.error || "Payment failed. Please try again."
            );
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="text-center py-12">
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    🎉 Payment Successful!
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                    Welcome to the Smile Suite family! Your clinic setup is
                    ready.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                            What's Next?
                        </span>
                    </div>
                    <div className="space-y-3 text-sm text-green-700">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Setup instructions sent to your email</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Complete your clinic profile setup</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Start managing your dental practice</span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() =>
                        (window.location.href = route("clinic.setup", {
                            token,
                        }))
                    }
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                    <span>Continue to Setup</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        🇵🇭 Choose Your Payment Method
                    </h3>
                    <p className="text-gray-600">
                        Select your preferred Philippine payment option
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(paymentMethods).map(([key, method]) => (
                        <div
                            key={key}
                            className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                                selectedMethod?.key === key
                                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg"
                                    : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
                            }`}
                            onClick={() =>
                                handlePaymentMethodSelect({ key, ...method })
                            }
                        >
                            {selectedMethod?.key === key && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-md">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-md ${
                                        selectedMethod?.key === key
                                            ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                                            : "bg-gradient-to-br from-gray-100 to-gray-200"
                                    }`}
                                >
                                    {method.icon}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                                        {method.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {method.description}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <Shield className="w-3 h-3 text-green-500" />
                                        <span className="text-xs text-green-600 font-medium">
                                            Secure
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Instructions */}
            {selectedMethod && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-blue-900 text-lg">
                                {selectedMethod.name} Payment Instructions
                            </h4>
                            <p className="text-blue-700 text-sm">
                                Follow these steps to complete your payment
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
                        <p className="text-blue-800 text-sm leading-relaxed">
                            {selectedMethod.instructions}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-blue-900">
                                    Reference Number
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded border">
                                {paymentIntentId}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-green-900">
                                    Amount to Pay
                                </span>
                            </div>
                            <p className="text-lg font-bold text-green-700">
                                ₱{request.subscription_amount}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-3 text-red-600 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-blue-800 font-medium">
                            🔒 Secure Payment Simulation
                        </p>
                        <p className="text-xs text-blue-600">
                            This is a development/testing environment. Real
                            payments will use secure Philippine payment
                            gateways.
                        </p>
                    </div>
                </div>
            </div>

            <Button
                onClick={handlePayment}
                disabled={!selectedMethod || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5 mr-3" />
                        Complete Payment - ₱{request.subscription_amount}
                    </>
                )}
            </Button>
        </div>
    );
};

export default function Payment({ request, token, paymentMethods }) {
    return (
        <GuestLayout>
            <Head title="Complete Payment - Smile Suite" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center mb-6">
                            <div className="relative">
                                <img
                                    src="/images/smile-suite-logo.png"
                                    alt="Smile Suite"
                                    className="w-16 h-16 mr-4 drop-shadow-lg"
                                />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                                    <Star className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div className="text-left">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Smile Suite
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Dental Practice Management
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-8 shadow-lg border border-blue-100">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3">
                                💳 Complete Your Payment
                            </h2>
                            <p className="text-xl text-gray-600 mb-4">
                                Secure Philippine payment processing
                            </p>
                            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    <span>Bank-level Security</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-blue-500" />
                                    <span>Instant Processing</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span>Philippine Focused</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Payment Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-white" />
                                        </div>
                                        Payment Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <PaymentForm
                                        request={request}
                                        token={token}
                                        paymentMethods={paymentMethods}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm sticky top-8">
                                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200">
                                    <CardTitle className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                            <Building className="w-5 h-5 text-white" />
                                        </div>
                                        Clinic Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Building className="w-4 h-4 text-blue-600" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Clinic Name
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {request.clinic_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Contact Person
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {request.contact_person}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-4 h-4 text-green-600" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Email
                                                </p>
                                                <p className="font-semibold text-gray-900">
                                                    {request.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Star className="w-4 h-4 text-yellow-600" />
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                    Subscription Plan
                                                </p>
                                                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200">
                                                    {request.subscription_plan
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        request.subscription_plan.slice(
                                                            1
                                                        )}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                                            <div className="flex justify-between items-center text-xl font-bold">
                                                <span className="text-gray-700">
                                                    Total Amount:
                                                </span>
                                                <span className="text-blue-600">
                                                    ₱
                                                    {
                                                        request.subscription_amount
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                <Shield className="w-4 h-4 text-emerald-600" />
                                            </div>
                                            <div className="text-sm text-emerald-800">
                                                <p className="font-semibold mb-1">
                                                    🔒 Secure Payment
                                                </p>
                                                <p>
                                                    Your payment is processed
                                                    securely with bank-level
                                                    encryption and Philippine
                                                    payment standards.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
