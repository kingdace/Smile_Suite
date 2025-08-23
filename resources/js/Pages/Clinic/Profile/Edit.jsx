import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import {
    User,
    Mail,
    Phone,
    Stethoscope,
    Award,
    Clock,
    AlertTriangle,
    Plus,
    X,
    Save,
    ArrowLeft,
    Building2,
} from "lucide-react";

export default function Edit({ auth, user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        // Dentist-specific fields
        license_number: user.license_number || "",
        specialties: user.specialties || [],
        qualifications: user.qualifications || [],
        years_experience: user.years_experience || "",
        bio: user.bio || "",
        emergency_contact: user.emergency_contact || "",
        emergency_phone: user.emergency_phone || "",
        working_hours: user.working_hours || {
            monday: { start: "09:00", end: "17:00" },
            tuesday: { start: "09:00", end: "17:00" },
            wednesday: { start: "09:00", end: "17:00" },
            thursday: { start: "09:00", end: "17:00" },
            friday: { start: "09:00", end: "17:00" },
            saturday: { start: "09:00", end: "15:00" },
            sunday: null,
        },
    });

    const [newSpecialty, setNewSpecialty] = useState("");
    const [newQualification, setNewQualification] = useState("");

    const addSpecialty = () => {
        if (
            newSpecialty.trim() &&
            !data.specialties.includes(newSpecialty.trim())
        ) {
            setData("specialties", [...data.specialties, newSpecialty.trim()]);
            setNewSpecialty("");
        }
    };

    const removeSpecialty = (index) => {
        setData(
            "specialties",
            data.specialties.filter((_, i) => i !== index)
        );
    };

    const addQualification = () => {
        if (
            newQualification.trim() &&
            !data.qualifications.includes(newQualification.trim())
        ) {
            setData("qualifications", [
                ...data.qualifications,
                newQualification.trim(),
            ]);
            setNewQualification("");
        }
    };

    const removeQualification = (index) => {
        setData(
            "qualifications",
            data.qualifications.filter((_, i) => i !== index)
        );
    };

    const updateWorkingHours = (day, field, value) => {
        setData("working_hours", {
            ...data.working_hours,
            [day]: {
                ...data.working_hours[day],
                [field]: value,
            },
        });
    };

    const toggleDayOff = (day) => {
        setData("working_hours", {
            ...data.working_hours,
            [day]: data.working_hours[day]
                ? null
                : { start: "09:00", end: "17:00" },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("clinic.user.profile.update"));
    };

    const days = [
        { key: "monday", label: "Monday" },
        { key: "tuesday", label: "Tuesday" },
        { key: "wednesday", label: "Wednesday" },
        { key: "thursday", label: "Thursday" },
        { key: "friday", label: "Friday" },
        { key: "saturday", label: "Saturday" },
        { key: "sunday", label: "Sunday" },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Edit Profile" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Edit Profile
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Update your professional information and
                                preferences
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <a href={route("clinic.profile")}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Profile
                            </a>
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Progress Indicator */}
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-700">
                                    Profile Completion
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {user.role === "dentist"
                                        ? "Professional Profile"
                                        : "Basic Profile"}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            user.role === "dentist" &&
                                            user.license_number
                                                ? "85%"
                                                : "40%"
                                        }`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className={
                                                errors.name
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="email">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            className={
                                                errors.email
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone_number">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone_number"
                                            type="tel"
                                            value={data.phone_number}
                                            onChange={(e) =>
                                                setData(
                                                    "phone_number",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                errors.phone_number
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors.phone_number && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.phone_number}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Professional Information (for dentists) */}
                        {user.role === "dentist" && (
                            <>
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Stethoscope className="h-5 w-5 text-blue-600" />
                                            Professional Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="license_number">
                                                    License Number
                                                </Label>
                                                <Input
                                                    id="license_number"
                                                    type="text"
                                                    value={data.license_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            "license_number",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter your dental license number"
                                                    className={
                                                        errors.license_number
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.license_number && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.license_number}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="years_experience">
                                                    Years of Experience
                                                </Label>
                                                <Input
                                                    id="years_experience"
                                                    type="number"
                                                    min="0"
                                                    max="50"
                                                    value={
                                                        data.years_experience
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "years_experience",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Number of years"
                                                    className={
                                                        errors.years_experience
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.years_experience && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {
                                                            errors.years_experience
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Textarea
                                                id="bio"
                                                value={data.bio}
                                                onChange={(e) =>
                                                    setData(
                                                        "bio",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Tell patients about your experience, approach to dental care, and what makes you unique as a dental professional..."
                                                rows={5}
                                                className={
                                                    errors.bio
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <p className="text-xs text-gray-500">
                                                This will be visible to patients
                                                when they view your profile.
                                            </p>
                                            {errors.bio && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.bio}
                                                </p>
                                            )}
                                        </div>

                                        {/* Specialties */}
                                        <div className="space-y-3">
                                            <Label>Specialties</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    value={newSpecialty}
                                                    onChange={(e) =>
                                                        setNewSpecialty(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., Orthodontics, Endodontics, Pediatric Dentistry..."
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        (e.preventDefault(),
                                                        addSpecialty())
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addSpecialty}
                                                    size="sm"
                                                    className="px-4"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-3">
                                                {data.specialties.map(
                                                    (specialty, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                                                        >
                                                            {specialty}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeSpecialty(
                                                                        index
                                                                    )
                                                                }
                                                                className="ml-2 hover:text-red-600 transition-colors"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Add your dental specialties to
                                                help patients find you for
                                                specific treatments.
                                            </p>
                                        </div>

                                        {/* Qualifications */}
                                        <div className="space-y-3">
                                            <Label>Qualifications</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    value={newQualification}
                                                    onChange={(e) =>
                                                        setNewQualification(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="e.g., DDS, DMD, Board Certification..."
                                                    onKeyPress={(e) =>
                                                        e.key === "Enter" &&
                                                        (e.preventDefault(),
                                                        addQualification())
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addQualification}
                                                    size="sm"
                                                    className="px-4"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                {data.qualifications.map(
                                                    (qualification, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                        >
                                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                                <Award className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <span className="flex-1 font-medium">
                                                                {qualification}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeQualification(
                                                                        index
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Add your degrees,
                                                certifications, and professional
                                                qualifications.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Working Hours */}
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            Working Hours
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Set your availability for each day
                                            of the week
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {days.map(({ key, label }) => (
                                                <div
                                                    key={key}
                                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                                >
                                                    <div className="flex items-center gap-3 min-w-[140px]">
                                                        <input
                                                            type="checkbox"
                                                            id={`day-${key}`}
                                                            checked={
                                                                !!data
                                                                    .working_hours[
                                                                    key
                                                                ]
                                                            }
                                                            onChange={() =>
                                                                toggleDayOff(
                                                                    key
                                                                )
                                                            }
                                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <Label
                                                            htmlFor={`day-${key}`}
                                                            className="font-medium text-gray-700"
                                                        >
                                                            {label}
                                                        </Label>
                                                    </div>
                                                    {data.working_hours[key] ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-600">
                                                                    From:
                                                                </span>
                                                                <Input
                                                                    type="time"
                                                                    value={
                                                                        data
                                                                            .working_hours[
                                                                            key
                                                                        ].start
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateWorkingHours(
                                                                            key,
                                                                            "start",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-28"
                                                                />
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-600">
                                                                    To:
                                                                </span>
                                                                <Input
                                                                    type="time"
                                                                    value={
                                                                        data
                                                                            .working_hours[
                                                                            key
                                                                        ].end
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateWorkingHours(
                                                                            key,
                                                                            "end",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-28"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                                                <X className="h-3 w-3 text-red-500" />
                                                            </div>
                                                            <span className="text-gray-500 italic font-medium">
                                                                Day off
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-700">
                                                💡 <strong>Tip:</strong> Set
                                                your working hours to help
                                                patients know when you're
                                                available for appointments.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Emergency Contact */}
                                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                                            Emergency Contact
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="emergency_contact">
                                                    Emergency Contact Person
                                                </Label>
                                                <Input
                                                    id="emergency_contact"
                                                    type="text"
                                                    value={
                                                        data.emergency_contact
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "emergency_contact",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={
                                                        errors.emergency_contact
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.emergency_contact && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {
                                                            errors.emergency_contact
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="emergency_phone">
                                                    Emergency Phone Number
                                                </Label>
                                                <Input
                                                    id="emergency_phone"
                                                    type="tel"
                                                    value={data.emergency_phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "emergency_phone",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={
                                                        errors.emergency_phone
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                {errors.emergency_phone && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.emergency_phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}

                        {/* Submit Button */}
                        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Save Your Changes
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Review your information before saving.
                                        Changes will be visible to patients.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <Button asChild variant="outline" size="lg">
                                        <a href={route("clinic.profile")}>
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Cancel
                                        </a>
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2"
                                        size="lg"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Saving Changes...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
