import React, { useState } from "react";
import { AlertCircle, BookOpen } from "lucide-react";

const RestrictionsOverlay = ({ isOpen, onClose }) => {
    const [hasRead, setHasRead] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl scrollbar-thin">
                {/* Header */}
                <div className="bg-amber-500 px-6 py-3 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />
                        <h2 className="text-lg font-semibold text-white">
                            Production Environment Notice
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Context Section */}
                    <div className="bg-blue-50 p-4 rounded-md">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            About This Deployment
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            This project worked{" "}
                            <strong>perfectly and completely</strong> during the
                            capstone defense. It was deployed on{" "}
                            <strong>Railway Hosting Platform</strong> where all
                            features functioned flawlessly. The school required
                            deployment to their cPanel server, which has
                            restrictions causing some features to be
                            non-functional.
                        </p>
                        <p className="text-xs text-gray-600 mt-2 italic">
                            Note: The fully functional Railway deployment is no
                            longer accessible as the subscription has ended.
                        </p>
                    </div>

                    {/* Restrictions Section */}
                    <div className="bg-red-50 p-4 rounded-md">
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Current Limitations (cPanel Only)
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">
                            Due to cPanel server restrictions, these features
                            are currently disabled:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1 ml-4">
                            <li>
                                • Email notifications (registration,
                                appointments, reminders)
                            </li>
                            <li>• SMS notifications</li>
                            <li>• Email verification for new accounts</li>
                            <li>• Password reset emails</li>
                        </ul>
                        <p className="text-xs text-gray-600 mt-2">
                            All other features work normally. These limitations
                            are specific to the cPanel environment.
                        </p>
                    </div>

                    {/* Test Credentials Section */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Test Account Credentials
                        </h3>

                        <div className="space-y-2.5">
                            {/* System Admin */}
                            <div className="border border-gray-200 bg-white p-3 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        System Administrator
                                    </span>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                        Full Access
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            Email
                                        </span>
                                        <p className="font-mono text-gray-900 text-sm">
                                            dy_admin@gmail.com
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            Password
                                        </span>
                                        <p className="font-mono text-gray-900 text-sm">
                                            Gales123
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Clinic Admin */}
                            <div className="border border-gray-200 bg-white p-3 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        Clinic Administrator
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        Enhaynes Dental
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            Email
                                        </span>
                                        <p className="font-mono text-gray-900 text-xs">
                                            enhaynesdental@gmail.com
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            Password
                                        </span>
                                        <p className="font-mono text-gray-900 text-sm">
                                            Enhaynes123
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Patient */}
                            <div className="border border-gray-200 bg-white p-3 rounded-md">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-900">
                                        Patient Account
                                    </span>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                        DY MARK GALES
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            Email
                                        </span>
                                        <p className="font-mono text-gray-900 text-sm">
                                            dypatient@gmail.com
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500">
                                            Password
                                        </span>
                                        <p className="font-mono text-gray-900 text-sm">
                                            Gales123
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documentation Section - Compact */}
                    <div className="bg-green-50 p-3 rounded-md border border-green-200">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-700">
                                    <strong>Documentation:</strong> For detailed
                                    instructions, refer to the{" "}
                                    <a
                                        href="https://drive.google.com/drive/folders/1bDEXBBTqFkZ-S5YI0SqYRM1haVfgS3y4?usp=drive_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                                    >
                                        User & Admin Manuals
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Checkbox */}
                    <div className="bg-gray-50 p-4 rounded-md border-2 border-gray-300">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasRead}
                                onChange={(e) => setHasRead(e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700 select-none">
                                I have read and understood the information
                                above, including the deployment context, current
                                limitations, and test account credentials.
                            </span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 rounded-b-lg border-t border-gray-200">
                    <button
                        onClick={onClose}
                        disabled={!hasRead}
                        className={`w-full font-medium py-2.5 px-4 rounded-md transition-all ${
                            hasRead
                                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {hasRead
                            ? "Continue to Smile Suite"
                            : "Please read and check the box above"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RestrictionsOverlay;
