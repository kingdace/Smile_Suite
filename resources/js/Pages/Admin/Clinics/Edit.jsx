import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    FileText,
    Calendar,
    Star,
    BadgeCheck,
} from "lucide-react";
import axios from "axios";

const TIMEZONES = [
    { value: "Manila_GMT+8", label: "Manila (GMT+8)" },
    { value: "Cebu_GMT+8", label: "Cebu (GMT+8)" },
    { value: "Davao_GMT+8", label: "Davao (GMT+8)" },
    { value: "QuezonCity_GMT+8", label: "Quezon City (GMT+8)" },
    { value: "Makati_GMT+8", label: "Makati (GMT+8)" },
    { value: "Pasig_GMT+8", label: "Pasig (GMT+8)" },
    { value: "Taguig_GMT+8", label: "Taguig (GMT+8)" },
    { value: "Pasay_GMT+8", label: "Pasay (GMT+8)" },
    { value: "Mandaluyong_GMT+8", label: "Mandaluyong (GMT+8)" },
    { value: "SanJuan_GMT+8", label: "San Juan (GMT+8)" },
];

const SUBSCRIPTION_PLANS = [
    {
        value: "basic",
        label: "Basic Plan",
        description: "Perfect for small dental clinics with 1-2 dentists",
        features: [
            "Up to 2 dentist accounts",
            "Basic patient management",
            "Appointment scheduling",
            "Basic reporting",
            "Email support",
        ],
        price: "₱2,999/month",
    },
    {
        value: "premium",
        label: "Premium Plan",
        description: "Ideal for growing clinics with 3-5 dentists",
        features: [
            "Up to 5 dentist accounts",
            "Advanced patient management",
            "Treatment planning",
            "Inventory management",
            "Financial reporting",
            "Priority support",
        ],
        price: "₱4,999/month",
    },
    {
        value: "enterprise",
        label: "Enterprise Plan",
        description: "For established clinics with 6+ dentists",
        features: [
            "Unlimited dentist accounts",
            "Multi-branch management",
            "Advanced analytics",
            "Custom reporting",
            "API access",
            "24/7 priority support",
            "Training sessions",
        ],
        price: "₱7,999/month",
    },
];

const DAYS_OF_WEEK = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
];

