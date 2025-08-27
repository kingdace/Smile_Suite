import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import SiteHeader from "@/Components/SiteHeader";
import {
    CheckCircle,
    Info,
    Mail,
    Clock,
    CreditCard,
    Settings,
    Rocket,
    AlertTriangle,
} from "lucide-react";

export default function ClinicRegisterSuccess({ request }) {
    return (
        <>
            <Head title="Registration Request Submitted" />
            <SiteHeader />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Enhanced background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-indigo-100/20 to-purple-100/20"></div>
                <svg
                    className="absolute left-0 top-0 w-full h-full opacity-10 pointer-events-none"
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="700" cy="100" r="80" fill="#3b82f6" />
                    <circle cx="100" cy="500" r="120" fill="#6366f1" />
                    <rect
                        x="300"
                        y="350"
                        width="200"
                        height="80"
                        rx="40"
                        fill="#8b5cf6"
                    />
                    <circle cx="600" cy="200" r="60" fill="#06b6d4" />
                    <circle cx="200" cy="300" r="40" fill="#0ea5e9" />
                </svg>

                <div className="max-w-3xl w-full space-y-8 relative z-10">
                    {/* Enhanced Header */}
                    <div className="text-center mb-6">
                        <div className="flex justify-center items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <CheckCircle className="w-12 h-12 text-green-500 relative z-10 animate-bounce" />
                            </div>
                            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
                                Registration Request Submitted!
                            </h2>
                        </div>
                        <p className="text-lg text-gray-600 font-medium">
                            Thank you for your interest in Smile Suite
                        </p>
                        <div className="mt-2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
                    </div>

                    {/* Main Card */}
                    <Card className="shadow-2xl rounded-3xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Info className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-white">
                                        What happens next?
                                    </CardTitle>
                                    <CardDescription className="text-blue-100 mt-1">
                                        Your clinic registration request has
                                        been received and is being reviewed.
                                    </CardDescription>
                                </div>
                            </div>
                        </div>

                        <CardContent className="p-8 space-y-8">
                            {/* Request Details Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                                <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-white" />
                                    </div>
                                    Request Details
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-xs">
                                                            🏥
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600 font-medium text-sm">
                                                        Clinic Name
                                                    </span>
                                                </div>
                                                <span
                                                    className="font-bold text-gray-900 text-right max-w-[180px] truncate text-sm"
                                                    title={request.clinic_name}
                                                >
                                                    {request.clinic_name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-xs">
                                                            👤
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600 font-medium text-sm">
                                                        Contact Person
                                                    </span>
                                                </div>
                                                <span
                                                    className="font-bold text-gray-900 text-right max-w-[180px] truncate text-sm"
                                                    title={
                                                        request.contact_person
                                                    }
                                                >
                                                    {request.contact_person}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-xs">
                                                            📧
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600 font-medium text-sm">
                                                        Email Address
                                                    </span>
                                                </div>
                                                <span
                                                    className="font-bold text-gray-900 text-right max-w-[180px] truncate text-sm"
                                                    title={request.email}
                                                >
                                                    {request.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-xs">
                                                            📋
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600 font-medium text-sm">
                                                        Subscription Plan
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold capitalize">
                                                        {
                                                            request.subscription_plan
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                                        <span className="text-blue-600 font-bold text-xs">
                                                            💰
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-600 font-medium text-sm">
                                                        Monthly Cost
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    {request.subscription_plan ===
                                                    "basic" ? (
                                                        <>
                                                            <span className="text-xl font-bold text-green-600">
                                                                FREE
                                                            </span>
                                                            <div className="text-xs text-gray-500">
                                                                for 14 days
                                                            </div>
                                                            <div className="text-xs text-amber-600 font-medium">
                                                                Then ₱999/month
                                                            </div>
                                                        </>
                                                    ) : request.subscription_plan ===
                                                      "premium" ? (
                                                        <>
                                                            <span className="text-xl font-bold text-blue-600">
                                                                ₱1,999
                                                            </span>
                                                            <div className="text-xs text-gray-500">
                                                                per month
                                                            </div>
                                                            <div className="text-xs text-blue-600 font-medium">
                                                                Advanced
                                                                features
                                                            </div>
                                                        </>
                                                    ) : request.subscription_plan ===
                                                      "enterprise" ? (
                                                        <>
                                                            <span className="text-xl font-bold text-purple-600">
                                                                ₱2,999
                                                            </span>
                                                            <div className="text-xs text-gray-500">
                                                                per month
                                                            </div>
                                                            <div className="text-xs text-purple-600 font-medium">
                                                                Premium features
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-xl font-bold text-green-600">
                                                                ₱
                                                                {
                                                                    request.subscription_amount
                                                                }
                                                            </span>
                                                            <div className="text-xs text-gray-500">
                                                                per month
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                                                    <span className="text-green-600 font-bold text-xs">
                                                        ✅
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-green-800 text-sm">
                                                        Request Status
                                                    </div>
                                                    <div className="text-xs text-green-600">
                                                        Pending Review
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="space-y-6">
                                <h3 className="font-bold text-gray-900 text-xl flex items-center gap-2">
                                    <Rocket className="w-6 h-6 text-blue-600" />
                                    Next Steps:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-sm font-bold text-white">
                                                        1
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-700 font-medium">
                                                    <span className="text-blue-700 font-bold">
                                                        Review Process:
                                                    </span>{" "}
                                                    Our team will review your
                                                    application within 24-48
                                                    hours.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-sm font-bold text-white">
                                                        2
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-700 font-medium">
                                                    <span className="text-blue-700 font-bold">
                                                        {request.subscription_plan ===
                                                        "basic"
                                                            ? "Trial Setup:"
                                                            : request.subscription_plan ===
                                                              "pro"
                                                            ? "Pro Setup:"
                                                            : request.subscription_plan ===
                                                              "enterprise"
                                                            ? "Enterprise Setup:"
                                                            : "Payment Processing:"}
                                                    </span>{" "}
                                                    {request.subscription_plan ===
                                                    "basic"
                                                        ? "If approved, you'll receive immediate access to your 14-day free trial."
                                                        : request.subscription_plan ===
                                                          "premium"
                                                        ? "If approved, you'll receive payment instructions for Premium plan features."
                                                        : request.subscription_plan ===
                                                          "enterprise"
                                                        ? "If approved, you'll receive payment instructions for Enterprise plan features."
                                                        : "If approved, you'll receive payment instructions."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-sm font-bold text-white">
                                                        3
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-700 font-medium">
                                                    <span className="text-blue-700 font-bold">
                                                        Account Setup:
                                                    </span>{" "}
                                                    {request.subscription_plan ===
                                                    "basic"
                                                        ? "Complete your clinic setup and start using Smile Suite immediately!"
                                                        : request.subscription_plan ===
                                                          "premium"
                                                        ? "After payment, you'll receive setup instructions for Premium plan features."
                                                        : request.subscription_plan ===
                                                          "enterprise"
                                                        ? "After payment, you'll receive setup instructions for Enterprise plan features."
                                                        : "After payment, you'll receive an email with setup instructions."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <span className="text-sm font-bold text-white">
                                                        4
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-700 font-medium">
                                                    <span className="text-blue-700 font-bold">
                                                        {request.subscription_plan ===
                                                        "basic"
                                                            ? "Trial Management:"
                                                            : request.subscription_plan ===
                                                              "premium"
                                                            ? "Premium Features:"
                                                            : request.subscription_plan ===
                                                              "enterprise"
                                                            ? "Enterprise Features:"
                                                            : "Go Live:"}
                                                    </span>{" "}
                                                    {request.subscription_plan ===
                                                    "basic"
                                                        ? "After 14 days, choose to continue with a paid plan or cancel your subscription."
                                                        : request.subscription_plan ===
                                                          "premium"
                                                        ? "Access advanced features like analytics, multi-location support, and priority support."
                                                        : request.subscription_plan ===
                                                          "enterprise"
                                                        ? "Access premium features like custom integrations, dedicated support, and advanced analytics."
                                                        : "Complete your clinic setup and start using Smile Suite!"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trial Information for Basic Plan */}
                            {request.subscription_plan === "basic" && (
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                                <span className="text-green-600 font-bold text-lg">
                                                    🎉
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-green-800 mb-3">
                                                14-Day Free Trial - What You Get
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Full access to all
                                                            Basic features
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Patient management
                                                            system
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Appointment
                                                            scheduling
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Treatment tracking
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Inventory management
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Payment processing
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Email support
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            No setup fees
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Premium Plan Information */}
                            {request.subscription_plan === "premium" && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <span className="text-blue-600 font-bold text-lg">
                                                    🚀
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-blue-800 mb-3">
                                                Premium Plan - Advanced Features
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            All Basic features
                                                            included
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Advanced analytics &
                                                            reporting
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Multi-location
                                                            support
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Priority email
                                                            support
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Custom branding
                                                            options
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Advanced appointment
                                                            features
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Enhanced security
                                                            features
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-blue-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Data export
                                                            capabilities
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enterprise Plan Information */}
                            {request.subscription_plan === "enterprise" && (
                                <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                                <span className="text-purple-600 font-bold text-lg">
                                                    👑
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-purple-800 mb-3">
                                                Enterprise Plan - Premium
                                                Features
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            All Pro features
                                                            included
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Custom integrations
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Dedicated account
                                                            manager
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            24/7 phone support
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Advanced analytics
                                                            dashboard
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            Custom training
                                                            sessions
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>API access</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-purple-600">
                                                            ✅
                                                        </span>
                                                        <span>
                                                            SLA guarantees
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Trial End Information for Basic Plan */}
                            {request.subscription_plan === "basic" && (
                                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <Clock className="w-6 h-6 text-amber-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-amber-800 mb-2">
                                                After Your 14-Day Trial
                                            </h3>
                                            <div className="text-sm text-amber-700 space-y-2">
                                                <p>
                                                    <span className="font-semibold">
                                                        ₱999/month
                                                    </span>{" "}
                                                    - Continue with full access
                                                    to all Basic plan features
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        Easy cancellation
                                                    </span>{" "}
                                                    - Cancel anytime before
                                                    trial ends with no charges
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        No surprises
                                                    </span>{" "}
                                                    - We'll send you reminders 3
                                                    days before your trial ends
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        Upgrade anytime
                                                    </span>{" "}
                                                    - Switch to Premium or
                                                    Enterprise plans for
                                                    additional features
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Important Note */}
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-amber-800 mb-2">
                                            Important Note
                                        </h3>
                                        <div className="text-sm text-amber-700 leading-relaxed">
                                            <p>
                                                Please check your email (
                                                <span className="font-semibold">
                                                    {request.email}
                                                </span>
                                                ) for a confirmation message.
                                                All future communications about
                                                your application will be sent to
                                                this email address.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto px-8 py-3 text-base font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                            >
                                ← Back to Home
                            </Button>
                        </Link>
                        <Link href={route("login")}>
                            <Button className="w-full sm:w-auto px-8 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
