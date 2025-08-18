import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
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
    ArrowRight,
    Twitter,
    Facebook,
    ArrowLeft,
} from "lucide-react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import SiteHeader from "@/Components/SiteHeader";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 min-h-screen flex flex-col relative overflow-hidden">
            <SiteHeader />
            <div className="flex flex-1 items-center justify-center py-8 relative z-10">
                <div className="relative flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl dark:bg-gray-800 m-4 sm:m-6 lg:m-8 border border-white/20">
                    {/* Left side - Enhanced Branding/Marketing */}
                    <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 items-center justify-center p-8 text-white relative overflow-hidden">
                        {/* Enhanced background decorative elements */}
                        <div className="absolute -top-1/4 -left-1/4 w-80 h-80 bg-blue-500 rounded-full opacity-10 mix-blend-screen transform rotate-45 animate-pulse"></div>
                        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500 rounded-full opacity-10 mix-blend-screen transform -rotate-30"></div>
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400 rounded-full opacity-10 mix-blend-screen transform -translate-x-1/2 -translate-y-1/2"></div>

                        <div className="text-center z-10 max-w-sm -mt-20">
                            {/* Smile Suite Logo */}
                            <div className="mb-4">
                                <img
                                    src="/images/smile-suite-logo.png"
                                    alt="Smile Suite Logo"
                                    className="w-20 h-20 mx-auto object-contain drop-shadow-lg"
                                />
                            </div>

                            {/* Secure Access Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-3">
                                <Lock className="w-3 h-3 text-white" />
                                <span className="text-xs text-white font-semibold tracking-wide">
                                    Secure Access Portal
                                </span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-3xl font-extrabold select-none drop-shadow-sm mb-2 text-white">
                                Welcome Back
                            </h1>

                            {/* Subtitle */}
                            <p className="text-base leading-relaxed mb-4 text-blue-100">
                                Access your dental practice management platform
                                with enterprise-grade security.
                            </p>

                            {/* Trust indicators */}
                            <div className="space-y-3 text-left bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 -mb-4">
                                <div className="text-center mb-3">
                                    <h3 className="text-xs font-bold text-white mb-1">
                                        Why Choose Smile Suite?
                                    </h3>
                                    <p className="text-xs text-blue-100">
                                        Enterprise-grade security for your
                                        dental practice
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Lock className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                HIPAA Compliant
                                            </div>
                                            <div className="text-xs text-blue-100">
                                                Bank-level security
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Eye className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Multi-factor Auth
                                            </div>
                                            <div className="text-xs text-blue-100">
                                                Enhanced protection
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                                            <ArrowRight className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-white">
                                                Instant Access
                                            </div>
                                            <div className="text-xs text-blue-100">
                                                Zero waiting time
                                            </div>
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
                    {/* Right side - Enhanced Login Form */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8">
                        <div className="w-full max-w-sm">
                            <div className="text-left mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100/80 rounded-full border border-blue-200/50 mb-4">
                                    <Mail className="w-3 h-3 text-blue-600" />
                                    <span className="text-xs text-blue-700 font-semibold tracking-wide">
                                        Sign In
                                    </span>
                                </div>
                                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                                    Welcome back to{" "}
                                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                        Smile Suite
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Access your dental practice management
                                    platform
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
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
                                            autoComplete="current-password"
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

                                <div className="flex items-center justify-between mt-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked
                                                )
                                            }
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                                        />
                                        <span className="ml-2 block text-sm text-gray-900 dark:text-gray-300 font-medium">
                                            Remember me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <Button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? "Signing in..."
                                            : "Sign In"}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                            <div className="mt-8 text-center">
                                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Don't have an account?{" "}
                                    <Link
                                        href={route("register")}
                                        className="text-blue-600 hover:text-blue-800 font-bold transition-colors"
                                    >
                                        Create one here
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
