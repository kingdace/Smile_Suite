import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    DollarSign,
    Calendar,
    User,
    Stethoscope,
    Receipt,
    Banknote,
    CreditCard,
    ShieldCheck,
    HelpCircle,
    Printer,
    Download,
    ArrowLeft,
    Building,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";
import { format } from "date-fns";

export default function PaymentReceipt({ clinic, payment }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), "MMMM dd, yyyy");
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                className: "bg-green-100 text-green-700 border-green-300",
                icon: "✓",
            },
            pending: {
                className: "bg-yellow-100 text-yellow-700 border-yellow-300",
                icon: "⏳",
            },
            failed: {
                className: "bg-red-100 text-red-700 border-red-300",
                icon: "✗",
            },
            refunded: {
                className: "bg-gray-100 text-gray-700 border-gray-300",
                icon: "↻",
            },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Badge
                variant="outline"
                className={`font-medium ${config.className}`}
            >
                {config.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case "cash":
                return <Banknote className="h-4 w-4 text-green-500" />;
            case "credit_card":
            case "debit_card":
                return <CreditCard className="h-4 w-4 text-blue-500" />;
            case "insurance":
                return <ShieldCheck className="h-4 w-4 text-purple-500" />;
            case "gcash":
                return (
                    <div className="h-4 w-4 bg-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                    </div>
                );
            case "bank_transfer":
                return <Building className="h-4 w-4 text-indigo-500" />;
            case "check":
                return <Receipt className="h-4 w-4 text-orange-500" />;
            default:
                return <HelpCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    const getMethodLabel = (method) => {
        return method
            .replace("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const getCategoryLabel = (category) => {
        if (!category) return "Not specified";
        return category.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Implementation for PDF download
        alert("PDF download functionality will be implemented");
    };

    return (
        <>
            <Head title={`Payment Receipt - ${payment.reference_number}`} />

            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden bg-gray-50 min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Payment
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleDownload}
                                variant="outline"
                                className="gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                            <Button onClick={handlePrint} className="gap-2">
                                <Printer className="h-4 w-4" />
                                Print Receipt
                            </Button>
                        </div>
                    </div>

                    {/* Receipt Content */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Receipt Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-lg">
                                        <Building className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">
                                            {clinic.name}
                                        </h1>
                                        <p className="text-blue-100">
                                            Payment Receipt
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">
                                        {formatCurrency(payment.amount)}
                                    </div>
                                    <div className="text-blue-100">
                                        Total Amount
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Receipt Details */}
                        <div className="p-8">
                            {/* Payment Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Receipt className="h-5 w-5 text-blue-600" />
                                        Payment Information
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Reference Number:
                                            </span>
                                            <span className="font-mono font-medium">
                                                {payment.reference_number}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment Date:
                                            </span>
                                            <span className="font-medium">
                                                {formatDate(
                                                    payment.payment_date
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Status:
                                            </span>
                                            <span>
                                                {getStatusBadge(payment.status)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Payment Method:
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {getMethodIcon(
                                                    payment.payment_method
                                                )}
                                                <span className="font-medium">
                                                    {getMethodLabel(
                                                        payment.payment_method
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        {payment.category && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Category:
                                                </span>
                                                <span className="font-medium">
                                                    {getCategoryLabel(
                                                        payment.category
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {payment.payment_method === "gcash" &&
                                            payment.gcash_reference && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        GCash Reference:
                                                    </span>
                                                    <span className="font-mono font-medium">
                                                        {
                                                            payment.gcash_reference
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Patient Information
                                    </h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Patient Name:
                                            </span>
                                            <span className="font-medium">
                                                {payment.patient?.first_name}{" "}
                                                {payment.patient?.last_name}
                                            </span>
                                        </div>
                                        {payment.patient?.phone_number && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Phone:
                                                </span>
                                                <span className="font-medium">
                                                    {
                                                        payment.patient
                                                            .phone_number
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {payment.patient?.email && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Email:
                                                </span>
                                                <span className="font-medium">
                                                    {payment.patient.email}
                                                </span>
                                            </div>
                                        )}
                                        {payment.treatment && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Treatment:
                                                </span>
                                                <span className="font-medium">
                                                    {payment.treatment.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Amount Breakdown */}
                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                    Amount Breakdown
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            Payment Amount:
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {formatCurrency(payment.amount)}
                                        </span>
                                    </div>
                                    {payment.currency &&
                                        payment.currency !== "PHP" && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                Currency: {payment.currency}
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Clinic Information */}
                            <div className="border-t border-gray-200 pt-6 mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Building className="h-5 w-5 text-blue-600" />
                                    Clinic Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">
                                                {clinic.name}
                                            </span>
                                        </div>
                                        {clinic.address && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                                <span className="text-gray-600">
                                                    {clinic.address}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        {clinic.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">
                                                    {clinic.phone}
                                                </span>
                                            </div>
                                        )}
                                        {clinic.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-600">
                                                    {clinic.email}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {payment.notes && (
                                <div className="border-t border-gray-200 pt-6 mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Notes
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700">
                                            {payment.notes}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="border-t border-gray-200 pt-6">
                                <div className="text-center text-gray-500 text-sm">
                                    <p>Thank you for your payment!</p>
                                    <p className="mt-1">
                                        Receipt generated on{" "}
                                        {formatDate(new Date())} at{" "}
                                        {new Date().toLocaleTimeString()}
                                    </p>
                                    {payment.received_by && (
                                        <p className="mt-1">
                                            Received by:{" "}
                                            {payment.receivedBy?.name ||
                                                "Staff Member"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    .print\\:hidden {
                        display: none !important;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .bg-white {
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </>
    );
}
