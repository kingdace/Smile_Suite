import { Link } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function RegisterSuccess() {
    return (
        <GuestLayout>
            <Head title="Registration Successful" />

            <div className="text-center">
                <div className="mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Registration Successful!
                </h2>

                <p className="text-gray-600 mb-6">
                    Your Smile Suite account has been created successfully. You
                    can now log in to access your patient portal.
                </p>

                <div className="space-y-4">
                    <Link
                        href={route("login")}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Proceed to Login
                    </Link>

                    <Link
                        href={route("public.landing")}
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