export default function Edit({ auth, clinic }) {
    const { data, setData, put, processing, errors } = useForm({
        name: clinic.name || "",
        address: clinic.address || "",
        street_address: clinic.street_address || "",
        contact_number: clinic.contact_number || "",
        email: clinic.email || "",
        license_number: clinic.license_number || "",
        description: clinic.description || "",
        timezone: clinic.timezone || "",
        region_code: clinic.region_code || null,
        province_code: clinic.province_code || null,
        city_municipality_code: clinic.city_municipality_code || null,
        barangay_code: clinic.barangay_code || null,
        postal_code: clinic.postal_code || "",
        address_details: clinic.address_details || "",
        is_active: clinic.is_active ?? true,
        subscription_status: clinic.subscription_status || "trial",
        subscription_plan: clinic.subscription_plan || "basic",
        subscription_start_date:
            clinic.subscription_start_date ||
            new Date().toISOString().split("T")[0],
        subscription_end_date:
            clinic.subscription_end_date ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
    });

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [citiesMunicipalities, setCitiesMunicipalities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState(
        clinic.region_code || ""
    );
    const [selectedProvince, setSelectedProvince] = useState(
        clinic.province_code || ""
    );
    const [selectedCityMunicipality, setSelectedCityMunicipality] = useState(
        clinic.city_municipality_code || ""
    );
    const [selectedBarangay, setSelectedBarangay] = useState(
        clinic.barangay_code || ""
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route("admin.clinics.update", clinic.id), {
            ...data,
        });
    };

    const selectedPlan = SUBSCRIPTION_PLANS.find(
        (plan) => plan.value === data.subscription_plan
    );

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Clinic
                </h2>
            }
            hideSidebar={true}
        >
            <Head title="Edit Clinic" />

            <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white/95 rounded-2xl border border-blue-100 shadow-sm">
                        <CardHeader className="mb-6 pb-4 border-b border-blue-50">
                            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-blue-500" />
                                Edit Clinic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Building2 className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Basic Information
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-gray-700 font-medium"
                                            >
                                                Clinic Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.name && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-gray-700 font-medium flex items-center gap-1"
                                            >
                                                <Mail className="w-4 h-4 text-blue-400" />
                                                Email
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
                                                required
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.email && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="contact_number"
                                                className="text-gray-700 font-medium flex items-center gap-1"
                                            >
                                                <Phone className="w-4 h-4 text-blue-400" />
                                                Contact Number
                                            </Label>
                                            <Input
                                                id="contact_number"
                                                value={data.contact_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_number",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.contact_number && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.contact_number}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="license_number"
                                                className="text-gray-700 font-medium flex items-center gap-1"
                                            >
                                                <FileText className="w-4 h-4 text-blue-400" />
                                                License Number
                                            </Label>
                                            <Input
                                                id="license_number"
                                                value={data.license_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "license_number",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.license_number && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.license_number}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label
                                                htmlFor="description"
                                                className="text-gray-700 font-medium"
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
                                                placeholder="Enter clinic description"
                                                className="h-24 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.description && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Address Information
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="street_address"
                                                className="text-gray-700 font-medium"
                                            >
                                                Street Address
                                            </Label>
                                            <Input
                                                id="street_address"
                                                value={data.street_address}
                                                onChange={(e) =>
                                                    setData(
                                                        "street_address",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter street address"
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.street_address && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.street_address}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="postal_code"
                                                className="text-gray-700 font-medium"
                                            >
                                                Postal Code
                                            </Label>
                                            <Input
                                                id="postal_code"
                                                value={data.postal_code}
                                                onChange={(e) =>
                                                    setData(
                                                        "postal_code",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter postal code"
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.postal_code && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.postal_code}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label
                                                htmlFor="address_details"
                                                className="text-gray-700 font-medium"
                                            >
                                                Additional Address Details
                                            </Label>
                                            <Textarea
                                                id="address_details"
                                                value={data.address_details}
                                                onChange={(e) =>
                                                    setData(
                                                        "address_details",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter any additional address details (e.g., landmarks, directions)"
                                                className="h-24 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.address_details && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.address_details}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Star className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Subscription Details
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="subscription_plan"
                                                className="text-gray-700 font-medium"
                                            >
                                                Subscription Plan
                                            </Label>
                                            <Select
                                                value={data.subscription_plan}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "subscription_plan",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select a plan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SUBSCRIPTION_PLANS.map(
                                                        (plan) => (
                                                            <SelectItem
                                                                key={plan.value}
                                                                value={
                                                                    plan.value
                                                                }
                                                            >
                                                                {plan.label}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {selectedPlan && (
                                                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">
                                                        {
                                                            selectedPlan.description
                                                        }
                                                    </p>
                                                    <p className="font-semibold text-blue-700 mt-1">
                                                        {selectedPlan.price}
                                                    </p>
                                                </div>
                                            )}
                                            {errors.subscription_plan && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.subscription_plan}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="subscription_status"
                                                className="text-gray-700 font-medium"
                                            >
                                                Subscription Status
                                            </Label>
                                            <Select
                                                value={data.subscription_status}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "subscription_status",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="trial">
                                                        Trial (14 days)
                                                    </SelectItem>
                                                    <SelectItem value="active">
                                                        Active
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        Inactive
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.subscription_status && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.subscription_status}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="subscription_start_date"
                                                className="text-gray-700 font-medium flex items-center gap-1"
                                            >
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                Start Date
                                            </Label>
                                            <Input
                                                id="subscription_start_date"
                                                type="date"
                                                value={
                                                    data.subscription_start_date
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "subscription_start_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.subscription_start_date && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors.subscription_start_date
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="subscription_end_date"
                                                className="text-gray-700 font-medium flex items-center gap-1"
                                            >
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                End Date
                                            </Label>
                                            <Input
                                                id="subscription_end_date"
                                                type="date"
                                                value={
                                                    data.subscription_end_date
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "subscription_end_date",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            {errors.subscription_end_date && (
                                                <div className="text-red-500 text-sm">
                                                    {
                                                        errors.subscription_end_date
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 md:col-span-2">
                                            <Switch
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) =>
                                                    setData(
                                                        "is_active",
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor="is_active"
                                                className="text-gray-700 font-medium flex items-center gap-1"
                                            >
                                                <BadgeCheck className="w-4 h-4 text-blue-400" />
                                                Active Status
                                            </Label>
                                            {errors.is_active && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.is_active}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-blue-100">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => history.back()}
                                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Update Clinic"}
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
