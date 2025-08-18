import { useState } from "react";
import ClinicLogo from "@/Components/ClinicLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";
import { Button } from "@/Components/ui/button";
import {
    Users,
    Building2,
    LayoutDashboard,
    Menu,
    X,
    Bell,
    LogOut,
    User,
    ChevronDown,
    FileText,
} from "lucide-react";
import { route } from "ziggy-js";
import SiteHeader from "@/Components/SiteHeader";

const Header = ({
    auth,
    isClinicPage,
    setSidebarOpen,
    sidebarOpen,
    showingNavigationDropdown,
    setShowingNavigationDropdown,
}) => {
    // Enhanced Admin Header
    if (auth?.user?.role === "admin" && !isClinicPage) {
        return (
            <nav className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-slate-800 via-blue-900 to-slate-900 border-b border-slate-700/50 shadow-2xl">
                <div className="max-w-full px-6 py-3">
                    <div className="flex items-center justify-between">
                        {/* Left Side - Logo and Navigation */}
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-slate-200/50 overflow-hidden">
                                        <img
                                            src="/images/smile-suite-logo.png"
                                            alt="Smile Suite Logo"
                                            className="w-13 h-13 object-contain"
                                        />
                                    </div>
                                    {/* Enhanced glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-slate-400/20 rounded-2xl animate-pulse"></div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-white">
                                        Smile Suite
                                    </h1>
                                    <p className="text-xs text-slate-200 font-medium">
                                        Admin Panel
                                    </p>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <nav className="hidden md:flex items-center gap-2">
                                <NavLink
                                    href={route("admin.dashboard")}
                                    active={
                                        route().current("admin.dashboard") &&
                                        !route().current("admin.users.*") &&
                                        !route().current("admin.clinics.*") &&
                                        !route().current(
                                            "admin.clinic-requests.*"
                                        )
                                    }
                                    className={`px-4 py-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 border rounded-xl ${
                                        route().current("admin.dashboard") &&
                                        !route().current("admin.users.*") &&
                                        !route().current("admin.clinics.*") &&
                                        !route().current(
                                            "admin.clinic-requests.*"
                                        )
                                            ? "text-slate-900 bg-white/95 backdrop-blur-sm shadow-lg border-white/50 font-semibold"
                                            : "text-slate-200 hover:text-white hover:bg-white/20 backdrop-blur-sm border-transparent hover:border-white/30"
                                    }`}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route("admin.users.index")}
                                    active={route().current("admin.users.*")}
                                    className={`px-4 py-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 border rounded-xl ${
                                        route().current("admin.users.*")
                                            ? "text-slate-900 bg-white/95 backdrop-blur-sm shadow-lg border-white/50 font-semibold"
                                            : "text-slate-200 hover:text-white hover:bg-white/20 backdrop-blur-sm border-transparent hover:border-white/30"
                                    }`}
                                >
                                    <Users className="w-4 h-4" />
                                    Users
                                </NavLink>
                                <NavLink
                                    href={route("admin.clinics.index")}
                                    active={route().current("admin.clinics.*")}
                                    className={`px-4 py-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 border rounded-xl ${
                                        route().current("admin.clinics.*")
                                            ? "text-slate-900 bg-white/95 backdrop-blur-sm shadow-lg border-white/50 font-semibold"
                                            : "text-slate-200 hover:text-white hover:bg-white/20 backdrop-blur-sm border-transparent hover:border-white/30"
                                    }`}
                                >
                                    <Building2 className="w-4 h-4" />
                                    Clinics
                                </NavLink>
                                <NavLink
                                    href={route("admin.clinic-requests.index")}
                                    active={route().current(
                                        "admin.clinic-requests.*"
                                    )}
                                    className={`px-4 py-2 font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:scale-105 border rounded-xl ${
                                        route().current(
                                            "admin.clinic-requests.*"
                                        )
                                            ? "text-slate-900 bg-white/95 backdrop-blur-sm shadow-lg border-white/50 font-semibold"
                                            : "text-slate-200 hover:text-white hover:bg-white/20 backdrop-blur-sm border-transparent hover:border-white/30"
                                    }`}
                                >
                                    <FileText className="w-4 h-4" />
                                    Requests
                                </NavLink>
                            </nav>
                        </div>

                        {/* Right Side - Notifications, User */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2.5 text-slate-200 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 border border-slate-600/50 shadow-lg hover:border-white/30">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg"></span>
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-white/95 to-slate-100/95 rounded-full flex items-center justify-center shadow-xl border border-white/50">
                                        <span className="text-slate-700 text-sm font-bold">
                                            {auth?.user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "A"}
                                        </span>
                                    </div>
                                    {/* Enhanced glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-slate-200/30 rounded-full animate-pulse"></div>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm font-bold text-white">
                                        {auth?.user?.name}
                                    </p>
                                    <p className="text-xs text-slate-200">
                                        Administrator
                                    </p>
                                </div>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="p-1.5 text-slate-200 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105 border border-slate-600/50 hover:border-white/30">
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="flex items-center text-red-600"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // Original Header for Clinic and other roles
    return (
        <nav className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-blue-600 to-cyan-700 border-b border-blue-500/20 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                    {isClinicPage && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mr-2 text-white hover:bg-white/10"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    )}

                    <div className="shrink-0 flex items-center">
                        <Link href="/">
                            <ClinicLogo
                                clinic={auth?.clinic}
                                className="block h-9 w-auto fill-current text-white"
                            />
                        </Link>
                        {isClinicPage && auth?.clinic?.name && (
                            <div className="ml-4 text-white">
                                <h1 className="text-xl font-bold">
                                    {auth.clinic.name}
                                </h1>
                                <p className="text-xs text-blue-100">
                                    Powered by Smile Suite
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden sm:flex sm:items-center sm:ml-6">
                    {/* Notifications */}
                    <div className="ml-3 relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative text-white hover:bg-white/10"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>
                    </div>

                    <div className="ml-3 relative">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white hover:text-blue-100 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        {auth?.user?.name}

                                        <ChevronDown className="ml-2 -mr-0.5 h-4 w-4" />
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link
                                    href={route("clinic.profile.index")}
                                    className="flex items-center"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Profile
                                </Dropdown.Link>
                                {auth?.user?.role === "clinic_admin" && (
                                    <Dropdown.Link
                                        href={route("clinic.users.index")}
                                        className="flex items-center"
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        User Management
                                    </Dropdown.Link>
                                )}
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="flex items-center text-red-600"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                <div className="-mr-2 flex items-center sm:hidden">
                    <button
                        onClick={() =>
                            setShowingNavigationDropdown(
                                (previousState) => !previousState
                            )
                        }
                        className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-blue-100 hover:bg-white/10 focus:outline-none focus:bg-white/10 focus:text-blue-100 transition duration-150 ease-in-out"
                    >
                        {showingNavigationDropdown ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

function hasRoute(name) {
    return (
        route().hasOwnProperty("routes") && route().routes.hasOwnProperty(name)
    );
}

// Helper to determine if user is a clinic user
function isClinicUser(auth) {
    return (
        auth?.user?.role === "clinic_admin" ||
        auth?.user?.role === "dentist" ||
        auth?.user?.role === "staff"
    );
}

export default function Authenticated({
    auth,
    header,
    children,
    hideSidebar = false,
}) {
    console.log("AUTH ROLE:", auth?.user?.role);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Check if we're in a clinic page
    const isClinicPage = route().current().startsWith("clinic.");
    const isPatient = auth?.user?.role === "patient";

    // --- GUARANTEED PATIENT LAYOUT ---
    if (isPatient) {
        return (
            <div className="min-h-screen bg-gray-100">
                <SiteHeader />
                <main className="flex-1 p-0">{children}</main>
            </div>
        );
    }

    // --- ALL OTHER ROLES ---
    return (
        <div className="min-h-screen bg-gray-100">
            <Header
                auth={auth}
                isClinicPage={isClinicPage}
                setSidebarOpen={setSidebarOpen}
                sidebarOpen={sidebarOpen}
                showingNavigationDropdown={showingNavigationDropdown}
                setShowingNavigationDropdown={setShowingNavigationDropdown}
            />
            <div
                className={`$$${
                    showingNavigationDropdown ? "block" : "hidden"
                } sm:hidden bg-white fixed top-16 left-0 right-0 z-20`}
            >
                <div className="pt-2 pb-3 space-y-1">
                    {!isClinicPage && (
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            className="flex items-center"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </ResponsiveNavLink>
                    )}

                    {/* Admin Mobile Navigation Links */}
                    {auth?.user?.role === "admin" && !isClinicPage && (
                        <>
                            <ResponsiveNavLink
                                href={route("admin.dashboard")}
                                active={route().current("admin.dashboard")}
                                className="flex items-center"
                            >
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Admin Dashboard
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route("admin.users.index")}
                                active={route().current("admin.users.*")}
                                className="flex items-center"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Users
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route("admin.clinics.index")}
                                active={route().current("admin.clinics.*")}
                                className="flex items-center"
                            >
                                <Building2 className="w-4 h-4 mr-2" />
                                Clinics
                            </ResponsiveNavLink>
                        </>
                    )}

                    {auth?.user?.role === "clinic_admin" && (
                        <ResponsiveNavLink
                            href={route("clinic.users.index")}
                            className="flex items-center"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            User Management
                        </ResponsiveNavLink>
                    )}
                    {(auth?.user?.role === "clinic_admin" ||
                        auth?.user?.role === "dentist" ||
                        auth?.user?.role === "staff") && (
                        <ResponsiveNavLink
                            href={route("clinic.profile.index")}
                            className="flex items-center"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Clinic Profile
                        </ResponsiveNavLink>
                    )}
                </div>

                <div className="pt-4 pb-1 border-t border-gray-200">
                    <div className="px-4">
                        <div className="font-medium text-base text-gray-800">
                            {auth?.user?.name}
                        </div>
                        <div className="font-medium text-sm text-gray-500">
                            {auth?.user?.email}
                        </div>
                    </div>

                    <div className="mt-3 space-y-1">
                        {isClinicUser(auth) &&
                        hasRoute("clinic.profile.index") ? (
                            <ResponsiveNavLink
                                href={route("clinic.profile.index")}
                                className="flex items-center"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Clinic Profile
                            </ResponsiveNavLink>
                        ) : hasRoute("profile.edit") ? (
                            <ResponsiveNavLink
                                href={route("profile.edit")}
                                className="flex items-center"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </ResponsiveNavLink>
                        ) : null}
                        <ResponsiveNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                            className="flex items-center text-red-600"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
            <div className={`flex flex-1 overflow-hidden relative mt-16`}>
                {isClinicPage && !hideSidebar && (
                    <aside
                        className={`
                            fixed top-16 left-0 h-[calc(100vh-4rem)] z-20
                            transition-all duration-300 ease-in-out
                            ${sidebarOpen ? "w-72" : "w-0"}
                            ${sidebarOpen ? "" : "overflow-hidden"}
                        `}
                    >
                        <Sidebar
                            className="h-full"
                            auth={auth}
                            sidebarOpen={sidebarOpen}
                            setSidebarOpen={setSidebarOpen}
                        />
                    </aside>
                )}
                <main
                    className={`
                        flex-1 overflow-y-auto p-6
                        transition-all duration-300 ease-in-out
                        ${
                            isClinicPage && !hideSidebar && sidebarOpen
                                ? "lg:ml-72"
                                : "lg:ml-0"
                        }
                    `}
                >
                    {/* {header && (
                        <header className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )} */}
                    {children}
                </main>
            </div>
        </div>
    );
}
