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
import { CheckCircle, Info } from "lucide-react";

export default function ClinicRegisterSuccess({ request }) {
    return (
        <>
            <Head title="Registration Request Submitted" />
            <SiteHeader />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Soft SVG background pattern for consistency */}
                <svg
                    className="absolute left-0 top-0 w-full h-full opacity-20 pointer-events-none"
                    width="100%"
                    height="100%"
                    viewBox="0 0 800 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="700" cy="100" r="80" fill="#bae6fd" />
                    <circle cx="100" cy="500" r="120" fill="#c7d2fe" />
                    <rect
                        x="300"
                        y="350"
                        width="200"
                        height="80"
                        rx="40"
                        fill="#e0e7ff"
                    />
                </svg>
                <div className="max-w-2xl w-full space-y-8 relative z-10">
                    <div className="text-center mb-2">
                        <div className="flex justify-center items-center gap-2 mb-2">
                            <CheckCircle className="w-10 h-10 text-green-500 animate-bounce" />
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                Registration Request Submitted!
                            </h2>
                        </div>
                        <p className="mt-2 text-base text-gray-600">
                            Thank you for your interest in Smile Suite
                        </p>
                    </div>
                    <Card className="shadow-xl rounded-2xl border border-blue-100 bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <Info className="w-6 h-6 text-blue-400" />
                                <CardTitle className="text-2xl font-bold text-blue-700">
                                    What happens next?
                                </CardTitle>
                            </div>
                            <CardDescription className="text-gray-700">
                                Your clinic registration request has been
                                received and is being reviewed.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">
                                    Request Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Clinic Name:
                                        </span>
                                        <span className="font-medium">
                                            {request.clinic_name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Contact Person:
                                        </span>
                                        <span className="font-medium">
                                            {request.contact_person}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Email:
                                        </span>
                                        <span className="font-medium">
                                            {request.email}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Subscription Plan:
                                        </span>
                                        <span className="font-medium capitalize">
                                            {request.subscription_plan}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Monthly Cost:
                                        </span>
                                        <span className="font-medium">
                                            ${request.subscription_amount}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">
                                    Next Steps:
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                                                <span className="text-sm font-medium text-blue-600">
                                                    1
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-700">
                                                <strong>Review Process:</strong>{" "}
                                                Our team will review your
                                                application within 24-48 hours.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                                                <span className="text-sm font-medium text-blue-600">
                                                    2
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-700">
                                                <strong>
                                                    Payment Processing:
                                                </strong>{" "}
                                                If approved, you'll receive
                                                payment instructions.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                                                <span className="text-sm font-medium text-blue-600">
                                                    3
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-700">
                                                <strong>Account Setup:</strong>{" "}
                                                After payment, you'll receive an
                                                email with setup instructions.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                                                <span className="text-sm font-medium text-blue-600">
                                                    4
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-700">
                                                <strong>Go Live:</strong>{" "}
                                                Complete your clinic setup and
                                                start using Smile Suite!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">
                                            Important Note
                                        </h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                Please check your email (
                                                {request.email}) for a
                                                confirmation message. All future
                                                communications about your
                                                application will be sent to this
                                                email address.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                        <Link href="/">
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                ← Back to Home
                            </Button>
                        </Link>
                        <Link href={route("login")}>
                            <Button className="w-full sm:w-auto">
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
