import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
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
} from "lucide-react";
import { useState } from "react";

const ServiceForm = ({ service, onSubmit, onClose, processing }) => {
    const [form, setForm] = useState({
        name: service?.name || "",
        description: service?.description || "",
        price: service?.price || "",
        is_active: service?.is_active ?? true,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSwitchChange = (checked) => {
        setForm((f) => ({
            ...f,
            is_active: checked,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        onSubmit(form, setErrors);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                    Service Name <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter service name"
                    required
                    className="w-full"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                    Description
                </Label>
                <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe the service..."
                    className="w-full min-h-[100px]"
                />
                {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                    Price (₱)
                </Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="pl-10 w-full"
                    />
                </div>
                {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="is_active" className="text-sm font-medium">
                    Active Service
                </Label>
            </div>

            <DialogFooter className="gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {service ? "Updating..." : "Creating..."}
                        </>
                    ) : (
                        <>
                            <Package className="mr-2 h-4 w-4" />
                            {service ? "Update Service" : "Create Service"}
                        </>
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
};

const ServiceCard = ({ service, onEdit, onDelete, processing }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {service.name}
                            </CardTitle>
                            <CardDescription className="mt-1 text-gray-600">
                                {service.description ||
                                    "No description provided"}
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            {service.is_active ? (
                                <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800"
                                >
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                    Active
                                </Badge>
                            ) : (
                                <Badge
                                    variant="secondary"
                                    className="bg-gray-100 text-gray-600"
                                >
                                    <XCircle className="mr-1 h-3 w-3" />
                                    Inactive
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {service.price ? (
                                <div className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="font-semibold text-green-600">
                                        ₱{parseFloat(service.price).toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1 text-gray-500">
                                    <Info className="h-4 w-4" />
                                    <span className="text-sm">
                                        No price set
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(service)}
                                disabled={processing}
                            >
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={processing}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span>Delete Service</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{service.name}"?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                onDelete(service);
                                setShowDeleteDialog(false);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Service
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

const Index = ({ auth, services }) => {
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const handleAdd = () => {
        setEditing(null);
        setShowModal(true);
    };

    const handleEdit = (service) => {
        setEditing(service);
        setShowModal(true);
    };

    const handleDelete = async (service) => {
        setProcessing(true);
        router.delete(
            route("clinic.services.destroy", [auth.clinic_id, service.id]),
            {
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleSubmit = async (form, setErrors) => {
        setProcessing(true);
        setErrors({});

        const method = editing ? "put" : "post";
        const url = editing
            ? route("clinic.services.update", [auth.clinic_id, editing.id])
            : route("clinic.services.store", [auth.clinic_id]);

        router[method](url, form, {
            onSuccess: () => {
                setShowModal(false);
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    // Filter services based on search and status
    const filteredServices = services.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && service.is_active) ||
            (statusFilter === "inactive" && !service.is_active);

        return matchesSearch && matchesStatus;
    });

    const activeServices = services.filter((s) => s.is_active).length;
    const totalServices = services.length;

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Services Management
                </h2>
            }
        >
            <Head title="Services" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Services
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Manage your clinic's services and treatments
                                </p>
                            </div>
                            <Button
                                onClick={handleAdd}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Service
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Package className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Services
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {totalServices}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Activity className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Active Services
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {activeServices}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <DollarSign className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Priced Services
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {
                                                services.filter((s) => s.price)
                                                    .length
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search and Filter Section */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search services..."
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    {/* Services Grid */}
                    {filteredServices.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm || statusFilter !== "all"
                                        ? "No services found"
                                        : "No services yet"}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || statusFilter !== "all"
                                        ? "Try adjusting your search or filter criteria."
                                        : "Get started by adding your first service."}
                                </p>
                                {!searchTerm && statusFilter === "all" && (
                                    <Button onClick={handleAdd}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Service
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    processing={processing}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Service Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Package className="h-5 w-5" />
                            <span>
                                {editing ? "Edit Service" : "Add New Service"}
                            </span>
                        </DialogTitle>
                        <DialogDescription>
                            {editing
                                ? "Update the service details below."
                                : "Fill in the details to create a new service for your clinic."}
                        </DialogDescription>
                    </DialogHeader>
                    <ServiceForm
                        service={editing}
                        onSubmit={handleSubmit}
                        onClose={() => setShowModal(false)}
                        processing={processing}
                    />
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default Index;
