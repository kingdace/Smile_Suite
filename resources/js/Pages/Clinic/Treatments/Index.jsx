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
import { format } from "date-fns";
import {
    Search,
    PlusCircle,
    Filter,
    Stethoscope,
    Calendar,
    DollarSign,
    Activity,
    Clock,
    User,
    FileText,
    Eye,
    Pencil,
    Trash2,
    Settings,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    XCircle,
    Timer,
    Download,
} from "lucide-react";
import { useState } from "react";

export default function Index({ auth, treatments, services, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedTreatments, setSelectedTreatments] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [filterState, setFilterState] = useState({
        service_id: filters.service_id || "all",
        status: filters.status || "all",
        payment_status: filters.payment_status || "all",
        sort_by: filters.sort_by || "created_at",
        sort_direction: filters.sort_direction || "desc",
    });

    // Clear selection when bulk actions are hidden
    const toggleBulkActions = () => {
        if (showBulkActions) {
            setSelectedTreatments([]);
            setSelectAll(false);
        }
        setShowBulkActions(!showBulkActions);
    };

    // Function to perform the search using router.reload
    const performSearch = (query) => {
        router.reload({
            data: { search: query },
            only: ["treatments", "filters"],
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

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filterState, [field]: value };
        setFilterState(newFilters);
        router.reload({
            data: newFilters,
            only: ["treatments", "filters"],
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
        const newFilters = {
            ...filterState,
            sort_by: column,
            sort_direction: direction,
        };
        setFilterState(newFilters);
        router.reload({
            data: newFilters,
            only: ["treatments", "filters"],
            preserveState: true,
            replace: true,
        });
    };

    const getSortIcon = (column) => {
        if (filterState.sort_by === column) {
            return filterState.sort_direction === "asc" ? " ↑" : " ↓";
        }
        return "";
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: "bg-green-100 text-green-800",
            in_progress: "bg-blue-100 text-blue-800",
            scheduled: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            completed: "bg-green-100 text-green-800",
            partial: "bg-yellow-100 text-yellow-800",
            pending: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const clearFilters = () => {
        setSearch("");
        setFilterState({
            service_id: "all",
            status: "all",
            payment_status: "all",
            sort_by: "created_at",
            sort_direction: "desc",
        });
        router.reload({
            data: {
                search: "",
                service_id: "all",
                status: "all",
                payment_status: "all",
                sort_by: "created_at",
                sort_direction: "desc",
            },
            only: ["treatments", "filters"],
            preserveState: true,
            replace: true,
        });
    };

    // Bulk actions handlers
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedTreatments([]);
            setSelectAll(false);
        } else {
            setSelectedTreatments(
                treatments.data.map((treatment) => treatment.id)
            );
            setSelectAll(true);
        }
    };

    const handleSelectTreatment = (treatmentId) => {
        if (selectedTreatments.includes(treatmentId)) {
            setSelectedTreatments(
                selectedTreatments.filter((id) => id !== treatmentId)
            );
            setSelectAll(false);
        } else {
            setSelectedTreatments([...selectedTreatments, treatmentId]);
            if (selectedTreatments.length + 1 === treatments.data.length) {
                setSelectAll(true);
            }
        }
    };

    const handleDeleteTreatment = (treatmentId, treatmentName) => {
        if (
            confirm(
                `Are you sure you want to delete treatment "${treatmentName}"? This action cannot be undone.`
            )
        ) {
            router.delete(
                route("clinic.treatments.destroy", {
                    clinic: auth.clinic_id,
                    treatment: treatmentId,
                }),
                {
                    onSuccess: () => {
                        // The page will reload automatically due to Inertia
                    },
                    onError: (errors) => {
                        console.error("Delete failed:", errors);
                        alert("Failed to delete treatment. Please try again.");
                    },
                }
            );
        }
    };

    const handleBulkDelete = () => {
        if (selectedTreatments.length === 0) {
            alert("Please select treatments to delete");
            return;
        }

        if (
            confirm(
                `Are you sure you want to delete ${selectedTreatments.length} treatment(s)? This action cannot be undone.`
            )
        ) {
            router.delete(
                route("clinic.treatments.bulk-destroy", {
                    clinic: auth.clinic_id,
                }),
                {
                    data: { treatment_ids: selectedTreatments },
                    onSuccess: () => {
                        setSelectedTreatments([]);
                        setSelectAll(false);
                        // The page will reload automatically due to Inertia
                    },
                    onError: (errors) => {
                        console.error("Bulk delete failed:", errors);
                        alert("Failed to delete treatments. Please try again.");
                    },
                }
            );
        }
    };

    const handleExportAllTreatments = () => {
        // Create export URL for all treatments
        const exportUrl = route("clinic.treatments.export", {
            clinic: auth.clinic_id,
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

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Treatment Management" />

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
                                    <Stethoscope className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Treatment Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Manage and track patient treatments
                                        {auth.user.role === "clinic_admin" &&
                                            showBulkActions && (
                                                <span className="ml-2 inline-flex items-center gap-1 bg-orange-500/20 text-orange-200 px-2 py-1 rounded-full text-xs font-medium">
                                                    <Trash2 className="h-3 w-3" />
                                                    Bulk Mode Active
                                                </span>
                                            )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleExportAllTreatments}
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <Download className="h-4 w-4" />
                                    Export All
                                </Button>
                                {auth.user.role === "clinic_admin" && (
                                    <Button
                                        variant="outline"
                                        onClick={toggleBulkActions}
                                        className={`gap-2 text-sm px-4 py-2 rounded-xl transition-all duration-300 border backdrop-blur-sm ${
                                            showBulkActions
                                                ? "bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100"
                                                : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                                        }`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {showBulkActions
                                            ? "Hide Bulk Actions"
                                            : "Show Bulk Actions"}
                                    </Button>
                                )}
                                <Button
                                    onClick={() =>
                                        router.visit(
                                            `/clinic/${auth.clinic_id}/treatments/create`
                                        )
                                    }
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    Add Treatment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt-0 pb-12">
                    {/* Enhanced Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Stethoscope className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Total Treatments
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {treatments.total || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-blue-600 font-medium">
                                                All time records
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
                                        <CheckCircle className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Completed
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {treatments.data?.filter(
                                                (t) => t.status === "completed"
                                            ).length || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                Successfully treated
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
                                        <Timer className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            In Progress
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {treatments.data?.filter(
                                                (t) =>
                                                    t.status === "in_progress"
                                            ).length || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-yellow-600 font-medium">
                                                Currently active
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
                                        <DollarSign className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Revenue
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            ₱
                                            {treatments.data
                                                ?.reduce(
                                                    (sum, t) =>
                                                        sum +
                                                        (parseFloat(t.cost) ||
                                                            0),
                                                    0
                                                )
                                                .toLocaleString() || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-purple-600 font-medium">
                                                Total earnings
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Treatment Records Card */}
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
                                            Treatment Records
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Manage and view all treatment
                                            information
                                        </p>
                                    </div>
                                </div>

                                {/* Search and Filters - Second Row */}
                                <div className="flex items-center gap-4 justify-center">
                                    <form
                                        onSubmit={handleFormSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    placeholder="Search treatments..."
                                                    value={search}
                                                    onChange={handleInputChange}
                                                    className="pl-10 pr-4 h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                />
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            </div>

                                            <Select
                                                value={filterState.service_id}
                                                onValueChange={(value) =>
                                                    handleFilterChange(
                                                        "service_id",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="All Services" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All Services
                                                    </SelectItem>
                                                    {services.map((service) => (
                                                        <SelectItem
                                                            key={service.id}
                                                            value={service.id.toString()}
                                                        >
                                                            {service.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={filterState.status}
                                                onValueChange={(value) =>
                                                    handleFilterChange(
                                                        "status",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="All Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All Status
                                                    </SelectItem>
                                                    <SelectItem value="scheduled">
                                                        Scheduled
                                                    </SelectItem>
                                                    <SelectItem value="in_progress">
                                                        In Progress
                                                    </SelectItem>
                                                    <SelectItem value="completed">
                                                        Completed
                                                    </SelectItem>
                                                    <SelectItem value="cancelled">
                                                        Cancelled
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select
                                                value={
                                                    filterState.payment_status
                                                }
                                                onValueChange={(value) =>
                                                    handleFilterChange(
                                                        "payment_status",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-12 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="All Payment Statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All Payment Statuses
                                                    </SelectItem>
                                                    <SelectItem value="pending">
                                                        Pending
                                                    </SelectItem>
                                                    <SelectItem value="partial">
                                                        Partial
                                                    </SelectItem>
                                                    <SelectItem value="completed">
                                                        Completed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                onClick={clearFilters}
                                                variant="outline"
                                                className="h-12 gap-2 text-sm px-4 rounded-xl border-gray-300 hover:bg-gray-50"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                Clear All
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* Bulk Actions Bar */}
                            {showBulkActions &&
                                selectedTreatments.length > 0 && (
                                    <div className="bg-orange-50 border-b border-orange-200 px-6 py-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-100 rounded-lg">
                                                    <Trash2 className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <span className="text-sm font-medium text-orange-800">
                                                    {selectedTreatments.length}{" "}
                                                    treatment(s) selected
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={handleBulkDelete}
                                                    variant="destructive"
                                                    size="sm"
                                                    className="gap-2 text-xs px-3 py-1"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete Selected
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            {/* Treatment Records Table */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/70">
                                            {showBulkActions && (
                                                <TableHead className="w-12">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectAll}
                                                        onChange={
                                                            handleSelectAll
                                                        }
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </TableHead>
                                            )}
                                            <TableHead
                                                className="cursor-pointer hover:bg-blue-100/50 transition-colors text-gray-700 font-semibold"
                                                onClick={() =>
                                                    handleSort("patient_id")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-blue-600" />
                                                    Patient
                                                    {getSortIcon("patient_id")}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-green-100/50 transition-colors text-gray-700 font-semibold"
                                                onClick={() =>
                                                    handleSort("service_id")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4 text-blue-600" />
                                                    Service
                                                    {getSortIcon("service_id")}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-purple-100/50 transition-colors text-gray-700 font-semibold"
                                                onClick={() =>
                                                    handleSort("status")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-blue-600" />
                                                    Status
                                                    {getSortIcon("status")}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-orange-100/50 transition-colors text-gray-700 font-semibold"
                                                onClick={() =>
                                                    handleSort("payment_status")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-blue-600" />
                                                    Payment
                                                    {getSortIcon(
                                                        "payment_status"
                                                    )}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-emerald-100/50 transition-colors text-gray-700 font-semibold"
                                                onClick={() =>
                                                    handleSort("cost")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-blue-600" />
                                                    Cost
                                                    {getSortIcon("cost")}
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-cyan-100/50 transition-colors text-gray-700 font-semibold"
                                                onClick={() =>
                                                    handleSort("start_date")
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                    Date
                                                    {getSortIcon("start_date")}
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-right text-gray-700 font-semibold">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Settings className="h-4 w-4 text-blue-600" />
                                                    Actions
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {treatments.data.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={
                                                        showBulkActions ? 8 : 7
                                                    }
                                                    className="text-center py-12"
                                                >
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="p-4 bg-gray-100 rounded-full">
                                                            <Stethoscope className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                                                No treatments
                                                                found
                                                            </h3>
                                                            <p className="text-gray-500">
                                                                {search ||
                                                                Object.values(
                                                                    filterState
                                                                ).some(
                                                                    (f) =>
                                                                        f !==
                                                                        "all"
                                                                )
                                                                    ? "Try adjusting your search or filters"
                                                                    : "Get started by creating your first treatment"}
                                                            </p>
                                                        </div>
                                                        {!search &&
                                                            Object.values(
                                                                filterState
                                                            ).every(
                                                                (f) =>
                                                                    f === "all"
                                                            ) && (
                                                                <Button
                                                                    onClick={() =>
                                                                        router.visit(
                                                                            `/clinic/${auth.clinic_id}/treatments/create`
                                                                        )
                                                                    }
                                                                    className="gap-2 mt-2"
                                                                >
                                                                    <PlusCircle className="h-4 w-4" />
                                                                    Create
                                                                    Treatment
                                                                </Button>
                                                            )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            treatments.data.map((treatment) => (
                                                <TableRow
                                                    key={treatment.id}
                                                    className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-indigo-50/40 hover:to-cyan-50/60 transition-all duration-300 border-b border-gray-100/50 hover:border-blue-200/50"
                                                >
                                                    {showBulkActions && (
                                                        <TableCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedTreatments.includes(
                                                                    treatment.id
                                                                )}
                                                                onChange={() =>
                                                                    handleSelectTreatment(
                                                                        treatment.id
                                                                    )
                                                                }
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </TableCell>
                                                    )}
                                                    <TableCell
                                                        className={`py-4 ${
                                                            showBulkActions
                                                                ? "px-2"
                                                                : "px-4"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                                                {treatment
                                                                    .patient
                                                                    ?.full_name
                                                                    ? treatment.patient.full_name
                                                                          .split(
                                                                              " "
                                                                          )
                                                                          .slice(
                                                                              0,
                                                                              3
                                                                          )
                                                                          .map(
                                                                              (
                                                                                  word
                                                                              ) =>
                                                                                  word.charAt(
                                                                                      0
                                                                                  )
                                                                          )
                                                                          .join(
                                                                              ""
                                                                          )
                                                                          .toUpperCase()
                                                                    : "T"}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="font-bold text-gray-900 text-base leading-tight">
                                                                    {treatment
                                                                        .patient
                                                                        ?.full_name ||
                                                                        "Unnamed Patient"}
                                                                </div>
                                                                <div className="flex items-center gap-1 flex-wrap">
                                                                    <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                                                                        ID:{" "}
                                                                        {
                                                                            treatment.id
                                                                        }
                                                                    </span>
                                                                    {treatment
                                                                        .patient
                                                                        ?.email && (
                                                                        <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                                                                            {
                                                                                treatment
                                                                                    .patient
                                                                                    .email
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <Stethoscope className="h-3 w-3 text-gray-400" />
                                                                <span className="text-sm font-medium text-gray-900 truncate">
                                                                    {treatment
                                                                        .service
                                                                        ?.name || (
                                                                        <span className="text-gray-400 italic font-normal">
                                                                            No
                                                                            service
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <FileText className="h-3 w-3 text-gray-400" />
                                                                <span className="text-sm font-medium text-gray-900 line-clamp-2">
                                                                    {treatment.diagnosis || (
                                                                        <span className="text-gray-400 italic font-normal">
                                                                            No
                                                                            diagnosis
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4">
                                                        <Badge
                                                            variant={
                                                                treatment.status ===
                                                                "completed"
                                                                    ? "default"
                                                                    : treatment.status ===
                                                                      "in_progress"
                                                                    ? "secondary"
                                                                    : "outline"
                                                            }
                                                            className={`text-xs font-semibold px-1.5 py-0.5 ${
                                                                treatment.status ===
                                                                "completed"
                                                                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
                                                                    : treatment.status ===
                                                                      "in_progress"
                                                                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-300"
                                                                    : treatment.status ===
                                                                      "scheduled"
                                                                    ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-300"
                                                                    : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300"
                                                            }`}
                                                        >
                                                            {treatment.status ===
                                                            "completed"
                                                                ? "Completed"
                                                                : treatment.status ===
                                                                  "in_progress"
                                                                ? "In Progress"
                                                                : treatment.status ===
                                                                  "scheduled"
                                                                ? "Scheduled"
                                                                : "Cancelled"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4">
                                                        <Badge
                                                            className={`text-xs font-semibold px-1.5 py-0.5 ${
                                                                treatment.payment_status ===
                                                                "completed"
                                                                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
                                                                    : treatment.payment_status ===
                                                                      "partial"
                                                                    ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-300"
                                                                    : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300"
                                                            }`}
                                                        >
                                                            {treatment.payment_status ===
                                                            "completed"
                                                                ? "Paid"
                                                                : treatment.payment_status ===
                                                                  "partial"
                                                                ? "Partial"
                                                                : "Pending"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs border border-emerald-200 font-bold">
                                                                ₱
                                                                {parseFloat(
                                                                    treatment.cost ||
                                                                        0
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {treatment.start_date ? (
                                                                <span className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded text-xs border border-cyan-200">
                                                                    {format(
                                                                        new Date(
                                                                            treatment.start_date
                                                                        ),
                                                                        "MMM dd, yyyy"
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 italic font-normal bg-gray-50 px-1.5 py-0.5 rounded text-xs border border-gray-200">
                                                                    No date
                                                                </span>
                                                            )}
                                                            {treatment.estimated_duration_minutes && (
                                                                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                                    <Clock className="h-3 w-3" />
                                                                    <span>
                                                                        {
                                                                            treatment.estimated_duration_minutes
                                                                        }{" "}
                                                                        min
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        `/clinic/${auth.clinic_id}/treatments/${treatment.id}`
                                                                    )
                                                                }
                                                                className="h-8 w-8 p-0 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                                                                title="View Treatment Details"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    router.visit(
                                                                        `/clinic/${auth.clinic_id}/treatments/${treatment.id}/edit`
                                                                    )
                                                                }
                                                                className="h-8 w-8 p-0 bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200"
                                                                title="Edit Treatment"
                                                            >
                                                                <Pencil className="h-3 w-3" />
                                                            </Button>
                                                            {auth.user.role ===
                                                                "clinic_admin" && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleDeleteTreatment(
                                                                            treatment.id,
                                                                            treatment
                                                                                .patient
                                                                                ?.full_name ||
                                                                                "Treatment"
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 p-0 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                                                    title="Delete Treatment"
                                                                >
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Enhanced Pagination */}
                            {treatments.data.length > 0 && treatments.links && (
                                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                                    <Pagination links={treatments.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
