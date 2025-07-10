import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Pencil } from "lucide-react";

export default function Show({ auth, patient }) {
    const formatDate = (date) => {
        return date ? format(new Date(date), "MMMM d, yyyy") : "Not specified";
    };

    const getAddressString = () => {
        const parts = [];
        if (patient.address_details) parts.push(patient.address_details);
        if (patient.barangay_name) parts.push(patient.barangay_name);
        if (patient.city_municipality_name)
            parts.push(patient.city_municipality_name);
        if (patient.province_name) parts.push(patient.province_name);
        if (patient.region_name) parts.push(patient.region_name);
        if (patient.postal_code) parts.push(patient.postal_code);
        return parts.length > 0 ? parts.join(", ") : "Not specified";
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Patient Details
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href={route("clinic.patients.edit", {
                                clinic: auth.clinic_id,
                                patient: patient.id,
                            })}
                        >
                            <Button>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Patient
                            </Button>
                        </Link>
                        <Link
                            href={route("clinic.patients.index", {
                                clinic: auth.clinic_id,
                            })}
                        >
                            <Button variant="outline">Back to List</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Patient Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-4">
                                        Personal Information
                                    </h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Full Name
                                            </dt>
                                            <dd className="mt-1">
                                                {patient.first_name}{" "}
                                                {patient.last_name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Email
                                            </dt>
                                            <dd className="mt-1">
                                                {patient.email ||
                                                    "Not specified"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Phone Number
                                            </dt>
                                            <dd className="mt-1">
                                                {patient.phone_number}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Date of Birth
                                            </dt>
                                            <dd className="mt-1">
                                                {formatDate(
                                                    patient.date_of_birth
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Gender
                                            </dt>
                                            <dd className="mt-1 capitalize">
                                                {patient.gender}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Marital Status
                                            </dt>
                                            <dd className="mt-1 capitalize">
                                                {patient.marital_status ||
                                                    "Not specified"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Occupation
                                            </dt>
                                            <dd className="mt-1">
                                                {patient.occupation ||
                                                    "Not specified"}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-4">
                                        Address Information
                                    </h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Complete Address
                                            </dt>
                                            <dd className="mt-1">
                                                {getAddressString()}
                                            </dd>
                                        </div>
                                    </dl>

                                    <h3 className="text-lg font-medium mb-4 mt-8">
                                        Medical Information
                                    </h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Blood Type
                                            </dt>
                                            <dd className="mt-1">
                                                {patient.blood_type ||
                                                    "Not specified"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Medical History
                                            </dt>
                                            <dd className="mt-1 whitespace-pre-wrap">
                                                {patient.medical_history ||
                                                    "Not specified"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Allergies
                                            </dt>
                                            <dd className="mt-1 whitespace-pre-wrap">
                                                {patient.allergies ||
                                                    "Not specified"}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Last Dental Visit
                                            </dt>
                                            <dd className="mt-1">
                                                {formatDate(
                                                    patient.last_dental_visit
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Notes
                                            </dt>
                                            <dd className="mt-1 whitespace-pre-wrap">
                                                {patient.notes ||
                                                    "Not specified"}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <Tabs defaultValue="appointments" className="mt-8">
                                <TabsList>
                                    <TabsTrigger value="appointments">
                                        Appointments
                                    </TabsTrigger>
                                    <TabsTrigger value="treatments">
                                        Treatments
                                    </TabsTrigger>
                                    <TabsTrigger value="payments">
                                        Payments
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="appointments">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Appointments</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {patient.appointments &&
                                            patient.appointments.length > 0 ? (
                                                <div className="space-y-4">
                                                    {patient.appointments.map(
                                                        (appointment) => (
                                                            <div
                                                                key={
                                                                    appointment.id
                                                                }
                                                                className="border rounded-lg p-4"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">
                                                                            {
                                                                                appointment.title
                                                                            }
                                                                        </h4>
                                                                        <p className="text-sm text-gray-500">
                                                                            {formatDate(
                                                                                appointment.start_time
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <span
                                                                        className={`px-2 py-1 rounded-full text-xs ${
                                                                            appointment.status ===
                                                                            "completed"
                                                                                ? "bg-green-100 text-green-800"
                                                                                : appointment.status ===
                                                                                  "cancelled"
                                                                                ? "bg-red-100 text-red-800"
                                                                                : "bg-blue-100 text-blue-800"
                                                                        }`}
                                                                    >
                                                                        {appointment.status
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                            appointment.status.slice(
                                                                                1
                                                                            )}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-2">
                                                                    {
                                                                        appointment.notes
                                                                    }
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <p>No appointments found.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="treatments">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Treatments</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {patient.treatments &&
                                            patient.treatments.length > 0 ? (
                                                <div className="space-y-4">
                                                    {patient.treatments.map(
                                                        (treatment) => (
                                                            <div
                                                                key={
                                                                    treatment.id
                                                                }
                                                                className="border rounded-lg p-4"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">
                                                                            {
                                                                                treatment.name
                                                                            }
                                                                        </h4>
                                                                        <p className="text-sm text-gray-500">
                                                                            {formatDate(
                                                                                treatment.date
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <span className="text-lg font-medium">
                                                                        ₱
                                                                        {treatment.cost.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-2">
                                                                    {
                                                                        treatment.notes
                                                                    }
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <p>No treatments found.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="payments">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Payments</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {patient.payments &&
                                            patient.payments.length > 0 ? (
                                                <div className="space-y-4">
                                                    {patient.payments.map(
                                                        (payment) => (
                                                            <div
                                                                key={payment.id}
                                                                className="border rounded-lg p-4"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h4 className="font-medium">
                                                                            {
                                                                                payment.payment_method
                                                                            }
                                                                        </h4>
                                                                        <p className="text-sm text-gray-500">
                                                                            {formatDate(
                                                                                payment.payment_date
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <span className="text-lg font-medium">
                                                                        ₱
                                                                        {payment.amount.toLocaleString()}
                                                                    </span>
                                                                </div>
                                                                <p className="mt-2">
                                                                    {
                                                                        payment.notes
                                                                    }
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <p>No payments found.</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
