import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
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
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
    Search,
    Filter,
    Plus,
    Package,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Calendar,
    MapPin,
    Barcode,
    Eye,
    Edit,
    MoreHorizontal,
    Download,
    Upload,
    RefreshCw,
    BarChart3,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Trash2,
    Settings,
    Activity,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function Index({ auth, clinic, inventory, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [category, setCategory] = useState(filters.category || "all");
    const [status, setStatus] = useState(filters.status || "all");
    const [supplier, setSupplier] = useState(filters.supplier || "all");
    const [sortBy, setSortBy] = useState(filters.sort_by || "name");
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "asc");
    const [showFilters, setShowFilters] = useState(false);

    // Calculate summary statistics
    const totalItems = inventory.total || 0;
    const lowStockItems = inventory.data
        ? inventory.data.filter(
              (item) => item.quantity <= item.minimum_quantity
          ).length
        : 0;
    const outOfStockItems = inventory.data
        ? inventory.data.filter((item) => item.quantity <= 0).length
        : 0;
    const expiringItems = inventory.data
        ? inventory.data.filter(
              (item) =>
                  item.expiry_date &&
                  new Date(item.expiry_date) <=
                      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ).length
        : 0;
    const totalValue = inventory.data
        ? inventory.data.reduce(
              (sum, item) => sum + item.quantity * parseFloat(item.unit_price),
              0
          )
        : 0;

    // Get unique categories and suppliers for filters
    const categories = inventory.data
        ? [...new Set(inventory.data.map((item) => item.category))]
        : [];
    const suppliers = inventory.data
        ? [
              ...new Set(
                  inventory.data
                      .map((item) => item.supplier?.name)
                      .filter(Boolean)
              ),
          ]
        : [];

    // Function to perform the search using router.reload
    const performSearch = (query) => {
        router.reload({
            data: { search: query },
            only: ["inventory", "filters"],
            preserveState: true,
            replace: true,
        });
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        performSearch(query);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        performSearch(search);
    };

    const applyFilters = () => {
        router.get(
            route("clinic.inventory.index", [clinic.id]),
            {
                search,
                category: category === "all" ? "" : category,
                status: status === "all" ? "" : status,
                supplier: supplier === "all" ? "" : supplier,
                sort_by: sortBy,
                sort_order: sortOrder,
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
        setStatus("all");
        setSupplier("all");
        setSortBy("name");
        setSortOrder("asc");
        router.get(
            route("clinic.inventory.index", [clinic.id]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getStockStatusColor = (item) => {
        if (item.quantity <= 0) return "destructive";
        if (item.quantity <= item.minimum_quantity) return "secondary";
        return "default";
    };

    const getStockStatusLabel = (item) => {
        if (item.quantity <= 0) return "Out of Stock";
        if (item.quantity <= item.minimum_quantity) return "Low Stock";
        return "In Stock";
    };

    const getExpiryStatusColor = (item) => {
        if (!item.expiry_date) return "default";
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const thirtyDaysFromNow = new Date(
            today.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        if (expiryDate <= today) return "destructive";
        if (expiryDate <= thirtyDaysFromNow) return "secondary";
        return "default";
    };

    const getExpiryStatusLabel = (item) => {
        if (!item.expiry_date) return "No Expiry";
        const expiryDate = new Date(item.expiry_date);
        const today = new Date();
        const thirtyDaysFromNow = new Date(
            today.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        if (expiryDate <= today) return "Expired";
        if (expiryDate <= thirtyDaysFromNow) return "Expiring Soon";
        return "Valid";
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
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
                                        Manage and track your clinic's inventory
                                        and supplies
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="gap-2 text-sm px-4 py-2 rounded-xl transition-all duration-300 border backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                                <Link
                                    href={route(
                                        "clinic.inventory.transactions.index",
                                        [clinic.id]
                                    )}
                                >
                                    <Button
                                        variant="outline"
                                        className="gap-2 text-sm px-4 py-2 rounded-xl transition-all duration-300 border backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                                    >
                                        <BarChart3 className="h-4 w-4" />
                                        Transactions
                                    </Button>
                                </Link>
                                <Link
                                    href={route("clinic.inventory.create", [
                                        clinic.id,
                                    ])}
                                >
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm">
                                        <Plus className="h-4 w-4" />
                                        Add Item
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt--10 pb-12">
                    {/* Enhanced Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Package className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Total Items
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {totalItems}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                All inventory items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-yellow-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-yellow-500 via-yellow-600 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <AlertTriangle className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Low Stock
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {lowStockItems}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-yellow-600 font-medium">
                                                Needs restocking
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-red-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-red-400 to-red-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <XCircle className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Out of Stock
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {outOfStockItems}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-red-600 font-medium">
                                                Urgent restock needed
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <DollarSign className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Total Value
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {formatCurrency(totalValue)}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                Current inventory value
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
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Inventory Records
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Manage and view all inventory items
                                            and supplies
                                        </p>
                                    </div>
                                </div>

                                {/* Search and Filters - Second Row */}
                                <div className="flex items-center gap-4 justify-center">
                                    {/* Search Bar */}
                                    <div className="relative w-96">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            type="text"
                                            placeholder="Search inventory items..."
                                            value={search}
                                            onChange={handleInputChange}
                                            className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full rounded-lg"
                                        />
                                    </div>

                                    {/* Filter Dropdowns */}
                                    <div className="flex items-center gap-3">
                                        <Select
                                            value={category}
                                            onValueChange={setCategory}
                                        >
                                            <SelectTrigger className="w-36 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Categories
                                                </SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem
                                                        key={cat}
                                                        value={cat}
                                                    >
                                                        {cat
                                                            .replace(/_/g, " ")
                                                            .replace(
                                                                /\b\w/g,
                                                                (l) =>
                                                                    l.toUpperCase()
                                                            )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={status}
                                            onValueChange={setStatus}
                                        >
                                            <SelectTrigger className="w-36 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Status
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

                                        <Select
                                            value={supplier}
                                            onValueChange={setSupplier}
                                        >
                                            <SelectTrigger className="w-40 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg">
                                                <SelectValue placeholder="Supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Suppliers
                                                </SelectItem>
                                                {suppliers.map((sup) => (
                                                    <SelectItem
                                                        key={sup}
                                                        value={sup}
                                                    >
                                                        {sup}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            onClick={applyFilters}
                                            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                        >
                                            <Search className="h-4 w-4 mr-2" />
                                            Search
                                        </Button>
                                        <Button
                                            onClick={clearFilters}
                                            variant="outline"
                                            className="h-11 px-4 rounded-lg"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Clear
                                        </Button>
                                    </div>
                                </div>

                                {/* Action Buttons - Third Row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Import
                                        </Button>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Showing {inventory.from || 0} to{" "}
                                        {inventory.to || 0} of{" "}
                                        {inventory.total || 0} results
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                                        <TableHead className="font-bold text-blue-900 py-4 text-left">
                                            Item
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Category
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Stock Status
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Quantity
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Unit Price
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Total Value
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Supplier
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Expiry
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventory.data &&
                                    inventory.data.length > 0 ? (
                                        inventory.data.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-100"
                                            >
                                                <TableCell className="py-4">
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-base">
                                                            {item.name}
                                                        </div>
                                                        {item.sku && (
                                                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                                <Barcode className="h-3 w-3" />
                                                                {item.sku}
                                                            </div>
                                                        )}
                                                        {item.location && (
                                                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {item.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                                                    >
                                                        {item.category
                                                            .replace(/_/g, " ")
                                                            .replace(
                                                                /\b\w/g,
                                                                (l) =>
                                                                    l.toUpperCase()
                                                            )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <Badge
                                                        variant={getStockStatusColor(
                                                            item
                                                        )}
                                                        className={
                                                            getStockStatusColor(
                                                                item
                                                            ) === "destructive"
                                                                ? "bg-red-100 text-red-700 border-red-200 font-medium"
                                                                : getStockStatusColor(
                                                                      item
                                                                  ) ===
                                                                  "secondary"
                                                                ? "bg-yellow-100 text-yellow-700 border-yellow-200 font-medium"
                                                                : "bg-green-100 text-green-700 border-green-200 font-medium"
                                                        }
                                                    >
                                                        {getStockStatusLabel(
                                                            item
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-bold text-gray-900 text-lg">
                                                        {item.quantity}
                                                    </span>
                                                    {item.minimum_quantity && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            Min:{" "}
                                                            {
                                                                item.minimum_quantity
                                                            }
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-bold text-gray-900 text-lg">
                                                        {formatCurrency(
                                                            item.unit_price
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-bold text-green-700 text-lg">
                                                        {formatCurrency(
                                                            item.quantity *
                                                                parseFloat(
                                                                    item.unit_price
                                                                )
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-medium text-gray-700">
                                                        {item.supplier?.name ||
                                                            "N/A"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <Badge
                                                        variant={getExpiryStatusColor(
                                                            item
                                                        )}
                                                        className={
                                                            getExpiryStatusColor(
                                                                item
                                                            ) === "destructive"
                                                                ? "bg-red-100 text-red-700 border-red-200 font-medium"
                                                                : getExpiryStatusColor(
                                                                      item
                                                                  ) ===
                                                                  "secondary"
                                                                ? "bg-orange-100 text-orange-700 border-orange-200 font-medium"
                                                                : "bg-green-100 text-green-700 border-green-200 font-medium"
                                                        }
                                                    >
                                                        {getExpiryStatusLabel(
                                                            item
                                                        )}
                                                    </Badge>
                                                    {item.expiry_date && (
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {formatDate(
                                                                item.expiry_date
                                                            )}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-9 w-9 p-0 hover:bg-blue-100 rounded-lg"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuItem
                                                                asChild
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
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "clinic.inventory.edit",
                                                                        [
                                                                            clinic.id,
                                                                            item.id,
                                                                        ]
                                                                    )}
                                                                >
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Edit Item
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                asChild
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "clinic.inventory.transactions.history",
                                                                        [
                                                                            clinic.id,
                                                                            item.id,
                                                                        ]
                                                                    )}
                                                                >
                                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                                    Transaction
                                                                    History
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
                                                colSpan={9}
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
                                                            <Plus className="h-4 w-4 mr-2" />
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
                                        Showing {inventory.from} to{" "}
                                        {inventory.to} of {inventory.total}{" "}
                                        results
                                    </div>
                                    <div className="flex gap-2">
                                        {inventory.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                    link.active
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
