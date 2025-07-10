export default function Navigation({ user }) {
    return (
        <nav className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* ... existing logo ... */}

                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </NavLink>
                            {user.role === "admin" && (
                                <>
                                    <NavLink
                                        href={route("users.index")}
                                        active={route().current("users.*")}
                                    >
                                        Users
                                    </NavLink>
                                    <NavLink
                                        href={route("clinics.index")}
                                        active={route().current("clinics.*")}
                                    >
                                        Clinics
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ... existing user dropdown ... */}
                </div>
            </div>

            {/* ... existing responsive menu ... */}
        </nav>
    );
}
