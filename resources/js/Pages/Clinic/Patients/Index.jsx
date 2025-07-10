import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Plus, Search, Pencil } from "lucide-react";
import { useState } from "react";

export default function Index({ auth, patients, filters }) {
    const [search, setSearch] = useState(filters.search || "");

    // Function to perform the search using router.reload
    const performSearch = (query) => {
        router.reload({
            data: { search: query },
            only: ["patients", "filters"], // Only update the patients and filters props
            preserveState: true,
            replace: true, // Replace the current history entry
        });
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearch(query);
        // Trigger search after a small delay to avoid excessive requests
        // clearTimeout(window._searchTimeout);
        // window._searchTimeout = setTimeout(() => {
        performSearch(query);
        // }, 300); // Adjust delay as needed
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Perform search immediately on form submission
        performSearch(search);
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Patients
                </h2>
            }
        >
            <Head title="Patients" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Patient List</CardTitle>
                            <Link
                                href={route("clinic.patients.create", {
                                    clinic: auth.clinic_id,
                                })}
                            >
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Patient
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <form
                                    onSubmit={handleFormSubmit}
                                    className="flex gap-2"
                                >
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Search patients..."
                                            value={search}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <Button type="submit">
                                        <Search className="mr-2 h-4 w-4" />
                                        Search
                                    </Button>
                                </form>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Phone</TableHead>
                                            <TableHead>Last Visit</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {patients.data.map((patient) => (
                                            <TableRow key={patient.id}>
                                                <TableCell className="font-medium">
                                                    {patient.name}
                                                </TableCell>
                                                <TableCell>
                                                    {patient.email}
                                                </TableCell>
                                                <TableCell>
                                                    {patient.phone}
                                                </TableCell>
                                                <TableCell>
                                                    {patient.last_visit
                                                        ? new Date(
                                                              patient.last_visit
                                                          ).toLocaleDateString()
                                                        : "Never"}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={route(
                                                                "clinic.patients.show",
                                                                {
                                                                    clinic: auth.clinic_id,
                                                                    patient:
                                                                        patient.id,
                                                                }
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
                                                                "clinic.patients.edit",
                                                                {
                                                                    clinic: auth.clinic_id,
                                                                    patient:
                                                                        patient.id,
                                                                }
                                                            )}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                <Pencil className="h-4 w-4 mr-1" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {patients.links && (
                                <div className="mt-4">
                                    {patients.links.map((link, i) =>
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`mr-2 px-3 py-1 rounded ${
                                                    link.active
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className={`mr-2 px-3 py-1 rounded opacity-50 cursor-not-allowed ${
                                                    link.active
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
