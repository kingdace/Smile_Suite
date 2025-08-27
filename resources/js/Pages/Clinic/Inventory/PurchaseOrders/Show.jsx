import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    ShoppingCart,
    Calendar,
    DollarSign,
    Package,
    Truck,
    FileText,
    ArrowLeft,
    Edit,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    Building,
    Phone,
    Mail,
    MapPin,
    Eye,
    Download,
    Printer,
    MoreHorizontal,
    Plus,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function Show({ auth, clinic, purchaseOrder }) {
    const [showReceiveDialog, setShowReceiveDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [receiveQuantity, setReceiveQuantity] = useState("");

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

    const handleApprove = () => {
        router.post(
            route("clinic.purchase-orders.approve", [
                clinic.id,
                purchaseOrder.id,
            ])
        );
    };

    const handleMarkAsOrdered = () => {
        router.post(
            route("clinic.purchase-orders.mark-ordered", [
                clinic.id,
                purchaseOrder.id,
            ])
        );
    };

    const handleReceiveItem = (item) => {
        setSelectedItem(item);
        setReceiveQuantity("");
        setShowReceiveDialog(true);
    };

    const submitReceiveItem = () => {
        if (!selectedItem || !receiveQuantity) return;
        router.post(
            route("clinic.purchase-orders.receive-item", [
                clinic.id,
                purchaseOrder.id,
                selectedItem.id,
            ]),
            { quantity_received: receiveQuantity }
        );
        setShowReceiveDialog(false);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Purchase Order - ${purchaseOrder.po_number}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-5 rounded-xl shadow-2xl">
                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <ShoppingCart className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Purchase Order Details
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        {purchaseOrder.po_number} -{" "}
                                        {purchaseOrder.supplier?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="outline"
                                    className={`font-medium ${getStatusColor(
                                        purchaseOrder.status
                                    )}`}
                                >
                                    {getStatusLabel(purchaseOrder.status)}
                                </Badge>
                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="gap-2 text-sm px-4 py-2 rounded-xl transition-all duration-300 border backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt--10 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* PO Information */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Purchase Order Information
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Order Details
                                            </h3>
                                            <dl className="space-y-3">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        PO Number
                                                    </dt>
                                                    <dd className="text-lg font-semibold text-gray-900">
                                                        {
                                                            purchaseOrder.po_number
                                                        }
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Order Date
                                                    </dt>
                                                    <dd className="text-gray-900">
                                                        {formatDate(
                                                            purchaseOrder.order_date
                                                        )}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Expected Delivery
                                                    </dt>
                                                    <dd className="text-gray-900">
                                                        {formatDate(
                                                            purchaseOrder.expected_delivery_date
                                                        )}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                                Financial Summary
                                            </h3>
                                            <dl className="space-y-3">
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Total Amount
                                                    </dt>
                                                    <dd className="text-2xl font-bold text-green-600">
                                                        {formatCurrency(
                                                            purchaseOrder.total_amount
                                                        )}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Items */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-green-50/30 to-emerald-50/20 border-b border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                            <Package className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Order Items
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        {purchaseOrder.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {item.item_name}
                                                    </h4>
                                                    {item.quantity_received <
                                                        item.quantity_ordered && (
                                                        <Button
                                                            onClick={() =>
                                                                handleReceiveItem(
                                                                    item
                                                                )
                                                            }
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Receive
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-600">
                                                            Quantity:
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {
                                                                item.quantity_received
                                                            }
                                                            /
                                                            {
                                                                item.quantity_ordered
                                                            }
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">
                                                            Unit Cost:
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {formatCurrency(
                                                                item.unit_cost
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">
                                                            Total:
                                                        </span>
                                                        <span className="ml-2 font-medium">
                                                            {formatCurrency(
                                                                item.total_cost
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600">
                                                            Status:
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2"
                                                        >
                                                            {item.quantity_received >=
                                                            item.quantity_ordered
                                                                ? "Received"
                                                                : "Pending"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Workflow Actions */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30 sticky top-6">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-purple-50/30 to-violet-50/20 border-b border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Actions
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {purchaseOrder.status === "pending" && (
                                            <Button
                                                onClick={handleApprove}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Approve PO
                                            </Button>
                                        )}
                                        {purchaseOrder.status ===
                                            "approved" && (
                                            <Button
                                                onClick={handleMarkAsOrdered}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                                <Truck className="h-4 w-4 mr-2" />
                                                Mark as Ordered
                                            </Button>
                                        )}
                                        {purchaseOrder.status === "pending" && (
                                            <Link
                                                href={route(
                                                    "clinic.purchase-orders.edit",
                                                    [
                                                        clinic.id,
                                                        purchaseOrder.id,
                                                    ]
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit PO
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Supplier Info */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-orange-50/30 to-amber-50/20 border-b border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                            <Building className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                Supplier
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900">
                                            {purchaseOrder.supplier?.name}
                                        </h4>
                                        {purchaseOrder.supplier
                                            ?.contact_person && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <User className="h-4 w-4" />
                                                <span>
                                                    {
                                                        purchaseOrder.supplier
                                                            .contact_person
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {purchaseOrder.supplier?.email && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-4 w-4" />
                                                <span>
                                                    {
                                                        purchaseOrder.supplier
                                                            .email
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {purchaseOrder.supplier?.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="h-4 w-4" />
                                                <span>
                                                    {
                                                        purchaseOrder.supplier
                                                            .phone
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Receive Dialog */}
            <Dialog
                open={showReceiveDialog}
                onOpenChange={setShowReceiveDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Receive Item</DialogTitle>
                        <DialogDescription>
                            Enter quantity received for{" "}
                            {selectedItem?.item_name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="receive-quantity">
                                Quantity to Receive
                            </Label>
                            <Input
                                id="receive-quantity"
                                type="number"
                                min="1"
                                max={
                                    selectedItem
                                        ? selectedItem.quantity_ordered -
                                          selectedItem.quantity_received
                                        : 0
                                }
                                value={receiveQuantity}
                                onChange={(e) =>
                                    setReceiveQuantity(e.target.value)
                                }
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowReceiveDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitReceiveItem}
                            disabled={!receiveQuantity}
                        >
                            Receive Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
