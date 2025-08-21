import { Head, Link } from "@inertiajs/react";
import {
    User,
    Edit,
    Phone,
    Mail,
    MapPin,
    Calendar,
    FileText,
    AlertTriangle,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

export default function PatientProfileShow({ user, patients }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <SiteHeader />
            <Head title="My Profile" />

            <div className="py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    My Profile
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Manage your personal information and clinic
                                    records
                                </p>
                            </div>
                            <Link href={route("patient.profile.edit")}>
                                <Button className="flex items-center gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Profile Card */}
                        <div className="lg:col-span-2 space-y-6">
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
                                            <label className="text-sm font-medium text-gray-500">
                                                Full Name
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {user.name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Email
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {user.email}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Phone Number
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {user.phone_number}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">
                                                Account Type
                                            </label>
                                            <Badge
                                                variant="secondary"
                                                className="mt-1"
                                            >
                                                Smile Suite Patient
                                            </Badge>
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
                                        <div className="space-y-4">
                                            {patients.map((patient, index) => (
                                                <div
                                                    key={patient.id}
                                                    className="border rounded-lg p-4"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {
                                                                patient.clinic
                                                                    .name
                                                            }
                                                        </h3>
                                                        <Badge variant="outline">
                                                            Patient ID:{" "}
                                                            {patient.id}
                                                        </Badge>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Name
                                                            </label>
                                                            <p className="font-medium">
                                                                {
                                                                    patient.first_name
                                                                }{" "}
                                                                {
                                                                    patient.last_name
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Phone
                                                            </label>
                                                            <p className="font-medium">
                                                                {
                                                                    patient.phone_number
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Status
                                                            </label>
                                                            <Badge
                                                                variant={
                                                                    patient.status ===
                                                                    "active"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                                className="mt-1"
                                                            >
                                                                {patient.status}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500">
                                                                Category
                                                            </label>
                                                            <p className="font-medium">
                                                                {
                                                                    patient.category_display_name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Medical Information */}
                                                    {(patient.medical_history ||
                                                        patient.allergies) && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Medical
                                                                Information
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {patient.medical_history && (
                                                                    <div>
                                                                        <label className="text-xs text-gray-500">
                                                                            Medical
                                                                            History
                                                                        </label>
                                                                        <p className="text-sm text-gray-700">
                                                                            {
                                                                                patient.medical_history
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {patient.allergies && (
                                                                    <div>
                                                                        <label className="text-xs text-gray-500">
                                                                            Allergies
                                                                        </label>
                                                                        <p className="text-sm text-gray-700">
                                                                            {
                                                                                patient.allergies
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Emergency Contact */}
                                                    {patient.emergency_contact_name && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <h4 className="font-medium text-gray-900 mb-2">
                                                                Emergency
                                                                Contact
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                <div>
                                                                    <label className="text-gray-500">
                                                                        Name
                                                                    </label>
                                                                    <p className="font-medium">
                                                                        {
                                                                            patient.emergency_contact_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <label className="text-gray-500">
                                                                        Phone
                                                                    </label>
                                                                    <p className="font-medium">
                                                                        {
                                                                            patient.emergency_contact_number
                                                                        }
                                                                    </p>
                                                                </div>
                                                                {patient.emergency_contact_relationship && (
                                                                    <div>
                                                                        <label className="text-gray-500">
                                                                            Relationship
                                                                        </label>
                                                                        <p className="font-medium">
                                                                            {
                                                                                patient.emergency_contact_relationship
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">
                                            Connected Clinics
                                        </span>
                                        <span className="font-semibold">
                                            {patients.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">
                                            Active Records
                                        </span>
                                        <span className="font-semibold">
                                            {
                                                patients.filter(
                                                    (p) => p.status === "active"
                                                ).length
                                            }
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Link href={route("patient.dashboard")}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                        >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            View Dashboard
                                        </Button>
                                    </Link>
                                    <Link href={route("patient.profile.edit")}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit Profile
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
