import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Users,
    User,
    UserCog,
    UserPlus,
    Eye,
    EyeOff,
    ArrowLeft,
} from "lucide-react";

const roleOptions = [
    { value: "dentist", label: "Dentist", icon: User },
    { value: "staff", label: "Staff", icon: UserCog },
];

export default function Create({ errors, auth }) {
    const { data, setData, post, processing } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "dentist",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route("clinic.users.store"));
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Add Clinic User" />
            <div className="max-w-lg mx-auto py-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-6 w-6 text-blue-600" /> Add
                            Clinic User
                        </CardTitle>
                        <div className="text-sm text-gray-500 mt-1">
                            Fill out the form below to add a new user to your
                            clinic.
                        </div>
                    </CardHeader>
                    <CardContent>
                        {errors && Object.keys(errors).length > 0 && (
                            <div className="mb-4 text-red-600 bg-red-50 border border-red-200 rounded p-2">
                                {Object.values(errors).map((err, i) => (
                                    <div key={i}>{err}</div>
                                ))}
                            </div>
                        )}
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                {errors && errors.name && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                {errors && errors.email && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block mb-1 font-semibold">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
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
                                    {errors && errors.password && (
                                        <div className="text-red-600 text-sm mt-1">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="block mb-1 font-semibold">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="w-full border px-3 py-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
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
                                    {errors && errors.password_confirmation && (
                                        <div className="text-red-600 text-sm mt-1">
                                            {errors.password_confirmation}
                                        </div>
                                    )}
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
                                                data.role === role.value
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
                                                    data.role === role.value
                                                }
                                                onChange={(e) =>
                                                    setData(
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
                                {errors && errors.role && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.role}
                                    </div>
                                )}
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
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Link
                                        href={route("clinic.users.index")}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Back
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
