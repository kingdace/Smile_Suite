import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { CheckCircle, Building2, Crown, Zap, Clock, Mail } from "lucide-react";

export default function SubscriptionPaymentSuccess({ request }) {
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

    return (
        <>
            <Head title="Payment Submitted Successfully" />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Payment Submitted Successfully!
                        </h1>
                        <p className="text-gray-600">
                            Your payment details have been received and are
                            being processed
                        </p>
                    </div>

                    {/* Payment Details */}
                    <Card className="mb-8">
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
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>What Happens Next?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-sm font-medium text-blue-600">
                                        1
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        Payment Verification
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Our admin team will verify your payment
                                        within 24 hours
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-sm font-medium text-blue-600">
                                        2
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        Subscription Activation
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        Once verified, your subscription will be
                                        automatically activated
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-sm font-medium text-blue-600">
                                        3
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        Email Confirmation
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        You'll receive an email confirmation
                                        once your subscription is active
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Important Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Important Information
                            </h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>
                                    • <strong>Processing Time:</strong> Payment
                                    verification typically takes 24 hours
                                </li>
                                <li>
                                    • <strong>Email Updates:</strong> You'll
                                    receive status updates via email
                                </li>
                                <li>
                                    • <strong>Support:</strong> Contact us if
                                    you have any questions
                                </li>
                                <li>
                                    • <strong>Access:</strong> Your current
                                    subscription remains active during
                                    processing
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() =>
                                (window.location.href = "/dashboard")
                            }
                            className="flex-1"
                        >
                            Go to Dashboard
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() =>
                                (window.location.href =
                                    "/clinic/" +
                                    request.clinic.id +
                                    "/dashboard")
                            }
                            className="flex-1"
                        >
                            Go to Clinic Dashboard
                        </Button>
                    </div>

                    {/* Contact Information */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Need help? Contact us at{" "}
                            <a
                                href="mailto:support@smilesuite.com"
                                className="text-blue-600 hover:underline"
                            >
                                support@smilesuite.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

