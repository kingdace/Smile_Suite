import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Package,
    Plus,
    X,
    AlertTriangle,
    DollarSign,
    Hash,
} from "lucide-react";

export default function TreatmentInventorySelector({
    clinicId,
    value = [],
    onChange,
    disabled = false,
    showCosts = true,
}) {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(value);

    useEffect(() => {
        if (clinicId) {
            fetchAvailableInventory();
        }
    }, [clinicId]);

    useEffect(() => {
        onChange(selectedItems);
    }, [selectedItems, onChange]);

    const fetchAvailableInventory = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/clinic/${clinicId}/treatments/inventory/available`
            );
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched inventory:", data); // Debug log
                setInventory(data);
            } else {
                console.error(
                    "Failed to fetch inventory:",
                    response.status,
                    response.statusText
                );
                const errorData = await response.json().catch(() => ({}));
                console.error("Error details:", errorData);
            }
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const addInventoryItem = () => {
        setSelectedItems([
            ...selectedItems,
            {
                inventory_id: "",
                quantity_used: 1,
                notes: "",
            },
        ]);
    };

    const updateItem = (index, field, value) => {
        const updated = [...selectedItems];
        updated[index][field] = value;
        setSelectedItems(updated);
    };

    const removeItem = (index) => {
        const updated = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(updated);
    };

    const getSelectedInventory = (inventoryId) => {
        const found = inventory.find((item) => item.id == inventoryId);
        // If inventory item not found (deleted/renamed), return a fallback object
        if (!found) {
            return {
                id: inventoryId,
                name: "Unknown Item (Deleted)",
                description:
                    "This inventory item may have been deleted or renamed",
                unit_price: 0,
                quantity: 0,
                is_low_stock: false,
            };
        }
        return found;
    };

    const getTotalCost = () => {
        return selectedItems.reduce((total, item) => {
            const inventoryItem = getSelectedInventory(item.inventory_id);
            if (inventoryItem && item.quantity_used) {
                return total + inventoryItem.unit_price * item.quantity_used;
            }
            return total;
        }, 0);
    };

    const formatCurrency = (amount) => {
        return (
            "₱" +
            parseFloat(amount || 0).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })
        );
    };

    return (
        <Card className="w-full border border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                        <Package className="h-5 w-5 text-blue-600" />
                        Inventory Items Used
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={fetchAvailableInventory}
                            disabled={disabled || loading}
                            className="flex items-center gap-1 hover:bg-blue-100"
                        >
                            <Package className="h-4 w-4" />
                            Refresh
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addInventoryItem}
                            disabled={disabled || loading}
                            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </div>
                {showCosts && selectedItems.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {selectedItems.length}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Items
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-gray-300"></div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatCurrency(getTotalCost())}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Total Cost
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">
                                    Average per item
                                </div>
                                <div className="text-lg font-semibold text-gray-800">
                                    {selectedItems.length > 0
                                        ? formatCurrency(
                                              getTotalCost() /
                                                  selectedItems.length
                                          )
                                        : "₱0.00"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {loading && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">
                            Loading inventory...
                        </p>
                    </div>
                )}

                {!loading && inventory.length === 0 && (
                    <div className="text-center py-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                        <p className="text-sm font-medium text-yellow-800 mb-1">
                            No Available Inventory
                        </p>
                        <p className="text-xs text-yellow-700">
                            No active inventory items with stock available.
                            <br />
                            Check your inventory management or add new items.
                        </p>
                    </div>
                )}

                {selectedItems.length > 0 && (
                    <div
                        className={`grid gap-4 ${
                            selectedItems.length === 1
                                ? "grid-cols-1"
                                : "grid-cols-1 lg:grid-cols-2"
                        }`}
                    >
                        {selectedItems.map((item, index) => {
                            const selectedInventory = getSelectedInventory(
                                item.inventory_id
                            );
                            const isLowStock =
                                selectedInventory &&
                                selectedInventory.quantity <=
                                    selectedInventory.minimum_quantity;
                            const itemTotalCost =
                                selectedInventory && item.quantity_used
                                    ? selectedInventory.unit_price *
                                      item.quantity_used
                                    : 0;

                            return (
                                <Card
                                    key={index}
                                    className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                                    <Hash className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700">
                                                        Item {index + 1}
                                                    </span>
                                                    {selectedInventory && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs ml-2 border-blue-200 text-blue-700"
                                                        >
                                                            {
                                                                selectedInventory.category
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                                disabled={disabled}
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`inventory_${index}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Inventory Item *
                                                </Label>
                                                <Select
                                                    value={
                                                        item.inventory_id
                                                            ? item.inventory_id.toString()
                                                            : ""
                                                    }
                                                    onValueChange={(value) =>
                                                        updateItem(
                                                            index,
                                                            "inventory_id",
                                                            value
                                                        )
                                                    }
                                                    disabled={disabled}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select inventory item" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {inventory.length ===
                                                        0 ? (
                                                            <div className="p-2 text-sm text-gray-500 text-center">
                                                                No inventory
                                                                items available
                                                            </div>
                                                        ) : (
                                                            inventory.map(
                                                                (inv) => (
                                                                    <SelectItem
                                                                        key={
                                                                            inv.id
                                                                        }
                                                                        value={inv.id.toString()}
                                                                    >
                                                                        <div className="flex items-center justify-between w-full">
                                                                            <div className="flex flex-col">
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        inv.name
                                                                                    }
                                                                                </span>
                                                                                <span className="text-xs text-gray-500">
                                                                                    {
                                                                                        inv.category
                                                                                    }{" "}
                                                                                    •
                                                                                    ₱
                                                                                    {parseFloat(
                                                                                        inv.unit_price
                                                                                    ).toLocaleString(
                                                                                        "en-PH",
                                                                                        {
                                                                                            minimumFractionDigits: 2,
                                                                                        }
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                            <span className="text-xs text-gray-500 ml-2">
                                                                                Stock:{" "}
                                                                                {
                                                                                    inv.quantity
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </SelectItem>
                                                                )
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {selectedInventory && (
                                                    <div className="text-xs text-gray-600 mt-1">
                                                        <span className="font-medium">
                                                            Selected:
                                                        </span>{" "}
                                                        <span
                                                            className={
                                                                selectedInventory.name ===
                                                                "Unknown Item (Deleted)"
                                                                    ? "text-red-600 font-medium"
                                                                    : ""
                                                            }
                                                        >
                                                            {
                                                                selectedInventory.name
                                                            }
                                                        </span>
                                                        {selectedInventory.name ===
                                                        "Unknown Item (Deleted)" ? (
                                                            <span className="ml-2 text-red-500 text-xs">
                                                                (Item
                                                                deleted/renamed)
                                                            </span>
                                                        ) : (
                                                            <span className="ml-2 text-green-600">
                                                                (₱
                                                                {parseFloat(
                                                                    selectedInventory.unit_price
                                                                ).toLocaleString(
                                                                    "en-PH",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}{" "}
                                                                per unit)
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`quantity_${index}`}
                                                    className="text-sm font-medium"
                                                >
                                                    Quantity Used *
                                                </Label>
                                                <Input
                                                    id={`quantity_${index}`}
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity_used}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            index,
                                                            "quantity_used",
                                                            parseInt(
                                                                e.target.value
                                                            ) || 1
                                                        )
                                                    }
                                                    disabled={disabled}
                                                    className="mt-1"
                                                />
                                                {selectedInventory && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                                            <span>
                                                                Available:{" "}
                                                                {
                                                                    selectedInventory.quantity
                                                                }
                                                            </span>
                                                            {showCosts && (
                                                                <span className="font-medium text-green-600">
                                                                    Total:{" "}
                                                                    {formatCurrency(
                                                                        itemTotalCost
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                            💡 Smart validation:
                                                            Backend will
                                                            calculate net
                                                            differences for
                                                            updates
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {showCosts && selectedInventory && (
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                                            <DollarSign className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p
                                                                className={`text-sm font-semibold ${
                                                                    selectedInventory.name ===
                                                                    "Unknown Item (Deleted)"
                                                                        ? "text-red-800"
                                                                        : "text-green-800"
                                                                }`}
                                                            >
                                                                Cost Breakdown
                                                            </p>
                                                            {selectedInventory.name ===
                                                            "Unknown Item (Deleted)" ? (
                                                                <p className="text-xs text-red-600">
                                                                    Item deleted
                                                                    - cost
                                                                    unavailable
                                                                </p>
                                                            ) : (
                                                                <p className="text-xs text-green-700">
                                                                    {
                                                                        item.quantity_used
                                                                    }{" "}
                                                                    × ₱
                                                                    {parseFloat(
                                                                        selectedInventory.unit_price
                                                                    ).toLocaleString(
                                                                        "en-PH",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                        }
                                                                    )}{" "}
                                                                    per unit
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p
                                                            className={`text-xl font-bold ${
                                                                selectedInventory.name ===
                                                                "Unknown Item (Deleted)"
                                                                    ? "text-red-800"
                                                                    : "text-green-800"
                                                            }`}
                                                        >
                                                            {selectedInventory.name ===
                                                            "Unknown Item (Deleted)"
                                                                ? "N/A"
                                                                : formatCurrency(
                                                                      itemTotalCost
                                                                  )}
                                                        </p>
                                                        <p
                                                            className={`text-xs ${
                                                                selectedInventory.name ===
                                                                "Unknown Item (Deleted)"
                                                                    ? "text-red-600"
                                                                    : "text-green-600"
                                                            }`}
                                                        >
                                                            Total Cost
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {isLowStock && (
                                            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                                <span className="text-sm text-yellow-700">
                                                    Low stock warning: Only{" "}
                                                    {selectedInventory.quantity}{" "}
                                                    units remaining
                                                </span>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <Label
                                                htmlFor={`notes_${index}`}
                                                className="text-sm font-medium"
                                            >
                                                Usage Notes (Optional)
                                            </Label>
                                            <Input
                                                id={`notes_${index}`}
                                                value={item.notes}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        "notes",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="e.g., Applied to tooth #14, Patient allergic to latex..."
                                                disabled={disabled}
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Add any specific notes about how
                                                this item was used in the
                                                treatment
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {selectedItems.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            No inventory items selected
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                            Click "Add Item" to select inventory items used in
                            this treatment
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addInventoryItem}
                            disabled={disabled}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add First Item
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
