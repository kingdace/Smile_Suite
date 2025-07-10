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

export default function Edit({ auth, patient, regions }) {
    const { data, setData, put, processing, errors } = useForm({
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.email || "",
        phone_number: patient.phone_number,
        date_of_birth: patient.date_of_birth,
        gender: patient.gender,
        region_code: patient.region_code,
        province_code: patient.province_code,
        city_municipality_code: patient.city_municipality_code,
        barangay_code: patient.barangay_code,
        postal_code: patient.postal_code,
        address_details: patient.address_details || "",
        medical_history: patient.medical_history || "",
        allergies: patient.allergies || "",
        blood_type: patient.blood_type || "",
        occupation: patient.occupation || "",
        marital_status: patient.marital_status || "",
        last_dental_visit: patient.last_dental_visit || "",
        notes: patient.notes || "",
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(
            route("clinic.patients.update", {
                clinic: auth.clinic_id,
                patient: patient.id,
            })
        );
    };

    const fetchProvinces = async (regionCode) => {
        try {
            const response = await axios.get(
                route("psgc.provinces", { regionId: regionCode })
            );
            setProvinces(response.data);
            setData("province_code", "");
            setData("city_municipality_code", "");
            setData("barangay_code", "");
            setCities([]);
            setBarangays([]);
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
            setData("city_municipality_code", "");
            setData("barangay_code", "");
            setBarangays([]);
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
                setData("barangay_code", "");
            } else {
                console.error("Invalid barangay data received:", response.data);
                setBarangays([]);
            }
        } catch (error) {
            console.error("Error fetching barangays:", error);
            setBarangays([]);
        }
    };

    // Load initial data if region and province are already selected
    useEffect(() => {
        if (data.region_code) {
            fetchProvinces(data.region_code);
        }
        if (data.province_code) {
            fetchCities(data.province_code);
        }
        if (data.city_municipality_code) {
            fetchBarangays(data.city_municipality_code);
        }
    }, []);

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Patient
                </h2>
            }
        >
            <Head title="Edit Patient" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Patient Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="first_name">
                                            First Name
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

                                    <div>
                                        <Label htmlFor="last_name">
                                            Last Name
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

                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
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

                                    <div>
                                        <Label htmlFor="phone_number">
                                            Phone Number
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

                                    <div>
                                        <Label htmlFor="date_of_birth">
                                            Date of Birth
                                        </Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            value={data.date_of_birth}
                                            onChange={(e) =>
                                                setData(
                                                    "date_of_birth",
                                                    e.target.value
                                                )
                                            }
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

                                    <div>
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            value={data.gender}
                                            onValueChange={(value) =>
                                                setData("gender", value)
                                            }
                                            required
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
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

                                {/* Address Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Address Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="region_code">
                                                Region
                                            </Label>
                                            <Select
                                                value={data.region_code}
                                                onValueChange={(value) => {
                                                    setData(
                                                        "region_code",
                                                        value
                                                    );
                                                    fetchProvinces(value);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Region" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {regions.map((region) => (
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

                                        <div>
                                            <Label htmlFor="province_code">
                                                Province
                                            </Label>
                                            <Select
                                                value={data.province_code}
                                                onValueChange={(value) => {
                                                    setData(
                                                        "province_code",
                                                        value
                                                    );
                                                    fetchCities(value);
                                                }}
                                                disabled={!data.region_code}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Province" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {provinces.map(
                                                        (province) => (
                                                            <SelectItem
                                                                key={
                                                                    province.code
                                                                }
                                                                value={
                                                                    province.code
                                                                }
                                                            >
                                                                {province.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="city_municipality_code">
                                                City/Municipality
                                            </Label>
                                            <Select
                                                value={
                                                    data.city_municipality_code
                                                }
                                                onValueChange={(value) => {
                                                    setData(
                                                        "city_municipality_code",
                                                        value
                                                    );
                                                    fetchBarangays(value);
                                                }}
                                                disabled={!data.province_code}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select City/Municipality" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {cities.map((city) => (
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

                                        <div>
                                            <Label htmlFor="barangay_code">
                                                Barangay
                                            </Label>
                                            <Select
                                                value={data.barangay_code}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "barangay_code",
                                                        value
                                                    )
                                                }
                                                disabled={
                                                    !data.city_municipality_code
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Barangay" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px] overflow-y-auto">
                                                    {barangays.map(
                                                        (barangay) => (
                                                            <SelectItem
                                                                key={
                                                                    barangay.code
                                                                }
                                                                value={
                                                                    barangay.code
                                                                }
                                                            >
                                                                {barangay.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="postal_code">
                                                Postal Code
                                            </Label>
                                            <Input
                                                id="postal_code"
                                                value={data.postal_code}
                                                onChange={(e) =>
                                                    setData(
                                                        "postal_code",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="address_details">
                                            Additional Address Details
                                        </Label>
                                        <Textarea
                                            id="address_details"
                                            value={data.address_details}
                                            onChange={(e) =>
                                                setData(
                                                    "address_details",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Medical Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="medical_history">
                                                Medical History
                                            </Label>
                                            <Textarea
                                                id="medical_history"
                                                value={data.medical_history}
                                                onChange={(e) =>
                                                    setData(
                                                        "medical_history",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="allergies">
                                                Allergies
                                            </Label>
                                            <Textarea
                                                id="allergies"
                                                value={data.allergies}
                                                onChange={(e) =>
                                                    setData(
                                                        "allergies",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="blood_type">
                                                Blood Type
                                            </Label>
                                            <Input
                                                id="blood_type"
                                                value={data.blood_type}
                                                onChange={(e) =>
                                                    setData(
                                                        "blood_type",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="occupation">
                                                Occupation
                                            </Label>
                                            <Input
                                                id="occupation"
                                                value={data.occupation}
                                                onChange={(e) =>
                                                    setData(
                                                        "occupation",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="marital_status">
                                                Marital Status
                                            </Label>
                                            <Select
                                                value={data.marital_status}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "marital_status",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Marital Status" />
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

                                        <div>
                                            <Label htmlFor="last_dental_visit">
                                                Last Dental Visit
                                            </Label>
                                            <Input
                                                id="last_dental_visit"
                                                type="date"
                                                value={data.last_dental_visit}
                                                onChange={(e) =>
                                                    setData(
                                                        "last_dental_visit",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData("notes", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Update Patient
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
