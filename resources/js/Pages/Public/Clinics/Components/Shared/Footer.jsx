import React from "react";
import { Link } from "@inertiajs/react";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 z-10 relative">
            <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
                    {/* Logo and Description */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <img
                                src="/images/smile-suite-logo.png"
                                alt="Smile Suite"
                                className="w-8 h-8 sm:w-10 sm:h-10"
                            />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-white">
                                    Smile Suite
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm">
                                    Dental Practice Management Platform
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                        <Link
                            href="#features"
                            className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm font-medium"
                        >
                            Features
                        </Link>
                        <Link
                            href={route("public.clinics.index")}
                            className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm font-medium"
                        >
                            Find Clinics
                        </Link>
                        <Link
                            href={route("register.clinic")}
                            className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm font-medium"
                        >
                            Register
                        </Link>
                        <Link
                            href={route("login")}
                            className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm font-medium"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <a
                            href="#"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                        <a
                            href="#"
                            className="text-gray-400 hover:text-blue-400 transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-800 text-center">
                    <p className="text-xs sm:text-sm text-gray-400">
                        &copy; 2024 Smile Suite. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
