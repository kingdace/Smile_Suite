import { Head } from "@inertiajs/react";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import { Link } from "@inertiajs/react";
import { Plus, Search, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Index({ auth, clinic, appointments, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [status, setStatus] = useState(filters.status || "all");
    const [type, setType] = useState(filters.type || "all");
    const [date, setDate] = useState(filters.date || "");
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showDenyModal, setShowDenyModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [dentists, setDentists] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState("");
    const [denyReason, setDenyReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        if (showApproveModal && clinic.id) {
            axios
                .get(route("clinic.dentists.index", [clinic.id]))
                .then((res) => {
                    let dentistList = res.data.dentists;
                    // Include current user if they are a dentist and not already in the list
                    if (auth?.user?.role === "dentist") {
                        const alreadyIncluded = dentistList.some(
                            (d) => d.id === auth.user.id
                        );
                        if (!alreadyIncluded) {
                            dentistList = [
                                {
                                    id: auth.user.id,
                                    name: auth.user.name,
                                    email: auth.user.email,
                                    role: "dentist",
                                },
                                ...dentistList,
                            ];
                        }
                    }
                    setDentists(dentistList);
                });
        }
    }, [showApproveModal, clinic.id]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("clinic.appointments.index", clinic.id),
            {
                search,
                status: status === "all" ? "" : status,
                type: type === "all" ? "" : type,
                date,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleApprove = (appointment) => {
        setSelectedAppointment(appointment);
        setShowApproveModal(true);
        setSelectedDentist(appointment.assigned_to || "");
        setActionError("");
    };
    const handleDeny = (appointment) => {
        setSelectedAppointment(appointment);
        setShowDenyModal(true);
        setDenyReason("");
        setActionError("");
    };
    const submitApprove = async () => {
        setActionLoading(true);
        setActionError("");
        try {
            await axios.post(
                route("clinic.appointments.approve-online", {
                    clinic: clinic.id,
                    appointment: selectedAppointment.id,
                }),
                {
                    assigned_to: selectedDentist || null,
                }
            );
            setShowApproveModal(false);
            window.location.reload();
        } catch (err) {
            setActionError("Failed to approve appointment.");
        } finally {
            setActionLoading(false);
        }
    };
    const submitDeny = async () => {
        setActionLoading(true);
        setActionError("");
        try {
            await axios.post(
                route("clinic.appointments.deny-online", {
                    clinic: clinic.id,
                    appointment: selectedAppointment.id,
                }),
                {
                    cancellation_reason: denyReason,
                }
            );
            setShowDenyModal(false);
            window.location.reload();
        } catch (err) {
            setActionError("Failed to deny appointment.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Appointments
                </h2>
            }
        >
            <Head title="Appointments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Appointments List</CardTitle>
                            <Link
                                href={route(
                                    "clinic.appointments.create",
                                    clinic.id
                                )}
                            >
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    New Appointment
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSearch}
                                className="flex flex-col sm:flex-row gap-4 mb-6"
                            >
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Search patients..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="Pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="Confirmed">
                                            Confirmed
                                        </SelectItem>
                                        <SelectItem value="Completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="Cancelled">
                                            Cancelled
                                        </SelectItem>
                                        <SelectItem value="No Show">
                                            No Show
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="Walk-in">
                                            Walk-in
                                        </SelectItem>
                                        <SelectItem value="Phone Call">
                                            Phone Call
                                        </SelectItem>
                                        <SelectItem value="Online Booking">
                                            Online Booking
                                        </SelectItem>
                                        <SelectItem value="Follow-up">
                                            Follow-up
                                        </SelectItem>
                                        <SelectItem value="Emergency">
                                            Emergency
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-[180px]"
                                />
                                <Button type="submit">
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </Button>
                            </form>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date & Time</TableHead>
                                            <TableHead>Dentist</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {appointments.data.map(
                                            (appointment) => {
                                                console.log(
                                                    "Appointment row:",
                                                    appointment
                                                );
                                                const isOnline =
                                                    appointment.type?.name?.toLowerCase?.() ===
                                                    "online booking";
                                                const statusName =
                                                    appointment.status?.name?.toLowerCase?.() ||
                                                    "";
                                                return (
                                                    <TableRow
                                                        key={appointment.id}
                                                    >
                                                        <TableCell>
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
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                appointment.type
                                                                    .name
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                style={{
                                                                    backgroundColor:
                                                                        appointment
                                                                            .status
                                                                            .color,
                                                                }}
                                                            >
                                                                {
                                                                    appointment
                                                                        .status
                                                                        .name
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {format(
                                                                new Date(
                                                                    appointment.scheduled_at
                                                                ),
                                                                "MMM d, yyyy h:mm a"
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {appointment.assigned_dentist
                                                                ? appointment
                                                                      .assigned_dentist
                                                                      .name
                                                                : "Not assigned"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    href={route(
                                                                        "clinic.appointments.show",
                                                                        [
                                                                            clinic.id,
                                                                            appointment.id,
                                                                        ]
                                                                    )}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        View
                                                                    </Button>
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "clinic.appointments.edit",
                                                                        [
                                                                            clinic.id,
                                                                            appointment.id,
                                                                        ]
                                                                    )}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                </Link>
                                                                {isOnline &&
                                                                    statusName ===
                                                                        "pending" && (
                                                                        <>
                                                                            <Button
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        "#22c55e",
                                                                                    color: "white",
                                                                                    border: "none",
                                                                                }}
                                                                                size="sm"
                                                                                className="ml-2 flex items-center gap-1 rounded-md px-3 py-1.5 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                                                                                onClick={() =>
                                                                                    handleApprove(
                                                                                        appointment
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Check className="w-4 h-4" />{" "}
                                                                                Approve
                                                                            </Button>
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                className="ml-2 flex items-center gap-1 rounded-md px-3 py-1.5"
                                                                                onClick={() =>
                                                                                    handleDeny(
                                                                                        appointment
                                                                                    )
                                                                                }
                                                                            >
                                                                                <X className="w-4 h-4" />{" "}
                                                                                Deny
                                                                            </Button>
                                                                        </>
                                                                    )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowApproveModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Approve Appointment
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Assign Dentist (optional)
                            </label>
                            <select
                                className="w-full border rounded px-3 py-2"
                                value={selectedDentist}
                                onChange={(e) =>
                                    setSelectedDentist(e.target.value)
                                }
                            >
                                <option value="">Unassigned</option>
                                {dentists.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {actionError && (
                            <div className="text-red-600 text-sm mb-2">
                                {actionError}
                            </div>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowApproveModal(false)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#22c55e",
                                    color: "white",
                                    border: "none",
                                }}
                                className="flex items-center gap-1 rounded-md px-3 py-1.5 hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                                onClick={submitApprove}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    "Approving..."
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" /> Approve
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {/* Deny Modal */}
            {showDenyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowDenyModal(false)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Deny Appointment
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Denial (optional)
                            </label>
                            <textarea
                                className="w-full border rounded px-3 py-2"
                                value={denyReason}
                                onChange={(e) => setDenyReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                        {actionError && (
                            <div className="text-red-600 text-sm mb-2">
                                {actionError}
                            </div>
                        )}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowDenyModal(false)}
                                disabled={actionLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-1 rounded-md px-3 py-1.5"
                                onClick={submitDeny}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    "Denying..."
                                ) : (
                                    <>
                                        <X className="w-4 h-4" /> Deny
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
