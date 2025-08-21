import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import moment from "moment";
import { UserPlus } from "lucide-react";

export default function Create({
    auth,
    regions,
    categories,
    bloodTypes,
    lastVisitOptions,
}) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        gender: "",
        street_address: "",
        region_code: "",
        province_code: "",
        city_municipality_code: "",
        barangay_code: "",
        postal_code: "",
        address_details: "",
        medical_history: "",
        allergies: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        emergency_contact_relationship: "",
        insurance_provider: "",
        insurance_policy_number: "",
        blood_type: "unknown",
        occupation: "",
        marital_status: "",
        last_dental_visit: "No previous visit",
        notes: "",
        category: "none",
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for required fields
        const requiredFields = {
            first_name: data.first_name,
            last_name: data.last_name,
            phone_number: data.phone_number,
            date_of_birth: data.date_of_birth,
            gender: data.gender,
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value || value.trim() === "")
            .map(([key]) => key);

        if (missingFields.length > 0) {
            console.error("Missing required fields:", missingFields);
            alert(
                `Please fill in the following required fields: ${missingFields.join(
                    ", "
                )}`
            );
            return;
        }

        const formattedData = {
            ...data,
            date_of_birth: data.date_of_birth
                ? moment(data.date_of_birth).format("YYYY-MM-DD")
                : null,
        };

        post(
            route("clinic.patients.store", { clinic: auth.clinic_id }),
            formattedData,
            {
                onSuccess: () => {
                    window.location.href = route("clinic.patients.index", {
                        clinic: auth.clinic_id,
                    });
                },
                onError: (errors) => {
                    console.error("Form submission errors:", errors);
                    alert(
                        "There was an error creating the patient. Please check the console for details."
                    );
                },
            }
        );
    };

    const fetchProvinces = async (regionCode) => {
        try {
            const response = await axios.get(
                route("psgc.provinces", { regionId: regionCode })
            );
            setProvinces(response.data);
            setData("province_code", "");
            setData("city_municipality_code", "");
            setData("barangay_code", "");
            setCities([]);
            setBarangays([]);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const fetchCities = async (provinceCode) => {
        try {
            const [citiesResponse, municipalitiesResponse] = await Promise.all([
                axios.get(route("psgc.cities", { provinceId: provinceCode })),
                axios.get(
                    route("psgc.municipalities", { provinceId: provinceCode })
                ),
            ]);

            const cities = (citiesResponse.data || []).map((city) => ({
                code: city.code,
                name: city.name,
            }));

            const municipalities = (municipalitiesResponse.data || []).map(
                (municipality) => ({
                    code: municipality.code,
                    name: municipality.name,
                })
            );

            const combined = [...cities, ...municipalities];
            combined.sort((a, b) => a.name.localeCompare(b.name));
            setCities(combined);
            setData("city_municipality_code", "");
            setData("barangay_code", "");
            setBarangays([]);
        } catch (error) {
            console.error("Error fetching cities/municipalities:", error);
            setCities([]);
        }
    };

    const fetchBarangays = async (cityCode) => {
        try {
            const response = await axios.get(
                route("psgc.barangays", { cityId: cityCode })
            );
            setBarangays(response.data);
            setData("barangay_code", "");
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Add New Patient" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-8 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                        <UserPlus className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Add New Patient
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Create a new patient record for your
                                        clinic
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => window.history.back()}
                                    className="gap-2 bg-white/25 text-white border-white/40 hover:bg-white/35 backdrop-blur-sm text-sm px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-12">
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                    <UserPlus className="h-4 w-4 text-white" />
                                </div>
                                Patient Information
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Fill in the patient's personal and contact
                                information below
                            </p>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                1
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Personal Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Basic personal details of the
                                                patient
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="first_name"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                First Name *
                                            </Label>
                                            <Input
                                                id="first_name"
                                                value={data.first_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "first_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter first name"
                                                required
                                            />
                                            {errors.first_name && (
                                                <Alert
                                                    variant="destructive"
                                                    className="mt-2"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {errors.first_name}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="last_name"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Last Name *
                                            </Label>
                                            <Input
                                                id="last_name"
                                                value={data.last_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "last_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter last name"
                                                required
                                            />
                                            {errors.last_name && (
                                                <Alert
                                                    variant="destructive"
                                                    className="mt-2"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {errors.last_name}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-sm font-medium text-gray-700"
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
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && (
                                                <Alert
                                                    variant="destructive"
                                                    className="mt-2"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {errors.email}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="phone_number"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id="phone_number"
                                                value={data.phone_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "phone_number",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter phone number"
                                                required
                                            />
                                            {errors.phone_number && (
                                                <Alert
                                                    variant="destructive"
                                                    className="mt-2"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {errors.phone_number}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="date_of_birth"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Date of Birth *
                                            </Label>
                                            <Input
                                                id="date_of_birth"
                                                type="date"
                                                value={data.date_of_birth}
                                                onChange={(e) =>
                                                    setData(
                                                        "date_of_birth",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                required
                                            />
                                            {errors.date_of_birth && (
                                                <Alert
                                                    variant="destructive"
                                                    className="mt-2"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {errors.date_of_birth}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="gender"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Gender *
                                            </Label>
                                            <Select
                                                value={data.gender}
                                                onValueChange={(value) =>
                                                    setData("gender", value)
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="male">
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                        Female
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Other
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.gender && (
                                                <Alert
                                                    variant="destructive"
                                                    className="mt-2"
                                                >
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        {errors.gender}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                2
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Additional Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Optional details for better
                                                patient care
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="marital_status"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Marital Status
                                            </Label>
                                            <Select
                                                value={
                                                    data.marital_status || ""
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        "marital_status",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select marital status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="single">
                                                        Single
                                                    </SelectItem>
                                                    <SelectItem value="married">
                                                        Married
                                                    </SelectItem>
                                                    <SelectItem value="divorced">
                                                        Divorced
                                                    </SelectItem>
                                                    <SelectItem value="widowed">
                                                        Widowed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="occupation"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Occupation
                                            </Label>
                                            <Input
                                                id="occupation"
                                                value={data.occupation || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "occupation",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter occupation"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="blood_type"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Blood Type
                                            </Label>
                                            <Select
                                                value={
                                                    data.blood_type === "" ||
                                                    !data.blood_type
                                                        ? "unknown"
                                                        : data.blood_type
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        "blood_type",
                                                        value === "unknown"
                                                            ? ""
                                                            : value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select blood type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        bloodTypes
                                                    ).map(([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="last_dental_visit"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Last Dental Visit
                                            </Label>
                                            <Select
                                                value={
                                                    data.last_dental_visit ||
                                                    "No previous visit"
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        "last_dental_visit",
                                                        value ===
                                                            "No previous visit"
                                                            ? ""
                                                            : value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select last dental visit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        lastVisitOptions
                                                    ).map(([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="category"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Patient Category
                                            </Label>
                                            <Select
                                                value={data.category || "none"}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "category",
                                                        value === "none"
                                                            ? ""
                                                            : value
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(
                                                        categories
                                                    ).map(([value, label]) => (
                                                        <SelectItem
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                3
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Address Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Complete address details using
                                                PSGC
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="street_address"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Street Address
                                            </Label>
                                            <Input
                                                id="street_address"
                                                value={
                                                    data.street_address || ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "street_address",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter street address"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="region_code"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Region *
                                            </Label>
                                            <Select
                                                value={data.region_code || ""}
                                                onValueChange={(value) => {
                                                    setData(
                                                        "region_code",
                                                        value
                                                    );
                                                    fetchProvinces(value);
                                                }}
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select Region" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {regions.map((region) => (
                                                        <SelectItem
                                                            key={region.code}
                                                            value={region.code}
                                                        >
                                                            {region.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="province_code"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Province *
                                            </Label>
                                            <Select
                                                value={data.province_code || ""}
                                                onValueChange={(value) => {
                                                    setData(
                                                        "province_code",
                                                        value
                                                    );
                                                    fetchCities(value);
                                                }}
                                                disabled={!data.region_code}
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select Province" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {provinces.map(
                                                        (province) => (
                                                            <SelectItem
                                                                key={
                                                                    province.code
                                                                }
                                                                value={
                                                                    province.code
                                                                }
                                                            >
                                                                {province.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="city_municipality_code"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                City/Municipality *
                                            </Label>
                                            <Select
                                                value={
                                                    data.city_municipality_code ||
                                                    ""
                                                }
                                                onValueChange={(value) => {
                                                    setData(
                                                        "city_municipality_code",
                                                        value
                                                    );
                                                    fetchBarangays(value);
                                                }}
                                                disabled={!data.province_code}
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select City/Municipality" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {cities.map((city) => (
                                                        <SelectItem
                                                            key={city.code}
                                                            value={city.code}
                                                        >
                                                            {city.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="barangay_code"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Barangay *
                                            </Label>
                                            <Select
                                                value={data.barangay_code || ""}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "barangay_code",
                                                        value
                                                    )
                                                }
                                                disabled={
                                                    !data.city_municipality_code
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select Barangay" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {barangays.map(
                                                        (barangay) => (
                                                            <SelectItem
                                                                key={
                                                                    barangay.code
                                                                }
                                                                value={
                                                                    barangay.code
                                                                }
                                                            >
                                                                {barangay.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="postal_code"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Postal Code
                                            </Label>
                                            <Input
                                                id="postal_code"
                                                value={data.postal_code || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "postal_code",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter postal code"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="address_details"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Additional Address Details
                                        </Label>
                                        <textarea
                                            id="address_details"
                                            value={data.address_details || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "address_details",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                                            placeholder="Enter additional address details (landmarks, building name, etc.)"
                                        />
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                4
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Emergency Contact
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Emergency contact information
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="emergency_contact_name"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Contact Name
                                            </Label>
                                            <Input
                                                id="emergency_contact_name"
                                                value={
                                                    data.emergency_contact_name ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "emergency_contact_name",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter contact name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="emergency_contact_number"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Contact Number
                                            </Label>
                                            <Input
                                                id="emergency_contact_number"
                                                value={
                                                    data.emergency_contact_number ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "emergency_contact_number",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter contact number"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="emergency_contact_relationship"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Relationship
                                            </Label>
                                            <Input
                                                id="emergency_contact_relationship"
                                                value={
                                                    data.emergency_contact_relationship ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "emergency_contact_relationship",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="e.g., Spouse, Parent, Sibling"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Insurance Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                5
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Insurance Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Insurance provider and policy
                                                details
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="insurance_provider"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Insurance Provider
                                            </Label>
                                            <Input
                                                id="insurance_provider"
                                                value={
                                                    data.insurance_provider ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "insurance_provider",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter insurance provider"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="insurance_policy_number"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Policy Number
                                            </Label>
                                            <Input
                                                id="insurance_policy_number"
                                                value={
                                                    data.insurance_policy_number ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "insurance_policy_number",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                placeholder="Enter policy number"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                6
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Medical Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Important medical details for
                                                treatment planning
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="medical_history"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Medical History
                                            </Label>
                                            <textarea
                                                id="medical_history"
                                                value={
                                                    data.medical_history || ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "medical_history",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                                                placeholder="Enter any relevant medical history..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="allergies"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Allergies
                                            </Label>
                                            <textarea
                                                id="allergies"
                                                value={data.allergies || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "allergies",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                                                placeholder="Enter any known allergies..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="notes"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Additional Notes
                                            </Label>
                                            <textarea
                                                id="notes"
                                                value={data.notes || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "notes",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none"
                                                placeholder="Enter any additional notes or comments..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 -mx-8 -mb-8 px-8 py-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="px-8 py-3 h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Creating...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <UserPlus className="h-4 w-4" />
                                                Create Patient
                                            </div>
                                        )}
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
