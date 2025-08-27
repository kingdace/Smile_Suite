import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Building,
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    CreditCard,
    ArrowLeft,
    Save,
    X,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

export default function Create({ auth, clinic }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        tax_id: "",
        payment_terms: "",
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("clinic.suppliers.store", [clinic.id]));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Add Supplier" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-8 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                    <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/3 rounded-full -translate-y-10 -translate-x-10"></div>

                    <div className="relative px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/25 rounded-3xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <Building className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">
                                        Add New Supplier
                                    </h1>
                                    <p className="text-blue-100 text-base font-medium">
                                        Create a new supplier for your clinic
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="gap-2 text-base px-6 py-3 rounded-xl transition-all duration-300 border backdrop-blur-sm bg-white/20 border-white/30 text-white hover:bg-white/30"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-8 -mt--12 pb-16">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form Section */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Basic Information */}
                                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-indigo-50/20 border-b border-gray-200/50 px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                                <Building className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-gray-900">
                                                    Basic Information
                                                </CardTitle>
                                                <p className="text-base text-gray-600">
                                                    Essential supplier details
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <Label
                                                    htmlFor="name"
                                                    className="text-base font-medium text-gray-700 mb-3 block"
                                                >
                                                    Supplier Name *
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
                                                    className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    placeholder="Enter supplier name"
                                                    required
                                                />
                                                {errors.name && (
                                                    <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.name}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="contact_person"
                                                    className="text-base font-medium text-gray-700 mb-3 block"
                                                >
                                                    Contact Person
                                                </Label>
                                                <Input
                                                    id="contact_person"
                                                    type="text"
                                                    value={data.contact_person}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contact_person",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    placeholder="Primary contact person"
                                                />
                                                {errors.contact_person && (
                                                    <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.contact_person}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="email"
                                                    className="text-base font-medium text-gray-700 mb-3 block"
                                                >
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            "email",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    placeholder="supplier@example.com"
                                                />
                                                {errors.email && (
                                                    <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="phone"
                                                    className="text-base font-medium text-gray-700 mb-3 block"
                                                >
                                                    Phone Number
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    placeholder="+1 (555) 123-4567"
                                                />
                                                {errors.phone && (
                                                    <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Business Information */}
                                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-green-50/30 to-emerald-50/20 border-b border-gray-200/50 px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-bold text-gray-900">
                                                    Business Information
                                                </CardTitle>
                                                <p className="text-base text-gray-600">
                                                    Tax and payment details
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <Label
                                                    htmlFor="tax_id"
                                                    className="text-base font-medium text-gray-700 mb-3 block"
                                                >
                                                    Tax ID / Business Number
                                                </Label>
                                                <Input
                                                    id="tax_id"
                                                    type="text"
                                                    value={data.tax_id}
                                                    onChange={(e) =>
                                                        setData(
                                                            "tax_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    placeholder="Tax identification number"
                                                />
                                                {errors.tax_id && (
                                                    <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.tax_id}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="payment_terms"
                                                    className="text-base font-medium text-gray-700 mb-3 block"
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
                                                    className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    placeholder="e.g., Net 30, COD"
                                                />
                                                {errors.payment_terms && (
                                                    <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                        <AlertCircle className="h-4 w-4" />
                                                        {errors.payment_terms}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <Label
                                                htmlFor="address"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Address
                                            </Label>
                                            <Textarea
                                                id="address"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        "address",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                rows={4}
                                                placeholder="Enter complete business address..."
                                            />
                                            {errors.address && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.address}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-8">
                                            <Label
                                                htmlFor="notes"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Additional Notes
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
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                rows={4}
                                                placeholder="Any additional information about this supplier..."
                                            />
                                            {errors.notes && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.notes}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Summary Sidebar */}
                            <div className="space-y-8">
                                {/* Form Summary */}
                                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30 sticky top-8">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-purple-50/30 to-violet-50/20 border-b border-gray-200/50 px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                <Save className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Create Supplier
                                                </CardTitle>
                                                <p className="text-sm text-gray-600">
                                                    Review and submit
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">
                                                    Supplier Name:
                                                </span>
                                                <span className="font-medium text-gray-900 text-sm">
                                                    {data.name ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">
                                                    Contact Person:
                                                </span>
                                                <span className="font-medium text-gray-900 text-sm">
                                                    {data.contact_person ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">
                                                    Email:
                                                </span>
                                                <span className="font-medium text-gray-900 text-sm">
                                                    {data.email ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 text-sm">
                                                    Phone:
                                                </span>
                                                <span className="font-medium text-gray-900 text-sm">
                                                    {data.phone ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing || !data.name
                                                }
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium text-base"
                                            >
                                                {processing ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        Creating Supplier...
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <Save className="h-5 w-5" />
                                                        Create Supplier
                                                    </div>
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    window.history.back()
                                                }
                                                className="w-full py-4 rounded-xl text-base"
                                            >
                                                <X className="h-5 w-5 mr-3" />
                                                Cancel
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Tips */}
                                <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                                    <CardHeader className="bg-gradient-to-r from-gray-50 via-yellow-50/30 to-amber-50/20 border-b border-gray-200/50 px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                                                <AlertCircle className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-gray-900">
                                                    Quick Tips
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4 text-sm text-gray-600">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Supplier name is required
                                                    for creation
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Add contact person for
                                                    better communication
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Include tax ID for proper
                                                    documentation
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>
                                                    Set payment terms for order
                                                    management
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
