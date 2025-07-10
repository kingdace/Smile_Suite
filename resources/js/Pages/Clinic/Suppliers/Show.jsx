import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

export default function Show({ auth, clinic, supplier }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Supplier Details
                </h2>
            }
        >
            <Head title="Supplier Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Supplier Information</CardTitle>
                                <div className="flex gap-2">
                                    <Link
                                        href={route("clinic.suppliers.edit", [
                                            clinic.id,
                                            supplier.id,
                                        ])}
                                    >
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <Link
                                        href={route("clinic.suppliers.index", [
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
                                                {supplier.name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Contact Person
                                            </dt>
                                            <dd className="mt-1">
                                                {supplier.contact_person ||
                                                    "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Email
                                            </dt>
                                            <dd className="mt-1">
                                                {supplier.email || "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Phone
                                            </dt>
                                            <dd className="mt-1">
                                                {supplier.phone || "N/A"}
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
                                                Tax ID
                                            </dt>
                                            <dd className="mt-1">
                                                {supplier.tax_id || "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Payment Terms
                                            </dt>
                                            <dd className="mt-1">
                                                {supplier.payment_terms ||
                                                    "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Address
                                            </dt>
                                            <dd className="mt-1">
                                                {supplier.address || "N/A"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Notes
                                            </dt>
                                            <dd className="mt-1">
                                                {supplier.notes ||
                                                    "No notes available"}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {supplier.inventory &&
                                supplier.inventory.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold mb-4">
                                            Inventory Items from this Supplier
                                        </h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>
                                                        Category
                                                    </TableHead>
                                                    <TableHead>
                                                        Quantity
                                                    </TableHead>
                                                    <TableHead>
                                                        Unit Price
                                                    </TableHead>
                                                    <TableHead>
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {supplier.inventory.map(
                                                    (item) => (
                                                        <TableRow key={item.id}>
                                                            <TableCell>
                                                                {item.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.category}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span
                                                                    className={
                                                                        item.quantity <=
                                                                        item.minimum_quantity
                                                                            ? "text-red-500"
                                                                            : ""
                                                                    }
                                                                >
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                $
                                                                {
                                                                    item.unit_price
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                <Link
                                                                    href={route(
                                                                        "clinic.inventory.show",
                                                                        [
                                                                            clinic.id,
                                                                            item.id,
                                                                        ]
                                                                    )}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}

                            <div className="mt-6 text-sm text-gray-500">
                                <p>
                                    <strong>Created:</strong>{" "}
                                    {new Date(
                                        supplier.created_at
                                    ).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Last Updated:</strong>{" "}
                                    {new Date(
                                        supplier.updated_at
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
