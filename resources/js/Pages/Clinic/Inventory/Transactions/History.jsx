import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    ArrowLeft,
    Package,
    TrendingUp,
    TrendingDown,
    Minus,
    Plus,
    Calendar,
    User,
    FileText,
    DollarSign,
} from "lucide-react";

export default function History({ auth, clinic, inventory, transactions }) {
    const formatCurrency = (amount) => {
        if (!amount) return "N/A";
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case "in":
                return <Plus className="h-4 w-4 text-green-600" />;
            case "out":
                return <Minus className="h-4 w-4 text-red-600" />;
            case "adjustment":
                return <TrendingUp className="h-4 w-4 text-blue-600" />;
            case "transfer":
                return <ArrowLeft className="h-4 w-4 text-purple-600" />;
            case "damaged":
                return <Minus className="h-4 w-4 text-orange-600" />;
            case "expired":
                return <Minus className="h-4 w-4 text-gray-600" />;
            default:
                return <FileText className="h-4 w-4 text-gray-600" />;
        }
    };

    const getTransactionColor = (type) => {
        switch (type) {
            case "in":
                return "bg-green-50 border-green-200";
            case "out":
                return "bg-red-50 border-red-200";
            case "adjustment":
                return "bg-blue-50 border-blue-200";
            case "transfer":
                return "bg-purple-50 border-purple-200";
            case "damaged":
                return "bg-orange-50 border-orange-200";
            case "expired":
                return "bg-gray-50 border-gray-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const getTransactionLabel = (type) => {
        switch (type) {
            case "in":
                return "Stock In";
            case "out":
                return "Stock Out";
            case "adjustment":
                return "Adjustment";
            case "transfer":
                return "Transfer";
            case "damaged":
                return "Damaged";
            case "expired":
                return "Expired";
            default:
                return type;
        }
    };

    const getQuantityChange = (transaction) => {
        const change = transaction.quantity_after - transaction.quantity_before;
        return change > 0 ? `+${change}` : `${change}`;
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Transaction History - ${inventory.name}`} />

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
                                    <BarChart3 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Transaction History
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Track all stock movements for {inventory.name}
                                    </p>
                                </div>
                            </div>
                            <Link href={route("clinic.inventory.show", [clinic.id, inventory.id])}>
                                <Button 
                                    variant="outline" 
                                    className="gap-2 text-sm px-4 py-2 rounded-xl transition-all duration-300 border backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Item
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt--10 pb-12">
                    {/* Item Summary */}
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden border border-blue-100/30 mb-6">
                        <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Package className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        {inventory.name}
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">
                                        Current inventory status and details
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Current Stock</p>
                                    <p className="text-3xl font-bold text-blue-600">{inventory.quantity}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Unit Price</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(inventory.unit_price)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(inventory.quantity * parseFloat(inventory.unit_price))}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {inventory.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transaction History */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions.data &&
                            transactions.data.length > 0 ? (
                                <div className="space-y-4">
                                    {transactions.data.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className={`p-4 rounded-lg border ${getTransactionColor(
                                                transaction.type
                                            )}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {getTransactionIcon(
                                                        transaction.type
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline">
                                                                {getTransactionLabel(
                                                                    transaction.type
                                                                )}
                                                            </Badge>
                                                            <span className="font-medium">
                                                                {
                                                                    transaction.quantity
                                                                }{" "}
                                                                units
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                (
                                                                {getQuantityChange(
                                                                    transaction
                                                                )}
                                                                )
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(
                                                                    transaction.transaction_date
                                                                )}
                                                            </span>
                                                            {transaction.user && (
                                                                <span className="flex items-center gap-1 ml-4">
                                                                    <User className="h-3 w-3" />
                                                                    {
                                                                        transaction
                                                                            .user
                                                                            .name
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                        {transaction.notes && (
                                                            <p className="text-sm text-gray-700 mt-2">
                                                                {
                                                                    transaction.notes
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-600">
                                                        Stock:{" "}
                                                        {
                                                            transaction.quantity_before
                                                        }{" "}
                                                        →{" "}
                                                        {
                                                            transaction.quantity_after
                                                        }
                                                    </div>
                                                    {transaction.total_cost && (
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {formatCurrency(
                                                                transaction.total_cost
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium text-gray-900">
                                        No transactions found
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        This item has no transaction history
                                        yet.
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {transactions.links &&
                                transactions.links.length > 3 && (
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="text-sm text-gray-700">
                                            Showing {transactions.from} to{" "}
                                            {transactions.to} of{" "}
                                            {transactions.total} results
                                        </div>
                                        <div className="flex gap-2">
                                            {transactions.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-3 py-2 text-sm rounded-md ${
                                                            link.active
                                                                ? "bg-blue-500 text-white"
                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
