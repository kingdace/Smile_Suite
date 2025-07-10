import React, { useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                    type="button"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-6 text-blue-900">
                    {isEdit ? "Edit User" : "Add New User"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                    <div>
                        <InputLabel htmlFor="role" value="Role" />
                        <select
                            id="role"
                            className="mt-1 block w-full border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-md shadow-sm"
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                            required
                        >
                            <option value="staff">Staff</option>
                            <option value="dentist">Dentist</option>
                            <option value="admin">Admin</option>
                            <option value="clinic_admin">Clinic Admin</option>
                        </select>
                        <InputError className="mt-2" message={errors.role} />
                    </div>
                    <div>
                        <InputLabel htmlFor="clinic_id" value="Clinic" />
                        <select
                            id="clinic_id"
                            className="mt-1 block w-full border-gray-300 focus:border-blue-400 focus:ring-blue-400 rounded-md shadow-sm"
                            value={data.clinic_id}
                            onChange={(e) =>
                                setData("clinic_id", e.target.value)
                            }
                            required
                        >
                            <option value="">Select a Clinic</option>
                            {clinics.map((clinic) => (
                                <option key={clinic.id} value={clinic.id}>
                                    {clinic.name}
                                </option>
                            ))}
                        </select>
                        <InputError
                            className="mt-2"
                            message={errors.clinic_id}
                        />
                    </div>
                    {/* Password fields: required for add, optional for edit */}
                    <div>
                        <InputLabel
                            htmlFor="password"
                            value={
                                isEdit ? "New Password (Optional)" : "Password"
                            }
                        />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required={!isEdit}
                        />
                        <InputError
                            className="mt-2"
                            message={errors.password}
                        />
                    </div>
                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value={
                                isEdit
                                    ? "Confirm New Password"
                                    : "Confirm Password"
                            }
                        />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-1 block w-full"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            required={!isEdit}
                        />
                        <InputError
                            className="mt-2"
                            message={errors.password_confirmation}
                        />
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                        <PrimaryButton disabled={processing} type="submit">
                            {processing
                                ? isEdit
                                    ? "Saving..."
                                    : "Adding..."
                                : isEdit
                                ? "Save Changes"
                                : "Add User"}
                        </PrimaryButton>
                        <button
                            type="button"
                            className="ml-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
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
