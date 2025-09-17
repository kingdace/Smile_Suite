import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import ExportButton from "@/Components/Reports/ExportButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Package,
    Search,
    Filter,
    Download,
    Eye,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    BarChart3,
    ArrowLeft,
    DollarSign,
    Box,
    AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";

export default function Inventory({
    auth,
    clinic,
    inventory,
    inventoryStats,
    filters,
}) {
    const [search, setSearch] = useState(filters?.search || "");
    const [category, setCategory] = useState(filters?.category || "");
    const [stockStatus, setStockStatus] = useState(filters?.stock_status || "");

    const handleSearch = () => {
        router.get(
            route("clinic.reports.inventory", clinic.id),
            {
                search,
                category,
                stock_status: stockStatus,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setStockStatus("");
        router.get(
            route("clinic.reports.inventory", clinic.id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return format(new Date(date), "MMM dd, yyyy");
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const getStockStatusBadge = (item) => {
        const quantity = item.quantity || 0;
        const minStock = item.min_stock || 0;

        if (quantity === 0) {
            return (
                <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Out of Stock
                </Badge>
            );
        } else if (quantity <= minStock) {
            return (
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Low Stock
                </Badge>
            );
        } else {
            return (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    In Stock
                </Badge>
            );
        }
    };

    const getStockStatusColor = (item) => {
        const quantity = item.quantity || 0;
        const minStock = item.min_stock || 0;

        if (quantity === 0) return "#ef4444";
        if (quantity <= minStock) return "#f59e0b";
        return "#10b981";
    };

    // Sample data for charts (replace with real data from backend)
    const stockLevels = [
        {
            name: "In Stock",
            value: inventoryStats?.in_stock || 0,
            color: "#10b981",
        },
        {
            name: "Low Stock",
            value: inventoryStats?.low_stock || 0,
            color: "#f59e0b",
        },
        {
            name: "Out of Stock",
            value: inventoryStats?.out_of_stock || 0,
            color: "#ef4444",
        },
    ];

    const categoryDistribution = [
        {
            name: "Dental Supplies",
            value: inventoryStats?.categories?.dental_supplies || 0,
            color: "#3b82f6",
        },
        {
            name: "Medications",
            value: inventoryStats?.categories?.medications || 0,
            color: "#8b5cf6",
        },
        {
            name: "Equipment",
            value: inventoryStats?.categories?.equipment || 0,
            color: "#f59e0b",
        },
        {
            name: "Consumables",
            value: inventoryStats?.categories?.consumables || 0,
            color: "#10b981",
        },
    ];

    const stockTrends = [
        { month: "Jan", items: 45, value: 125000 },
        { month: "Feb", items: 52, value: 142000 },
        { month: "Mar", items: 48, value: 138000 },
        { month: "Apr", items: 61, value: 165000 },
        { month: "May", items: 55, value: 152000 },
        { month: "Jun", items: 58, value: 178000 },
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Inventory Report" />

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Inventory Report
                            </h1>
                            <p className="text-purple-100">
                                Stock levels and inventory management analysis
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            exportRoute={`/clinic/${clinic.id}/reports/export/inventory`}
                            filters={filters}
                            clinic={clinic}
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        />
                        <Link href={route("clinic.reports.index", clinic.id)}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Reports
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Items
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatNumber(inventoryStats?.total || 0)}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Low Stock Items
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {formatNumber(
                                        inventoryStats?.low_stock || 0
                                    )}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Out of Stock
                                </p>
                                <p className="text-2xl font-bold text-red-600">
                                    {formatNumber(
                                        inventoryStats?.out_of_stock || 0
                                    )}
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Value
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(
                                        inventoryStats?.total_value || 0
                                    )}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Stock Status Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stockLevels}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) =>
                                        `${name}: ${value}`
                                    }
                                >
                                    {stockLevels.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Category Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search & Filter Inventory
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="search">Search</Label>
                            <Input
                                id="search"
                                placeholder="Item name, SKU, description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) =>
                                    e.key === "Enter" && handleSearch()
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">
                                        All Categories
                                    </SelectItem>
                                    <SelectItem value="dental_supplies">
                                        Dental Supplies
                                    </SelectItem>
                                    <SelectItem value="medications">
                                        Medications
                                    </SelectItem>
                                    <SelectItem value="equipment">
                                        Equipment
                                    </SelectItem>
                                    <SelectItem value="consumables">
                                        Consumables
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="stockStatus">Stock Status</Label>
                            <Select
                                value={stockStatus}
                                onValueChange={setStockStatus}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
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
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <Button
                            onClick={handleSearch}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                        <Button variant="outline" onClick={clearFilters}>
                            <Filter className="w-4 h-4 mr-2" />
                            Clear All
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Inventory Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Inventory Items ({inventory?.total || 0})
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Min Stock</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead>Total Value</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory?.data?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-sm">
                                                {item.sku}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="capitalize"
                                            >
                                                {item.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {formatNumber(
                                                    item.quantity || 0
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-600">
                                                {formatNumber(
                                                    item.min_stock || 0
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {formatCurrency(
                                                    item.unit_price || 0
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-green-600">
                                                {formatCurrency(
                                                    (item.quantity || 0) *
                                                        (item.unit_price || 0)
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStockStatusBadge(item)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route(
                                                        "clinic.inventory.show",
                                                        [clinic.id, item.id]
                                                    )}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {inventory?.links && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Showing {inventory.from} to {inventory.to} of{" "}
                                {inventory.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                {inventory.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? "bg-purple-600 text-white"
                                                : "bg-white text-gray-700 border hover:bg-gray-50"
                                        } ${
                                            !link.url &&
                                            "opacity-50 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
