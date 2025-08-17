import React from "react";
import QRCode from "react-qr-code";

export default function Receipt({ clinic, payment, auth }) {
    const now = new Date();
    const printDate = now.toLocaleString();
    const receiptUrl = window.location.href;
    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-4 print:py-0 print:bg-white">
            <style>{`
                @media print {
                    @page { size: A5 portrait; margin: 8mm; }
                    body { background: white !important; }
                    .print\:hidden { display: none !important; }
                    .print\:shadow-none { box-shadow: none !important; }
                    .print\:border { border: 1px solid #e5e7eb !important; }
                }
            `}</style>
            <div className="w-full max-w-md border rounded shadow-lg p-4 bg-white relative print:shadow-none print:border">
                {/* Receipt Number */}
                <div className="flex justify-between items-center mb-1">
                    <div className="text-xs text-gray-400">
                        Receipt #: {payment.reference_number}
                    </div>
                </div>
                {/* Clinic Logo and Info - Centered */}
                <div className="flex flex-col items-center mb-2 mt-1 text-center">
                    <img
                        src={clinic.logo_url || "/images/clinic-logo.png"}
                        alt="Clinic Logo"
                        className="h-8 w-8 mb-1 rounded object-cover"
                        onError={(e) => {
                            e.target.src = "/images/clinic-logo.png";
                        }}
                    />
                    <div className="text-base font-bold leading-tight">
                        {clinic.name}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">
                        {clinic.address}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">
                        {clinic.phone}
                    </div>
                    {clinic.email && (
                        <div className="text-xs text-gray-600 leading-tight">
                            {clinic.email}
                        </div>
                    )}
                    {clinic.website && (
                        <div className="text-xs text-gray-600 leading-tight">
                            {clinic.website}
                        </div>
                    )}
                </div>
                <hr className="mb-2" />
                {/* Receipt Title */}
                <div className="text-center mb-2">
                    <div className="text-sm font-semibold tracking-wide">
                        PAYMENT RECEIPT
                    </div>
                    <div className="text-xs text-gray-500">
                        Reference #:{" "}
                        <span className="font-mono">
                            {payment.reference_number}
                        </span>
                    </div>
                </div>
                {/* Patient & Payment Info */}
                <div className="mb-1">
                    <div className="flex justify-between mb-0.5 text-xs">
                        <span className="font-medium">Patient:</span>
                        <span>
                            {payment.patient?.first_name}{" "}
                            {payment.patient?.last_name}
                        </span>
                    </div>
                    {payment.treatment && (
                        <div className="flex justify-between mb-0.5 text-xs">
                            <span className="font-medium">Treatment:</span>
                            <span>{payment.treatment.name}</span>
                        </div>
                    )}
                    <div className="flex justify-between mb-0.5 text-xs">
                        <span className="font-medium">Date:</span>
                        <span>{payment.payment_date}</span>
                    </div>
                    <div className="flex justify-between mb-0.5 text-xs">
                        <span className="font-medium">Method:</span>
                        <span className="capitalize">
                            {payment.payment_method.replace("_", " ")}
                        </span>
                    </div>
                    <div className="flex justify-between mb-0.5 text-xs">
                        <span className="font-medium">Status:</span>
                        <span className="capitalize">{payment.status}</span>
                    </div>
                    <div className="flex justify-between mb-0.5 text-xs">
                        <span className="font-medium">Processed by:</span>
                        <span>{auth?.name || "-"}</span>
                    </div>
                </div>
                <hr className="mb-1" />
                {/* Amount */}
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold">Amount Paid:</span>
                    <span className="text-lg font-bold text-green-600">
                        ₱{Number(payment.amount).toLocaleString()}
                    </span>
                </div>
                {/* Notes */}
                {payment.notes && (
                    <div className="mb-1 text-xs text-gray-700">
                        <span className="font-medium">Notes:</span>{" "}
                        {payment.notes}
                    </div>
                )}
                {/* PAID Badge */}
                <div className="absolute top-3 right-3 print:static">
                    <span className="inline-block bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full text-xs border border-green-300">
                        PAID
                    </span>
                </div>
                {/* QR Code for digital verification */}
                <div className="flex flex-col items-center mt-2">
                    <QRCode value={receiptUrl} size={44} />
                    <div className="text-xs text-gray-400 mt-0.5">
                        Scan to verify online
                    </div>
                </div>
                {/* Signature Line */}
                <div className="flex justify-between items-end mt-3 mb-0.5">
                    <div className="flex flex-col items-center">
                        <div className="w-24 border-b border-gray-400 mb-0.5" />
                        <span className="text-xs text-gray-500">
                            Staff Signature
                        </span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-24 border-b border-gray-400 mb-0.5" />
                        <span className="text-xs text-gray-500">
                            Patient Signature
                        </span>
                    </div>
                </div>
                {/* Thank You Message */}
                <div className="mt-2 text-center text-xs text-gray-700 font-medium">
                    Thank you for trusting{" "}
                    <span className="font-bold">{clinic.name}</span>!<br />
                    We appreciate your visit.
                </div>
                {/* Clinic Policy Note */}
                <div className="mt-1 text-xs text-gray-500 text-center">
                    Payments are non-refundable once processed. For questions,
                    contact us at {clinic.email || clinic.phone}.
                </div>
                {/* Print Date/Time */}
                <div className="mt-0.5 text-xs text-gray-400 text-center">
                    Printed on: {printDate}
                </div>
                {/* System-generated footer */}
                <div className="mt-1 text-xs text-gray-400 text-center">
                    This is a system-generated receipt. No signature required if
                    printed electronically.
                </div>
                {/* Print Button (hidden on print) */}
                <div className="mt-3 flex justify-center print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded shadow text-xs"
                    >
                        Print Receipt
                    </button>
                </div>
                {/* Watermark */}
                <div className="absolute opacity-5 text-3xl font-extrabold text-center w-full top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none print:block hidden">
                    {clinic.name}
                </div>
            </div>
        </div>
    );
}
