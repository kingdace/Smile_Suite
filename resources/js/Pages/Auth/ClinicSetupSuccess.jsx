import React from "react";
import { Head, Link } from "@inertiajs/react";
import { CheckCircle, ArrowRight, Home, LogIn, Info } from "lucide-react";

export default function ClinicSetupSuccess() {
    return (
        <>
            <Head title="Clinic Setup Complete" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Enhanced background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {/* Main gradient circles */}
                    <div
                        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-40 mix-blend-multiply transform rotate-45 animate-pulse shadow-lg"
                        style={{
                            animationDuration: "3s",
                            animationDelay: "0s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full opacity-40 mix-blend-multiply transform -rotate-30 animate-bounce shadow-xl"
                        style={{
                            animationDuration: "2.5s",
                            animationDelay: "0.5s",
                        }}
                    ></div>
                    <div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 rounded-full opacity-30 mix-blend-multiply animate-pulse shadow-2xl"
                        style={{
                            animationDuration: "4s",
                            animationDelay: "1s",
                        }}
                    ></div>

                    {/* Colorful accent circles */}
                    <div
                        className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full opacity-50 mix-blend-multiply animate-bounce shadow-lg"
                        style={{
                            animationDuration: "2s",
                            animationDelay: "0.3s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full opacity-50 mix-blend-multiply animate-pulse shadow-lg"
                        style={{
                            animationDuration: "3.5s",
                            animationDelay: "0.8s",
                        }}
                    ></div>
                    <div
                        className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-full opacity-40 mix-blend-multiply animate-ping shadow-md"
                        style={{
                            animationDuration: "1.5s",
                            animationDelay: "0.2s",
                        }}
                    ></div>
                    <div
                        className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full opacity-35 mix-blend-multiply animate-bounce shadow-lg"
                        style={{
                            animationDuration: "2.8s",
                            animationDelay: "0.6s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-1/4 right-1/4 w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-full opacity-45 mix-blend-multiply animate-pulse shadow-xl"
                        style={{
                            animationDuration: "3.2s",
                            animationDelay: "0.4s",
                        }}
                    ></div>

                    {/* Additional colorful elements */}
                    <div
                        className="absolute top-1/6 left-1/6 w-12 h-12 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full opacity-30 mix-blend-multiply animate-ping shadow-md"
                        style={{
                            animationDuration: "1.8s",
                            animationDelay: "0.7s",
                        }}
                    ></div>
                    <div
                        className="absolute bottom-1/6 left-1/3 w-16 h-16 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full opacity-35 mix-blend-multiply animate-bounce shadow-lg"
                        style={{
                            animationDuration: "2.2s",
                            animationDelay: "0.9s",
                        }}
                    ></div>
                    <div
                        className="absolute top-2/3 right-1/6 w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full opacity-40 mix-blend-multiply animate-pulse shadow-md"
                        style={{
                            animationDuration: "2.7s",
                            animationDelay: "0.1s",
                        }}
                    ></div>
                </div>

                <div className="max-w-2xl w-full space-y-6 relative z-10">
                    {/* Header */}
                    <div className="text-center">
                        <Link href="/" className="inline-block">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <img
                                        src="/images/smile-suite-logo.png"
                                        alt="Smile Suite Logo"
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    Smile Suite
                                </h1>
                            </div>
                        </Link>
                    </div>

                    {/* Success Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200/50 overflow-hidden">
                        {/* Success Header */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Clinic Registration Complete!
                            </h1>
                            <p className="text-green-100">
                                Congratulations! Your clinic setup is now
                                complete.
                            </p>
                        </div>

                        {/* Content */}
                        <div className="px-8 py-6 space-y-6">
                            <div className="text-center">
                                <p className="text-gray-700 mb-6">
                                    You can now log in and start managing your
                                    clinic with all the powerful features of
                                    Smile Suite.
                                </p>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
                                <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5" />
                                    Next Steps:
                                </h2>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-blue-800">
                                            <strong>Log in</strong> to your new
                                            account using your credentials
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-blue-800">
                                            <strong>Set up</strong> your clinic
                                            profile and preferences
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-blue-800">
                                            <strong>Add staff</strong>,
                                            dentists, and other users as needed
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <span className="text-sm text-blue-800">
                                            <strong>Start using</strong> Smile
                                            Suite to manage appointments,
                                            patients, and more!
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Getting Started Guide */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                                <h2 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Getting Started Guide:
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                📋
                                            </span>
                                            <span>
                                                <strong>Dashboard:</strong>{" "}
                                                Overview of your clinic's key
                                                metrics
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                👥
                                            </span>
                                            <span>
                                                <strong>Patients:</strong> Add
                                                and manage patient records
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                📅
                                            </span>
                                            <span>
                                                <strong>Appointments:</strong>{" "}
                                                Schedule and track appointments
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                🦷
                                            </span>
                                            <span>
                                                <strong>Treatments:</strong>{" "}
                                                Record and track treatments
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                📦
                                            </span>
                                            <span>
                                                <strong>Inventory:</strong>{" "}
                                                Manage dental supplies and
                                                equipment
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                💰
                                            </span>
                                            <span>
                                                <strong>Payments:</strong>{" "}
                                                Process patient payments
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                📊
                                            </span>
                                            <span>
                                                <strong>Reports:</strong> View
                                                clinic performance analytics
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">
                                                ⚙️
                                            </span>
                                            <span>
                                                <strong>Settings:</strong>{" "}
                                                Configure clinic preferences
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Support Information */}
                            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
                                <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Need Help?
                                </h2>
                                <div className="space-y-2 text-sm text-purple-800">
                                    <p>
                                        <strong>Documentation:</strong> Check
                                        our comprehensive user guides and
                                        tutorials
                                    </p>
                                    <p>
                                        <strong>Email Support:</strong> Contact
                                        us at support@smilesuite.com for
                                        assistance
                                    </p>
                                    <p>
                                        <strong>Video Tutorials:</strong> Watch
                                        step-by-step setup and usage videos
                                    </p>
                                    <p>
                                        <strong>Community:</strong> Join our
                                        user community for tips and best
                                        practices
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Go to Login
                                </Link>

                                <Link
                                    href="/"
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <Home className="w-4 h-4" />
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Welcome to the Smile Suite family! 🦷✨
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
