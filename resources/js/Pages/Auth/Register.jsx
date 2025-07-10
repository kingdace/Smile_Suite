import { useEffect, useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import InputError from "@/Components/InputError";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";
import SiteHeader from "@/Components/SiteHeader";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        password_confirmation: "",
    });

    const { success } = usePage().props;

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-screen flex flex-col">
            <SiteHeader />
            <div className="flex flex-1 items-center justify-center">
                <div className="relative flex w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800 m-4 sm:m-6 lg:m-8 border border-blue-100">
                    {/* Left side - Branding/Marketing (remove ApplicationLogo, keep background/marketing text) */}
                    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-cyan-700 items-center justify-center p-8 text-white relative overflow-hidden">
                        <div className="text-center z-10">
                            <span
                                className="text-4xl font-extrabold select-none drop-shadow-sm"
                                style={{
                                    color: "#fff",
                                    letterSpacing: "0.01em",
                                    textShadow:
                                        "0 2px 12px rgba(30, 41, 59, 0.25), 0 1px 0 #fff",
                                }}
                            >
                                Smile Suite
                            </span>
                            <p className="text-lg mt-6">
                                Join thousands of patients who trust Smile Suite
                                to connect with their dental clinics.
                            </p>
                        </div>
                        {/* Subtle geometric background elements */}
                        <div className="absolute -top-1/4 -left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-10 mix-blend-screen transform rotate-45"></div>
                        <div className="absolute -bottom-1/4 -right-1/4 w-80 h-80 bg-cyan-500 rounded-full opacity-10 mix-blend-screen transform -rotate-30"></div>
                        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-400 rounded-full opacity-10 mix-blend-screen transform -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 p-8 z-10 w-full text-center">
                            <p className="text-sm">www.smilesuite.dental</p>
                        </div>
                    </div>
                    {/* Right side - Registration Form */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-10">
                        <div className="w-full max-w-md">
                            <div className="text-left mb-6">
                                <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    Create Account
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    One account to connect with all your dental
                                    clinics.
                                </p>
                            </div>

                            {success && (
                                <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-11"
                                            autoComplete="name"
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <InputError
                                            message={errors.name}
                                            className="mt-1"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-11"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <InputError
                                            message={errors.email}
                                            className="mt-1"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="phone_number"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Phone Number{" "}
                                        <span className="text-gray-500">
                                            (Optional)
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="phone_number"
                                            type="tel"
                                            name="phone_number"
                                            value={data.phone_number}
                                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-11"
                                            autoComplete="tel"
                                            onChange={(e) =>
                                                setData(
                                                    "phone_number",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    {errors.phone_number && (
                                        <InputError
                                            message={errors.phone_number}
                                            className="mt-1"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={data.password}
                                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-11"
                                            autoComplete="new-password"
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
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <InputError
                                            message={errors.password}
                                            className="mt-1"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                    >
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="password_confirmation"
                                            type={
                                                showPasswordConfirmation
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-11"
                                            autoComplete="new-password"
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
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            onClick={() =>
                                                setShowPasswordConfirmation(
                                                    !showPasswordConfirmation
                                                )
                                            }
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-1"
                                        />
                                    )}
                                </div>

                                <div className="mt-6">
                                    <Button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-800"
                                        disabled={processing}
                                    >
                                        Create Account
                                    </Button>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Already have an account?{" "}
                                        <Link
                                            href={route("login")}
                                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
