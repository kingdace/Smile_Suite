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
    Settings,
    Download,
    FileText,
    History,
    Bell,
    Globe,
    Lock,
    RefreshCw,
    Plus,
    Minus,
    ChevronRight,
    Sparkles,
    Target,
    Award,
    BarChart3,
    Activity,
} from "lucide-react";
import { format, differenceInDays, differenceInHours, addDays } from "date-fns";
import { useState } from "react";

export default function SubscriptionIndex({ auth, clinic }) {
    const [selectedDuration, setSelectedDuration] = useState(1);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showRenewalModal, setShowRenewalModal] = useState(false);

    const getPlanInfo = (plan) => {
        const plans = {
            basic: {
                name: "Basic Plan",
                price: 999,
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
                color: "from-blue-500 to-blue-600",
                icon: <Package className="w-6 h-6" />,
                popular: false,
            },
            premium: {
                name: "Premium Plan",
                price: 1999,
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
                color: "from-purple-500 to-purple-600",
                icon: <Star className="w-6 h-6" />,
                popular: true,
            },
            enterprise: {
                name: "Enterprise Plan",
                price: 2999,
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
                color: "from-purple-500 to-pink-500",
                icon: <Crown className="w-6 h-6" />,
                popular: false,
            },
        };
        return plans[plan] || plans.basic;
    };

    // Calculate actual usage statistics
    const calculateUsageStats = () => {
        const currentPlan = getPlanInfo(clinic.subscription_plan);

        // Mock data - in real implementation, these would come from the backend
        const stats = {
            patients: {
                current: clinic.patients?.length || 0,
                limit:
                    currentPlan.name === "Basic Plan"
                        ? 500
                        : currentPlan.name === "Premium Plan"
                        ? 1000
                        : 9999,
                percentage: 0,
            },
            staff: {
                current: clinic.users?.length || 0,
                limit:
                    currentPlan.name === "Basic Plan"
                        ? 2
                        : currentPlan.name === "Premium Plan"
                        ? 5
                        : 9999,
                percentage: 0,
            },
            storage: {
                current: 2.3, // GB
                limit:
                    currentPlan.name === "Basic Plan"
                        ? 10
                        : currentPlan.name === "Premium Plan"
                        ? 50
                        : 999,
                percentage: 0,
            },
            appointments: {
                current: clinic.appointments?.length || 0,
                limit: 9999,
                percentage: 0,
            },
        };

        // Calculate percentages
        stats.patients.percentage = Math.min(
            (stats.patients.current / stats.patients.limit) * 100,
            100
        );
        stats.staff.percentage = Math.min(
            (stats.staff.current / stats.staff.limit) * 100,
            100
        );
        stats.storage.percentage = Math.min(
            (stats.storage.current / stats.storage.limit) * 100,
            100
        );
        stats.appointments.percentage = Math.min(
            (stats.appointments.current / stats.appointments.limit) * 100,
            100
        );

        return stats;
    };

    const getStatusInfo = () => {
        const status = clinic.subscription_status;
        const now = new Date();

        switch (status) {
            case "active":
                if (clinic.subscription_end_date) {
                    const endDate = new Date(clinic.subscription_end_date);
                    const daysLeft = differenceInDays(endDate, now);
                    const hoursLeft = differenceInHours(endDate, now) % 24;

                    return {
                        icon: <CheckCircle className="w-5 h-5" />,
                        color: "text-green-600",
                        bgColor: "bg-green-50",
                        borderColor: "border-green-200",
                        text: `Active • ${daysLeft} days, ${hoursLeft} hours remaining`,
                        urgency:
                            daysLeft > 7
                                ? "low"
                                : daysLeft > 3
                                ? "medium"
                                : "high",
                    };
                }
                return {
                    icon: <CheckCircle className="w-5 h-5" />,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    text: "Active",
                    urgency: "low",
                };

            case "trial":
                if (clinic.trial_ends_at) {
                    const trialEnd = new Date(clinic.trial_ends_at);
                    const daysLeft = differenceInDays(trialEnd, now);
                    const hoursLeft = differenceInHours(trialEnd, now) % 24;

                    return {
                        icon: <Clock className="w-5 h-5" />,
                        color: "text-blue-600",
                        bgColor: "bg-blue-50",
                        borderColor: "border-blue-200",
                        text: `Trial • ${daysLeft} days, ${hoursLeft} hours remaining`,
                        urgency:
                            daysLeft > 7
                                ? "low"
                                : daysLeft > 3
                                ? "medium"
                                : "high",
                    };
                }
                return {
                    icon: <Clock className="w-5 h-5" />,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    text: "Trial",
                    urgency: "medium",
                };

            case "grace_period":
                return {
                    icon: <AlertTriangle className="w-5 h-5" />,
                    color: "text-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                    text: "Grace Period",
                    urgency: "high",
                };

            case "suspended":
                return {
                    icon: <XCircle className="w-5 h-5" />,
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    text: "Suspended",
                    urgency: "critical",
                };

            default:
                return {
                    icon: <Info className="w-5 h-5" />,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    text: "Unknown",
                    urgency: "medium",
                };
        }
    };

    const handleUpgrade = (newPlan) => {
        router.post(
            route("clinic.subscription.upgrade"),
            {
                new_plan: newPlan,
                duration_months: selectedDuration,
                message: `Upgrade request from ${clinic.subscription_plan} to ${newPlan} for ${selectedDuration} month(s)`,
            },
            {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        alert(page.props.flash.success);
                    } else if (page.props.flash?.error) {
                        alert("Error: " + page.props.flash.error);
                    }
                },
                onError: (errors) => {
                    console.error("Upgrade request failed:", errors);
                    alert(
                        "Upgrade request failed. Please try again or contact support."
                    );
                },
            }
        );
    };

    const handleRenewal = () => {
        router.post(
            route("clinic.subscription.renewal"),
            {
                duration_months: selectedDuration,
                message: `Renewal request for ${selectedDuration} month(s)`,
            },
            {
                onSuccess: (page) => {
                    if (page.props.flash?.success) {
                        alert(page.props.flash.success);
                    } else if (page.props.flash?.error) {
                        alert("Error: " + page.props.flash.error);
                    }
                },
                onError: (errors) => {
                    console.error("Renewal request failed:", errors);
                    alert(
                        "Renewal request failed. Please try again or contact support."
                    );
                },
            }
        );
    };

    const planInfo = getPlanInfo(clinic.subscription_plan);
    const statusInfo = getStatusInfo();
    const usageStats = calculateUsageStats();

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Subscription Management" />

            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-xl shadow-xl mb-6">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <Crown className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Subscription Management
                                    </h1>
                                    <p className="text-blue-100 text-sm">
                                        Manage your Smile Suite subscription and
                                        billing
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm ${statusInfo.bgColor} ${statusInfo.borderColor}`}
                                >
                                    {statusInfo.icon}
                                    <span
                                        className={`font-medium text-sm ${statusInfo.color}`}
                                    >
                                        {statusInfo.text}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning Banner */}
                <SubscriptionWarningBanner clinic={clinic} />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Current Plan & Usage */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Current Plan Card */}
                        <Card className="shadow-xl rounded-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-4">
                                <CardTitle className="flex items-center gap-3 text-lg text-white">
                                    <div
                                        className={`p-2 rounded-lg bg-gradient-to-r ${planInfo.color} text-white shadow-lg`}
                                    >
                                        {planInfo.icon}
                                    </div>
                                    Current Plan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* Plan Overview */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {planInfo.name}
                                            </h3>
                                            <p className="text-gray-600">
                                                {clinic.subscription_plan ===
                                                "trial"
                                                    ? "Free trial period"
                                                    : `₱${planInfo.price.toLocaleString()}/${
                                                          planInfo.period
                                                      }`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-1">
                                                Next Payment
                                            </div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {clinic.next_payment_at
                                                    ? format(
                                                          new Date(
                                                              clinic.next_payment_at
                                                          ),
                                                          "MMM d, yyyy"
                                                      )
                                                    : "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Plan Features */}
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Plan Features
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {planInfo.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Subscription Details */}
                                    {clinic.subscription_start_date && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-900 mb-3">
                                                Subscription Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="text-xs text-gray-600 mb-1">
                                                        Start Date
                                                    </div>
                                                    <div className="font-semibold text-sm text-gray-900">
                                                        {format(
                                                            new Date(
                                                                clinic.subscription_start_date
                                                            ),
                                                            "MMM d, yyyy"
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="text-xs text-gray-600 mb-1">
                                                        End Date
                                                    </div>
                                                    <div className="font-semibold text-sm text-gray-900">
                                                        {clinic.subscription_end_date
                                                            ? format(
                                                                  new Date(
                                                                      clinic.subscription_end_date
                                                                  ),
                                                                  "MMM d, yyyy"
                                                              )
                                                            : "N/A"}
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="text-xs text-gray-600 mb-1">
                                                        Last Payment
                                                    </div>
                                                    <div className="font-semibold text-sm text-gray-900">
                                                        {clinic.last_payment_at
                                                            ? format(
                                                                  new Date(
                                                                      clinic.last_payment_at
                                                                  ),
                                                                  "MMM d, yyyy"
                                                              )
                                                            : "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        {clinic.subscription_plan ===
                                        "trial" ? (
                                            <Button
                                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                                onClick={() =>
                                                    handleUpgrade("premium")
                                                }
                                            >
                                                <Crown className="w-4 h-4 mr-2" />
                                                Upgrade to Premium
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                                    onClick={() =>
                                                        setShowRenewalModal(
                                                            true
                                                        )
                                                    }
                                                >
                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                    Renew Subscription
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                                                    onClick={() =>
                                                        setShowUpgradeModal(
                                                            true
                                                        )
                                                    }
                                                >
                                                    <TrendingUp className="w-4 h-4 mr-2" />
                                                    Upgrade Plan
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Statistics */}
                        <Card className="shadow-xl rounded-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 py-4">
                                <CardTitle className="flex items-center gap-3 text-lg text-white">
                                    <div className="p-2 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40 shadow-lg">
                                        <BarChart3 className="h-5 w-5 text-white" />
                                    </div>
                                    Usage Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Patients */}
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-blue-900">
                                                    {
                                                        usageStats.patients
                                                            .current
                                                    }
                                                </div>
                                                <div className="text-xs text-blue-600">
                                                    /{" "}
                                                    {usageStats.patients.limit}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-blue-700">
                                                    Patients
                                                </span>
                                                <span className="font-semibold text-blue-900">
                                                    {Math.round(
                                                        usageStats.patients
                                                            .percentage
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    usageStats.patients
                                                        .percentage
                                                }
                                                className="h-1.5 bg-blue-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Staff */}
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-purple-500 rounded-lg">
                                                <Building2 className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-purple-900">
                                                    {usageStats.staff.current}
                                                </div>
                                                <div className="text-xs text-purple-600">
                                                    / {usageStats.staff.limit}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-purple-700">
                                                    Staff
                                                </span>
                                                <span className="font-semibold text-purple-900">
                                                    {Math.round(
                                                        usageStats.staff
                                                            .percentage
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    usageStats.staff.percentage
                                                }
                                                className="h-1.5 bg-purple-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Storage */}
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-orange-500 rounded-lg">
                                                <Package className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-orange-900">
                                                    {usageStats.storage.current}
                                                    GB
                                                </div>
                                                <div className="text-xs text-orange-600">
                                                    / {usageStats.storage.limit}
                                                    GB
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-orange-700">
                                                    Storage
                                                </span>
                                                <span className="font-semibold text-orange-900">
                                                    {Math.round(
                                                        usageStats.storage
                                                            .percentage
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    usageStats.storage
                                                        .percentage
                                                }
                                                className="h-1.5 bg-orange-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Appointments */}
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="p-2 bg-green-500 rounded-lg">
                                                <Calendar className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-green-900">
                                                    {
                                                        usageStats.appointments
                                                            .current
                                                    }
                                                </div>
                                                <div className="text-xs text-green-600">
                                                    Total
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-green-700">
                                                    Appointments
                                                </span>
                                                <span className="font-semibold text-green-900">
                                                    This Month
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    usageStats.appointments
                                                        .percentage
                                                }
                                                className="h-1.5 bg-green-200"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Sidebar */}
                    <div className="xl:col-span-1 space-y-4">
                        {/* Quick Actions */}
                        <Card className="shadow-xl rounded-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 py-3">
                                <CardTitle className="flex items-center gap-2 text-base text-white">
                                    <div className="p-1.5 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40">
                                        <Zap className="h-4 w-4 text-white" />
                                    </div>
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-10 border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                                >
                                    <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                                    <div className="text-left">
                                        <div className="font-medium text-sm">
                                            Update Payment
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Change payment method
                                        </div>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-10 border-2 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                                >
                                    <History className="w-4 h-4 mr-2 text-green-600" />
                                    <div className="text-left">
                                        <div className="font-medium text-sm">
                                            Billing History
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            View past invoices
                                        </div>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-10 border-2 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                                >
                                    <Download className="w-4 h-4 mr-2 text-purple-600" />
                                    <div className="text-left">
                                        <div className="font-medium text-sm">
                                            Export Data
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Download reports
                                        </div>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start h-10 border-2 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
                                >
                                    <Settings className="w-4 h-4 mr-2 text-orange-600" />
                                    <div className="text-left">
                                        <div className="font-medium text-sm">
                                            Settings
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Manage preferences
                                        </div>
                                    </div>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Support */}
                        <Card className="shadow-xl rounded-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 py-3">
                                <CardTitle className="flex items-center gap-2 text-base text-white">
                                    <div className="p-1.5 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40">
                                        <Bell className="h-4 w-4 text-white" />
                                    </div>
                                    Need Help?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div className="space-y-2">
                                    <a
                                        href="mailto:support@smilesuite.com"
                                        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                    >
                                        <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900">
                                                Email Support
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                support@smilesuite.com
                                            </p>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </a>

                                    <a
                                        href="tel:+631234567890"
                                        className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all duration-200 group"
                                    >
                                        <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                            <Phone className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900">
                                                Phone Support
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                +63 123 456 7890
                                            </p>
                                        </div>
                                        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-green-600 transition-colors" />
                                    </a>
                                </div>

                                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-3 h-3 text-blue-600" />
                                        <span className="font-medium text-sm text-blue-900">
                                            Support Hours
                                        </span>
                                    </div>
                                    <p className="text-xs text-blue-800">
                                        Monday-Friday, 8 AM - 6 PM (PHT)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Available Plans */}
                        <Card className="shadow-xl rounded-xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 py-3">
                                <CardTitle className="flex items-center gap-2 text-base text-white">
                                    <div className="p-1.5 rounded-lg bg-white/25 backdrop-blur-sm border border-white/40">
                                        <Target className="h-4 w-4 text-white" />
                                    </div>
                                    Available Plans
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                {Object.entries({
                                    basic: getPlanInfo("basic"),
                                    premium: getPlanInfo("premium"),
                                    enterprise: getPlanInfo("enterprise"),
                                }).map(([key, plan]) => (
                                    <div
                                        key={key}
                                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                            clinic.subscription_plan === key
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`p-1.5 rounded-lg bg-gradient-to-r ${plan.color} text-white`}
                                                >
                                                    {plan.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm text-gray-900">
                                                        {plan.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        ₱
                                                        {plan.price.toLocaleString()}
                                                        /month
                                                    </p>
                                                </div>
                                            </div>
                                            {plan.popular && (
                                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                                                    Popular
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
