import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

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
    Plus,
    Search,
    Pencil,
    Eye,
    Users,
    UserPlus,
    Calendar,
    Activity,
    Filter,
    MoreVertical,
    FileText,
    Trash2,
    Phone,
    Mail,
    UserCheck,
    Settings,
    Clock,
    Download,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

export default function Index({ auth, patients, filters, statistics }) {
    const [search, setSearch] = useState(filters.search || "");
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showBulkActions, setShowBulkActions] = useState(false);

    // Clear selection when bulk actions are hidden
    const toggleBulkActions = () => {
        if (showBulkActions) {
            setSelectedPatients([]);
            setSelectAll(false);
        }
        setShowBulkActions(!showBulkActions);
    };

    const getCategoryDisplayName = (category) => {
        const categoryMap = {
            regular: "Regular Patient",
            vip: "VIP Patient",
            emergency: "Emergency Patient",
            pediatric: "Pediatric Patient",
            senior: "Senior Patient",
            new: "New Patient",
            returning: "Returning Patient",
            none: "No Category",
        };
        return categoryMap[category] || category.replace("_", " ");
    };

    // Function to perform the search using router.reload
    const performSearch = (query) => {
        router.reload({
            data: { search: query },
            only: ["patients", "filters", "statistics"],
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

    // Bulk actions handlers
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedPatients([]);
            setSelectAll(false);
        } else {
            setSelectedPatients(patients.data.map((patient) => patient.id));
            setSelectAll(true);
        }
    };

    const handleSelectPatient = (patientId) => {
        if (selectedPatients.includes(patientId)) {
            setSelectedPatients(
                selectedPatients.filter((id) => id !== patientId)
            );
            setSelectAll(false);
        } else {
            setSelectedPatients([...selectedPatients, patientId]);
            if (selectedPatients.length + 1 === patients.data.length) {
                setSelectAll(true);
            }
        }
    };

    const handleDeletePatient = (patientId, patientName) => {
        if (
            confirm(
                `Are you sure you want to delete patient "${patientName}"? This action cannot be undone.`
            )
        ) {
            router.delete(
                route("clinic.patients.destroy", {
                    clinic: auth.clinic_id,
                    patient: patientId,
                }),
                {
                    onSuccess: () => {
                        // The page will reload automatically due to Inertia
                    },
                    onError: (errors) => {
                        console.error("Delete failed:", errors);
                        alert("Failed to delete patient. Please try again.");
                    },
                }
            );
        }
    };

    const handleBulkDelete = () => {
        if (selectedPatients.length === 0) {
            alert("Please select patients to delete");
            return;
        }

        if (
            confirm(
                `Are you sure you want to delete ${selectedPatients.length} patient(s)? This action cannot be undone.`
            )
        ) {
            router.delete(
                route("clinic.patients.bulk-destroy", {
                    clinic: auth.clinic_id,
                }),
                {
                    data: { patient_ids: selectedPatients },
                    onSuccess: () => {
                        setSelectedPatients([]);
                        setSelectAll(false);
                        // The page will reload automatically due to Inertia
                    },
                    onError: (errors) => {
                        console.error("Bulk delete failed:", errors);
                        alert("Failed to delete patients. Please try again.");
                    },
                }
            );
        }
    };

    const handleExportPatients = () => {
        if (selectedPatients.length === 0) {
            alert("Please select patients to export");
            return;
        }

        // Create export URL with selected patient IDs as comma-separated string
        const exportUrl = route("clinic.patients.export", {
            clinic: auth.clinic_id,
            patient_ids: selectedPatients.join(","),
            format: "excel",
        });

        // Open the export URL in a new window to trigger download
        window.open(exportUrl, "_blank");
    };

    const handleExportAllPatients = () => {
        // Create export URL for all patients
        const exportUrl = route("clinic.patients.export", {
            clinic: auth.clinic_id,
            format: "excel",
        });

        // Open the export URL in a new window to trigger download
        window.open(exportUrl, "_blank");
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Patient Management" />

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
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Patient Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Manage and organize your patient records
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
                                    onClick={handleExportAllPatients}
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
                                            `/clinic/${auth.clinic_id}/patients/create`
                                        )
                                    }
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Add Patient
                                </Button>
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
                                        <Users className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Total Patients
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {statistics.total_patients}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
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
                                        <UserPlus className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            New This Month
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {statistics.new_this_month}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-emerald-600 font-medium">
                                                This month
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
                                        <Calendar className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Recent Visits
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {statistics.recent_visits}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-violet-600 font-medium">
                                                Last 3 months
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-orange-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Activity className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Active Patients
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {statistics.active_patients}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-amber-600 font-medium">
                                                Within 1 year
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Additional Statistics Row - Hidden */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <UserPlus className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            New Patients
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {statistics.new_patients || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-blue-600 font-medium">
                                                No previous visits
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gradient-to-br from-gray-500 via-gray-600 to-slate-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                        <Clock className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Inactive Patients
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {statistics.inactive_patients || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-gray-600 font-medium">
                                                Over 1 year
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div> */}

                    {/* Patient Records Card */}
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
                                            Patient Records
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Manage and view all patient
                                            information
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
                                            placeholder="Search patients..."
                                            value={search}
                                            onChange={handleInputChange}
                                            className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full"
                                        />
                                    </div>

                                    {/* Filter Dropdowns */}
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={filters.gender || "all"}
                                            onValueChange={(value) =>
                                                router.reload({
                                                    data: {
                                                        ...filters,
                                                        gender:
                                                            value === "all"
                                                                ? ""
                                                                : value,
                                                    },
                                                    only: [
                                                        "patients",
                                                        "filters",
                                                        "statistics",
                                                    ],
                                                    preserveState: true,
                                                    replace: true,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-28 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                                <SelectValue placeholder="Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Gender
                                                </SelectItem>
                                                <SelectItem value="male">
                                                    Male
                                                </SelectItem>
                                                <SelectItem value="female">
                                                    Female
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={filters.status || "all"}
                                            onValueChange={(value) =>
                                                router.reload({
                                                    data: {
                                                        ...filters,
                                                        status:
                                                            value === "all"
                                                                ? ""
                                                                : value,
                                                    },
                                                    only: [
                                                        "patients",
                                                        "filters",
                                                        "statistics",
                                                    ],
                                                    preserveState: true,
                                                    replace: true,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-32 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Status
                                                </SelectItem>
                                                <SelectItem value="new">
                                                    New
                                                </SelectItem>
                                                <SelectItem value="active">
                                                    Active
                                                </SelectItem>
                                                <SelectItem value="inactive">
                                                    Inactive
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={
                                                filters.blood_type === ""
                                                    ? "unknown"
                                                    : filters.blood_type ||
                                                      "all"
                                            }
                                            onValueChange={(value) =>
                                                router.reload({
                                                    data: {
                                                        ...filters,
                                                        blood_type:
                                                            value === "all"
                                                                ? ""
                                                                : value ===
                                                                  "unknown"
                                                                ? ""
                                                                : value,
                                                    },
                                                    only: [
                                                        "patients",
                                                        "filters",
                                                        "statistics",
                                                    ],
                                                    preserveState: true,
                                                    replace: true,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-28 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                                <SelectValue placeholder="Blood" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Blood
                                                </SelectItem>
                                                <SelectItem value="A+">
                                                    A+
                                                </SelectItem>
                                                <SelectItem value="A-">
                                                    A-
                                                </SelectItem>
                                                <SelectItem value="B+">
                                                    B+
                                                </SelectItem>
                                                <SelectItem value="B-">
                                                    B-
                                                </SelectItem>
                                                <SelectItem value="AB+">
                                                    AB+
                                                </SelectItem>
                                                <SelectItem value="AB-">
                                                    AB-
                                                </SelectItem>
                                                <SelectItem value="O+">
                                                    O+
                                                </SelectItem>
                                                <SelectItem value="O-">
                                                    O-
                                                </SelectItem>
                                                <SelectItem value="unknown">
                                                    Unknown
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={
                                                filters.marital_status || "all"
                                            }
                                            onValueChange={(value) =>
                                                router.reload({
                                                    data: {
                                                        ...filters,
                                                        marital_status:
                                                            value === "all"
                                                                ? ""
                                                                : value,
                                                    },
                                                    only: [
                                                        "patients",
                                                        "filters",
                                                        "statistics",
                                                    ],
                                                    preserveState: true,
                                                    replace: true,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-32 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                                <SelectValue placeholder="Marital" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Marital
                                                </SelectItem>
                                                <SelectItem value="single">
                                                    Single
                                                </SelectItem>
                                                <SelectItem value="married">
                                                    Married
                                                </SelectItem>
                                                <SelectItem value="divorced">
                                                    Divorced
                                                </SelectItem>
                                                <SelectItem value="widowed">
                                                    Widowed
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={filters.category || "all"}
                                            onValueChange={(value) =>
                                                router.reload({
                                                    data: {
                                                        ...filters,
                                                        category:
                                                            value === "all"
                                                                ? ""
                                                                : value,
                                                    },
                                                    only: [
                                                        "patients",
                                                        "filters",
                                                        "statistics",
                                                    ],
                                                    preserveState: true,
                                                    replace: true,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-36 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                                <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Category
                                                </SelectItem>
                                                <SelectItem value="regular">
                                                    Regular Patient
                                                </SelectItem>
                                                <SelectItem value="vip">
                                                    VIP Patient
                                                </SelectItem>
                                                <SelectItem value="emergency">
                                                    Emergency Patient
                                                </SelectItem>
                                                <SelectItem value="pediatric">
                                                    Pediatric Patient
                                                </SelectItem>
                                                <SelectItem value="senior">
                                                    Senior Patient
                                                </SelectItem>
                                                <SelectItem value="new">
                                                    New Patient
                                                </SelectItem>
                                                <SelectItem value="returning">
                                                    Returning Patient
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-11 px-3 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-sm"
                                            onClick={() =>
                                                router.reload({
                                                    data: {},
                                                    only: [
                                                        "patients",
                                                        "filters",
                                                        "statistics",
                                                    ],
                                                    preserveState: true,
                                                    replace: true,
                                                })
                                            }
                                        >
                                            <Filter className="h-4 w-4 mr-1" />
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* Bulk Actions */}
                            {auth.user.role === "clinic_admin" &&
                                showBulkActions &&
                                selectedPatients.length > 0 && (
                                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-medium text-blue-700">
                                                    {selectedPatients.length}{" "}
                                                    patient(s) selected
                                                </span>
                                                {auth.user.role ===
                                                    "clinic_admin" && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={
                                                            handleBulkDelete
                                                        }
                                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete Selected
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={
                                                        handleExportPatients
                                                    }
                                                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Export Selected
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setSelectedPatients([])
                                                }
                                                className="text-gray-600 hover:text-gray-800"
                                            >
                                                Clear Selection
                                            </Button>
                                        </div>
                                    </div>
                                )}

                            {/* Patient Records Table */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/70">
                                            {auth.user.role ===
                                                "clinic_admin" &&
                                                showBulkActions && (
                                                    <TableHead className="w-12 px-4">
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
                                                className={`font-semibold text-gray-700 w-80 ${
                                                    auth.user.role ===
                                                        "clinic_admin" &&
                                                    showBulkActions
                                                        ? "px-2"
                                                        : "px-6"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-blue-600" />
                                                    Patient Name
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 w-80 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-blue-600" />
                                                    Contact Info
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 w-64 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                    Last Visit
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 w-72 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-blue-600" />
                                                    Status & Category
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold text-gray-700 w-48 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Settings className="h-4 w-4 text-blue-600" />
                                                    Actions
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {patients.data.map((patient) => (
                                            <TableRow
                                                key={patient.id}
                                                className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-indigo-50/40 hover:to-cyan-50/60 transition-all duration-300 border-b border-gray-100/50 hover:border-blue-200/50"
                                            >
                                                {auth.user.role ===
                                                    "clinic_admin" &&
                                                    showBulkActions && (
                                                        <TableCell className="w-12 px-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedPatients.includes(
                                                                    patient.id
                                                                )}
                                                                onChange={() =>
                                                                    handleSelectPatient(
                                                                        patient.id
                                                                    )
                                                                }
                                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </TableCell>
                                                    )}
                                                <TableCell
                                                    className={`py-4 ${
                                                        auth.user.role ===
                                                            "clinic_admin" &&
                                                        showBulkActions
                                                            ? "px-2"
                                                            : "px-4"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                                            {patient.name
                                                                ? patient.name
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
                                                                      .join("")
                                                                      .toUpperCase()
                                                                : "P"}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-gray-900 text-base leading-tight">
                                                                {patient.name ||
                                                                    "Unnamed Patient"}
                                                            </div>
                                                            <div className="flex items-center gap-1 flex-wrap">
                                                                <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                                                                    ID:{" "}
                                                                    {patient.id}
                                                                </span>
                                                                {patient.gender && (
                                                                    <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium capitalize">
                                                                        {
                                                                            patient.gender
                                                                        }
                                                                    </span>
                                                                )}
                                                                {patient.age && (
                                                                    <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                                                                        {
                                                                            patient.age
                                                                        }{" "}
                                                                        years
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-900 truncate">
                                                                {patient.email || (
                                                                    <span className="text-gray-400 italic font-normal">
                                                                        No email
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {patient.phone || (
                                                                    <span className="text-gray-400 italic font-normal">
                                                                        No phone
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-4 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {patient.last_visit ? (
                                                            <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs border border-blue-200">
                                                                {
                                                                    patient.last_visit
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 italic font-normal bg-gray-50 px-1.5 py-0.5 rounded text-xs border border-gray-200">
                                                                Never visited
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <div className="space-y-2">
                                                        <Badge
                                                            variant={
                                                                patient.status ===
                                                                "active"
                                                                    ? "default"
                                                                    : patient.status ===
                                                                      "new"
                                                                    ? "secondary"
                                                                    : "outline"
                                                            }
                                                            className={`text-xs font-semibold px-1.5 py-0.5 ${
                                                                patient.status ===
                                                                "active"
                                                                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
                                                                    : patient.status ===
                                                                      "new"
                                                                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-300"
                                                                    : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300"
                                                            }`}
                                                        >
                                                            {patient.status ===
                                                            "active"
                                                                ? "Active"
                                                                : patient.status ===
                                                                  "new"
                                                                ? "New"
                                                                : "Inactive"}
                                                        </Badge>
                                                        {patient.category &&
                                                            patient.category !==
                                                                "none" && (
                                                                <div className="text-xs bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 px-1.5 py-0.5 rounded-full capitalize font-semibold border border-purple-200">
                                                                    {patient.category_display_name ||
                                                                        getCategoryDisplayName(
                                                                            patient.category
                                                                        )}
                                                                </div>
                                                            )}
                                                        {patient.blood_type && (
                                                            <div className="text-xs bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-1.5 py-0.5 rounded-full font-semibold border border-red-200">
                                                                {
                                                                    patient.blood_type
                                                                }
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
                                                                    `/clinic/${auth.clinic_id}/patients/${patient.id}`
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                                                            title="View Patient Details"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.visit(
                                                                    `/clinic/${auth.clinic_id}/patients/${patient.id}/edit`
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200"
                                                            title="Edit Patient"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        {auth.user.role ===
                                                            "clinic_admin" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDeletePatient(
                                                                        patient.id,
                                                                        patient.name
                                                                    )
                                                                }
                                                                className="h-8 w-8 p-0 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                                                                title="Delete Patient"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200"
                                                            title="More Options"
                                                        >
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Enhanced Pagination */}
                            {patients.links && (
                                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 via-blue-50/20 to-indigo-50/10 border-t border-gray-200/70">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="text-sm text-gray-600">
                                                Showing{" "}
                                                <span className="font-semibold text-gray-900">
                                                    {patients.from || 0}
                                                </span>{" "}
                                                to{" "}
                                                <span className="font-semibold text-gray-900">
                                                    {patients.to || 0}
                                                </span>{" "}
                                                of{" "}
                                                <span className="font-semibold text-gray-900">
                                                    {patients.total || 0}
                                                </span>{" "}
                                                patients
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Page{" "}
                                                {patients.current_page || 1} of{" "}
                                                {patients.last_page || 1}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {patients.links.map((link, index) =>
                                                link.url ? (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            router.visit(
                                                                link.url
                                                            )
                                                        }
                                                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                            link.active
                                                                ? "bg-blue-600 text-white"
                                                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-2 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
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
