import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";

export default function Edit({ auth, patient, regions }) {
    // Debug: Log the regions prop
    console.log("Regions prop received:", {
        regions,
        type: typeof regions,
        isArray: Array.isArray(regions),
        length: regions ? regions.length : "undefined",
    });

    const { data, setData, put, processing, errors } = useForm({
        first_name: patient.first_name || "",
        last_name: patient.last_name || "",
        email: patient.email || "",
        phone_number: patient.phone_number || "",
        date_of_birth: patient.date_of_birth || "",
        gender: patient.gender || "",
        region_code: patient.region_code || "",
        province_code: patient.province_code || "",
        city_municipality_code: patient.city_municipality_code || "",
        barangay_code: patient.barangay_code || "",
        postal_code: patient.postal_code || "",
        address_details: patient.address_details || "",
        medical_history: patient.medical_history || "",
        allergies: patient.allergies || "",
        blood_type: patient.blood_type || "unknown",
        occupation: patient.occupation || "",
        marital_status: patient.marital_status || "",
        last_dental_visit: patient.last_dental_visit || "",
        notes: patient.notes || "",
        street_address: patient.street_address || "",
        emergency_contact_name: patient.emergency_contact_name || "",
        emergency_contact_number: patient.emergency_contact_number || "",
        emergency_contact_relationship:
            patient.emergency_contact_relationship || "",
        insurance_provider: patient.insurance_provider || "",
        insurance_policy_number: patient.insurance_policy_number || "",
        category: patient.category || "",
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    // PSGC data state for pre-population
    const [psgcData, setPsgcData] = useState({
        region: null,
        province: null,
        cityMunicipality: null,
        barangay: null,
    });

    // Loading state for PSGC data
    const [isLoadingPsgc, setIsLoadingPsgc] = useState(true);

    // Fetch PSGC data for the patient's location
    useEffect(() => {
        const fetchPSGCData = async () => {
            setIsLoadingPsgc(true);

            // Debug: Log patient data
            console.log("Patient PSGC codes:", {
                region_code: patient.region_code,
                province_code: patient.province_code,
                city_municipality_code: patient.city_municipality_code,
                barangay_code: patient.barangay_code,
            });

            try {
                const newPsgcData = { ...psgcData };
                const promises = [];

                // Fetch region
                if (patient.region_code) {
                    promises.push(
                        axios
                            .get(route("psgc.regions"))
                            .then((response) => {
                                const region = response.data.find(
                                    (r) => r.code === patient.region_code
                                );
                                if (region) {
                                    newPsgcData.region = region;
                                }
                                return { type: "regions", data: response.data };
                            })
                            .catch((error) => {
                                console.error("Error fetching region:", error);
                                return { type: "regions", data: [] };
                            })
                    );
                }

                // Always fetch provinces for the region (even if patient doesn't have province_code)
                if (patient.region_code) {
                    promises.push(
                        axios
                            .get(
                                route("psgc.provinces", {
                                    regionId: patient.region_code,
                                })
                            )
                            .then((response) => {
                                // If patient has province_code, find and set it
                                if (patient.province_code) {
                                    const province = response.data.find(
                                        (p) => p.code === patient.province_code
                                    );
                                    if (province) {
                                        newPsgcData.province = province;
                                    }
                                }
                                setProvinces(response.data);
                                return {
                                    type: "provinces",
                                    data: response.data,
                                };
                            })
                            .catch((error) => {
                                console.error(
                                    "Error fetching province:",
                                    error
                                );
                                return { type: "provinces", data: [] };
                            })
                    );
                }

                // Fetch city/municipality if patient has province_code, or if we have provinces loaded
                if (patient.province_code) {
                    promises.push(
                        Promise.all([
                            axios.get(
                                route("psgc.cities", {
                                    provinceId: patient.province_code,
                                })
                            ),
                            axios.get(
                                route("psgc.municipalities", {
                                    provinceId: patient.province_code,
                                })
                            ),
                        ])
                            .then(
                                ([citiesResponse, municipalitiesResponse]) => {
                                    const city = citiesResponse.data.find(
                                        (c) =>
                                            c.code ===
                                            patient.city_municipality_code
                                    );
                                    const municipality =
                                        municipalitiesResponse.data.find(
                                            (m) =>
                                                m.code ===
                                                patient.city_municipality_code
                                        );
                                    const cityMunicipality =
                                        city || municipality;

                                    if (cityMunicipality) {
                                        newPsgcData.cityMunicipality =
                                            cityMunicipality;
                                    }

                                    // Combine cities and municipalities for dropdown
                                    const cities = (
                                        citiesResponse.data || []
                                    ).map((city) => ({
                                        code: city.code,
                                        name: city.name,
                                    }));
                                    const municipalities = (
                                        municipalitiesResponse.data || []
                                    ).map((municipality) => ({
                                        code: municipality.code,
                                        name: municipality.name,
                                    }));
                                    const combined = [
                                        ...cities,
                                        ...municipalities,
                                    ];
                                    combined.sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                    );
                                    setCities(combined);

                                    return { type: "cities", data: combined };
                                }
                            )
                            .catch((error) => {
                                console.error(
                                    "Error fetching city/municipality:",
                                    error
                                );
                                return { type: "cities", data: [] };
                            })
                    );
                }

                // Fetch barangay if patient has city_municipality_code
                if (
                    patient.barangay_code &&
                    patient.city_municipality_code &&
                    patient.province_code
                ) {
                    promises.push(
                        Promise.all([
                            axios.get(
                                route("psgc.cities", {
                                    provinceId: patient.province_code,
                                })
                            ),
                            axios.get(
                                route("psgc.municipalities", {
                                    provinceId: patient.province_code,
                                })
                            ),
                        ])
                            .then(
                                async ([
                                    citiesResponse,
                                    municipalitiesResponse,
                                ]) => {
                                    const city = citiesResponse.data.find(
                                        (c) =>
                                            c.code ===
                                            patient.city_municipality_code
                                    );
                                    const municipality =
                                        municipalitiesResponse.data.find(
                                            (m) =>
                                                m.code ===
                                                patient.city_municipality_code
                                        );

                                    let barangayResponse;
                                    if (city) {
                                        barangayResponse = await axios.get(
                                            route("psgc.barangays", {
                                                cityId: patient.city_municipality_code,
                                            })
                                        );
                                    } else if (municipality) {
                                        barangayResponse = await axios.get(
                                            route("psgc.barangays", {
                                                municipalityId:
                                                    patient.city_municipality_code,
                                            })
                                        );
                                    }

                                    if (barangayResponse) {
                                        const barangay =
                                            barangayResponse.data.find(
                                                (b) =>
                                                    b.code ===
                                                    patient.barangay_code
                                            );
                                        if (barangay) {
                                            newPsgcData.barangay = barangay;
                                        }
                                        setBarangays(barangayResponse.data);
                                    }

                                    return {
                                        type: "barangays",
                                        data: barangayResponse?.data || [],
                                    };
                                }
                            )
                            .catch((error) => {
                                console.error(
                                    "Error fetching barangay:",
                                    error
                                );
                                return { type: "barangays", data: [] };
                            })
                    );
                }

                // Wait for all promises to resolve
                await Promise.all(promises);
                setPsgcData(newPsgcData);

                // Debug logging
                console.log("PSGC Data loaded:", {
                    region: newPsgcData.region,
                    province: newPsgcData.province,
                    cityMunicipality: newPsgcData.cityMunicipality,
                    barangay: newPsgcData.barangay,
                    provincesCount: provinces.length,
                    citiesCount: cities.length,
                    barangaysCount: barangays.length,
                });
            } catch (error) {
                console.error("Error fetching PSGC data:", error);
            } finally {
                setIsLoadingPsgc(false);
            }
        };

        fetchPSGCData();
    }, [
        patient.region_code,
        patient.province_code,
        patient.city_municipality_code,
        patient.barangay_code,
    ]);

    // Debug useEffect to monitor arrays
    useEffect(() => {
        console.log("Arrays updated:", {
            provincesCount: provinces.length,
            citiesCount: cities.length,
            barangaysCount: barangays.length,
            isLoadingPsgc,
        });
    }, [provinces, cities, barangays, isLoadingPsgc]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prevent submission while PSGC data is loading
        if (isLoadingPsgc) {
            alert(
                "Please wait for address data to finish loading before saving."
            );
            return;
        }

        // Ensure PSGC codes are preserved from original patient data if not changed
        const formData = {
            ...data,
            region_code: data.region_code || patient.region_code || "",
            province_code: data.province_code || patient.province_code || "",
            city_municipality_code:
                data.city_municipality_code ||
                patient.city_municipality_code ||
                "",
            barangay_code: data.barangay_code || patient.barangay_code || "",
        };

        // Debug: Log the PSGC data being submitted
        console.log("Form submission PSGC data:", {
            original: {
                region_code: patient.region_code,
                province_code: patient.province_code,
                city_municipality_code: patient.city_municipality_code,
                barangay_code: patient.barangay_code,
            },
            form: {
                region_code: data.region_code,
                province_code: data.province_code,
                city_municipality_code: data.city_municipality_code,
                barangay_code: data.barangay_code,
            },
            final: {
                region_code: formData.region_code,
                province_code: formData.province_code,
                city_municipality_code: formData.city_municipality_code,
                barangay_code: formData.barangay_code,
            },
        });

        put(
            route("clinic.patients.update", {
                clinic: auth.clinic_id,
                patient: patient.id,
            }),
            formData
        );
    };

    const fetchProvinces = async (regionCode) => {
        try {
            const response = await axios.get(
                route("psgc.provinces", { regionId: regionCode })
            );
            setProvinces(response.data);

            // Only clear province_code if it's different from the current region
            if (data.region_code !== regionCode) {
                setData("province_code", "");
                setData("city_municipality_code", "");
                setData("barangay_code", "");
                setCities([]);
                setBarangays([]);
            }
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

            // Only clear city_municipality_code if it's different from the current province
            if (data.province_code !== provinceCode) {
                setData("city_municipality_code", "");
                setData("barangay_code", "");
                setBarangays([]);
            }
        } catch (error) {
            console.error("Error fetching cities/municipalities:", error);
            setCities([]);
        }
    };

    const fetchBarangays = async (cityCode) => {
        try {
            // Check if the code is for a city or municipality
            const isCity = cities.some((city) => city.code === cityCode);
            const endpoint = isCity ? "cityId" : "municipalityId";

            const response = await axios.get(
                route("psgc.barangays", { [endpoint]: cityCode })
            );

            if (response.data && Array.isArray(response.data)) {
                const formattedBarangays = response.data.map((barangay) => ({
                    code: barangay.code,
                    name: barangay.name,
                }));
                setBarangays(formattedBarangays);

                // Only clear barangay_code if it's different from the current city/municipality
                if (data.city_municipality_code !== cityCode) {
                    setData("barangay_code", "");
                }
            } else {
                console.error("Invalid barangay data received:", response.data);
                setBarangays([]);
            }
        } catch (error) {
            console.error("Error fetching barangays:", error);
            setBarangays([]);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Patient" />

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
                                        <Pencil className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Edit Patient
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Update patient information and details
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
                                    <Pencil className="h-4 w-4 text-white" />
                                </div>
                                Edit Patient Information
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Update the patient's personal and contact
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
                                                value={
                                                    data.date_of_birth
                                                        ? new Date(
                                                              data.date_of_birth
                                                          )
                                                              .toISOString()
                                                              .split("T")[0]
                                                        : ""
                                                }
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
                                                    <SelectItem value="unknown">
                                                        Unknown
                                                    </SelectItem>
                                                    <SelectItem value="A+">
                                                        A+
                                                    </SelectItem>
                                                    <SelectItem value="A-">
                                                        A-
                                                    </SelectItem>
                                                    <SelectItem value="B+">
                                                        B+
                                                    </SelectItem>
                                                    <SelectItem value="B-">
                                                        B-
                                                    </SelectItem>
                                                    <SelectItem value="AB+">
                                                        AB+
                                                    </SelectItem>
                                                    <SelectItem value="AB-">
                                                        AB-
                                                    </SelectItem>
                                                    <SelectItem value="O+">
                                                        O+
                                                    </SelectItem>
                                                    <SelectItem value="O-">
                                                        O-
                                                    </SelectItem>
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
                                                    <SelectItem value="No previous visit">
                                                        No previous visit
                                                    </SelectItem>
                                                    <SelectItem value="Within 3 months">
                                                        Within 3 months
                                                    </SelectItem>
                                                    <SelectItem value="Within 6 months">
                                                        Within 6 months
                                                    </SelectItem>
                                                    <SelectItem value="Within 1 year">
                                                        Within 1 year
                                                    </SelectItem>
                                                    <SelectItem value="More than 1 year">
                                                        More than 1 year
                                                    </SelectItem>
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
                                                    <SelectItem value="none">
                                                        No Category
                                                    </SelectItem>
                                                    <SelectItem value="regular">
                                                        Regular Patient
                                                    </SelectItem>
                                                    <SelectItem value="vip">
                                                        VIP Patient
                                                    </SelectItem>
                                                    <SelectItem value="emergency">
                                                        Emergency Patient
                                                    </SelectItem>
                                                    <SelectItem value="pediatric">
                                                        Pediatric Patient
                                                    </SelectItem>
                                                    <SelectItem value="senior">
                                                        Senior Patient
                                                    </SelectItem>
                                                    <SelectItem value="new">
                                                        New Patient
                                                    </SelectItem>
                                                    <SelectItem value="returning">
                                                        Returning Patient
                                                    </SelectItem>
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
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Address Information
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Complete address details using
                                                PSGC
                                            </p>
                                        </div>
                                        {isLoadingPsgc && (
                                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                Loading address data...
                                            </div>
                                        )}
                                    </div>

                                    {/* Warning Message */}
                                    {isLoadingPsgc && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                                                    <span className="text-yellow-600 text-xs font-bold">
                                                        !
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-yellow-800">
                                                        Address data is
                                                        loading...
                                                    </p>
                                                    <p className="text-xs text-yellow-700 mt-1">
                                                        Please wait for all
                                                        address fields to load
                                                        before saving to prevent
                                                        data loss.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                                value={
                                                    psgcData.region
                                                        ? psgcData.region.code
                                                        : data.region_code || ""
                                                }
                                                onValueChange={(value) => {
                                                    setData(
                                                        "region_code",
                                                        value
                                                    );
                                                    fetchProvinces(value);
                                                }}
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select Region">
                                                        {psgcData.region
                                                            ? psgcData.region
                                                                  .name
                                                            : "Select Region"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {(regions &&
                                                    Array.isArray(regions)
                                                        ? regions
                                                        : []
                                                    ).map((region) => (
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
                                                value={
                                                    psgcData.province
                                                        ? psgcData.province.code
                                                        : data.province_code ||
                                                          ""
                                                }
                                                onValueChange={(value) => {
                                                    setData(
                                                        "province_code",
                                                        value
                                                    );
                                                    fetchCities(value);
                                                }}
                                                disabled={
                                                    isLoadingPsgc &&
                                                    provinces.length === 0
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select Province">
                                                        {psgcData.province
                                                            ? psgcData.province
                                                                  .name
                                                            : "Select Province"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {(provinces &&
                                                    Array.isArray(provinces)
                                                        ? provinces
                                                        : []
                                                    ).map((province) => (
                                                        <SelectItem
                                                            key={province.code}
                                                            value={
                                                                province.code
                                                            }
                                                        >
                                                            {province.name}
                                                        </SelectItem>
                                                    ))}
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
                                                    psgcData.cityMunicipality
                                                        ? psgcData
                                                              .cityMunicipality
                                                              .code
                                                        : data.city_municipality_code ||
                                                          ""
                                                }
                                                onValueChange={(value) => {
                                                    setData(
                                                        "city_municipality_code",
                                                        value
                                                    );
                                                    fetchBarangays(value);
                                                }}
                                                disabled={
                                                    !data.province_code &&
                                                    provinces.length === 0
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select City/Municipality">
                                                        {psgcData.cityMunicipality
                                                            ? psgcData
                                                                  .cityMunicipality
                                                                  .name
                                                            : "Select City/Municipality"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {(cities &&
                                                    Array.isArray(cities)
                                                        ? cities
                                                        : []
                                                    ).map((city) => (
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
                                                value={
                                                    psgcData.barangay
                                                        ? psgcData.barangay.code
                                                        : data.barangay_code ||
                                                          ""
                                                }
                                                onValueChange={(value) =>
                                                    setData(
                                                        "barangay_code",
                                                        value
                                                    )
                                                }
                                                disabled={
                                                    !data.city_municipality_code &&
                                                    barangays.length === 0
                                                }
                                            >
                                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select Barangay">
                                                        {psgcData.barangay
                                                            ? psgcData.barangay
                                                                  .name
                                                            : "Select Barangay"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {(barangays &&
                                                    Array.isArray(barangays)
                                                        ? barangays
                                                        : []
                                                    ).map((barangay) => (
                                                        <SelectItem
                                                            key={barangay.code}
                                                            value={
                                                                barangay.code
                                                            }
                                                        >
                                                            {barangay.name}
                                                        </SelectItem>
                                                    ))}
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
                                        disabled={processing || isLoadingPsgc}
                                        className="px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {processing ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Updating...
                                            </div>
                                        ) : isLoadingPsgc ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Loading Address Data...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Pencil className="h-4 w-4" />
                                                Update Patient
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
