import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
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
import { Label } from "@/Components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Edit({
    auth,
    clinic,
    appointment,
    types,
    statuses,
    dentists,
}) {
    const { data, setData, put, processing, errors } = useForm({
        appointment_type_id: appointment.appointment_type_id,
        appointment_status_id: appointment.appointment_status_id,
        assigned_to: appointment.assigned_to || "",
        scheduled_at: appointment.scheduled_at,
        ended_at: appointment.ended_at || "",
        reason: appointment.reason || "",
        notes: appointment.notes || "",
        cancellation_reason: appointment.cancellation_reason || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("clinic.appointments.update", [clinic.id, appointment.id]));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Appointment
                </h2>
            }
        >
            <Head title="Edit Appointment" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Edit Appointment</CardTitle>
                            <Link
                                href={route("clinic.appointments.show", [
                                    clinic.id,
                                    appointment.id,
                                ])}
                            >
                                <Button variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Details
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="appointment_type_id">
                                            Appointment Type
                                        </Label>
                                        <Select
                                            value={data.appointment_type_id}
                                            onValueChange={(value) =>
                                                setData(
                                                    "appointment_type_id",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {types.map((type) => (
                                                    <SelectItem
                                                        key={type.id}
                                                        value={type.id}
                                                    >
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.appointment_type_id && (
                                            <p className="text-sm text-red-500">
                                                {errors.appointment_type_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="appointment_status_id">
                                            Status
                                        </Label>
                                        <Select
                                            value={data.appointment_status_id}
                                            onValueChange={(value) =>
                                                setData(
                                                    "appointment_status_id",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem
                                                        key={status.id}
                                                        value={status.id}
                                                    >
                                                        {status.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.appointment_status_id && (
                                            <p className="text-sm text-red-500">
                                                {errors.appointment_status_id}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="assigned_to">
                                            Assigned Dentist
                                        </Label>
                                        <Select
                                            value={data.assigned_to}
                                            onValueChange={(value) =>
                                                setData("assigned_to", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select dentist" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {dentists.map((dentist) => (
                                                    <SelectItem
                                                        key={dentist.id}
                                                        value={dentist.id}
                                                    >
                                                        {dentist.first_name}{" "}
                                                        {dentist.last_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.assigned_to && (
                                            <p className="text-sm text-red-500">
                                                {errors.assigned_to}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="scheduled_at">
                                            Date & Time
                                        </Label>
                                        <Input
                                            type="datetime-local"
                                            value={data.scheduled_at}
                                            onChange={(e) =>
                                                setData(
                                                    "scheduled_at",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.scheduled_at && (
                                            <p className="text-sm text-red-500">
                                                {errors.scheduled_at}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ended_at">
                                            End Date & Time
                                        </Label>
                                        <Input
                                            type="datetime-local"
                                            value={data.ended_at}
                                            onChange={(e) =>
                                                setData(
                                                    "ended_at",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.ended_at && (
                                            <p className="text-sm text-red-500">
                                                {errors.ended_at}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reason">Reason</Label>
                                    <Input
                                        type="text"
                                        value={data.reason}
                                        onChange={(e) =>
                                            setData("reason", e.target.value)
                                        }
                                    />
                                    {errors.reason && (
                                        <p className="text-sm text-red-500">
                                            {errors.reason}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData("notes", e.target.value)
                                        }
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-500">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                {data.appointment_status_id == 4 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cancellation_reason">
                                            Cancellation Reason
                                        </Label>
                                        <Textarea
                                            value={data.cancellation_reason}
                                            onChange={(e) =>
                                                setData(
                                                    "cancellation_reason",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors.cancellation_reason && (
                                            <p className="text-sm text-red-500">
                                                {errors.cancellation_reason}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Update Appointment
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
