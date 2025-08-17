import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Create({ auth }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Add Service
                </h2>
            }
        >
            <Head title="Add Service" />
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded shadow p-6">
                    <p>
                        This page is not used. Please use the modal on the
                        Services page to add a service.
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
