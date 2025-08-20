import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    FileText,
    Calendar,
    Star,
    BadgeCheck,
    ArrowLeft,
    Save,
    X,
    AlertCircle,
} from "lucide-react";

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
        price: "₱999/month",
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
        price: "₱1,999/month",
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
        price: "₱2,999/month",
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
        subscription_start_date: clinic.subscription_start_date
            ? new Date(clinic.subscription_start_date)
                  .toISOString()
                  .split("T")[0]
            : new Date().toISOString().split("T")[0],
        subscription_end_date: clinic.subscription_end_date
            ? new Date(clinic.subscription_end_date).toISOString().split("T")[0]
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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

    // Fetch regions on component mount
    useEffect(() => {
        console.log("Fetching regions...");
        axios
            .get(route("psgc.regions"))
            .then((response) => {
                console.log("Regions fetched:", response.data);
                const formattedRegions = response.data.map((region) => ({
                    psgc_id: region.code,
                    name: region.name,
                    correspondence_code: region.code,
                    geographic_level: "Reg",
                }));
                setRegions(formattedRegions || []);
            })
            .catch((error) => {
                console.error("Error fetching regions:", error);
            });
    }, []);

    // Fetch provinces when region changes
    useEffect(() => {
        if (selectedRegion) {
            console.log("Fetching provinces for region:", selectedRegion);
            axios
                .get(route("psgc.provinces", { regionId: selectedRegion }))
                .then((response) => {
                    console.log("Provinces fetched:", response.data);
                    const formattedProvinces = response.data.map(
                        (province) => ({
                            psgc_id: province.code,
                            name: province.name,
                            correspondence_code: province.code,
                            geographic_level: "Prov",
                            region_code: selectedRegion,
                        })
                    );
                    setProvinces(formattedProvinces || []);

                    // Only clear child selections if this is a new region selection (not initial load)
                    if (selectedRegion !== clinic.region_code) {
                        setCitiesMunicipalities([]);
                        setBarangays([]);
                        setSelectedProvince("");
                        setSelectedCityMunicipality("");
                        setSelectedBarangay("");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching provinces:", error);
                    setProvinces([]);
                });
        } else {
            setProvinces([]);
            setCitiesMunicipalities([]);
            setBarangays([]);
            setSelectedProvince("");
            setSelectedCityMunicipality("");
            setSelectedBarangay("");
        }
    }, [selectedRegion, clinic.region_code]);

    // Fetch cities/municipalities when province changes
    useEffect(() => {
        if (selectedProvince) {
            console.log(
                "Fetching cities/municipalities for province:",
                selectedProvince
            );
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
                        console.log("Cities fetched:", citiesResponse.data);
                        console.log(
                            "Municipalities fetched:",
                            municipalitiesResponse.data
                        );

                        const cities = (citiesResponse.data || []).map(
                            (city) => ({
                                psgc_id: city.code,
                                name: city.name,
                                correspondence_code: city.code,
                                geographic_level: "City",
                                province_code: selectedProvince,
                            })
                        );

                        const municipalities = (
                            municipalitiesResponse.data || []
                        ).map((municipality) => ({
                            psgc_id: municipality.code,
                            name: municipality.name,
                            correspondence_code: municipality.code,
                            geographic_level: "Mun",
                            province_code: selectedProvince,
                        }));

                        const combined = [...cities, ...municipalities];
                        combined.sort((a, b) => a.name.localeCompare(b.name));
                        setCitiesMunicipalities(combined);

                        // Only clear child selections if this is a new province selection (not initial load)
                        if (selectedProvince !== clinic.province_code) {
                            setBarangays([]);
                            setSelectedCityMunicipality("");
                            setSelectedBarangay("");
                        }
                    })
                )
                .catch((error) => {
                    console.error(
                        "Error fetching cities/municipalities:",
                        error
                    );
                    setCitiesMunicipalities([]);
                });
        } else {
            setCitiesMunicipalities([]);
            setBarangays([]);
            setSelectedCityMunicipality("");
            setSelectedBarangay("");
        }
    }, [selectedProvince, clinic.province_code]);

    // Fetch barangays when city/municipality changes
    useEffect(() => {
        if (selectedCityMunicipality) {
            console.log(
                "Fetching barangays for city/municipality:",
                selectedCityMunicipality
            );
            const selectedItem = citiesMunicipalities.find(
                (item) => item.psgc_id === selectedCityMunicipality
            );
            const paramName =
                selectedItem && selectedItem.geographic_level === "City"
                    ? "cityId"
                    : "municipalityId";
            const apiUrl = route("psgc.barangays", {
                [paramName]: selectedCityMunicipality,
            });

            axios
                .get(apiUrl)
                .then((response) => {
                    console.log("Barangays fetched:", response.data);
                    const formattedBarangays = response.data.map(
                        (barangay) => ({
                            psgc_id: barangay.code,
                            name: barangay.name,
                            correspondence_code: barangay.code,
                            geographic_level: "Bgy",
                            city_code: selectedCityMunicipality,
                        })
                    );
                    setBarangays(formattedBarangays || []);

                    // Only clear barangay selection if this is a new city/municipality selection (not initial load)
                    if (
                        selectedCityMunicipality !==
                        clinic.city_municipality_code
                    ) {
                        setSelectedBarangay("");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching barangays:", error);
                    setBarangays([]);
                });
        } else {
            setBarangays([]);
            setSelectedBarangay("");
        }
    }, [
        selectedCityMunicipality,
        citiesMunicipalities,
        clinic.city_municipality_code,
    ]);

    // Update form data when PSGC selections change
    useEffect(() => {
        setData({
            ...data,
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
    ]);

    // Pre-populate PSGC data when component loads with existing clinic data
    useEffect(() => {
        if (clinic.region_code && regions.length > 0) {
            // If clinic has region_code and regions are loaded, fetch provinces
            axios
                .get(route("psgc.provinces", { regionId: clinic.region_code }))
                .then((response) => {
                    const formattedProvinces = response.data.map(
                        (province) => ({
                            psgc_id: province.code,
                            name: province.name,
                            correspondence_code: province.code,
                            geographic_level: "Prov",
                            region_code: clinic.region_code,
                        })
                    );
                    setProvinces(formattedProvinces || []);

                    // If clinic has province_code, fetch cities/municipalities
                    if (clinic.province_code) {
                        axios
                            .all([
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
                            ])
                            .then(
                                axios.spread(
                                    (
                                        citiesResponse,
                                        municipalitiesResponse
                                    ) => {
                                        const cities = (
                                            citiesResponse.data || []
                                        ).map((city) => ({
                                            psgc_id: city.code,
                                            name: city.name,
                                            correspondence_code: city.code,
                                            geographic_level: "City",
                                            province_code: clinic.province_code,
                                        }));

                                        const municipalities = (
                                            municipalitiesResponse.data || []
                                        ).map((municipality) => ({
                                            psgc_id: municipality.code,
                                            name: municipality.name,
                                            correspondence_code:
                                                municipality.code,
                                            geographic_level: "Mun",
                                            province_code: clinic.province_code,
                                        }));

                                        const combined = [
                                            ...cities,
                                            ...municipalities,
                                        ];
                                        combined.sort((a, b) =>
                                            a.name.localeCompare(b.name)
                                        );
                                        setCitiesMunicipalities(combined);

                                        // If clinic has city_municipality_code, fetch barangays
                                        if (clinic.city_municipality_code) {
                                            const selectedItem = combined.find(
                                                (item) =>
                                                    item.psgc_id ===
                                                    clinic.city_municipality_code
                                            );
                                            const paramName =
                                                selectedItem &&
                                                selectedItem.geographic_level ===
                                                    "City"
                                                    ? "cityId"
                                                    : "municipalityId";
                                            const apiUrl = route(
                                                "psgc.barangays",
                                                {
                                                    [paramName]:
                                                        clinic.city_municipality_code,
                                                }
                                            );

                                            axios
                                                .get(apiUrl)
                                                .then((response) => {
                                                    const formattedBarangays =
                                                        response.data.map(
                                                            (barangay) => ({
                                                                psgc_id:
                                                                    barangay.code,
                                                                name: barangay.name,
                                                                correspondence_code:
                                                                    barangay.code,
                                                                geographic_level:
                                                                    "Bgy",
                                                                city_code:
                                                                    clinic.city_municipality_code,
                                                            })
                                                        );
                                                    setBarangays(
                                                        formattedBarangays || []
                                                    );
                                                })
                                                .catch((error) => {
                                                    console.error(
                                                        "Error fetching barangays:",
                                                        error
                                                    );
                                                });
                                        }
                                    }
                                )
                            )
                            .catch((error) => {
                                console.error(
                                    "Error fetching cities/municipalities:",
                                    error
                                );
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error fetching provinces:", error);
                });
        }
    }, [
        regions,
        clinic.region_code,
        clinic.province_code,
        clinic.city_municipality_code,
    ]);

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
        >
            <Head title="Edit Clinic" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Building2 className="w-5 h-5 text-white" />
                                        </div>
                                        Edit Clinic
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        Update clinic information and settings
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route("admin.clinics.index")
                                            )
                                        }
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm flex items-center gap-2"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Clinics
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information Section */}
                                <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50/30 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                            <Building2 className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Basic Information
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="name"
                                                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                                            >
                                                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                                                Clinic Name
                                            </label>
                                            <input
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
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                                placeholder="Enter clinic name"
                                            />
                                            {errors.name && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                                            >
                                                <Mail className="w-3.5 h-3.5 text-blue-500" />
                                                Email
                                            </label>
                                            <input
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
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="contact_number"
                                                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                                            >
                                                <Phone className="w-3.5 h-3.5 text-blue-500" />
                                                Contact Number
                                            </label>
                                            <input
                                                id="contact_number"
                                                type="text"
                                                value={data.contact_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "contact_number",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                                placeholder="Enter contact number"
                                            />
                                            {errors.contact_number && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.contact_number}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="license_number"
                                                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                                            >
                                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                                License Number
                                            </label>
                                            <input
                                                id="license_number"
                                                type="text"
                                                value={data.license_number}
                                                onChange={(e) =>
                                                    setData(
                                                        "license_number",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                                placeholder="Enter license number"
                                            />
                                            {errors.license_number && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.license_number}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label
                                                htmlFor="description"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter clinic description"
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm h-24 resize-none"
                                            />
                                            {errors.description && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Address Section */}
                                <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50/30 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Address Information
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="region"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Region
                                            </label>
                                            <select
                                                id="region"
                                                value={selectedRegion}
                                                onChange={(e) =>
                                                    setSelectedRegion(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                                            >
                                                <option value="">
                                                    Select a region
                                                </option>
                                                {regions.map((region) => (
                                                    <option
                                                        key={`region-${region.psgc_id}`}
                                                        value={region.psgc_id}
                                                    >
                                                        {region.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="province"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Province
                                            </label>
                                            <select
                                                id="province"
                                                value={selectedProvince}
                                                onChange={(e) =>
                                                    setSelectedProvince(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    !selectedRegion ||
                                                    provinces.length === 0
                                                }
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">
                                                    Select a province
                                                </option>
                                                {provinces.map((province) => (
                                                    <option
                                                        key={`province-${province.psgc_id}`}
                                                        value={province.psgc_id}
                                                    >
                                                        {province.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="city_municipality"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                City / Municipality
                                            </label>
                                            <select
                                                id="city_municipality"
                                                value={selectedCityMunicipality}
                                                onChange={(e) =>
                                                    setSelectedCityMunicipality(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    !selectedProvince ||
                                                    citiesMunicipalities.length ===
                                                        0
                                                }
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">
                                                    Select a city or
                                                    municipality
                                                </option>
                                                {citiesMunicipalities.map(
                                                    (item) => (
                                                        <option
                                                            key={`citymun-${item.psgc_id}`}
                                                            value={item.psgc_id}
                                                        >
                                                            {item.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="barangay"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Barangay
                                            </label>
                                            <select
                                                id="barangay"
                                                value={selectedBarangay}
                                                onChange={(e) =>
                                                    setSelectedBarangay(
                                                        e.target.value
                                                    )
                                                }
                                                disabled={
                                                    !selectedCityMunicipality ||
                                                    barangays.length === 0
                                                }
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">
                                                    Select a barangay
                                                </option>
                                                {barangays.map((barangay) => (
                                                    <option
                                                        key={`barangay-${barangay.psgc_id}`}
                                                        value={barangay.psgc_id}
                                                    >
                                                        {barangay.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="street_address"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Street Address
                                            </label>
                                            <input
                                                id="street_address"
                                                type="text"
                                                value={data.street_address}
                                                onChange={(e) =>
                                                    setData(
                                                        "street_address",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter street address"
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                            />
                                            {errors.street_address && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.street_address}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="postal_code"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Postal Code
                                            </label>
                                            <input
                                                id="postal_code"
                                                type="text"
                                                value={data.postal_code}
                                                onChange={(e) =>
                                                    setData(
                                                        "postal_code",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter postal code"
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                            />
                                            {errors.postal_code && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.postal_code}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label
                                                htmlFor="address_details"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Additional Address Details
                                            </label>
                                            <textarea
                                                id="address_details"
                                                value={data.address_details}
                                                onChange={(e) =>
                                                    setData(
                                                        "address_details",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter any additional address details (e.g., landmarks, directions)"
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm h-24 resize-none"
                                            />
                                            {errors.address_details && (
                                                <div className="text-red-500 text-sm flex items-center gap-1">
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    {errors.address_details}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription Section */}
                                <div className="bg-gradient-to-r from-blue-50 via-white to-cyan-50/30 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                                            <Star className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Subscription Details
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="subscription_plan"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Subscription Plan
                                            </label>
                                            <select
                                                id="subscription_plan"
                                                value={data.subscription_plan}
                                                onChange={(e) =>
                                                    setData(
                                                        "subscription_plan",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                                            >
                                                {SUBSCRIPTION_PLANS.map(
                                                    (plan) => (
                                                        <option
                                                            key={plan.value}
                                                            value={plan.value}
                                                        >
                                                            {plan.label}
                                                        </option>
                                                    )
                                                )}
                                            </select>
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
                                            <label
                                                htmlFor="subscription_status"
                                                className="text-sm font-semibold text-gray-700"
                                            >
                                                Subscription Status
                                            </label>
                                            <select
                                                id="subscription_status"
                                                value={data.subscription_status}
                                                onChange={(e) =>
                                                    setData(
                                                        "subscription_status",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                                            >
                                                <option value="trial">
                                                    Trial (14 days)
                                                </option>
                                                <option value="active">
                                                    Active
                                                </option>
                                                <option value="inactive">
                                                    Inactive
                                                </option>
                                            </select>
                                            {errors.subscription_status && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.subscription_status}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="subscription_start_date"
                                                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                                            >
                                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                Start Date
                                            </label>
                                            <input
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
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
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
                                            <label
                                                htmlFor="subscription_end_date"
                                                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                                            >
                                                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                End Date
                                            </label>
                                            <input
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
                                                className="w-full px-3 py-2.5 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
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
                                            <input
                                                id="is_active"
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) =>
                                                    setData(
                                                        "is_active",
                                                        e.target.checked
                                                    )
                                                }
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <label
                                                htmlFor="is_active"
                                                className="text-sm font-semibold text-gray-700 flex items-center gap-1"
                                            >
                                                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                                                Active Status
                                            </label>
                                            {errors.is_active && (
                                                <div className="text-red-500 text-sm">
                                                    {errors.is_active}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-6 border-t border-blue-100">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.visit(
                                                route("admin.clinics.index")
                                            )
                                        }
                                        className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 text-sm"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Update Clinic
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
