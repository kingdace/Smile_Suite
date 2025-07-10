import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";

export default function Create({ auth, patients = [], treatments = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: "",
        treatment_id: "",
        amount: "",
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: "cash",
        status: "completed",
        reference_number: "",
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("clinic.payments.store", [auth.clinic?.id]));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {auth.clinic?.name} - Add Payment
                </h2>
            }
        >
            <Head title="Add Payment" />
            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight mb-6">
                        Add Payment
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1">Patient</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={data.patient_id}
                                onChange={(e) =>
                                    setData("patient_id", e.target.value)
                                }
                                required
                            >
                                <option value="">Select patient</option>
                                {patients.map((patient) => (
                                    <option key={patient.id} value={patient.id}>
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
                            <label className="block mb-1">Treatment</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={data.treatment_id}
                                onChange={(e) =>
                                    setData("treatment_id", e.target.value)
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
                            <label className="block mb-1">Amount</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
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
                            <label className="block mb-1">Payment Date</label>
                            <Input
                                type="date"
                                value={data.payment_date}
                                onChange={(e) =>
                                    setData("payment_date", e.target.value)
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
                            <label className="block mb-1">Payment Method</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={data.payment_method}
                                onChange={(e) =>
                                    setData("payment_method", e.target.value)
                                }
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="debit_card">Debit Card</option>
                                <option value="insurance">Insurance</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.payment_method && (
                                <div className="text-red-500 text-sm">
                                    {errors.payment_method}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">Status</label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                required
                            >
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                            {errors.status && (
                                <div className="text-red-500 text-sm">
                                    {errors.status}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">
                                Reference Number
                            </label>
                            <Input
                                type="text"
                                value={data.reference_number}
                                onChange={(e) =>
                                    setData("reference_number", e.target.value)
                                }
                            />
                            {errors.reference_number && (
                                <div className="text-red-500 text-sm">
                                    {errors.reference_number}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1">Notes</label>
                            <textarea
                                className="w-full border rounded px-3 py-2"
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
                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                Save Payment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
