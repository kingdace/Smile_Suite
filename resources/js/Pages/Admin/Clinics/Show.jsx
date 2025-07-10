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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ClinicLogo from "@/Components/ClinicLogo";

const DAYS_OF_WEEK = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursday" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
];

const SUBSCRIPTION_PLANS = {
    basic: {
        label: "Basic Plan",
        price: "₱2,999/month",
    },
    premium: {
        label: "Premium Plan",
        price: "₱4,999/month",
    },
    enterprise: {
        label: "Enterprise Plan",
        price: "₱7,999/month",
    },
};

export default function Show({ auth, clinic }) {
    const [psgc, setPsgc] = useState({
        regions: [],
        provinces: [],
        cities: [],
        municipalities: [],
        barangays: [],
    });

    useEffect(() => {
        async function fetchPSGC() {
            const [regions, provinces, cities, municipalities, barangays] =
                await Promise.all([
                    fetch("/psgc/regions.json").then((r) => r.json()),
                    fetch("/psgc/provinces.json").then((r) => r.json()),
                    fetch("/psgc/cities.json").then((r) => r.json()),
                    fetch("/psgc/municipalities.json").then((r) => r.json()),
                    fetch("/psgc/barangays.json").then((r) => r.json()),
                ]);
            setPsgc({ regions, provinces, cities, municipalities, barangays });
        }
        fetchPSGC();
    }, []);

    function getPSGCName(type, code) {
        if (!code) return "";
        const list = psgc[type];
        if (!list) return code;
        let found = list.find((item) => item.code === String(code));
        if (!found && list[0] && list[0].psgc_id) {
            found = list.find((item) => item.psgc_id === String(code));
        }
        if (found) return found.name;
        let nameMatch = list.find(
            (item) =>
                item.name.toLowerCase().trim() ===
                String(code).toLowerCase().trim()
        );
        if (nameMatch) return nameMatch.name;
        return code;
    }

    function formatClinicAddress(clinic) {
        const cityOrMunicipality =
            getPSGCName("cities", clinic.city_municipality_code) ||
            getPSGCName("municipalities", clinic.city_municipality_code);
        const parts = [
            clinic.street_address,
            getPSGCName("barangays", clinic.barangay_code),
            cityOrMunicipality,
            getPSGCName("provinces", clinic.province_code),
            getPSGCName("regions", clinic.region_code),
            clinic.address_details,
        ];
        return parts.filter(Boolean).join(", ");
    }

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
            <Head title="Clinic Details" />

            <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white/95 p-10 rounded-2xl border border-blue-100 shadow-sm">
                        <CardHeader className="mb-6 pb-2 border-b border-blue-50">
                            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                                <Info className="w-6 h-6 text-blue-400" />{" "}
                                Clinic Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Profile Header: Logo, Name, Status Badge */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10">
                                <ClinicLogo
                                    clinic={clinic}
                                    className="h-24 w-24 rounded-full border-4 border-blue-200 shadow bg-white object-cover"
                                />
                                <div className="flex flex-col items-center md:items-start gap-2">
                                    <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-2">
                                        {clinic.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-1">
                                        <BadgeCheck
                                            className={`w-5 h-5 ${
                                                clinic.is_active
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        />
                                        <Badge
                                            variant={
                                                clinic.is_active
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            className="text-base px-3 py-1 w-fit"
                                        >
                                            {clinic.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            {/* Info Block Row */}
                            <div className="flex flex-wrap gap-8 justify-between mb-8">
                                <div className="min-w-[240px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <MapPin className="w-5 h-5" /> Address
                                    </div>
                                    <div className="text-gray-800">
                                        {formatClinicAddress(clinic)}
                                    </div>
                                </div>
                                <div className="min-w-[200px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <Mail className="w-5 h-5" /> Contact
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Mail className="w-4 h-4 text-blue-400" />
                                        {clinic.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Phone className="w-4 h-4 text-blue-400" />
                                        {clinic.contact_number}
                                    </div>
                                </div>
                                <div className="min-w-[180px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <BadgeCheck className="w-5 h-5 text-yellow-500" />{" "}
                                        License
                                    </div>
                                    <div className="text-gray-800">
                                        {clinic.license_number}
                                    </div>
                                </div>
                                <div className="min-w-[200px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <Star className="w-5 h-5 text-cyan-500" />{" "}
                                        Plan
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-blue-700 text-lg">
                                            {SUBSCRIPTION_PLANS[
                                                clinic.subscription_plan
                                            ]?.label ||
                                                clinic.subscription_plan}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {
                                                SUBSCRIPTION_PLANS[
                                                    clinic.subscription_plan
                                                ]?.price
                                            }
                                        </span>
                                    </div>
                                    <Badge
                                        variant={
                                            clinic.subscription_status ===
                                            "active"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="text-xs px-2 py-0.5 mt-1 w-fit"
                                    >
                                        {clinic.subscription_status}
                                    </Badge>
                                </div>
                                <div className="min-w-[240px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <FileText className="w-5 h-5" />{" "}
                                        Description
                                    </div>
                                    <div className="text-gray-800">
                                        {clinic.description ||
                                            "No description available."}
                                    </div>
                                </div>
                                <div className="min-w-[200px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <Info className="w-5 h-5" /> Additional
                                    </div>
                                    <div className="text-gray-800">
                                        {clinic.address_details || "-"}
                                    </div>
                                </div>
                                <div className="min-w-[140px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <BadgeCheck className="w-5 h-5 text-blue-400" />{" "}
                                        Postal Code
                                    </div>
                                    <div className="text-gray-800">
                                        {clinic.postal_code}
                                    </div>
                                </div>
                                <div className="min-w-[200px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <Info className="w-5 h-5" /> Stats
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                                        <span>
                                            Patients:{" "}
                                            <span className="font-bold">
                                                {clinic.patients?.length ?? 0}
                                            </span>
                                        </span>
                                        <span>
                                            Appointments:{" "}
                                            <span className="font-bold">
                                                {clinic.appointments?.length ??
                                                    0}
                                            </span>
                                        </span>
                                        <span>
                                            Staff:{" "}
                                            <span className="font-bold">
                                                {clinic.users?.length ?? 0}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="min-w-[200px] flex-1 bg-blue-50/60 rounded-xl p-6 flex flex-col items-start gap-2 shadow-sm">
                                    <div className="flex items-center gap-2 text-blue-500 font-semibold">
                                        <CalendarCheck className="w-5 h-5" />{" "}
                                        Dates
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <span>
                                            Created:{" "}
                                            <span className="font-bold">
                                                {clinic.created_at
                                                    ? new Date(
                                                          clinic.created_at
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </span>
                                        </span>
                                        <br />
                                        <span>
                                            Last Updated:{" "}
                                            <span className="font-bold">
                                                {clinic.updated_at
                                                    ? new Date(
                                                          clinic.updated_at
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {clinic.users && clinic.users.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-5 h-5 text-blue-400" />
                                        <span className="font-semibold text-gray-700">
                                            Clinic Users
                                        </span>
                                    </div>
                                    <ul className="divide-y divide-blue-50">
                                        {clinic.users.map((user) => (
                                            <li
                                                key={user.id}
                                                className="py-2 flex flex-col md:flex-row md:items-center md:gap-2"
                                            >
                                                <span className="font-medium text-gray-900">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {user.email}
                                                </span>
                                                <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                                                    {user.role}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-10">
                                <Button
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="w-full sm:w-auto"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={() =>
                                        (window.location.href = route(
                                            "admin.clinics.edit",
                                            clinic.id
                                        ))
                                    }
                                    className="w-full sm:w-auto"
                                >
                                    Edit Clinic
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
