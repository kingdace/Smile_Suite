import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import ProtectedRoute from "@/Components/ProtectedRoute";
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
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import React, { useState } from "react";

export default function Index({ auth, clinic, inventory, filters, stats }) {
    const [search, setSearch] = useState(filters.search || "");
    const [category, setCategory] = useState(filters.category || "all");
    const [stockFilter, setStockFilter] = useState(
        filters.stock_filter || "all"
    );

    // Pagination helper function
    const getPageNumbers = () => {
        if (!inventory?.last_page) return [];

        const currentPage = inventory.current_page || 1;
        const lastPage = inventory.last_page;
        const pageNumbers = [];

        // Always show first page and last page
        pageNumbers.push(1);

        // Calculate start and end of page range
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(lastPage - 1, currentPage + 1);

        // If current page is near the start
        if (currentPage <= 3) {
            start = 2;
            end = Math.min(5, lastPage - 1);
        }

        // If current page is near the end
        if (currentPage >= lastPage - 2) {
            start = Math.max(2, lastPage - 4);
            end = lastPage - 1;
        }

        // Add pages between start and end
        for (let i = start; i <= end; i++) {
            if (!pageNumbers.includes(i)) {
                pageNumbers.push(i);
            }
        }

        // Add last page if not already included
        if (lastPage > 1 && !pageNumbers.includes(lastPage)) {
            pageNumbers.push(lastPage);
        }

        return pageNumbers;
    };

    // Use backend-provided statistics (covers all records, not just current page)
    const totalItems = stats?.total_items || inventory.total || 0;
    const lowStockItems = stats?.low_stock_items || 0;
    const outOfStockItems = stats?.out_of_stock_items || 0;
    const totalValue = stats?.total_value || 0;

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

    const handleExportAllInventory = () => {
        // Create export URL for all inventory items
        const exportUrl = route("clinic.inventory.export", {
            clinic: clinic.id,
            format: "excel",
        });

        // Fix the URL if it's using localhost instead of 127.0.0.1:8000
        const correctedUrl = exportUrl.replace(
            "http://localhost",
            "http://127.0.0.1:8000"
        );

        // Open the export URL in a new window to trigger download
        window.open(correctedUrl, "_blank");
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
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Inventory Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Track and manage all clinic inventory
                                        items
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleExportAllInventory}
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <Download className="h-4 w-4" />
                                    Export All
                                </Button>
                                <ProtectedRoute
                                    permission="add_inventory"
                                    isButton={true}
                                >
                                    <Button
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "clinic.inventory.create",
                                                    [clinic.id]
                                                )
                                            )
                                        }
                                        className="gap-2 bg-white border-white/30 text-blue-700 hover:bg-white/90 text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm font-semibold"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Add Item
                                    </Button>
                                </ProtectedRoute>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt--10 pb-12">
                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt--10">
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-5 relative">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <p className="text-xs text-gray-600 font-medium mb-1 leading-tight">
                                            Total Items
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 mb-1 leading-tight truncate">
                                            {totalItems}
                                        </p>
                                        <div className="flex items-center justify-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] text-blue-600 font-medium truncate">
                                                All items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-yellow-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-5 relative">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <p className="text-xs text-gray-600 font-medium mb-1 leading-tight">
                                            Low Stock
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 mb-1 leading-tight truncate">
                                            {lowStockItems}
                                        </p>
                                        <div className="flex items-center justify-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] text-yellow-600 font-medium truncate">
                                                Needs attention
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-5 relative">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                                        <XCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <p className="text-xs text-gray-600 font-medium mb-1 leading-tight">
                                            Out of Stock
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 mb-1 leading-tight truncate">
                                            {outOfStockItems}
                                        </p>
                                        <div className="flex items-center justify-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] text-red-600 font-medium truncate">
                                                Zero quantity
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-5 relative">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="p-3 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0 w-full">
                                        <p className="text-xs text-gray-600 font-medium mb-1 leading-tight">
                                            Total Value
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 mb-1 leading-tight truncate">
                                            {formatCurrency(totalValue)}
                                        </p>
                                        <div className="flex items-center justify-center gap-1">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] text-green-600 font-medium truncate">
                                                Inventory worth
                                            </span>
                                        </div>
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
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                <Select
                                    value={category}
                                    onValueChange={setCategory}
                                >
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
                                        <SelectItem value="others">
                                            Others
                                        </SelectItem>
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
                                        <SelectItem value="all">
                                            All Stock
                                        </SelectItem>
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
                                <Button
                                    onClick={clearFilters}
                                    variant="outline"
                                >
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
                                    {inventory.data &&
                                    inventory.data.length > 0 ? (
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
                                                                    ID:{" "}
                                                                    {item.id}
                                                                </span>
                                                            </div>
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
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase() +
                                                                    item.category.slice(
                                                                        1
                                                                    )
                                                                ) : (
                                                                    <span className="text-gray-400 italic font-normal">
                                                                        No
                                                                        category
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
                                                            {getStockStatusLabel(
                                                                item
                                                            )}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <div className="flex items-center gap-2">
                                                            <ProtectedRoute
                                                                permission="edit_inventory"
                                                                isButton={true}
                                                            >
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
                                                                        item.quantity <=
                                                                        0
                                                                    }
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                            </ProtectedRoute>
                                                            <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs border border-blue-200 font-bold">
                                                                {item.quantity}
                                                            </span>
                                                            <ProtectedRoute
                                                                permission="edit_inventory"
                                                                isButton={true}
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        adjustStock(
                                                                            item,
                                                                            1
                                                                        )
                                                                    }
                                                                    className="h-6 w-6 p-0"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </ProtectedRoute>
                                                        </div>
                                                        {item.minimum_quantity && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                Min:{" "}
                                                                {
                                                                    item.minimum_quantity
                                                                }
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
                                                                    [
                                                                        clinic.id,
                                                                        item.id,
                                                                    ]
                                                                )}
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                        <ProtectedRoute
                                                            permission="edit_inventory"
                                                            isButton={true}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        route(
                                                                            "clinic.inventory.edit",
                                                                            [
                                                                                clinic.id,
                                                                                item.id,
                                                                            ]
                                                                        )
                                                                    )
                                                                }
                                                                className="h-8 w-8 p-0 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 rounded-lg transition-all duration-200 hover:scale-105"
                                                                title="Edit Item"
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                        </ProtectedRoute>
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
                                                        Get started by adding
                                                        your first inventory
                                                        item.
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
                            {inventory.data &&
                                inventory.data.length > 0 &&
                                inventory.last_page > 1 && (
                                    <div className="flex items-center justify-between p-6 border-t border-gray-200">
                                        <div className="text-sm text-gray-700">
                                            Showing {inventory.from} to{" "}
                                            {inventory.to} of {inventory.total}{" "}
                                            results
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {/* Previous Button */}
                                            {inventory?.links?.find((link) =>
                                                link.label?.includes("Previous")
                                            )?.url ? (
                                                <Link
                                                    href={
                                                        inventory.links.find(
                                                            (link) =>
                                                                link.label?.includes(
                                                                    "Previous"
                                                                )
                                                        ).url
                                                    }
                                                    className="px-3 py-2 text-sm font-medium rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <span className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                                                    <ChevronLeft className="h-4 w-4" />
                                                </span>
                                            )}

                                            {/* Page Numbers */}
                                            {getPageNumbers().map(
                                                (page, idx) => {
                                                    const link =
                                                        inventory.links.find(
                                                            (l) =>
                                                                parseInt(
                                                                    l.label
                                                                ) === page
                                                        );

                                                    return (
                                                        <React.Fragment
                                                            key={page}
                                                        >
                                                            {/* Show ellipsis before if needed */}
                                                            {idx > 0 &&
                                                                getPageNumbers()[
                                                                    idx - 1
                                                                ] <
                                                                    page -
                                                                        1 && (
                                                                    <span className="px-2 text-gray-400">
                                                                        ...
                                                                    </span>
                                                                )}

                                                            {link?.url ? (
                                                                <Link
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                                        link.active
                                                                            ? "bg-blue-600 text-white"
                                                                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                                                    }`}
                                                                >
                                                                    {page}
                                                                </Link>
                                                            ) : (
                                                                <span
                                                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                                        page ===
                                                                        inventory.current_page
                                                                            ? "bg-blue-600 text-white"
                                                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                                    }`}
                                                                >
                                                                    {page}
                                                                </span>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                }
                                            )}

                                            {/* Next Button */}
                                            {inventory?.links?.find((link) =>
                                                link.label?.includes("Next")
                                            )?.url ? (
                                                <Link
                                                    href={
                                                        inventory.links.find(
                                                            (link) =>
                                                                link.label?.includes(
                                                                    "Next"
                                                                )
                                                        ).url
                                                    }
                                                    className="px-3 py-2 text-sm font-medium rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-all duration-200"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Link>
                                            ) : (
                                                <span className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                                                    <ChevronRight className="h-4 w-4" />
                                                </span>
                                            )}
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
