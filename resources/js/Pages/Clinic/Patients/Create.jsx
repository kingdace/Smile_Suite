import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import moment from "moment";

export default function Create({ auth, regions }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        date_of_birth: "",
        gender: "",
        street_address: "",
        region_code: "",
        province_code: "",
        city_municipality_code: "",
        barangay_code: "",
        postal_code: "",
        address_details: "",
        medical_history: "",
        allergies: "",
        emergency_contact_name: "",
        emergency_contact_number: "",
        emergency_contact_relationship: "",
        insurance_provider: "",
        insurance_policy_number: "",
        blood_type: "",
        occupation: "",
        marital_status: "",
        last_dental_visit: "",
        notes: "",
    });

    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format dates to YYYY-MM-DD
        const formattedData = {
            ...data,
            date_of_birth: data.date_of_birth
                ? moment(data.date_of_birth).format("YYYY-MM-DD")
                : null,
            last_dental_visit: data.last_dental_visit
                ? moment(data.last_dental_visit).format("YYYY-MM-DD")
                : null,
        };

        post(
            route("clinic.patients.store", { clinic: auth.clinic_id }),
            formattedData,
            {
                onSuccess: () => {
                    window.location.href = route("clinic.patients.index", {
                        clinic: auth.clinic_id,
                    });
                },
            }
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
            const response = await axios.get(
                route("psgc.barangays", { cityId: cityCode })
            );
            setBarangays(response.data);
            setData("barangay_code", "");
        } catch (error) {
            console.error("Error fetching barangays:", error);
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Add New Patient
                </h2>
            }
        >
            <Head title="Add New Patient" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Information</CardTitle>
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
                                            <Label htmlFor="street_address">
                                                Street Address
                                            </Label>
                                            <Input
                                                id="street_address"
                                                value={data.street_address}
                                                onChange={(e) =>
                                                    setData(
                                                        "street_address",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

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
                                            <Select
                                                value={data.blood_type}
                                                onValueChange={(value) =>
                                                    setData("blood_type", value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Blood Type" />
                                                </SelectTrigger>
                                                <SelectContent>
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
                                </div>

                                {/* Emergency Contact */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Emergency Contact
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <Label htmlFor="emergency_contact_name">
                                                Name
                                            </Label>
                                            <Input
                                                id="emergency_contact_name"
                                                value={
                                                    data.emergency_contact_name
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "emergency_contact_name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="emergency_contact_number">
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="emergency_contact_number"
                                                value={
                                                    data.emergency_contact_number
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "emergency_contact_number",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="emergency_contact_relationship">
                                                Relationship
                                            </Label>
                                            <Input
                                                id="emergency_contact_relationship"
                                                value={
                                                    data.emergency_contact_relationship
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "emergency_contact_relationship",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Insurance Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Insurance Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="insurance_provider">
                                                Provider
                                            </Label>
                                            <Input
                                                id="insurance_provider"
                                                value={data.insurance_provider}
                                                onChange={(e) =>
                                                    setData(
                                                        "insurance_provider",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="insurance_policy_number">
                                                Policy Number
                                            </Label>
                                            <Input
                                                id="insurance_policy_number"
                                                value={
                                                    data.insurance_policy_number
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "insurance_policy_number",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Additional Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Create Patient
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
