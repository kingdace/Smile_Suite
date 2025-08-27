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
import { Badge } from "@/Components/ui/badge";
import {
    Building,
    Search,
    Plus,
    Package,
    Users,
    DollarSign,
    ArrowLeft,
    Eye,
    Edit,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";

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

    const clearSearch = () => {
        setSearch("");
        router.get(
            route("clinic.suppliers.index", [clinic.id]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getActiveSuppliersCount = () => {
        return suppliers.data
            ? suppliers.data.filter(
                  (supplier) =>
                      supplier.inventory && supplier.inventory.length > 0
              ).length
            : 0;
    };

    const getTotalItemsSupplied = () => {
        return suppliers.data
            ? suppliers.data.reduce(
                  (sum, supplier) =>
                      sum +
                      (supplier.inventory ? supplier.inventory.length : 0),
                  0
              )
            : 0;
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Suppliers" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-5 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <Building className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Supplier Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Manage your clinic's suppliers and
                                        vendor relationships
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("clinic.suppliers.create", [
                                        clinic.id,
                                    ])}
                                >
                                    <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-xl transition-all duration-300">
                                        <Plus className="h-4 w-4" />
                                        Add Supplier
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt--10 pb-12">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Suppliers
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {suppliers.total || 0}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Building className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-green-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Active Suppliers
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {getActiveSuppliersCount()}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-purple-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Items Supplied
                                        </p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {getTotalItemsSupplied()}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <Package className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-orange-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Avg. Items/Supplier
                                        </p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {suppliers.total > 0
                                                ? Math.round(
                                                      getTotalItemsSupplied() /
                                                          suppliers.total
                                                  )
                                                : 0}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filters Section */}
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30 mb-6">
                        <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        Supplier Records
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">
                                        Search and manage your supplier database
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Search suppliers by name, contact person, or email..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="h-11 px-6 bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                    </Button>
                                    {search && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clearSearch}
                                            className="h-11 px-6"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </form>

                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold text-gray-900">
                                            Supplier Name
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-900">
                                            Contact Person
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-900">
                                            Contact Info
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-900">
                                            Items Supplied
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-900">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suppliers.data &&
                                    suppliers.data.length > 0 ? (
                                        suppliers.data.map((supplier) => (
                                            <TableRow
                                                key={supplier.id}
                                                className="hover:bg-gray-50/50"
                                            >
                                                <TableCell>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {supplier.name}
                                                        </div>
                                                        {supplier.tax_id && (
                                                            <div className="text-sm text-gray-500">
                                                                Tax ID:{" "}
                                                                {
                                                                    supplier.tax_id
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-gray-400" />
                                                        <span>
                                                            {supplier.contact_person ||
                                                                "N/A"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {supplier.email && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Mail className="h-3 w-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                                                    {
                                                                        supplier.email
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {supplier.phone && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="h-3 w-3 text-gray-400" />
                                                                <span className="text-gray-600">
                                                                    {
                                                                        supplier.phone
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                                    >
                                                        {supplier.inventory
                                                            ? supplier.inventory
                                                                  .length
                                                            : 0}{" "}
                                                        items
                                                    </Badge>
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
                                                                className="h-8 px-3"
                                                            >
                                                                <Eye className="h-3 w-3 mr-1" />
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
                                                                className="h-8 px-3"
                                                            >
                                                                <Edit className="h-3 w-3 mr-1" />
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
                                                className="text-center py-12"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <Building className="h-12 w-12 text-gray-300" />
                                                    <div>
                                                        <p className="text-lg font-medium text-gray-900">
                                                            No suppliers found
                                                        </p>
                                                        <p className="text-gray-500">
                                                            Get started by
                                                            adding your first
                                                            supplier
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={route(
                                                            "clinic.suppliers.create",
                                                            [clinic.id]
                                                        )}
                                                    >
                                                        <Button className="mt-2">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Supplier
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {suppliers.links && suppliers.links.length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex gap-2">
                                        {suppliers.links.map((link, i) => {
                                            if (!link.url) return null;

                                            const queryParams =
                                                link.url.includes("?")
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
                                                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                                        link.active
                                                            ? "bg-blue-600 text-white border-blue-600"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {link.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
