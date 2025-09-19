import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    CalendarIcon,
    Loader2,
    Package,
    Tag,
    FileText,
    DollarSign,
    MapPin,
    AlertTriangle,
    Shield,
    Calendar,
    Barcode,
    ArrowLeft,
    Save,
    Plus,
    Minus,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar as CalendarComponent } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import React from "react";

export default function Create({ auth, clinic, suppliers }) {
    const [currentSection, setCurrentSection] = useState(0);
    const [specifications, setSpecifications] = useState([]);
    const [warnings, setWarnings] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        // Basic Information
        name: "",
        description: "",
        category: "",
        
        // Product Details
        sku: "",
        barcode: "",
        brand: "",
        model: "",
        size: "",
        color: "",
        
        // Inventory Details
        quantity: "",
        minimum_quantity: "",
        reorder_point: "",
        reorder_quantity: "",
        
        // Pricing Information
        unit_price: "",
        cost_price: "",
        selling_price: "",
        markup_percentage: "",
        
        // Location & Storage
        location: "",
        shelf: "",
        rack: "",
        
        // Expiry & Batch
        expiry_date: undefined,
        batch_number: "",
        lot_number: "",
        
        // Medical Information
        requires_prescription: false,
        is_controlled_substance: false,
        
        // Supplier Information
        supplier_id: "none",
        
        // Additional Information
        specifications: [],
        warnings: [],
        instructions: "",
        notes: "",
        is_active: true,
    });

    const sections = [
        { id: 0, title: "Basic Information", icon: Package },
        { id: 1, title: "Product Details", icon: Tag },
        { id: 2, title: "Inventory & Pricing", icon: DollarSign },
        { id: 3, title: "Location & Medical", icon: MapPin },
        { id: 4, title: "Additional Info", icon: FileText },
    ];

    const addSpecification = () => {
        const newSpecs = [...specifications, ""];
        setSpecifications(newSpecs);
        setData("specifications", newSpecs);
    };

    const removeSpecification = (index) => {
        const newSpecs = specifications.filter((_, i) => i !== index);
        setSpecifications(newSpecs);
        setData("specifications", newSpecs);
    };

    const updateSpecification = (index, value) => {
        const newSpecs = [...specifications];
        newSpecs[index] = value;
        setSpecifications(newSpecs);
        setData("specifications", newSpecs);
    };

    const addWarning = () => {
        const newWarnings = [...warnings, ""];
        setWarnings(newWarnings);
        setData("warnings", newWarnings);
    };

    const removeWarning = (index) => {
        const newWarnings = warnings.filter((_, i) => i !== index);
        setWarnings(newWarnings);
        setData("warnings", newWarnings);
    };

    const updateWarning = (index, value) => {
        const newWarnings = [...warnings];
        newWarnings[index] = value;
        setWarnings(newWarnings);
        setData("warnings", newWarnings);
    };

    const calculateMarkup = () => {
        if (data.cost_price && data.selling_price) {
            const costPrice = parseFloat(data.cost_price);
            const sellingPrice = parseFloat(data.selling_price);
            if (costPrice > 0) {
                const markup = ((sellingPrice - costPrice) / costPrice) * 100;
                setData("markup_percentage", markup.toFixed(2));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { ...data };
        
        // Convert "none" to null for supplier_id
        if (formData.supplier_id === "none") {
            formData.supplier_id = null;
        } else if (formData.supplier_id && formData.supplier_id !== "none") {
            formData.supplier_id = parseInt(formData.supplier_id);
        }

        // Ensure arrays are properly formatted
        formData.specifications = specifications.filter(spec => spec.trim() !== "");
        formData.warnings = warnings.filter(warning => warning.trim() !== "");

        post(route("clinic.inventory.store", [clinic.id]), {
            data: formData,
        });
    };

    const nextSection = () => {
        if (currentSection < sections.length - 1) {
            setCurrentSection(currentSection + 1);
        }
    };

    const prevSection = () => {
        if (currentSection > 0) {
            setCurrentSection(currentSection - 1);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Add Inventory Item" />

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
                                                    Add New Inventory Item
                                                </h1>
                                                <p className="text-sm text-blue-100 font-medium">
                                                    Create a comprehensive inventory record
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

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Section Navigation */}
                        <div className="lg:col-span-1">
                            <Card className="border-0 shadow-xl bg-white sticky top-6">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-900">Form Sections</CardTitle>
                                    <p className="text-sm text-gray-600">Complete all sections to create the item</p>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {sections.map((section) => {
                                        const Icon = section.icon;
                                        return (
                                            <button
                                                key={section.id}
                                                type="button"
                                                onClick={() => setCurrentSection(section.id)}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                                    currentSection === section.id
                                                        ? "bg-blue-100 text-blue-900 border-l-4 border-blue-500"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="font-medium">{section.title}</span>
                                            </button>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Form Content */}
                        <div className="lg:col-span-3">
                            <Card className="border-0 shadow-xl bg-white">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                            {React.createElement(sections[currentSection].icon, { className: "h-5 w-5 text-white" })}
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-semibold text-gray-900">
                                                {sections[currentSection].title}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Step {currentSection + 1} of {sections.length}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Section 0: Basic Information */}
                                        {currentSection === 0 && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor="name">Item Name *</Label>
                                                        <Input
                                                            id="name"
                                                            type="text"
                                                            value={data.name}
                                                            onChange={(e) => setData("name", e.target.value)}
                                                            className="mt-1"
                                                            required
                                                        />
                                                        <InputError message={errors.name} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="category">Category *</Label>
                                                        <Select
                                                            value={data.category}
                                                            onValueChange={(value) => setData("category", value)}
                                                        >
                                                            <SelectTrigger className="mt-1">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="dental_supplies">Dental Supplies</SelectItem>
                                                                <SelectItem value="equipment">Equipment</SelectItem>
                                                                <SelectItem value="medications">Medications</SelectItem>
                                                                <SelectItem value="laboratory">Laboratory</SelectItem>
                                                                <SelectItem value="office_supplies">Office Supplies</SelectItem>
                                                                <SelectItem value="other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <InputError message={errors.category} className="mt-2" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="description">Description *</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={data.description}
                                                        onChange={(e) => setData("description", e.target.value)}
                                                        className="mt-1"
                                                        rows={4}
                                                        required
                                                    />
                                                    <InputError message={errors.description} className="mt-2" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Section 1: Product Details */}
                                        {currentSection === 1 && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor="sku">SKU</Label>
                                                        <Input
                                                            id="sku"
                                                            type="text"
                                                            value={data.sku}
                                                            onChange={(e) => setData("sku", e.target.value)}
                                                            className="mt-1"
                                                        />
                                                        <InputError message={errors.sku} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="barcode">Barcode</Label>
                                                        <Input
                                                            id="barcode"
                                                            type="text"
                                                            value={data.barcode}
                                                            onChange={(e) => setData("barcode", e.target.value)}
                                                            className="mt-1"
                                                        />
                                                        <InputError message={errors.barcode} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="brand">Brand</Label>
                                                        <Input
                                                            id="brand"
                                                            type="text"
                                                            value={data.brand}
                                                            onChange={(e) => setData("brand", e.target.value)}
                                                            className="mt-1"
                                                        />
                                                        <InputError message={errors.brand} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="model">Model</Label>
                                                        <Input
                                                            id="model"
                                                            type="text"
                                                            value={data.model}
                                                            onChange={(e) => setData("model", e.target.value)}
                                                            className="mt-1"
                                                        />
                                                        <InputError message={errors.model} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="size">Size</Label>
                                                        <Input
                                                            id="size"
                                                            type="text"
                                                            value={data.size}
                                                            onChange={(e) => setData("size", e.target.value)}
                                                            className="mt-1"
                                                        />
                                                        <InputError message={errors.size} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="color">Color</Label>
                                                        <Input
                                                            id="color"
                                                            type="text"
                                                            value={data.color}
                                                            onChange={(e) => setData("color", e.target.value)}
                                                            className="mt-1"
                                                        />
                                                        <InputError message={errors.color} className="mt-2" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Section 2: Inventory & Pricing */}
                                        {currentSection === 2 && (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <Label htmlFor="quantity">Current Quantity *</Label>
                                                        <Input
                                                            id="quantity"
                                                            type="number"
                                                            value={data.quantity}
                                                            onChange={(e) => setData("quantity", e.target.value)}
                                                            className="mt-1"
                                                            min="0"
                                                            required
                                                        />
                                                        <InputError message={errors.quantity} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="minimum_quantity">Minimum Quantity *</Label>
                                                        <Input
                                                            id="minimum_quantity"
                                                            type="number"
                                                            value={data.minimum_quantity}
                                                            onChange={(e) => setData("minimum_quantity", e.target.value)}
                                                            className="mt-1"
                                                            min="0"
                                                            required
                                                        />
                                                        <InputError message={errors.minimum_quantity} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="reorder_point">Reorder Point</Label>
                                                        <Input
                                                            id="reorder_point"
                                                            type="number"
                                                            value={data.reorder_point}
                                                            onChange={(e) => setData("reorder_point", e.target.value)}
                                                            className="mt-1"
                                                            min="0"
                                                        />
                                                        <InputError message={errors.reorder_point} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="reorder_quantity">Reorder Quantity</Label>
                                                        <Input
                                                            id="reorder_quantity"
                                                            type="number"
                                                            value={data.reorder_quantity}
                                                            onChange={(e) => setData("reorder_quantity", e.target.value)}
                                                            className="mt-1"
                                                            min="1"
                                                        />
                                                        <InputError message={errors.reorder_quantity} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="unit_price">Unit Price *</Label>
                                                        <Input
                                                            id="unit_price"
                                                            type="number"
                                                            value={data.unit_price}
                                                            onChange={(e) => setData("unit_price", e.target.value)}
                                                            className="mt-1"
                                                            min="0"
                                                            step="0.01"
                                                            required
                                                        />
                                                        <InputError message={errors.unit_price} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="cost_price">Cost Price</Label>
                                                        <Input
                                                            id="cost_price"
                                                            type="number"
                                                            value={data.cost_price}
                                                            onChange={(e) => {
                                                                setData("cost_price", e.target.value);
                                                                calculateMarkup();
                                                            }}
                                                            className="mt-1"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                        <InputError message={errors.cost_price} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="selling_price">Selling Price</Label>
                                                        <Input
                                                            id="selling_price"
                                                            type="number"
                                                            value={data.selling_price}
                                                            onChange={(e) => {
                                                                setData("selling_price", e.target.value);
                                                                calculateMarkup();
                                                            }}
                                                            className="mt-1"
                                                            min="0"
                                                            step="0.01"
                                                        />
                                                        <InputError message={errors.selling_price} className="mt-2" />
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="markup_percentage">Markup %</Label>
                                                        <Input
                                                            id="markup_percentage"
                                                            type="number"
                                                            value={data.markup_percentage}
                                                            onChange={(e) => setData("markup_percentage", e.target.value)}
                                                            className="mt-1"
                                                            min="0"
                                                            step="0.01"
                                                            readOnly
                                                        />
                                                        <p className="text-sm text-gray-500 mt-1">Calculated automatically</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation Buttons */}
                                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={prevSection}
                                                disabled={currentSection === 0}
                                            >
                                                Previous
                                            </Button>

                                            <div className="flex items-center space-x-2">
                                                {sections.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className={`w-2 h-2 rounded-full ${
                                                            index === currentSection ? "bg-blue-500" : "bg-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>

                                            {currentSection < sections.length - 1 ? (
                                                <Button type="button" onClick={nextSection}>
                                                    Next
                                                </Button>
                                            ) : (
                                                <Button type="submit" disabled={processing}>
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Creating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Create Item
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
