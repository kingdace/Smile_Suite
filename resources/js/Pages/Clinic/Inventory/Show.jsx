import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function Show({ auth, clinic, inventory }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Inventory Details
                </h2>
            }
        >
            <Head title="Inventory Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Inventory Item Details</CardTitle>
                                <div className="flex gap-2">
                                    <Link
                                        href={route("clinic.inventory.edit", [
                                            clinic.id,
                                            inventory.id,
                                        ])}
                                    >
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        href={route("clinic.inventory.index", [
                                            clinic.id,
                                        ])}
                                    >
                                        <Button variant="outline">
                                            Back to List
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Basic Information
                                    </h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Name
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Category
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.category}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Description
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.description}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Inventory Details
                                    </h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Quantity
                                            </dt>
                                            <dd
                                                className={`mt-1 ${
                                                    inventory.quantity <=
                                                    inventory.minimum_quantity
                                                        ? "text-red-500"
                                                        : ""
                                                }`}
                                            >
                                                {inventory.quantity}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Minimum Quantity
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.minimum_quantity}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Unit Price
                                            </dt>
                                            <dd className="mt-1">
                                                ${inventory.unit_price}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Supplier Information
                                    </h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Supplier
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.supplier?.name ||
                                                    "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Contact Person
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.supplier
                                                    ?.contact_person || "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Email
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.supplier?.email ||
                                                    "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Phone
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.supplier?.phone ||
                                                    "N/A"}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        Additional Information
                                    </h3>
                                    <dl className="space-y-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Notes
                                            </dt>
                                            <dd className="mt-1">
                                                {inventory.notes ||
                                                    "No notes available"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Created At
                                            </dt>
                                            <dd className="mt-1">
                                                {new Date(
                                                    inventory.created_at
                                                ).toLocaleString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Last Updated
                                            </dt>
                                            <dd className="mt-1">
                                                {new Date(
                                                    inventory.updated_at
                                                ).toLocaleString()}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
