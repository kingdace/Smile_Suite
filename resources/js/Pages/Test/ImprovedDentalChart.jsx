import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ImprovedDentalChart from "@/Components/ImprovedDentalChart/DentalChart";

export default function ImprovedDentalChartPage({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Improved Dental Chart Test
                    </h2>
                    <div className="text-sm text-gray-600">
                        Testing the new dental chart component
                    </div>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ImprovedDentalChart />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
