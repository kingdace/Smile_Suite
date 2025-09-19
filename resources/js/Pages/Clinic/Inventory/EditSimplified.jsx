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
    CalendarIcon,
    Loader2,
    Package,
    ArrowLeft,
    Save,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar as CalendarComponent } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function EditSimplified({ auth, clinic, inventory, suppliers }) {
    const { data, setData, put, processing, errors } = useForm({
        // Essential fields only
        name: inventory.name || "",
        category: inventory.category || "",
        description: inventory.description || "",
        quantity: inventory.quantity || "",
        minimum_quantity: inventory.minimum_quantity || "",
        unit_price: inventory.unit_price || "",
        supplier_id: inventory.supplier_id ? inventory.supplier_id.toString() : "none",
        expiry_date: inventory.expiry_date ? new Date(inventory.expiry_date) : undefined,
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
        if (!formData.supplier_id || formData.supplier_id === "" || formData.supplier_id === "none") {
            formData.supplier_id = null;
        }

        put(route("clinic.inventory.update", [clinic.id, inventory.id]), {
            data: formData,
        });
    };

    // Calculate total value
    const totalValue = data.quantity && data.unit_price 
        ? parseFloat(data.quantity) * parseFloat(data.unit_price)
        : 0;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Edit ${inventory.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                {/* Header */}
                <div className="pt-6 pb-2">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                            <Link href={route("clinic.inventory.show", [clinic.id, inventory.id])}>
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Card className="border-0 shadow-xl bg-white">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center space-x-3">
                                <Package className="h-6 w-6 text-blue-600" />
                                <span>Item Information</span>
                            </CardTitle>
                            <p className="text-gray-600">Update the essential details for your inventory item</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Item Name */}
                                        <div className="md:col-span-2">
                                            <Label htmlFor="name" className="text-base font-medium">
                                                Item Name *
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData("name", e.target.value)}
                                                placeholder="e.g., Paracetamol 500mg, Gauze Pads, Dental Mirror"
                                                className="mt-2 h-12 text-base"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <Label htmlFor="category" className="text-base font-medium">
                                                Category *
                                            </Label>
                                            <Select value={data.category} onValueChange={(value) => setData("category", value)}>
                                                <SelectTrigger className="mt-2 h-12 text-base">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.value} value={category.value}>
                                                            {category.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>

                                        {/* Supplier (Optional) */}
                                        <div>
                                            <Label htmlFor="supplier_id" className="text-base font-medium">
                                                Supplier (Optional)
                                            </Label>
                                            <Select value={data.supplier_id} onValueChange={(value) => setData("supplier_id", value)}>
                                                <SelectTrigger className="mt-2 h-12 text-base">
                                                    <SelectValue placeholder="Select supplier (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No Supplier</SelectItem>
                                                    {suppliers.map((supplier) => (
                                                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                            {supplier.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.supplier_id} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <Label htmlFor="description" className="text-base font-medium">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Brief description of the item..."
                                            className="mt-2 min-h-[100px] text-base"
                                            rows={4}
                                        />
                                        <InputError message={errors.description} className="mt-2" />
                                    </div>
                                </div>

                                {/* Stock & Pricing */}
                                <div className="border-t pt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Stock & Pricing</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Current Quantity */}
                                        <div>
                                            <Label htmlFor="quantity" className="text-base font-medium">
                                                Current Quantity *
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                min="0"
                                                value={data.quantity}
                                                onChange={(e) => setData("quantity", e.target.value)}
                                                placeholder="0"
                                                className="mt-2 h-12 text-base"
                                                required
                                            />
                                            <InputError message={errors.quantity} className="mt-2" />
                                        </div>

                                        {/* Minimum Quantity (for alerts) */}
                                        <div>
                                            <Label htmlFor="minimum_quantity" className="text-base font-medium">
                                                Alert When Below *
                                            </Label>
                                            <Input
                                                id="minimum_quantity"
                                                type="number"
                                                min="0"
                                                value={data.minimum_quantity}
                                                onChange={(e) => setData("minimum_quantity", e.target.value)}
                                                placeholder="5"
                                                className="mt-2 h-12 text-base"
                                                required
                                            />
                                            <InputError message={errors.minimum_quantity} className="mt-2" />
                                            <p className="text-sm text-gray-500 mt-1">Low stock alert threshold</p>
                                        </div>

                                        {/* Unit Price */}
                                        <div>
                                            <Label htmlFor="unit_price" className="text-base font-medium">
                                                Unit Price (₱) *
                                            </Label>
                                            <Input
                                                id="unit_price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.unit_price}
                                                onChange={(e) => setData("unit_price", e.target.value)}
                                                placeholder="0.00"
                                                className="mt-2 h-12 text-base"
                                                required
                                            />
                                            <InputError message={errors.unit_price} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Total Value Display */}
                                    {totalValue > 0 && (
                                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-medium text-blue-900">
                                                    Total Stock Value:
                                                </span>
                                                <span className="text-xl font-bold text-blue-900">
                                                    ₱{totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Details */}
                                <div className="border-t pt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Additional Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Expiry Date */}
                                        <div>
                                            <Label htmlFor="expiry_date" className="text-base font-medium">
                                                Expiry Date (Optional)
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full mt-2 h-12 text-base justify-start text-left font-normal",
                                                            !data.expiry_date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {data.expiry_date ? (
                                                            format(data.expiry_date, "PPP")
                                                        ) : (
                                                            <span>Pick expiry date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <CalendarComponent
                                                        mode="single"
                                                        selected={data.expiry_date}
                                                        onSelect={(date) => setData("expiry_date", date)}
                                                        initialFocus
                                                        disabled={(date) => date < new Date()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <InputError message={errors.expiry_date} className="mt-2" />
                                        </div>

                                        {/* Notes */}
                                        <div>
                                            <Label htmlFor="notes" className="text-base font-medium">
                                                Notes (Optional)
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData("notes", e.target.value)}
                                                placeholder="Additional notes..."
                                                className="mt-2 min-h-[100px] text-base"
                                                rows={4}
                                            />
                                            <InputError message={errors.notes} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="border-t pt-8">
                                    <div className="flex items-center justify-end space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => window.history.back()}
                                            className="h-12 px-8 text-base"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
