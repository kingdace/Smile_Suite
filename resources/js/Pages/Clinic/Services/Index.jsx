import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { Badge } from "@/Components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
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
import {
    Plus,
    Search,
    Edit,
    Trash2,
    DollarSign,
    Activity,
    Package,
    Info,
    AlertCircle,
    CheckCircle,
    XCircle,
    Filter,
    MoreHorizontal,
    Scissors,
    Building2,
    ArrowRight,
    Settings,
    Eye,
    Calendar,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function Index({ auth, clinic, services }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [processing, setProcessing] = useState(false);

    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterStatus === "all" ||
            (filterStatus === "active" && service.is_active) ||
            (filterStatus === "inactive" && !service.is_active);
        return matchesSearch && matchesFilter;
    });

    const activeServices = services.filter((service) => service.is_active);
    const inactiveServices = services.filter((service) => !service.is_active);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${clinic.name} - Services`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                {/* Modern Header Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-r from-white via-blue-50/50 to-cyan-50/50 rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
                                        <Scissors className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">
                                            Services Management
                                        </h1>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-sm text-gray-600">
                                                {clinic.name}
                                            </p>
                                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                            <p className="text-sm font-mono text-gray-600">
                                                {services.length} Services
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() =>
                                            setShowCreateDialog(true)
                                        }
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-md"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Service
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    {/* Statistics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b-2 border-blue-200 pb-4 bg-gradient-to-r from-blue-100 to-indigo-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                                        <Scissors className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-gray-900">
                                            Total Services
                                        </CardTitle>
                                        <p className="text-gray-600 text-sm mt-0.5">
                                            All services
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {services.length}
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-50">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b-2 border-emerald-200 pb-4 bg-gradient-to-r from-emerald-100 to-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-gray-900">
                                            Active Services
                                        </CardTitle>
                                        <p className="text-gray-600 text-sm mt-0.5">
                                            Available for booking
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {activeServices.length}
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-50">
                                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                            <CardHeader className="border-b-2 border-gray-200 pb-4 bg-gradient-to-r from-gray-100 to-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 shadow-sm">
                                        <XCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold text-gray-900">
                                            Inactive Services
                                        </CardTitle>
                                        <p className="text-gray-600 text-sm mt-0.5">
                                            Temporarily disabled
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-5">
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-bold text-gray-900">
                                        {inactiveServices.length}
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-50">
                                        <Settings className="h-5 w-5 text-gray-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter Controls */}
                    <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search services..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) =>
                                            setFilterStatus(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm"
                                    >
                                        <option value="all">
                                            All Services
                                        </option>
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

                    {/* Services Content - Placeholder for now */}
                    <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-12">
                            <div className="text-center">
                                <Scissors className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Services Management
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Beautiful new design coming soon! The
                                    services management system is being
                                    refactored to match the Smile Suite
                                    branding.
                                </p>
                                <Button
                                    onClick={() => setShowCreateDialog(true)}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Service
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
