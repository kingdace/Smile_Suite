import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
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
import { format } from "date-fns";
import {
    Search,
    PlusCircle,
    Filter,
    Package,
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Activity,
    Clock,
    User,
    FileText,
    Eye,
    Pencil,
    Trash2,
    Settings,
    CheckCircle,
    AlertCircle,
    XCircle,
    Timer,
    BarChart3,
    Download,
    Upload,
    RefreshCw,
    MapPin,
    Barcode,
    MoreHorizontal,
    Calendar,
    Star,
    BookmarkPlus,
    Bookmark,
    X,
    ChevronDown,
    ChevronRight,
    Sliders,
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
    const [status, setStatus] = useState(filters.status || "all");
    const [supplier, setSupplier] = useState(filters.supplier || "all");
    const [sortBy, setSortBy] = useState(filters.sort_by || "name");
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "asc");
    const [showFilters, setShowFilters] = useState(false);
    
    // Advanced filtering states
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [quantityRange, setQuantityRange] = useState({ min: "", max: "" });
    const [expiryFilter, setExpiryFilter] = useState("all");
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [savedFilters, setSavedFilters] = useState([
        { id: 1, name: "Low Stock Alert", filters: { status: "low_stock" }, icon: AlertTriangle },
        { id: 2, name: "Out of Stock", filters: { status: "out_of_stock" }, icon: XCircle },
        { id: 3, name: "Expiring Soon", filters: { expiry: "expiring" }, icon: Timer },
        { id: 4, name: "High Value Items", filters: { price_min: "100" }, icon: DollarSign },
    ]);
    const [activeQuickFilter, setActiveQuickFilter] = useState(null);

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
        setPriceRange({ min: "", max: "" });
        setQuantityRange({ min: "", max: "" });
        setExpiryFilter("all");
        setDateRange({ from: "", to: "" });
        setActiveQuickFilter(null);
        router.get(route("clinic.inventory.index", [clinic.id]));
    };

    const applyQuickFilter = (filterPreset) => {
        setActiveQuickFilter(filterPreset.id);
        const filters = filterPreset.filters;
        
        if (filters.status) setStatus(filters.status);
        if (filters.expiry) setExpiryFilter(filters.expiry);
        if (filters.price_min) setPriceRange(prev => ({ ...prev, min: filters.price_min }));
        
        // Apply the filters
        router.get(route("clinic.inventory.index", [clinic.id]), {
            search,
            category: category === "all" ? "" : category,
            status: filters.status || (status === "all" ? "" : status),
            supplier: supplier === "all" ? "" : supplier,
            expiry: filters.expiry || (expiryFilter === "all" ? "" : expiryFilter),
            price_min: filters.price_min || priceRange.min,
            price_max: priceRange.max,
            quantity_min: quantityRange.min,
            quantity_max: quantityRange.max,
            sort_by: sortBy,
            sort_order: sortOrder,
        });
    };

    const saveCurrentFilters = () => {
        const filterName = prompt("Enter a name for this filter preset:");
        if (filterName) {
            const newFilter = {
                id: Date.now(),
                name: filterName,
                filters: {
                    search,
                    category: category !== "all" ? category : "",
                    status: status !== "all" ? status : "",
                    supplier: supplier !== "all" ? supplier : "",
                    expiry: expiryFilter !== "all" ? expiryFilter : "",
                    price_min: priceRange.min,
                    price_max: priceRange.max,
                    quantity_min: quantityRange.min,
                    quantity_max: quantityRange.max,
                },
                icon: Bookmark,
            };
            setSavedFilters(prev => [...prev, newFilter]);
        }
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

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                {/* Clean Header */}
                <div className="pt-6 pb-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30 hover:bg-white/30 transition-all duration-300">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-xl font-bold text-white drop-shadow-sm">
                                                    Inventory Management
                                                </h1>
                                                <p className="text-sm text-blue-100 font-medium">
                                                    Manage and track your clinic's inventory
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                        >
                                            <Link href={route("clinic.inventory.transactions.index", [clinic.id])}>
                                                <BarChart3 className="h-4 w-4 mr-2" />
                                                Transactions
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            asChild
                                            className="bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                                        >
                                            <Link href={route("clinic.inventory.create", [clinic.id])}>
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Add Item
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Items */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 mb-1">Total Items</p>
                                        <p className="text-3xl font-bold text-blue-900">{totalItems}</p>
                                        <div className="flex items-center mt-2">
                                            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                                            <span className="text-sm text-emerald-600 font-medium">Active</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Package className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Low Stock Items */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-amber-700 mb-1">Low Stock</p>
                                        <p className="text-3xl font-bold text-amber-900">{lowStockItems}</p>
                                        <div className="flex items-center mt-2">
                                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                                            <span className="text-sm text-amber-600 font-medium">Need attention</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <AlertTriangle className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Out of Stock */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-pink-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-700 mb-1">Out of Stock</p>
                                        <p className="text-3xl font-bold text-red-900">{outOfStockItems}</p>
                                        <div className="flex items-center mt-2">
                                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                            <span className="text-sm text-red-600 font-medium">Urgent</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <XCircle className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Value */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-emerald-700 mb-1">Total Value</p>
                                        <p className="text-3xl font-bold text-emerald-900">{formatCurrency(totalValue)}</p>
                                        <div className="flex items-center mt-2">
                                            <DollarSign className="h-4 w-4 text-emerald-500 mr-1" />
                                            <span className="text-sm text-emerald-600 font-medium">Inventory worth</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Filter Buttons */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                                Quick Filters
                            </h3>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className="flex items-center"
                                >
                                    <Sliders className="h-4 w-4 mr-2" />
                                    Advanced Filters
                                    {showAdvancedFilters ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={saveCurrentFilters}
                                    className="flex items-center"
                                >
                                    <BookmarkPlus className="h-4 w-4 mr-2" />
                                    Save Filter
                                </Button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {savedFilters.map((filter) => {
                                const IconComponent = filter.icon;
                                const isActive = activeQuickFilter === filter.id;
                                return (
                                    <Button
                                        key={filter.id}
                                        variant={isActive ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => applyQuickFilter(filter)}
                                        className={`flex items-center justify-center p-3 h-auto ${
                                            isActive 
                                                ? "bg-blue-600 text-white shadow-lg" 
                                                : "hover:bg-blue-50 hover:border-blue-300"
                                        }`}
                                    >
                                        <IconComponent className="h-4 w-4 mr-2" />
                                        <span className="font-medium">{filter.name}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Advanced Filters Panel */}
                    {showAdvancedFilters && (
                        <Card className="mb-6 border-0 shadow-xl bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Filter className="h-5 w-5 text-blue-500 mr-2" />
                                        Advanced Filters
                                    </CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAdvancedFilters(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Price Range */}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                                className="w-full"
                                            />
                                            <span className="text-gray-500">-</span>
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Quantity Range */}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Quantity Range</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={quantityRange.min}
                                                onChange={(e) => setQuantityRange(prev => ({ ...prev, min: e.target.value }))}
                                                className="w-full"
                                            />
                                            <span className="text-gray-500">-</span>
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={quantityRange.max}
                                                onChange={(e) => setQuantityRange(prev => ({ ...prev, max: e.target.value }))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Expiry Filter */}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Expiry Status</Label>
                                        <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select expiry status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Items</SelectItem>
                                                <SelectItem value="expired">Expired</SelectItem>
                                                <SelectItem value="expiring">Expiring Soon (30 days)</SelectItem>
                                                <SelectItem value="valid">Valid</SelectItem>
                                                <SelectItem value="no_expiry">No Expiry Date</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Date Range */}
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Created Date</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                type="date"
                                                value={dateRange.from}
                                                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                                className="w-full"
                                            />
                                            <span className="text-gray-500">-</span>
                                            <Input
                                                type="date"
                                                value={dateRange.to}
                                                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                                    <Button variant="outline" onClick={clearFilters}>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Clear All
                                    </Button>
                                    <Button onClick={applyFilters}>
                                        <Search className="h-4 w-4 mr-2" />
                                        Apply Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Inventory Table */}
                    <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-gray-900">Inventory Items</CardTitle>
                                        <p className="text-sm text-gray-600">Manage your clinic's inventory</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            type="text"
                                            placeholder="Search inventory items..."
                                            value={search}
                                            onChange={handleInputChange}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="in_stock">In Stock</SelectItem>
                                            <SelectItem value="low_stock">Low Stock</SelectItem>
                                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={applyFilters}>
                                        <Search className="h-4 w-4 mr-2" />
                                        Search
                                    </Button>
                                    <Button onClick={clearFilters} variant="outline">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-semibold text-gray-900">Item</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Category</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Stock Status</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Quantity</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Unit Price</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Total Value</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Supplier</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Expiry</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {inventory.data && inventory.data.length > 0 ? (
                                        inventory.data.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                                                <TableCell className="py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">{item.name}</div>
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
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                        {item.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStockStatusColor(item)} className={
                                                        getStockStatusColor(item) === "destructive"
                                                            ? "bg-red-100 text-red-700 border-red-200"
                                                            : getStockStatusColor(item) === "secondary"
                                                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                            : "bg-green-100 text-green-700 border-green-200"
                                                    }>
                                                        {getStockStatusLabel(item)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-gray-900">{item.quantity}</span>
                                                    {item.minimum_quantity && (
                                                        <div className="text-sm text-gray-500">Min: {item.minimum_quantity}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-gray-900">{formatCurrency(item.unit_price)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-semibold text-green-700">
                                                        {formatCurrency(item.quantity * parseFloat(item.unit_price))}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-gray-700">{item.supplier?.name || "N/A"}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getExpiryStatusColor(item)} className={
                                                        getExpiryStatusColor(item) === "destructive"
                                                            ? "bg-red-100 text-red-700 border-red-200"
                                                            : getExpiryStatusColor(item) === "secondary"
                                                            ? "bg-orange-100 text-orange-700 border-orange-200"
                                                            : "bg-green-100 text-green-700 border-green-200"
                                                    }>
                                                        {getExpiryStatusLabel(item)}
                                                    </Badge>
                                                    {item.expiry_date && (
                                                        <div className="text-sm text-gray-500 mt-1">{formatDate(item.expiry_date)}</div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route("clinic.inventory.show", [clinic.id, item.id])}>
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route("clinic.inventory.edit", [clinic.id, item.id])}>
                                                                    <Pencil className="h-4 w-4 mr-2" />
                                                                    Edit Item
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={route("clinic.inventory.transactions.history", [clinic.id, item.id])}>
                                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                                    Transaction History
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-12">
                                                <div className="text-gray-500">
                                                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                                    <p className="text-xl font-medium text-gray-900 mb-2">No inventory items found</p>
                                                    <p className="text-sm text-gray-600 mb-6">Get started by adding your first inventory item.</p>
                                                    <Link href={route("clinic.inventory.create", [clinic.id])}>
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
                                        Showing {inventory.from} to {inventory.to} of {inventory.total} results
                                    </div>
                                    <Pagination links={inventory.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
