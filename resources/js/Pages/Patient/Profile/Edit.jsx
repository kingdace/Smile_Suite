import { Head, Link, useForm } from "@inertiajs/react";
import {
    User,
    Save,
    ArrowLeft,
    Phone,
    Mail,
    AlertTriangle,
    FileText,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import InputError from "@/Components/InputError";

export default function PatientProfileEdit({ user, patients }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        phone_number: user.phone_number || "",
        patients: patients.map((patient) => ({
            id: patient.id,
            first_name: patient.first_name || "",
            last_name: patient.last_name || "",
            phone_number: patient.phone_number || "",
            emergency_contact_name: patient.emergency_contact_name || "",
            emergency_contact_number: patient.emergency_contact_number || "",
            emergency_contact_relationship:
                patient.emergency_contact_relationship || "",
            medical_history: patient.medical_history || "",
            allergies: patient.allergies || "",
        })),
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("patient.profile.update"));
    };

    const updatePatient = (index, field, value) => {
        const updatedPatients = [...data.patients];
        updatedPatients[index] = { ...updatedPatients[index], [field]: value };
        setData("patients", updatedPatients);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <SiteHeader />
            <Head title="Edit Profile" />

            <div className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Edit Profile
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Update your personal information and clinic
                                    records
                                </p>
                            </div>
                            <Link href={route("patient.profile")}>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Profile
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Personal Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Personal Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-1"
                                            />
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
                                                className="mt-1"
                                            />
                                            <InputError
                                                message={errors.phone_number}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="email">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="mt-1 bg-gray-50"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                Email address cannot be changed.
                                                Contact support if needed.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Clinic Records */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Clinic Records ({patients.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {patients.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">
                                                No clinic records found
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Your clinic records will appear
                                                here once you visit clinics.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {data.patients.map(
                                                (patient, index) => (
                                                    <div
                                                        key={patient.id}
                                                        className="border rounded-lg p-6"
                                                    >
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <h3 className="font-semibold text-gray-900">
                                                                {
                                                                    patients[
                                                                        index
                                                                    ].clinic
                                                                        .name
                                                                }
                                                            </h3>
                                                            <span className="text-sm text-gray-500">
                                                                (Patient ID:{" "}
                                                                {patient.id})
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <Label
                                                                    htmlFor={`first_name_${index}`}
                                                                >
                                                                    First Name
                                                                </Label>
                                                                <Input
                                                                    id={`first_name_${index}`}
                                                                    type="text"
                                                                    value={
                                                                        patient.first_name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updatePatient(
                                                                            index,
                                                                            "first_name",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="mt-1"
                                                                />
                                                                <InputError
                                                                    message={
                                                                        errors[
                                                                            `patients.${index}.first_name`
                                                                        ]
                                                                    }
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label
                                                                    htmlFor={`last_name_${index}`}
                                                                >
                                                                    Last Name
                                                                </Label>
                                                                <Input
                                                                    id={`last_name_${index}`}
                                                                    type="text"
                                                                    value={
                                                                        patient.last_name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updatePatient(
                                                                            index,
                                                                            "last_name",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="mt-1"
                                                                />
                                                                <InputError
                                                                    message={
                                                                        errors[
                                                                            `patients.${index}.last_name`
                                                                        ]
                                                                    }
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label
                                                                    htmlFor={`phone_number_${index}`}
                                                                >
                                                                    Phone Number
                                                                </Label>
                                                                <Input
                                                                    id={`phone_number_${index}`}
                                                                    type="tel"
                                                                    value={
                                                                        patient.phone_number
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updatePatient(
                                                                            index,
                                                                            "phone_number",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="mt-1"
                                                                />
                                                                <InputError
                                                                    message={
                                                                        errors[
                                                                            `patients.${index}.phone_number`
                                                                        ]
                                                                    }
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Emergency Contact */}
                                                        <div className="mt-6 pt-6 border-t">
                                                            <h4 className="font-medium text-gray-900 mb-4">
                                                                Emergency
                                                                Contact
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`emergency_contact_name_${index}`}
                                                                    >
                                                                        Contact
                                                                        Name
                                                                    </Label>
                                                                    <Input
                                                                        id={`emergency_contact_name_${index}`}
                                                                        type="text"
                                                                        value={
                                                                            patient.emergency_contact_name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updatePatient(
                                                                                index,
                                                                                "emergency_contact_name",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`emergency_contact_number_${index}`}
                                                                    >
                                                                        Contact
                                                                        Phone
                                                                    </Label>
                                                                    <Input
                                                                        id={`emergency_contact_number_${index}`}
                                                                        type="tel"
                                                                        value={
                                                                            patient.emergency_contact_number
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updatePatient(
                                                                                index,
                                                                                "emergency_contact_number",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`emergency_contact_relationship_${index}`}
                                                                    >
                                                                        Relationship
                                                                    </Label>
                                                                    <Input
                                                                        id={`emergency_contact_relationship_${index}`}
                                                                        type="text"
                                                                        value={
                                                                            patient.emergency_contact_relationship
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updatePatient(
                                                                                index,
                                                                                "emergency_contact_relationship",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1"
                                                                        placeholder="e.g., Spouse, Parent"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Medical Information */}
                                                        <div className="mt-6 pt-6 border-t">
                                                            <h4 className="font-medium text-gray-900 mb-4">
                                                                Medical
                                                                Information
                                                            </h4>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`medical_history_${index}`}
                                                                    >
                                                                        Medical
                                                                        History
                                                                    </Label>
                                                                    <Textarea
                                                                        id={`medical_history_${index}`}
                                                                        value={
                                                                            patient.medical_history
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updatePatient(
                                                                                index,
                                                                                "medical_history",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1"
                                                                        rows={3}
                                                                        placeholder="Enter any relevant medical history..."
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Label
                                                                        htmlFor={`allergies_${index}`}
                                                                    >
                                                                        Allergies
                                                                    </Label>
                                                                    <Textarea
                                                                        id={`allergies_${index}`}
                                                                        value={
                                                                            patient.allergies
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updatePatient(
                                                                                index,
                                                                                "allergies",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="mt-1"
                                                                        rows={2}
                                                                        placeholder="Enter any allergies..."
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <Link href={route("patient.profile")}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {processing ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
