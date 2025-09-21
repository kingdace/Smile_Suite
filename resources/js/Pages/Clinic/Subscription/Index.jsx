import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import SubscriptionWarningBanner from "@/Components/SubscriptionWarningBanner";
import SubscriptionStatusIndicator from "@/Components/SubscriptionStatusIndicator";
import {
    Calendar,
    CreditCard,
    Clock,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Info,
    Crown,
    Shield,
    Zap,
    ArrowRight,
    Mail,
    Phone,
    ExternalLink,
    Building2,
    Users,
    Package,
    Star,
    TrendingUp,
    DollarSign,
} from "lucide-react";
import { format } from "date-fns";

export default function SubscriptionIndex({ auth, clinic }) {
    const getPlanInfo = (plan) => {
        const plans = {
            basic: {
                name: "Basic Plan",
                price: "₱999",
                period: "month",
                features: [
                    "Patient Management (up to 500 patients)",
                    "Appointment Scheduling (up to 2 dentists & staffs)",
                    "Payment Processing (all methods)",
                    "Treatment Management",
                    "Service Management (up to 20 services)",
                    "Standard Dashboard & Reports",
                    "Email Notifications",
                    "14-day Free Trial",
                ],
                color: "bg-blue-500",
                icon: <Package className="w-6 h-6" />,
            },
            premium: {
                name: "Premium Plan",
                price: "₱1,999",
                period: "month",
                features: [
                    "Everything in Basic",
                    "Up to 5 dentist and staff accounts",
                    "Inventory Management",
                    "Supplier Management",
                    "Clinic Profile Management",
                    "Export Feature",
                    "Bulk Operations",
                    "Priority Support",
                ],
                color: "bg-purple-500",
                icon: <Star className="w-6 h-6" />,
            },
            enterprise: {
                name: "Enterprise Plan",
                price: "₱2,999",
                period: "month",
                features: [
                    "Everything in Premium",
                    "Unlimited dentist and staff accounts",
                    "Multi-branch Management",
                    "Advanced Analytics & Insights",
                    "Custom Reporting",
                    "API Access",
                    "24/7 Priority Support",
                    "Training & Onboarding",
                ],
                color: "bg-gradient-to-r from-purple-500 to-pink-500",
                icon: <Crown className="w-6 h-6" />,
            },
        };
        return plans[plan] || plans.basic;
    };

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

                    return {
                        icon: <CheckCircle className="w-5 h-5" />,
                        color: "text-green-600",
                        bgColor: "bg-green-50",
                        borderColor: "border-green-200",
                        text: `Active • ${daysLeft} days, ${hoursLeft} hours remaining`,
                    };
                }
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    text: "Active",
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

                    return {
                        icon: <Clock className="w-5 h-5" />,
                        color: "text-blue-600",
                        bgColor: "bg-blue-50",
                        borderColor: "border-blue-200",
                        text: `Trial • ${daysLeft} days, ${hoursLeft} hours remaining`,
                    };
                }
                return {
                    icon: <Clock className="w-5 h-5" />,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    text: "Trial",
                };

            case "grace_period":
                return {
                    icon: <AlertTriangle className="w-5 h-5" />,
                    color: "text-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                    text: "Grace Period",
                };

            case "suspended":
                return {
                    icon: <XCircle className="w-5 h-5" />,
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    text: "Suspended",
                };

            default:
                return {
                    icon: <Info className="w-5 h-5" />,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    text: "Unknown",
                };
        }
    };

    const planInfo = getPlanInfo(clinic.subscription_plan);
    const statusInfo = getStatusInfo();

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Subscription Management" />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Subscription Management
                            </h1>
                            <p className="text-gray-600">
                                Manage your Smile Suite subscription and billing
                            </p>
                        </div>
                        <SubscriptionStatusIndicator clinic={clinic} />
                    </div>
                </div>

                {/* Warning Banner */}
                <SubscriptionWarningBanner clinic={clinic} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Plan */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-lg ${planInfo.color} text-white`}
                                    >
                                        {planInfo.icon}
                                    </div>
                                    Current Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                {planInfo.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {clinic.subscription_plan ===
                                                "trial"
                                                    ? "Free trial period"
                                                    : `${planInfo.price}/${planInfo.period}`}
                                            </p>
                                        </div>
                                        <div
                                            className={`px-4 py-2 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
                                        >
                                            <div
                                                className={`flex items-center gap-2 ${statusInfo.color}`}
                                            >
                                                {statusInfo.icon}
                                                <span className="text-sm font-medium">
                                                    {statusInfo.text}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-6">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Plan Features
                                        </h4>
                                        <ul className="space-y-2">
                                            {planInfo.features.map(
                                                (feature, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-gray-700">
                                                            {feature}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    {clinic.subscription_end_date && (
                                        <div className="border-t pt-6">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Subscription Details
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-600">
                                                        Start Date
                                                    </p>
                                                    <p className="font-medium">
                                                        {clinic.subscription_start_date
                                                            ? format(
                                                                  new Date(
                                                                      clinic.subscription_start_date
                                                                  ),
                                                                  "MMM d, yyyy"
                                                              )
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">
                                                        End Date
                                                    </p>
                                                    <p className="font-medium">
                                                        {format(
                                                            new Date(
                                                                clinic.subscription_end_date
                                                            ),
                                                            "MMM d, yyyy"
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            className="flex-1"
                                            onClick={() => {
                                                router.post(
                                                    route(
                                                        "clinic.subscription.upgrade"
                                                    ),
                                                    {
                                                        new_plan: "premium", // Default to premium for upgrade
                                                        duration_months: 1,
                                                        message:
                                                            "Requested via subscription page Upgrade button",
                                                    },
                                                    {
                                                        onSuccess: (page) => {
                                                            if (
                                                                page.props.flash
                                                                    ?.success
                                                            ) {
                                                                alert(
                                                                    page.props
                                                                        .flash
                                                                        .success
                                                                );
                                                            } else if (
                                                                page.props.flash
                                                                    ?.error
                                                            ) {
                                                                alert(
                                                                    "Error: " +
                                                                        page
                                                                            .props
                                                                            .flash
                                                                            .error
                                                                );
                                                            }
                                                        },
                                                        onError: (errors) => {
                                                            console.error(
                                                                "Upgrade request failed:",
                                                                errors
                                                            );
                                                            alert(
                                                                "Upgrade request failed. Please try again or contact support."
                                                            );
                                                        },
                                                    }
                                                );
                                            }}
                                        >
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            {clinic.subscription_plan ===
                                            "trial"
                                                ? "Upgrade Now"
                                                : "Manage Billing"}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <Mail className="w-4 h-4 mr-2" />
                                            Contact Support
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions & Support */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Update Payment Method
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    View Billing History
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Security Settings
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Team Management
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Support */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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

                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Support Hours:</strong>{" "}
                                        Monday-Friday, 8 AM - 6 PM (PHT)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Stats */}
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Usage Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Patients
                                    </span>
                                    <span className="font-medium">
                                        247 / 500
                                    </span>
                                </div>
                                <Progress value={49} className="w-full" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Storage
                                    </span>
                                    <span className="font-medium">
                                        2.3 GB / 10 GB
                                    </span>
                                </div>
                                <Progress value={23} className="w-full" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        API Calls
                                    </span>
                                    <span className="font-medium">
                                        1,234 / 5,000
                                    </span>
                                </div>
                                <Progress value={25} className="w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
