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
    FileText,
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
    Package,
    Trash2,
    Settings,
    Activity,
    Truck,
    ShoppingCart,
    CheckSquare,
    Square,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function Index({
    auth,
    clinic,
    purchaseOrders,
    summary,
    suppliers,
    filters,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [supplierId, setSupplierId] = useState(filters.supplier_id || "all");
    const [dateFrom, setDateFrom] = useState(filters.date_from || "");
    const [dateTo, setDateTo] = useState(filters.date_to || "");
    const [sortBy, setSortBy] = useState(filters.sort_by || "order_date");
    const [sortOrder, setSortOrder] = useState(filters.sort_order || "desc");

    // Function to perform the search using router.reload
    const performSearch = (query) => {
        router.reload({
            data: { search: query },
            only: ["purchaseOrders", "summary", "filters"],
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
            route("clinic.purchase-orders.index", [clinic.id]),
            {
                search,
                status: status === "all" ? "" : status,
                supplier_id: supplierId === "all" ? "" : supplierId,
                date_from: dateFrom,
                date_to: dateTo,
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
        setStatus("all");
        setSupplierId("all");
        setDateFrom("");
        setDateTo("");
        setSortBy("order_date");
        setSortOrder("desc");
        router.get(
            route("clinic.purchase-orders.index", [clinic.id]),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "approved":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "ordered":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "received":
                return "bg-green-100 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending":
                return "Pending";
            case "approved":
                return "Approved";
            case "ordered":
                return "Ordered";
            case "received":
                return "Received";
            case "cancelled":
                return "Cancelled";
            default:
                return status;
        }
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
            <Head title="Purchase Orders" />

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
                                    <ShoppingCart className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Purchase Orders
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Manage and track purchase orders and
                                        supplier orders
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
                                        "clinic.purchase-orders.create",
                                        [clinic.id]
                                    )}
                                >
                                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm">
                                        <Plus className="h-4 w-4" />
                                        Create PO
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
                                        <FileText className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Total POs
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {summary.total_pos}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                All purchase orders
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
                                        <Clock className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Pending
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {summary.pending_pos}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-yellow-600 font-medium">
                                                Awaiting approval
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-purple-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Truck className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Ordered
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {summary.ordered_pos}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-purple-600 font-medium">
                                                In transit
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
                                            {formatCurrency(
                                                summary.total_value
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                All purchase orders
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Purchase Orders Records Card */}
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
                                            Purchase Orders
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Manage and track all purchase orders
                                            and supplier orders
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
                                            placeholder="Search purchase orders..."
                                            value={search}
                                            onChange={handleInputChange}
                                            className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full rounded-lg"
                                        />
                                    </div>

                                    {/* Filter Dropdowns */}
                                    <div className="flex items-center gap-3">
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
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="approved">
                                                    Approved
                                                </SelectItem>
                                                <SelectItem value="ordered">
                                                    Ordered
                                                </SelectItem>
                                                <SelectItem value="received">
                                                    Received
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={supplierId}
                                            onValueChange={setSupplierId}
                                        >
                                            <SelectTrigger className="w-40 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm rounded-lg">
                                                <SelectValue placeholder="Supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Suppliers
                                                </SelectItem>
                                                {suppliers.map((supplier) => (
                                                    <SelectItem
                                                        key={supplier.id}
                                                        value={supplier.id.toString()}
                                                    >
                                                        {supplier.name}
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
                                        Showing {purchaseOrders.from || 0} to{" "}
                                        {purchaseOrders.to || 0} of{" "}
                                        {purchaseOrders.total || 0} results
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                                        <TableHead className="font-bold text-blue-900 py-4 text-left">
                                            PO Number
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Supplier
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Order Date
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Expected Delivery
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Total Amount
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Created By
                                        </TableHead>
                                        <TableHead className="font-bold text-blue-900 py-4 text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {purchaseOrders.data &&
                                    purchaseOrders.data.length > 0 ? (
                                        purchaseOrders.data.map((po) => (
                                            <TableRow
                                                key={po.id}
                                                className="hover:bg-blue-50/30 transition-all duration-200 border-b border-gray-100"
                                            >
                                                <TableCell className="py-4">
                                                    <div>
                                                        <div className="font-semibold text-gray-900 text-base">
                                                            {po.po_number}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            ID: {po.id}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-medium text-gray-700">
                                                        {po.supplier?.name ||
                                                            "N/A"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={`font-medium ${getStatusColor(
                                                            po.status
                                                        )}`}
                                                    >
                                                        {getStatusLabel(
                                                            po.status
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-medium text-gray-900">
                                                        {formatDate(
                                                            po.order_date
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-medium text-gray-900">
                                                        {formatDate(
                                                            po.expected_delivery_date
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-bold text-green-700 text-lg">
                                                        {formatCurrency(
                                                            po.total_amount
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4 text-center">
                                                    <span className="font-medium text-gray-700">
                                                        {po.created_by_user
                                                            ?.name || "N/A"}
                                                    </span>
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
                                                                        "clinic.purchase-orders.show",
                                                                        [
                                                                            clinic.id,
                                                                            po.id,
                                                                        ]
                                                                    )}
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {po.status ===
                                                                "pending" && (
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "clinic.purchase-orders.edit",
                                                                            [
                                                                                clinic.id,
                                                                                po.id,
                                                                            ]
                                                                        )}
                                                                    >
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Edit PO
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
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
                                                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                                    <p className="text-xl font-medium text-gray-900 mb-2">
                                                        No purchase orders found
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-6">
                                                        Get started by creating
                                                        your first purchase
                                                        order.
                                                    </p>
                                                    <Link
                                                        href={route(
                                                            "clinic.purchase-orders.create",
                                                            [clinic.id]
                                                        )}
                                                    >
                                                        <Button className="bg-blue-600 hover:bg-blue-700">
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Create First PO
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {purchaseOrders.links &&
                                purchaseOrders.links.length > 3 && (
                                    <div className="flex items-center justify-between p-6 border-t border-gray-200">
                                        <div className="text-sm text-gray-700">
                                            Showing {purchaseOrders.from} to{" "}
                                            {purchaseOrders.to} of{" "}
                                            {purchaseOrders.total} results
                                        </div>
                                        <div className="flex gap-2">
                                            {purchaseOrders.links.map(
                                                (link, index) => (
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
                                                )
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
