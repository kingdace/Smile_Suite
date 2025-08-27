import { Head, Link, router } from "@inertiajs/react";
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

    // Chart data for patient growth
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
                                <Button
                                    variant="outline"
                                    className="gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 text-sm px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>
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
                                                patientStats.total_patients
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
                                                patientStats.new_this_month
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
                                                patientStats.active_patients
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
                                                patientStats.total_revenue
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

                    {/* Search and Filters */}
                    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30 mb-8">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Search className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900">
                                        Search & Filters
                                    </CardTitle>
                                    <p className="text-sm text-gray-600">
                                        Find specific patients or filter results
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Search patients by name, email, or phone..."
                                        defaultValue={filters.search || ""}
                                        onChange={handleSearch}
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                                    />
                                </div>
                                <Button
                                    onClick={clearFilters}
                                    variant="outline"
                                    className="gap-2 h-12 px-6 rounded-xl"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

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
                    <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden border border-blue-100/30">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            Patient Records
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Detailed patient information and
                                            statistics
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                    >
                                        {patients.total} patients
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Patient
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Contact
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Appointments
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Treatments
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Total Spent
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Last Visit
                                            </th>
                                            <th className="text-left py-3 px-4 font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {patients.data.map((patient) => (
                                            <tr
                                                key={patient.id}
                                                className="border-b border-gray-100 hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {patient.first_name}{" "}
                                                            {patient.last_name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            ID: {patient.id}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <p className="text-sm text-gray-900">
                                                            {patient.email}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {
                                                                patient.phone_number
                                                            }
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                                    >
                                                        {
                                                            patient.appointments_count
                                                        }{" "}
                                                        appointments
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-50 text-green-700 border-green-200"
                                                    >
                                                        {
                                                            patient.treatments_count
                                                        }{" "}
                                                        treatments
                                                    </Badge>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="font-semibold text-green-600">
                                                        {formatCurrency(
                                                            patient.payments_sum_amount ||
                                                                0
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(
                                                            patient.created_at
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <Link
                                                        href={route(
                                                            "clinic.patients.show",
                                                            {
                                                                clinic: clinic.id,
                                                                patient:
                                                                    patient.id,
                                                            }
                                                        )}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {patients.links && patients.links.length > 3 && (
                                <div className="flex items-center justify-between mt-6">
                                    <div className="text-sm text-gray-600">
                                        Showing {patients.from} to {patients.to}{" "}
                                        of {patients.total} results
                                    </div>
                                    <div className="flex gap-2">
                                        {patients.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm rounded-lg border ${
                                                    link.active
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
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
