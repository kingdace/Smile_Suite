import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    Mail,
    Phone,
    BadgeCheck,
    MapPin,
    Home,
    Info,
    User,
    Building2,
    CalendarCheck,
    Star,
    FileText,
    ArrowLeft,
    Edit2,
    Users,
    Calendar,
    Activity,
    TrendingUp,
    Clock,
    Shield,
    Globe,
    CreditCard,
    Settings,
    Eye,
    Trash2,
    RotateCcw,
    Plus,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SUBSCRIPTION_PLANS = {
    basic: {
        label: "Basic Plan",
        price: "₱2,999/month",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        gradient: "from-blue-500 to-cyan-600",
        icon: "💙",
    },
    premium: {
        label: "Premium Plan",
        price: "₱4,999/month",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        gradient: "from-purple-500 to-indigo-600",
        icon: "💜",
    },
    enterprise: {
        label: "Enterprise Plan",
        price: "₱7,999/month",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        gradient: "from-emerald-500 to-teal-600",
        icon: "💚",
    },
};

const STATUS_COLORS = {
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-red-100 text-red-700 border-red-200",
    trial: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function Show({ auth, clinic }) {
    const [psgcData, setPsgcData] = useState({
        region: null,
        province: null,
        cityMunicipality: null,
        barangay: null,
    });

    // Fetch PSGC data for the clinic's location
    useEffect(() => {
        const fetchPSGCData = async () => {
            try {
                const newPsgcData = { ...psgcData };

                // Fetch region
                if (clinic.region_code) {
                    try {
                        const regionResponse = await axios.get(
                            route("psgc.regions")
                        );
                        const region = regionResponse.data.find(
                            (r) => r.code === clinic.region_code
                        );
                        if (region) {
                            newPsgcData.region = region;
                        }
                    } catch (error) {
                        console.error("Error fetching region:", error);
                    }
                }

                // Fetch province
                if (clinic.province_code && clinic.region_code) {
                    try {
                        const provinceResponse = await axios.get(
                            route("psgc.provinces", {
                                regionId: clinic.region_code,
                            })
                        );
                        const province = provinceResponse.data.find(
                            (p) => p.code === clinic.province_code
                        );
                        if (province) {
                            newPsgcData.province = province;
                        }
                    } catch (error) {
                        console.error("Error fetching province:", error);
                    }
                }

                // Fetch city/municipality
                if (clinic.city_municipality_code && clinic.province_code) {
                    try {
                        const [citiesResponse, municipalitiesResponse] =
                            await axios.all([
                                axios.get(
                                    route("psgc.cities", {
                                        provinceId: clinic.province_code,
                                    })
                                ),
                                axios.get(
                                    route("psgc.municipalities", {
                                        provinceId: clinic.province_code,
                                    })
                                ),
                            ]);

                        const city = citiesResponse.data.find(
                            (c) => c.code === clinic.city_municipality_code
                        );
                        const municipality = municipalitiesResponse.data.find(
                            (m) => m.code === clinic.city_municipality_code
                        );
                        const cityMunicipality = city || municipality;

                        if (cityMunicipality) {
                            newPsgcData.cityMunicipality = cityMunicipality;
                        }
                    } catch (error) {
                        console.error(
                            "Error fetching city/municipality:",
                            error
                        );
                    }
                }

                // Fetch barangay
                if (
                    clinic.barangay_code &&
                    clinic.city_municipality_code &&
                    clinic.province_code
                ) {
                    try {
                        // First, we need to determine if it's a city or municipality
                        const [citiesResponse, municipalitiesResponse] =
                            await axios.all([
                                axios.get(
                                    route("psgc.cities", {
                                        provinceId: clinic.province_code,
                                    })
                                ),
                                axios.get(
                                    route("psgc.municipalities", {
                                        provinceId: clinic.province_code,
                                    })
                                ),
                            ]);

                        const city = citiesResponse.data.find(
                            (c) => c.code === clinic.city_municipality_code
                        );
                        const municipality = municipalitiesResponse.data.find(
                            (m) => m.code === clinic.city_municipality_code
                        );

                        let barangayResponse;
                        if (city) {
                            // It's a city
                            barangayResponse = await axios.get(
                                route("psgc.barangays", {
                                    cityId: clinic.city_municipality_code,
                                })
                            );
                        } else if (municipality) {
                            // It's a municipality
                            barangayResponse = await axios.get(
                                route("psgc.barangays", {
                                    municipalityId:
                                        clinic.city_municipality_code,
                                })
                            );
                        }

                        if (barangayResponse) {
                            const barangay = barangayResponse.data.find(
                                (b) => b.code === clinic.barangay_code
                            );
                            if (barangay) {
                                newPsgcData.barangay = barangay;
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching barangay:", error);
                    }
                }

                setPsgcData(newPsgcData);
            } catch (error) {
                console.error("Error fetching PSGC data:", error);
            }
        };

        fetchPSGCData();
    }, [
        clinic.region_code,
        clinic.province_code,
        clinic.city_municipality_code,
        clinic.barangay_code,
    ]);

    const formatAddress = () => {
        const parts = [
            clinic.street_address,
            psgcData.barangay?.name,
            psgcData.cityMunicipality?.name,
            psgcData.province?.name,
            psgcData.region?.name,
            clinic.postal_code,
        ].filter(Boolean);

        return parts.join(", ");
    };

    const getSubscriptionPlan = () => {
        return (
            SUBSCRIPTION_PLANS[clinic.subscription_plan] || {
                label: clinic.subscription_plan,
                price: "N/A",
                color: "bg-gray-100 text-gray-700 border-gray-200",
                gradient: "from-gray-500 to-gray-600",
                icon: "📋",
            }
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const stats = [
        {
            label: "Total Patients",
            value: clinic.patients?.length || 0,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            gradient: "from-blue-500 to-cyan-600",
        },
        {
            label: "Total Appointments",
            value: clinic.appointments?.length || 0,
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-50",
            gradient: "from-green-500 to-emerald-600",
        },
        {
            label: "Staff Members",
            value: clinic.users?.length || 0,
            icon: User,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            gradient: "from-purple-500 to-indigo-600",
        },
        {
            label: "Active Status",
            value: clinic.is_active ? "Active" : "Inactive",
            icon: Activity,
            color: clinic.is_active ? "text-green-600" : "text-red-600",
            bgColor: clinic.is_active ? "bg-green-50" : "bg-red-50",
            gradient: clinic.is_active
                ? "from-green-500 to-emerald-600"
                : "from-red-500 to-pink-600",
        },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Clinic Details
                </h2>
            }
            hideSidebar={true}
        >
            <Head title={`${clinic.name} - Clinic Details`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                {/* Modern Header Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-gradient-to-r from-white via-blue-50/50 to-cyan-50/50 rounded-2xl border border-blue-200/50 shadow-lg backdrop-blur-sm">
                        <div className="p-6">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="group inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
                                            <Building2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-xl font-bold text-gray-900">
                                                {clinic.name}
                                            </h1>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-sm text-gray-600">
                                                    Clinic ID: {clinic.id}
                                                </p>
                                                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                                <Badge
                                                    className={`${
                                                        clinic.is_active
                                                            ? "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200"
                                                            : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200"
                                                    } text-xs font-semibold border shadow-sm`}
                                                >
                                                    {clinic.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            (window.location.href = route(
                                                "admin.clinics.edit",
                                                clinic.id
                                            ))
                                        }
                                        className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Clinic
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Clinic Overview */}
                            <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b-2 border-blue-200 pb-4 bg-gradient-to-r from-blue-100 to-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                                            <Info className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Clinic Overview
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Basic clinic details and contact
                                                information
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Logo and Basic Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
                                                <img
                                                    src={
                                                        clinic.logo_url ||
                                                        "/images/clinic-logo.png"
                                                    }
                                                    alt={`${clinic.name} Logo`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src =
                                                            "/images/clinic-logo.png";
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-1">
                                                    {clinic.name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={`${
                                                            clinic.is_active
                                                                ? "bg-green-100 text-green-700 border-green-200"
                                                                : "bg-red-100 text-red-700 border-red-200"
                                                        } text-xs font-medium`}
                                                    >
                                                        {clinic.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                    <Badge
                                                        className={`${
                                                            STATUS_COLORS[
                                                                clinic
                                                                    .subscription_status
                                                            ] ||
                                                            "bg-gray-100 text-gray-700 border-gray-200"
                                                        } text-xs font-medium`}
                                                    >
                                                        {
                                                            clinic.subscription_status
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                                                <div className="p-1.5 rounded-md bg-blue-100">
                                                    <Mail className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Email
                                                    </p>
                                                    <p className="text-gray-900 font-medium text-sm">
                                                        {clinic.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                                                <div className="p-1.5 rounded-md bg-green-100">
                                                    <Phone className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Phone
                                                    </p>
                                                    <p className="text-gray-900 font-medium text-sm">
                                                        {clinic.contact_number}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                                                <div className="p-1.5 rounded-md bg-purple-100">
                                                    <FileText className="h-4 w-4 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        License
                                                    </p>
                                                    <p className="text-gray-900 font-medium text-sm font-mono">
                                                        {clinic.license_number}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistics */}
                            <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b-2 border-emerald-200 pb-4 bg-gradient-to-r from-emerald-100 to-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                                            <TrendingUp className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Clinic Statistics
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Key performance metrics and data
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {stats.map((stat, index) => (
                                            <div
                                                key={index}
                                                className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative group"
                                            >
                                                {/* Background gradient overlay */}
                                                <div
                                                    className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                                                ></div>

                                                {/* Icon with enhanced styling */}
                                                <div className="relative z-10 mb-3">
                                                    <div
                                                        className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto shadow-lg border border-white/50 group-hover:scale-110 transition-transform duration-300`}
                                                    >
                                                        <stat.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="relative z-10">
                                                    <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                        {stat.label}
                                                    </div>
                                                </div>

                                                {/* Decorative corner accent */}
                                                <div
                                                    className={`absolute top-0 right-0 w-16 h-16 ${stat.bgColor} opacity-20 rounded-bl-full group-hover:opacity-30 transition-opacity duration-300`}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Address Information */}
                            <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b-2 border-blue-200 pb-4 bg-gradient-to-r from-blue-100 to-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Address Information
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Location and address details
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <div className="space-y-4">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                            <div className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                Complete Address
                                            </div>
                                            <div className="text-gray-800 font-medium">
                                                {formatAddress() ||
                                                    "Address information not available"}
                                            </div>
                                        </div>

                                        {clinic.address_details && (
                                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                                                <div className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    Additional Details
                                                </div>
                                                <div className="text-gray-800">
                                                    {clinic.address_details}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Description */}
                            {clinic.description && (
                                <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                    <CardHeader className="border-b-2 border-purple-200 pb-4 bg-gradient-to-r from-purple-100 to-indigo-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm">
                                                <FileText className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold text-gray-900">
                                                    Description
                                                </CardTitle>
                                                <p className="text-gray-600 text-sm mt-0.5">
                                                    Clinic description and
                                                    details
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-5">
                                        <div className="text-gray-700 leading-relaxed">
                                            {clinic.description}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Subscription Details */}
                            <Card className="shadow-xl rounded-xl border-0 bg-white/95 backdrop-blur-sm sticky top-24 overflow-hidden">
                                <CardHeader className="border-b-2 border-emerald-200 pb-4 bg-gradient-to-r from-emerald-100 to-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                                            <Star className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                Subscription
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Plan and billing information
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <div className="space-y-4">
                                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                            <div className="text-4xl mb-3">
                                                {getSubscriptionPlan().icon}
                                            </div>
                                            <div className="font-bold text-gray-900 mb-1 text-lg">
                                                {getSubscriptionPlan().label}
                                            </div>
                                            <div className="text-sm text-gray-600 mb-3">
                                                {getSubscriptionPlan().price}
                                            </div>
                                            <Badge
                                                className={`${
                                                    STATUS_COLORS[
                                                        clinic
                                                            .subscription_status
                                                    ] ||
                                                    "bg-gray-100 text-gray-700 border-gray-200"
                                                } text-xs font-medium`}
                                            >
                                                {clinic.subscription_status}
                                            </Badge>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-gray-600 font-medium">
                                                    Start Date:
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatDate(
                                                        clinic.subscription_start_date
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-gray-600 font-medium">
                                                    End Date:
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatDate(
                                                        clinic.subscription_end_date
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Important Dates */}
                            <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b-2 border-blue-200 pb-4 bg-gradient-to-r from-blue-100 to-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                                            <CalendarCheck className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                Important Dates
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Timeline and key events
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="text-gray-600 font-medium">
                                                Created:
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {formatDate(clinic.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="text-gray-600 font-medium">
                                                Last Updated:
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {formatDate(clinic.updated_at)}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Staff Members */}
                            {clinic.users && clinic.users.length > 0 && (
                                <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                    <CardHeader className="border-b-2 border-purple-200 pb-4 bg-gradient-to-r from-purple-100 to-indigo-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold text-gray-900">
                                                    Staff Members
                                                </CardTitle>
                                                <p className="text-gray-600 text-sm mt-0.5">
                                                    Team and personnel
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-5">
                                        <div className="space-y-3">
                                            {clinic.users.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-gray-900 truncate">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 truncate">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                    <Badge className="text-xs px-2 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 border-purple-200">
                                                        {user.role}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
