import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import Pagination from "@/Components/Pagination";
import { format } from "date-fns";
import { Search, PlusCircle } from "lucide-react";

export default function Index({ auth, treatments, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || "",
        sort_by: filters.sort_by || "created_at", // Default sort by created_at
        sort_direction: filters.sort_direction || "desc", // Default sort direction desc
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(
            route("clinic.treatments.index", {
                clinic: auth.clinic_id,
                ...data,
            })
        );
    };

    const handleSort = (column) => {
        let direction = "asc";
        if (data.sort_by === column && data.sort_direction === "asc") {
            direction = "desc";
        }
        setData({ ...data, sort_by: column, sort_direction: direction }); // Ensure all data properties are preserved
        get(
            route("clinic.treatments.index", {
                clinic: auth.clinic_id,
                ...data,
                sort_by: column,
                sort_direction: direction,
            })
        );
    };

    const getSortIcon = (column) => {
        if (data.sort_by === column) {
            return data.sort_direction === "asc" ? " ↑" : " ↓";
        }
        return "";
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            isClinicPage={true}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Treatments
                </h2>
            }
        >
            <Head title="Treatments" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="bg-white shadow-sm rounded-lg">
                        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-4">
                            <CardTitle className="text-2xl font-bold">
                                Treatments
                            </CardTitle>
                            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex items-center gap-2 w-full sm:w-auto"
                                >
                                    <div className="relative flex-grow items-center">
                                        <Input
                                            id="search"
                                            type="text"
                                            placeholder="Search treatments..."
                                            className="pl-10 pr-2 w-full"
                                            value={data.search}
                                            onChange={(e) =>
                                                setData(
                                                    "search",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <span className="absolute inset-y-0 left-0 flex items-center justify-center px-2">
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                        </span>
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        className="flex-shrink-0"
                                    >
                                        Search
                                    </Button>
                                </form>
                                <Link
                                    href={route("clinic.treatments.create", {
                                        clinic: auth.clinic_id,
                                    })}
                                    className="w-full sm:w-auto"
                                >
                                    <Button className="w-full">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add New Treatment
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 py-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            onClick={() => handleSort("name")}
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            Name{getSortIcon("name")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() => handleSort("cost")}
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            Cost{getSortIcon("cost")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() => handleSort("status")}
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            Status{getSortIcon("status")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() =>
                                                handleSort("start_date")
                                            }
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            Start Date
                                            {getSortIcon("start_date")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() =>
                                                handleSort("end_date")
                                            }
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            End Date{getSortIcon("end_date")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() =>
                                                handleSort("patient_id")
                                            }
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            Patient{getSortIcon("patient_id")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() =>
                                                handleSort("user_id")
                                            }
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            Dentist{getSortIcon("user_id")}
                                        </TableHead>
                                        <TableHead
                                            onClick={() =>
                                                handleSort("created_at")
                                            }
                                            className="cursor-pointer text-gray-900 font-semibold hover:text-blue-600 transition-colors py-3 px-4"
                                        >
                                            Created At
                                            {getSortIcon("created_at")}
                                        </TableHead>
                                        <TableHead className="py-3 px-4 text-gray-900 font-semibold">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {treatments.data.length > 0 ? (
                                        treatments.data.map((treatment) => (
                                            <TableRow
                                                key={treatment.id}
                                                className="hover:bg-gray-100 transition-colors duration-200 ease-in-out border-b last:border-b-0"
                                            >
                                                <TableCell className="font-medium py-3 px-4 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap align-top">
                                                    {treatment.name}
                                                </TableCell>
                                                <TableCell className="py-3 px-4 font-semibold text-green-700 align-top">
                                                    <div className="text-sm text-gray-900">
                                                        ₱{treatment.cost}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3 px-4 align-top">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                            treatment.status ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : treatment.status ===
                                                                  "in_progress"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : treatment.status ===
                                                                  "scheduled"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {treatment.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            treatment.status
                                                                .slice(1)
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-3 px-4 text-gray-700 align-top">
                                                    {treatment.start_date
                                                        ? format(
                                                              new Date(
                                                                  treatment.start_date
                                                              ),
                                                              "PPP"
                                                          )
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell className="py-3 px-4 text-gray-700 align-top">
                                                    {treatment.end_date
                                                        ? format(
                                                              new Date(
                                                                  treatment.end_date
                                                              ),
                                                              "PPP"
                                                          )
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell className="py-3 px-4 text-gray-700 align-top">
                                                    {treatment.patient
                                                        ?.full_name || "N/A"}
                                                </TableCell>
                                                <TableCell className="py-3 px-4 text-gray-700 align-top">
                                                    {treatment.dentist?.name ||
                                                        "N/A"}
                                                </TableCell>
                                                <TableCell className="py-3 px-4 text-gray-700 align-top">
                                                    {format(
                                                        new Date(
                                                            treatment.created_at
                                                        ),
                                                        "PPP"
                                                    )}
                                                </TableCell>
                                                <TableCell className="flex space-x-2 py-3 px-4 align-top">
                                                    <Link
                                                        href={route(
                                                            "clinic.treatments.show",
                                                            {
                                                                clinic: auth.clinic_id,
                                                                treatment:
                                                                    treatment.id,
                                                            }
                                                        )}
                                                        replace={true}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                                        >
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link
                                                        href={route(
                                                            "clinic.treatments.edit",
                                                            {
                                                                clinic: auth.clinic_id,
                                                                treatment:
                                                                    treatment.id,
                                                            }
                                                        )}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-6 text-gray-500 text-lg"
                                            >
                                                No treatments found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <Pagination
                                links={treatments.links}
                                className="mt-4"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
