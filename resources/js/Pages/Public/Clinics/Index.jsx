import GuestLayout from "@/Layouts/GuestLayout";
import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import {
    MapPin,
    Phone,
    Mail,
    ShieldCheck,
    Search,
    Building2,
    Filter,
    Star,
    Clock,
    Users,
    Calendar,
    Heart,
    Eye,
    BookOpen,
    Award,
    CheckCircle,
    TrendingUp,
    Globe,
    ArrowRight,
    Sparkles,
    Facebook,
    Twitter,
    Instagram,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";

export default function ClinicDirectory({ clinics }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [sortBy, setSortBy] = useState("name"); // name, location, rating
    const [favorites, setFavorites] = useState([]);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading clinic directory...</p>
                </div>
            </div>
        );
    }

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

    function getShortAddress(clinic) {
        const cityOrMunicipality =
            getPSGCName("cities", clinic.city_municipality_code) ||
            getPSGCName("municipalities", clinic.city_municipality_code);
        const province = getPSGCName("provinces", clinic.province_code);

        const parts = [cityOrMunicipality, province].filter(Boolean);
        return parts.join(", ");
    }

    // Filter clinics based on search and location filters
    const filteredClinics =
        clinics.data?.filter((clinic) => {
            const matchesSearch =
                clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (clinic.street_address &&
                    clinic.street_address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (clinic.description &&
                    clinic.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));

            const matchesRegion =
                !selectedRegion ||
                getPSGCName("regions", clinic.region_code) === selectedRegion;

            const matchesProvince =
                !selectedProvince ||
                getPSGCName("provinces", clinic.province_code) ===
                    selectedProvince;

            const matchesCity =
                !selectedCity ||
                getPSGCName("cities", clinic.city_municipality_code) ===
                    selectedCity ||
                getPSGCName("municipalities", clinic.city_municipality_code) ===
                    selectedCity;

            return (
                matchesSearch && matchesRegion && matchesProvince && matchesCity
            );
        }) || [];

    // Sort clinics based on selected criteria
    const sortedClinics = [...filteredClinics].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.name.localeCompare(b.name);
            case "location":
                return getShortAddress(a).localeCompare(getShortAddress(b));
            case "rating":
                // For now, we'll use a mock rating system
                return Math.random() - 0.5; // Random sorting for demo
            default:
                return 0;
        }
    });

    // Get unique regions, provinces, and cities for filters
    const availableRegions = [
        ...new Set(
            clinics.data
                ?.map((clinic) => getPSGCName("regions", clinic.region_code))
                .filter(Boolean)
        ),
    ].sort();

    const availableProvinces = [
        ...new Set(
            clinics.data
                ?.map((clinic) =>
                    getPSGCName("provinces", clinic.province_code)
                )
                .filter(Boolean)
        ),
    ].sort();

    const availableCities = [
        ...new Set(
            clinics.data
                ?.map(
                    (clinic) =>
                        getPSGCName("cities", clinic.city_municipality_code) ||
                        getPSGCName(
                            "municipalities",
                            clinic.city_municipality_code
                        )
                )
                .filter(Boolean)
        ),
    ].sort();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-indigo-600/20"></div>
                <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-36 -translate-y-36"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                            <Building2 className="w-4 h-4 mr-2" />
                            Clinic Directory
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Find Your Perfect{" "}
                            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                                Dental Clinic
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Discover trusted dental clinics in your area. Browse
                            our network of professional dental practices and
                            find the perfect match for your oral health needs.
                        </p>

                        {/* Enhanced Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold mb-1">
                                        {clinics.data?.length || 0}+
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        Active Clinics
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold mb-1">
                                        100%
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        Verified & Trusted
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-center mb-2">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold mb-1">
                                        24/7
                                    </div>
                                    <div className="text-blue-100 text-sm">
                                        Easy Booking
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex flex-wrap justify-center items-center gap-6 text-blue-100">
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
                                <span className="text-sm">HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center">
                                <Award className="w-4 h-4 mr-2 text-yellow-300" />
                                <span className="text-sm">Award Winning</span>
                            </div>
                            <div className="flex items-center">
                                <TrendingUp className="w-4 h-4 mr-2 text-blue-300" />
                                <span className="text-sm">Growing Network</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Search and Filters Section */}
            <section className="relative -mt-6 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative max-w-2xl mx-auto">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                                    placeholder="Search clinics by name, location, or services..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Enhanced Filters and Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
                            <div className="text-center">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Region
                                </label>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => {
                                        setSelectedRegion(e.target.value);
                                        setSelectedProvince("");
                                        setSelectedCity("");
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                >
                                    <option value="">All Regions</option>
                                    {availableRegions.map((region) => (
                                        <option key={region} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-center">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Province
                                </label>
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => {
                                        setSelectedProvince(e.target.value);
                                        setSelectedCity("");
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    disabled={!selectedRegion}
                                >
                                    <option value="">All Provinces</option>
                                    {availableProvinces.map((province) => (
                                        <option key={province} value={province}>
                                            {province}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-center">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City/Municipality
                                </label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) =>
                                        setSelectedCity(e.target.value)
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                    disabled={!selectedProvince}
                                >
                                    <option value="">All Cities</option>
                                    {availableCities.map((city) => (
                                        <option key={city} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Enhanced Results Counter and Controls */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                                    Showing {sortedClinics.length} of{" "}
                                    {clinics.data?.length || 0} clinics
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Sort by:
                                    </span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="name">Name</option>
                                        <option value="location">
                                            Location
                                        </option>
                                        <option value="rating">Rating</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    View:
                                </span>
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-1.5 rounded-md transition-colors ${
                                            viewMode === "grid"
                                                ? "bg-white shadow-sm text-blue-600"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`p-1.5 rounded-md transition-colors ${
                                            viewMode === "list"
                                                ? "bg-white shadow-sm text-blue-600"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Clinics Gallery */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                            <Building2 className="w-4 h-4 mr-2" />
                            Available Clinics
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Trusted Dental Clinics
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Choose from our network of professional dental
                            clinics, each committed to providing exceptional
                            care and outstanding patient experience
                        </p>
                    </div>

                    {/* Enhanced Clinics Display */}
                    {sortedClinics.length > 0 ? (
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                                    : "space-y-6"
                            }
                        >
                            {sortedClinics.map((clinic) => (
                                <div
                                    key={clinic.id}
                                    className={`group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 flex flex-col h-full ${
                                        viewMode === "list" ? "flex-row" : ""
                                    }`}
                                >
                                    {/* Modern Header with Enhanced Gradient Background */}
                                    <div className="relative bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-6 border-b border-blue-200/50">
                                        {/* Subtle Pattern Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-200/10 rounded-t-2xl"></div>
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-12 translate-x-12"></div>
                                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full -translate-y-8 -translate-x-8"></div>

                                        {/* Clinic Logo and Info */}
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5">
                                                    <img
                                                        src={
                                                            clinic.logo_url ||
                                                            "/images/clinic-logo.png"
                                                        }
                                                        alt={clinic.name}
                                                        className="w-full h-full rounded-xl object-cover"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "/images/clinic-logo.png";
                                                        }}
                                                    />
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                                    <ShieldCheck className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                                                    {clinic.name}
                                                </h3>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                                        Verified
                                                    </div>
                                                    <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                                                        <Star className="w-3 h-3 mr-1 fill-current" />
                                                        4.8
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 flex flex-col p-6">
                                        {/* Location */}
                                        <div className="mb-4">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-700 font-medium line-clamp-2">
                                                        {getShortAddress(
                                                            clinic
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="mb-6">
                                            <div className="space-y-3">
                                                {clinic.contact_number && (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                                            <Phone className="w-4 h-4 text-green-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800">
                                                            {
                                                                clinic.contact_number
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                {clinic.email && (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                                            <Mail className="w-4 h-4 text-purple-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-800 truncate">
                                                            {clinic.email}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="flex-1 mb-6">
                                            {clinic.description ? (
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <p
                                                        className={`text-sm text-gray-700 leading-relaxed ${
                                                            expandedDescriptions[
                                                                clinic.id
                                                            ]
                                                                ? ""
                                                                : "line-clamp-2 h-12"
                                                        }`}
                                                    >
                                                        {clinic.description}
                                                    </p>
                                                    {clinic.description.length >
                                                        100 && (
                                                        <button
                                                            onClick={() => {
                                                                setExpandedDescriptions(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [clinic.id]:
                                                                            !prev[
                                                                                clinic
                                                                                    .id
                                                                            ],
                                                                    })
                                                                );
                                                            }}
                                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 transition-colors flex items-center"
                                                        >
                                                            {expandedDescriptions[
                                                                clinic.id
                                                            ]
                                                                ? "See Less"
                                                                : "See More"}
                                                            <ArrowRight
                                                                className={`w-3 h-3 ml-1 transition-transform ${
                                                                    expandedDescriptions[
                                                                        clinic
                                                                            .id
                                                                    ]
                                                                        ? "rotate-180"
                                                                        : ""
                                                                }`}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-12"></div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="mt-auto space-y-3">
                                            <Link
                                                href={route(
                                                    "public.clinics.profile",
                                                    {
                                                        slug: clinic.slug,
                                                    }
                                                )}
                                                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm group-hover:scale-105 shadow-lg"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </Link>
                                            <button
                                                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 text-sm group-hover:scale-105 shadow-lg"
                                                onClick={() => {
                                                    window.open(
                                                        route(
                                                            "public.clinics.profile",
                                                            {
                                                                slug: clinic.slug,
                                                            }
                                                        ),
                                                        "_blank"
                                                    );
                                                }}
                                            >
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Book Appointment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                                <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    No clinics found
                                </h3>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    {searchTerm ||
                                    selectedRegion ||
                                    selectedProvince ||
                                    selectedCity
                                        ? "No clinics match your search criteria. Try adjusting your filters."
                                        : "No clinics are currently available in your area."}
                                </p>
                                {(searchTerm ||
                                    selectedRegion ||
                                    selectedProvince ||
                                    selectedCity) && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedRegion("");
                                            setSelectedProvince("");
                                            setSelectedCity("");
                                        }}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {clinics.links && clinics.links.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <nav className="bg-white rounded-xl shadow-lg border border-gray-100 p-2">
                                <div className="flex items-center space-x-1">
                                    {clinics.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || "#"}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                link.active
                                                    ? "bg-blue-600 text-white shadow-lg"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                                </div>
                            </nav>
                        </div>
                    )}
                </div>
            </section>

            {/* Enhanced Compact Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Logo and Description */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/images/smile-suite-logo.png"
                                    alt="Smile Suite"
                                    className="w-10 h-10"
                                />
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Smile Suite
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Dental Practice Management Platform
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-8">
                            <Link
                                href="/#features"
                                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                Features
                            </Link>
                            <Link
                                href="/"
                                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                Home
                            </Link>
                            <Link
                                href={route("register.clinic")}
                                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                Register
                            </Link>
                            <Link
                                href={route("login")}
                                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                            >
                                Login
                            </Link>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                        <p className="text-sm text-gray-400">
                            &copy; 2024 Smile Suite. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
