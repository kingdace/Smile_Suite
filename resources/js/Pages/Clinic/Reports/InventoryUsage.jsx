import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Calendar,
    Download,
    Package,
    TrendingUp,
    DollarSign,
    Hash,
    AlertTriangle,
    BarChart3,
    FileText,
    Clock,
} from "lucide-react";

export default function InventoryUsageReport({
    auth,
    inventoryUsage,
    filters,
}) {
    const [dateRange, setDateRange] = useState({
        start_date: filters?.start_date || "",
        end_date: filters?.end_date || "",
    });
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || ""
    );
    const [selectedInventory, setSelectedInventory] = useState(
        filters?.inventory_id || ""
    );

    const { data, setData, get, processing } = useForm({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        category: selectedCategory,
        inventory_id: selectedInventory,
    });

    const handleFilter = () => {
        get(route("clinic.reports.inventory-usage"), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const exportReport = () => {
        const params = new URLSearchParams({
            ...data,
            export: "excel",
        });
        window.open(
            route("clinic.reports.export.inventory-usage") +
                "?" +
                params.toString()
        );
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

    const getTotalUsage = () => {
        return (
            inventoryUsage?.reduce(
                (total, item) => total + item.total_quantity_used,
                0
            ) || 0
        );
    };

    const getTotalValue = () => {
        return (
            inventoryUsage?.reduce(
                (total, item) => total + item.total_value,
                0
            ) || 0
        );
    };

    const getTopUsedItems = () => {
        return inventoryUsage?.slice(0, 5) || [];
    };

    const getLowStockItems = () => {
        return (
            inventoryUsage?.filter(
                (item) => item.current_stock <= item.minimum_quantity
            ) || []
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Inventory Usage Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <BarChart3 className="h-6 w-6 text-blue-600" />
                                        Inventory Usage Report
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Track inventory consumption across
                                        treatments
                                    </p>
                                </div>
                                <Button
                                    onClick={exportReport}
                                    className="flex items-center gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Export Excel
                                </Button>
                            </div>

                            {/* Filters */}
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Report Filters
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label htmlFor="start_date">
                                                Start Date
                                            </Label>
                                            <Input
                                                id="start_date"
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_date",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="end_date">
                                                End Date
                                            </Label>
                                            <Input
                                                id="end_date"
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_date",
                                                        e.target.value
                                                    )
                                                }
                                            />
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
                                                    <SelectValue placeholder="All Categories" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">
                                                        All Categories
                                                    </SelectItem>
                                                    <SelectItem value="medication">
                                                        Medication
                                                    </SelectItem>
                                                    <SelectItem value="supplies">
                                                        Supplies
                                                    </SelectItem>
                                                    <SelectItem value="equipment">
                                                        Equipment
                                                    </SelectItem>
                                                    <SelectItem value="materials">
                                                        Materials
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-end">
                                            <Button
                                                onClick={handleFilter}
                                                disabled={processing}
                                                className="w-full"
                                            >
                                                {processing
                                                    ? "Filtering..."
                                                    : "Apply Filters"}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Total Items Used
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {getTotalUsage()}
                                                </p>
                                            </div>
                                            <Hash className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Total Value
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {formatCurrency(
                                                        getTotalValue()
                                                    )}
                                                </p>
                                            </div>
                                            <DollarSign className="h-8 w-8 text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Unique Items
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {inventoryUsage?.length ||
                                                        0}
                                                </p>
                                            </div>
                                            <Package className="h-8 w-8 text-purple-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">
                                                    Low Stock Items
                                                </p>
                                                <p className="text-2xl font-bold text-red-600">
                                                    {getLowStockItems().length}
                                                </p>
                                            </div>
                                            <AlertTriangle className="h-8 w-8 text-red-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Top Used Items */}
                            {getTopUsedItems().length > 0 && (
                                <Card className="mb-6">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-blue-600" />
                                            Top Used Items
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {getTopUsedItems().map(
                                                (item, index) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <span className="text-sm font-bold text-blue-600">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {item.name}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {
                                                                        item.category
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    item.total_quantity_used
                                                                }{" "}
                                                                units
                                                            </p>
                                                            <p className="text-sm text-green-600">
                                                                {formatCurrency(
                                                                    item.total_value
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Low Stock Alert */}
                            {getLowStockItems().length > 0 && (
                                <Card className="mb-6 border-red-200 bg-red-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-red-800">
                                            <AlertTriangle className="h-5 w-5" />
                                            Low Stock Alert
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {getLowStockItems().map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between p-3 bg-white rounded border border-red-200"
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Current:{" "}
                                                            {item.current_stock}{" "}
                                                            | Minimum:{" "}
                                                            {
                                                                item.minimum_quantity
                                                            }
                                                        </p>
                                                    </div>
                                                    <Badge variant="destructive">
                                                        Low Stock
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Detailed Usage Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-blue-600" />
                                        Detailed Usage Report
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {inventoryUsage &&
                                    inventoryUsage.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-3 px-4">
                                                            Item Name
                                                        </th>
                                                        <th className="text-left py-3 px-4">
                                                            Category
                                                        </th>
                                                        <th className="text-right py-3 px-4">
                                                            Quantity Used
                                                        </th>
                                                        <th className="text-right py-3 px-4">
                                                            Current Stock
                                                        </th>
                                                        <th className="text-right py-3 px-4">
                                                            Total Value
                                                        </th>
                                                        <th className="text-right py-3 px-4">
                                                            Treatments
                                                        </th>
                                                        <th className="text-center py-3 px-4">
                                                            Status
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inventoryUsage.map(
                                                        (item) => (
                                                            <tr
                                                                key={item.id}
                                                                className="border-b hover:bg-gray-50"
                                                            >
                                                                <td className="py-3 px-4">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            ₱
                                                                            {parseFloat(
                                                                                item.unit_price
                                                                            ).toLocaleString(
                                                                                "en-PH",
                                                                                {
                                                                                    minimumFractionDigits: 2,
                                                                                }
                                                                            )}{" "}
                                                                            per
                                                                            unit
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-4">
                                                                    <Badge variant="outline">
                                                                        {
                                                                            item.category
                                                                        }
                                                                    </Badge>
                                                                </td>
                                                                <td className="py-3 px-4 text-right font-medium">
                                                                    {
                                                                        item.total_quantity_used
                                                                    }
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    {
                                                                        item.current_stock
                                                                    }
                                                                </td>
                                                                <td className="py-3 px-4 text-right font-medium text-green-600">
                                                                    {formatCurrency(
                                                                        item.total_value
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-4 text-right">
                                                                    {
                                                                        item.treatments_count
                                                                    }
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    {item.current_stock <=
                                                                    item.minimum_quantity ? (
                                                                        <Badge variant="destructive">
                                                                            Low
                                                                            Stock
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="secondary">
                                                                            In
                                                                            Stock
                                                                        </Badge>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                            <p className="text-lg font-medium text-gray-900 mb-2">
                                                No inventory usage found
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Try adjusting your date range or
                                                filters to see inventory usage
                                                data.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
