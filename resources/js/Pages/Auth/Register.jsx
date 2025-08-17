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
            <div className="flex flex-1 items-center justify-center py-8">
                <div className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800 m-4 sm:m-6 lg:m-8 border border-gray-100">
                    {/* Left side - Enhanced Branding/Marketing */}
                    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 items-center justify-center p-8 text-white relative overflow-hidden">
                        {/* Enhanced background decorative elements */}
                        <div className="absolute -top-1/4 -left-1/4 w-80 h-80 bg-blue-500 rounded-full opacity-10 mix-blend-screen transform rotate-45 animate-pulse"></div>
                        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500 rounded-full opacity-10 mix-blend-screen transform -rotate-30"></div>
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400 rounded-full opacity-10 mix-blend-screen transform -translate-x-1/2 -translate-y-1/2"></div>

                        <div className="text-center z-10 max-w-sm -mt-20">
                            {/* Smile Suite Logo */}
                            <div className="mb-6">
                                <img
                                    src="/images/smile-suite-logo.png"
                                    alt="Smile Suite Logo"
                                    className="w-20 h-20 mx-auto object-contain drop-shadow-lg"
                                />
                            </div>

                            {/* Patient Portal Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-4">
                                <User className="w-3 h-3 text-white" />
                                <span className="text-xs text-white font-semibold tracking-wide">
                                    Patient Portal
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-3xl font-extrabold select-none drop-shadow-sm mb-3 text-white">
                                Join Smile Suite
                            </h1>

                            {/* Subtitle */}
                            <p className="text-base leading-relaxed mb-8 text-blue-100">
                                Connect with your dental clinics, manage
                                appointments, and access your health records.
                            </p>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                                    <div className="text-lg font-bold text-white">
                                        500+
                                    </div>
                                    <div className="text-xs text-blue-100">
                                        Active Clinics
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 text-center">
                                    <div className="text-lg font-bold text-white">
                                        10K+
                                    </div>
                                    <div className="text-xs text-blue-100">
                                        Happy Patients
                                    </div>
                                </div>
                            </div>

                            {/* Benefits for patients */}
                            <div className="space-y-3 text-left bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-6">
                                <div className="text-center mb-3">
                                    <h3 className="text-xs font-bold text-white mb-1">
                                        Patient Benefits
                                    </h3>
                                    <p className="text-xs text-blue-100">
                                        Everything you need for better dental
                                        care
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Mail className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Easy Booking
                                            </div>
                                            <div className="text-xs text-blue-100">
                                                Book appointments online
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Phone className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Smart Reminders
                                            </div>
                                            <div className="text-xs text-blue-100">
                                                Never miss an appointment
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                            <ArrowRight className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Health Records
                                            </div>
                                            <div className="text-xs text-blue-100">
                                                Access your dental history
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Patient Testimonial */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-bold">
                                            S
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xs text-white font-medium mb-1">
                                            "Smile Suite made booking my dental
                                            appointments so easy! I love how I
                                            can access all my records in one
                                            place."
                                        </div>
                                        <div className="text-xs text-blue-100">
                                            — Sarah M., Patient
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 p-6 z-10 w-full text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-block border border-white/20">
                                <p className="text-sm text-white font-medium">
                                    🌐 www.smilesuite.dental
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Right side - Enhanced Registration Form */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                        <div className="w-full max-w-sm">
                            <div className="text-left mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 rounded-full border border-blue-200/50 mb-4">
                                    <User className="w-3 h-3 text-blue-600" />
                                    <span className="text-xs text-blue-700 font-semibold tracking-wide">
                                        Patient Registration
                                    </span>
                                </div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                                    Create your{" "}
                                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                        patient account
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Join thousands of patients who trust Smile
                                    Suite to connect with their dental clinics.
                                </p>
                            </div>

                            {success && (
                                <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2"
                                    >
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-10 text-sm"
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
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2"
                                    >
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-10 text-sm"
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
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="phone_number"
                                        className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2"
                                    >
                                        Phone Number{" "}
                                        <span className="text-gray-500 font-normal">
                                            (Optional)
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <Input
                                            id="phone_number"
                                            type="tel"
                                            name="phone_number"
                                            value={data.phone_number}
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-10 text-sm"
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
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2"
                                    >
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-gray-400" />
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
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-10 text-sm"
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
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                <div>
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-semibold text-gray-900 dark:text-gray-300 mb-2"
                                    >
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-4 w-4 text-gray-400" />
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
                                            className="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-700 dark:text-white h-10 text-sm"
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
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            onClick={() =>
                                                setShowPasswordConfirmation(
                                                    !showPasswordConfirmation
                                                )
                                            }
                                        >
                                            {showPasswordConfirmation ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-2"
                                        />
                                    )}
                                </div>

                                <div className="mt-8">
                                    <Button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Creating Account..."
                                            : "Create Account"}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="mt-8 text-center">
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        Already have an account?{" "}
                                        <Link
                                            href={route("login")}
                                            className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                                        >
                                            Sign in here
                                        </Link>
                                    </div>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                        <span className="text-xs text-gray-500">
                                            or
                                        </span>
                                        <div className="flex-1 h-px bg-gray-200"></div>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={route("register.clinic")}
                                            className="inline-flex items-center justify-center w-full px-4 py-2 border-2 border-blue-600 text-sm font-semibold rounded-lg text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-700 shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 group transform hover:scale-105"
                                        >
                                            Register Your Clinic
                                            <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
