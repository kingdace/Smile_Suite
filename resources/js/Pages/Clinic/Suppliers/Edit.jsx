import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function Edit({ auth, clinic, supplier }) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name,
        contact_person: supplier.contact_person || "",
        email: supplier.email || "",
        phone: supplier.phone || "",
        address: supplier.address || "",
        tax_id: supplier.tax_id || "",
        payment_terms: supplier.payment_terms || "",
        notes: supplier.notes || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("clinic.suppliers.update", [clinic.id, supplier.id]));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Supplier
                </h2>
            }
        >
            <Head title="Edit Supplier" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Supplier</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="mt-1"
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="contact_person">
                                            Contact Person
                                        </Label>
                                        <Input
                                            id="contact_person"
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_person",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                        />
                                        {errors.contact_person && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.contact_person}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className="mt-1"
                                        />
                                        {errors.email && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            className="mt-1"
                                        />
                                        {errors.phone && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.phone}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="tax_id">Tax ID</Label>
                                        <Input
                                            id="tax_id"
                                            type="text"
                                            value={data.tax_id}
                                            onChange={(e) =>
                                                setData(
                                                    "tax_id",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                        />
                                        {errors.tax_id && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.tax_id}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="payment_terms">
                                            Payment Terms
                                        </Label>
                                        <Input
                                            id="payment_terms"
                                            type="text"
                                            value={data.payment_terms}
                                            onChange={(e) =>
                                                setData(
                                                    "payment_terms",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                        />
                                        {errors.payment_terms && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.payment_terms}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) =>
                                            setData("address", e.target.value)
                                        }
                                        className="mt-1"
                                        rows={3}
                                    />
                                    {errors.address && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.address}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        className="mt-1"
                                        rows={3}
                                    />
                                    {errors.notes && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.notes}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? "Updating..."
                                            : "Update Supplier"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
