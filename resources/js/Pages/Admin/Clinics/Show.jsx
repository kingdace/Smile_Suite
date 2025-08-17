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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SUBSCRIPTION_PLANS = {
    basic: {
        label: "Basic Plan",
        price: "₱2,999/month",
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: "💙",
    },
    premium: {
        label: "Premium Plan",
        price: "₱4,999/month",
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: "💜",
    },
    enterprise: {
        label: "Enterprise Plan",
        price: "₱7,999/month",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
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
        },
        {
            label: "Total Appointments",
            value: clinic.appointments?.length || 0,
            icon: Calendar,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            label: "Staff Members",
            value: clinic.users?.length || 0,
            icon: User,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            label: "Active Status",
            value: clinic.is_active ? "Active" : "Inactive",
            icon: Activity,
            color: clinic.is_active ? "text-green-600" : "text-red-600",
            bgColor: clinic.is_active ? "bg-green-50" : "bg-red-50",
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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50 mb-8">
                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">
                                            {clinic.name}
                                        </h1>
                                        <p className="text-blue-100 text-sm">
                                            Clinic ID: {clinic.id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm font-medium"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Clinics
                                    </button>
                                    <button
                                        onClick={() =>
                                            (window.location.href = route(
                                                "admin.clinics.edit",
                                                clinic.id
                                            ))
                                        }
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 text-sm font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Clinic
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Clinic Overview */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                        <Info className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Clinic Overview
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Logo and Basic Info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg border-2 border-blue-200">
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
                                                    {clinic.subscription_status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Mail className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">
                                                {clinic.email}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <Phone className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">
                                                {clinic.contact_number}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">
                                                License: {clinic.license_number}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Clinic Statistics
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {stats.map((stat, index) => (
                                        <div
                                            key={index}
                                            className={`${stat.bgColor} rounded-lg p-4 text-center`}
                                        >
                                            <div
                                                className={`${stat.color} mb-2`}
                                            >
                                                <stat.icon className="w-6 h-6 mx-auto" />
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {stat.value}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Address Information
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-sm font-medium text-blue-700 mb-2">
                                            Complete Address
                                        </div>
                                        <div className="text-gray-800">
                                            {formatAddress() ||
                                                "Address information not available"}
                                        </div>
                                    </div>

                                    {clinic.address_details && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="text-sm font-medium text-gray-700 mb-2">
                                                Additional Details
                                            </div>
                                            <div className="text-gray-800">
                                                {clinic.address_details}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {clinic.description && (
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Description
                                        </h3>
                                    </div>

                                    <div className="text-gray-700 leading-relaxed">
                                        {clinic.description}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Subscription Details */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                        <Star className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Subscription
                                    </h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">
                                            {getSubscriptionPlan().icon}
                                        </div>
                                        <div className="font-bold text-gray-900 mb-1">
                                            {getSubscriptionPlan().label}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3">
                                            {getSubscriptionPlan().price}
                                        </div>
                                        <Badge
                                            className={`${
                                                STATUS_COLORS[
                                                    clinic.subscription_status
                                                ] ||
                                                "bg-gray-100 text-gray-700 border-gray-200"
                                            } text-xs font-medium`}
                                        >
                                            {clinic.subscription_status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Start Date:
                                            </span>
                                            <span className="font-medium">
                                                {formatDate(
                                                    clinic.subscription_start_date
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                End Date:
                                            </span>
                                            <span className="font-medium">
                                                {formatDate(
                                                    clinic.subscription_end_date
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Important Dates */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                        <CalendarCheck className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Important Dates
                                    </h3>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Created:
                                        </span>
                                        <span className="font-medium">
                                            {formatDate(clinic.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Last Updated:
                                        </span>
                                        <span className="font-medium">
                                            {formatDate(clinic.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Staff Members */}
                            {clinic.users && clinic.users.length > 0 && (
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                            <Users className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Staff Members
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {clinic.users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 truncate">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {user.email}
                                                    </div>
                                                </div>
                                                <Badge className="text-xs px-2 py-1">
                                                    {user.role}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
