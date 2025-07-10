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
import { CalendarIcon, Loader2 } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function Edit({ auth, treatment, patients, dentists }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        patient_id: treatment.patient_id.toString(),
        dentist_id: treatment.user_id.toString(),
        name: treatment.name,
        description: treatment.description,
        cost: treatment.cost,
        status: treatment.status,
        start_date: treatment.start_date
            ? new Date(treatment.start_date)
            : undefined,
        end_date: treatment.end_date ? new Date(treatment.end_date) : undefined,
        notes: treatment.notes || "",
    });

    const statuses = [
        { value: "scheduled", label: "Scheduled" },
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const submit = (e) => {
        e.preventDefault();
        put(
            route("clinic.treatments.update", {
                clinic: auth.clinic_id,
                treatment: treatment.id,
            })
        );
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            isClinicPage={true}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Treatment: {treatment.name}
                </h2>
            }
        >
            <Head title={`Edit Treatment: ${treatment.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-sm rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            <CardHeader className="px-0 pt-0">
                                <CardTitle className="text-2xl font-bold">
                                    Edit Treatment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0 pb-0 space-y-6">
                                {/* Patient Select */}
                                <div>
                                    <Label htmlFor="patient_id">Patient</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setData("patient_id", value)
                                        }
                                        value={data.patient_id}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map((patient) => (
                                                <SelectItem
                                                    key={patient.id}
                                                    value={patient.id.toString()}
                                                >
                                                    {patient.user.name}
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
                                    <Label htmlFor="dentist_id">Dentist</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setData("dentist_id", value)
                                        }
                                        value={data.dentist_id}
                                    >
                                        <SelectTrigger>
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

                                {/* Name */}
                                <div>
                                    <Label htmlFor="name">Treatment Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">
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
                                        className="mt-1 block w-full"
                                    />
                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Cost */}
                                <div>
                                    <Label htmlFor="cost">Cost</Label>
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
                                            className="pl-7"
                                            value={data.cost}
                                            onChange={(e) =>
                                                setData("cost", e.target.value)
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.cost}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Status Select */}
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setData("status", value)
                                        }
                                        value={data.status}
                                    >
                                        <SelectTrigger>
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

                                {/* Start Date */}
                                <div>
                                    <Label htmlFor="start_date">
                                        Start Date
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !data.start_date &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {data.start_date ? (
                                                    format(
                                                        data.start_date,
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.start_date}
                                                onSelect={(date) =>
                                                    setData("start_date", date)
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <InputError
                                        message={errors.start_date}
                                        className="mt-2"
                                    />
                                </div>

                                {/* End Date */}
                                <div>
                                    <Label htmlFor="end_date">End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !data.end_date &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {data.end_date ? (
                                                    format(
                                                        new Date(data.end_date),
                                                        "PPP"
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={data.end_date}
                                                onSelect={(date) =>
                                                    setData("end_date", date)
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <InputError
                                        message={errors.end_date}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                    />
                                    <InputError
                                        message={errors.notes}
                                        className="mt-2"
                                    />
                                </div>
                            </CardContent>
                            <div className="flex items-center justify-end mt-6">
                                <Button type="submit" disabled={processing}>
                                    {processing ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Update Treatment
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
