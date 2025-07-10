import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { format } from "date-fns";
import ClinicLogo from "@/Components/ClinicLogo";
import { Mail, Phone, BadgeCheck, Star, MapPin } from "lucide-react";
import Pagination from "@/Components/Pagination";

export default function Index({ auth, clinics }) {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredClinics = clinics.data.filter((clinic) => {
        const matchesSearch =
            clinic.name.toLowerCase().includes(search.toLowerCase()) ||
            clinic.email.toLowerCase().includes(search.toLowerCase()) ||
            clinic.contact_number.includes(search) ||
            (clinic.description &&
                clinic.description
                    .toLowerCase()
                    .includes(search.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" ||
            clinic.subscription_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-500";
            case "inactive":
                return "bg-red-500";
            case "trial":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Clinics Management
                </h2>
            }
            hideSidebar={true}
        >
            <Head title="Clinics" />

            <div className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white/95 rounded-2xl border border-blue-100 shadow-sm">
                        <CardHeader className="mb-2 pb-2 border-b border-blue-50">
                            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                                Clinics Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                                <Input
                                    type="text"
                                    placeholder="Search clinics, descriptions..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="max-w-sm shadow-sm"
                                    aria-label="Search clinics"
                                />
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                        <SelectItem value="trial">
                                            Trial
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-blue-50 bg-white">
                                <Table className="min-w-full divide-y divide-blue-50">
                                    <TableHeader>
                                        <TableRow className="bg-blue-50">
                                            <TableHead className="text-blue-700 font-semibold w-20">
                                                Logo
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                                Name & Address
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                                Contact
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                                Plan
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                                Status
                                            </TableHead>
                                            <TableHead className="text-blue-700 font-semibold">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredClinics.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="py-16 text-center text-gray-400"
                                                >
                                                    <Star className="mx-auto mb-2 w-8 h-8 text-blue-200" />
                                                    No clinics found matching
                                                    your search criteria.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {filteredClinics.map((clinic) => (
                                            <TableRow
                                                key={clinic.id}
                                                className="hover:bg-blue-50/80 transition-all group"
                                            >
                                                <TableCell className="align-middle">
                                                    <ClinicLogo
                                                        clinic={clinic}
                                                        className="h-12 w-12 rounded-full border border-blue-100 shadow-sm bg-white object-cover mx-auto"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900 align-middle min-w-[220px]">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-lg">
                                                            {clinic.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                        <MapPin
                                                            className="w-4 h-4 text-blue-400"
                                                            aria-label="Address"
                                                        />
                                                        <span>
                                                            {clinic.street_address ||
                                                                "-"}
                                                        </span>
                                                    </div>
                                                    {clinic.description && (
                                                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                            {clinic.description
                                                                .length > 80
                                                                ? `${clinic.description.substring(
                                                                      0,
                                                                      80
                                                                  )}...`
                                                                : clinic.description}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="align-middle min-w-[160px]">
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Mail
                                                            className="w-4 h-4 text-blue-400"
                                                            aria-label="Email"
                                                        />
                                                        <span>
                                                            {clinic.email}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 mt-1">
                                                        <Phone
                                                            className="w-4 h-4 text-blue-300"
                                                            aria-label="Phone"
                                                        />
                                                        <span>
                                                            {
                                                                clinic.contact_number
                                                            }
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-middle">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700">
                                                        <Star
                                                            className="w-4 h-4 text-yellow-400"
                                                            aria-label="Plan"
                                                        />
                                                        {
                                                            clinic.subscription_plan
                                                        }
                                                    </span>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        End:{" "}
                                                        {clinic.subscription_end_date
                                                            ? format(
                                                                  new Date(
                                                                      clinic.subscription_end_date
                                                                  ),
                                                                  "MMM d, yyyy"
                                                              )
                                                            : "-"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-middle">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">
                                                        <BadgeCheck
                                                            className={`w-4 h-4 ${
                                                                clinic.subscription_status ===
                                                                "active"
                                                                    ? "text-green-500"
                                                                    : clinic.subscription_status ===
                                                                      "inactive"
                                                                    ? "text-red-500"
                                                                    : "text-blue-400"
                                                            }`}
                                                            aria-label="Status"
                                                        />
                                                        {
                                                            clinic.subscription_status
                                                        }
                                                    </span>
                                                </TableCell>
                                                <TableCell className="align-middle">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "admin.clinics.show",
                                                                        clinic.id
                                                                    )
                                                                )
                                                            }
                                                            className="group-hover:scale-105 transition-transform"
                                                            aria-label={`View ${clinic.name}`}
                                                        >
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "admin.clinics.edit",
                                                                        clinic.id
                                                                    )
                                                                )
                                                            }
                                                            className="group-hover:scale-105 transition-transform"
                                                            aria-label={`Edit ${clinic.name}`}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {clinics.links && clinics.links.length > 1 && (
                                <div className="mt-8">
                                    <Pagination links={clinics.links} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
