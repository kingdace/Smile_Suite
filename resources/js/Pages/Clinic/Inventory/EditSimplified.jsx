import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Loader2,
    Package,
    ArrowLeft,
    Save,
    Calendar,
    DollarSign,
} from "lucide-react";

export default function EditSimplified({ auth, clinic, inventory, suppliers }) {
    const { data, setData, put, processing, errors } = useForm({
        // Essential fields only
        name: inventory.name || "",
        category: inventory.category || "",
        description: inventory.description || "",
        quantity: inventory.quantity || "",
        minimum_quantity: inventory.minimum_quantity || "",
        unit_price: inventory.unit_price || "",
        supplier_id: inventory.supplier_id
            ? inventory.supplier_id.toString()
            : "none",
        expiry_date: inventory.expiry_date
            ? new Date(inventory.expiry_date)
            : undefined,
        notes: inventory.notes || "",
        is_active: inventory.is_active ?? true,
    });

    // Simplified categories
    const categories = [
        { value: "medications", label: "Medications" },
        { value: "supplies", label: "Supplies" },
        { value: "equipment", label: "Equipment" },
        { value: "others", label: "Others" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { ...data };

        // Convert empty supplier to null
        if (
            !formData.supplier_id ||
            formData.supplier_id === "" ||
            formData.supplier_id === "none"
        ) {
            formData.supplier_id = null;
        }

        put(route("clinic.inventory.update", [clinic.id, inventory.id]), {
            data: formData,
        });
    };

    // Calculate total value
    const totalValue =
        data.quantity && data.unit_price
            ? parseFloat(data.quantity) * parseFloat(data.unit_price)
            : 0;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Edit ${inventory.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                {/* Header */}
                <div className="pt-4 pb-2">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                                                <Package className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                                                    Edit Inventory Item
                                                </h1>
                                                <p className="text-sm text-blue-100 font-medium">
                                                    Update {inventory.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                        >
                                            <Link
                                                href={route(
                                                    "clinic.inventory.show",
                                                    [clinic.id, inventory.id]
                                                )}
                                            >
                                                <ArrowLeft className="h-4 w-4 mr-2" />
                                                Back to Item
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-b border-gray-100">
                            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Package className="h-5 w-5 text-white" />
                                </div>
                                <span>Item Information</span>
                            </CardTitle>
                            <p className="text-gray-600 mt-2">
                                Update the essential details for your inventory
                                item
                            </p>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Item Name */}
                                        <div className="lg:col-span-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Item Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., Paracetamol 500mg, Gauze Pads, Dental Mirror"
                                                className="mt-2 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <Label
                                                htmlFor="category"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Category *
                                            </Label>
                                            <Select
                                                value={data.category}
                                                onValueChange={(value) =>
                                                    setData("category", value)
                                                }
                                            >
                                                <SelectTrigger className="mt-2 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                key={
                                                                    category.value
                                                                }
                                                                value={
                                                                    category.value
                                                                }
                                                            >
                                                                {category.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.category}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Supplier (Optional) */}
                                        <div>
                                            <Label
                                                htmlFor="supplier_id"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Supplier (Optional)
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
                                                <SelectTrigger className="mt-2 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select supplier (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">
                                                        No Supplier
                                                    </SelectItem>
                                                    {suppliers.map(
                                                        (supplier) => (
                                                            <SelectItem
                                                                key={
                                                                    supplier.id
                                                                }
                                                                value={supplier.id.toString()}
                                                            >
                                                                {supplier.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.supplier_id}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Label
                                            htmlFor="description"
                                            className="text-base font-semibold text-gray-700"
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
                                            placeholder="Brief description of the item..."
                                            className="mt-2 min-h-[100px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            rows={4}
                                        />
                                        <InputError
                                            message={errors.description}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Stock & Pricing */}
                                <div className="border-t border-gray-200 pt-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                            <DollarSign className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Stock & Pricing
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Current Quantity */}
                                        <div>
                                            <Label
                                                htmlFor="quantity"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Current Quantity *
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min="0"
                                                value={data.quantity}
                                                onChange={(e) =>
                                                    setData(
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0"
                                                className="mt-2 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <InputError
                                                message={errors.quantity}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Minimum Quantity (for alerts) */}
                                        <div>
                                            <Label
                                                htmlFor="minimum_quantity"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Alert When Below *
                                            </Label>
                                            <Input
                                                id="minimum_quantity"
                                                type="number"
                                                min="0"
                                                value={data.minimum_quantity}
                                                onChange={(e) =>
                                                    setData(
                                                        "minimum_quantity",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="5"
                                                className="mt-2 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <InputError
                                                message={
                                                    errors.minimum_quantity
                                                }
                                                className="mt-2"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Low stock alert threshold
                                            </p>
                                        </div>

                                        {/* Unit Price */}
                                        <div>
                                            <Label
                                                htmlFor="unit_price"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Unit Price (₱) *
                                            </Label>
                                            <Input
                                                id="unit_price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.unit_price}
                                                onChange={(e) =>
                                                    setData(
                                                        "unit_price",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0.00"
                                                className="mt-2 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            <InputError
                                                message={errors.unit_price}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Total Value Display */}
                                    {totalValue > 0 && (
                                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                        <DollarSign className="h-5 w-5 text-white" />
                                                    </div>
                                                    <span className="text-lg font-semibold text-blue-900">
                                                        Total Stock Value:
                                                    </span>
                                                </div>
                                                <span className="text-2xl font-bold text-blue-900">
                                                    ₱
                                                    {totalValue.toLocaleString(
                                                        "en-PH",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Details */}
                                <div className="border-t border-gray-200 pt-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                                            <Calendar className="h-4 w-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Additional Details
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Expiry Date */}
                                        <div>
                                            <Label
                                                htmlFor="expiry_date"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Expiry Date (Optional)
                                            </Label>
                                            <Input
                                                id="expiry_date"
                                                type="date"
                                                value={
                                                    data.expiry_date
                                                        ? new Date(
                                                              data.expiry_date
                                                          )
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "expiry_date",
                                                        e.target.value
                                                            ? new Date(
                                                                  e.target.value
                                                              )
                                                            : undefined
                                                    )
                                                }
                                                min={
                                                    new Date()
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                                className="mt-2 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <InputError
                                                message={errors.expiry_date}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <Label
                                                htmlFor="notes"
                                                className="text-base font-semibold text-gray-700"
                                            >
                                                Notes (Optional)
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
                                                placeholder="Additional notes..."
                                                className="mt-2 min-h-[100px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                rows={4}
                                            />
                                            <InputError
                                                message={errors.notes}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="border-t border-gray-200 pt-8">
                                    <div className="flex items-center justify-end space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                window.history.back()
                                            }
                                            className="h-12 px-8 text-base border-gray-300 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Update Item
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
