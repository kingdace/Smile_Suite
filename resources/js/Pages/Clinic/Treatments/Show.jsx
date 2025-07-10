import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Badge } from "@/Components/ui/badge";
import {
    Trash2,
    Pencil,
    ArrowLeft,
    Tag,
    DollarSign,
    CalendarDays,
    FileText,
    ClipboardPlus,
    ClipboardList,
    Image,
    Lightbulb,
    Users,
    Stethoscope,
    NotebookPen,
    ReceiptText,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { format } from "date-fns";

export default function Show({ auth, treatment }) {
    useEffect(() => {
        console.log("Treatment prop changed:", treatment);
        console.log("Appointment data:", treatment.appointment);
    }, [treatment]);

    const { delete: destroy } = useForm({});

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this treatment?")) {
            destroy(
                route("clinic.treatments.destroy", {
                    clinic: auth.clinic_id,
                    treatment: treatment.id,
                })
            );
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-500 text-white";
            case "in_progress":
                return "bg-blue-500 text-white";
            case "scheduled":
                return "bg-yellow-500 text-white";
            case "cancelled":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            isClinicPage={true}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Treatment Details
                </h2>
            }
        >
            <Head title={`Treatment: ${treatment.name}`} />

            <div key={treatment.id} className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-sm rounded-lg p-6">
                        <CardHeader className="px-0 pt-0 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                            <div className="flex flex-col">
                                <CardTitle className="text-3xl font-bold mb-1 flex items-center gap-2">
                                    <NotebookPen className="h-8 w-8 text-blue-600" />
                                    {treatment.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <CardDescription>Status:</CardDescription>
                                    <Badge
                                        className={getStatusBadgeVariant(
                                            treatment.status
                                        )}
                                    >
                                        {treatment.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            treatment.status
                                                .slice(1)
                                                .replace("_", " ")}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Link
                                    href={route("clinic.treatments.edit", {
                                        clinic: auth.clinic_id,
                                        treatment: treatment.id,
                                    })}
                                >
                                    <Button variant="outline" size="sm">
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardHeader>

                        <Separator className="my-4" />

                        <CardContent className="p-6 space-y-6 text-gray-700">
                            {/* Patient & Dentist Information */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-gray-600" />
                                    Patient & Dentist Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            Patient:
                                        </p>
                                        <Link
                                            href={route(
                                                "clinic.patients.show",
                                                {
                                                    clinic: auth.clinic_id,
                                                    patient:
                                                        treatment.patient.id,
                                                }
                                            )}
                                            className="text-blue-600 hover:underline text-base font-semibold"
                                        >
                                            {treatment.patient?.full_name ||
                                                "N/A"}
                                        </Link>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                            <Stethoscope className="h-4 w-4 text-gray-500" />
                                            Dentist:
                                        </p>
                                        <p className="text-base font-semibold">
                                            {treatment.dentist?.name || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Treatment Details */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Tag className="h-5 w-5 text-gray-600" />
                                    Treatment Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            Description:
                                        </p>
                                        <p className="text-base leading-relaxed">
                                            {treatment.description ||
                                                "No description provided."}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                                            <div>
                                                <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                                    Start Date:
                                                </p>
                                                <p className="text-base">
                                                    {treatment.start_date
                                                        ? format(
                                                              new Date(
                                                                  treatment.start_date
                                                              ),
                                                              "PPP"
                                                          )
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                                    <CalendarDays className="h-4 w-4 text-gray-500" />
                                                    End Date:
                                                </p>
                                                <p className="text-base">
                                                    {treatment.end_date
                                                        ? format(
                                                              new Date(
                                                                  treatment.end_date
                                                              ),
                                                              "PPP"
                                                          )
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                    Cost:
                                                </p>
                                                <p className="text-base font-semibold text-green-600">
                                                    ₱{treatment.cost}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                            <NotebookPen className="h-4 w-4 text-gray-500" />
                                            Notes:
                                        </p>
                                        <p className="text-base leading-relaxed">
                                            {treatment.notes ||
                                                "No notes provided."}
                                        </p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm font-medium flex items-center gap-1 mb-1">
                                            <ClipboardPlus className="h-4 w-4 text-gray-500" />
                                            Diagnosis:
                                        </p>
                                        <p className="text-base leading-relaxed">
                                            {treatment.diagnosis ||
                                                "No diagnosis provided."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            {/* Procedure Steps */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5 text-gray-600" />
                                    Procedure Steps
                                </h3>
                                {treatment.procedures_details &&
                                treatment.procedures_details.length > 0 ? (
                                    <ol className="list-decimal list-inside space-y-4 ml-4">
                                        {treatment.procedures_details.map(
                                            (proc, index) => (
                                                <li
                                                    key={index}
                                                    className="text-base"
                                                >
                                                    <p className="font-semibold mb-1">
                                                        Step {index + 1}:{" "}
                                                        {proc.step}
                                                    </p>
                                                    {proc.notes && (
                                                        <p className="text-sm text-gray-600 ml-4 leading-relaxed">
                                                            Notes: {proc.notes}
                                                        </p>
                                                    )}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                ) : (
                                    <p className="text-base text-gray-600">
                                        No detailed procedures recorded.
                                    </p>
                                )}
                            </div>

                            <Separator className="my-4" />

                            {/* Treatment Images */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Image className="h-5 w-5 text-gray-600" />
                                    Treatment Images
                                </h3>
                                {treatment.images &&
                                treatment.images.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {treatment.images.map(
                                            (imgSrc, index) => {
                                                const [
                                                    imageError,
                                                    setImageError,
                                                ] = useState(false);

                                                return (
                                                    <Card
                                                        key={index}
                                                        className="relative w-full h-48 flex items-center justify-center rounded-lg overflow-hidden group"
                                                    >
                                                        {!imageError ? (
                                                            <img
                                                                src={`${
                                                                    imgSrc.startsWith(
                                                                        "https://drive.google.com/"
                                                                    )
                                                                        ? `${imgSrc}?usp=drivesdk`
                                                                        : imgSrc
                                                                }`}
                                                                alt={`Treatment Image ${
                                                                    index + 1
                                                                }`}
                                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                onError={() =>
                                                                    setImageError(
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center text-gray-400 p-4 w-full h-full text-center">
                                                                <Image className="h-12 w-12 mb-2" />
                                                                <p className="text-sm font-medium">
                                                                    Image
                                                                    Unavailable
                                                                </p>
                                                                <a
                                                                    href={
                                                                        imgSrc
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 hover:underline text-xs mt-1"
                                                                >
                                                                    View
                                                                    Original
                                                                    Link
                                                                </a>
                                                            </div>
                                                        )}
                                                        <a
                                                            href={imgSrc}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-base font-medium z-10"
                                                        >
                                                            View Original
                                                        </a>
                                                    </Card>
                                                );
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-base text-gray-600">
                                        No images provided for this treatment.
                                    </p>
                                )}
                            </div>

                            <Separator className="my-4" />

                            {/* Recommendations */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-gray-600" />
                                    Recommendations
                                </h3>
                                <p className="text-base leading-relaxed">
                                    {treatment.recommendations ||
                                        "No recommendations provided."}
                                </p>
                            </div>

                            <Separator className="my-4" />

                            {/* Related Appointment */}
                            <div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <ReceiptText className="h-5 w-5 text-gray-600" />
                                    Related Appointment
                                </h3>
                                {treatment.appointment ? (
                                    <div className="space-y-2">
                                        <Link
                                            href={route(
                                                "clinic.appointments.show",
                                                {
                                                    clinic: auth.clinic_id,
                                                    appointment:
                                                        treatment.appointment
                                                            .id,
                                                }
                                            )}
                                            className="text-blue-600 hover:underline text-base font-semibold"
                                        >
                                            {treatment.appointment.type?.name ||
                                                "Appointment"}{" "}
                                            on{" "}
                                            {format(
                                                new Date(
                                                    treatment.appointment.scheduled_at
                                                ),
                                                "PPP"
                                            )}
                                        </Link>
                                        <div className="text-sm text-gray-600">
                                            <p>
                                                Patient:{" "}
                                                {treatment.appointment.patient
                                                    ?.user?.name ||
                                                    "Unknown Patient"}
                                            </p>
                                            <p>
                                                Dentist:{" "}
                                                {treatment.appointment
                                                    .assignedDentist?.name ||
                                                    "Unassigned"}
                                            </p>
                                            <p>
                                                Status:{" "}
                                                {treatment.appointment.status
                                                    ?.name || "Not specified"}
                                            </p>
                                            {treatment.appointment.notes && (
                                                <p className="mt-2">
                                                    Notes:{" "}
                                                    {
                                                        treatment.appointment
                                                            .notes
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-base text-gray-600">
                                        No appointment linked to this treatment.
                                    </p>
                                )}
                            </div>

                            <Separator className="my-4" />

                            <div className="flex justify-end">
                                <Link
                                    href={route("clinic.treatments.index", {
                                        clinic: auth.clinic_id,
                                    })}
                                >
                                    <Button variant="outline">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Treatments List
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
