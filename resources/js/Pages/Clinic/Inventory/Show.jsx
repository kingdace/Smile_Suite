import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Package,
    Edit,
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Calendar,
    MapPin,
    Barcode,
    DollarSign,
    Activity,
    Plus,
    Minus,
    RotateCcw,
    FileText,
    Clock,
    User,
    Building,
    Phone,
    Mail,
    Shield,
    AlertCircle,
    Timer,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function Show({ auth, clinic, inventory, transactions = [] }) {
    const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState("in");
    
    const { data, setData, post, processing, errors, reset } = useForm({
        quantity: "",
        notes: "",
        type: "adjustment",
    });

    const getStockStatus = () => {
        if (inventory.quantity <= 0) return { label: "Out of Stock", color: "destructive", icon: XCircle };
        if (inventory.quantity <= inventory.minimum_quantity) return { label: "Low Stock", color: "warning", icon: AlertTriangle };
        return { label: "In Stock", color: "success", icon: CheckCircle };
    };

    const getExpiryStatus = () => {
        if (!inventory.expiry_date) return { label: "No Expiry", color: "default", icon: Timer };
        
        const expiryDate = new Date(inventory.expiry_date);
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

        if (expiryDate <= today) return { label: "Expired", color: "destructive", icon: XCircle };
        if (expiryDate <= thirtyDaysFromNow) return { label: "Expiring Soon", color: "warning", icon: AlertTriangle };
        return { label: "Valid", color: "success", icon: CheckCircle };
    };

    const handleQuantityAdjustment = (e) => {
        e.preventDefault();
        
        const adjustmentData = {
            ...data,
            inventory_id: inventory.id,
            quantity_before: inventory.quantity,
            quantity_after: adjustmentType === "in" 
                ? inventory.quantity + parseInt(data.quantity)
                : inventory.quantity - parseInt(data.quantity),
        };

        post(route("clinic.inventory.adjust-quantity", [clinic.id, inventory.id]), {
            data: adjustmentData,
            onSuccess: () => {
                setAdjustmentDialogOpen(false);
                reset();
            },
        });
    };

    const stockStatus = getStockStatus();
    const expiryStatus = getExpiryStatus();
    const StockIcon = stockStatus.icon;
    const ExpiryIcon = expiryStatus.icon;
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${inventory.name} - Inventory Details`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                {/* Header */}
                <div className="pt-6 pb-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-xl font-bold text-white drop-shadow-sm">
                                                    {inventory.name}
                                                </h1>
                                                <p className="text-sm text-blue-100 font-medium">
                                                    {inventory.category?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())} • SKU: {inventory.sku || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                                >
                                                    <Activity className="h-4 w-4 mr-2" />
                                                    Adjust Stock
                                                </Button>
                                            </DialogTrigger>
                                        </Dialog>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                        >
                                            <Link href={route("clinic.inventory.edit", [clinic.id, inventory.id])}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                        >
                                            <Link href={route("clinic.inventory.index", [clinic.id])}>
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Back to Inventory
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
                    {/* Key Status Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Stock Status */}
                        <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${
                            stockStatus.color === "destructive" ? "bg-gradient-to-br from-red-50 to-pink-100" :
                            stockStatus.color === "warning" ? "bg-gradient-to-br from-amber-50 to-orange-100" :
                            "bg-gradient-to-br from-emerald-50 to-green-100"
                        }`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium mb-1 ${
                                            stockStatus.color === "destructive" ? "text-red-700" :
                                            stockStatus.color === "warning" ? "text-amber-700" :
                                            "text-emerald-700"
                                        }`}>Stock Status</p>
                                        <p className={`text-3xl font-bold ${
                                            stockStatus.color === "destructive" ? "text-red-900" :
                                            stockStatus.color === "warning" ? "text-amber-900" :
                                            "text-emerald-900"
                                        }`}>{inventory.quantity}</p>
                                        <div className="flex items-center mt-2">
                                            <StockIcon className={`h-4 w-4 mr-1 ${
                                                stockStatus.color === "destructive" ? "text-red-500" :
                                                stockStatus.color === "warning" ? "text-amber-500" :
                                                "text-emerald-500"
                                            }`} />
                                            <span className={`text-sm font-medium ${
                                                stockStatus.color === "destructive" ? "text-red-600" :
                                                stockStatus.color === "warning" ? "text-amber-600" :
                                                "text-emerald-600"
                                            }`}>{stockStatus.label}</span>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                                        stockStatus.color === "destructive" ? "bg-gradient-to-br from-red-500 to-pink-600" :
                                        stockStatus.color === "warning" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
                                        "bg-gradient-to-br from-emerald-500 to-green-600"
                                    }`}>
                                        <StockIcon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Value */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 mb-1">Total Value</p>
                                        <p className="text-3xl font-bold text-blue-900">
                                            ${(inventory.quantity * parseFloat(inventory.unit_price || 0)).toFixed(2)}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                                            <span className="text-sm text-blue-600 font-medium">Current worth</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <DollarSign className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Expiry Status */}
                        <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ${
                            expiryStatus.color === "destructive" ? "bg-gradient-to-br from-red-50 to-pink-100" :
                            expiryStatus.color === "warning" ? "bg-gradient-to-br from-amber-50 to-orange-100" :
                            "bg-gradient-to-br from-gray-50 to-slate-100"
                        }`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium mb-1 ${
                                            expiryStatus.color === "destructive" ? "text-red-700" :
                                            expiryStatus.color === "warning" ? "text-amber-700" :
                                            "text-gray-700"
                                        }`}>Expiry Status</p>
                                        <p className={`text-2xl font-bold ${
                                            expiryStatus.color === "destructive" ? "text-red-900" :
                                            expiryStatus.color === "warning" ? "text-amber-900" :
                                            "text-gray-900"
                                        }`}>{expiryStatus.label}</p>
                                        <div className="flex items-center mt-2">
                                            <ExpiryIcon className={`h-4 w-4 mr-1 ${
                                                expiryStatus.color === "destructive" ? "text-red-500" :
                                                expiryStatus.color === "warning" ? "text-amber-500" :
                                                "text-gray-500"
                                            }`} />
                                            <span className={`text-sm font-medium ${
                                                expiryStatus.color === "destructive" ? "text-red-600" :
                                                expiryStatus.color === "warning" ? "text-amber-600" :
                                                "text-gray-600"
                                            }`}>
                                                {inventory.expiry_date ? format(new Date(inventory.expiry_date), "MMM dd, yyyy") : "No expiry date"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${
                                        expiryStatus.color === "destructive" ? "bg-gradient-to-br from-red-500 to-pink-600" :
                                        expiryStatus.color === "warning" ? "bg-gradient-to-br from-amber-500 to-orange-600" :
                                        "bg-gradient-to-br from-gray-500 to-slate-600"
                                    }`}>
                                        <ExpiryIcon className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Minimum Quantity Alert */}
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-xl transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-700 mb-1">Minimum Stock</p>
                                        <p className="text-3xl font-bold text-purple-900">{inventory.minimum_quantity || 0}</p>
                                        <div className="flex items-center mt-2">
                                            <AlertCircle className="h-4 w-4 text-purple-500 mr-1" />
                                            <span className="text-sm text-purple-600 font-medium">Reorder threshold</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <AlertCircle className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Basic Information */}
                        <Card className="border-0 shadow-xl bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">Basic Information</CardTitle>
                                        <p className="text-sm text-gray-600">Item details and specifications</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Name</Label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">{inventory.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Category</Label>
                                        <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                                            {inventory.category?.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                        </Badge>
                                    </div>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                                    <p className="text-sm text-gray-900 mt-1">{inventory.description || "No description available"}</p>
                                </div>

                                {inventory.sku && (
                                    <div className="flex items-center space-x-2">
                                        <Barcode className="h-4 w-4 text-gray-500" />
                                        <Label className="text-sm font-medium text-gray-500">SKU:</Label>
                                        <p className="text-sm font-mono text-gray-900">{inventory.sku}</p>
                                    </div>
                                )}

                                {inventory.location && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <Label className="text-sm font-medium text-gray-500">Location:</Label>
                                        <p className="text-sm text-gray-900">{inventory.location}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pricing Information */}
                        <Card className="border-0 shadow-xl bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">Pricing Details</CardTitle>
                                        <p className="text-sm text-gray-600">Cost and pricing information</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Unit Price</Label>
                                        <p className="text-lg font-bold text-emerald-600 mt-1">${inventory.unit_price || "0.00"}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Total Value</Label>
                                        <p className="text-lg font-bold text-blue-600 mt-1">
                                            ${(inventory.quantity * parseFloat(inventory.unit_price || 0)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {inventory.cost_price && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Cost Price</Label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">${inventory.cost_price}</p>
                                    </div>
                                )}

                                {inventory.selling_price && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Selling Price</Label>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">${inventory.selling_price}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Supplier Information */}
                        <Card className="border-0 shadow-xl bg-white">
                            <CardHeader className="pb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Building className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">Supplier Details</CardTitle>
                                        <p className="text-sm text-gray-600">Supplier contact information</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {inventory.supplier ? (
                                    <>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Supplier Name</Label>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{inventory.supplier.name}</p>
                                        </div>

                                        {inventory.supplier.contact_person && (
                                            <div className="flex items-center space-x-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <Label className="text-sm font-medium text-gray-500">Contact:</Label>
                                                <p className="text-sm text-gray-900">{inventory.supplier.contact_person}</p>
                                            </div>
                                        )}

                                        {inventory.supplier.email && (
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4 text-gray-500" />
                                                <Label className="text-sm font-medium text-gray-500">Email:</Label>
                                                <p className="text-sm text-gray-900">{inventory.supplier.email}</p>
                                            </div>
                                        )}

                                        {inventory.supplier.phone && (
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <Label className="text-sm font-medium text-gray-500">Phone:</Label>
                                                <p className="text-sm text-gray-900">{inventory.supplier.phone}</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-4">
                                        <Building className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">No supplier assigned</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stock Adjustment Dialog */}
                    <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Adjust Stock Quantity</DialogTitle>
                                <DialogDescription>
                                    Current stock: <strong>{inventory.quantity}</strong> units
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleQuantityAdjustment} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        type="button"
                                        variant={adjustmentType === "in" ? "default" : "outline"}
                                        onClick={() => setAdjustmentType("in")}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Stock In</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={adjustmentType === "out" ? "default" : "outline"}
                                        onClick={() => setAdjustmentType("out")}
                                        className="flex items-center justify-center space-x-2"
                                    >
                                        <Minus className="h-4 w-4" />
                                        <span>Stock Out</span>
                                    </Button>
                                </div>

                                <div>
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        value={data.quantity}
                                        onChange={(e) => setData("quantity", e.target.value)}
                                        min="1"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Input
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData("notes", e.target.value)}
                                        placeholder="Reason for adjustment..."
                                        className="mt-1"
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setAdjustmentDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? "Adjusting..." : `${adjustmentType === "in" ? "Add" : "Remove"} Stock`}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
