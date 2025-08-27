import React, { useState, useEffect } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { CheckCircle, Building2, User, MapPin, Info } from "lucide-react";
import axios from "axios";

const DAYS_OF_WEEK = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
];

export default function ClinicSetup({ request, token }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        street_address: "",
        region_code: null,
        province_code: null,
        city_municipality_code: null,
        barangay_code: null,
        postal_code: "",
        address_details: "",
        address: "",
    });

    const { flash } = usePage().props;
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [citiesMunicipalities, setCitiesMunicipalities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCityMunicipality, setSelectedCityMunicipality] =
        useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");

    const [setupCompleted, setSetupCompleted] = useState(false);

    useEffect(() => {
        if (flash && flash.success) {
            setSetupCompleted(true);
        }
    }, [flash]);

    useEffect(() => {
        axios.get(route("psgc.regions")).then((response) => {
            const formattedRegions = response.data.map((region) => ({
                psgc_id: region.code,
                name: region.name,
            }));
            setRegions(formattedRegions || []);
        });
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            axios
                .get(route("psgc.provinces", { regionId: selectedRegion }))
                .then((response) => {
                    const formattedProvinces = response.data.map(
                        (province) => ({
                            psgc_id: province.code,
                            name: province.name,
                            region_code: selectedRegion,
                        })
                    );
                    setProvinces(formattedProvinces || []);
                    setCitiesMunicipalities([]);
                    setBarangays([]);
                    setSelectedProvince("");
                    setSelectedCityMunicipality("");
                    setSelectedBarangay("");
                });
        } else {
            setProvinces([]);
            setCitiesMunicipalities([]);
            setBarangays([]);
            setSelectedProvince("");
            setSelectedCityMunicipality("");
            setSelectedBarangay("");
        }
    }, [selectedRegion]);

    useEffect(() => {
        if (selectedProvince) {
            axios
                .all([
                    axios.get(
                        route("psgc.cities", { provinceId: selectedProvince })
                    ),
                    axios.get(
                        route("psgc.municipalities", {
                            provinceId: selectedProvince,
                        })
                    ),
                ])
                .then(
                    axios.spread((citiesResponse, municipalitiesResponse) => {
                        const cities = (citiesResponse.data || []).map(
                            (city) => ({
                                psgc_id: city.code,
                                name: city.name,
                                province_code: selectedProvince,
                                type: "city",
                            })
                        );
                        const municipalities = (
                            municipalitiesResponse.data || []
                        ).map((municipality) => ({
                            psgc_id: municipality.code,
                            name: municipality.name,
                            province_code: selectedProvince,
                            type: "municipality",
                        }));
                        const combined = [...cities, ...municipalities];
                        combined.sort((a, b) => a.name.localeCompare(b.name));
                        setCitiesMunicipalities(combined);
                        setBarangays([]);
                        setSelectedCityMunicipality("");
                        setSelectedBarangay("");
                    })
                );
        } else {
            setCitiesMunicipalities([]);
            setBarangays([]);
            setSelectedCityMunicipality("");
            setSelectedBarangay("");
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedCityMunicipality) {
            const selectedItem = citiesMunicipalities.find(
                (item) => item.psgc_id === selectedCityMunicipality
            );
            const paramName =
                selectedItem && selectedItem.type === "city"
                    ? "cityId"
                    : "municipalityId";
            const apiUrl = route("psgc.barangays", {
                [paramName]: selectedCityMunicipality,
            });
            axios.get(apiUrl).then((response) => {
                const formattedBarangays = response.data.map((barangay) => ({
                    psgc_id: barangay.code,
                    name: barangay.name,
                    city_code: selectedCityMunicipality,
                }));
                setBarangays(formattedBarangays || []);
                setSelectedBarangay("");
            });
        } else {
            setBarangays([]);
            setSelectedBarangay("");
        }
    }, [selectedCityMunicipality, citiesMunicipalities]);

    useEffect(() => {
        const selectedBarangayObj = barangays.find(
            (b) => b.psgc_id === selectedBarangay
        );
        const selectedCityMunicipalityObj = citiesMunicipalities.find(
            (cm) => cm.psgc_id === selectedCityMunicipality
        );
        const selectedProvinceObj = provinces.find(
            (p) => p.psgc_id === selectedProvince
        );
        const selectedRegionObj = regions.find(
            (r) => r.psgc_id === selectedRegion
        );
        const fullAddress = [
            data.street_address,
            selectedBarangayObj?.name,
            selectedCityMunicipalityObj?.name,
            selectedProvinceObj?.name,
            selectedRegionObj?.name,
            data.postal_code,
        ]
            .filter(Boolean)
            .join(", ");
        setData({
            ...data,
            address: fullAddress,
            region_code: selectedRegion || null,
            province_code: selectedProvince || null,
            city_municipality_code: selectedCityMunicipality || null,
            barangay_code: selectedBarangay || null,
        });
    }, [
        selectedBarangay,
        selectedCityMunicipality,
        selectedProvince,
        selectedRegion,
        barangays,
        citiesMunicipalities,
        provinces,
        regions,
        data.street_address,
        data.postal_code,
    ]);

    const submit = (e) => {
        e.preventDefault();
        post(route("clinic.setup.complete", { token }), {
            onSuccess: () => setSetupCompleted(true),
        });
    };

    return (
        <>
            <Head title="Complete Clinic Setup" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Enhanced background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {/* Main gradient circles */}
                    <div
                        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-40 mix-blend-multiply transform rotate-45 animate-pulse shadow-lg"
                        style={{
                            animationDuration: "3s",
                            animationDelay: "0s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full opacity-40 mix-blend-multiply transform -rotate-30 animate-bounce shadow-xl"
                        style={{
                            animationDuration: "2.5s",
                            animationDelay: "0.5s",
                        }}
                    ></div>
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 rounded-full opacity-30 mix-blend-multiply animate-pulse shadow-2xl"
                        style={{
                            animationDuration: "4s",
                            animationDelay: "1s",
                        }}
                    ></div>

                    {/* Colorful accent circles */}
                    <div
                        className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full opacity-50 mix-blend-multiply animate-bounce shadow-lg"
                        style={{
                            animationDuration: "2s",
                            animationDelay: "0.3s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full opacity-50 mix-blend-multiply animate-pulse shadow-lg"
                        style={{
                            animationDuration: "3.5s",
                            animationDelay: "0.8s",
                        }}
                    ></div>
                    <div
                        className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-full opacity-40 mix-blend-multiply animate-ping shadow-md"
                        style={{
                            animationDuration: "1.5s",
                            animationDelay: "0.2s",
                        }}
                    ></div>
                    <div
                        className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full opacity-35 mix-blend-multiply animate-bounce shadow-lg"
                        style={{
                            animationDuration: "2.8s",
                            animationDelay: "0.6s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full opacity-45 mix-blend-multiply animate-pulse shadow-xl"
                        style={{
                            animationDuration: "3.2s",
                            animationDelay: "0.4s",
                        }}
                    ></div>

                    {/* Additional colorful elements */}
                    <div
                        className="absolute top-1/6 left-1/6 w-12 h-12 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full opacity-30 mix-blend-multiply animate-ping shadow-md"
                        style={{
                            animationDuration: "1.8s",
                            animationDelay: "0.7s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-1/6 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-35 mix-blend-multiply animate-bounce shadow-lg"
                        style={{
                            animationDuration: "2.2s",
                            animationDelay: "0.9s",
                        }}
                    ></div>
                    <div
                        className="absolute top-2/3 right-1/6 w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-40 mix-blend-multiply animate-pulse shadow-md"
                        style={{
                            animationDuration: "2.7s",
                            animationDelay: "0.1s",
                        }}
                    ></div>
                </div>

                <div className="max-w-4xl w-full space-y-6 relative z-10">
                    {/* Header */}
                    <div className="text-center">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <img
                                        src="/images/smile-suite-logo.png"
                                        alt="Smile Suite Logo"
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Smile Suite
                                </h1>
                            </div>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Complete Your Clinic Setup
                        </h2>
                        <p className="text-gray-600">
                            Congratulations! Your clinic registration has been
                            approved.
                        </p>
                    </div>

                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-gray-900">
                                        Clinic Information
                                    </CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Your clinic{" "}
                                        <strong>"{request.clinic_name}"</strong>{" "}
                                        has been approved. Please complete the
                                        setup below.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Approval Status */}
                            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-emerald-800">
                                            Approved for{" "}
                                            {request.subscription_plan ===
                                            "basic"
                                                ? "Basic Plan (14-Day Free Trial)"
                                                : request.subscription_plan ===
                                                  "pro"
                                                ? "Premium Plan"
                                                : request.subscription_plan ===
                                                  "enterprise"
                                                ? "Enterprise Plan"
                                                : request.subscription_plan ===
                                                  "premium"
                                                ? "Premium"
                                                : request.subscription_plan_name}{" "}
                                            Plan
                                        </h3>
                                        <p className="text-sm text-emerald-700">
                                            {request.subscription_plan ===
                                            "basic" ? (
                                                <>
                                                    <strong>
                                                        FREE for 14 days
                                                    </strong>
                                                    , then ₱999/month
                                                </>
                                            ) : request.subscription_plan ===
                                              "premium" ? (
                                                <>
                                                    Monthly subscription:{" "}
                                                    <strong>₱1,999</strong>
                                                </>
                                            ) : request.subscription_plan ===
                                              "enterprise" ? (
                                                <>
                                                    Monthly subscription:{" "}
                                                    <strong>₱2,999</strong>
                                                </>
                                            ) : (
                                                <>
                                                    Monthly subscription:{" "}
                                                    <strong>
                                                        ₱
                                                        {
                                                            request.subscription_amount
                                                        }
                                                    </strong>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {setupCompleted ? (
                                <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-700 mb-3">
                                        Clinic Setup Complete!
                                    </h2>
                                    <p className="text-gray-700 mb-6">
                                        Your clinic has been successfully
                                        registered. You may now log in to your
                                        account.
                                    </p>
                                    <div className="space-y-3">
                                        <Link
                                            href="/login"
                                            className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                                        >
                                            Go to Login
                                        </Link>
                                        <br />
                                        <Link
                                            href="/"
                                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            Back to Home
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Admin Account Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Admin Account Details
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label
                                                    htmlFor="name"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Full Name *
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
                                                    className="mt-1"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="email"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Email Address *
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
                                                    className="mt-1"
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="password"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Password *
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1"
                                                    required
                                                />
                                                {errors.password && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="password_confirmation"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Confirm Password *
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1"
                                                    required
                                                />
                                                {errors.password_confirmation && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {
                                                            errors.password_confirmation
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Address Information
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <Label
                                                    htmlFor="street_address"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Street Address
                                                </Label>
                                                <Input
                                                    id="street_address"
                                                    type="text"
                                                    value={data.street_address}
                                                    onChange={(e) =>
                                                        setData(
                                                            "street_address",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1"
                                                />
                                                {errors.street_address && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.street_address}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label
                                                        htmlFor="region_code"
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Region *
                                                    </Label>
                                                    <select
                                                        id="region_code"
                                                        value={selectedRegion}
                                                        onChange={(e) =>
                                                            setSelectedRegion(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">
                                                            Select Region
                                                        </option>
                                                        {regions.map(
                                                            (region) => (
                                                                <option
                                                                    key={
                                                                        region.psgc_id
                                                                    }
                                                                    value={
                                                                        region.psgc_id
                                                                    }
                                                                >
                                                                    {
                                                                        region.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors.region_code && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            {errors.region_code}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="province_code"
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Province *
                                                    </Label>
                                                    <select
                                                        id="province_code"
                                                        value={selectedProvince}
                                                        onChange={(e) =>
                                                            setSelectedProvince(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        disabled={
                                                            !selectedRegion
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Province
                                                        </option>
                                                        {provinces.map(
                                                            (province) => (
                                                                <option
                                                                    key={
                                                                        province.psgc_id
                                                                    }
                                                                    value={
                                                                        province.psgc_id
                                                                    }
                                                                >
                                                                    {
                                                                        province.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors.province_code && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            {
                                                                errors.province_code
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label
                                                        htmlFor="city_municipality_code"
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        City/Municipality *
                                                    </Label>
                                                    <select
                                                        id="city_municipality_code"
                                                        value={
                                                            selectedCityMunicipality
                                                        }
                                                        onChange={(e) =>
                                                            setSelectedCityMunicipality(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        disabled={
                                                            !selectedProvince
                                                        }
                                                    >
                                                        <option value="">
                                                            Select
                                                            City/Municipality
                                                        </option>
                                                        {citiesMunicipalities.map(
                                                            (city) => (
                                                                <option
                                                                    key={
                                                                        city.psgc_id
                                                                    }
                                                                    value={
                                                                        city.psgc_id
                                                                    }
                                                                >
                                                                    {city.name}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors.city_municipality_code && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            {
                                                                errors.city_municipality_code
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="barangay_code"
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Barangay *
                                                    </Label>
                                                    <select
                                                        id="barangay_code"
                                                        value={selectedBarangay}
                                                        onChange={(e) =>
                                                            setSelectedBarangay(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        disabled={
                                                            !selectedCityMunicipality
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Barangay
                                                        </option>
                                                        {barangays.map(
                                                            (barangay) => (
                                                                <option
                                                                    key={
                                                                        barangay.psgc_id
                                                                    }
                                                                    value={
                                                                        barangay.psgc_id
                                                                    }
                                                                >
                                                                    {
                                                                        barangay.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                    {errors.barangay_code && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            {
                                                                errors.barangay_code
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label
                                                        htmlFor="postal_code"
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Postal Code
                                                    </Label>
                                                    <Input
                                                        id="postal_code"
                                                        type="text"
                                                        value={data.postal_code}
                                                        onChange={(e) =>
                                                            setData(
                                                                "postal_code",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1"
                                                    />
                                                    {errors.postal_code && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            {errors.postal_code}
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor="address_details"
                                                        className="text-sm font-medium text-gray-700"
                                                    >
                                                        Additional Details
                                                    </Label>
                                                    <Input
                                                        id="address_details"
                                                        type="text"
                                                        value={
                                                            data.address_details
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                "address_details",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Building, floor, room number, etc."
                                                        className="mt-1"
                                                    />
                                                    {errors.address_details && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            {
                                                                errors.address_details
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Box */}
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Info className="w-3 h-3 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                                                    Important Information
                                                </h3>
                                                <div className="space-y-2 text-sm text-blue-700">
                                                    <p>
                                                        This will create your
                                                        clinic admin account.
                                                        You'll be able to log in
                                                        immediately after setup
                                                        and start managing your
                                                        clinic.
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Admin Account:
                                                        </strong>{" "}
                                                        This will be your
                                                        primary administrator
                                                        account with full access
                                                        to all clinic features.
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Address Information:
                                                        </strong>{" "}
                                                        This will be used for
                                                        your clinic's public
                                                        profile and patient
                                                        communications.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Setting up your clinic...
                                            </div>
                                        ) : (
                                            "Complete Setup"
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
