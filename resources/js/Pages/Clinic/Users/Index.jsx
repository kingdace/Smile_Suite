import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    UserPlus,
    User,
    UserCog,
    ArrowLeft,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Eye, EyeOff } from "lucide-react";

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
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "dentist",
    });
    const [userList, setUserList] = useState(users);

    const filteredUsers = userList.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleOpenModal = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            role: "dentist",
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormErrors({});
    };

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});
        try {
            const response = await window.axios.post(
                route("clinic.users.store"),
                formData
            );
            if (response.data && response.data.user) {
                setUserList((prev) => [...prev, response.data.user]);
            } else {
                // fallback: reload the page or fetch users
                window.location.reload();
            }
            setShowModal(false);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                setFormErrors(err.response.data.errors);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Clinic User Management" />
            <div className="max-w-5xl mx-auto py-8 relative">
                <Card className="mb-8">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-blue-600" />
                                User Management
                            </CardTitle>
                            <div className="text-sm text-gray-500 mt-1">
                                <span className="font-semibold">Plan:</span>{" "}
                                {plan} |{" "}
                                <span className="font-semibold">
                                    User Limit:
                                </span>{" "}
                                {limit} |{" "}
                                <span className="font-semibold">
                                    Current Users:
                                </span>{" "}
                                {userList.length}
                            </div>
                        </div>
                        <Button
                            onClick={handleOpenModal}
                            disabled={!canAdd}
                            className="gap-2"
                        >
                            <UserPlus className="h-4 w-4" /> Add User
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center mb-4 gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="Search users by name, email, or role..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <span className="text-xs text-gray-400 ml-2">
                                {filteredUsers.length} of {limit} slots used
                            </span>
                        </div>
                        <div className="overflow-x-auto rounded-lg shadow-sm">
                            <table className="min-w-full bg-white border rounded-lg text-sm">
                                <thead>
                                    <tr className="bg-blue-50">
                                        <th className="py-2 px-4 border-b text-left">
                                            User
                                        </th>
                                        <th className="py-2 px-4 border-b text-left">
                                            Email
                                        </th>
                                        <th className="py-2 px-4 border-b text-left">
                                            Role
                                        </th>
                                        <th className="py-2 px-4 border-b text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-center text-gray-400 py-8"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <Users className="h-10 w-10 mb-2 text-blue-200" />
                                                    No users found for this
                                                    clinic.
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    {filteredUsers.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white hover:bg-blue-50"
                                                    : "bg-gray-50 hover:bg-blue-50"
                                            }
                                        >
                                            <td className="py-2 px-4 border-b flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-base">
                                                    {getInitials(user.name)}
                                                </div>
                                                <span>{user.name}</span>
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {user.email}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded-full border text-xs font-semibold capitalize ${
                                                        roleColors[user.role] ||
                                                        "bg-gray-100 text-gray-700 border-gray-200"
                                                    }`}
                                                >
                                                    {user.role.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 border-b text-center">
                                                <Link
                                                    href={route(
                                                        "clinic.users.edit",
                                                        user.id
                                                    )}
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mr-2"
                                                    title="Edit User"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "clinic.users.destroy",
                                                        user.id
                                                    )}
                                                    method="delete"
                                                    as="button"
                                                    className="inline-flex items-center text-red-600 hover:text-red-800"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                {/* Modal for Add User */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="max-w-lg w-full">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <UserPlus className="h-6 w-6 text-blue-600" />{" "}
                                Add Clinic User
                            </DialogTitle>
                            <DialogDescription>
                                Fill out the form below to add a new user to
                                your clinic. The user will receive an email with
                                login instructions.
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 mt-2"
                        >
                            {formErrors &&
                                Object.keys(formErrors).length > 0 && (
                                    <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2">
                                        {Object.values(formErrors).map(
                                            (err, i) => (
                                                <div key={i}>{err}</div>
                                            )
                                        )}
                                    </div>
                                )}
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Full Name
                                </label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleFormChange("name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block mb-1 font-semibold">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={formData.password}
                                            onChange={(e) =>
                                                handleFormChange(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-2 text-gray-400 hover:text-blue-600"
                                            onClick={() =>
                                                setShowPassword((v) => !v)
                                            }
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block mb-1 font-semibold">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                formData.password_confirmation
                                            }
                                            onChange={(e) =>
                                                handleFormChange(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-2 text-gray-400 hover:text-blue-600"
                                            onClick={() =>
                                                setShowConfirm((v) => !v)
                                            }
                                            tabIndex={-1}
                                        >
                                            {showConfirm ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Role
                                </label>
                                <div className="flex gap-4 mt-1">
                                    {roleOptions.map((role) => (
                                        <label
                                            key={role.value}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                                                formData.role === role.value
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                                            }`}
                                        >
                                            <role.icon className="h-5 w-5" />
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={
                                                    formData.role === role.value
                                                }
                                                onChange={(e) =>
                                                    handleFormChange(
                                                        "role",
                                                        e.target.value
                                                    )
                                                }
                                                className="hidden"
                                            />
                                            {role.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" /> Add
                                    User
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleCloseModal}
                                >
                                    <ArrowLeft className="h-4 w-4" /> Cancel
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
                {/* Floating Add User Button */}
                <Button
                    onClick={handleOpenModal}
                    className="fixed bottom-8 right-8 z-50 shadow-lg rounded-full p-0 h-14 w-14 flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 transition"
                    style={{ display: canAdd ? "flex" : "none" }}
                >
                    <UserPlus className="h-7 w-7" />
                </Button>
            </div>
        </AuthenticatedLayout>
    );
}
