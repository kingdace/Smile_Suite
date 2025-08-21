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
    RotateCcw,
    AlertCircle,
    X,
} from "lucide-react";

export default function Index({ auth, users, clinics, show_deleted, filters }) {
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [roleFilter, setRoleFilter] = useState(filters.role || "");
    const [clinicFilter, setClinicFilter] = useState(filters.clinic_id || "");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [hardDeleteDialogOpen, setHardDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToHardDelete, setUserToHardDelete] = useState(null);
    const [userToRestore, setUserToRestore] = useState(null);

    // Bulk delete functionality
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [bulkHardDeleteDialogOpen, setBulkHardDeleteDialogOpen] =
        useState(false);

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
                    page: 1, // Reset to first page when searching
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
                page: 1, // Reset to first page when filtering
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
                page: 1, // Reset to first page when filtering
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
                page: 1, // Reset to first page when toggling deleted
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

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleHardDeleteClick = (user) => {
        setUserToHardDelete(user);
        setHardDeleteDialogOpen(true);
    };

    const handleRestoreClick = (user) => {
        setUserToRestore(user);
        setRestoreDialogOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route("admin.users.destroy", userToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setUserToDelete(null);
                },
                onError: (errors) => {
                    console.error("Delete failed:", errors);
                    setDeleteDialogOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const confirmHardDelete = () => {
        if (userToHardDelete) {
            router.delete(
                route("admin.users.hard-delete", userToHardDelete.id),
                {
                    onSuccess: () => {
                        setHardDeleteDialogOpen(false);
                        setUserToHardDelete(null);
                    },
                    onError: (errors) => {
                        console.error("Hard delete failed:", errors);
                        setHardDeleteDialogOpen(false);
                        setUserToHardDelete(null);
                    },
                }
            );
        }
    };

    // Bulk delete functionality
    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedUsers(users.data.map((user) => user.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId, checked) => {
        if (checked) {
            setSelectedUsers((prev) => [...prev, userId]);
        } else {
            setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        }
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length > 0) {
            setBulkDeleteDialogOpen(true);
        }
    };

    const handleBulkHardDelete = () => {
        if (selectedUsers.length > 0) {
            setBulkHardDeleteDialogOpen(true);
        }
    };

    const confirmBulkDelete = () => {
        if (selectedUsers.length > 0) {
            router.delete(route("admin.users.bulk-destroy"), {
                data: { user_ids: selectedUsers },
                onSuccess: () => {
                    setBulkDeleteDialogOpen(false);
                    setSelectedUsers([]);
                    setSelectAll(false);
                },
                onError: (errors) => {
                    console.error("Bulk delete failed:", errors);
                    setBulkDeleteDialogOpen(false);
                },
            });
        }
    };

    const confirmBulkHardDelete = () => {
        if (selectedUsers.length > 0) {
            router.delete(route("admin.users.bulk-hard-delete"), {
                data: { user_ids: selectedUsers },
                onSuccess: () => {
                    setBulkHardDeleteDialogOpen(false);
                    setSelectedUsers([]);
                    setSelectAll(false);
                },
                onError: (errors) => {
                    console.error("Bulk hard delete failed:", errors);
                    setBulkHardDeleteDialogOpen(false);
                },
            });
        }
    };

    const confirmRestore = () => {
        if (userToRestore) {
            router.patch(
                route("admin.users.restore", userToRestore.id),
                {},
                {
                    onSuccess: () => {
                        setRestoreDialogOpen(false);
                        setUserToRestore(null);
                    },
                    onError: (errors) => {
                        console.error("Restore failed:", errors);
                        setRestoreDialogOpen(false);
                        setUserToRestore(null);
                    },
                }
            );
        }
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
                    <div className="bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl sm:rounded-2xl border border-blue-200/50">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        Users Management
                                    </h1>
                                    <p className="text-gray-600 mt-1 text-sm">
                                        Manage system users and their
                                        permissions
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
                                        onClick={openAddModal}
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm"
                                    >
                                        + Add New User
                                    </button>
                                    {selectedUsers.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleBulkDelete}
                                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Bulk Delete (
                                                {selectedUsers.length})
                                            </button>
                                            {show_deleted && (
                                                <button
                                                    onClick={
                                                        handleBulkHardDelete
                                                    }
                                                    className="bg-gradient-to-r from-red-700 to-red-800 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Bulk Hard Delete (
                                                    {selectedUsers.length})
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mb-5 bg-gradient-to-r from-blue-50 via-white to-cyan-50/30 backdrop-blur-sm rounded-xl shadow-md border border-blue-200/50 p-4">
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-blue-500" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search users by name or email..."
                                            value={searchValue}
                                            onChange={handleSearchChange}
                                            className="block w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-300 text-sm"
                                        />
                                    </div>
                                    <select
                                        value={roleFilter}
                                        onChange={handleRoleFilterChange}
                                        className="px-3 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
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
                                        className="px-3 py-2 border border-blue-200 rounded-lg bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
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
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50/30 rounded-xl shadow-lg border border-blue-200/50 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full divide-y divide-blue-100">
                                        <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600">
                                            <tr>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectAll}
                                                        onChange={
                                                            handleSelectAll
                                                        }
                                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                    />
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <User className="inline w-4 h-4 mr-2" />
                                                    User
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <Building2 className="inline w-4 h-4 mr-2" />
                                                    Clinic
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <Mail className="inline w-4 h-4 mr-2" />
                                                    Email
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    <Shield className="inline w-4 h-4 mr-2" />
                                                    Role
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-bold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-blue-100">
                                            {users.data.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="text-center py-10 text-gray-500"
                                                    >
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                                                                <User className="w-7 h-7 text-blue-400" />
                                                            </div>
                                                            <p className="text-base font-semibold text-gray-700">
                                                                No users found
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
                                                users.data.map(
                                                    (user, index) => (
                                                        <tr
                                                            key={user.id}
                                                            className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-all duration-300 ${
                                                                user.deleted_at
                                                                    ? "opacity-60"
                                                                    : ""
                                                            } ${
                                                                index % 2 === 0
                                                                    ? "bg-white"
                                                                    : "bg-blue-50/20"
                                                            }`}
                                                        >
                                                            <td className="px-3 py-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedUsers.includes(
                                                                        user.id
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleSelectUser(
                                                                            user.id,
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                                                                        <span className="text-white text-sm font-bold">
                                                                            {user.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-semibold text-gray-900 text-sm">
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            ID:{" "}
                                                                            {
                                                                                user.id
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {user.clinic ? (
                                                                    <div className="flex items-center">
                                                                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-md flex items-center justify-center mr-2">
                                                                            <Building2 className="w-3 h-3 text-white" />
                                                                        </div>
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            {
                                                                                user
                                                                                    .clinic
                                                                                    .name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm text-gray-400 italic">
                                                                        No
                                                                        clinic
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center">
                                                                    <Mail className="w-4 h-4 text-blue-400 mr-2" />
                                                                    <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                                                        {
                                                                            user.email
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <span
                                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                                                                        user.role ===
                                                                        "admin"
                                                                            ? "bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200"
                                                                            : user.role ===
                                                                              "dentist"
                                                                            ? "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-200"
                                                                            : user.role ===
                                                                              "clinic_admin"
                                                                            ? "bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 border border-cyan-200"
                                                                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200"
                                                                    }`}
                                                                >
                                                                    <Shield className="w-3 h-3" />
                                                                    {user.role.replace(
                                                                        "_",
                                                                        " "
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                {user.deleted_at ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-200">
                                                                        <Trash2 className="w-3 h-3" />
                                                                        Deleted
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200">
                                                                        <BadgeCheck className="w-3 h-3" />
                                                                        Active
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-3">
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        onClick={() =>
                                                                            openEditModal(
                                                                                user
                                                                            )
                                                                        }
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                                                    >
                                                                        <Edit2 className="w-3 h-3" />
                                                                        Edit
                                                                    </button>

                                                                    {user.deleted_at ? (
                                                                        <div className="flex items-center gap-1">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleRestoreClick(
                                                                                        user
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-semibold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                                                            >
                                                                                <RotateCcw className="w-3 h-3" />
                                                                                Restore
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleHardDeleteClick(
                                                                                        user
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-red-800 text-white text-xs font-semibold hover:from-red-800 hover:to-red-900 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105"
                                                                            >
                                                                                <Trash2 className="w-3 h-3" />
                                                                                Hard
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteClick(
                                                                                    user
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
                            {users.links && users.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-blue-100">
                                    {/* Page Info */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-gray-600">
                                            Showing{" "}
                                            <span className="font-semibold">
                                                {(users.current_page - 1) *
                                                    users.per_page +
                                                    1}
                                            </span>{" "}
                                            to{" "}
                                            <span className="font-semibold">
                                                {Math.min(
                                                    users.current_page *
                                                        users.per_page,
                                                    users.total
                                                )}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold">
                                                {users.total}
                                            </span>{" "}
                                            users
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Page{" "}
                                            <span className="font-semibold">
                                                {users.current_page}
                                            </span>{" "}
                                            of{" "}
                                            <span className="font-semibold">
                                                {users.last_page}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <nav className="flex items-center space-x-2">
                                            {users.links.map((link, index) =>
                                                link.url ? (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-4 py-2 text-sm rounded-lg border transition-all duration-300 font-semibold shadow-sm ${
                                                            link.active
                                                                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-600 shadow-md"
                                                                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50 hover:shadow-md"
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                        preserveState
                                                        preserveScroll
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
            {deleteDialogOpen && userToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
                                        Delete User
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
                                    Delete {userToDelete.name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will soft delete the user account. The
                                    user will no longer be able to access the
                                    system, but their data will be preserved.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Delete User
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
            {restoreDialogOpen && userToRestore && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
                                        Restore User
                                    </h2>
                                    <p className="text-emerald-100 text-xs">
                                        Reactivate user account
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
                                    Restore {userToRestore.name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will restore the user account. The user
                                    will be able to access the system again with
                                    their previous permissions.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmRestore}
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Restore User
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

            {/* Hard Delete Confirmation Dialog */}
            {hardDeleteDialogOpen && userToHardDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-700 to-red-800 p-4 text-white relative">
                            <button
                                onClick={() => setHardDeleteDialogOpen(false)}
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
                                        Permanently Delete User
                                    </h2>
                                    <p className="text-red-100 text-xs">
                                        This action is irreversible
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
                                    Permanently Delete {userToHardDelete.name}?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will permanently delete the user
                                    account and all associated data from the
                                    database. This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmHardDelete}
                                    className="flex-1 bg-gradient-to-r from-red-700 to-red-800 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Permanently Delete
                                </button>
                                <button
                                    onClick={() =>
                                        setHardDeleteDialogOpen(false)
                                    }
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Delete Confirmation Dialog */}
            {bulkDeleteDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 text-white relative">
                            <button
                                onClick={() => setBulkDeleteDialogOpen(false)}
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
                                        Bulk Delete Users
                                    </h2>
                                    <p className="text-red-100 text-xs">
                                        Soft delete multiple users
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
                                    Delete {selectedUsers.length} Users?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will soft delete {selectedUsers.length}{" "}
                                    user accounts. The users will no longer be
                                    able to access the system, but their data
                                    will be preserved.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmBulkDelete}
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Delete {selectedUsers.length} Users
                                </button>
                                <button
                                    onClick={() =>
                                        setBulkDeleteDialogOpen(false)
                                    }
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Hard Delete Confirmation Dialog */}
            {bulkHardDeleteDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in border border-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-700 to-red-800 p-4 text-white relative">
                            <button
                                onClick={() =>
                                    setBulkHardDeleteDialogOpen(false)
                                }
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
                                        Bulk Permanently Delete Users
                                    </h2>
                                    <p className="text-red-100 text-xs">
                                        This action is irreversible
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
                                    Permanently Delete {selectedUsers.length}{" "}
                                    Users?
                                </h3>
                                <p className="text-sm text-gray-600">
                                    This will permanently delete{" "}
                                    {selectedUsers.length} user accounts and all
                                    associated data from the database. This
                                    action cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 pt-3">
                                <button
                                    onClick={confirmBulkHardDelete}
                                    className="flex-1 bg-gradient-to-r from-red-700 to-red-800 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
                                >
                                    Permanently Delete {selectedUsers.length}{" "}
                                    Users
                                </button>
                                <button
                                    onClick={() =>
                                        setBulkHardDeleteDialogOpen(false)
                                    }
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
