import { Head, useForm } from "@inertiajs/react";
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

export default function Edit({ auth, clinic, inventory, suppliers }) {
    const { data, setData, put, processing, errors } = useForm({
        name: inventory.name,
        description: inventory.description,
        quantity: inventory.quantity,
        minimum_quantity: inventory.minimum_quantity,
        unit_price: inventory.unit_price,
        category: inventory.category,
        supplier_id: inventory.supplier_id
            ? inventory.supplier_id.toString()
            : "none",
        notes: inventory.notes,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { ...data };
        // Convert "none" to null for supplier_id, or convert string ID to integer
        if (formData.supplier_id === "none") {
            formData.supplier_id = null;
        } else if (formData.supplier_id && formData.supplier_id !== "none") {
            formData.supplier_id = parseInt(formData.supplier_id);
        }
        put(route("clinic.inventory.update", [clinic.id, inventory.id]), {
            data: formData,
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Inventory Item
                </h2>
            }
        >
            <Head title="Edit Inventory Item" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Inventory Item</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="mt-1"
                                            required
                                        />
                                        {errors.name && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.name}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="category">
                                            Category
                                        </Label>
                                        <Select
                                            value={data.category}
                                            onValueChange={(value) =>
                                                setData("category", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dental_supplies">
                                                    Dental Supplies
                                                </SelectItem>
                                                <SelectItem value="equipment">
                                                    Equipment
                                                </SelectItem>
                                                <SelectItem value="medications">
                                                    Medications
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.category && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.category}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="quantity">
                                            Quantity
                                        </Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData(
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                            required
                                            min="0"
                                        />
                                        {errors.quantity && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.quantity}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="minimum_quantity">
                                            Minimum Quantity
                                        </Label>
                                        <Input
                                            id="minimum_quantity"
                                            type="number"
                                            value={data.minimum_quantity}
                                            onChange={(e) =>
                                                setData(
                                                    "minimum_quantity",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                            required
                                            min="0"
                                        />
                                        {errors.minimum_quantity && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.minimum_quantity}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="unit_price">
                                            Unit Price
                                        </Label>
                                        <Input
                                            id="unit_price"
                                            type="number"
                                            value={data.unit_price}
                                            onChange={(e) =>
                                                setData(
                                                    "unit_price",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1"
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors.unit_price && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.unit_price}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="supplier_id">
                                            Supplier
                                        </Label>
                                        <Select
                                            value={data.supplier_id}
                                            onValueChange={(value) =>
                                                setData("supplier_id", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select supplier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    None
                                                </SelectItem>
                                                {suppliers.map((supplier) => (
                                                    <SelectItem
                                                        key={supplier.id}
                                                        value={supplier.id.toString()}
                                                    >
                                                        {supplier.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.supplier_id && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {errors.supplier_id}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">
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
                                        className="mt-1"
                                        required
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        className="mt-1"
                                        rows={3}
                                    />
                                    {errors.notes && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.notes}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? "Updating..."
                                            : "Update Item"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
