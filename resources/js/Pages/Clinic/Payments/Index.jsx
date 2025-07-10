import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useRef } from "react";
import {
    CreditCard,
    BarChart2,
    Clock,
    AlertCircle,
    Wallet,
    Banknote,
    ShieldCheck,
    HelpCircle,
} from "lucide-react";
import Modal from "@/Components/Modal";
import { useForm } from "@inertiajs/react";

function statusBadge(status) {
    const map = {
        completed: "bg-green-100 text-green-700 border-green-300",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        failed: "bg-red-100 text-red-700 border-red-300",
        refunded: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return (
        <span
            className={`px-2 py-1 rounded text-xs font-semibold border ${
                map[status] || "bg-gray-100 text-gray-700 border-gray-300"
            }`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function methodIcon(method) {
    switch (method) {
        case "cash":
            return (
                <Wallet
                    className="inline h-4 w-4 text-gray-500 mr-1"
                    title="Cash"
                />
            );
        case "credit_card":
        case "debit_card":
            return (
                <CreditCard
                    className="inline h-4 w-4 text-blue-500 mr-1"
                    title="Card"
                />
            );
        case "insurance":
            return (
                <ShieldCheck
                    className="inline h-4 w-4 text-purple-500 mr-1"
                    title="Insurance"
                />
            );
        case "other":
            return (
                <HelpCircle
                    className="inline h-4 w-4 text-gray-400 mr-1"
                    title="Other"
                />
            );
        default:
            return (
                <Banknote
                    className="inline h-4 w-4 text-gray-400 mr-1"
                    title={method}
                />
            );
    }
}

export default function Index({
    auth,
    payments,
    filters,
    summary,
    patients = [],
    treatments = [],
}) {
    const [showModal, setShowModal] = React.useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: "",
        treatment_id: "",
        amount: "",
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "cash",
        status: "completed",
        reference_number: "",
        notes: "",
    });
    const tableRef = useRef(null);
    const scrollToTable = () => {
        tableRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const [lastCreatedPaymentId, setLastCreatedPaymentId] =
        React.useState(null);
    const [showSuccess, setShowSuccess] = React.useState(false);

    function openModal() {
        setShowModal(true);
    }
    function closeModal() {
        setShowModal(false);
        reset();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        post(route("clinic.payments.store", { clinic: auth.clinic?.id }), {
            onSuccess: (page) => {
                // Try to extract payment ID from the redirect URL
                const url = page.props?.flash?.success && page.url;
                // Fallback: try to parse from location or response
                let paymentId = null;
                if (url) {
                    const match = url.match(/payments\/(\d+)/);
                    if (match) paymentId = match[1];
                }
                setLastCreatedPaymentId(paymentId);
                setShowSuccess(true);
                closeModal();
                reset();
            },
            onError: () => {
                setShowSuccess(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {auth.clinic?.name} Payments
                </h2>
            }
        >
            <Head title="Payments" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Modern, Clean Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center gap-3 transition hover:shadow-md cursor-pointer">
                            <CreditCard className="h-6 w-6 text-blue-500" />
                            <div>
                                <div className="text-xs text-gray-500 mb-0.5">
                                    Total Revenue
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    ₱
                                    {Number(
                                        summary.total_revenue
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center gap-3 transition hover:shadow-md cursor-pointer">
                            <BarChart2 className="h-6 w-6 text-cyan-500" />
                            <div>
                                <div className="text-xs text-gray-500 mb-0.5">
                                    Total Balance
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    ₱
                                    {Number(
                                        summary.total_balance
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center gap-3 transition hover:shadow-md cursor-pointer">
                            <Clock className="h-6 w-6 text-purple-500" />
                            <div>
                                <div className="text-xs text-gray-500 mb-0.5">
                                    Payments This Month
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    ₱
                                    {Number(
                                        summary.payments_this_month
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-center gap-3 transition hover:shadow-md cursor-pointer">
                            <AlertCircle className="h-6 w-6 text-yellow-500" />
                            <div>
                                <div className="text-xs text-gray-500 mb-0.5">
                                    Pending Payments
                                </div>
                                <div className="text-base font-semibold text-gray-800">
                                    ₱
                                    {Number(
                                        summary.pending_payments
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Divider */}
                    <div className="border-b border-gray-200 mb-6" />
                    {/* Search/Filter Bar Placeholder */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                        <input
                            type="text"
                            className="border border-gray-200 rounded px-3 py-2 w-full sm:w-64 text-sm"
                            placeholder="Search payments (coming soon)"
                            disabled
                        />
                        <div className="flex gap-2">
                            {/* Future: Add filter dropdowns here */}
                        </div>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Payments
                        </h2>
                        <Button onClick={openModal}>Add Payment</Button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 bg-gray-50 z-10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                        Patient
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                        Treatment
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-gray-600">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                        Method
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-600">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data && payments.data.length > 0 ? (
                                    payments.data.map((payment, idx) => (
                                        <tr
                                            key={payment.id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white hover:bg-blue-50/40"
                                                    : "bg-gray-50 hover:bg-blue-50/40"
                                            }
                                        >
                                            <td className="px-4 py-2 whitespace-nowrap">
                                                {payment.payment_date}
                                            </td>
                                            <td
                                                className="px-4 py-2 max-w-[160px] truncate"
                                                title={
                                                    payment.patient
                                                        ? `${payment.patient.first_name} ${payment.patient.last_name}`
                                                        : ""
                                                }
                                            >
                                                {payment.patient
                                                    ? `${payment.patient.first_name} ${payment.patient.last_name}`
                                                    : ""}
                                            </td>
                                            <td
                                                className="px-4 py-2 max-w-[160px] truncate"
                                                title={payment.treatment?.name}
                                            >
                                                {payment.treatment?.name}
                                            </td>
                                            <td className="px-4 py-2 text-right font-semibold text-blue-700">
                                                ₱
                                                {Number(
                                                    payment.amount
                                                ).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-2">
                                                {methodIcon(
                                                    payment.payment_method
                                                )}
                                                <span className="align-middle">
                                                    {payment.payment_method
                                                        .replace("_", " ")
                                                        .replace(/\b\w/g, (c) =>
                                                            c.toUpperCase()
                                                        )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                {statusBadge(payment.status)}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <Link
                                                    href={route(
                                                        "clinic.payments.show",
                                                        [
                                                            auth.clinic?.id,
                                                            payment.id,
                                                        ]
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            No payments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Modal show={showModal} onClose={closeModal} maxWidth="2xl">
                        <form
                            onSubmit={handleSubmit}
                            className="p-8 max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-lg font-semibold mb-6">
                                Add Payment
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Patient
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={data.patient_id}
                                        onChange={(e) =>
                                            setData(
                                                "patient_id",
                                                e.target.value
                                            )
                                        }
                                        required
                                        autoFocus
                                    >
                                        <option value="">Select patient</option>
                                        {patients.map((patient) => (
                                            <option
                                                key={patient.id}
                                                value={patient.id}
                                            >
                                                {patient.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.patient_id && (
                                        <div className="text-red-500 text-sm">
                                            {errors.patient_id}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Treatment
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={data.treatment_id}
                                        onChange={(e) =>
                                            setData(
                                                "treatment_id",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select treatment (optional)
                                        </option>
                                        {treatments.map((treatment) => (
                                            <option
                                                key={treatment.id}
                                                value={treatment.id}
                                            >
                                                {treatment.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.treatment_id && (
                                        <div className="text-red-500 text-sm">
                                            {errors.treatment_id}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.amount}
                                        onChange={(e) =>
                                            setData("amount", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.amount && (
                                        <div className="text-red-500 text-sm">
                                            {errors.amount}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Payment Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.payment_date}
                                        onChange={(e) =>
                                            setData(
                                                "payment_date",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.payment_date && (
                                        <div className="text-red-500 text-sm">
                                            {errors.payment_date}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Payment Method
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={data.payment_method}
                                        onChange={(e) =>
                                            setData(
                                                "payment_method",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="credit_card">
                                            Credit Card
                                        </option>
                                        <option value="debit_card">
                                            Debit Card
                                        </option>
                                        <option value="insurance">
                                            Insurance
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                    {errors.payment_method && (
                                        <div className="text-red-500 text-sm">
                                            {errors.payment_method}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Status
                                    </label>
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="completed">
                                            Completed
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="refunded">
                                            Refunded
                                        </option>
                                    </select>
                                    {errors.status && (
                                        <div className="text-red-500 text-sm">
                                            {errors.status}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Reference Number
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded px-3 py-2"
                                        value={data.reference_number}
                                        onChange={(e) =>
                                            setData(
                                                "reference_number",
                                                e.target.value
                                            )
                                        }
                                    />
                                    {errors.reference_number && (
                                        <div className="text-red-500 text-sm">
                                            {errors.reference_number}
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-1 font-medium">
                                        Notes
                                    </label>
                                    <textarea
                                        className="w-full border rounded px-3 py-2 min-h-[48px]"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                    />
                                    {errors.notes && (
                                        <div className="text-red-500 text-sm">
                                            {errors.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="border-t mt-8 pt-4 flex justify-end gap-2 bg-white sticky bottom-0 z-10">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Save Payment
                                </Button>
                            </div>
                        </form>
                    </Modal>
                    {/* Success message and Print Receipt button */}
                    {showSuccess && lastCreatedPaymentId && (
                        <div className="fixed top-6 right-6 z-50 bg-white border border-green-300 shadow-lg rounded p-4 flex flex-col items-center">
                            <div className="text-green-700 font-semibold mb-2">
                                Payment added successfully!
                            </div>
                            <a
                                href={route("clinic.payments.receipt", {
                                    clinic: auth.clinic?.id,
                                    payment: lastCreatedPaymentId,
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
                            >
                                Print Receipt
                            </a>
                            <button
                                className="mt-2 text-xs text-gray-500 hover:underline"
                                onClick={() => setShowSuccess(false)}
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
