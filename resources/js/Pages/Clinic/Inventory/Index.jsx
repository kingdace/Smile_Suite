import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
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
import { Badge } from "@/Components/ui/badge";
import Pagination from "@/Components/Pagination";
import {
    Search,
    PlusCircle,
    Package,
    AlertTriangle,
    DollarSign,
    Eye,
    Pencil,
    RefreshCw,
    Plus,
    Minus,
    XCircle,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useState } from "react";

export default function Index({ auth, clinic, inventory, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [category, setCategory] = useState(filters.category || "all");
    const [stockFilter, setStockFilter] = useState(
        filters.stock_filter || "all"
    );

    // Calculate simple statistics
    const totalItems = inventory.total || 0;
    const lowStockItems = inventory.data
        ? inventory.data.filter(
              (item) => item.quantity <= item.minimum_quantity
          ).length
        : 0;
    const outOfStockItems = inventory.data
        ? inventory.data.filter((item) => item.quantity <= 0).length
        : 0;
    const totalValue = inventory.data
        ? inventory.data.reduce(
              (sum, item) => sum + item.quantity * parseFloat(item.unit_price),
              0
          )
        : 0;

    const handleSearch = () => {
        router.get(
            route("clinic.inventory.index", [clinic.id]),
            {
                search,
                category: category === "all" ? "" : category,
                stock_filter: stockFilter === "all" ? "" : stockFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("all");
        setStockFilter("all");
        router.get(route("clinic.inventory.index", [clinic.id]));
    };

    const getStockStatusColor = (item) => {
        if (item.quantity <= 0) return "bg-red-100 text-red-700 border-red-200";
        if (item.quantity <= item.minimum_quantity)
            return "bg-yellow-100 text-yellow-700 border-yellow-200";
        return "bg-green-100 text-green-700 border-green-200";
    };

    const getStockStatusLabel = (item) => {
        if (item.quantity <= 0) return "Out of Stock";
        if (item.quantity <= item.minimum_quantity) return "Low Stock";
        return "In Stock";
    };

    // PHP Currency formatting
    const formatCurrency = (amount) => {
        return (
            "₱" +
            parseFloat(amount || 0).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No Expiry";
        return new Date(dateString).toLocaleDateString("en-PH");
    };

    // Quick stock adjustment
    const adjustStock = (item, change) => {
        router.patch(
            route("clinic.inventory.adjust-quantity", [clinic.id, item.id]),
            { adjustment: change },
            { preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Inventory Management" />

            {/* Simple Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Inventory Management
                            </h1>
                            <p className="text-blue-100">
                                Simple digital tracking for your clinic
                            </p>
                        </div>
                    </div>
                    <Link href={route("clinic.inventory.create", [clinic.id])}>
                        <Button className="bg-white/20 hover:bg-white/30 text-white border-white/40">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Item
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Items
                                </p>
                                <p className="text-3xl font-bold text-blue-900">
                                    {totalItems}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Low Stock
                                </p>
                                <p className="text-3xl font-bold text-yellow-900">
                                    {lowStockItems}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Out of Stock
                                </p>
                                <p className="text-3xl font-bold text-red-900">
                                    {outOfStockItems}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Value
                                </p>
                                <p className="text-3xl font-bold text-green-900">
                                    {formatCurrency(totalValue)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold flex items-center space-x-3">
                            <Package className="h-5 w-5 text-blue-600" />
                            <span>Inventory Items</span>
                        </CardTitle>
                    </div>

                    {/* Simple Search & Filters */}
                    <div className="flex items-center space-x-4 mt-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search inventory items..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Categories
                                </SelectItem>
                                <SelectItem value="medications">
                                    Medications
                                </SelectItem>
                                <SelectItem value="supplies">
                                    Supplies
                                </SelectItem>
                                <SelectItem value="equipment">
                                    Equipment
                                </SelectItem>
                                <SelectItem value="others">Others</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={stockFilter}
                            onValueChange={setStockFilter}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Stock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Stock</SelectItem>
                                <SelectItem value="in_stock">
                                    In Stock
                                </SelectItem>
                                <SelectItem value="low_stock">
                                    Low Stock
                                </SelectItem>
                                <SelectItem value="out_of_stock">
                                    Out of Stock
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch}>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        <Button onClick={clearFilters} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold">
                                    Item Name
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Category
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Stock Status
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Quantity
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Unit Price
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Total Value
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Expiry
                                </TableHead>
                                <TableHead className="font-semibold">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.data && inventory.data.length > 0 ? (
                                inventory.data.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell className="py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {item.name}
                                                </div>
                                                {item.description && (
                                                    <div className="text-sm text-gray-500 mt-1">
                                                        {item.description.substring(
                                                            0,
                                                            50
                                                        )}
                                                        {item.description
                                                            .length > 50
                                                            ? "..."
                                                            : ""}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50 text-blue-700 border-blue-200"
                                            >
                                                {item.category
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    item.category.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={getStockStatusColor(
                                                    item
                                                )}
                                            >
                                                {getStockStatusLabel(item)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        adjustStock(item, -1)
                                                    }
                                                    disabled={
                                                        item.quantity <= 0
                                                    }
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="font-semibold text-gray-900 min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        adjustStock(item, 1)
                                                    }
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            {item.minimum_quantity && (
                                                <div className="text-sm text-gray-500 mt-1">
                                                    Min: {item.minimum_quantity}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-gray-900">
                                                {formatCurrency(
                                                    item.unit_price
                                                )}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold text-green-700">
                                                {formatCurrency(
                                                    item.quantity *
                                                        parseFloat(
                                                            item.unit_price
                                                        )
                                                )}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-700">
                                                {formatDate(item.expiry_date)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route(
                                                                "clinic.inventory.show",
                                                                [
                                                                    clinic.id,
                                                                    item.id,
                                                                ]
                                                            )}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route(
                                                                "clinic.inventory.edit",
                                                                [
                                                                    clinic.id,
                                                                    item.id,
                                                                ]
                                                            )}
                                                        >
                                                            <Pencil className="h-4 w-4 mr-2" />
                                                            Edit Item
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        className="text-center py-12"
                                    >
                                        <div className="text-gray-500">
                                            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                            <p className="text-xl font-medium text-gray-900 mb-2">
                                                No inventory items found
                                            </p>
                                            <p className="text-sm text-gray-600 mb-6">
                                                Get started by adding your first
                                                inventory item.
                                            </p>
                                            <Link
                                                href={route(
                                                    "clinic.inventory.create",
                                                    [clinic.id]
                                                )}
                                            >
                                                <Button className="bg-blue-600 hover:bg-blue-700">
                                                    <PlusCircle className="h-4 w-4 mr-2" />
                                                    Add First Item
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {inventory.links && inventory.links.length > 3 && (
                        <div className="flex items-center justify-between p-6 border-t border-gray-200">
                            <div className="text-sm text-gray-700">
                                Showing {inventory.from} to {inventory.to} of{" "}
                                {inventory.total} results
                            </div>
                            <Pagination links={inventory.links} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
