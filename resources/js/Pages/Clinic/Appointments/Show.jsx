import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Show({ auth, clinic, appointment }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Appointment Details
                </h2>
            }
        >
            <Head title="Appointment Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Appointment Information</CardTitle>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route("clinic.appointments.edit", [
                                        clinic.id,
                                        appointment.id,
                                    ])}
                                >
                                    <Button>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit Appointment
                                    </Button>
                                </Link>
                                <Link
                                    href={route(
                                        "clinic.appointments.index",
                                        clinic.id
                                    )}
                                >
                                    <Button variant="outline">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to List
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Patient Information
                                        </h3>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">
                                                    Name:
                                                </span>{" "}
                                                {appointment.patient.first_name}{" "}
                                                {appointment.patient.last_name}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Email:
                                                </span>{" "}
                                                {appointment.patient.email}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Phone:
                                                </span>{" "}
                                                {appointment.patient.phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Appointment Details
                                        </h3>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">
                                                    Type:
                                                </span>{" "}
                                                {appointment.type.name}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Status:
                                                </span>{" "}
                                                <Badge
                                                    style={{
                                                        backgroundColor:
                                                            appointment.status
                                                                .color,
                                                    }}
                                                >
                                                    {appointment.status.name}
                                                </Badge>
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Scheduled:
                                                </span>{" "}
                                                {format(
                                                    new Date(
                                                        appointment.scheduled_at
                                                    ),
                                                    "MMM d, yyyy h:mm a"
                                                )}
                                            </p>
                                            {appointment.ended_at && (
                                                <p>
                                                    <span className="font-medium">
                                                        Ended:
                                                    </span>{" "}
                                                    {format(
                                                        new Date(
                                                            appointment.ended_at
                                                        ),
                                                        "MMM d, yyyy h:mm a"
                                                    )}
                                                </p>
                                            )}
                                            <p>
                                                <span className="font-medium">
                                                    Assigned Dentist:
                                                </span>{" "}
                                                {appointment.assigned_dentist
                                                    ? `${appointment.assigned_dentist.first_name} ${appointment.assigned_dentist.last_name}`
                                                    : "Not assigned"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Additional Information
                                        </h3>
                                        <div className="space-y-2">
                                            {appointment.reason && (
                                                <p>
                                                    <span className="font-medium">
                                                        Reason:
                                                    </span>{" "}
                                                    {appointment.reason}
                                                </p>
                                            )}
                                            {appointment.notes && (
                                                <p>
                                                    <span className="font-medium">
                                                        Notes:
                                                    </span>{" "}
                                                    {appointment.notes}
                                                </p>
                                            )}
                                            {appointment.cancellation_reason && (
                                                <p>
                                                    <span className="font-medium">
                                                        Cancellation Reason:
                                                    </span>{" "}
                                                    {
                                                        appointment.cancellation_reason
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            Appointment History
                                        </h3>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">
                                                    Created by:
                                                </span>{" "}
                                                {appointment.creator.first_name}{" "}
                                                {appointment.creator.last_name}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Created at:
                                                </span>{" "}
                                                {format(
                                                    new Date(
                                                        appointment.created_at
                                                    ),
                                                    "MMM d, yyyy h:mm a"
                                                )}
                                            </p>
                                            {appointment.confirmed_at && (
                                                <p>
                                                    <span className="font-medium">
                                                        Confirmed at:
                                                    </span>{" "}
                                                    {format(
                                                        new Date(
                                                            appointment.confirmed_at
                                                        ),
                                                        "MMM d, yyyy h:mm a"
                                                    )}
                                                </p>
                                            )}
                                            {appointment.cancelled_at && (
                                                <p>
                                                    <span className="font-medium">
                                                        Cancelled at:
                                                    </span>{" "}
                                                    {format(
                                                        new Date(
                                                            appointment.cancelled_at
                                                        ),
                                                        "MMM d, yyyy h:mm a"
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
