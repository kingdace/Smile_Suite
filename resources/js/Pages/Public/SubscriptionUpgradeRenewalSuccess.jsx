import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
    CheckCircle,
    Building2,
    Crown,
    Zap,
    Clock,
    Mail,
    ArrowRight,
    Home,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";
import SmileyDy from "@/Components/Chatbot/SmileyDy";

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

    const getPlanColor = (plan) => {
        switch (plan) {
            case "premium":
                return "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200";
            case "enterprise":
                return "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200";
            default:
                return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200";
        }
    };

    const getRequestTypeIcon = (type) => {
        switch (type) {
            case "upgrade":
                return <ArrowRight className="w-5 h-5 text-green-600" />;
            case "renewal":
                return <Clock className="w-5 h-5 text-blue-600" />;
            default:
                return <Zap className="w-5 h-5 text-purple-600" />;
        }
    };

    const getRequestTypeText = (type) => {
        switch (type) {
            case "upgrade":
                return "Subscription Upgrade";
            case "renewal":
                return "Subscription Renewal";
            default:
                return "Subscription Request";
        }
    };

    return (
        <>
            <Head title="Subscription Payment Successful" />
            <SiteHeader />

            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Your{" "}
                            {getRequestTypeText(
                                request.request_type
                            ).toLowerCase()}{" "}
                            has been processed successfully.
                        </p>
                    </div>

                    {/* Main Success Card */}
                    <Card className="mb-6">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2 text-xl">
                                {getRequestTypeIcon(request.request_type)}
                                {getRequestTypeText(request.request_type)}{" "}
                                Complete
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Clinic Information */}
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {request.clinic?.name}
                                </h3>
                                <p className="text-gray-600">
                                    {request.clinic?.email}
                                </p>
                            </div>

                            <Separator />

                            {/* Subscription Details */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Crown className="w-4 h-4" />
                                    Subscription Details
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Current Plan */}
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">
                                            Previous Plan
                                        </p>
                                        <Badge
                                            className={`${getPlanColor(
                                                request.current_plan
                                            )} flex items-center gap-1 w-fit`}
                                        >
                                            {getPlanIcon(request.current_plan)}
                                            {request.current_plan
                                                ?.charAt(0)
                                                ?.toUpperCase() +
                                                request.current_plan?.slice(1)}
                                        </Badge>
                                    </div>

                                    {/* New Plan */}
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-500">
                                            New Plan
                                        </p>
                                        <Badge
                                            className={`${getPlanColor(
                                                request.requested_plan
                                            )} flex items-center gap-1 w-fit`}
                                        >
                                            {getPlanIcon(
                                                request.requested_plan
                                            )}
                                            {request.requested_plan
                                                ?.charAt(0)
                                                ?.toUpperCase() +
                                                request.requested_plan?.slice(
                                                    1
                                                )}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Duration */}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">
                                        Duration
                                    </p>
                                    <p className="font-medium">
                                        {request.duration_months} month
                                        {request.duration_months > 1 ? "s" : ""}
                                    </p>
                                </div>

                                {/* Amount */}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">
                                        Amount Paid
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ₱
                                        {request.calculated_amount?.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <Separator />

                            {/* Next Steps */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    What's Next?
                                </h4>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-blue-600">
                                                1
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Check Your Email
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                We've sent a confirmation email
                                                to {request.clinic?.email} with
                                                your subscription details.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-blue-600">
                                                2
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Access Your Clinic
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Log in to your clinic management
                                                system to start using your new
                                                subscription features.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-blue-600">
                                                3
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Enjoy Your New Features
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Your {request.requested_plan}{" "}
                                                subscription is now active with
                                                all premium features unlocked.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            asChild
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            <a href="/login">
                                <Home className="w-4 h-4 mr-2" />
                                Go to Login
                            </a>
                        </Button>

                        <Button variant="outline" asChild>
                            <a href="/">
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Back to Home
                            </a>
                        </Button>
                    </div>

                    {/* Support Information */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500">
                            Need help? Contact our support team at{" "}
                            <a
                                href="mailto:support@smilesuite.com"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                support@smilesuite.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* SmileyDy Chatbot */}
                <SmileyDy />
            </div>
        </>
    );
}
