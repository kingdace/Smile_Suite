import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
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
                onSuccess: () => {
                    setShowCreateModal(false);
                    // Refresh the page to get updated data
                    router.reload({ only: ["users", "count"] });
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
                    onSuccess: () => {
                        setShowEditModal(false);
                        router.reload({ only: ["users"] });
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
                onSuccess: () => {
                    router.reload({ only: ["users", "count"] });
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
                    onSuccess: () => {
                        router.reload({ only: ["users"] });
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

            {/* Enhanced Background */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Enhanced Header Section */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-2xl mb-8">
                        <div className="absolute inset-0 bg-black/5"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative px-8 py-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg">
                                            <Users className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-white mb-2">
                                            User Management
                                        </h1>
                                        <div className="flex items-center gap-6 text-blue-100">
                                            <div className="flex items-center gap-2">
                                                <Crown className="h-4 w-4" />
                                                <span className="text-sm font-medium">
                                                    Plan: {plan}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span className="text-sm font-medium">
                                                    {userList.length}/{limit}{" "}
                                                    Users
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Activity className="h-4 w-4" />
                                                <span className="text-sm font-medium">
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
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
                                    >
                                        <Download className="h-4 w-4" />
                                        Export
                                    </Button>
                                    <Button
                                        onClick={openCreateModal}
                                        disabled={!canAdd}
                                        className="gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Add User
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Filters and Search */}
                    <Card className="mb-6 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                        </CardContent>
                    </Card>

                    {/* Enhanced Users Grid */}
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-12 w-12 text-blue-400" />
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredUsers.map((user, index) => (
                                        <div
                                            key={user.id}
                                            className="group relative bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-blue-100/50 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                        >
                                            {/* Status indicator */}
                                            <div
                                                className={`absolute top-0 right-0 w-4 h-4 rounded-bl-lg ${
                                                    user.is_active
                                                        ? "bg-green-400"
                                                        : "bg-red-400"
                                                }`}
                                            ></div>

                                            <div className="p-6">
                                                {/* User Avatar and Info */}
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                                            <span className="text-lg font-bold text-white">
                                                                {getInitials(
                                                                    user.name
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                                                user.is_active
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-400"
                                                            }`}
                                                        ></div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {user.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Mail className="h-3 w-3 text-gray-400" />
                                                            <p className="text-sm text-gray-600 truncate">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Role Badge */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <Badge
                                                        className={`${
                                                            roleColors[
                                                                user.role
                                                            ] ||
                                                            "bg-gray-100 text-gray-700 border-gray-200"
                                                        } text-xs font-semibold px-3 py-1`}
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
                                                            .replace("_", " ")
                                                            .toUpperCase()}
                                                    </Badge>
                                                    <div className="flex items-center gap-1">
                                                        {user.is_active ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-red-500" />
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            {user.is_active
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Additional Info */}
                                                <div className="space-y-2 mb-4">
                                                    {user.phone_number && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                                            <Phone className="h-3 w-3" />
                                                            <span>
                                                                {
                                                                    user.phone_number
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            Joined{" "}
                                                            {new Date(
                                                                user.created_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openViewModal(user)
                                                        }
                                                        className="flex-1 gap-1 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            openEditModal(user)
                                                        }
                                                        className="flex-1 gap-1 text-xs border-green-200 text-green-600 hover:bg-green-50"
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
                                                        className={`gap-1 text-xs px-2 ${
                                                            user.is_active
                                                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                                                : "border-green-200 text-green-600 hover:bg-green-50"
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
                                                            handleDelete(user)
                                                        }
                                                        className="gap-1 text-xs px-2 border-red-200 text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                        {selectedUser.name}
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
