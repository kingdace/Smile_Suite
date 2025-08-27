import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
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
import { Checkbox } from "@/Components/ui/checkbox";
import {
    DollarSign,
    Plus,
    Search,
    Filter,
    Download,
    Trash2,
    Edit,
    Eye,
    Calendar,
    User,
    Stethoscope,
    Receipt,
    Banknote,
    CreditCard,
    ShieldCheck,
    HelpCircle,
    BarChart2,
    TrendingUp,
    TrendingDown,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
    FileText,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

export default function Index({
    auth,
    payments,
    filters,
    summary,
    patients,
    treatments,
    paymentMethods,
    categories,
}) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedPayments, setSelectedPayments] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [filterState, setFilterState] = useState({
        status: filters.status || "",
        payment_method: filters.payment_method || "",
        category: filters.category || "",
        patient_id: filters.patient_id || "",
        treatment_id: filters.treatment_id || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
        amount_min: filters.amount_min || "",
        amount_max: filters.amount_max || "",
        sort_by: filters.sort_by || "payment_date",
        sort_direction: filters.sort_direction || "desc",
        per_page: filters.per_page || "15",
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.reload({
            data: { search },
            only: ["payments", "filters", "summary"],
            preserveState: true,
            replace: true,
        });
    };

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filterState, [field]: value };
        setFilterState(newFilters);
        router.reload({
            data: newFilters,
            only: ["payments", "filters", "summary"],
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch("");
        setFilterState({
            status: "",
            payment_method: "",
            category: "",
            patient_id: "",
            treatment_id: "",
            date_from: "",
            date_to: "",
            amount_min: "",
            amount_max: "",
            sort_by: "payment_date",
            sort_direction: "desc",
            per_page: "15",
        });
        router.reload({
            data: {
                search: "",
                status: "",
                payment_method: "",
                category: "",
                patient_id: "",
                treatment_id: "",
                date_from: "",
                date_to: "",
                amount_min: "",
                amount_max: "",
                sort_by: "payment_date",
                sort_direction: "desc",
                per_page: "15",
            },
            only: ["payments", "filters", "summary"],
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (
            filterState.sort_by === column &&
            filterState.sort_direction === "asc"
        ) {
            direction = "desc";
        }
        handleFilterChange("sort_by", column);
        handleFilterChange("sort_direction", direction);
    };

    const getSortIcon = (column) => {
        if (filterState.sort_by !== column) return null;
        return filterState.sort_direction === "asc" ? (
            <ChevronUp className="h-4 w-4" />
        ) : (
            <ChevronDown className="h-4 w-4" />
        );
    };

    // Bulk actions handlers
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPayments([]);
            setSelectAll(false);
        } else {
            setSelectedPayments(payments.data.map((payment) => payment.id));
            setSelectAll(true);
        }
    };

    const handleSelectPayment = (paymentId) => {
        if (selectedPayments.includes(paymentId)) {
            setSelectedPayments(
                selectedPayments.filter((id) => id !== paymentId)
            );
            setSelectAll(false);
        } else {
            setSelectedPayments([...selectedPayments, paymentId]);
            if (selectedPayments.length + 1 === payments.data.length) {
                setSelectAll(true);
            }
        }
    };

    const toggleBulkActions = () => {
        if (showBulkActions) {
            setSelectedPayments([]);
            setSelectAll(false);
        }
        setShowBulkActions(!showBulkActions);
    };

    const handleBulkDelete = () => {
        if (selectedPayments.length === 0) {
            alert("Please select payments to delete");
            return;
        }

        if (
            confirm(
                `Are you sure you want to delete ${selectedPayments.length} payment(s)? This action cannot be undone.`
            )
        ) {
            router.delete(
                route("clinic.payments.bulk-destroy", {
                    clinic: auth.clinic?.id,
                }),
                {
                    data: { payment_ids: selectedPayments },
                    onSuccess: () => {
                        setSelectedPayments([]);
                        setSelectAll(false);
                    },
                    onError: (errors) => {
                        console.error("Bulk delete failed:", errors);
                        alert("Failed to delete payments. Please try again.");
                    },
                }
            );
        }
    };

    const handleBulkStatusUpdate = (status) => {
        if (selectedPayments.length === 0) {
            alert("Please select payments to update");
            return;
        }

        if (
            confirm(
                `Are you sure you want to update ${selectedPayments.length} payment(s) status to ${status}?`
            )
        ) {
            router.patch(
                route("clinic.payments.bulk-update", {
                    clinic: auth.clinic?.id,
                }),
                {
                    data: { payment_ids: selectedPayments, status },
                    onSuccess: () => {
                        setSelectedPayments([]);
                        setSelectAll(false);
                    },
                    onError: (errors) => {
                        console.error("Bulk update failed:", errors);
                        alert("Failed to update payments. Please try again.");
                    },
                }
            );
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (filterState.date_from)
            params.append("date_from", filterState.date_from);
        if (filterState.date_to) params.append("date_to", filterState.date_to);
        if (filterState.status) params.append("status", filterState.status);
        if (filterState.payment_method)
            params.append("payment_method", filterState.payment_method);

        const url =
            route("clinic.payments.export", { clinic: auth.clinic?.id }) +
            "?" +
            params.toString();
        window.open(url, "_blank");
    };

    const statusBadge = (status) => {
        const statusConfig = {
            completed: {
                className: "bg-green-100 text-green-700 border-green-300",
                icon: CheckCircle,
            },
            pending: {
                className: "bg-yellow-100 text-yellow-700 border-yellow-300",
                icon: Clock,
            },
            failed: {
                className: "bg-red-100 text-red-700 border-red-300",
                icon: AlertCircle,
            },
            refunded: {
                className: "bg-gray-100 text-gray-700 border-gray-300",
                icon: RefreshCw,
            },
            cancelled: {
                className: "bg-red-100 text-red-700 border-red-300",
                icon: XCircle,
            },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const IconComponent = config.icon;

        return (
            <Badge
                variant="outline"
                className={`font-medium ${config.className}`}
            >
                <IconComponent className="h-3 w-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const methodIcon = (method) => {
        switch (method) {
            case "cash":
                return <Banknote className="h-4 w-4 text-green-500" />;
            case "credit_card":
            case "debit_card":
                return <CreditCard className="h-4 w-4 text-blue-500" />;
            case "insurance":
                return <ShieldCheck className="h-4 w-4 text-purple-500" />;
            case "gcash":
                return <HelpCircle className="h-4 w-4 text-blue-400" />;
            case "bank_transfer":
                return <Banknote className="h-4 w-4 text-indigo-500" />;
            case "check":
                return <FileText className="h-4 w-4 text-orange-500" />;
            default:
                return <HelpCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Payments" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-6 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Payment Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Track and manage all clinic payments and
                                        revenue
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleExport}
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
                                <Button
                                    onClick={() =>
                                        setShowAdvancedFilters(
                                            !showAdvancedFilters
                                        )
                                    }
                                    variant="outline"
                                    className={`gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300 border backdrop-blur-sm ${
                                        showAdvancedFilters
                                            ? "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                                            : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                                    }`}
                                >
                                    <Filter className="h-4 w-4" />
                                    {showAdvancedFilters
                                        ? "Hide Filters"
                                        : "Advanced Filters"}
                                </Button>
                                <Button
                                    onClick={toggleBulkActions}
                                    variant="outline"
                                    className={`gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300 border backdrop-blur-sm ${
                                        showBulkActions
                                            ? "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                                            : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                                    }`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {showBulkActions
                                        ? "Hide Bulk Actions"
                                        : "Bulk Actions"}
                                </Button>
                                <Button
                                    onClick={() =>
                                        router.visit(
                                            route("clinic.payments.create", {
                                                clinic: auth.clinic?.id,
                                            })
                                        )
                                    }
                                    className="gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Payment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-8 mt-6 pb-16">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Revenue
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {formatCurrency(
                                                summary.total_revenue
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-green-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Balance
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {formatCurrency(
                                                summary.total_balance
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <BarChart2 className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-purple-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            This Month
                                        </p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {formatCurrency(
                                                summary.payments_this_month
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-orange-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Pending
                                        </p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {formatCurrency(
                                                summary.pending_payments
                                            )}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Advanced Filters Section */}
                    {showAdvancedFilters && (
                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden mb-6">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Filter className="h-5 w-5 text-blue-600" />
                                    Advanced Filters
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <Label
                                            htmlFor="status"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Status
                                        </Label>
                                        <Select
                                            value={filterState.status}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    "status",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="All Statuses" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    All Statuses
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                    Pending
                                                </SelectItem>
                                                <SelectItem value="failed">
                                                    Failed
                                                </SelectItem>
                                                <SelectItem value="refunded">
                                                    Refunded
                                                </SelectItem>
                                                <SelectItem value="cancelled">
                                                    Cancelled
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="payment_method"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Payment Method
                                        </Label>
                                        <Select
                                            value={filterState.payment_method}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    "payment_method",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="All Methods" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    All Methods
                                                </SelectItem>
                                                {paymentMethods.map(
                                                    (method) => (
                                                        <SelectItem
                                                            key={method}
                                                            value={method}
                                                        >
                                                            {method
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )
                                                                .replace(
                                                                    /\b\w/g,
                                                                    (c) =>
                                                                        c.toUpperCase()
                                                                )}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="category"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Category
                                        </Label>
                                        <Select
                                            value={filterState.category}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    "category",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    All Categories
                                                </SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                    >
                                                        {category
                                                            .replace("_", " ")
                                                            .replace(
                                                                /\b\w/g,
                                                                (c) =>
                                                                    c.toUpperCase()
                                                            )}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="patient_id"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Patient
                                        </Label>
                                        <Select
                                            value={filterState.patient_id}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    "patient_id",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="h-10">
                                                <SelectValue placeholder="All Patients" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    All Patients
                                                </SelectItem>
                                                {patients.map((patient) => (
                                                    <SelectItem
                                                        key={patient.id}
                                                        value={patient.id.toString()}
                                                    >
                                                        {patient.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="date_from"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Date From
                                        </Label>
                                        <Input
                                            type="date"
                                            value={filterState.date_from}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "date_from",
                                                    e.target.value
                                                )
                                            }
                                            className="h-10"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="date_to"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Date To
                                        </Label>
                                        <Input
                                            type="date"
                                            value={filterState.date_to}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "date_to",
                                                    e.target.value
                                                )
                                            }
                                            className="h-10"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="amount_min"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Min Amount
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={filterState.amount_min}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "amount_min",
                                                    e.target.value
                                                )
                                            }
                                            className="h-10"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="amount_max"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Max Amount
                                        </Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={filterState.amount_max}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "amount_max",
                                                    e.target.value
                                                )
                                            }
                                            className="h-10"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <Label
                                            htmlFor="per_page"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Per Page:
                                        </Label>
                                        <Select
                                            value={filterState.per_page}
                                            onValueChange={(value) =>
                                                handleFilterChange(
                                                    "per_page",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-20 h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="10">
                                                    10
                                                </SelectItem>
                                                <SelectItem value="15">
                                                    15
                                                </SelectItem>
                                                <SelectItem value="25">
                                                    25
                                                </SelectItem>
                                                <SelectItem value="50">
                                                    50
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        onClick={clearFilters}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Clear All
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Combined Search, Filters & Table Section */}
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Payment Records
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Manage and track all payment
                                            transactions
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <form
                                        onSubmit={handleSearch}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="text"
                                                placeholder="Search payments by reference number, patient name, or notes..."
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
                                                className="h-11 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
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
                                                onClick={() => setSearch("")}
                                                className="h-11 px-6"
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* Bulk Actions */}
                            {showBulkActions && selectedPayments.length > 0 && (
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-blue-700">
                                                {selectedPayments.length}{" "}
                                                payment(s) selected
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleBulkStatusUpdate(
                                                        "completed"
                                                    )
                                                }
                                                className="text-green-600 border-green-300 hover:bg-green-50"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Mark Completed
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleBulkStatusUpdate(
                                                        "pending"
                                                    )
                                                }
                                                className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                            >
                                                <Clock className="h-4 w-4 mr-2" />
                                                Mark Pending
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleBulkStatusUpdate(
                                                        "failed"
                                                    )
                                                }
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                Mark Failed
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleBulkDelete}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Selected
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            {showBulkActions && (
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={selectAll}
                                                        onCheckedChange={
                                                            handleSelectAll
                                                        }
                                                        className="ml-2"
                                                    />
                                                </TableHead>
                                            )}
                                            <TableHead
                                                className="font-semibold text-gray-900 cursor-pointer"
                                                onClick={() =>
                                                    handleSort("payment_date")
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    Date
                                                    {getSortIcon(
                                                        "payment_date"
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="font-semibold text-gray-900 cursor-pointer"
                                                onClick={() =>
                                                    handleSort("patient_id")
                                                }
                                            >
                                                <div className="flex items-center gap-1">
                                                    Patient
                                                    {getSortIcon("patient_id")}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900">
                                                Treatment
                                            </TableHead>
                                            <TableHead
                                                className="font-semibold text-gray-900 text-right cursor-pointer"
                                                onClick={() =>
                                                    handleSort("amount")
                                                }
                                            >
                                                <div className="flex items-center justify-end gap-1">
                                                    Amount
                                                    {getSortIcon("amount")}
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900">
                                                Method
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900">
                                                Status
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-900 text-center">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {payments.data &&
                                        payments.data.length > 0 ? (
                                            payments.data.map((payment) => (
                                                <TableRow
                                                    key={payment.id}
                                                    className="hover:bg-gray-50/50"
                                                >
                                                    {showBulkActions && (
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedPayments.includes(
                                                                    payment.id
                                                                )}
                                                                onCheckedChange={() =>
                                                                    handleSelectPayment(
                                                                        payment.id
                                                                    )
                                                                }
                                                                className="ml-2"
                                                            />
                                                        </TableCell>
                                                    )}
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-400" />
                                                            <span className="font-medium text-gray-900">
                                                                {new Date(
                                                                    payment.payment_date
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {payment.reference_number && (
                                                            <div className="text-sm text-gray-500">
                                                                Ref:{" "}
                                                                {
                                                                    payment.reference_number
                                                                }
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-400" />
                                                            <div>
                                                                <span className="font-medium text-gray-900">
                                                                    {
                                                                        payment
                                                                            .patient
                                                                            ?.first_name
                                                                    }{" "}
                                                                    {
                                                                        payment
                                                                            .patient
                                                                            ?.last_name
                                                                    }
                                                                </span>
                                                                {payment.patient
                                                                    ?.phone_number && (
                                                                    <div className="text-sm text-gray-500">
                                                                        {
                                                                            payment
                                                                                .patient
                                                                                .phone_number
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-gray-900">
                                                            {payment.treatment
                                                                ?.name || "N/A"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <span className="font-bold text-green-600 text-lg">
                                                            {formatCurrency(
                                                                payment.amount
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {methodIcon(
                                                                payment.payment_method
                                                            )}
                                                            <span className="text-gray-900">
                                                                {payment.payment_method
                                                                    .replace(
                                                                        "_",
                                                                        " "
                                                                    )
                                                                    .replace(
                                                                        /\b\w/g,
                                                                        (c) =>
                                                                            c.toUpperCase()
                                                                    )}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {statusBadge(
                                                            payment.status
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2 justify-center">
                                                            <Link
                                                                href={route(
                                                                    "clinic.payments.show",
                                                                    [
                                                                        auth
                                                                            .clinic
                                                                            ?.id,
                                                                        payment.id,
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
                                                                    "clinic.payments.edit",
                                                                    [
                                                                        auth
                                                                            .clinic
                                                                            ?.id,
                                                                        payment.id,
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
                                                    colSpan={
                                                        showBulkActions ? 8 : 7
                                                    }
                                                    className="text-center py-12"
                                                >
                                                    <div className="flex flex-col items-center gap-3">
                                                        <DollarSign className="h-12 w-12 text-gray-300" />
                                                        <div>
                                                            <p className="text-lg font-medium text-gray-900">
                                                                No payments
                                                                found
                                                            </p>
                                                            <p className="text-gray-500">
                                                                Get started by
                                                                adding your
                                                                first payment
                                                            </p>
                                                        </div>
                                                        <Button
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "clinic.payments.create",
                                                                        {
                                                                            clinic: auth
                                                                                .clinic
                                                                                ?.id,
                                                                        }
                                                                    )
                                                                )
                                                            }
                                                            className="mt-2"
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Payment
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {payments.links && payments.links.length > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {payments.from} to{" "}
                                            {payments.to} of {payments.total}{" "}
                                            results
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {payments.links.map((link, i) => {
                                                if (!link.url) return null;

                                                const queryParams =
                                                    link.url.includes("?")
                                                        ? link.url.substring(
                                                              link.url.indexOf(
                                                                  "?"
                                                              )
                                                          )
                                                        : "";

                                                return (
                                                    <Link
                                                        key={i}
                                                        href={
                                                            route(
                                                                "clinic.payments.index",
                                                                [
                                                                    auth.clinic
                                                                        ?.id,
                                                                ]
                                                            ) + queryParams
                                                        }
                                                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                                            link.active
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                    >
                                                        {link.label
                                                            .replace(
                                                                "&laquo;",
                                                                "«"
                                                            )
                                                            .replace(
                                                                "&raquo;",
                                                                "»"
                                                            )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
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
