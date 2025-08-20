import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { format } from "date-fns";

import {
    Mail,
    Phone,
    BadgeCheck,
    Star,
    MapPin,
    Building2,
    Search,
    Filter,
    Eye,
    Edit2,
    Plus,
    Activity,
    Calendar,
    Users,
    Trash2,
    RotateCcw,
    AlertCircle,
    X,
    Shield,
} from "lucide-react";

export default function Index({
    auth,
    clinics,
    show_deleted = false,
    filters = {},
}) {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [clinicToDelete, setClinicToDelete] = useState(null);
    const [clinicToRestore, setClinicToRestore] = useState(null);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        // Remove debounced search and send immediate request
        router.get(
            route("admin.clinics.index"),
            {
                search: value,
                status: statusFilter,
                show_deleted: show_deleted,
                page: 1, // Reset to first page when searching
            },
            { preserveState: true, replace: true }
        );
    };

    const handleStatusFilterChange = (e) => {
        const newStatus = e.target.value;
        setStatusFilter(newStatus);
        router.get(
            route("admin.clinics.index"),
            {
                search: searchValue,
                status: newStatus,
                show_deleted: show_deleted,
                page: 1, // Reset to first page when filtering
            },
            { preserveState: true, replace: true }
        );
    };

    const toggleShowDeleted = () => {
        const newShowDeleted = !show_deleted;
        router.get(
            route("admin.clinics.index"),
            {
                search: searchValue,
                status: statusFilter,
                show_deleted: newShowDeleted,
                page: 1, // Reset to first page when toggling deleted
            },
            { preserveState: true, replace: true }
        );
    };

    const handleDeleteClick = (clinic) => {
        setClinicToDelete(clinic);
        setDeleteDialogOpen(true);
    };

    const handleRestoreClick = (clinic) => {
        setClinicToRestore(clinic);
        setRestoreDialogOpen(true);
    };

    const confirmDelete = () => {
        if (clinicToDelete) {
            router.delete(route("admin.clinics.destroy", clinicToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setClinicToDelete(null);
                },
                onError: (errors) => {
                    console.error("Delete failed:", errors);
                    setDeleteDialogOpen(false);
                    setClinicToDelete(null);
                },
            });
        }
    };

    const confirmRestore = () => {
        if (clinicToRestore) {
            router.patch(
                route("admin.clinics.restore", clinicToRestore.id),
                {},
                {
                    onSuccess: () => {
                        setRestoreDialogOpen(false);
                        setClinicToRestore(null);
                    },
                    onError: (errors) => {
                        console.error("Restore failed:", errors);
                        setRestoreDialogOpen(false);
                        setClinicToRestore(null);
                    },
                }
            );
        }
    };

    // Use the clinics data directly from the backend
    const filteredClinics = clinics.data;

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Clinics Management
                </h2>
            }
        >
            <Head title="Clinics Management" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Building2 className="w-5 h-5 text-white" />
                                        </div>
                                        Clinics Management
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        Manage dental clinics and their
                                        subscriptions
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "admin.subscriptions.index"
                                                )
                                            )
                                        }
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Subscriptions
                                    </button>
                                    <button
                                        onClick={toggleShowDeleted}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md text-sm ${
                                            show_deleted
                                                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300"
                                                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300"
                                        }`}
                                    >
                                        {show_deleted
                                            ? "Hide Deleted"
                                            : "Show Deleted"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            router.visit(
                                                route("admin.clinics.create")
                                            )
                                        }
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
                                    >
                                        + Add New Clinic
                                    </button>
                                </div>
                            </div>
                            <div className="mb-5 bg-gradient-to-r from-blue-50 via-white to-cyan-50/30 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-4">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search clinics by name, email, or description..."
                                            value={searchValue}
                                            onChange={handleSearchChange}
                                            className="block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={handleStatusFilterChange}
                                        className="px-3 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                        <option value="trial">Trial</option>
                                    </select>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50/30 rounded-xl shadow-lg border border-blue-200/50 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full divide-y divide-blue-100">
                                        <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <Building2 className="inline w-4 h-4 mr-2" />
                                                    Clinic
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <Mail className="inline w-4 h-4 mr-2" />
                                                    Contact
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <Star className="inline w-4 h-4 mr-2" />
                                                    Plan
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <Activity className="inline w-4 h-4 mr-2" />
                                                    Status
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-100">
                                            {filteredClinics.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="text-center py-10 text-gray-500"
                                                    >
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                                                                <Building2 className="w-7 h-7 text-blue-400" />
                                                            </div>
                                                            <p className="text-base font-semibold text-gray-700">
                                                                No clinics found
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Try adjusting
                                                                your search or
                                                                filters
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredClinics.map(
                                                    (clinic, index) => (
                                                        <tr
                                                            key={clinic.id}
                                                            className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 ${
                                                                clinic.deleted_at
                                                                    ? "opacity-60"
                                                                    : ""
                                                            } ${
                                                                index % 2 === 0
                                                                    ? "bg-white"
                                                                    : "bg-blue-50/20"
                                                            }`}
                                                        >
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-sm overflow-hidden">
                                                                        <img
                                                                            src={
                                                                                clinic.logo_url ||
                                                                                "/images/clinic-logo.png"
                                                                            }
                                                                            alt={`${clinic.name} Logo`}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(
                                                                                e
                                                                            ) => {
                                                                                e.target.src =
                                                                                    "/images/clinic-logo.png";
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-gray-900 text-sm">
                                                                            {
                                                                                clinic.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            ID:{" "}
                                                                            {
                                                                                clinic.id
                                                                            }
                                                                        </div>
                                                                        {clinic.street_address && (
                                                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                                                <MapPin className="w-3 h-3 text-blue-400" />
                                                                                <span className="truncate max-w-[200px]">
                                                                                    {
                                                                                        clinic.street_address
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center">
                                                                    <Mail className="w-4 h-4 text-blue-400 mr-2" />
                                                                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                                                        {
                                                                            clinic.email
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center mt-1">
                                                                    <Phone className="w-4 h-4 text-blue-400 mr-2" />
                                                                    <span className="text-sm text-gray-700">
                                                                        {
                                                                            clinic.contact_number
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-200">
                                                                    <Star className="w-3 h-3" />
                                                                    {clinic.subscription_plan ||
                                                                        "Free"}
                                                                </span>
                                                                {clinic.subscription_end_date && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Ends:{" "}
                                                                        {format(
                                                                            new Date(
                                                                                clinic.subscription_end_date
                                                                            ),
                                                                            "MMM d, yyyy"
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {clinic.deleted_at ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200">
                                                                        <Trash2 className="w-3 h-3" />
                                                                        Deleted
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                                                                            clinic.subscription_status ===
                                                                            "active"
                                                                                ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200"
                                                                                : clinic.subscription_status ===
                                                                                  "inactive"
                                                                                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200"
                                                                                : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200"
                                                                        }`}
                                                                    >
                                                                        <BadgeCheck className="w-3 h-3" />
                                                                        {
                                                                            clinic.subscription_status
                                                                        }
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                route(
                                                                                    "admin.clinics.show",
                                                                                    clinic.id
                                                                                )
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                                                    >
                                                                        <Eye className="w-3 h-3" />
                                                                        View
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            router.visit(
                                                                                route(
                                                                                    "admin.clinics.edit",
                                                                                    clinic.id
                                                                                )
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                                                    >
                                                                        <Edit2 className="w-3 h-3" />
                                                                        Edit
                                                                    </button>

                                                                    {clinic.deleted_at ? (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleRestoreClick(
                                                                                    clinic
                                                                                )
                                                                            }
                                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                                                        >
                                                                            <RotateCcw className="w-3 h-3" />
                                                                            Restore
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteClick(
                                                                                    clinic
                                                                                )
                                                                            }
                                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Pagination */}
                            {clinics.links && clinics.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-blue-100">
                                    {/* Page Info */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-gray-600">
                                            Showing{" "}
                                            <span className="font-semibold">
                                                {(clinics.current_page - 1) *
                                                    clinics.per_page +
                                                    1}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-semibold">
                                                {Math.min(
                                                    clinics.current_page *
                                                        clinics.per_page,
                                                    clinics.total
                                                )}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold">
                                                {clinics.total}
                                            </span>{" "}
                                            clinics
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Page{" "}
                                            <span className="font-semibold">
                                                {clinics.current_page}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold">
                                                {clinics.last_page}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <nav className="flex items-center space-x-2">
                                            {clinics.links.map((link, index) =>
                                                link.url ? (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            router.visit(
                                                                link.url
                                                            )
                                                        }
                                                        className={`px-4 py-2 text-sm rounded-lg border transition-all duration-300 font-semibold shadow-sm ${
                                                            link.active
                                                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-600 shadow-md"
                                                                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:shadow-md"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                ) : (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 text-sm rounded-lg opacity-50 cursor-not-allowed border border-gray-200"
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteDialogOpen && clinicToDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white relative">
                            <button
                                onClick={() => setDeleteDialogOpen(false)}
                                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
                                aria-label="Close"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Delete Clinic
                                    </h2>
                                    <p className="text-red-100 text-xs">
                                        This action cannot be undone
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    Delete {clinicToDelete.name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will soft delete the clinic. The clinic
                                    will no longer be accessible, but all data
                                    will be preserved.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Delete Clinic
                                </button>
                                <button
                                    onClick={() => setDeleteDialogOpen(false)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Restore Confirmation Dialog */}
            {restoreDialogOpen && clinicToRestore && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 text-white relative">
                            <button
                                onClick={() => setRestoreDialogOpen(false)}
                                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
                                aria-label="Close"
                                type="button"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <RotateCcw className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">
                                        Restore Clinic
                                    </h2>
                                    <p className="text-emerald-100 text-xs">
                                        Reactivate clinic account
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <RotateCcw className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    Restore {clinicToRestore.name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will restore the clinic account. The
                                    clinic will be able to access the system
                                    again with their previous settings.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmRestore}
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Restore Clinic
                                </button>
                                <button
                                    onClick={() => setRestoreDialogOpen(false)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
