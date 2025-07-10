import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    CalendarIcon,
    Loader2,
    Users,
    Stethoscope,
    Tag,
    FileText,
    DollarSign,
    ClipboardPlus,
    ClipboardList,
    Image,
    Lightbulb,
    CheckCircle,
    CalendarDays,
    PlusCircle,
    CalendarCheck,
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Create({
    auth,
    patients,
    dentists,
    appointments = [],
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: "",
        dentist_id: "",
        name: "",
        description: "",
        cost: "",
        status: "scheduled",
        start_date: undefined,
        end_date: undefined,
        notes: "",
        diagnosis: "",
        procedures_details: [],
        images: [],
        recommendations: "",
        appointment_id: "",
    });

    const statuses = [
        { value: "scheduled", label: "Scheduled" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const submit = (e) => {
        e.preventDefault();
        console.log(
            "Submitting treatment with appointment_id:",
            data.appointment_id
        );
        console.log("Full form data:", data);
        post(route("clinic.treatments.store", { clinic: auth.clinic_id }));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            isClinicPage={true}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create Treatment
                </h2>
            }
        >
            <Head title="Create Treatment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-2xl rounded-2xl p-10">
                        <form onSubmit={submit} className="space-y-10">
                            <CardHeader className="px-0 pt-0 border-b pb-4 mb-6">
                                <CardTitle className="text-3xl font-extrabold text-blue-800">
                                    New Treatment Record
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 pb-0 space-y-10">
                                {/* Patient & Dentist Information */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <Users className="h-6 w-6 text-blue-600" />
                                        Patient & Dentist Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Patient Select */}
                                        <div>
                                            <Label
                                                htmlFor="patient_id"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Patient
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData("patient_id", value)
                                                }
                                                value={data.patient_id}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a patient" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {patients.map((patient) => (
                                                        <SelectItem
                                                            key={patient.id}
                                                            value={patient.id.toString()}
                                                        >
                                                            {patient.user
                                                                ? patient.user
                                                                      .name
                                                                : `${
                                                                      patient.first_name ||
                                                                      ""
                                                                  } ${
                                                                      patient.last_name ||
                                                                      ""
                                                                  }`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.patient_id}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Dentist Select */}
                                        <div>
                                            <Label
                                                htmlFor="dentist_id"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Dentist
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData("dentist_id", value)
                                                }
                                                value={data.dentist_id}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a dentist" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {dentists.map((dentist) => (
                                                        <SelectItem
                                                            key={dentist.id}
                                                            value={dentist.id.toString()}
                                                        >
                                                            {dentist.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.dentist_id}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Related Appointment */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <CalendarCheck className="h-6 w-6 text-blue-600" />
                                        Related Appointment
                                    </h3>
                                    <div>
                                        <Label
                                            htmlFor="appointment_id"
                                            className="font-semibold text-gray-700 mb-2 block"
                                        >
                                            Appointment
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setData("appointment_id", value)
                                            }
                                            value={data.appointment_id}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select an appointment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {appointments &&
                                                    appointments.map(
                                                        (appointment) => (
                                                            <SelectItem
                                                                key={
                                                                    appointment.id
                                                                }
                                                                value={appointment.id.toString()}
                                                            >
                                                                {format(
                                                                    new Date(
                                                                        appointment.scheduled_at
                                                                    ),
                                                                    "PPP"
                                                                )}{" "}
                                                                -{" "}
                                                                {appointment
                                                                    .patient
                                                                    ?.name ||
                                                                    "Unknown Patient"}{" "}
                                                                (
                                                                {appointment.type ||
                                                                    "No Type"}
                                                                )
                                                            </SelectItem>
                                                        )
                                                    )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.appointment_id}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Treatment Details */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <Tag className="h-6 w-6 text-blue-600" />
                                        Treatment Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Name */}
                                        <div>
                                            <Label
                                                htmlFor="name"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Treatment Name
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
                                                className="w-full"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Cost */}
                                        <div>
                                            <Label
                                                htmlFor="cost"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Cost
                                            </Label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">
                                                        ₱
                                                    </span>
                                                </div>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="pl-7 w-full"
                                                    value={data.cost}
                                                    onChange={(e) =>
                                                        setData(
                                                            "cost",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <InputError
                                                message={errors.cost}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2">
                                            <Label
                                                htmlFor="description"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full"
                                                rows="4"
                                            />
                                            <InputError
                                                message={errors.description}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Diagnosis */}
                                        <div className="md:col-span-2">
                                            <Label
                                                htmlFor="diagnosis"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Diagnosis
                                            </Label>
                                            <Textarea
                                                id="diagnosis"
                                                value={data.diagnosis || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "diagnosis",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full"
                                                rows="4"
                                                placeholder="Enter diagnosis details..."
                                            />
                                            <InputError
                                                message={errors.diagnosis}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Scheduling & Status */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <CalendarDays className="h-6 w-6 text-blue-600" />
                                        Scheduling & Status
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Status Select */}
                                        <div>
                                            <Label
                                                htmlFor="status"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Status
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setData("status", value)
                                                }
                                                value={data.status}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statuses.map((status) => (
                                                        <SelectItem
                                                            key={status.value}
                                                            value={status.value}
                                                        >
                                                            {status.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError
                                                message={errors.status}
                                                className="mt-2"
                                            />
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label
                                                    htmlFor="start_date"
                                                    className="font-semibold text-gray-700 mb-2 block"
                                                >
                                                    Start Date
                                                </Label>
                                                <Input
                                                    id="start_date"
                                                    type="date"
                                                    value={
                                                        data.start_date
                                                            ? format(
                                                                  new Date(
                                                                      data.start_date
                                                                  ),
                                                                  "yyyy-MM-dd"
                                                              )
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "start_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                                <InputError
                                                    message={errors.start_date}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="end_date"
                                                    className="font-semibold text-gray-700 mb-2 block"
                                                >
                                                    End Date
                                                </Label>
                                                <Input
                                                    id="end_date"
                                                    type="date"
                                                    value={
                                                        data.end_date
                                                            ? format(
                                                                  new Date(
                                                                      data.end_date
                                                                  ),
                                                                  "yyyy-MM-dd"
                                                              )
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "end_date",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                                <InputError
                                                    message={errors.end_date}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        <div className="md:col-span-2">
                                            <Label
                                                htmlFor="notes"
                                                className="font-semibold text-gray-700 mb-2 block"
                                            >
                                                Notes
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes || ""}
                                                onChange={(e) =>
                                                    setData(
                                                        "notes",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full"
                                                rows="4"
                                                placeholder="Add any additional notes about the treatment..."
                                            />
                                            <InputError
                                                message={errors.notes}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Procedures Details (Dynamic Input) */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <ClipboardList className="h-6 w-6 text-blue-600" />
                                        Procedures Details
                                    </h3>
                                    <div className="space-y-6">
                                        {data.procedures_details.map(
                                            (procedure, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-gray-50 relative shadow-sm"
                                                >
                                                    <div className="flex-1 space-y-3 w-full">
                                                        <div>
                                                            <Label
                                                                htmlFor={`procedure-step-${index}`}
                                                                className="text-sm font-medium mb-1 block"
                                                            >
                                                                Step {index + 1}
                                                            </Label>
                                                            <Input
                                                                id={`procedure-step-${index}`}
                                                                type="text"
                                                                value={
                                                                    procedure.step ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newProcedures =
                                                                        [
                                                                            ...data.procedures_details,
                                                                        ];
                                                                    newProcedures[
                                                                        index
                                                                    ].step =
                                                                        e.target.value;
                                                                    setData(
                                                                        "procedures_details",
                                                                        newProcedures
                                                                    );
                                                                }}
                                                                placeholder="e.g., Dental Cleaning"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label
                                                                htmlFor={`procedure-notes-${index}`}
                                                                className="text-sm font-medium mb-1 block"
                                                            >
                                                                Notes
                                                            </Label>
                                                            <Textarea
                                                                id={`procedure-notes-${index}`}
                                                                value={
                                                                    procedure.notes ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newProcedures =
                                                                        [
                                                                            ...data.procedures_details,
                                                                        ];
                                                                    newProcedures[
                                                                        index
                                                                    ].notes =
                                                                        e.target.value;
                                                                    setData(
                                                                        "procedures_details",
                                                                        newProcedures
                                                                    );
                                                                }}
                                                                placeholder="Detailed notes for this step"
                                                                rows="3"
                                                                className="w-full"
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => {
                                                            const newProcedures =
                                                                data.procedures_details.filter(
                                                                    (_, i) =>
                                                                        i !==
                                                                        index
                                                                );
                                                            setData(
                                                                "procedures_details",
                                                                newProcedures
                                                            );
                                                        }}
                                                        className="flex-shrink-0 mt-4 sm:mt-0 h-9 w-9 rounded-full"
                                                    >
                                                        X
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setData("procedures_details", [
                                                    ...data.procedures_details,
                                                    { step: "", notes: "" },
                                                ])
                                            }
                                            className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 py-2.5"
                                        >
                                            <PlusCircle className="h-5 w-5" />{" "}
                                            Add Procedure Step
                                        </Button>
                                    </div>
                                    <InputError
                                        message={errors.procedures_details}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Images (with Dynamic Inputs and Previews) */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <Image className="h-6 w-6 text-blue-600" />
                                        Treatment Images
                                    </h3>
                                    <div className="space-y-6">
                                        {data.images.map((url, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-gray-50 relative shadow-sm"
                                            >
                                                <div className="flex-1 w-full">
                                                    <Label
                                                        htmlFor={`image-url-${index}`}
                                                        className="text-sm font-medium mb-1 block"
                                                    >
                                                        Image URL {index + 1}
                                                    </Label>
                                                    <Input
                                                        id={`image-url-${index}`}
                                                        type="text"
                                                        value={url}
                                                        onChange={(e) => {
                                                            const newImages = [
                                                                ...data.images,
                                                            ];
                                                            newImages[index] =
                                                                e.target.value;
                                                            setData(
                                                                "images",
                                                                newImages
                                                            );
                                                        }}
                                                        placeholder="Enter direct image URL (e.g., Google Drive direct link)"
                                                        className="w-full"
                                                    />
                                                    {url &&
                                                        (url.startsWith(
                                                            "http://"
                                                        ) ||
                                                            url.startsWith(
                                                                "https://"
                                                            )) && (
                                                            <img
                                                                src={url}
                                                                alt={`Image Preview ${
                                                                    index + 1
                                                                }`}
                                                                className="mt-3 w-full h-40 object-contain rounded-md border border-gray-200 bg-white p-2"
                                                            />
                                                        )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newImages =
                                                            data.images.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            );
                                                        setData(
                                                            "images",
                                                            newImages
                                                        );
                                                    }}
                                                    className="flex-shrink-0 mt-4 sm:mt-0 h-9 w-9 rounded-full"
                                                >
                                                    X
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setData("images", [
                                                    ...data.images,
                                                    "",
                                                ])
                                            }
                                            className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 py-2.5"
                                        >
                                            <PlusCircle className="h-5 w-5" />{" "}
                                            Add Image URL
                                        </Button>
                                    </div>
                                    <InputError
                                        message={errors.images}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Recommendations */}
                                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                        <Lightbulb className="h-6 w-6 text-blue-600" />
                                        Recommendations
                                    </h3>
                                    <Label
                                        htmlFor="recommendations"
                                        className="font-semibold text-gray-700 mb-2 block"
                                    >
                                        Recommendations
                                    </Label>
                                    <Textarea
                                        id="recommendations"
                                        value={data.recommendations || ""}
                                        onChange={(e) =>
                                            setData(
                                                "recommendations",
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                        rows="5"
                                        placeholder="Enter post-treatment recommendations..."
                                    />
                                    <InputError
                                        message={errors.recommendations}
                                        className="mt-2"
                                    />
                                </div>
                            </CardContent>

                            <div className="flex items-center justify-end mt-8 gap-4">
                                <Link
                                    href={route("clinic.treatments.index", {
                                        clinic: auth.clinic_id,
                                    })}
                                    className="inline-flex items-center px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg font-bold text-sm text-gray-700 uppercase tracking-wider shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    Cancel
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-lg font-bold text-sm text-white uppercase tracking-wider shadow-md hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    {processing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Create Treatment
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
