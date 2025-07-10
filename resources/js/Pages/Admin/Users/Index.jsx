import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import React from "react";
import { useState, useCallback } from "react";
import debounce from "lodash/debounce";
import UserFormModal from "./UserFormModal";
import {
    User,
    Mail,
    Shield,
    Building2,
    BadgeCheck,
    Trash2,
    Edit2,
} from "lucide-react";

export default function Index({ auth, users, clinics, show_deleted, filters }) {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "");
    const [clinicFilter, setClinicFilter] = useState(filters.clinic_id || "");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedUser, setSelectedUser] = useState(null);

    // Debounced search function that waits 300ms after the user stops typing
    const debouncedSearch = useCallback(
        debounce((value) => {
            router.get(
                route("admin.users.index"),
                {
                    search: value,
                    role: filters.role,
                    clinic_id: filters.clinic_id,
                    show_deleted: show_deleted,
                },
                { preserveState: true, replace: true }
            );
        }, 300),
        [filters.role, filters.clinic_id, show_deleted]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value); // Update local state immediately
        debouncedSearch(value); // Trigger debounced server request
    };

    const handleRoleFilterChange = (e) => {
        const newRole = e.target.value;
        setRoleFilter(newRole);
        router.get(
            route("admin.users.index"),
            {
                search: searchValue,
                role: newRole,
                clinic_id: clinicFilter,
                show_deleted: show_deleted,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleClinicFilterChange = (e) => {
        const newClinic = e.target.value;
        setClinicFilter(newClinic);
        router.get(
            route("admin.users.index"),
            {
                search: searchValue,
                role: roleFilter,
                clinic_id: newClinic,
                show_deleted: show_deleted,
            },
            { preserveState: true, replace: true }
        );
    };

    const toggleShowDeleted = () => {
        const newShowDeleted = !show_deleted;
        router.get(
            route("admin.users.index"),
            {
                search: searchValue,
                role: roleFilter,
                clinic_id: clinicFilter,
                show_deleted: newShowDeleted,
            },
            { preserveState: true, replace: true }
        );
    };

    const openAddModal = () => {
        setModalMode("add");
        setSelectedUser(null);
        setModalOpen(true);
    };
    const openEditModal = (user) => {
        setModalMode("edit");
        setSelectedUser(user);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };
    const handleModalSuccess = () => {
        // Optionally, you can refresh the page or fetch users again if needed
        // For now, Inertia will handle updates via redirect/flash
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Users Management
                </h2>
            }
            hideSidebar={true}
        >
            <Head title="Users" />
            <UserFormModal
                open={modalOpen}
                onClose={closeModal}
                onSuccess={handleModalSuccess}
                user={selectedUser}
                clinics={clinics}
                mode={modalMode}
            />
            <div className="py-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-white min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-2xl">
                        <div className="p-8 text-gray-900">
                            <div className="flex justify-between items-center mb-8">
                                <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-2">
                                    <Shield className="w-7 h-7 text-blue-400" />{" "}
                                    Users
                                </h1>
                                <div className="space-x-4">
                                    <button
                                        onClick={toggleShowDeleted}
                                        className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                                            show_deleted
                                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {show_deleted
                                            ? "Hide Deleted"
                                            : "Show Deleted"}
                                    </button>
                                    <button
                                        onClick={openAddModal}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold shadow hover:bg-blue-600 transition-colors"
                                    >
                                        + Add New User
                                    </button>
                                </div>
                            </div>
                            <div className="mb-6 flex flex-col md:flex-row gap-4 md:gap-6">
                                <div className="flex-1 flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        className="flex-1 border-none bg-transparent focus:ring-0 text-lg"
                                    />
                                </div>
                                <select
                                    value={roleFilter}
                                    onChange={handleRoleFilterChange}
                                    className="border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-md shadow-sm"
                                >
                                    <option value="">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="dentist">Dentist</option>
                                    <option value="staff">Staff</option>
                                    <option value="clinic_admin">
                                        Clinic Admin
                                    </option>
                                </select>
                                <select
                                    value={clinicFilter}
                                    onChange={handleClinicFilterChange}
                                    className="border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-md shadow-sm"
                                >
                                    <option value="">All Clinics</option>
                                    {clinics.map((clinic) => (
                                        <option
                                            key={clinic.id}
                                            value={clinic.id}
                                        >
                                            {clinic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-blue-100 bg-blue-50/40">
                                <table className="min-w-full divide-y divide-blue-100">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                                                <User className="inline w-4 h-4 mr-1 text-blue-400" />{" "}
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                                                <Building2 className="inline w-4 h-4 mr-1 text-blue-400" />{" "}
                                                Clinic
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                                                <Mail className="inline w-4 h-4 mr-1 text-blue-400" />{" "}
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                                                <Shield className="inline w-4 h-4 mr-1 text-blue-400" />{" "}
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-blue-50">
                                        {users.data.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="text-center py-12 text-blue-400 text-lg"
                                                >
                                                    No users found.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.data.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className={
                                                        user.deleted_at
                                                            ? "opacity-60"
                                                            : ""
                                                    }
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-blue-900">
                                                        {user.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                                                        {user.clinic ? (
                                                            user.clinic.name
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                N/A
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">
                                                        {user.email}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                                                                user.role ===
                                                                "admin"
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : user.role ===
                                                                      "dentist"
                                                                    ? "bg-cyan-100 text-cyan-700"
                                                                    : user.role ===
                                                                      "clinic_admin"
                                                                    ? "bg-indigo-100 text-indigo-700"
                                                                    : "bg-gray-100 text-gray-700"
                                                            }`}
                                                        >
                                                            <Shield className="w-4 h-4" />{" "}
                                                            {user.role.replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.deleted_at ? (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                                                                <Trash2 className="w-4 h-4" />{" "}
                                                                Deleted
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                                                                <BadgeCheck className="w-4 h-4" />{" "}
                                                                Active
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    user
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />{" "}
                                                            Edit
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination */}
                            <div className="mt-8 flex justify-center">
                                {/* ... existing pagination logic ... */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
