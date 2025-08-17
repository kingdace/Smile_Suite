import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Edit({ auth, user, clinics }) {
    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
            password_confirmation: "",
            clinic_id: user.clinic_id || "",
        });

    // Check if clinic selection should be required
    const isClinicRequired = data.role !== "admin";

    const submit = (e) => {
        e.preventDefault();

        put(route("admin.users.update", user.id));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit User
                </h2>
            }
            hideSidebar={true}
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                        isFocused
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="role" value="Role" />
                                    <select
                                        id="role"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
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
                                        <option value="staff">Staff</option>
                                        <option value="dentist">Dentist</option>
                                        <option value="admin">
                                            System Admin
                                        </option>
                                        <option value="clinic_admin">
                                            Clinic Admin
                                        </option>
                                    </select>
                                    <InputError
                                        className="mt-2"
                                        message={errors.role}
                                    />
                                </div>

                                {/* Clinic Selection - Only show for non-admin roles */}
                                {isClinicRequired && (
                                    <div>
                                        <InputLabel
                                            htmlFor="clinic_id"
                                            value="Clinic"
                                        />
                                        <select
                                            id="clinic_id"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.clinic_id}
                                            onChange={(e) =>
                                                setData(
                                                    "clinic_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select a Clinic
                                            </option>
                                            {clinics.map((clinic) => (
                                                <option
                                                    key={clinic.id}
                                                    value={clinic.id}
                                                >
                                                    {clinic.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            className="mt-2"
                                            message={errors.clinic_id}
                                        />
                                    </div>
                                )}

                                {/* Info message for System Admin */}
                                {!isClinicRequired && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="h-5 w-5 text-blue-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-blue-700">
                                                    <strong>
                                                        System Admin:
                                                    </strong>{" "}
                                                    This user will have
                                                    system-wide access and is
                                                    not associated with any
                                                    specific clinic.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Optional: Include password fields for changing password */}
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="New Password (Optional)"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.password}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm New Password"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Save Changes
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
