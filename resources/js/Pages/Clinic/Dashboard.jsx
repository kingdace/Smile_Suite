import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Calendar, Users, Package, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/Components/ui/badge";

export default function Dashboard({
    auth,
    clinic,
    stats,
    today_appointments,
    upcoming_appointments,
    recent_patients,
    lowStockItems,
    todayTreatments,
}) {
    const getStatusColor = (statusId) => {
        const colors = {
            1: "bg-yellow-100 text-yellow-800", // Pending
            2: "bg-green-100 text-green-800", // Confirmed
            3: "bg-blue-100 text-blue-800", // Completed
            4: "bg-red-100 text-red-800", // Cancelled
            5: "bg-gray-100 text-gray-800", // No Show
        };
        return colors[statusId] || "bg-gray-100 text-gray-800";
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {clinic.name} Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Patients
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total_patients}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Today's Appointments
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.today_appointments}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Low Stock Items
                                </CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.low_stock_items}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Today's Schedule and Upcoming Appointments */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Today's Appointments</CardTitle>
                                <Link
                                    href={route(
                                        "clinic.appointments.create",
                                        clinic.id
                                    )}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Add New
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {today_appointments.length === 0 ? (
                                    <p className="text-gray-500">
                                        No appointments scheduled for today.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {today_appointments.map(
                                            (appointment) => (
                                                <div
                                                    key={appointment.id}
                                                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                                                >
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {
                                                                appointment
                                                                    .patient
                                                                    .first_name
                                                            }{" "}
                                                            {
                                                                appointment
                                                                    .patient
                                                                    .last_name
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {format(
                                                                new Date(
                                                                    appointment.scheduled_at
                                                                ),
                                                                "h:mm a"
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                appointment.type
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <Badge
                                                            className={getStatusColor(
                                                                appointment.appointment_status_id
                                                            )}
                                                        >
                                                            {
                                                                appointment
                                                                    .status.name
                                                            }
                                                        </Badge>
                                                        <Link
                                                            href={route(
                                                                "clinic.appointments.show",
                                                                [
                                                                    clinic.id,
                                                                    appointment.id,
                                                                ]
                                                            )}
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            View
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Appointments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {upcoming_appointments.length === 0 ? (
                                    <p className="text-gray-500">
                                        No upcoming appointments.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {upcoming_appointments.map(
                                            (appointment) => (
                                                <div
                                                    key={appointment.id}
                                                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                                                >
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {
                                                                appointment
                                                                    .patient
                                                                    .first_name
                                                            }{" "}
                                                            {
                                                                appointment
                                                                    .patient
                                                                    .last_name
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {format(
                                                                new Date(
                                                                    appointment.scheduled_at
                                                                ),
                                                                "MMM d, yyyy h:mm a"
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                appointment.type
                                                                    .name
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-4">
                                                        <Badge
                                                            className={getStatusColor(
                                                                appointment.appointment_status_id
                                                            )}
                                                        >
                                                            {
                                                                appointment
                                                                    .status.name
                                                            }
                                                        </Badge>
                                                        <Link
                                                            href={route(
                                                                "clinic.appointments.show",
                                                                [
                                                                    clinic.id,
                                                                    appointment.id,
                                                                ]
                                                            )}
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            View
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Patients and Low Stock Items */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Recent Patients</CardTitle>
                                <Link
                                    href={route(
                                        "clinic.patients.index",
                                        clinic.id
                                    )}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {recent_patients.length > 0 ? (
                                    <div className="space-y-4">
                                        {recent_patients.map((patient) => (
                                            <div
                                                key={patient.id}
                                                className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {patient.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {patient.email}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route(
                                                        "clinic.patients.show",
                                                        [clinic.id, patient.id]
                                                    )}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No recent patients.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Low Stock Items</CardTitle>
                                <Link
                                    href={route(
                                        "clinic.inventory.index",
                                        clinic.id
                                    )}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    View All
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {lowStockItems.length > 0 ? (
                                    <div className="space-y-4">
                                        {lowStockItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-4 bg-white rounded-lg border"
                                            >
                                                <div>
                                                    <p className="font-medium">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Quantity:{" "}
                                                        {item.quantity} (Min:{" "}
                                                        {item.minimum_quantity})
                                                    </p>
                                                </div>
                                                <Link
                                                    href={route(
                                                        "clinic.inventory.show",
                                                        [clinic.id, item.id]
                                                    )}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No low stock items.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
