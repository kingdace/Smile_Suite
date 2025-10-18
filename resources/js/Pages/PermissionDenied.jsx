import { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PermissionDeniedModal from "@/Components/PermissionDeniedModal";
import { Button } from "@/Components/ui/button";
import { Shield, Home } from "lucide-react";

export default function PermissionDenied({ auth, permission, intendedUrl }) {
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        // Auto-show the modal when the page loads
        setShowModal(true);
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
        // Redirect to dashboard after modal is closed
        const clinicId = auth.user?.clinic_id || auth.clinic_id;
        if (clinicId) {
            window.location.href = `/clinic/${clinicId}/dashboard`;
        } else {
            window.location.href = "/dashboard";
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Access Restricted
                    </h2>
                </div>
            }
        >
            <Head title="Access Restricted" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 text-center">
                            <div className="mb-6">
                                <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Access Restricted
                                </h3>
                                <p className="text-gray-600">
                                    You don't have permission to access this
                                    feature.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">
                                    Intended URL:{" "}
                                    <code className="bg-gray-100 px-2 py-1 rounded">
                                        {intendedUrl}
                                    </code>
                                </p>

                                <div className="flex justify-center space-x-4">
                                    <Button asChild>
                                        <Link
                                            href={`/clinic/${
                                                auth.user?.clinic_id ||
                                                auth.clinic_id
                                            }/dashboard`}
                                        >
                                            <Home className="h-4 w-4 mr-2" />
                                            Go to Dashboard
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PermissionDeniedModal
                permission={permission}
                isOpen={showModal}
                onClose={handleCloseModal}
            />
        </AuthenticatedLayout>
    );
}
