import GuestLayout from "@/Layouts/GuestLayout";
import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    Star,
    ArrowRight,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";

export default function ClinicDirectory({ clinics }) {
    const [searchTerm, setSearchTerm] = useState("");
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

    if (
        !psgc.regions.length ||
        !psgc.provinces.length ||
        !psgc.cities.length ||
        !psgc.municipalities.length ||
        !psgc.barangays.length
    ) {
        return <div>Loading clinics...</div>;
    }

    function getPSGCName(type, code) {
        if (!code) return "";
        const list = psgc[type];
        if (!list) return code;
        // Try to match by 'code' (the field in your JSON)
        let found = list.find((item) => item.code === String(code));
        // Fallback: Try to match by 'psgc_id' (for compatibility with other PSGC formats)
        if (!found && list[0] && list[0].psgc_id) {
            found = list.find((item) => item.psgc_id === String(code));
        }
        if (found) return found.name;
        // If not found, check if the code is already a name (case-insensitive)
        let nameMatch = list.find(
            (item) =>
                item.name.toLowerCase().trim() ===
                String(code).toLowerCase().trim()
        );
        if (nameMatch) return nameMatch.name;
        // If not found, just return the code (for seeded clinics with names)
        return code;
    }

    const planColors = {
        basic: "bg-gray-200 text-gray-800",
        premium: "bg-blue-200 text-blue-800",
        enterprise: "bg-yellow-200 text-yellow-800",
    };

    const filteredClinics =
        clinics.data?.filter(
            (clinic) =>
                clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (clinic.street_address &&
                    clinic.street_address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (clinic.description &&
                    clinic.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
        ) || [];

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
        <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen flex flex-col">
            <SiteHeader />
            {/* Hero Section: slightly more pronounced gradient */}
            <section className="relative z-10 bg-gradient-to-br from-blue-50 via-white to-cyan-100 pb-0">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-16 px-4 sm:px-8 lg:px-16 text-center">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4 font-montserrat">
                        Find Your Perfect{" "}
                        <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                            Dental Clinic
                        </span>
                    </h1>
                    <p className="mt-2 mb-8 text-lg text-gray-500 max-w-2xl font-medium">
                        Discover professional dental clinics in your area.
                        Browse through our network of trusted dental practices
                        and book your next appointment with ease.
                    </p>
                </div>
            </section>
            {/* Search/Filters section: aligned, integrated, white background */}
            <section className="bg-white w-full py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
                    <div className="w-full">
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 text-gray-900 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Search clinics by name, location, or services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-blue-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <div className="w-full text-left text-sm text-gray-500 mt-2">
                            Showing {filteredClinics.length} of{" "}
                            {clinics.data?.length || 0} clinics
                        </div>
                    </div>
                </div>
            </section>
            {/* Clinics grid: blue-50 background, cards are white */}
            <section className="py-16 bg-blue-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8 lg:px-16">
                    {filteredClinics.length > 0 ? (
                        filteredClinics.map((clinic) => (
                            <div
                                key={clinic.id}
                                className="flex flex-col justify-between bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 overflow-hidden border border-gray-100 group relative min-h-[420px]"
                            >
                                {/* Top: Logo and Name */}
                                <div className="flex flex-col items-center px-6 pt-8 pb-2">
                                    {/* Logo - larger and prominent */}
                                    <div className="mb-3">
                                        <img
                                            src={
                                                clinic.logo_url ||
                                                "/images/clinic-logo.png"
                                            }
                                            alt={clinic.name}
                                            className="h-24 w-24 rounded-full object-cover bg-gray-100 shadow-lg border-4 border-blue-200 group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                    {/* Clinic Name */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center font-inter">
                                        {clinic.name}
                                    </h3>
                                    {/* Address with icon */}
                                    <div className="flex items-center justify-center text-sm text-gray-500 mb-2 gap-1 text-center">
                                        <MapPin className="w-4 h-4 text-blue-400" />
                                        <span className="leading-tight">
                                            {formatClinicAddress(clinic)}
                                        </span>
                                    </div>
                                </div>
                                {/* Middle: Contact Info and Description */}
                                <div className="flex flex-col items-center px-6 pb-2">
                                    {/* Contact Info Box */}
                                    <div className="w-full bg-blue-50 rounded-lg px-4 py-2 mb-2 flex flex-col gap-1 items-center">
                                        {clinic.contact_number && (
                                            <div className="flex items-center gap-2 text-blue-700 text-sm">
                                                <Phone className="w-4 h-4" />
                                                <span className="font-medium">
                                                    {clinic.contact_number}
                                                </span>
                                            </div>
                                        )}
                                        {clinic.email && (
                                            <div className="flex items-center gap-2 text-blue-700 text-sm">
                                                <Mail className="w-4 h-4" />
                                                <span className="font-medium truncate max-w-[180px]">
                                                    {clinic.email}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Description */}
                                    {clinic.description && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2 text-center font-inter">
                                            {clinic.description}
                                        </p>
                                    )}
                                </div>
                                {/* Bottom: View Profile Button */}
                                <div className="mt-auto px-6 pb-8 pt-2 w-full">
                                    <Link
                                        href={route("public.clinics.profile", {
                                            slug: clinic.slug,
                                        })}
                                        className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 font-inter"
                                    >
                                        View Profile
                                        <svg
                                            className="ml-2 h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No clinics found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm
                                    ? `No clinics match "${searchTerm}". Try adjusting your search.`
                                    : "No clinics are currently available."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {clinics.links && clinics.links.length > 3 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {clinics.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || "#"}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        link.active
                                            ? "bg-blue-600 text-white"
                                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                    } ${
                                        !link.url
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 mt-16">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                    <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                        <div className="space-y-8 xl:col-span-1">
                            <h3 className="text-2xl font-bold text-white">
                                Smile Suite
                            </h3>
                            <p className="text-gray-300 text-base">
                                Cloud-based dental clinic management solution
                                designed to streamline your practice operations.
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                            <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                        Platform
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                        <li>
                                            <Link
                                                href="/#features"
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                Features
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/"
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                Home
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="mt-12 md:mt-0">
                                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                        Support
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                        <li>
                                            <Link
                                                href="/#about"
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={route("login")}
                                                className="text-base text-gray-300 hover:text-white"
                                            >
                                                Login
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 border-t border-gray-700 pt-8">
                        <p className="text-base text-gray-400 xl:text-center">
                            &copy; 2024 Smile Suite. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
