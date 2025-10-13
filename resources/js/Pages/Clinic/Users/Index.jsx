import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { getDentistDisplayName } from "@/Helpers/DentistHelper";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    UserPlus,
    User,
    UserCog,
    Eye,
    Stethoscope,
    Shield,
    Mail,
    Phone,
    Calendar,
    Building2,
    Crown,
    Star,
    Activity,
    Settings,
    MoreVertical,
    CheckCircle,
    XCircle,
    Filter,
    Download,
    Upload,
} from "lucide-react";

function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

const roleColors = {
    clinic_admin: "bg-blue-100 text-blue-800 border-blue-200",
    dentist: "bg-green-100 text-green-800 border-green-200",
    staff: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const roleOptions = [
    { value: "dentist", label: "Dentist", icon: User },
    { value: "staff", label: "Staff", icon: UserCog },
];

export default function Index({
    users,
    limit,
    count,
    plan,
    errors,
    success,
    auth,
}) {
    const canAdd = count < limit;
    const [search, setSearch] = useState("");
    const [userList, setUserList] = useState(users);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Form state for create/edit
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "staff",
        is_active: true,
    });
    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const filteredUsers = userList.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase());

        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && u.is_active) ||
            (statusFilter === "inactive" && !u.is_active);

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Modal handlers
    const openCreateModal = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "staff",
            is_active: true,
        });
        setFormErrors({});
        setShowCreateModal(true);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: "",
            password_confirmation: "",
            role: user.role,
            is_active: user.is_active,
        });
        setFormErrors({});
        setShowEditModal(true);
    };

    const openViewModal = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});

        try {
            await router.post(route("clinic.users.store"), formData, {
                onSuccess: (page) => {
                    setShowCreateModal(false);
                    // Update local state with new user data
                    setUserList(page.props.users);
                    // Reset form
                    setFormData({
                        name: "",
                        email: "",
                        password: "",
                        password_confirmation: "",
                        role: "staff",
                        is_active: true,
                    });
                },
                onError: (errors) => {
                    setFormErrors(errors);
                },
            });
        } catch (error) {
            console.error("Create error:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});

        try {
            await router.put(
                route("clinic.users.update", selectedUser.id),
                formData,
                {
                    onSuccess: (page) => {
                        setShowEditModal(false);
                        // Update local state with updated user data
                        setUserList(page.props.users);
                    },
                    onError: (errors) => {
                        setFormErrors(errors);
                    },
                }
            );
        } catch (error) {
            console.error("Update error:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (user) => {
        if (!confirm(`Are you sure you want to delete ${user.name}?`)) {
            return;
        }

        try {
            await router.delete(route("clinic.users.destroy", user.id), {
                onSuccess: (page) => {
                    // Update local state with updated user data
                    setUserList(page.props.users);
                },
            });
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const toggleUserStatus = async (user) => {
        try {
            await router.patch(
                route("clinic.users.toggle-status", user.id),
                {},
                {
                    onSuccess: (page) => {
                        // Update local state with updated user data
                        setUserList(page.props.users);
                    },
                }
            );
        } catch (error) {
            console.error("Toggle status error:", error);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="User Management" />

            {/* Compact Background */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Compact Header Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">
                                            User Management
                                        </h1>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>Plan: {plan}</span>
                                            <span>
                                                {userList.length}/{limit} Users
                                            </span>
                                            <span>
                                                {
                                                    filteredUsers.filter(
                                                        (u) => u.is_active
                                                    ).length
                                                }{" "}
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Export
                                    </Button>
                                    <Button
                                        onClick={openCreateModal}
                                        disabled={!canAdd}
                                        className="gap-2"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Add User
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Combined Search, Filters and Users Table */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        className="pl-10"
                                        placeholder="Search users by name, email, or role..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-gray-500" />
                                        <select
                                            value={roleFilter}
                                            onChange={(e) =>
                                                setRoleFilter(e.target.value)
                                            }
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="all">
                                                All Roles
                                            </option>
                                            <option value="clinic_admin">
                                                Clinic Admin
                                            </option>
                                            <option value="dentist">
                                                Dentist
                                            </option>
                                            <option value="staff">Staff</option>
                                        </select>
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </select>
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                        {filteredUsers.length} results
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No users found
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {search ||
                                        roleFilter !== "all" ||
                                        statusFilter !== "all"
                                            ? "Try adjusting your search or filters"
                                            : "Get started by adding your first team member"}
                                    </p>
                                    {!search &&
                                        roleFilter === "all" &&
                                        statusFilter === "all" && (
                                            <Button
                                                onClick={openCreateModal}
                                                className="gap-2"
                                            >
                                                <UserPlus className="h-4 w-4" />
                                                Add First User
                                            </Button>
                                        )}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Joined
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="relative">
                                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                                    <span className="text-sm font-bold text-blue-600">
                                                                        {getInitials(
                                                                            user.name
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div
                                                                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                                                        user.is_active
                                                                            ? "bg-green-500"
                                                                            : "bg-gray-400"
                                                                    }`}
                                                                ></div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {getDentistDisplayName(
                                                                        user
                                                                    )}
                                                                </div>
                                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                                    <Mail className="h-3 w-3" />
                                                                    {user.email}
                                                                </div>
                                                                {user.phone_number && (
                                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                        <Phone className="h-3 w-3" />
                                                                        {
                                                                            user.phone_number
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            className={`${
                                                                roleColors[
                                                                    user.role
                                                                ] ||
                                                                "bg-gray-100 text-gray-700 border-gray-200"
                                                            } text-xs font-semibold px-2 py-1`}
                                                        >
                                                            {user.role ===
                                                                "clinic_admin" && (
                                                                <Shield className="w-3 h-3 mr-1" />
                                                            )}
                                                            {user.role ===
                                                                "dentist" && (
                                                                <Stethoscope className="w-3 h-3 mr-1" />
                                                            )}
                                                            {user.role ===
                                                                "staff" && (
                                                                <UserCog className="w-3 h-3 mr-1" />
                                                            )}
                                                            {user.role
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )
                                                                .toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            {user.is_active ? (
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <XCircle className="h-4 w-4 text-red-500" />
                                                            )}
                                                            <span className="text-sm text-gray-900">
                                                                {user.is_active
                                                                    ? "Active"
                                                                    : "Inactive"}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(
                                                            user.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openViewModal(
                                                                        user
                                                                    )
                                                                }
                                                                className="gap-1 text-xs"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        user
                                                                    )
                                                                }
                                                                className="gap-1 text-xs"
                                                            >
                                                                <Edit className="h-3 w-3" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    toggleUserStatus(
                                                                        user
                                                                    )
                                                                }
                                                                className={`gap-1 text-xs ${
                                                                    user.is_active
                                                                        ? "text-red-600 hover:bg-red-50"
                                                                        : "text-green-600 hover:bg-green-50"
                                                                }`}
                                                            >
                                                                {user.is_active ? (
                                                                    <XCircle className="h-3 w-3" />
                                                                ) : (
                                                                    <CheckCircle className="h-3 w-3" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user
                                                                    )
                                                                }
                                                                className="gap-1 text-xs text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create User Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                            Add New User
                        </DialogTitle>
                        <DialogDescription>
                            Create a new account for a team member. They can
                            complete their professional profile after logging
                            in.
                        </DialogDescription>
                    </DialogHeader>

                    {formErrors && Object.keys(formErrors).length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            {Object.values(formErrors).map((error, index) => (
                                <p key={index} className="text-sm text-red-600">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={formData.password_confirmation}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password_confirmation: e.target.value,
                                    })
                                }
                                placeholder="Confirm password"
                                required
                            />
                        </div>

                        <div>
                            <Label>Role</Label>
                            <div className="flex gap-3 mt-2">
                                {roleOptions.map((role) => (
                                    <label
                                        key={role.value}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                                            formData.role === role.value
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                                        }`}
                                    >
                                        <role.icon className="h-4 w-4" />
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role.value}
                                            checked={
                                                formData.role === role.value
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    role: e.target.value,
                                                })
                                            }
                                            className="hidden"
                                        />
                                        {role.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="is_active">Active Status</Label>
                                <p className="text-sm text-gray-600">
                                    Enable this user account
                                </p>
                            </div>
                            <Switch
                                id="is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        is_active: checked,
                                    })
                                }
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 text-xs font-bold">
                                        i
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-800 mb-1">
                                        Professional Information
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                        After creating the account, the user can
                                        log in and complete their professional
                                        information in their profile.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowCreateModal(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4" />
                                        Create User
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5 text-green-600" />
                            Edit User
                        </DialogTitle>
                        <DialogDescription>
                            Update basic account information for{" "}
                            {selectedUser?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="edit_name">Full Name</Label>
                            <Input
                                id="edit_name"
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="edit_email">Email Address</Label>
                            <Input
                                id="edit_email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div>
                            <Label>Role</Label>
                            <div className="flex gap-3 mt-2">
                                {roleOptions.map((role) => (
                                    <label
                                        key={role.value}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                                            formData.role === role.value
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                                        }`}
                                    >
                                        <role.icon className="h-4 w-4" />
                                        <input
                                            type="radio"
                                            name="edit_role"
                                            value={role.value}
                                            checked={
                                                formData.role === role.value
                                            }
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    role: e.target.value,
                                                })
                                            }
                                            className="hidden"
                                        />
                                        {role.label}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="edit_is_active">
                                    Active Status
                                </Label>
                                <p className="text-sm text-gray-600">
                                    Enable this user account
                                </p>
                            </div>
                            <Switch
                                id="edit_is_active"
                                checked={formData.is_active}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        is_active: checked,
                                    })
                                }
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowEditModal(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="gap-2"
                            >
                                {processing ? "Updating..." : "Update User"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View User Modal */}
            <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            User Profile
                        </DialogTitle>
                        <DialogDescription>
                            View detailed information about {selectedUser?.name}
                            's account and professional profile.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {getInitials(selectedUser.name)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {getDentistDisplayName(selectedUser)}
                                    </h3>
                                    <p className="text-gray-600">
                                        {selectedUser.email}
                                    </p>
                                    <Badge
                                        className={`${
                                            roleColors[selectedUser.role]
                                        } mt-2`}
                                    >
                                        {selectedUser.role
                                            .replace("_", " ")
                                            .toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowViewModal(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
