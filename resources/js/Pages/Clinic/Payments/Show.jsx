import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Printer } from "lucide-react";

export default function Show({ auth, payment }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">
                    {auth.clinic?.name} - Payment Details
                </h2>
            }
        >
            <Head title="Payment Details" />
            <div className="min-h-[80vh] flex items-center justify-center py-8">
                <div className="w-full max-w-lg mx-auto">
                    <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100">
                        {/* Patient & Treatment */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 pb-6 border-b">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                    Patient
                                </div>
                                <div className="font-bold text-2xl text-gray-900">
                                    {payment.patient
                                        ? `${payment.patient.first_name} ${payment.patient.last_name}`
                                        : "-"}
                                </div>
                            </div>
                            <div className="md:text-right">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                    Treatment
                                </div>
                                <div className="font-medium text-lg">
                                    {payment.treatment?.name || "-"}
                                </div>
                            </div>
                        </div>
                        {/* Payment Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">
                                    Date
                                </div>
                                <div className="font-medium text-base">
                                    {payment.payment_date}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">
                                    Reference #
                                </div>
                                <div className="font-mono text-base">
                                    {payment.reference_number}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">
                                    Method
                                </div>
                                <div className="capitalize font-medium text-base">
                                    {payment.payment_method.replace("_", " ")}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase mb-1">
                                    Status
                                </div>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                        payment.status === "completed"
                                            ? "bg-green-100 text-green-700 border border-green-200"
                                            : payment.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                            : "bg-gray-100 text-gray-700 border border-gray-200"
                                    }`}
                                >
                                    {payment.status}
                                </span>
                            </div>
                        </div>
                        {/* Amount */}
                        <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-xl">
                            <div className="text-xs text-gray-500 uppercase mb-1 tracking-wider">
                                Amount Paid
                            </div>
                            <div className="text-3xl font-extrabold text-green-600 tracking-tight">
                                ₱
                                {Number(payment.amount).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                )}
                            </div>
                        </div>
                        {/* Notes */}
                        {payment.notes && (
                            <div className="pt-2">
                                <div className="text-xs text-gray-500 uppercase mb-1">
                                    Notes
                                </div>
                                <div className="text-gray-700 text-base">
                                    {payment.notes}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-8 justify-center">
                        <Link
                            href={route("clinic.payments.index", {
                                clinic: auth.clinic?.id,
                            })}
                        >
                            <Button variant="outline">Back to List</Button>
                        </Link>
                        <Link
                            href={route("clinic.payments.edit", {
                                clinic: auth.clinic?.id,
                                payment: payment.id,
                            })}
                        >
                            <Button>Edit</Button>
                        </Link>
                        <a
                            href={route("clinic.payments.receipt", {
                                clinic: auth.clinic?.id,
                                payment: payment.id,
                            })}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="default">
                                <Printer className="w-4 h-4 mr-2 inline-block" />
                                Print Receipt
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
