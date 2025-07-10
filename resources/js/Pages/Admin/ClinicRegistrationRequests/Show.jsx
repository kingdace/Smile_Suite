import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    MapPin,
    Phone,
    Mail,
    FileText,
    Building,
} from "lucide-react";
import { Tooltip } from "@/Components/ui/tooltip";

export default function Show({ auth, request }) {
    const [adminNotes, setAdminNotes] = useState(request.admin_notes || "");
    const [paymentStatus, setPaymentStatus] = useState(request.payment_status);
    const [isProcessing, setIsProcessing] = useState(false);

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
        };
        return (
            <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
                {status}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-800",
            paid: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
        };
        return (
            <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
                {status}
            </Badge>
        );
    };

    const handleApprove = () => {
        if (
            !confirm(
                "Are you sure you want to approve this clinic registration request?"
            )
        ) {
            return;
        }

        setIsProcessing(true);
        router.patch(
            route("admin.clinic-requests.approve", request.id),
            {
                admin_notes: adminNotes,
            },
            {
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const handleReject = () => {
        if (
            !confirm(
                "Are you sure you want to reject this clinic registration request?"
            )
        ) {
            return;
        }

        setIsProcessing(true);
        router.patch(
            route("admin.clinic-requests.reject", request.id),
            {
                admin_notes: adminNotes,
            },
            {
                onFinish: () => setIsProcessing(false),
            }
        );
    };

    const handlePaymentStatusUpdate = () => {
        console.log("Payment status update clicked");
        console.log("Current payment status:", request.payment_status);
        console.log("Selected payment status:", paymentStatus);
        console.log("Is processing:", isProcessing);

        setIsProcessing(true);
        router.patch(
            route("admin.clinic-requests.payment-status", request.id),
            {
                payment_status: paymentStatus,
            },
            {
                onFinish: () => {
                    console.log("Payment status update finished");
                    setIsProcessing(false);
                },
                onError: (errors) => {
                    console.error("Payment status update error:", errors);
                    setIsProcessing(false);
                },
            }
        );
    };

    const canBeApproved =
        request.status === "pending" &&
        request.payment_status === "paid" &&
        !request.is_expired;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head
                title={`Clinic Registration Request - ${request.clinic_name}`}
            />

            <div className="py-10 min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link
                            href={route("admin.clinic-requests.index")}
                            className="inline-block"
                        >
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 shadow-sm border-blue-200 bg-white hover:bg-blue-50"
                            >
                                <ArrowLeft className="h-4 w-4 text-blue-400" />
                                Back to Requests
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Clinic Information */}
                            <Card className="shadow-md rounded-xl border-l-4 border-blue-200 border-t border-r border-b border-gray-200 bg-white">
                                <CardHeader className="border-b border-gray-100 pb-3 flex flex-row items-center gap-3">
                                    <span className="bg-blue-100 p-2 rounded-full">
                                        <Building className="h-5 w-5 text-blue-500" />
                                    </span>
                                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                        Clinic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {request.clinic_name}
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            {request.description ||
                                                "No description provided"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Mail className="h-4 w-4 text-blue-400" />
                                            <span>{request.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone className="h-4 w-4 text-blue-400" />
                                            <span>{request.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 md:col-span-2 text-gray-700">
                                            <MapPin className="h-4 w-4 text-blue-400" />
                                            <span>{request.address}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-1">
                                                Contact Person
                                            </h4>
                                            <p className="text-gray-800">
                                                {request.contact_person}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-1">
                                                License Number
                                            </h4>
                                            <p className="text-gray-800">
                                                {request.license_number}
                                            </p>
                                        </div>
                                    </div>

                                    {request.message && (
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-1">
                                                Additional Message
                                            </h4>
                                            <p className="text-gray-600">
                                                {request.message}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Subscription Details */}
                            <Card className="shadow-md rounded-xl border-l-4 border-green-200 border-t border-r border-b border-gray-200 bg-white">
                                <CardHeader className="border-b border-gray-100 pb-3 flex flex-row items-center gap-3">
                                    <span className="bg-green-100 p-2 rounded-full">
                                        <DollarSign className="h-5 w-5 text-green-500" />
                                    </span>
                                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                        Subscription Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-600">
                                                Plan
                                            </h4>
                                            <Badge
                                                variant="outline"
                                                className="capitalize mt-1 border-green-300 bg-green-50 text-green-700 flex items-center gap-1"
                                            >
                                                <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                                                {request.subscription_plan}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600">
                                                Amount
                                            </h4>
                                            <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                                                <DollarSign className="h-5 w-5 text-green-400" />
                                                ₱
                                                {parseFloat(
                                                    request.subscription_amount
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status Information */}
                            <Card className="shadow-md rounded-xl border-l-4 border-yellow-200 border-t border-r border-b border-gray-200 bg-white">
                                <CardHeader className="border-b border-gray-100 pb-3 flex flex-row items-center gap-3">
                                    <span className="bg-yellow-100 p-2 rounded-full">
                                        <Clock className="h-5 w-5 text-yellow-500" />
                                    </span>
                                    <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                                        Status Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-600">
                                                Request Status
                                            </h4>
                                            <div className="mt-1 flex items-center gap-2">
                                                {getStatusBadge(request.status)}
                                                {request.status ===
                                                    "pending" && (
                                                    <Clock className="h-4 w-4 text-yellow-400" />
                                                )}
                                                {request.status ===
                                                    "approved" && (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                                {request.status ===
                                                    "rejected" && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600">
                                                Payment Status
                                            </h4>
                                            <div className="mt-1 flex items-center gap-2">
                                                {getPaymentStatusBadge(
                                                    request.payment_status
                                                )}
                                                {request.payment_status ===
                                                    "pending" && (
                                                    <Clock className="h-4 w-4 text-yellow-400" />
                                                )}
                                                {request.payment_status ===
                                                    "paid" && (
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                )}
                                                {request.payment_status ===
                                                    "failed" && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-600">
                                                Submitted
                                            </h4>
                                            <p className="text-gray-800">
                                                {formatDate(request.created_at)}
                                            </p>
                                        </div>
                                        {request.approved_at && (
                                            <div>
                                                <h4 className="font-medium text-gray-600">
                                                    Approved
                                                </h4>
                                                <p className="text-gray-800">
                                                    {formatDate(
                                                        request.approved_at
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                        {request.expires_at && (
                                            <div className="md:col-span-2">
                                                <h4 className="font-medium text-gray-600">
                                                    Expires
                                                </h4>
                                                <p
                                                    className={
                                                        request.is_expired
                                                            ? "text-red-600 font-semibold"
                                                            : "text-gray-800"
                                                    }
                                                >
                                                    {formatDate(
                                                        request.expires_at
                                                    )}
                                                    {request.is_expired &&
                                                        " (Expired)"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Actions */}
                        <div className="space-y-8">
                            {/* Admin Actions */}
                            <Card className="shadow-lg rounded-xl border-l-4 border-purple-200 border-t border-r border-b border-gray-200 bg-white sticky top-24">
                                <CardHeader className="border-b border-gray-100 pb-3 flex flex-row items-center gap-3">
                                    <span className="bg-purple-100 p-2 rounded-full">
                                        <FileText className="h-5 w-5 text-purple-500" />
                                    </span>
                                    <CardTitle className="text-xl font-semibold text-gray-800">
                                        Admin Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-2">
                                    {/* Payment Status Update */}
                                    <div>
                                        <h4 className="font-medium mb-2 text-gray-700">
                                            Confirm Payment Status
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Update when clinic confirms payment
                                        </p>
                                        <div className="flex gap-2">
                                            <Select
                                                value={paymentStatus}
                                                onValueChange={setPaymentStatus}
                                            >
                                                <SelectTrigger className="min-w-[140px]" />
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        Pending Payment
                                                    </SelectItem>
                                                    <SelectItem value="paid">
                                                        Payment Confirmed
                                                    </SelectItem>
                                                    <SelectItem value="failed">
                                                        Payment Failed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Tooltip content="Update payment status">
                                                <Button
                                                    size="sm"
                                                    onClick={
                                                        handlePaymentStatusUpdate
                                                    }
                                                    disabled={
                                                        isProcessing ||
                                                        paymentStatus ===
                                                            request.payment_status
                                                    }
                                                    title={
                                                        paymentStatus ===
                                                        request.payment_status
                                                            ? "No change in payment status"
                                                            : "Update payment status"
                                                    }
                                                    className="bg-primary text-white hover:bg-primary/90"
                                                >
                                                    Update
                                                </Button>
                                            </Tooltip>
                                        </div>
                                        {paymentStatus === "paid" &&
                                            request.payment_status !==
                                                "paid" && (
                                                <p className="text-xs text-green-600 mt-1">
                                                    This will send setup email
                                                    to clinic
                                                </p>
                                            )}
                                    </div>

                                    <Separator />

                                    {/* Admin Notes */}
                                    <div>
                                        <h4 className="font-medium mb-2 text-gray-700">
                                            Admin Notes
                                        </h4>
                                        <Textarea
                                            value={adminNotes}
                                            onChange={(e) =>
                                                setAdminNotes(e.target.value)
                                            }
                                            placeholder="Add notes about this request..."
                                            rows={4}
                                            className="bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                                        />
                                    </div>

                                    <Separator />

                                    {/* Approval/Rejection Actions */}
                                    {request.status === "pending" && (
                                        <div className="space-y-2">
                                            <Tooltip content="Approve and send payment instructions">
                                                <Button
                                                    onClick={handleApprove}
                                                    disabled={isProcessing}
                                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm flex items-center gap-2"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Approve & Send Payment
                                                    Instructions
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Reject request">
                                                <Button
                                                    onClick={handleReject}
                                                    disabled={isProcessing}
                                                    variant="destructive"
                                                    className="w-full font-semibold shadow-sm flex items-center gap-2"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Reject Request
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    )}

                                    {request.status === "approved" &&
                                        request.payment_status ===
                                            "pending" && (
                                            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                                                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                                <p className="text-blue-800 font-semibold">
                                                    Request Approved
                                                </p>
                                                <p className="text-sm text-blue-600 mb-2">
                                                    Payment instructions sent to{" "}
                                                    {request.email}
                                                </p>
                                                <p className="text-xs text-blue-500">
                                                    Waiting for payment
                                                    confirmation
                                                </p>
                                            </div>
                                        )}

                                    {request.status === "approved" &&
                                        request.payment_status === "paid" && (
                                            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                                                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                                <p className="text-green-800 font-semibold">
                                                    Payment Confirmed
                                                </p>
                                                <p className="text-sm text-green-600 mb-2">
                                                    Setup email sent to{" "}
                                                    {request.email}
                                                </p>
                                                <p className="text-xs text-green-500">
                                                    Clinic can now complete
                                                    setup
                                                </p>
                                            </div>
                                        )}

                                    {request.status === "rejected" && (
                                        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                                            <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                                            <p className="text-red-800 font-semibold">
                                                Request Rejected
                                            </p>
                                        </div>
                                    )}

                                    {!canBeApproved &&
                                        request.status === "pending" && (
                                            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                                <p className="text-yellow-800 font-semibold">
                                                    Cannot Approve
                                                </p>
                                                <p className="text-sm text-yellow-600">
                                                    {request.payment_status !==
                                                        "paid" &&
                                                        "Payment not completed"}
                                                    {request.is_expired &&
                                                        "Request has expired"}
                                                </p>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
