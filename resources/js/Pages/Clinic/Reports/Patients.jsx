import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import ExportButton from "@/Components/Reports/ExportButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import {
    Users,
    UserPlus,
    Calendar,
    DollarSign,
    Stethoscope,
    TrendingUp,
    TrendingDown,
    Search,
    Download,
    Eye,
    ArrowLeft,
    BarChart3,
    Activity,
    Target,
    Award,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Filter,
    RefreshCw,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

export default function PatientsReport({
    auth,
    clinic,
    patients,
    patientStats,
    demographics,
    filters,
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat("en-US").format(number || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.reload({
            data: { search: e.target.value },
            only: ["patients", "filters"],
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.reload({
            data: { search: "" },
            only: ["patients", "filters"],
            preserveState: true,
            replace: true,
        });
    };

    // Chart data for demographics - with error handling
    const ageGroupData = demographics?.age_groups ? 
        Object.entries(demographics.age_groups).map(([group, count]) => ({
            group,
            count,
            percentage: patientStats?.total_patients ? ((count / patientStats.total_patients) * 100).toFixed(1) : '0'
        })) : [];

    const genderData = demographics?.gender_distribution ? 
        Object.entries(demographics.gender_distribution).map(([gender, count]) => ({
            name: gender.charAt(0).toUpperCase() + gender.slice(1),
            value: count,
            color: gender === 'male' ? '#3B82F6' : gender === 'female' ? '#EC4899' : '#10B981'
        })) : [];

    const categoryData = demographics?.categories ? 
        Object.entries(demographics.categories).map(([category, count]) => ({
            name: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            value: count
        })) : [];

    // Patient growth data
    const patientGrowthData = [
        { month: "Jan", patients: 45 },
        { month: "Feb", patients: 52 },
        { month: "Mar", patients: 48 },
        { month: "Apr", patients: 61 },
        { month: "May", patients: 55 },
        { month: "Jun", patients: 67 },
        { month: "Jul", patients: 73 },
        { month: "Aug", patients: 69 },
        { month: "Sep", patients: 78 },
        { month: "Oct", patients: 82 },
        { month: "Nov", patients: 89 },
        { month: "Dec", patients: 95 },
    ];

    // Chart colors
    const chartColors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Patient Reports" />

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
                {/* Enhanced Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 mx-5 mb-6 rounded-xl shadow-2xl">
                    <div className="absolute inset-0 bg-black/5"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/3 rounded-full -translate-y-8 -translate-x-8"></div>

                    <div className="relative px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-sm border border-white/40 shadow-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-1">
                                        Patient Reports
                                    </h1>
                                    <p className="text-blue-100 text-sm font-medium">
                                        Patient demographics, growth, and
                                        activity analysis
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => window.history.back()}
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                                <ExportButton
                                    exportRoute={`/clinic/${clinic.id}/reports/export/patients`}
                                    filters={filters}
                                    clinic={clinic}
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-8 mt-6 pb-16">
                    {/* Patient Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Patients
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {formatNumber(
                                                patientStats?.total_patients || 0
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-xl">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600">
                                        +12% from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-green-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            New This Month
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {formatNumber(
                                                patientStats?.new_this_month || 0
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-xl">
                                        <UserPlus className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600">
                                        +8% from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-purple-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Active Patients
                                        </p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {formatNumber(
                                                patientStats?.active_patients || 0
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-xl">
                                        <Activity className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600">
                                        +15% from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-orange-100/30">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Revenue
                                        </p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {formatCurrency(
                                                patientStats?.total_revenue || 0
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-orange-100 rounded-xl">
                                        <DollarSign className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-600">
                                        +18% from last month
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Patient Growth Chart */}
                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <BarChart3 className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Patient Growth
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Monthly patient registration trends
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={patientGrowthData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="patients"
                                                stroke="#3B82F6"
                                                strokeWidth={3}
                                                dot={{
                                                    fill: "#3B82F6",
                                                    strokeWidth: 2,
                                                    r: 4,
                                                }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Patient Activity Distribution */}
                        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Activity className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Patient Activity
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Distribution of patient engagement
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={[
                                                {
                                                    category: "New",
                                                    count: patientStats.new_this_month,
                                                },
                                                {
                                                    category: "Active",
                                                    count: patientStats.active_patients,
                                                },
                                                {
                                                    category: "Inactive",
                                                    count:
                                                        patientStats.total_patients -
                                                        patientStats.active_patients,
                                                },
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="count"
                                                fill="#10B981"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Patients Table */}
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 overflow-hidden">
                        <CardHeader className="pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-white">
                                            Patient Records
                                        </CardTitle>
                                        <p className="text-blue-100 mt-1">
                                            Comprehensive patient management overview
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2"
                                >
                                    {patients?.total || 0} patients
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-blue-100">
                                            <th className="text-left py-4 px-6 font-bold text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-blue-600" />
                                                    Patient
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-6 font-bold text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-green-600" />
                                                    Contact
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-6 font-bold text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-blue-600" />
                                                    Appointments
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-6 font-bold text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <Stethoscope className="h-4 w-4 text-green-600" />
                                                    Treatments
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-6 font-bold text-gray-800">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                                    Total Spent
                                                </div>
                                            </th>
                                            <th className="text-left py-4 px-12 font-bold text-gray-800 w-40">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-purple-600" />
                                                    Last Visit
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {patients?.data?.map((patient, index) => (
                                            <tr
                                                key={patient.id}
                                                className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 ${
                                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                                }`}
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md shrink-0">
                                                            {patient.first_name?.charAt(0)}{patient.last_name?.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-base">
                                                                {patient.first_name} {patient.last_name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                                ID: {patient.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                            {patient.email || 'No email'}
                                                        </p>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                                                            {patient.phone_number || 'No phone'}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 font-medium shadow-sm"
                                                    >
                                                        {patient.appointments_count || 0} appointments
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 border-green-200 font-medium shadow-sm"
                                                    >
                                                        {patient.treatments_count || 0} treatments
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-9">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-sm"></div>
                                                        <p className="font-bold text-sm text-emerald-600">
                                                            {formatCurrency(patient.payments_sum_amount || 0)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-12 w-40">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-purple-400 rounded-full shrink-0"></div>
                                                        <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                                            {formatDate(patient.created_at)}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) || (
                                            <tr>
                                                <td colSpan="6" className="py-12 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <Users className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">No patients found</p>
                                                        <p className="text-gray-400 text-sm">Start by adding your first patient</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {patients?.links && patients.links.length > 3 && (
                                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
                                    <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Showing {patients.from || 0} to {patients.to || 0} of {patients.total || 0} results
                                    </div>
                                    <div className="flex gap-2">
                                        {patients.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                                                    link.active
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 shadow-sm"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
