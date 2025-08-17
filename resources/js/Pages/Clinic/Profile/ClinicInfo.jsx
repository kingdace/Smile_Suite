import React, { useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

export default function ClinicInfo({ clinic, plan }) {
    const logoInput = useRef();
    const { data, setData, post, processing, errors } = useForm({
        clinic_name: clinic?.name || "",
        contact_number: clinic?.contact_number || "",
        email: clinic?.email || "",
        license_number: clinic?.license_number || "",
        description: clinic?.description || "",
        logo: null,
        latitude: clinic?.latitude || "",
        longitude: clinic?.longitude || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("clinic.profile.update"), {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Clinic Profile" />
            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Clinic Profile</h1>
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Clinic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block font-semibold mb-1">
                                    Clinic Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2"
                                    value={data.clinic_name}
                                    onChange={(e) =>
                                        setData("clinic_name", e.target.value)
                                    }
                                    required
                                />
                                {errors.clinic_name && (
                                    <div className="text-red-600 text-sm">
                                        {errors.clinic_name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2"
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.contact_number && (
                                    <div className="text-red-600 text-sm">
                                        {errors.contact_number}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full border px-3 py-2"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                {errors.email && (
                                    <div className="text-red-600 text-sm">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">
                                    License Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2"
                                    value={data.license_number}
                                    onChange={(e) =>
                                        setData(
                                            "license_number",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.license_number && (
                                    <div className="text-red-600 text-sm">
                                        {errors.license_number}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="w-full border px-3 py-2"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                {errors.description && (
                                    <div className="text-red-600 text-sm">
                                        {errors.description}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">
                                    Clinic Logo
                                </label>
                                <input
                                    type="file"
                                    ref={logoInput}
                                    className="w-full"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData("logo", e.target.files[0])
                                    }
                                />
                                <img
                                    src={
                                        clinic?.logo_url ||
                                        "/images/clinic-logo.png"
                                    }
                                    alt="Clinic Logo"
                                    className="h-20 mt-2 rounded object-cover"
                                    onError={(e) => {
                                        e.target.src =
                                            "/images/clinic-logo.png";
                                    }}
                                />
                                {errors.logo && (
                                    <div className="text-red-600 text-sm">
                                        {errors.logo}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full border px-3 py-2"
                                    value={data.latitude || ""}
                                    onChange={(e) =>
                                        setData("latitude", e.target.value)
                                    }
                                    placeholder="e.g. 9.789904827505678"
                                />
                                <div className="text-xs text-gray-500">
                                    Get this from Google Maps: right-click your
                                    location, select 'What's here?', and copy
                                    the number.
                                </div>
                                {errors && errors.latitude && (
                                    <div className="text-red-600 text-sm">
                                        {errors.latitude}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="w-full border px-3 py-2"
                                    value={data.longitude || ""}
                                    onChange={(e) =>
                                        setData("longitude", e.target.value)
                                    }
                                    placeholder="e.g. 125.43849778246548"
                                />
                                <div className="text-xs text-gray-500">
                                    Get this from Google Maps: right-click your
                                    location, select 'What's here?', and copy
                                    the number.
                                </div>
                                {errors && errors.longitude && (
                                    <div className="text-red-600 text-sm">
                                        {errors.longitude}
                                    </div>
                                )}
                            </div>
                            <Button type="submit" disabled={processing}>
                                Update Clinic Info
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
