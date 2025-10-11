import { Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    LogOut,
    User as UserIcon,
    LayoutGrid,
    Menu,
    X,
    Stethoscope,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
}

export default function SiteHeader() {
    const { auth = {} } = usePage().props;
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const registerDropdownRef = useRef(null);
    const isLoggedIn = !!auth?.user;
    const userRole = auth?.user?.role;
    const dashboardRoute =
        userRole === "admin"
            ? route("admin.dashboard")
            : userRole === "patient"
            ? route("patient.dashboard")
            : ["clinic_admin", "dentist", "staff"].includes(userRole) &&
              auth?.user?.clinic_id
            ? route("clinic.dashboard", { clinic: auth.user.clinic_id })
            : "/";

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setProfileDropdownOpen(false);
            }
            if (
                registerDropdownRef.current &&
                !registerDropdownRef.current.contains(event.target)
            ) {
                setRegisterDropdownOpen(false);
            }
        }
        if (profileDropdownOpen || registerDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileDropdownOpen, registerDropdownOpen]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        }
        if (mobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileMenuOpen]);

    return (
        <nav className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 backdrop-blur-md shadow-sm border-b border-slate-200/60 font-inter sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-18">
                    {/* Logo left */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center gap-2 sm:gap-4 group transition-all duration-300"
                        >
                            <div className="relative">
                                <img
                                    src="/images/smile-suite-logo.png"
                                    alt="Smile Suite Logo"
                                    className="object-contain w-12 h-12 sm:w-16 sm:h-16 group-hover:opacity-80 transition-opacity duration-200"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div
                                    className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-900 via-slate-800 to-blue-800 bg-clip-text text-transparent tracking-tight group-hover:from-blue-800 group-hover:via-blue-700 group-hover:to-slate-700 transition-all duration-300 drop-shadow-sm leading-tight"
                                    style={{
                                        fontFamily: "Montserrat, sans-serif",
                                    }}
                                >
                                    Smile Suite
                                </div>
                                <div
                                    className="text-xs text-slate-500 font-normal tracking-wide group-hover:text-slate-600 transition-colors duration-300 -mt-1.5 hidden sm:block"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                    Cloud-based Dental Clinic as a Service
                                </div>
                            </div>
                        </Link>
                    </div>
                    {/* Desktop Navigation - Hidden on mobile */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                        <Link
                            href="/#pricing"
                            className="text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-slate-200/50"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Pricing
                        </Link>
                        <Link
                            href={route("public.clinics.index") || "/clinics"}
                            className="text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-slate-200/50"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Find Clinics
                        </Link>
                        {/* <Link
                            href="/#testimonials"
                            className="text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-xl text-[15px] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-slate-200/50"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Reviews
                        </Link> */}
                        {/* Register Dropdown - Hidden on mobile */}
                        <div
                            className="hidden md:block relative"
                            ref={registerDropdownRef}
                        >
                            <button
                                className="text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-xl text-[15px] font-semibold focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-200 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-slate-200/50"
                                style={{ fontFamily: "Inter, sans-serif" }}
                                onClick={() =>
                                    setRegisterDropdownOpen((v) => !v)
                                }
                                aria-haspopup="true"
                                aria-expanded={registerDropdownOpen}
                            >
                                Register
                                <svg
                                    className={`inline ml-1 w-4 h-4 transition-transform duration-200 ${
                                        registerDropdownOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            <div
                                className={`absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl py-2 z-50 transition-all duration-300 border border-slate-200/50 ${
                                    registerDropdownOpen
                                        ? "opacity-100 visible scale-100"
                                        : "opacity-0 invisible scale-95"
                                }`}
                                role="menu"
                                aria-label="Register menu"
                            >
                                <Link
                                    href={route("register")}
                                    className="block px-4 py-3 text-base text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 rounded-lg mx-2 transition-all duration-200"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    role="menuitem"
                                >
                                    Create Smile Suite Account
                                </Link>
                                <Link
                                    href={route("register.clinic")}
                                    className="block px-4 py-3 text-base text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 rounded-lg mx-2 transition-all duration-200"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    role="menuitem"
                                >
                                    Register Clinic
                                </Link>
                            </div>
                        </div>
                        {/* Auth Buttons or Profile - Hidden on mobile */}
                        {!isLoggedIn && (
                            <Link
                                href={route("login")}
                                className="hidden md:inline-flex bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-[15px] font-bold ml-3 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:ring-offset-2 transform hover:scale-105 border border-blue-500/20"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Login
                            </Link>
                        )}
                        {isLoggedIn && (
                            <div
                                className="hidden md:flex relative ml-3 items-center"
                                ref={profileDropdownRef}
                            >
                                <button
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white/80 hover:bg-white backdrop-blur-sm focus:outline-none transition-all duration-300 min-w-[44px] shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-200/50"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                    onClick={() =>
                                        setProfileDropdownOpen((v) => !v)
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={profileDropdownOpen}
                                    title="Go to Dashboard"
                                >
                                    <Avatar className="h-8 w-8 border border-slate-200 bg-white">
                                        <AvatarFallback className="flex items-center justify-center w-full h-full">
                                            <UserIcon className="w-4 h-4 text-blue-600" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-semibold text-slate-700 text-[15px] max-w-[100px] truncate">
                                        {auth.user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                            profileDropdownOpen
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {/* Compact Dropdown */}
                                <div
                                    className={`absolute right-0 mt-1 w-56 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-xl shadow-xl z-50 transition-all duration-300 ${
                                        profileDropdownOpen
                                            ? "opacity-100 visible translate-y-0 scale-100"
                                            : "opacity-0 invisible -translate-y-2 scale-95"
                                    } origin-top-right`}
                                    style={{ top: "calc(100% + 0.25rem)" }}
                                    role="menu"
                                    aria-label="Profile menu"
                                >
                                    {/* Triangle caret */}
                                    <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white/95 backdrop-blur-md border-l border-t border-slate-200/50 rotate-45 z-10"></div>
                                    <div className="py-2">
                                        {/* <div className="px-4 py-3 text-slate-800 font-semibold border-b border-slate-100 text-[15px]">
                                            {auth.user.name}
                                        </div> */}
                                        {/* Patient Navigation Dropdown */}
                                        {userRole === "patient" ? (
                                            <>
                                                <Link
                                                    href={route(
                                                        "patient.dashboard"
                                                    )}
                                                    className="block px-3 py-2 text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 rounded-lg mx-1.5 text-sm transition-all duration-200 flex items-center gap-2.5"
                                                    style={{
                                                        fontFamily:
                                                            "Inter, sans-serif",
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                                                    Dashboard
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "patient.profile"
                                                    )}
                                                    className="block px-3 py-2 text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 rounded-lg mx-1.5 text-sm transition-all duration-200 flex items-center gap-2.5"
                                                    style={{
                                                        fontFamily:
                                                            "Inter, sans-serif",
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <UserIcon className="w-3.5 h-3.5 text-green-500" />
                                                    My Profile
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "patient.treatments.index"
                                                    )}
                                                    className="block px-3 py-2 text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 rounded-lg mx-1.5 text-sm transition-all duration-200 flex items-center gap-2.5"
                                                    style={{
                                                        fontFamily:
                                                            "Inter, sans-serif",
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <Stethoscope className="w-3.5 h-3.5 text-purple-500" />
                                                    My Treatments
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                href={dashboardRoute}
                                                className="block px-3 py-2 text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 rounded-lg mx-1.5 text-sm transition-all duration-200 flex items-center gap-2.5"
                                                style={{
                                                    fontFamily:
                                                        "Inter, sans-serif",
                                                }}
                                                role="menuitem"
                                            >
                                                <LayoutGrid className="w-3.5 h-3.5 text-blue-500" />
                                                {userRole === "admin"
                                                    ? "Admin Dashboard"
                                                    : "Dashboard"}
                                            </Link>
                                        )}
                                        <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.post(route("logout"))
                                                }
                                                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50/80 hover:text-red-700 flex items-center gap-2.5 text-sm transition-all duration-200 font-medium rounded-lg mx-1.5"
                                                style={{
                                                    fontFamily:
                                                        "Inter, sans-serif",
                                                }}
                                                role="menuitem"
                                            >
                                                <LogOut className="w-3.5 h-3.5" />
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-700 hover:text-blue-700 p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${
                        mobileMenuOpen
                            ? "max-h-screen opacity-100 visible"
                            : "max-h-0 opacity-0 invisible"
                    } overflow-hidden`}
                >
                    <div className="px-4 py-4 space-y-3 border-t border-slate-200/60 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/40 backdrop-blur-md shadow-lg">
                        {/* Mobile Navigation Links */}
                        <div className="space-y-2">
                            <Link
                                href="/#pricing"
                                className="flex items-center justify-between w-full text-slate-700 hover:text-blue-700 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-blue-200/50 group"
                                style={{ fontFamily: "Inter, sans-serif" }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Pricing</span>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                            <Link
                                href={
                                    route("public.clinics.index") || "/clinics"
                                }
                                className="flex items-center justify-between w-full text-slate-700 hover:text-blue-700 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-blue-200/50 group"
                                style={{ fontFamily: "Inter, sans-serif" }}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Find Clinics</span>
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        </div>
                        {/* <Link
                            href="/#testimonials"
                            className="block text-slate-700 hover:text-blue-700 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-blue-50/80"
                            style={{ fontFamily: "Inter, sans-serif" }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Reviews
                        </Link> */}

                        {/* Mobile Register Options */}
                        <div className="pt-3 border-t border-slate-200/60">
                            <div className="text-xs font-bold text-slate-600 px-2 py-2 mb-2 bg-slate-50/80 rounded-lg border border-slate-200/50">
                                Register
                            </div>
                            <div className="space-y-2">
                                <Link
                                    href={route("register")}
                                    className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-blue-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-blue-200/50 group"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>Create Smile Suite Account</span>
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                <Link
                                    href={route("register.clinic")}
                                    className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-blue-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-blue-200/50 group"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span>Register Clinic</span>
                                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Auth Buttons */}
                        {!isLoggedIn && (
                            <div className="pt-3 border-t border-slate-200/60">
                                <Link
                                    href={route("login")}
                                    className="block w-full text-center bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-500/20"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </div>
                        )}

                        {/* Mobile Profile (if logged in) */}
                        {isLoggedIn && (
                            <div className="pt-3 border-t border-slate-200/60">
                                <div className="text-xs font-bold text-slate-600 px-2 py-2 mb-2 bg-slate-50/80 rounded-lg border border-slate-200/50">
                                    Account
                                </div>
                                <div className="space-y-2">
                                    {userRole === "patient" ? (
                                        <>
                                            <Link
                                                href={route(
                                                    "patient.dashboard"
                                                )}
                                                className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-blue-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-blue-200/50 group"
                                                style={{
                                                    fontFamily:
                                                        "Inter, sans-serif",
                                                }}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <LayoutGrid className="w-4 h-4 text-blue-500" />
                                                    <span>Dashboard</span>
                                                </div>
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </Link>
                                            <Link
                                                href={route("patient.profile")}
                                                className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-green-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-green-200/50 group"
                                                style={{
                                                    fontFamily:
                                                        "Inter, sans-serif",
                                                }}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-green-500" />
                                                    <span>My Profile</span>
                                                </div>
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </Link>
                                            <Link
                                                href={route(
                                                    "patient.treatments.index"
                                                )}
                                                className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-purple-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-purple-200/50 group"
                                                style={{
                                                    fontFamily:
                                                        "Inter, sans-serif",
                                                }}
                                                onClick={() =>
                                                    setMobileMenuOpen(false)
                                                }
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="w-4 h-4 text-purple-500" />
                                                    <span>My Treatments</span>
                                                </div>
                                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </Link>
                                        </>
                                    ) : (
                                        <Link
                                            href={dashboardRoute}
                                            className="flex items-center justify-between w-full px-4 py-3 text-slate-700 hover:text-blue-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-white/80 hover:shadow-sm border border-transparent hover:border-blue-200/50 group"
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                            }}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <div className="flex items-center gap-2">
                                                <LayoutGrid className="w-4 h-4 text-blue-500" />
                                                <span>
                                                    {userRole === "admin"
                                                        ? "Admin Dashboard"
                                                        : "Dashboard"}
                                                </span>
                                            </div>
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.post(route("logout"));
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-between w-full px-4 py-3 text-red-600 hover:bg-red-50/80 hover:text-red-700 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-sm border border-transparent hover:border-red-200/50 group"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <LogOut className="w-4 h-4" />
                                            <span>Log Out</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
