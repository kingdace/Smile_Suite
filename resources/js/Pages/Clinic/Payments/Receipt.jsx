import { Head, router } from "@inertiajs/react";
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
    Package,
    Scissors,
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
        return format(new Date(dateString), "MMM dd, yyyy");
    };

    const formatDateTime = (dateString) => {
        return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
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
                return <Banknote className="h-3 w-3 text-green-500" />;
            case "credit_card":
            case "debit_card":
                return <CreditCard className="h-3 w-3 text-blue-500" />;
            case "insurance":
                return <ShieldCheck className="h-3 w-3 text-purple-500" />;
            case "gcash":
                return (
                    <div className="h-3 w-3 bg-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                    </div>
                );
            case "bank_transfer":
                return <Building className="h-3 w-3 text-indigo-500" />;
            case "check":
                return <Receipt className="h-3 w-3 text-orange-500" />;
            default:
                return <HelpCircle className="h-3 w-3 text-gray-400" />;
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
        // Create a new window for printing and convert to PDF
        const printWindow = window.open("", "_blank");
        const receiptContent =
            document.querySelector(".receipt-container").innerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Receipt - ${payment.reference_number}</title>
                <style>
                    @page { size: 80mm 200mm; margin: 0mm; }
                    * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
                    html, body { margin: 0 !important; padding: 0 !important; background: white !important; font-size: 9px !important; line-height: 1.1 !important; font-family: "Courier New", monospace !important; width: 100% !important; height: 100% !important; color: black !important; }
                    .receipt-container { position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; margin: 0 !important; padding: 0 !important; }
                    .receipt-container * { margin-top: 0 !important; padding-top: 0 !important; }
                    .receipt-container > div:first-child { margin-top: 0 !important; padding-top: 0 !important; }
                    .print\\:hidden { display: none !important; }
                    * { visibility: visible !important; opacity: 1 !important; }
                    div, p, h1, h2, h3, h4, h5, h6, span, strong, em { display: block !important; visibility: visible !important; opacity: 1 !important; }
                    .bg-white { background: white !important; }
                    .rounded-lg { border-radius: 0 !important; }
                    .bg-gradient-to-r { background: white !important; }
                    .shadow-lg { box-shadow: none !important; }
                    .border { border: 1px solid #d1d5db !important; }
                    .border-t { border-top: 1px solid #d1d5db !important; }
                    .border-b { border-bottom: 1px solid #d1d5db !important; }
                    .text-center { text-align: center !important; }
                    .text-right { text-align: right !important; }
                    .font-bold { font-weight: bold !important; }
                    .font-semibold { font-weight: 600 !important; }
                    .text-gray-600 { color: #4b5563 !important; }
                    .text-gray-500 { color: #6b7280 !important; }
                    .text-green-600 { color: #059669 !important; }
                    .flex { display: flex !important; }
                    .justify-between { justify-content: space-between !important; }
                    .items-center { align-items: center !important; }
                    .space-y-1 > * + * { margin-top: 0.25rem !important; }
                    .space-y-2 > * + * { margin-top: 0.5rem !important; }
                    .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
                    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                    .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
                    .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
                    .pt-1 { padding-top: 0.25rem !important; }
                    .pt-2 { padding-top: 0.5rem !important; }
                    .my-1 { margin-top: 0.25rem !important; margin-bottom: 0.25rem !important; }
                    .my-2 { margin-top: 0.5rem !important; margin-bottom: 0.5rem !important; }
                    .mt-1 { margin-top: 0.25rem !important; }
                    .text-sm { font-size: 8px !important; }
                    .text-xs { font-size: 7px !important; }
                    .text-lg { font-size: 10px !important; }
                    .text-2xl { font-size: 11px !important; }
                    .h-3 { height: 0.5rem !important; }
                    .w-3 { width: 0.5rem !important; }
                    .h-4 { height: 0.75rem !important; }
                    .w-4 { width: 0.75rem !important; }
                    .h-6 { height: 1rem !important; }
                    .w-6 { width: 1rem !important; }
                    .w-12 { width: 3rem !important; }
                    .h-12 { height: 3rem !important; }
                    .gap-2 { gap: 0.5rem !important; }
                    .gap-3 { gap: 0.75rem !important; }
                    .space-y-1 { margin-top: 0.25rem !important; }
                    .space-y-2 { margin-top: 0.5rem !important; }
                    .p-6 { padding: 1rem !important; }
                    .pt-4 { padding-top: 0.75rem !important; }
                    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                    .mt-1 { margin-top: 0.25rem !important; }
                </style>
            </head>
            <body>
                ${receiptContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleBackToPayment = () => {
        // Navigate back to the payment show page
        router.visit(`/clinic/${clinic.id}/payments/${payment.id}`);
    };

    // Calculate breakdown
    const getBreakdown = () => {
        const breakdown = [];

        // Service/Treatment cost
        if (payment.treatment) {
            if (payment.treatment.service) {
                breakdown.push({
                    type: "service",
                    name: payment.treatment.service.name,
                    description: "Dental Service",
                    amount: parseFloat(payment.treatment.service.price),
                    icon: <Scissors className="h-3 w-3 text-blue-500" />,
                });
            } else {
                breakdown.push({
                    type: "treatment",
                    name: payment.treatment.name,
                    description: "Treatment Cost",
                    amount: parseFloat(payment.treatment.cost),
                    icon: <Stethoscope className="h-3 w-3 text-green-500" />,
                });
            }
        }

        // Inventory items - detailed breakdown
        if (
            payment.treatment?.inventory_items &&
            payment.treatment.inventory_items.length > 0
        ) {
            payment.treatment.inventory_items.forEach((item, index) => {
                breakdown.push({
                    type: "inventory",
                    name: item.inventory?.name || "Unknown Item",
                    description: `${
                        item.quantity_used
                    } units × ${formatCurrency(item.unit_cost)}`,
                    amount: parseFloat(item.total_cost),
                    icon: <Package className="h-3 w-3 text-orange-500" />,
                });
            });
        }

        // If no breakdown available, show total amount
        if (breakdown.length === 0) {
            breakdown.push({
                type: "total",
                name: "Payment Amount",
                description: "Total Payment",
                amount: parseFloat(payment.amount),
                icon: <DollarSign className="h-3 w-3 text-green-500" />,
            });
        }

        return breakdown;
    };

    const breakdown = getBreakdown();
    const subtotal = breakdown.reduce((sum, item) => sum + item.amount, 0);
    const tax = 0; // Assuming no tax for now
    const total = subtotal + tax;

    return (
        <>
            <Head title={`Payment Receipt - ${payment.reference_number}`} />

            {/* Print Controls - Hidden when printing */}
            <div className="print:hidden bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            onClick={handleBackToPayment}
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
                </div>
            </div>

            {/* Receipt Content - Always visible */}
            <div className="max-w-sm mx-auto p-2 print:max-w-none print:p-0 print:mt-0 print:absolute print:top-0 print:left-0 print:right-0 receipt-container">
                <div className="bg-white print:bg-white overflow-hidden print:shadow-none print:rounded-none print:absolute print:top-0 print:left-0 print:right-0 border border-gray-300 print:border-0">
                    {/* Receipt Header */}
                    <div className="text-center py-2 print:py-1 border-b border-gray-300 print:border-b-0">
                        <h1 className="text-lg font-bold print:text-sm">
                            {clinic.name || "Dental Clinic"}
                        </h1>
                        <p className="text-xs print:text-xs text-gray-600">
                            Payment Receipt
                        </p>
                        <div className="border-t border-gray-300 my-2 print:my-1"></div>
                    </div>

                    {/* Receipt Body */}
                    <div className="px-4 py-2 print:px-2 print:py-1 space-y-2 print:space-y-1">
                        {/* Payment Info */}
                        <div className="text-xs print:text-xs space-y-1 print:space-y-0">
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Receipt #:
                                </span>
                                <span className="font-mono font-semibold">
                                    {payment.reference_number || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-semibold">
                                    {formatDate(payment.payment_date)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="font-semibold">
                                    {payment.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Method:</span>
                                <span className="font-semibold">
                                    {getMethodLabel(payment.payment_method)}
                                </span>
                            </div>
                        </div>

                        {/* Patient Info */}
                        {payment.patient && (
                            <div className="border-t border-gray-300 pt-2 print:pt-1">
                                <div className="text-xs print:text-xs space-y-1 print:space-y-0">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Patient:
                                        </span>
                                        <span className="font-semibold">
                                            {payment.patient.first_name}{" "}
                                            {payment.patient.last_name}
                                        </span>
                                    </div>
                                    {payment.patient.phone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Phone:
                                            </span>
                                            <span className="font-semibold">
                                                {payment.patient.phone}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Treatment Info */}
                        {payment.treatment && (
                            <div className="border-t border-gray-300 pt-2 print:pt-1">
                                <div className="text-xs print:text-xs space-y-1 print:space-y-0">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Treatment:
                                        </span>
                                        <span className="font-semibold">
                                            {payment.treatment.name}
                                        </span>
                                    </div>
                                    {payment.treatment.service && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Service:
                                            </span>
                                            <span className="font-semibold">
                                                {payment.treatment.service.name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Breakdown */}
                        <div className="border-t border-gray-300 pt-2 print:pt-1">
                            <div className="text-xs print:text-xs space-y-1 print:space-y-0">
                                {breakdown.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between"
                                    >
                                        <span className="text-gray-600">
                                            {item.name}:
                                        </span>
                                        <span className="font-semibold">
                                            {formatCurrency(item.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-300 pt-2 print:pt-1">
                            <div className="text-xs print:text-xs space-y-1 print:space-y-0">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Subtotal:
                                    </span>
                                    <span className="font-semibold">
                                        {formatCurrency(subtotal)}
                                    </span>
                                </div>
                                {tax > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Tax:
                                        </span>
                                        <span className="font-semibold">
                                            {formatCurrency(tax)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold border-t border-gray-300 pt-1 print:pt-0">
                                    <span>TOTAL:</span>
                                    <span className="text-lg print:text-sm">
                                        {formatCurrency(payment.amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {payment.notes && (
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    Notes
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {payment.notes}
                                </p>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="border-t border-gray-300 pt-2 print:pt-1 text-center border-b border-gray-300 print:border-b-0">
                            <div className="text-xs print:text-xs text-gray-600 space-y-1 print:space-y-0">
                                <p className="font-semibold">
                                    Thank you for your payment!
                                </p>
                                <p>Generated: {formatDateTime(new Date())}</p>
                                {clinic.phone && <p>Contact: {clinic.phone}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx>{`
                @media print {
                    @page {
                        size: 80mm 200mm;
                        margin: 0mm;
                    }

                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    html,
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        font-size: 9px !important;
                        line-height: 1.1 !important;
                        font-family: "Courier New", monospace !important;
                        width: 100% !important;
                        height: 100% !important;
                        color: black !important;
                        position: relative !important;
                    }

                    /* Ensure receipt content starts at top */
                    .receipt-container {
                        position: absolute !important;
                        top: 0 !important;
                        left: 0 !important;
                        right: 0 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 1 !important;
                    }

                    /* Override any parent container margins/padding */
                    .receipt-container * {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                    }

                    /* Ensure the first element starts at the very top */
                    .receipt-container > div:first-child {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                    }

                    /* Hide print controls when printing */
                    .print\\:hidden {
                        display: none !important;
                    }

                    /* Ensure all content is visible when printing */
                    * {
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    .print\\:hidden {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }

                    .print\\:block {
                        display: block !important;
                    }

                    .print\\:visible {
                        visibility: visible !important;
                    }

                    .print\\:opacity-100 {
                        opacity: 1 !important;
                    }

                    /* Ensure main content is visible */
                    .max-w-2xl {
                        max-width: 100% !important;
                    }

                    .mx-auto {
                        margin-left: auto !important;
                        margin-right: auto !important;
                    }

                    /* Force visibility for all content */
                    div,
                    p,
                    h1,
                    h2,
                    h3,
                    h4,
                    h5,
                    h6,
                    span,
                    strong,
                    em {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    /* Specific styles for receipt content */
                    .bg-white {
                        background: white !important;
                        color: black !important;
                        box-shadow: none !important;
                    }

                    .rounded-lg {
                        border-radius: 0 !important;
                    }

                    .bg-gradient-to-r {
                        background: #2563eb !important;
                    }

                    .text-white {
                        color: white !important;
                    }

                    .text-blue-100 {
                        color: #dbeafe !important;
                    }

                    .border-t {
                        border-top: 1px solid #e5e7eb !important;
                    }

                    .border-b {
                        border-bottom: 1px solid #e5e7eb !important;
                    }

                    .border-gray-100 {
                        border-color: #f3f4f6 !important;
                    }

                    .text-gray-500 {
                        color: #6b7280 !important;
                    }

                    .text-gray-600 {
                        color: #4b5563 !important;
                    }

                    .text-gray-900 {
                        color: #111827 !important;
                    }

                    .text-green-600 {
                        color: #059669 !important;
                    }

                    .font-semibold {
                        font-weight: 600 !important;
                    }

                    .font-bold {
                        font-weight: 700 !important;
                    }

                    .font-mono {
                        font-family: monospace !important;
                    }

                    .space-y-3 > * + * {
                        margin-top: 0.375rem !important;
                    }

                    .space-y-2 > * + * {
                        margin-top: 0.2rem !important;
                    }

                    .space-y-6 > * + * {
                        margin-top: 0.5rem !important;
                    }

                    .gap-2 {
                        gap: 0.25rem !important;
                    }

                    .gap-3 {
                        gap: 0.5rem !important;
                    }

                    .gap-4 {
                        gap: 0.75rem !important;
                    }

                    .p-6 {
                        padding: 0.5rem !important;
                    }

                    .pt-4 {
                        padding-top: 0.375rem !important;
                    }

                    .mb-3 {
                        margin-bottom: 0.5rem !important;
                    }

                    .mb-1 {
                        margin-bottom: 0.25rem !important;
                    }

                    .mt-1 {
                        margin-top: 0.25rem !important;
                    }

                    .text-sm {
                        font-size: 8px !important;
                    }

                    .text-xs {
                        font-size: 7px !important;
                    }

                    .text-lg {
                        font-size: 10px !important;
                    }

                    .text-2xl {
                        font-size: 11px !important;
                    }

                    .h-3 {
                        height: 0.5rem !important;
                    }

                    .w-3 {
                        width: 0.5rem !important;
                    }

                    .h-4 {
                        height: 0.75rem !important;
                    }

                    .w-4 {
                        width: 0.75rem !important;
                    }

                    .h-6 {
                        height: 1rem !important;
                    }

                    .w-6 {
                        width: 1rem !important;
                    }

                    .w-12 {
                        width: 2rem !important;
                    }

                    .h-12 {
                        height: 2rem !important;
                    }

                    .flex {
                        display: flex !important;
                    }

                    .grid {
                        display: grid !important;
                    }

                    .grid-cols-2 {
                        grid-template-columns: repeat(
                            2,
                            minmax(0, 1fr)
                        ) !important;
                    }

                    .items-center {
                        align-items: center !important;
                    }

                    .justify-between {
                        justify-content: space-between !important;
                    }

                    .justify-center {
                        justify-content: center !important;
                    }

                    .text-center {
                        text-align: center !important;
                    }

                    .font-medium {
                        font-weight: 500 !important;
                    }

                    .py-2 {
                        padding-top: 0.25rem !important;
                        padding-bottom: 0.25rem !important;
                    }

                    .last\\:border-b-0:last-child {
                        border-bottom: none !important;
                    }

                    .border-t {
                        border-top: 1px solid #e5e7eb !important;
                    }

                    .pt-2 {
                        padding-top: 0.25rem !important;
                    }

                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }

                    .print\\:rounded-none {
                        border-radius: 0 !important;
                    }
                }
            `}</style>
        </>
    );
}
