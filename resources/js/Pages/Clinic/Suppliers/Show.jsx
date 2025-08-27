import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
    Building,
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    CreditCard,
    Package,
    ArrowLeft,
    Edit,
    Eye,
    Calendar,
    DollarSign,
} from "lucide-react";

export default function Show({ auth, clinic, supplier }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const getTotalItemsValue = () => {
        if (!supplier.inventory || supplier.inventory.length === 0) return 0;
        return supplier.inventory.reduce((total, item) => {
            return total + parseFloat(item.unit_price) * item.quantity;
        }, 0);
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Supplier Details" />

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
                                    <Building className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Supplier Details
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        {supplier.name} - Complete supplier
                                        information
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("clinic.suppliers.edit", [
                                        clinic.id,
                                        supplier.id,
                                    ])}
                                >
                                    <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-xl transition-all duration-300">
                                        <Edit className="h-4 w-4" />
                                        Edit Supplier
                                    </Button>
                                </Link>
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
                            {/* Basic Information */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <Building className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Basic Information
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Essential supplier details
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <Building className="h-4 w-4" />
                                                    Supplier Name
                                                </dt>
                                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                                    {supplier.name}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    Contact Person
                                                </dt>
                                                <dd className="mt-1 text-gray-900">
                                                    {supplier.contact_person ||
                                                        "Not specified"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    Email Address
                                                </dt>
                                                <dd className="mt-1 text-gray-900">
                                                    {supplier.email ? (
                                                        <a
                                                            href={`mailto:${supplier.email}`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            {supplier.email}
                                                        </a>
                                                    ) : (
                                                        "Not specified"
                                                    )}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    Phone Number
                                                </dt>
                                                <dd className="mt-1 text-gray-900">
                                                    {supplier.phone ? (
                                                        <a
                                                            href={`tel:${supplier.phone}`}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            {supplier.phone}
                                                        </a>
                                                    ) : (
                                                        "Not specified"
                                                    )}
                                                </dd>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Tax ID
                                                </dt>
                                                <dd className="mt-1 text-gray-900">
                                                    {supplier.tax_id ||
                                                        "Not specified"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    Payment Terms
                                                </dt>
                                                <dd className="mt-1 text-gray-900">
                                                    {supplier.payment_terms ||
                                                        "Not specified"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    Address
                                                </dt>
                                                <dd className="mt-1 text-gray-900">
                                                    {supplier.address ||
                                                        "Not specified"}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Created
                                                </dt>
                                                <dd className="mt-1 text-gray-900">
                                                    {new Date(
                                                        supplier.created_at
                                                    ).toLocaleDateString()}
                                                </dd>
                                            </div>
                                        </div>
                                    </div>

                                    {supplier.notes && (
                                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <dt className="text-sm font-medium text-gray-500 mb-2">
                                                Notes
                                            </dt>
                                            <dd className="text-gray-900">
                                                {supplier.notes}
                                            </dd>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Inventory Items */}
                            {supplier.inventory &&
                                supplier.inventory.length > 0 && (
                                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                        <CardHeader className="bg-gradient-to-r from-gray-50 via-green-50/30 to-emerald-50/20 border-b border-gray-200/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl font-bold text-gray-900">
                                                        Inventory Items
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600">
                                                        Items supplied by this
                                                        supplier
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-gray-50">
                                                        <TableHead className="font-semibold text-gray-900">
                                                            Item Name
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-gray-900">
                                                            Category
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-gray-900">
                                                            Quantity
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-gray-900">
                                                            Unit Price
                                                        </TableHead>
                                                        <TableHead className="font-semibold text-gray-900">
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {supplier.inventory.map(
                                                        (item) => (
                                                            <TableRow
                                                                key={item.id}
                                                                className="hover:bg-gray-50/50"
                                                            >
                                                                <TableCell>
                                                                    <div className="font-semibold text-gray-900">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </div>
                                                                    {item.sku && (
                                                                        <div className="text-sm text-gray-500">
                                                                            SKU:{" "}
                                                                            {
                                                                                item.sku
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                                                    >
                                                                        {
                                                                            item.category
                                                                        }
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span
                                                                        className={`font-medium ${
                                                                            item.quantity <=
                                                                            item.minimum_quantity
                                                                                ? "text-red-600"
                                                                                : "text-gray-900"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                    {item.quantity <=
                                                                        item.minimum_quantity && (
                                                                        <div className="text-xs text-red-500">
                                                                            Low
                                                                            stock
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="font-semibold text-gray-900">
                                                                        {formatCurrency(
                                                                            item.unit_price
                                                                        )}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Link
                                                                        href={route(
                                                                            "clinic.inventory.show",
                                                                            [
                                                                                clinic.id,
                                                                                item.id,
                                                                            ]
                                                                        )}
                                                                    >
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="h-8 px-3"
                                                                        >
                                                                            <Eye className="h-3 w-3 mr-1" />
                                                                            View
                                                                        </Button>
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Supplier Stats */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30 sticky top-6">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-purple-50/30 to-violet-50/20 border-b border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <DollarSign className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Supplier Stats
                                            </CardTitle>
                                            <p className="text-sm text-gray-600">
                                                Key metrics and information
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Total Items:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {supplier.inventory
                                                    ? supplier.inventory.length
                                                    : 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Total Value:
                                            </span>
                                            <span className="font-semibold text-green-600">
                                                {formatCurrency(
                                                    getTotalItemsValue()
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Low Stock Items:
                                            </span>
                                            <span className="font-medium text-red-600">
                                                {supplier.inventory
                                                    ? supplier.inventory.filter(
                                                          (item) =>
                                                              item.quantity <=
                                                              item.minimum_quantity
                                                      ).length
                                                    : 0}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">
                                                Last Updated:
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {new Date(
                                                    supplier.updated_at
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                <CardHeader className="bg-gradient-to-r from-gray-50 via-orange-50/30 to-amber-50/20 border-b border-gray-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                            <Edit className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                Quick Actions
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <Link
                                            href={route(
                                                "clinic.suppliers.edit",
                                                [clinic.id, supplier.id]
                                            )}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Supplier
                                            </Button>
                                        </Link>
                                        <Link
                                            href={route(
                                                "clinic.inventory.create",
                                                [clinic.id]
                                            )}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <Package className="h-4 w-4 mr-2" />
                                                Add Inventory Item
                                            </Button>
                                        </Link>
                                        <Link
                                            href={route(
                                                "clinic.purchase-orders.create",
                                                [clinic.id]
                                            )}
                                        >
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                <DollarSign className="h-4 w-4 mr-2" />
                                                Create Purchase Order
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
