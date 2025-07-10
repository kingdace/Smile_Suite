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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function Index({ auth, clinic, inventory, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [category, setCategory] = useState(filters.category || "all");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("clinic.inventory.index", [clinic.id]),
            {
                search,
                category: category === "all" ? "" : category,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleFilterChange = (name, value) => {
        if (name === "category") {
            setCategory(value);
        }
        router.get(
            route("clinic.inventory.index", [clinic.id]),
            {
                search,
                category:
                    name === "category"
                        ? value === "all"
                            ? ""
                            : value
                        : category === "all"
                        ? ""
                        : category,
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
                    Inventory
                </h2>
            }
        >
            <Head title="Inventory" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h3 className="text-sm font-medium text-blue-600">
                                        Total Items
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-900">
                                        {inventory.total || 0}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <h3 className="text-sm font-medium text-yellow-600">
                                        Low Stock Items
                                    </h3>
                                    <p className="text-2xl font-bold text-yellow-900">
                                        {inventory.data
                                            ? inventory.data.filter(
                                                  (item) =>
                                                      item.quantity <=
                                                      item.minimum_quantity
                                              ).length
                                            : 0}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="text-sm font-medium text-green-600">
                                        Categories
                                    </h3>
                                    <p className="text-2xl font-bold text-green-900">
                                        {inventory.data
                                            ? new Set(
                                                  inventory.data.map(
                                                      (item) => item.category
                                                  )
                                              ).size
                                            : 0}
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <h3 className="text-sm font-medium text-purple-600">
                                        Total Value
                                    </h3>
                                    <p className="text-2xl font-bold text-purple-900">
                                        $
                                        {inventory.data
                                            ? inventory.data
                                                  .reduce(
                                                      (sum, item) =>
                                                          sum +
                                                          item.quantity *
                                                              parseFloat(
                                                                  item.unit_price
                                                              ),
                                                      0
                                                  )
                                                  .toFixed(2)
                                            : "0.00"}
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Search inventory..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="w-48">
                                        <Select
                                            value={category}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    "category",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Categories
                                                </SelectItem>
                                                <SelectItem value="dental_supplies">
                                                    Dental Supplies
                                                </SelectItem>
                                                <SelectItem value="equipment">
                                                    Equipment
                                                </SelectItem>
                                                <SelectItem value="medications">
                                                    Medications
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit">Search</Button>
                                    <Link
                                        href={route("clinic.inventory.create", [
                                            clinic.id,
                                        ])}
                                    >
                                        <Button>Add Item</Button>
                                    </Link>
                                    <Link
                                        href={route("clinic.suppliers.index", [
                                            clinic.id,
                                        ])}
                                    >
                                        <Button variant="outline">
                                            Manage Suppliers
                                        </Button>
                                    </Link>
                                </div>
                            </form>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Unit Price</TableHead>
                                        <TableHead>Supplier</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventory.data &&
                                    inventory.data.length > 0 ? (
                                        inventory.data.map((item) => (
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
                                                        {item.quantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    ${item.unit_price}
                                                </TableCell>
                                                <TableCell>
                                                    {item.supplier?.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
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
                                                        <Link
                                                            href={route(
                                                                "clinic.inventory.edit",
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
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newQuantity =
                                                                    prompt(
                                                                        `Adjust quantity for ${item.name} (current: ${item.quantity}):`,
                                                                        item.quantity
                                                                    );
                                                                if (
                                                                    newQuantity !==
                                                                        null &&
                                                                    !isNaN(
                                                                        newQuantity
                                                                    )
                                                                ) {
                                                                    router.put(
                                                                        route(
                                                                            "clinic.inventory.update",
                                                                            [
                                                                                clinic.id,
                                                                                item.id,
                                                                            ]
                                                                        ),
                                                                        {
                                                                            ...item,
                                                                            quantity:
                                                                                parseInt(
                                                                                    newQuantity
                                                                                ),
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Quick Adjust
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-8"
                                            >
                                                No inventory items found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {inventory.links && inventory.links.length > 0 && (
                                <div className="mt-4 flex gap-2">
                                    {inventory.links.map((link, i) => {
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
                                                        "clinic.inventory.index",
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
