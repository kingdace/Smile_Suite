import React, { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import {
    User,
    Mail,
    Shield,
    Building2,
    Lock,
    X,
    Save,
    Plus,
} from "lucide-react";

export default function UserFormModal({
    open,
    onClose,
    onSuccess,
    user,
    clinics,
    mode = "add",
}) {
    const isEdit = mode === "edit" && user;
    const { data, setData, post, put, errors, processing, reset } = useForm({
        name: isEdit ? user.name : "",
        email: isEdit ? user.email : "",
        password: "",
        password_confirmation: "",
        role: isEdit ? user.role : "staff",
        clinic_id: isEdit ? user.clinic_id || "" : "",
    });

    // Check if clinic selection should be required
    const isClinicRequired = data.role !== "admin";

    useEffect(() => {
        if (open) {
            setData({
                name: isEdit ? user.name : "",
                email: isEdit ? user.email : "",
                password: "",
                password_confirmation: "",
                role: isEdit ? user.role : "staff",
                clinic_id: isEdit ? user.clinic_id || "" : "",
            });
        } else {
            reset();
        }
        // eslint-disable-next-line
    }, [open, user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route("admin.users.update", user.id), {
                onSuccess: () => {
                    onSuccess && onSuccess();
                    onClose();
                },
            });
        } else {
            post(route("admin.users.store"), {
                onSuccess: () => {
                    onSuccess && onSuccess();
                    onClose();
                },
            });
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md relative animate-fade-in border border-gray-200/50 overflow-hidden">
                {/* Compact Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors duration-200 focus:outline-none"
                        aria-label="Close"
                        type="button"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            {isEdit ? (
                                <Save className="w-4 h-4 text-white" />
                            ) : (
                                <Plus className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">
                                {isEdit ? "Edit User" : "Add User"}
                            </h2>
                            <p className="text-blue-100 text-xs">
                                {isEdit
                                    ? "Update user details"
                                    : "Create new account"}
                            </p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-3">
                    {/* Name Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-600" />
                            <InputLabel
                                htmlFor="name"
                                value="Full Name"
                                className="text-xs font-semibold text-gray-700"
                            />
                        </div>
                        <div className="relative">
                            <TextInput
                                id="name"
                                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                                isFocused
                                placeholder="Enter full name"
                            />
                            <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <InputError className="mt-1" message={errors.name} />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-600" />
                            <InputLabel
                                htmlFor="email"
                                value="Email Address"
                                className="text-xs font-semibold text-gray-700"
                            />
                        </div>
                        <div className="relative">
                            <TextInput
                                id="email"
                                type="email"
                                className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                                placeholder="Enter email address"
                            />
                            <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <InputError className="mt-1" message={errors.email} />
                    </div>

                    {/* Role Field */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-blue-600" />
                            <InputLabel
                                htmlFor="role"
                                value="User Role"
                                className="text-xs font-semibold text-gray-700"
                            />
                        </div>
                        <div className="relative">
                            <select
                                id="role"
                                className="w-full pl-8 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm"
                                value={data.role}
                                onChange={(e) => {
                                    setData("role", e.target.value);
                                    // Clear clinic_id when role changes to admin
                                    if (e.target.value === "admin") {
                                        setData("clinic_id", "");
                                    }
                                }}
                                required
                            >
                                <option value="staff">Staff Member</option>
                                <option value="dentist">Dentist</option>
                                <option value="clinic_admin">
                                    Clinic Admin
                                </option>
                                <option value="admin">System Admin</option>
                            </select>
                            <Shield className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-3.5 h-3.5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <InputError className="mt-1" message={errors.role} />
                    </div>

                    {/* Clinic Field - Only show for non-admin roles */}
                    {isClinicRequired && (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                <InputLabel
                                    htmlFor="clinic_id"
                                    value="Assigned Clinic"
                                    className="text-xs font-semibold text-gray-700"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    id="clinic_id"
                                    className="w-full pl-8 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm"
                                    value={data.clinic_id}
                                    onChange={(e) =>
                                        setData("clinic_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a clinic</option>
                                    {clinics.map((clinic) => (
                                        <option
                                            key={clinic.id}
                                            value={clinic.id}
                                        >
                                            {clinic.name}
                                        </option>
                                    ))}
                                </select>
                                <Building2 className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg
                                        className="w-3.5 h-3.5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <InputError
                                className="mt-1"
                                message={errors.clinic_id}
                            />
                        </div>
                    )}

                    {/* Info message for System Admin */}
                    {!isClinicRequired && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <svg
                                    className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="text-xs text-blue-700 font-medium">
                                        <strong>System Admin:</strong> This user
                                        will have system-wide access and is not
                                        associated with any specific clinic.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Password Section */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Lock className="w-3.5 h-3.5 text-blue-600" />
                            <h3 className="text-xs font-semibold text-gray-700">
                                {isEdit
                                    ? "Update Password (Optional)"
                                    : "Set Password"}
                            </h3>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1.5 mb-2">
                            <InputLabel
                                htmlFor="password"
                                value={isEdit ? "New Password" : "Password"}
                                className="text-xs font-medium text-gray-600"
                            />
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required={!isEdit}
                                    placeholder={
                                        isEdit
                                            ? "Leave blank to keep current"
                                            : "Enter password"
                                    }
                                />
                                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <InputError
                                className="mt-1"
                                message={errors.password}
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-1.5">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value={
                                    isEdit
                                        ? "Confirm New Password"
                                        : "Confirm Password"
                                }
                                className="text-xs font-medium text-gray-600"
                            />
                            <div className="relative">
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required={!isEdit}
                                    placeholder="Confirm password"
                                />
                                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            </div>
                            <InputError
                                className="mt-1"
                                message={errors.password_confirmation}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-1.5 text-sm"
                        >
                            {processing ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {isEdit ? "Saving..." : "Adding..."}
                                </>
                            ) : (
                                <>
                                    {isEdit ? (
                                        <Save className="w-3.5 h-3.5" />
                                    ) : (
                                        <Plus className="w-3.5 h-3.5" />
                                    )}
                                    {isEdit ? "Save Changes" : "Add User"}
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
