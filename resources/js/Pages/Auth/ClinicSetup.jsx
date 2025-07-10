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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full space-y-8">
                    <div className="text-center">
                        <Link href="/" className="inline-block">
                            <h1 className="text-3xl font-bold text-blue-600">
                                Smile Suite
                            </h1>
                        </Link>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Complete Your Clinic Setup
                        </h2>
                        <p className="mt-2 text-lg text-gray-600">
                            Congratulations! Your clinic registration has been
                            approved.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Clinic Information</CardTitle>
                            <CardDescription>
                                Your clinic "{request.clinic_name}" has been
                                approved. Please complete the setup below.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-5 w-5 text-green-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800">
                                            Approved for{" "}
                                            {request.subscription_plan_name}{" "}
                                            Plan
                                        </h3>
                                        <div className="mt-2 text-sm text-green-700">
                                            <p>
                                                Monthly subscription: $
                                                {request.subscription_amount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {setupCompleted ? (
                                <div className="text-center bg-white rounded-lg shadow-lg p-8">
                                    <h2 className="text-2xl font-bold text-green-600 mb-4">
                                        Clinic Setup Complete!
                                    </h2>
                                    <p className="mb-6">
                                        Your clinic has been successfully
                                        registered. You may now log in to your
                                        account.
                                    </p>
                                    <Link
                                        href="/login"
                                        className="btn btn-primary block w-full mb-2"
                                    >
                                        Go to Login
                                    </Link>
                                    <Link
                                        href="/"
                                        className="text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            ) : (
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Admin Account Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="name">
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
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="email">
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
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="password">
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
                                                    required
                                                />
                                                {errors.password && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="password_confirmation">
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

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Additional Address Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="street_address">
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
                                                />
                                                {errors.street_address && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.street_address}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="region_code">
                                                        Region
                                                    </Label>
                                                    <select
                                                        id="region_code"
                                                        value={selectedRegion}
                                                        onChange={(e) =>
                                                            setSelectedRegion(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                                    <Label htmlFor="province_code">
                                                        Province
                                                    </Label>
                                                    <select
                                                        id="province_code"
                                                        value={selectedProvince}
                                                        onChange={(e) =>
                                                            setSelectedProvince(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="city_municipality_code">
                                                        City/Municipality
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
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                                    <Label htmlFor="barangay_code">
                                                        Barangay
                                                    </Label>
                                                    <select
                                                        id="barangay_code"
                                                        value={selectedBarangay}
                                                        onChange={(e) =>
                                                            setSelectedBarangay(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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

                                            <div>
                                                <Label htmlFor="postal_code">
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
                                                />
                                                {errors.postal_code && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.postal_code}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="address_details">
                                                    Additional Address Details
                                                </Label>
                                                <Input
                                                    id="address_details"
                                                    type="text"
                                                    value={data.address_details}
                                                    onChange={(e) =>
                                                        setData(
                                                            "address_details",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Building name, floor, room number, etc."
                                                />
                                                {errors.address_details && (
                                                    <p className="text-sm text-red-600 mt-1">
                                                        {errors.address_details}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-5 w-5 text-blue-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800">
                                                    Important Information
                                                </h3>
                                                <div className="mt-2 text-sm text-blue-700">
                                                    <p>
                                                        This will create your
                                                        clinic admin account.
                                                        You'll be able to log in
                                                        immediately after setup
                                                        and start managing your
                                                        clinic.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Setting up your clinic..."
                                            : "Complete Setup"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
