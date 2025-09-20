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
    Settings,
    Calendar,
    AudioLines,
    Shapes,
    Activity,
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

            {/* Inventory Records Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50">
                    <div className="space-y-6">
                        {/* Title Section - Top Row */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Package className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">
                                    Inventory Records
                                </CardTitle>
                                <p className="text-sm text-gray-600">
                                    Manage and view all inventory items
                                </p>
                            </div>
                        </div>
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
                            <TableRow className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/70">
                                <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-blue-600" />
                                        Item Name
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Shapes className="h-4 w-4 text-blue-600" />
                                        Category
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                                        Stock Status
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-blue-600" />
                                        Quantity
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-blue-600" />
                                        Unit Price
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-blue-600" />
                                        Total Value
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                        Expiry
                                    </div>
                                </TableHead>
                                <TableHead className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center justify-center gap-2">
                                        <Settings className="h-4 w-4 text-blue-600" />
                                        Actions
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.data && inventory.data.length > 0 ? (
                                inventory.data.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-indigo-50/40 hover:to-cyan-50/60 transition-all duration-300 border-b border-gray-100/50 hover:border-blue-200/50"
                                    >
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                                    <Package className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-bold text-gray-900 text-base leading-tight">
                                                        {item.name}
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-wrap">
                                                        <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                                                            ID: {item.id}
                                                        </span>
                                                    </div>
                                                    {item.description && (
                                                        <div className="text-xs text-gray-500 line-clamp-1">
                                                            {item.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-3 w-3 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {item.category ? (
                                                            item.category
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            item.category.slice(
                                                                1
                                                            )
                                                        ) : (
                                                            <span className="text-gray-400 italic font-normal">
                                                                No category
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2">
                                                <Badge
                                                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStockStatusColor(
                                                        item
                                                    )}`}
                                                >
                                                    {getStockStatusLabel(item)}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            adjustStock(
                                                                item,
                                                                -1
                                                            )
                                                        }
                                                        disabled={
                                                            item.quantity <= 0
                                                        }
                                                        className="h-6 w-6 p-0"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs border border-blue-200 font-bold">
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
                                                    <div className="mt-1 text-xs text-gray-500">
                                                        Min:{" "}
                                                        {item.minimum_quantity}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs border border-emerald-200 font-bold">
                                                    {formatCurrency(
                                                        item.unit_price
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                <span className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded text-xs border border-green-200 font-bold">
                                                    {formatCurrency(
                                                        item.quantity *
                                                            parseFloat(
                                                                item.unit_price
                                                            )
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                <span className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded text-xs border border-cyan-200">
                                                    {formatDate(
                                                        item.expiry_date
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-105"
                                                    title="View Item Details"
                                                >
                                                    <Link
                                                        href={route(
                                                            "clinic.inventory.show",
                                                            [clinic.id, item.id]
                                                        )}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="h-8 w-8 p-0 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 rounded-lg transition-all duration-200 hover:scale-105"
                                                    title="Edit Item"
                                                >
                                                    <Link
                                                        href={route(
                                                            "clinic.inventory.edit",
                                                            [clinic.id, item.id]
                                                        )}
                                                    >
                                                        <Pencil className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            </div>
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
