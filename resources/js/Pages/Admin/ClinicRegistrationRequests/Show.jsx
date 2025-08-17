import React, { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Separator } from "@/Components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    MapPin,
    Phone,
    Mail,
    FileText,
    Building2,
    AlertTriangle,
    TrendingUp,
    Users,
    Calendar,
    Shield,
    Star,
} from "lucide-react";
import { Tooltip } from "@/Components/ui/tooltip";

export default function Show({ auth, request }) {
    const [adminNotes, setAdminNotes] = useState(request.admin_notes || "");
    const [paymentStatus, setPaymentStatus] = useState(request.payment_status);
    const [isProcessing, setIsProcessing] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
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

                // Get clinic data from the request
                const clinic = request.clinic;
                if (!clinic) {
                    return;
                }

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
        request.clinic?.region_code,
        request.clinic?.province_code,
        request.clinic?.city_municipality_code,
        request.clinic?.barangay_code,
    ]);

    const formatAddress = () => {
        const clinic = request.clinic;
        if (!clinic) {
            return request.full_address || "Address information not available";
        }

        const parts = [
            clinic.street_address,
            psgcData.barangay?.name,
            psgcData.cityMunicipality?.name,
            psgcData.province?.name,
            psgcData.region?.name,
            clinic.postal_code,
        ].filter(Boolean);

        return parts.join(", ") || "Address information not available";
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
            completed: "bg-blue-100 text-blue-700 border-blue-200",
        };
        return (
            <Badge
                className={`${
                    variants[status] ||
                    "bg-gray-100 text-gray-700 border-gray-200"
                } border font-medium px-2 py-1`}
            >
                {status}
            </Badge>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const variants = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
            failed: "bg-red-100 text-red-700 border-red-200",
        };
        return (
            <Badge
                className={`${
                    variants[status] ||
                    "bg-gray-100 text-gray-700 border-gray-200"
                } border font-medium px-2 py-1`}
            >
                {status}
            </Badge>
        );
    };

    const handleApprove = () => {
        setIsProcessing(true);
        router.patch(
            route("admin.clinic-requests.approve", request.id),
            {
                admin_notes: adminNotes,
            },
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setApproveDialogOpen(false);
                },
            }
        );
    };

    const handleReject = () => {
        setIsProcessing(true);
        router.patch(
            route("admin.clinic-requests.reject", request.id),
            {
                admin_notes: adminNotes,
            },
            {
                onFinish: () => {
                    setIsProcessing(false);
                    setRejectDialogOpen(false);
                },
            }
        );
    };

    const handlePaymentStatusUpdate = () => {
        console.log("Payment status update clicked");
        console.log("Current payment status:", request.payment_status);
        console.log("Selected payment status:", paymentStatus);
        console.log("Is processing:", isProcessing);

        setIsProcessing(true);
        router.patch(
            route("admin.clinic-requests.payment-status", request.id),
            {
                payment_status: paymentStatus,
            },
            {
                onFinish: () => {
                    console.log("Payment status update finished");
                    setIsProcessing(false);
                },
                onError: (errors) => {
                    console.error("Payment status update error:", errors);
                    setIsProcessing(false);
                },
            }
        );
    };

    const canBeApproved =
        request.status === "pending" &&
        request.payment_status === "paid" &&
        !request.is_expired;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head
                title={`Clinic Registration Request - ${request.clinic_name}`}
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                {/* Compact Enhanced Header Section */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("admin.clinic-requests.index")}
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">
                                            {request.clinic_name}
                                        </h1>
                                        <p className="text-blue-100 text-sm">
                                            Clinic Registration Request
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-blue-100 text-xs">
                                        Request ID
                                    </p>
                                    <p className="text-white font-mono text-sm font-semibold">
                                        #{request.id}
                                    </p>
                                </div>
                                <div className="h-8 w-px bg-white/20"></div>
                                <div className="text-right">
                                    <p className="text-blue-100 text-xs">
                                        Status
                                    </p>
                                    <div className="mt-1">
                                        {getStatusBadge(request.status)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Clinic Information */}
                            <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b-2 border-blue-200 pb-4 bg-gradient-to-r from-blue-100 to-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                                            <Building2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Clinic Information
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Basic clinic details and contact
                                                information
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-5">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            {request.clinic_name}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {request.description ||
                                                "No description provided"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
                                            <div className="p-1.5 rounded-md bg-blue-100">
                                                <Mail className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Email
                                                </p>
                                                <p className="text-gray-900 font-medium text-sm">
                                                    {request.email}
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
                                                    {request.phone}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors md:col-span-2">
                                            <div className="p-1.5 rounded-md bg-purple-100 mt-0.5">
                                                <MapPin className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    Address
                                                </p>
                                                <p className="text-gray-900 font-medium text-sm">
                                                    {formatAddress()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                                <Users className="h-4 w-4 text-blue-600" />
                                                Contact Person
                                            </h4>
                                            <p className="text-gray-700 font-medium text-sm">
                                                {request.contact_person}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                                <Shield className="h-4 w-4 text-emerald-600" />
                                                License Number
                                            </h4>
                                            <p className="text-gray-700 font-medium text-sm font-mono">
                                                {request.license_number}
                                            </p>
                                        </div>
                                    </div>

                                    {request.message && (
                                        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                                Additional Message
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed text-sm">
                                                {request.message}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Subscription Details */}
                            <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b-2 border-emerald-200 pb-4 bg-gradient-to-r from-emerald-100 to-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                                            <DollarSign className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Subscription Details
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Plan selection and payment
                                                information
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                                <Star className="h-4 w-4 text-emerald-600" />
                                                Subscription Plan
                                            </h4>
                                            <Badge className="capitalize px-3 py-1.5 text-base font-semibold border-emerald-300 bg-emerald-100 text-emerald-700 flex items-center gap-2 w-fit">
                                                <DollarSign className="h-4 w-4" />
                                                {request.subscription_plan}
                                            </Badge>
                                        </div>
                                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                                Subscription Amount
                                            </h4>
                                            <p className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                                <DollarSign className="h-5 w-5 text-blue-600" />
                                                ₱
                                                {parseFloat(
                                                    request.subscription_amount
                                                ).toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                One-time setup fee
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Status Information */}
                            <Card className="shadow-lg rounded-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                                <CardHeader className="border-b-2 border-yellow-200 pb-4 bg-gradient-to-r from-yellow-100 to-orange-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 shadow-sm">
                                            <Clock className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold text-gray-900">
                                                Status Information
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Request timeline and current
                                                status
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                                <Shield className="h-4 w-4 text-gray-600" />
                                                Request Status
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(request.status)}
                                                {request.status ===
                                                    "pending" && (
                                                    <Clock className="h-4 w-4 text-yellow-500" />
                                                )}
                                                {request.status ===
                                                    "approved" && (
                                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                )}
                                                {request.status ===
                                                    "rejected" && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                                <DollarSign className="h-4 w-4 text-gray-600" />
                                                Payment Status
                                            </h4>
                                            <div className="flex items-center gap-3">
                                                {getPaymentStatusBadge(
                                                    request.payment_status
                                                )}
                                                {request.payment_status ===
                                                    "pending" && (
                                                    <Clock className="h-4 w-4 text-yellow-500" />
                                                )}
                                                {request.payment_status ===
                                                    "paid" && (
                                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                )}
                                                {request.payment_status ===
                                                    "failed" && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                Submitted
                                            </h4>
                                            <p className="text-gray-900 font-medium text-sm">
                                                {formatDate(request.created_at)}
                                            </p>
                                        </div>
                                        {request.approved_at && (
                                            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                                                    Approved
                                                </h4>
                                                <p className="text-gray-900 font-medium text-sm">
                                                    {formatDate(
                                                        request.approved_at
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                        {request.expires_at && (
                                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 md:col-span-2">
                                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2 text-sm">
                                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                                    Expires
                                                </h4>
                                                <p
                                                    className={`font-medium text-sm ${
                                                        request.is_expired
                                                            ? "text-red-600"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {formatDate(
                                                        request.expires_at
                                                    )}
                                                    {request.is_expired &&
                                                        " (Expired)"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Actions */}
                        <div className="space-y-6">
                            {/* Admin Actions */}
                            <Card className="shadow-xl rounded-xl border-0 bg-white/95 backdrop-blur-sm sticky top-24 overflow-hidden">
                                <CardHeader className="border-b-2 border-purple-200 pb-4 bg-gradient-to-r from-purple-100 to-indigo-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm">
                                            <FileText className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900">
                                                Admin Actions
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm mt-0.5">
                                                Manage request and take actions
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5 pt-5">
                                    {/* Payment Status Update */}
                                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2 text-sm">
                                            <DollarSign className="h-4 w-4 text-gray-600" />
                                            Confirm Payment Status
                                        </h4>
                                        <p className="text-xs text-gray-600 mb-3">
                                            Update when clinic confirms payment
                                        </p>
                                        <div className="flex gap-2 mb-3">
                                            <Select
                                                value={paymentStatus}
                                                onValueChange={setPaymentStatus}
                                            >
                                                <SelectTrigger className="min-w-[140px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm">
                                                    <SelectValue placeholder="Select payment status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">
                                                        Pending Payment
                                                    </SelectItem>
                                                    <SelectItem value="paid">
                                                        Payment Confirmed
                                                    </SelectItem>
                                                    <SelectItem value="failed">
                                                        Payment Failed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Tooltip content="Update payment status">
                                                <Button
                                                    size="sm"
                                                    onClick={
                                                        handlePaymentStatusUpdate
                                                    }
                                                    disabled={
                                                        isProcessing ||
                                                        paymentStatus ===
                                                            request.payment_status
                                                    }
                                                    title={
                                                        paymentStatus ===
                                                        request.payment_status
                                                            ? "No change in payment status"
                                                            : "Update payment status"
                                                    }
                                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md text-sm"
                                                >
                                                    Update
                                                </Button>
                                            </Tooltip>
                                        </div>
                                        {paymentStatus === "paid" &&
                                            request.payment_status !==
                                                "paid" && (
                                                <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-md border border-emerald-200">
                                                    ✓ This will send setup email
                                                    to clinic
                                                </p>
                                            )}
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Admin Notes */}
                                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <h4 className="font-semibold mb-3 text-gray-900 flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-gray-600" />
                                            Admin Notes
                                        </h4>
                                        <Textarea
                                            value={adminNotes}
                                            onChange={(e) =>
                                                setAdminNotes(e.target.value)
                                            }
                                            placeholder="Add notes about this request..."
                                            rows={4}
                                            className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-md resize-none text-sm"
                                        />
                                    </div>

                                    <Separator className="my-4" />

                                    {/* Approval/Rejection Actions */}
                                    {request.status === "pending" && (
                                        <div className="space-y-4">
                                            <div className="text-center">
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                                                    Request Actions
                                                </h4>
                                            </div>
                                            <div className="flex flex-col items-center space-y-3">
                                                <Tooltip content="Approve and send payment instructions">
                                                    <Button
                                                        onClick={() =>
                                                            setApproveDialogOpen(
                                                                true
                                                            )
                                                        }
                                                        disabled={isProcessing}
                                                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold shadow-md flex items-center justify-center gap-2 py-3 text-sm"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                        Approve & Send Payment
                                                        Instructions
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="Reject request">
                                                    <Button
                                                        onClick={() =>
                                                            setRejectDialogOpen(
                                                                true
                                                            )
                                                        }
                                                        disabled={isProcessing}
                                                        variant="destructive"
                                                        className="w-full font-semibold shadow-md flex items-center justify-center gap-2 py-3 text-sm"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Reject Request
                                                    </Button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    )}

                                    {request.status === "approved" &&
                                        request.payment_status ===
                                            "pending" && (
                                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                                <CheckCircle className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                                                <p className="text-blue-900 font-bold text-base mb-1">
                                                    Request Approved
                                                </p>
                                                <p className="text-xs text-blue-700 mb-2">
                                                    Payment instructions sent to{" "}
                                                    {request.email}
                                                </p>
                                                <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block">
                                                    Waiting for payment
                                                    confirmation
                                                </p>
                                            </div>
                                        )}

                                    {request.status === "approved" &&
                                        request.payment_status === "paid" && (
                                            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                                                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                                                <p className="text-emerald-900 font-bold text-base mb-1">
                                                    Payment Confirmed
                                                </p>
                                                <p className="text-xs text-emerald-700 mb-2">
                                                    Setup email sent to{" "}
                                                    {request.email}
                                                </p>
                                                <p className="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full inline-block">
                                                    Clinic can now complete
                                                    setup
                                                </p>
                                            </div>
                                        )}

                                    {request.status === "rejected" && (
                                        <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-200">
                                            <XCircle className="h-10 w-10 text-red-600 mx-auto mb-2" />
                                            <p className="text-red-900 font-bold text-base">
                                                Request Rejected
                                            </p>
                                        </div>
                                    )}

                                    {!canBeApproved &&
                                        request.status === "pending" && (
                                            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                                                <Clock className="h-10 w-10 text-yellow-600 mx-auto mb-2" />
                                                <p className="text-yellow-900 font-bold text-base mb-1">
                                                    Cannot Approve
                                                </p>
                                                <p className="text-xs text-yellow-700">
                                                    {request.payment_status !==
                                                        "paid" &&
                                                        "Payment not completed"}
                                                    {request.is_expired &&
                                                        "Request has expired"}
                                                </p>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Dialog */}
            <AlertDialog
                open={approveDialogOpen}
                onOpenChange={setApproveDialogOpen}
            >
                <AlertDialogContent className="max-w-lg bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 px-8 py-6 text-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-white/10"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                        {/* Icon */}
                        <div className="relative z-10 mb-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border-2 border-white/30">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="relative z-10 text-2xl font-bold text-white mb-2">
                            Approve Registration
                        </h2>
                        <p className="relative z-10 text-emerald-100 text-sm">
                            Confirm approval for clinic registration
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-6">
                        {/* Main Message */}
                        <div className="text-center mb-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Are you sure you want to approve the
                                registration request for{" "}
                                <span className="font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                    {request.clinic_name}
                                </span>
                                ?
                            </p>
                        </div>

                        {/* Email Notification Card */}
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-200 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-emerald-800">
                                    Payment instructions will be sent to:
                                </span>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-mono text-emerald-700">
                                        {request.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <AlertDialogCancel
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-md"
                                onClick={() => setApproveDialogOpen(false)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold border-0 py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                onClick={handleApprove}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Approve Registration</span>
                                    </div>
                                )}
                            </AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reject Dialog */}
            <AlertDialog
                open={rejectDialogOpen}
                onOpenChange={setRejectDialogOpen}
            >
                <AlertDialogContent className="max-w-lg bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-br from-red-500 to-pink-600 px-8 py-6 text-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-white/10"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

                        {/* Icon */}
                        <div className="relative z-10 mb-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border-2 border-white/30">
                                <XCircle className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="relative z-10 text-2xl font-bold text-white mb-2">
                            Reject Registration
                        </h2>
                        <p className="relative z-10 text-red-100 text-sm">
                            Confirm rejection of clinic registration
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-6">
                        {/* Main Message */}
                        <div className="text-center mb-6">
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Are you sure you want to reject the registration
                                request for{" "}
                                <span className="font-bold text-gray-900 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                    {request.clinic_name}
                                </span>
                                ?
                            </p>
                        </div>

                        {/* Email Notification Card */}
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-5 border border-red-200 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-red-800">
                                    Rejection notification will be sent to:
                                </span>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-sm font-mono text-red-700">
                                        {request.email}
                                    </span>
                                </div>
                            </div>

                            {/* Admin Notes Indicator */}
                            {adminNotes && (
                                <div className="mt-4 pt-4 border-t border-red-200">
                                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-3 border border-red-200">
                                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                                            <span className="text-red-600 text-xs">
                                                📝
                                            </span>
                                        </div>
                                        <span className="text-xs text-red-700 font-medium">
                                            Admin notes will be included in the
                                            rejection email
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <AlertDialogCancel
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:shadow-md"
                                onClick={() => setRejectDialogOpen(false)}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold border-0 py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                                onClick={handleReject}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <XCircle className="w-4 h-4" />
                                        <span>Reject Registration</span>
                                    </div>
                                )}
                            </AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
