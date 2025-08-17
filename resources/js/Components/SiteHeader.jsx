import { Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    LogOut,
    User as UserIcon,
    LayoutGrid,
    Users,
    Building2,
    FileText,
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
    const profileDropdownRef = useRef(null);
    const registerDropdownRef = useRef(null);
    const isLoggedIn = !!auth?.user;
    const userRole = auth?.user?.role;
    const dashboardRoute =
        userRole === "admin"
            ? route("admin.dashboard")
            : userRole === "patient"
            ? route("patient.dashboard")
            : ["clinic_admin", "dentist", "staff"].includes(userRole)
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

    return (
        <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 font-inter sticky top-0 z-50">
            {/* Thin divider bar, no gradient or accent bar */}
            {/* Removed the accent bar for a cleaner look */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo left */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex-shrink-0 flex items-center gap-4 group transition-all duration-200"
                        >
                            <div className="relative">
                                <img
                                    src="/images/smile-suite-logo.png"
                                    alt="Smile Suite Logo"
                                    className="object-contain w-16 h-16 group-hover:opacity-80 transition-opacity duration-200"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                                    Smile Suite
                                </div>
                                <div className="text-sm text-gray-600 font-semibold tracking-wide group-hover:text-blue-500 transition-colors duration-300">
                                    Cloud-based Dental Clinic as a Service
                                </div>
                            </div>
                        </Link>
                    </div>
                    {/* Nav links + Register + Avatar right */}
                    <div className="flex items-center space-x-2 md:space-x-6">
                        <Link
                            href="/#features"
                            className="text-gray-800 hover:text-blue-600 px-4 py-2 rounded-lg text-[15px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-blue-50"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Features
                        </Link>
                        <Link
                            href={route("public.clinics.index") || "/clinics"}
                            className="text-gray-800 hover:text-blue-600 px-4 py-2 rounded-lg text-[15px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-blue-50"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Find Clinics
                        </Link>
                        <Link
                            href="/#testimonials"
                            className="text-gray-800 hover:text-blue-600 px-4 py-2 rounded-lg text-[15px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 hover:bg-blue-50"
                            style={{ fontFamily: "Inter, sans-serif" }}
                        >
                            Reviews
                        </Link>
                        {/* Register Dropdown */}
                        <div className="relative" ref={registerDropdownRef}>
                            <button
                                className="text-gray-800 hover:text-blue-600 px-4 py-2 rounded-lg text-[15px] font-semibold focus:outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-200 hover:bg-blue-50"
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
                                className={`absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-1 z-50 transition-all duration-200 border border-blue-100 ${
                                    registerDropdownOpen
                                        ? "opacity-100 visible scale-100"
                                        : "opacity-0 invisible scale-95"
                                }`}
                                role="menu"
                                aria-label="Register menu"
                            >
                                <Link
                                    href={route("register")}
                                    className="block px-4 py-2 text-base text-gray-700 hover:bg-blue-50 rounded transition"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    role="menuitem"
                                >
                                    Create Smile Suite Account
                                </Link>
                                <Link
                                    href={route("register.clinic")}
                                    className="block px-4 py-2 text-base text-gray-700 hover:bg-blue-50 rounded transition"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                    role="menuitem"
                                >
                                    Register Clinic
                                </Link>
                            </div>
                        </div>
                        {/* Auth Buttons or Profile */}
                        {!isLoggedIn && (
                            <Link
                                href={route("login")}
                                className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white px-6 py-3 rounded-xl text-[15px] font-bold ml-2 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:ring-offset-2 transform hover:scale-105"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                Login
                            </Link>
                        )}
                        {isLoggedIn && (
                            <div
                                className="relative ml-2 flex items-center"
                                ref={profileDropdownRef}
                            >
                                <button
                                    className="flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none transition min-w-[44px] shadow-sm focus:ring-2 focus:ring-blue-200"
                                    style={{
                                        boxShadow:
                                            "0 1px 4px 0 rgba(30,41,59,0.06)",
                                        fontFamily: "Inter, sans-serif",
                                    }}
                                    onClick={() =>
                                        setProfileDropdownOpen((v) => !v)
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={profileDropdownOpen}
                                    title="Go to Dashboard"
                                >
                                    <Avatar className="h-7 w-7 border border-gray-200 bg-white">
                                        <AvatarFallback className="flex items-center justify-center w-full h-full">
                                            <UserIcon className="w-4 h-4 text-blue-500" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-normal text-gray-800 text-[15px] max-w-[100px] truncate">
                                        {auth.user.name}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 ml-1 transition-transform ${
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
                                {/* Dropdown: clean, below button, triangle caret, no blue bar */}
                                <div
                                    className={`absolute right-0 mt-2 w-64 bg-white border border-blue-100 rounded-xl shadow-xl z-50 transition-all duration-200 ${
                                        profileDropdownOpen
                                            ? "opacity-100 visible translate-y-0 scale-100"
                                            : "opacity-0 invisible -translate-y-2 scale-95"
                                    } origin-top-right`}
                                    style={{ top: "calc(100% + 0.5rem)" }}
                                    role="menu"
                                    aria-label="Profile menu"
                                >
                                    {/* Triangle caret */}
                                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-blue-100 rotate-45 z-10"></div>
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-gray-800 font-medium border-b text-[15px]">
                                            {auth.user.name}
                                        </div>
                                        {/* Admin Dropdown */}
                                        {userRole === "admin" ? (
                                            <>
                                                <Link
                                                    href={route(
                                                        "admin.dashboard"
                                                    )}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded text-[15px] transition flex items-center gap-2"
                                                    style={{
                                                        fontFamily:
                                                            "Inter, sans-serif",
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <LayoutGrid className="w-4 h-4 text-blue-500" />{" "}
                                                    Admin Dashboard
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.users.index"
                                                    )}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded text-[15px] transition flex items-center gap-2"
                                                    style={{
                                                        fontFamily:
                                                            "Inter, sans-serif",
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <Users className="w-4 h-4 text-blue-500" />{" "}
                                                    Users Management
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.clinics.index"
                                                    )}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded text-[15px] transition flex items-center gap-2"
                                                    style={{
                                                        fontFamily:
                                                            "Inter, sans-serif",
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <Building2 className="w-4 h-4 text-green-500" />{" "}
                                                    Clinics Management
                                                </Link>
                                                <Link
                                                    href={route(
                                                        "admin.clinic-requests.index"
                                                    )}
                                                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded text-[15px] transition flex items-center gap-2"
                                                    style={{
                                                        fontFamily:
                                                            "Inter, sans-serif",
                                                    }}
                                                    role="menuitem"
                                                >
                                                    <FileText className="w-4 h-4 text-orange-500" />{" "}
                                                    Registration Requests
                                                </Link>
                                            </>
                                        ) : (
                                            <Link
                                                href={dashboardRoute}
                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded text-[15px] transition flex items-center gap-2"
                                                style={{
                                                    fontFamily:
                                                        "Inter, sans-serif",
                                                }}
                                                role="menuitem"
                                            >
                                                <LayoutGrid className="w-4 h-4 text-blue-500" />{" "}
                                                Dashboard
                                            </Link>
                                        )}
                                        {/* Patient-specific links */}
                                        {userRole === "patient" && (
                                            <Link
                                                href="/patient/profile"
                                                className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded text-[15px] transition flex items-center gap-2"
                                                style={{
                                                    fontFamily:
                                                        "Inter, sans-serif",
                                                }}
                                                role="menuitem"
                                            >
                                                <UserIcon className="w-4 h-4 text-blue-500" />{" "}
                                                Profile
                                            </Link>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.post(route("logout"))
                                            }
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 text-[15px] transition font-medium rounded"
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                            }}
                                            role="menuitem"
                                        >
                                            <LogOut className="w-4 h-4" /> Log
                                            Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
