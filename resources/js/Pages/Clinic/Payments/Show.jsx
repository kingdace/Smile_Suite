import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    DollarSign,
    User,
    Stethoscope,
    Calendar,
    CreditCard,
    CheckCircle,
    ArrowLeft,
    Edit,
    Printer,
    Receipt,
    Clock,
    AlertCircle,
    ShieldCheck,
    HelpCircle,
    Banknote,
    Building,
    Phone,
    Mail,
    MapPin,
    TrendingUp,
    FileText,
    RefreshCw,
    X,
    Eye,
    Download,
} from "lucide-react";

export default function Show({ auth, payment, relatedPayments = [] }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                className: "bg-green-100 text-green-700 border-green-300",
                icon: CheckCircle,
            },
            pending: {
                className: "bg-yellow-100 text-yellow-700 border-yellow-300",
                icon: Clock,
            },
            failed: {
                className: "bg-red-100 text-red-700 border-red-300",
                icon: AlertCircle,
            },
            refunded: {
                className: "bg-gray-100 text-gray-700 border-gray-300",
                icon: RefreshCw,
            },
            cancelled: {
                className: "bg-red-100 text-red-700 border-red-300",
                icon: X,
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const IconComponent = config.icon;

        return (
            <Badge
                variant="outline"
                className={`font-medium ${config.className}`}
            >
                <IconComponent className="h-3 w-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
                return <FileText className="h-4 w-4 text-orange-500" />;
            case "other":
                return <HelpCircle className="h-4 w-4 text-gray-400" />;
            default:
                return <Banknote className="h-4 w-4 text-gray-400" />;
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

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Payment Details" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-8 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                    <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/3 rounded-full -translate-y-10 -translate-x-10"></div>

                    <div className="relative px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/25 rounded-3xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <DollarSign className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Payment Details
                                    </h1>
                                    <p className="text-blue-100 text-base font-medium">
                                        {payment.patient
                                            ? `${payment.patient.first_name} ${payment.patient.last_name}`
                                            : "Payment"}{" "}
                                        - Complete payment information
                                    </p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="text-blue-200 text-sm">
                                            Reference:
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="bg-white/20 border-white/30 text-white font-mono"
                                        >
                                            {payment.reference_number || "N/A"}
                                        </Badge>
                                        <span className="text-blue-200 text-sm">
                                            Amount:
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="bg-green-500/20 border-green-400/30 text-green-100"
                                        >
                                            {formatCurrency(payment.amount)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("clinic.payments.edit", [
                                        auth.clinic?.id,
                                        payment.id,
                                    ])}
                                >
                                    <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white text-base px-6 py-3 rounded-xl transition-all duration-300">
                                        <Edit className="h-5 w-5" />
                                        Edit Payment
                                    </Button>
                                </Link>
                                <a
                                    href={route("clinic.payments.receipt", {
                                        clinic: auth.clinic?.id,
                                        payment: payment.id,
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-3 rounded-xl transition-all duration-300">
                                        <Printer className="h-5 w-5" />
                                        Print Receipt
                                    </Button>
                                </a>
                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="gap-2 text-base px-6 py-3 rounded-xl transition-all duration-300 border backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-8 -mt-12 pb-16">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="xl:col-span-3 space-y-8">
                            {/* Payment Information */}
                            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50 px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                            <DollarSign className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-gray-900">
                                                Payment Information
                                            </CardTitle>
                                            <p className="text-base text-gray-600">
                                                Complete payment details and
                                                transaction information
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Patient
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {payment.patient
                                                    ? `${payment.patient.first_name} ${payment.patient.last_name}`
                                                    : "Not specified"}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4" />
                                                Treatment
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {payment.treatment?.name ||
                                                    "Not specified"}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Payment Date
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {formatDate(
                                                    payment.payment_date
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                <Receipt className="h-4 w-4" />
                                                Reference Number
                                            </dt>
                                            <dd className="text-lg font-mono text-gray-900">
                                                {payment.reference_number ||
                                                    "Not specified"}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                {getMethodIcon(
                                                    payment.payment_method
                                                )}
                                                Payment Method
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {getMethodLabel(
                                                    payment.payment_method
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Category
                                            </dt>
                                            <dd className="text-lg font-semibold text-gray-900">
                                                {getCategoryLabel(
                                                    payment.category
                                                )}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500 mb-2">
                                                Payment Status
                                            </dt>
                                            <dd className="text-lg">
                                                {getStatusBadge(payment.status)}
                                            </dd>
                                        </div>

                                        {payment.gcash_reference && (
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                    <div className="h-4 w-4 bg-blue-400 rounded flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">
                                                            G
                                                        </span>
                                                    </div>
                                                    GCash Reference
                                                </dt>
                                                <dd className="text-lg font-mono text-gray-900">
                                                    {payment.gcash_reference}
                                                </dd>
                                            </div>
                                        )}
                                    </div>

                                    {/* Amount Display */}
                                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                        <div className="text-center">
                                            <dt className="text-sm font-medium text-gray-600 mb-2">
                                                Amount Paid
                                            </dt>
                                            <dd className="text-4xl font-bold text-green-600">
                                                {formatCurrency(payment.amount)}
                                            </dd>
                                            {payment.currency &&
                                                payment.currency !== "PHP" && (
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Currency:{" "}
                                                        {payment.currency}
                                                    </p>
                                                )}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {payment.notes && (
                                        <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                                            <dt className="text-sm font-medium text-gray-500 mb-3">
                                                Additional Notes
                                            </dt>
                                            <dd className="text-gray-900 leading-relaxed">
                                                {payment.notes}
                                            </dd>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Related Payments */}
                            {relatedPayments.length > 0 && (
                                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-purple-50/30 to-violet-50/20 border-b border-gray-200/50 px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                <Receipt className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-gray-900">
                                                    Related Payments
                                                </CardTitle>
                                                <p className="text-base text-gray-600">
                                                    Other payments from the same
                                                    patient
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            {relatedPayments.map(
                                                (relatedPayment) => (
                                                    <div
                                                        key={relatedPayment.id}
                                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <DollarSign className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formatCurrency(
                                                                        relatedPayment.amount
                                                                    )}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {formatDate(
                                                                        relatedPayment.payment_date
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            {getStatusBadge(
                                                                relatedPayment.status
                                                            )}
                                                            <Link
                                                                href={route(
                                                                    "clinic.payments.show",
                                                                    [
                                                                        auth
                                                                            .clinic
                                                                            ?.id,
                                                                        relatedPayment.id,
                                                                    ]
                                                                )}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Quick Actions */}
                            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-purple-50/30 to-violet-50/20 border-b border-gray-200/50 px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                            <Edit className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Quick Actions
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Manage this payment
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <Link
                                            href={route(
                                                "clinic.payments.edit",
                                                [auth.clinic?.id, payment.id]
                                            )}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Payment
                                            </Button>
                                        </Link>
                                        <a
                                            href={route(
                                                "clinic.payments.receipt",
                                                {
                                                    clinic: auth.clinic?.id,
                                                    payment: payment.id,
                                                }
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Printer className="h-4 w-4 mr-2" />
                                                Print Receipt
                                            </Button>
                                        </a>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                // Download functionality
                                                const receiptUrl = route(
                                                    "clinic.payments.receipt",
                                                    {
                                                        clinic: auth.clinic?.id,
                                                        payment: payment.id,
                                                    }
                                                );
                                                window.open(
                                                    receiptUrl,
                                                    "_blank"
                                                );
                                            }}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Receipt
                                        </Button>
                                        <Link
                                            href={route(
                                                "clinic.payments.index",
                                                [auth.clinic?.id]
                                            )}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Back to Payments
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Summary */}
                            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-green-50/30 to-emerald-50/20 border-b border-gray-200/50 px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                            <Receipt className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Payment Summary
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Transaction overview
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Payment ID:
                                            </span>
                                            <span className="font-mono text-sm text-gray-900">
                                                #{payment.id}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Created:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {formatDateTime(
                                                    payment.created_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Last Updated:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {formatDateTime(
                                                    payment.updated_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Status:
                                            </span>
                                            <span className="font-medium">
                                                {getStatusBadge(payment.status)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Method:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {getMethodLabel(
                                                    payment.payment_method
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Category:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {getCategoryLabel(
                                                    payment.category
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Patient Information */}
                            {payment.patient && (
                                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50 px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                                <User className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Patient Information
                                                </CardTitle>
                                                <p className="text-sm text-gray-600">
                                                    Contact details
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-900 font-medium">
                                                    {payment.patient.first_name}{" "}
                                                    {payment.patient.last_name}
                                                </span>
                                            </div>
                                            {payment.patient.phone && (
                                                <div className="flex items-center gap-3">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-900">
                                                        {payment.patient.phone}
                                                    </span>
                                                </div>
                                            )}
                                            {payment.patient.email && (
                                                <div className="flex items-center gap-3">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-900">
                                                        {payment.patient.email}
                                                    </span>
                                                </div>
                                            )}
                                            {payment.patient.address && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                                    <span className="text-gray-900 text-sm">
                                                        {
                                                            payment.patient
                                                                .address
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
