import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
    Plus,
    Trash2,
    ShoppingCart,
    Calendar,
    DollarSign,
    Package,
    Truck,
    FileText,
    ArrowLeft,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    Edit,
} from "lucide-react";

export default function EditPurchaseOrder({
    auth,
    clinic,
    purchaseOrder,
    suppliers,
    inventoryItems,
}) {
    const [items, setItems] = useState([]);

    // Initialize items from existing PO data
    useEffect(() => {
        if (purchaseOrder.items && purchaseOrder.items.length > 0) {
            setItems(
                purchaseOrder.items.map((item) => ({
                    inventory_id: item.inventory_id?.toString() || "",
                    quantity_ordered: item.quantity_ordered?.toString() || "",
                    unit_cost: item.unit_cost?.toString() || "",
                    expected_delivery_date: item.expected_delivery_date || "",
                    notes: item.notes || "",
                }))
            );
        } else {
            setItems([
                {
                    inventory_id: "",
                    quantity_ordered: "",
                    unit_cost: "",
                    expected_delivery_date: "",
                    notes: "",
                },
            ]);
        }
    }, [purchaseOrder]);

    const { data, setData, put, processing, errors } = useForm({
        supplier_id: purchaseOrder.supplier_id?.toString() || "",
        order_date:
            purchaseOrder.order_date || new Date().toISOString().split("T")[0],
        expected_delivery_date: purchaseOrder.expected_delivery_date || "",
        notes: purchaseOrder.notes || "",
        delivery_notes: purchaseOrder.delivery_notes || "",
        payment_terms: purchaseOrder.payment_terms || "",
        items: items,
    });

    // Update form data when items change
    useEffect(() => {
        setData("items", items);
    }, [items]);

    const addItem = () => {
        setItems([
            ...items,
            {
                inventory_id: "",
                quantity_ordered: "",
                unit_cost: "",
                expected_delivery_date: "",
                notes: "",
            },
        ]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const getInventoryItem = (inventoryId) => {
        return inventoryItems.find(
            (item) => item.id.toString() === inventoryId
        );
    };

    const calculateItemTotal = (item) => {
        const quantity = parseFloat(item.quantity_ordered) || 0;
        const unitCost = parseFloat(item.unit_cost) || 0;
        return quantity * unitCost;
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            return total + calculateItemTotal(item);
        }, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(
            route("clinic.purchase-orders.update", [
                clinic.id,
                purchaseOrder.id,
            ])
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Purchase Order" />

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
                                    <Edit className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Edit Purchase Order
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Update purchase order:{" "}
                                        {purchaseOrder.po_number}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge
                                    variant="outline"
                                    className="font-medium bg-yellow-100 text-yellow-700 border-yellow-200"
                                >
                                    Pending
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
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form Section */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Purchase Order Details */}
                                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Purchase Order Details
                                                </CardTitle>
                                                <p className="text-sm text-gray-600">
                                                    Update basic information for
                                                    the purchase order
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <Label
                                                    htmlFor="supplier_id"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Supplier *
                                                </Label>
                                                <Select
                                                    value={data.supplier_id}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "supplier_id",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                                                        <SelectValue placeholder="Select supplier" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {suppliers.map(
                                                            (supplier) => (
                                                                <SelectItem
                                                                    key={
                                                                        supplier.id
                                                                    }
                                                                    value={supplier.id.toString()}
                                                                >
                                                                    {
                                                                        supplier.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {errors.supplier_id && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.supplier_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="order_date"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Order Date *
                                                </Label>
                                                <Input
                                                    id="order_date"
                                                    type="date"
                                                    value={data.order_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "order_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                    required
                                                />
                                                {errors.order_date && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.order_date}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="expected_delivery_date"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Expected Delivery Date *
                                                </Label>
                                                <Input
                                                    id="expected_delivery_date"
                                                    type="date"
                                                    value={
                                                        data.expected_delivery_date
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "expected_delivery_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                    required
                                                />
                                                {errors.expected_delivery_date && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {
                                                            errors.expected_delivery_date
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="payment_terms"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Payment Terms
                                                </Label>
                                                <Input
                                                    id="payment_terms"
                                                    type="text"
                                                    value={data.payment_terms}
                                                    onChange={(e) =>
                                                        setData(
                                                            "payment_terms",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., Net 30, COD"
                                                    className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                />
                                                {errors.payment_terms && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.payment_terms}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label
                                                    htmlFor="notes"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Notes
                                                </Label>
                                                <Textarea
                                                    id="notes"
                                                    value={data.notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            "notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Additional notes for the purchase order..."
                                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                    rows={3}
                                                />
                                                {errors.notes && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.notes}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label
                                                    htmlFor="delivery_notes"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Delivery Notes
                                                </Label>
                                                <Textarea
                                                    id="delivery_notes"
                                                    value={data.delivery_notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            "delivery_notes",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Special delivery instructions..."
                                                    className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                    rows={3}
                                                />
                                                {errors.delivery_notes && (
                                                    <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.delivery_notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Order Items */}
                                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-green-50/30 to-emerald-50/20 border-b border-gray-200/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl font-bold text-gray-900">
                                                        Order Items
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600">
                                                        Update items in the
                                                        purchase order
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={addItem}
                                                className="gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Item
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            {items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="font-semibold text-gray-900">
                                                            Item {index + 1}
                                                        </h4>
                                                        {items.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        index
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <div>
                                                            <Label className="text-sm font-medium text-gray-700">
                                                                Item *
                                                            </Label>
                                                            <Select
                                                                value={
                                                                    item.inventory_id
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    updateItem(
                                                                        index,
                                                                        "inventory_id",
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                                                                    <SelectValue placeholder="Select item" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {inventoryItems.map(
                                                                        (
                                                                            invItem
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    invItem.id
                                                                                }
                                                                                value={invItem.id.toString()}
                                                                            >
                                                                                {
                                                                                    invItem.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div>
                                                            <Label className="text-sm font-medium text-gray-700">
                                                                Quantity *
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    item.quantity_ordered
                                                                }
                                                                onChange={(e) =>
                                                                    updateItem(
                                                                        index,
                                                                        "quantity_ordered",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                                placeholder="0"
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label className="text-sm font-medium text-gray-700">
                                                                Unit Cost *
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={
                                                                    item.unit_cost
                                                                }
                                                                onChange={(e) =>
                                                                    updateItem(
                                                                        index,
                                                                        "unit_cost",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                                placeholder="0.00"
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label className="text-sm font-medium text-gray-700">
                                                                Total
                                                            </Label>
                                                            <div className="mt-1 h-11 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg flex items-center">
                                                                <span className="font-semibold text-gray-900">
                                                                    {formatCurrency(
                                                                        calculateItemTotal(
                                                                            item
                                                                        )
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <Label className="text-sm font-medium text-gray-700">
                                                                Expected
                                                                Delivery Date
                                                            </Label>
                                                            <Input
                                                                type="date"
                                                                value={
                                                                    item.expected_delivery_date
                                                                }
                                                                onChange={(e) =>
                                                                    updateItem(
                                                                        index,
                                                                        "expected_delivery_date",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                            />
                                                        </div>

                                                        <div className="md:col-span-2">
                                                            <Label className="text-sm font-medium text-gray-700">
                                                                Notes
                                                            </Label>
                                                            <Input
                                                                type="text"
                                                                value={
                                                                    item.notes
                                                                }
                                                                onChange={(e) =>
                                                                    updateItem(
                                                                        index,
                                                                        "notes",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Item-specific notes..."
                                                                className="mt-1 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Item Details Preview */}
                                                    {item.inventory_id && (
                                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Package className="h-4 w-4 text-blue-600" />
                                                                <span className="text-sm font-medium text-blue-900">
                                                                    Item Details
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        Current
                                                                        Stock:
                                                                    </span>
                                                                    <span className="ml-2 font-medium text-gray-900">
                                                                        {getInventoryItem(
                                                                            item.inventory_id
                                                                        )
                                                                            ?.quantity ||
                                                                            0}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        Min.
                                                                        Quantity:
                                                                    </span>
                                                                    <span className="ml-2 font-medium text-gray-900">
                                                                        {getInventoryItem(
                                                                            item.inventory_id
                                                                        )
                                                                            ?.minimum_quantity ||
                                                                            0}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        Category:
                                                                    </span>
                                                                    <span className="ml-2 font-medium text-gray-900">
                                                                        {getInventoryItem(
                                                                            item.inventory_id
                                                                        )
                                                                            ?.category ||
                                                                            "N/A"}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600">
                                                                        SKU:
                                                                    </span>
                                                                    <span className="ml-2 font-medium text-gray-900">
                                                                        {getInventoryItem(
                                                                            item.inventory_id
                                                                        )
                                                                            ?.sku ||
                                                                            "N/A"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {errors.items && (
                                            <div className="text-red-500 text-sm mt-4 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.items}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Summary Sidebar */}
                            <div className="space-y-6">
                                {/* Order Summary */}
                                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30 sticky top-6">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-purple-50/30 to-violet-50/20 border-b border-gray-200/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <DollarSign className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Order Summary
                                                </CardTitle>
                                                <p className="text-sm text-gray-600">
                                                    Review your updated purchase
                                                    order
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">
                                                    Items:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {
                                                        items.filter(
                                                            (item) =>
                                                                item.inventory_id
                                                        ).length
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">
                                                    Total Quantity:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {items.reduce(
                                                        (total, item) =>
                                                            total +
                                                            (parseInt(
                                                                item.quantity_ordered
                                                            ) || 0),
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-semibold text-gray-900">
                                                    Total Amount:
                                                </span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {formatCurrency(
                                                        calculateTotal()
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    calculateTotal() === 0
                                                }
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
                                            >
                                                {processing ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        Updating PO...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Save className="h-4 w-4" />
                                                        Update Purchase Order
                                                    </div>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    window.history.back()
                                                }
                                                className="w-full py-3 rounded-lg"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Tips */}
                                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-yellow-50/30 to-amber-50/20 border-b border-gray-200/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                                                <AlertCircle className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-gray-900">
                                                    Edit Tips
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Only pending POs can be
                                                    edited
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Add, remove, or modify items
                                                    as needed
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Update quantities, costs,
                                                    and delivery dates
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Review the updated total
                                                    before saving
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
