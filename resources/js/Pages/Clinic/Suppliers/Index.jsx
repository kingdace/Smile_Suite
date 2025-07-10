import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function Index({ auth, clinic, suppliers, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("clinic.suppliers.index", [clinic.id]),
            {
                search,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Suppliers
                </h2>
            }
        >
            <Head title="Suppliers" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Supplier Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h3 className="text-sm font-medium text-blue-600">
                                        Total Suppliers
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {suppliers.total || 0}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="text-sm font-medium text-green-600">
                                        Active Suppliers
                                    </h3>
                                    <p className="text-2xl font-bold text-green-900">
                                        {suppliers.data
                                            ? suppliers.data.filter(
                                                  (supplier) =>
                                                      supplier.inventory &&
                                                      supplier.inventory
                                                          .length > 0
                                              ).length
                                            : 0}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <h3 className="text-sm font-medium text-purple-600">
                                        Total Items Supplied
                                    </h3>
                                    <p className="text-2xl font-bold text-purple-900">
                                        {suppliers.data
                                            ? suppliers.data.reduce(
                                                  (sum, supplier) =>
                                                      sum +
                                                      (supplier.inventory
                                                          ? supplier.inventory
                                                                .length
                                                          : 0),
                                                  0
                                              )
                                            : 0}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Search suppliers..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                    </div>
                                    <Button type="submit">Search</Button>
                                    <Link
                                        href={route("clinic.suppliers.create", [
                                            clinic.id,
                                        ])}
                                    >
                                        <Button>Add Supplier</Button>
                                    </Link>
                                    <Link
                                        href={route("clinic.inventory.index", [
                                            clinic.id,
                                        ])}
                                    >
                                        <Button variant="outline">
                                            Manage Inventory
                                        </Button>
                                    </Link>
                                </div>
                            </form>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact Person</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suppliers.data &&
                                    suppliers.data.length > 0 ? (
                                        suppliers.data.map((supplier) => (
                                            <TableRow key={supplier.id}>
                                                <TableCell>
                                                    {supplier.name}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.contact_person ||
                                                        "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.email || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.phone || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route(
                                                                "clinic.suppliers.show",
                                                                [
                                                                    clinic.id,
                                                                    supplier.id,
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
                                                        <Link
                                                            href={route(
                                                                "clinic.suppliers.edit",
                                                                [
                                                                    clinic.id,
                                                                    supplier.id,
                                                                ]
                                                            )}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center py-8"
                                            >
                                                No suppliers found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {suppliers.links && suppliers.links.length > 0 && (
                                <div className="mt-4 flex gap-2">
                                    {suppliers.links.map((link, i) => {
                                        // Skip links that don't have a URL
                                        if (!link.url) return null;

                                        // Extract query parameters from the URL
                                        const queryParams = link.url.includes(
                                            "?"
                                        )
                                            ? link.url.substring(
                                                  link.url.indexOf("?")
                                              )
                                            : "";

                                        return (
                                            <Link
                                                key={i}
                                                href={
                                                    route(
                                                        "clinic.suppliers.index",
                                                        [clinic.id]
                                                    ) + queryParams
                                                }
                                                className={`px-4 py-2 border rounded ${
                                                    link.active
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-white hover:bg-gray-50"
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
