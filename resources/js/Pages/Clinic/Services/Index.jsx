import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Plus,
    Scissors,
    Search,
    Activity,
    CheckCircle,
    XCircle,
    DollarSign,
    Edit,
    Trash2,
    Clock,
    Tag,
    Users,
    Filter,
    Settings,
    Sparkles,
    TrendingUp,
    Package,
    Zap,
    FileText,
    Eye,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";

export default function Index({
    auth,
    clinic,
    services,
    dentists,
    categories,
    filters,
}) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [filterCategory, setFilterCategory] = useState(
        filters?.category || "all"
    );
    const [filterStatus, setFilterStatus] = useState(filters?.status || "all");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showShowDialog, setShowShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [viewingService, setViewingService] = useState(null);
    const [deletingService, setDeletingService] = useState(null);
    const [processing, setProcessing] = useState(false);

    // Helper function to get service color based on category
    const getServiceColor = (category) => {
        const colors = {
            general: "bg-blue-100 text-blue-700",
            cosmetic: "bg-purple-100 text-purple-700",
            orthodontics: "bg-indigo-100 text-indigo-700",
            surgery: "bg-red-100 text-red-700",
            pediatric: "bg-pink-100 text-pink-700",
            emergency: "bg-orange-100 text-orange-700",
            preventive: "bg-green-100 text-green-700",
            restorative: "bg-teal-100 text-teal-700",
            endodontics: "bg-cyan-100 text-cyan-700",
            periodontics: "bg-emerald-100 text-emerald-700",
            prosthodontics: "bg-gray-100 text-gray-700",
        };
        return colors[category] || "bg-gray-100 text-gray-700";
    };

    const {
        data,
        setData,
        post,
        put,
        processing: formProcessing,
        errors,
        reset,
    } = useForm({
        name: "",
        description: "",
        category: "",
        subcategory: "",
        code: "",
        price: "",
        cost_price: "",
        insurance_price: "",
        is_insurance_eligible: false,
        insurance_codes: [],
        duration_minutes: 30,
        procedure_details: "",
        preparation_instructions: "",
        post_procedure_care: "",
        requires_consultation: false,
        is_emergency_service: false,
        advance_booking_days: 30,
        max_daily_bookings: "",
        is_active: true,
        sort_order: 0,
        tags: [],
        notes: "",
        dentist_ids: [],
    });

    // Filter services based on search and filters
    const filteredServices =
        services?.filter((service) => {
            const matchesSearch =
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                service.code?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory =
                filterCategory === "all" || service.category === filterCategory;
            const matchesStatus =
                filterStatus === "all" ||
                (filterStatus === "active" && service.is_active) ||
                (filterStatus === "inactive" && !service.is_active);

            return matchesSearch && matchesCategory && matchesStatus;
        }) || [];

    const handleCreate = () => {
        setData({
            name: "",
            description: "",
            category: "",
            subcategory: "",
            code: "",
            price: "",
            cost_price: "",
            insurance_price: "",
            is_insurance_eligible: false,
            insurance_codes: [],
            duration_minutes: 30,
            procedure_details: "",
            preparation_instructions: "",
            post_procedure_care: "",
            requires_consultation: false,
            is_emergency_service: false,
            advance_booking_days: 30,
            max_daily_bookings: "",
            is_active: true,
            sort_order: 0,
            tags: [],
            notes: "",
            dentist_ids: [],
        });
        setShowCreateDialog(true);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setData({
            name: service.name,
            description: service.description || "",
            category: service.category,
            subcategory: service.subcategory || "",
            code: service.code || "",
            price: service.price || "",
            cost_price: service.cost_price || "",
            insurance_price: service.insurance_price || "",
            is_insurance_eligible: service.is_insurance_eligible || false,
            insurance_codes: service.insurance_codes || [],
            duration_minutes: service.duration_minutes || 30,
            procedure_details: service.procedure_details || "",
            preparation_instructions: service.preparation_instructions || "",
            post_procedure_care: service.post_procedure_care || "",
            requires_consultation: service.requires_consultation || false,
            is_emergency_service: service.is_emergency_service || false,
            advance_booking_days: service.advance_booking_days || 30,
            max_daily_bookings: service.max_daily_bookings || "",
            is_active: service.is_active,
            sort_order: service.sort_order || 0,
            tags: service.tags || [],
            notes: service.notes || "",
            dentist_ids: service.dentists?.map((d) => d.id) || [],
        });
        setShowEditDialog(true);
    };

    const handleShow = (service) => {
        setViewingService(service);
        setShowShowDialog(true);
    };

    const handleDelete = (service) => {
        setDeletingService(service);
        setShowDeleteDialog(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        setProcessing(true);
        post(route("clinic.services.store", clinic.id), {
            onSuccess: () => {
                setShowCreateDialog(false);
                setProcessing(false);
                reset();
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setProcessing(true);
        put(route("clinic.services.update", [clinic.id, editingService.id]), {
            onSuccess: () => {
                setShowEditDialog(false);
                setEditingService(null);
                setProcessing(false);
                reset();
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const confirmDelete = () => {
        setProcessing(true);
        // Using router.delete for delete operation
        window.location.href = route("clinic.services.destroy", [
            clinic.id,
            deletingService.id,
        ]);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${clinic.name} - Services`} />

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
                                    <Scissors className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Services Management
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Manage clinic services, procedures, and
                                        treatments
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={handleCreate}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-500/20 backdrop-blur-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add Service
                            </Button>
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
                                        <Scissors className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Total Services
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {services?.length || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-blue-600 font-medium">
                                                All services
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
                                            Active Services
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {services?.filter(
                                                (s) => s.is_active
                                            )?.length || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-600 font-medium">
                                                Available for booking
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
                                            Average Price
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            ₱
                                            {services?.length > 0
                                                ? Math.round(
                                                      services.reduce(
                                                          (sum, s) =>
                                                              sum +
                                                              (parseFloat(
                                                                  s.price
                                                              ) || 0),
                                                          0
                                                      ) / services.length
                                                  )
                                                : 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-purple-600 font-medium">
                                                Per service
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
                                        <Users className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-600 font-medium mb-1">
                                            Assigned Dentists
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 mb-2">
                                            {dentists?.length || 0}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-orange-600 font-medium">
                                                Available specialists
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Search and Filter Controls */}
                    <Card className="shadow-xl rounded-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        <input
                                            type="text"
                                            placeholder="Search services by name, description, or code..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={filterCategory}
                                        onChange={(e) =>
                                            setFilterCategory(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="all">
                                            All Categories
                                        </option>
                                        {categories &&
                                            Object.entries(categories).map(
                                                ([key, label]) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {label}
                                                    </option>
                                                )
                                            )}
                                    </select>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) =>
                                            setFilterStatus(e.target.value)
                                        }
                                        className="px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">
                                            Active Only
                                        </option>
                                        <option value="inactive">
                                            Inactive Only
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services Records Card */}
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                        <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50">
                            <div className="space-y-6">
                                {/* Title Section - Top Row */}
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <Scissors className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Services Records
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Manage and view all service
                                            information
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* Services Records Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/70">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Scissors className="h-4 w-4 text-blue-600" />
                                                    Service
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="h-4 w-4 text-blue-600" />
                                                    Category
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                    Duration
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-blue-600" />
                                                    Price
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-blue-600" />
                                                    Status
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-blue-600" />
                                                    Dentists
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Settings className="h-4 w-4 text-blue-600" />
                                                    Actions
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {filteredServices.map((service) => (
                                            <tr
                                                key={service.id}
                                                className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-indigo-50/40 hover:to-cyan-50/60 transition-all duration-300 border-b border-gray-100/50 hover:border-blue-200/50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                                            <Scissors className="h-5 w-5" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-gray-900 text-base leading-tight">
                                                                {service.name}
                                                            </div>
                                                            <div className="flex items-center gap-1 flex-wrap">
                                                                <span className="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded font-medium">
                                                                    ID:{" "}
                                                                    {service.id}
                                                                </span>
                                                                {service.code && (
                                                                    <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-medium">
                                                                        {
                                                                            service.code
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {service.description && (
                                                                <div className="text-xs text-gray-500 line-clamp-1">
                                                                    {
                                                                        service.description
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Tag className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {service.category || (
                                                                    <span className="text-gray-400 italic font-normal">
                                                                        No
                                                                        category
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {service.subcategory && (
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded font-medium">
                                                                    {
                                                                        service.subcategory
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs border border-blue-200">
                                                            {service.duration_minutes ||
                                                                30}{" "}
                                                            min
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs border border-emerald-200 font-bold">
                                                            ₱
                                                            {parseFloat(
                                                                service.price ||
                                                                    0
                                                            ).toLocaleString()}
                                                        </span>
                                                        {service.cost_price && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                Cost: ₱
                                                                {parseFloat(
                                                                    service.cost_price
                                                                ).toLocaleString()}
                                                            </div>
                                                        )}
                                                        {service.is_insurance_eligible && (
                                                            <div className="mt-1 text-xs text-blue-600">
                                                                Insurance
                                                                eligible
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="space-y-2">
                                                        <Badge
                                                            className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                                                                service.is_active
                                                                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300"
                                                                    : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300"
                                                            }`}
                                                        >
                                                            {service.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </Badge>
                                                        <div className="flex flex-wrap gap-1">
                                                            {service.requires_consultation && (
                                                                <span className="inline-flex px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded border border-yellow-200 font-medium">
                                                                    Consultation
                                                                </span>
                                                            )}
                                                            {service.is_emergency_service && (
                                                                <span className="inline-flex px-1.5 py-0.5 text-xs bg-red-100 text-red-700 rounded border border-red-200 font-medium">
                                                                    Emergency
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {service.dentists &&
                                                    service.dentists.length >
                                                        0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {service.dentists
                                                                .slice(0, 2)
                                                                .map(
                                                                    (
                                                                        dentist
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                dentist.id
                                                                            }
                                                                            className="inline-flex px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded border border-blue-200 font-medium"
                                                                        >
                                                                            {
                                                                                dentist.name
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            {service.dentists
                                                                .length > 2 && (
                                                                <span className="inline-flex px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded border border-gray-200 font-medium">
                                                                    +
                                                                    {service
                                                                        .dentists
                                                                        .length -
                                                                        2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">
                                                            No dentists assigned
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleShow(
                                                                    service
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 hover:scale-105"
                                                            title="View Service Details"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    service
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 hover:text-emerald-700 rounded-lg transition-all duration-200 hover:scale-105"
                                                            title="Edit Service"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setDeletingService(
                                                                    service
                                                                );
                                                                setShowDeleteDialog(
                                                                    true
                                                                );
                                                            }}
                                                            className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 hover:scale-105"
                                                            title="Delete Service"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Enhanced Empty State */}
                    {filteredServices.length === 0 && (
                        <Card className="shadow-2xl rounded-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
                            <CardContent className="p-16">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Scissors className="h-12 w-12 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        {searchTerm ||
                                        filterCategory !== "all" ||
                                        filterStatus !== "all"
                                            ? "No services found"
                                            : "No services yet"}
                                    </h3>
                                    <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                                        {searchTerm ||
                                        filterCategory !== "all" ||
                                        filterStatus !== "all"
                                            ? "Try adjusting your search or filter criteria to find what you're looking for."
                                            : "Get started by creating your first service to build your clinic's service catalog."}
                                    </p>
                                    <Button
                                        onClick={handleCreate}
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add Service
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Enhanced Create Service Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white">
                    <DialogHeader className="text-center pb-4">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Create New Service
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-sm">
                            Add a new service to your clinic's catalog
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitCreate} className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Package className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Basic Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="text-sm font-medium text-gray-700 mb-1 block"
                                    >
                                        Service Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="e.g., Teeth Cleaning"
                                        className={`w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
                                            errors.name
                                                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                                : "border-gray-300"
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <XCircle className="h-3 w-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="code">Service Code</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData("code", e.target.value)
                                        }
                                        placeholder="e.g., TC001"
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="category"
                                        className="text-sm font-semibold text-gray-700 mb-2 block"
                                    >
                                        Category *
                                    </Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) =>
                                            setData("category", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={`w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 ${
                                                errors.category
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                                                    : "border-gray-200"
                                            }`}
                                        >
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories &&
                                                Object.entries(categories).map(
                                                    ([key, label]) => (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    )
                                                )}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                            <XCircle className="h-4 w-4" />
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="subcategory">
                                        Subcategory
                                    </Label>
                                    <Input
                                        id="subcategory"
                                        value={data.subcategory}
                                        onChange={(e) =>
                                            setData(
                                                "subcategory",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Deep Cleaning"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label
                                        htmlFor="description"
                                        className="text-sm font-medium text-gray-700 mb-1 block"
                                    >
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Brief description of the service..."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Pricing & Duration
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label
                                        htmlFor="price"
                                        className="text-sm font-medium text-gray-700 mb-1 block"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>Price (₱)</span>
                                            <span className="text-xs text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                                                Selling price
                                            </span>
                                        </span>
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="cost_price"
                                        className="flex items-center gap-2"
                                    >
                                        <span>Cost Price (₱)</span>
                                        <span className="text-xs text-gray-500">
                                            (Internal cost)
                                        </span>
                                    </Label>
                                    <Input
                                        id="cost_price"
                                        type="number"
                                        step="0.01"
                                        value={data.cost_price}
                                        onChange={(e) =>
                                            setData(
                                                "cost_price",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="duration_minutes">
                                        Duration (minutes) *
                                    </Label>
                                    <Input
                                        id="duration_minutes"
                                        type="number"
                                        value={data.duration_minutes}
                                        onChange={(e) =>
                                            setData(
                                                "duration_minutes",
                                                e.target.value
                                            )
                                        }
                                        placeholder="30"
                                        min="15"
                                        max="480"
                                    />
                                    {errors.duration_minutes && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.duration_minutes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_insurance_eligible"
                                        checked={data.is_insurance_eligible}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "is_insurance_eligible",
                                                checked
                                            )
                                        }
                                    />
                                    <Label htmlFor="is_insurance_eligible">
                                        Insurance Eligible
                                    </Label>
                                </div>

                                {data.is_insurance_eligible && (
                                    <div className="md:col-span-2">
                                        <Label htmlFor="insurance_price">
                                            Insurance Price (₱)
                                        </Label>
                                        <Input
                                            id="insurance_price"
                                            type="number"
                                            step="0.01"
                                            value={data.insurance_price}
                                            onChange={(e) =>
                                                setData(
                                                    "insurance_price",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Insurance rate"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Service Details Section */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Service Details
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="procedure_details">
                                        Procedure Details
                                    </Label>
                                    <Textarea
                                        id="procedure_details"
                                        value={data.procedure_details}
                                        onChange={(e) =>
                                            setData(
                                                "procedure_details",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Detailed steps of the procedure..."
                                        rows={4}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="preparation_instructions">
                                        Preparation Instructions
                                    </Label>
                                    <Textarea
                                        id="preparation_instructions"
                                        value={data.preparation_instructions}
                                        onChange={(e) =>
                                            setData(
                                                "preparation_instructions",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Instructions for patient preparation..."
                                        rows={4}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <Label htmlFor="post_procedure_care">
                                        Post-Procedure Care
                                    </Label>
                                    <Textarea
                                        id="post_procedure_care"
                                        value={data.post_procedure_care}
                                        onChange={(e) =>
                                            setData(
                                                "post_procedure_care",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Care instructions after the procedure..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Booking Settings Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                Booking Settings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="advance_booking_days">
                                        Advance Booking Days
                                    </Label>
                                    <Input
                                        id="advance_booking_days"
                                        type="number"
                                        value={data.advance_booking_days}
                                        onChange={(e) =>
                                            setData(
                                                "advance_booking_days",
                                                e.target.value
                                            )
                                        }
                                        placeholder="30"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="max_daily_bookings">
                                        Max Daily Bookings
                                    </Label>
                                    <Input
                                        id="max_daily_bookings"
                                        type="number"
                                        value={data.max_daily_bookings}
                                        onChange={(e) =>
                                            setData(
                                                "max_daily_bookings",
                                                e.target.value
                                            )
                                        }
                                        placeholder="10"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Options */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                    <Settings className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Service Options
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="flex items-center space-x-2 p-3 bg-blue-100 rounded-lg border border-blue-200">
                                    <Switch
                                        id="requires_consultation"
                                        checked={data.requires_consultation}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "requires_consultation",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="requires_consultation"
                                        className="text-sm"
                                    >
                                        Requires Consultation
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 bg-red-100 rounded-lg border border-red-200">
                                    <Switch
                                        id="is_emergency_service"
                                        checked={data.is_emergency_service}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "is_emergency_service",
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_emergency_service"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Emergency Service
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-3 bg-green-100 rounded-lg border border-green-200">
                                    <Switch
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) =>
                                            setData("is_active", checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_active"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Active
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                Additional Notes
                            </h3>
                            <div>
                                <Label htmlFor="notes">Internal Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData("notes", e.target.value)
                                    }
                                    placeholder="Any internal notes or special instructions..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Dentist Assignment */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Dentist Assignment
                                </h3>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                                    Select dentists who can perform this service
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {dentists?.map((dentist) => (
                                        <div
                                            key={dentist.id}
                                            className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                data.dentist_ids.includes(
                                                    dentist.id
                                                )
                                                    ? "border-blue-500 bg-blue-100"
                                                    : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`dentist_${dentist.id}`}
                                                checked={data.dentist_ids.includes(
                                                    dentist.id
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData("dentist_ids", [
                                                            ...data.dentist_ids,
                                                            dentist.id,
                                                        ]);
                                                    } else {
                                                        setData(
                                                            "dentist_ids",
                                                            data.dentist_ids.filter(
                                                                (id) =>
                                                                    id !==
                                                                    dentist.id
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <Label
                                                htmlFor={`dentist_${dentist.id}`}
                                                className="text-sm font-medium cursor-pointer flex-1"
                                            >
                                                {dentist.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {dentists?.length === 0 && (
                                    <div className="text-center py-4 text-gray-500">
                                        No dentists available for assignment
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCreateDialog(false)}
                                className="px-6 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Create Service
                                    </div>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Service Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white">
                    <DialogHeader className="text-center pb-4">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Edit Service
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-sm">
                            Update service information and settings
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Basic Information
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Service Name *
                                    </Label>
                                    <Input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Enter service name"
                                        className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Service Code
                                    </Label>
                                    <Input
                                        type="text"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData("code", e.target.value)
                                        }
                                        placeholder="e.g., CLEAN-001"
                                        className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Description
                                    </Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Brief description of the service"
                                        rows={3}
                                        className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category and Classification */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <Tag className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Category & Classification
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Category *
                                    </Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) =>
                                            setData("category", value)
                                        }
                                    >
                                        <SelectTrigger className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories &&
                                                Object.entries(categories).map(
                                                    ([key, label]) => (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    )
                                                )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Subcategory
                                    </Label>
                                    <Input
                                        type="text"
                                        value={data.subcategory}
                                        onChange={(e) =>
                                            setData(
                                                "subcategory",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Deep Cleaning"
                                        className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Duration */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Pricing & Duration
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Price (₱)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData("price", e.target.value)
                                        }
                                        placeholder="0.00"
                                        className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Cost Price (₱)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.cost_price}
                                        onChange={(e) =>
                                            setData(
                                                "cost_price",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Duration (minutes) *
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.duration_minutes}
                                        onChange={(e) =>
                                            setData(
                                                "duration_minutes",
                                                e.target.value
                                            )
                                        }
                                        placeholder="30"
                                        min="15"
                                        max="480"
                                        className="px-3 py-2 border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Service Options */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                    <Settings className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Service Options
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg border border-blue-200">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Requires Consultation
                                        </Label>
                                        <p className="text-xs text-gray-600">
                                            Patient must have consultation first
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.requires_consultation}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "requires_consultation",
                                                checked
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg border border-red-200">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                            Emergency Service
                                        </Label>
                                        <p className="text-xs text-gray-600">
                                            Available for emergency cases
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.is_emergency_service}
                                        onCheckedChange={(checked) =>
                                            setData(
                                                "is_emergency_service",
                                                checked
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dentist Assignment */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Dentist Assignment
                                </h3>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                                    Select dentists who can perform this service
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {dentists?.map((dentist) => (
                                        <div
                                            key={dentist.id}
                                            className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                data.dentist_ids.includes(
                                                    dentist.id
                                                )
                                                    ? "border-blue-500 bg-blue-100"
                                                    : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={`edit_dentist_${dentist.id}`}
                                                checked={data.dentist_ids.includes(
                                                    dentist.id
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData("dentist_ids", [
                                                            ...data.dentist_ids,
                                                            dentist.id,
                                                        ]);
                                                    } else {
                                                        setData(
                                                            "dentist_ids",
                                                            data.dentist_ids.filter(
                                                                (id) =>
                                                                    id !==
                                                                    dentist.id
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <Label
                                                htmlFor={`edit_dentist_${dentist.id}`}
                                                className="text-sm font-medium cursor-pointer flex-1"
                                            >
                                                {dentist.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                {dentists?.length === 0 && (
                                    <div className="text-center py-4 text-gray-500">
                                        No dentists available for assignment
                                    </div>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowEditDialog(false)}
                                className="px-6 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Updating...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Edit className="h-4 w-4" />
                                        Update Service
                                    </div>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Show Service Dialog */}
            <Dialog open={showShowDialog} onOpenChange={setShowShowDialog}>
                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white">
                    <DialogHeader className="text-center pb-4">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Service Details
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 text-sm">
                            View complete service information
                        </DialogDescription>
                    </DialogHeader>

                    {viewingService && (
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Basic Information
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Service Name
                                        </Label>
                                        <p className="text-base font-semibold text-gray-900">
                                            {viewingService.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Service Code
                                        </Label>
                                        <p className="text-base font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                            {viewingService.code || "N/A"}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Description
                                        </Label>
                                        <p className="text-base text-gray-700">
                                            {viewingService.description ||
                                                "No description provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Category and Classification */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                        <Tag className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Category & Classification
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Category
                                        </Label>
                                        <Badge
                                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${getServiceColor(
                                                viewingService.category
                                            )}`}
                                        >
                                            {viewingService.category}
                                        </Badge>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Subcategory
                                        </Label>
                                        <p className="text-base text-gray-700">
                                            {viewingService.subcategory ||
                                                "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Duration */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Pricing & Duration
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Price
                                        </Label>
                                        <p className="text-lg font-bold text-gray-900">
                                            ₱{viewingService.price || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Cost Price
                                        </Label>
                                        <p className="text-base text-gray-700">
                                            ₱
                                            {viewingService.cost_price || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 mb-1 block">
                                            Duration
                                        </Label>
                                        <p className="text-base text-gray-700">
                                            {viewingService.duration_minutes ||
                                                30}{" "}
                                            minutes
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Service Options */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                        <Settings className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Service Options
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Requires Consultation
                                            </Label>
                                        </div>
                                        <Badge
                                            variant={
                                                viewingService.requires_consultation
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {viewingService.requires_consultation
                                                ? "Yes"
                                                : "No"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Emergency Service
                                            </Label>
                                        </div>
                                        <Badge
                                            variant={
                                                viewingService.is_emergency_service
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {viewingService.is_emergency_service
                                                ? "Yes"
                                                : "No"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Assigned Dentists */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Assigned Dentists
                                    </h3>
                                </div>
                                <div>
                                    {viewingService.dentists &&
                                    viewingService.dentists.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {viewingService.dentists.map(
                                                (dentist) => (
                                                    <div
                                                        key={dentist.id}
                                                        className="p-3 bg-blue-100 rounded-lg border border-blue-200"
                                                    >
                                                        <p className="text-sm font-medium text-blue-700">
                                                            {dentist.name}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            No dentists assigned to this service
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowShowDialog(false)}
                                    className="px-6 py-2 rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
