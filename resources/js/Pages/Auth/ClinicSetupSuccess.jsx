import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function ClinicSetupSuccess() {
    return (
        <>
            <Head title="Clinic Setup Complete" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <svg
                        className="mx-auto mb-4 h-16 w-16 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2l4-4m5 2a9 9 0 11-18 0a9 9 0 0118 0z"
                        />
                    </svg>
                    <h1 className="text-3xl font-bold text-green-700 mb-2">
                        Clinic Registration Complete!
                    </h1>
                    <p className="text-lg text-gray-700 mb-6">
                        Congratulations! Your clinic setup is now complete.
                        <br />
                        You can now log in and start managing your clinic.
                    </p>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Next Steps:
                        </h2>
                        <ul className="text-left text-gray-600 list-disc list-inside space-y-1">
                            <li>
                                Log in to your new account using your
                                credentials.
                            </li>
                            <li>Set up your clinic profile and preferences.</li>
                            <li>
                                Add staff, dentists, and other users as needed.
                            </li>
                            <li>
                                Start using Smile Suite to manage appointments,
                                patients, and more!
                            </li>
                        </ul>
                    </div>
                    <Link
                        href="/login"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition mb-2"
                    >
                        Go to Login
                    </Link>
                    <br />
                    <Link
                        href="/"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </>
    );
}
