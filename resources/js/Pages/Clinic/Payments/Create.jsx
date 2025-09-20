import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Badge } from "@/Components/ui/badge";
import {
    DollarSign,
    ArrowLeft,
    User,
    Stethoscope,
    Calendar,
    CreditCard,
    Banknote,
    ShieldCheck,
    HelpCircle,
    Receipt,
    Building,
    Phone,
    Mail,
    MapPin,
    CheckCircle2,
    AlertCircle,
    Save,
    X,
    TrendingUp,
    Clock,
    FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

export default function Create({ auth, patients, treatments }) {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: "",
        treatment_id: "",
        amount: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "",
        status: "completed",
        reference_number: "",
        notes: "",
        category: "",
        currency: "PHP",
        gcash_reference: "",
    });

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    // Handle URL parameters for pre-filling data
    useEffect(() => {
        const treatmentId = urlParams.get("treatment_id");
        const patientId = urlParams.get("patient_id");
        const amount = urlParams.get("amount");

        if (treatmentId) {
            setData("treatment_id", treatmentId);
            const treatment = treatments.find(
                (t) => t.id.toString() === treatmentId
            );
            if (treatment) {
                setSelectedTreatment(treatment);
            }
        }

        if (patientId) {
            setData("patient_id", patientId);
            const patient = patients.find((p) => p.id.toString() === patientId);
            if (patient) {
                setSelectedPatient(patient);
            }
        }

        if (amount) {
            setData("amount", amount);
        }

        // Auto-generate reference number if not provided
        if (!data.reference_number) {
            const timestamp = new Date()
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            const random = Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, "0");
            setData("reference_number", `PAY-${timestamp}-${random}`);
        }
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const handlePatientChange = (patientId) => {
        setData("patient_id", patientId);
        const patient = patients.find((p) => p.id.toString() === patientId);
        setSelectedPatient(patient);

        // Auto-generate reference number if not provided
        if (!data.reference_number) {
            const timestamp = new Date()
                .toISOString()
                .slice(0, 10)
                .replace(/-/g, "");
            const random = Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, "0");
            setData("reference_number", `PAY-${timestamp}-${random}`);
        }
    };

    const handleTreatmentChange = (treatmentId) => {
        setData("treatment_id", treatmentId);
        const treatment = treatments.find(
            (t) => t.id.toString() === treatmentId
        );
        setSelectedTreatment(treatment);

        // Auto-fill amount if treatment has cost
        if (treatment && treatment.cost && !data.amount) {
            setData("amount", treatment.cost.toString());
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("clinic.payments.store", { clinic: auth.clinic?.id }));
    };

    const paymentMethods = [
        {
            value: "cash",
            label: "Cash",
            icon: Banknote,
            color: "text-green-500",
        },
        {
            value: "credit_card",
            label: "Credit Card",
            icon: CreditCard,
            color: "text-blue-500",
        },
        {
            value: "debit_card",
            label: "Debit Card",
            icon: CreditCard,
            color: "text-blue-500",
        },
        {
            value: "insurance",
            label: "Insurance",
            icon: ShieldCheck,
            color: "text-purple-500",
        },
        {
            value: "gcash",
            label: "GCash",
            icon: HelpCircle,
            color: "text-blue-400",
        },
        {
            value: "bank_transfer",
            label: "Bank Transfer",
            icon: Building,
            color: "text-indigo-500",
        },
        {
            value: "check",
            label: "Check",
            icon: FileText,
            color: "text-orange-500",
        },
        {
            value: "other",
            label: "Other",
            icon: HelpCircle,
            color: "text-gray-400",
        },
    ];

    const categories = [
        { value: "consultation", label: "Consultation" },
        { value: "treatment", label: "Treatment" },
        { value: "medication", label: "Medication" },
        { value: "laboratory", label: "Laboratory" },
        { value: "imaging", label: "Imaging" },
        { value: "surgery", label: "Surgery" },
        { value: "emergency", label: "Emergency" },
        { value: "other", label: "Other" },
    ];

    const statuses = [
        {
            value: "completed",
            label: "Completed",
            color: "bg-green-100 text-green-700",
        },
        {
            value: "pending",
            label: "Pending",
            color: "bg-yellow-100 text-yellow-700",
        },
        { value: "failed", label: "Failed", color: "bg-red-100 text-red-700" },
        {
            value: "refunded",
            label: "Refunded",
            color: "bg-gray-100 text-gray-700",
        },
        {
            value: "cancelled",
            label: "Cancelled",
            color: "bg-red-100 text-red-700",
        },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Create Payment" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-6 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <DollarSign className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Create Payment
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Add a new payment record to the system
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => window.history.back()}
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-8 mt-8 pb-16">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* Main Form */}
                        <div className="xl:col-span-3 space-y-8">
                            {/* Payment Details Card */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Receipt className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Payment Details
                                            </CardTitle>
                                            <p className="text-base text-gray-600">
                                                Essential payment information
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label
                                                htmlFor="patient_id"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Patient *
                                            </Label>
                                            <Select
                                                value={data.patient_id}
                                                onValueChange={
                                                    handlePatientChange
                                                }
                                            >
                                                <SelectTrigger className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue placeholder="Select patient" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {patients.map((patient) => (
                                                        <SelectItem
                                                            key={patient.id}
                                                            value={patient.id.toString()}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-gray-400" />
                                                                {patient.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.patient_id && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.patient_id}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="treatment_id"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Treatment
                                            </Label>
                                            <Select
                                                value={data.treatment_id}
                                                onValueChange={
                                                    handleTreatmentChange
                                                }
                                            >
                                                <SelectTrigger className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue placeholder="Select treatment (optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {treatments.map(
                                                        (treatment) => (
                                                            <SelectItem
                                                                key={
                                                                    treatment.id
                                                                }
                                                                value={treatment.id.toString()}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Stethoscope className="h-4 w-4 text-gray-400" />
                                                                    {
                                                                        treatment.name
                                                                    }
                                                                    {treatment.cost && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="ml-auto"
                                                                        >
                                                                            {formatCurrency(
                                                                                treatment.cost
                                                                            )}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.treatment_id && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.treatment_id}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="amount"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Amount *
                                            </Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                    ₱
                                                </span>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.amount}
                                                    onChange={(e) =>
                                                        setData(
                                                            "amount",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-14 pl-8 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                            {errors.amount && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.amount}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="payment_date"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Payment Date *
                                            </Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <Input
                                                    id="payment_date"
                                                    type="date"
                                                    value={data.payment_date}
                                                    onChange={(e) =>
                                                        setData(
                                                            "payment_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="h-14 pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                    required
                                                />
                                            </div>
                                            {errors.payment_date && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.payment_date}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label
                                                htmlFor="category"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Category
                                            </Label>
                                            <Select
                                                value={data.category}
                                                onValueChange={(value) =>
                                                    setData("category", value)
                                                }
                                            >
                                                <SelectTrigger className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
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
                                            {errors.category && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.category}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="reference_number"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Reference Number
                                            </Label>
                                            <Input
                                                id="reference_number"
                                                type="text"
                                                value={data.reference_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "reference_number",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                placeholder="Auto-generated if empty"
                                            />
                                            {errors.reference_number && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.reference_number}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Method & Status Card */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CreditCard className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Payment Method & Status
                                            </CardTitle>
                                            <p className="text-base text-gray-600">
                                                How and when the payment was
                                                made
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label
                                                htmlFor="payment_method"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Payment Method *
                                            </Label>
                                            <Select
                                                value={data.payment_method}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "payment_method",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue placeholder="Select payment method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {paymentMethods.map(
                                                        (method) => {
                                                            const IconComponent =
                                                                method.icon;
                                                            return (
                                                                <SelectItem
                                                                    key={
                                                                        method.value
                                                                    }
                                                                    value={
                                                                        method.value
                                                                    }
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <IconComponent
                                                                            className={`h-4 w-4 ${method.color}`}
                                                                        />
                                                                        {
                                                                            method.label
                                                                        }
                                                                    </div>
                                                                </SelectItem>
                                                            );
                                                        }
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.payment_method && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.payment_method}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <Label
                                                htmlFor="status"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                Payment Status *
                                            </Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(value) =>
                                                    setData("status", value)
                                                }
                                            >
                                                <SelectTrigger className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statuses.map((status) => (
                                                        <SelectItem
                                                            key={status.value}
                                                            value={status.value}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Badge
                                                                    className={
                                                                        status.color
                                                                    }
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.status && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.status}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {data.payment_method === "gcash" && (
                                        <div>
                                            <Label
                                                htmlFor="gcash_reference"
                                                className="text-base font-medium text-gray-700 mb-3 block"
                                            >
                                                GCash Reference Number
                                            </Label>
                                            <Input
                                                id="gcash_reference"
                                                type="text"
                                                value={data.gcash_reference}
                                                onChange={(e) =>
                                                    setData(
                                                        "gcash_reference",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                                placeholder="Enter GCash reference number"
                                            />
                                            {errors.gcash_reference && (
                                                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.gcash_reference}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
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
                                                setData("notes", e.target.value)
                                            }
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                                            rows={4}
                                            placeholder="Add any additional notes or comments about this payment..."
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

                        {/* Sidebar */}
                        <div className="xl:col-span-1 space-y-6">
                            {/* Payment Summary */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <TrendingUp className="h-5 w-5 text-green-600" />
                                        </div>
                                        <CardTitle className="text-lg font-bold text-gray-900">
                                            Payment Summary
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">
                                            Patient:
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {selectedPatient?.name ||
                                                "Not selected"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">
                                            Treatment:
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {selectedTreatment?.name ||
                                                "Not selected"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">
                                            Amount:
                                        </span>
                                        <span className="font-semibold text-green-600 text-lg">
                                            {formatCurrency(data.amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">
                                            Method:
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {data.payment_method
                                                ? data.payment_method
                                                      .replace("_", " ")
                                                      .replace(/\b\w/g, (c) =>
                                                          c.toUpperCase()
                                                      )
                                                : "Not selected"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">
                                            Status:
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {data.status
                                                ? data.status
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  data.status.slice(1)
                                                : "Not selected"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">
                                            Date:
                                        </span>
                                        <span className="font-medium text-gray-900 text-sm">
                                            {data.payment_date
                                                ? new Date(
                                                      data.payment_date
                                                  ).toLocaleDateString()
                                                : "Not selected"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Tips */}
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <CardTitle className="text-lg font-bold text-gray-900">
                                            Quick Tips
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>
                                            Patient and amount are required
                                            fields
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>
                                            Reference number helps with tracking
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>
                                            Select appropriate payment status
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>
                                            Add notes for better record keeping
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.patient_id ||
                                        !data.amount
                                    }
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-medium text-base"
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    {processing
                                        ? "Creating..."
                                        : "Create Payment"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="w-full py-4 rounded-xl text-base"
                                >
                                    <X className="h-5 w-5 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
