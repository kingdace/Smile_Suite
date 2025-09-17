import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    BarChart3,
    Users,
    Calendar,
    DollarSign,
    Stethoscope,
    Package,
    TrendingUp,
    TrendingDown,
    Activity,
    FileText,
    Download,
    Eye,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ArrowRight,
    BarChart as LucideBarChart,
    PieChart as LucidePieChart,
    LineChart as LucideLineChart,
    Target,
    Award,
    Zap,
    Building,
    Phone,
    Mail,
    MapPin,
    Sparkles,
    Star,
    Heart,
    Brain,
    Shield,
    Crown,
    Gem,
    Rocket,
    Palette,
    Music,
    Camera,
    Gamepad2,
    Trophy,
    Medal,
    Flame,
    Snowflake,
    Sun,
    Moon,
    Cloud,
    Rainbow,
    Filter,
    Search,
    RefreshCw,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    UserCheck,
    UserX,
    Clock3,
    AlertCircle,
    CheckCircle2,
    CalendarDays,
    CreditCard,
    Banknote,
    Receipt,
    Wallet,
    ShoppingCart,
    Package2,
    Box,
    Archive,
    Layers,
    Database,
    ScatterChart,
    Funnel,
    Settings,
    MoreHorizontal,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    BarChart as RechartsBarChart,
    Bar,
    ComposedChart,
    Scatter,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    FunnelChart,
    Funnel as RechartsFunnel,
} from "recharts";
import { useState, useEffect } from "react";
import ExportButton from "@/Components/Reports/ExportButton";

export default function ReportsIndex({
    auth,
    clinic,
    metrics,
    monthlyRevenue,
    paymentMethods,
    topPatients,
    recentActivity,
    treatmentCategories,
    filters,
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat("en-US").format(number || 0);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
            case "confirmed":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "pending":
            case "scheduled":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "cancelled":
            case "failed":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "completed":
            case "confirmed":
                return CheckCircle;
            case "pending":
            case "scheduled":
                return Clock;
            case "cancelled":
            case "failed":
                return XCircle;
            default:
                return AlertTriangle;
        }
    };

    // Enhanced chart colors with more vibrant options
    const chartColors = [
        "#3B82F6", // Blue
        "#10B981", // Emerald
        "#F59E0B", // Amber
        "#EF4444", // Red
        "#8B5CF6", // Violet
        "#06B6D4", // Cyan
        "#84CC16", // Lime
        "#F97316", // Orange
        "#EC4899", // Pink
        "#6366F1", // Indigo
        "#F43F5E", // Rose
        "#22C55E", // Green
        "#EAB308", // Yellow
        "#A855F7", // Purple
        "#14B8A6", // Teal
    ];

    // Mock data for comprehensive analytics
    const patientGrowthData = [
        { month: "Jan", new: 45, returning: 120, total: 165 },
        { month: "Feb", new: 52, returning: 135, total: 187 },
        { month: "Mar", new: 48, returning: 142, total: 190 },
        { month: "Apr", new: 61, returning: 158, total: 219 },
        { month: "May", new: 55, returning: 165, total: 220 },
        { month: "Jun", new: 67, returning: 178, total: 245 },
    ];

    const appointmentTrends = [
        { day: "Mon", scheduled: 12, completed: 10, cancelled: 2 },
        { day: "Tue", scheduled: 15, completed: 14, cancelled: 1 },
        { day: "Wed", scheduled: 18, completed: 16, cancelled: 2 },
        { day: "Thu", scheduled: 14, completed: 13, cancelled: 1 },
        { day: "Fri", scheduled: 16, completed: 15, cancelled: 1 },
        { day: "Sat", scheduled: 8, completed: 7, cancelled: 1 },
        { day: "Sun", scheduled: 3, completed: 3, cancelled: 0 },
    ];

    const treatmentPerformance = [
        { treatment: "Cleaning", count: 45, revenue: 22500, satisfaction: 4.8 },
        { treatment: "Filling", count: 32, revenue: 48000, satisfaction: 4.6 },
        {
            treatment: "Extraction",
            count: 18,
            revenue: 27000,
            satisfaction: 4.4,
        },
        {
            treatment: "Root Canal",
            count: 12,
            revenue: 72000,
            satisfaction: 4.7,
        },
        { treatment: "Crown", count: 8, revenue: 64000, satisfaction: 4.9 },
    ];

    const inventoryStatus = [
        {
            category: "Dental Supplies",
            inStock: 85,
            lowStock: 12,
            outOfStock: 3,
        },
        { category: "Medications", inStock: 92, lowStock: 6, outOfStock: 2 },
        { category: "Equipment", inStock: 78, lowStock: 15, outOfStock: 7 },
        { category: "Consumables", inStock: 88, lowStock: 10, outOfStock: 2 },
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Analytics Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto px-6 py-6">
                    {/* Clean Header */}
                    <div
                        className={`mb-8 transition-all duration-700 ${
                            isLoaded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-slate-800 bg-clip-text text-transparent mb-2">
                                    Analytics Dashboard
                                </h1>
                                <p className="text-slate-600">
                                    Comprehensive insights and performance
                                    metrics
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <ExportButton
                                    exportRoute={`/clinic/${clinic.id}/reports/export/analytics`}
                                    filters={filters}
                                    clinic={clinic}
                                    className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                                />
                                <Button
                                    size="sm"
                                    onClick={() => window.location.reload()}
                                    className="gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[
                            {
                                title: "Total Revenue",
                                value: formatCurrency(
                                    metrics?.total_revenue || 0
                                ),
                                change: "+12.5%",
                                trend: "up",
                                icon: DollarSign,
                                color: "bg-blue-500",
                                bgColor: "bg-blue-50",
                                textColor: "text-blue-700",
                            },
                            {
                                title: "Active Patients",
                                value: formatNumber(
                                    metrics?.active_patients || 0
                                ),
                                change: "+8.2%",
                                trend: "up",
                                icon: Users,
                                color: "bg-emerald-500",
                                bgColor: "bg-emerald-50",
                                textColor: "text-emerald-700",
                            },
                            {
                                title: "Appointments",
                                value: formatNumber(
                                    metrics?.total_appointments || 0
                                ),
                                change: "+15.3%",
                                trend: "up",
                                icon: Calendar,
                                color: "bg-purple-500",
                                bgColor: "bg-purple-50",
                                textColor: "text-purple-700",
                            },
                            {
                                title: "Treatments",
                                value: formatNumber(
                                    metrics?.total_treatments || 0
                                ),
                                change: "+6.7%",
                                trend: "up",
                                icon: Stethoscope,
                                color: "bg-orange-500",
                                bgColor: "bg-orange-50",
                                textColor: "text-orange-700",
                            },
                        ].map((metric, index) => (
                            <Card
                                key={index}
                                className={`border-0 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                                    isLoaded
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-4"
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CardContent className="p-6 relative overflow-hidden">
                                    {/* Gradient background overlay */}
                                    <div
                                        className={`absolute inset-0 opacity-5 ${metric.color.replace(
                                            "bg-",
                                            "bg-gradient-to-br from-"
                                        )} to-transparent`}
                                    ></div>

                                    <div className="flex items-center justify-between mb-4 relative z-10">
                                        <div
                                            className={`p-3 rounded-xl shadow-lg ${metric.bgColor} ${metric.color}`}
                                        >
                                            <metric.icon
                                                className={`w-6 h-6 ${metric.textColor}`}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {metric.trend === "up" ? (
                                                <TrendingUpIcon className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <TrendingDownIcon className="w-4 h-4 text-red-500" />
                                            )}
                                            <span
                                                className={`text-sm font-medium ${
                                                    metric.trend === "up"
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {metric.change}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-1 relative z-10">
                                        {metric.value}
                                    </h3>
                                    <p className="text-sm text-slate-600 relative z-10">
                                        {metric.title}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Main Analytics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Revenue Trends */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-sm h-full hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-slate-800">
                                                Revenue Trends
                                            </CardTitle>
                                            <p className="text-sm text-slate-600">
                                                Monthly revenue performance
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                Last 6 months
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart data={monthlyRevenue}>
                                                <defs>
                                                    <linearGradient
                                                        id="revenueGradient"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0.9}
                                                        />
                                                        <stop
                                                            offset="50%"
                                                            stopColor="#8B5CF6"
                                                            stopOpacity={0.6}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#EC4899"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#E2E8F0"
                                                />
                                                <XAxis
                                                    dataKey="month"
                                                    stroke="#64748B"
                                                />
                                                <YAxis stroke="#64748B" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            "white",
                                                        border: "1px solid #E2E8F0",
                                                        borderRadius: "8px",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                    formatter={(value) => [
                                                        formatCurrency(value),
                                                        "Revenue",
                                                    ]}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="revenue"
                                                    stroke="url(#revenueGradient)"
                                                    strokeWidth={3}
                                                    fill="url(#revenueGradient)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Methods */}
                        <div>
                            <Card className="border-0 shadow-sm h-full hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
                                    <CardTitle className="text-lg font-semibold text-slate-800">
                                        Payment Methods
                                    </CardTitle>
                                    <p className="text-sm text-slate-600">
                                        Distribution by type
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={paymentMethods}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({
                                                        name,
                                                        percent,
                                                    }) =>
                                                        `${name} ${(
                                                            percent * 100
                                                        ).toFixed(0)}%`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="total"
                                                >
                                                    {paymentMethods.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    chartColors[
                                                                        index %
                                                                            chartColors.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            "white",
                                                        border: "1px solid #E2E8F0",
                                                        borderRadius: "8px",
                                                        boxShadow:
                                                            "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Comprehensive Analytics Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Patient Growth */}
                        <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    Patient Growth
                                </CardTitle>
                                <p className="text-sm text-slate-600">
                                    New vs returning patients
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <ComposedChart data={patientGrowthData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#E2E8F0"
                                            />
                                            <XAxis
                                                dataKey="month"
                                                stroke="#64748B"
                                            />
                                            <YAxis stroke="#64748B" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #E2E8F0",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Bar
                                                dataKey="new"
                                                fill="#3B82F6"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="returning"
                                                fill="#10B981"
                                                radius={[4, 4, 0, 0]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="total"
                                                stroke="#8B5CF6"
                                                strokeWidth={2}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appointment Trends */}
                        <Card className="border-0 shadow-lg transition-all duration-300">
                            <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    Weekly Appointments
                                </CardTitle>
                                <p className="text-sm text-slate-600">
                                    Scheduled vs completed
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <RechartsBarChart
                                            data={appointmentTrends}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="scheduledGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#3B82F6"
                                                        stopOpacity={0.9}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#1D4ED8"
                                                        stopOpacity={0.7}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="completedGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#10B981"
                                                        stopOpacity={0.9}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#059669"
                                                        stopOpacity={0.7}
                                                    />
                                                </linearGradient>
                                                <linearGradient
                                                    id="cancelledGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#EF4444"
                                                        stopOpacity={0.9}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#DC2626"
                                                        stopOpacity={0.7}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#E2E8F0"
                                            />
                                            <XAxis
                                                dataKey="day"
                                                stroke="#64748B"
                                            />
                                            <YAxis stroke="#64748B" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "white",
                                                    border: "1px solid #E2E8F0",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                            <Bar
                                                dataKey="scheduled"
                                                fill="url(#scheduledGradient)"
                                                radius={[6, 6, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="completed"
                                                fill="url(#completedGradient)"
                                                radius={[6, 6, 0, 0]}
                                            />
                                            <Bar
                                                dataKey="cancelled"
                                                fill="url(#cancelledGradient)"
                                                radius={[6, 6, 0, 0]}
                                            />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Treatment Performance & Inventory Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Treatment Performance */}
                        <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    Treatment Performance
                                </CardTitle>
                                <p className="text-sm text-slate-600">
                                    Revenue and satisfaction by treatment
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {treatmentPerformance.map(
                                        (treatment, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full shadow-sm"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${
                                                                chartColors[
                                                                    index %
                                                                        chartColors.length
                                                                ]
                                                            }, ${
                                                                chartColors[
                                                                    (index +
                                                                        1) %
                                                                        chartColors.length
                                                                ]
                                                            })`,
                                                        }}
                                                    ></div>
                                                    <div>
                                                        <p className="font-medium text-slate-800">
                                                            {
                                                                treatment.treatment
                                                            }
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {treatment.count}{" "}
                                                            procedures
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-slate-800">
                                                        {formatCurrency(
                                                            treatment.revenue
                                                        )}
                                                    </p>
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                                                        <span className="text-sm text-slate-600">
                                                            {
                                                                treatment.satisfaction
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Inventory Status */}
                        <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                            <CardHeader className="pb-4 bg-gradient-to-r from-lime-50 to-green-50 rounded-t-lg">
                                <CardTitle className="text-lg font-semibold text-slate-800">
                                    Inventory Status
                                </CardTitle>
                                <p className="text-sm text-slate-600">
                                    Stock levels by category
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {inventoryStatus.map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-slate-800">
                                                    {item.category}
                                                </span>
                                                <span className="text-sm text-slate-600">
                                                    {item.inStock +
                                                        item.lowStock +
                                                        item.outOfStock}{" "}
                                                    total
                                                </span>
                                            </div>
                                            <div className="flex gap-1 h-3 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500"
                                                    style={{
                                                        width: `${
                                                            (item.inStock /
                                                                (item.inStock +
                                                                    item.lowStock +
                                                                    item.outOfStock)) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500"
                                                    style={{
                                                        width: `${
                                                            (item.lowStock /
                                                                (item.inStock +
                                                                    item.lowStock +
                                                                    item.outOfStock)) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                                <div
                                                    className="flex-1 bg-gradient-to-r from-red-400 to-red-500"
                                                    style={{
                                                        width: `${
                                                            (item.outOfStock /
                                                                (item.inStock +
                                                                    item.lowStock +
                                                                    item.outOfStock)) *
                                                            100
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between text-xs text-slate-600">
                                                <span>
                                                    In Stock: {item.inStock}
                                                </span>
                                                <span>
                                                    Low: {item.lowStock}
                                                </span>
                                                <span>
                                                    Out: {item.outOfStock}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions & Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="lg:col-span-1">
                            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-t-lg">
                                    <CardTitle className="text-lg font-semibold text-slate-800">
                                        Quick Actions
                                    </CardTitle>
                                    <p className="text-sm text-slate-600">
                                        Access detailed reports
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                name: "Patient Reports",
                                                icon: Users,
                                                href: route(
                                                    "clinic.reports.patients",
                                                    clinic.id
                                                ),
                                                color: "bg-blue-500",
                                            },
                                            {
                                                name: "Appointment Reports",
                                                icon: Calendar,
                                                href: route(
                                                    "clinic.reports.appointments",
                                                    clinic.id
                                                ),
                                                color: "bg-purple-500",
                                            },
                                            {
                                                name: "Revenue Reports",
                                                icon: DollarSign,
                                                href: route(
                                                    "clinic.reports.revenue",
                                                    clinic.id
                                                ),
                                                color: "bg-emerald-500",
                                            },
                                            {
                                                name: "Inventory Reports",
                                                icon: Package,
                                                href: route(
                                                    "clinic.reports.inventory",
                                                    clinic.id
                                                ),
                                                color: "bg-orange-500",
                                            },
                                            {
                                                name: "Treatment Reports",
                                                icon: Stethoscope,
                                                href: route(
                                                    "clinic.reports.treatments",
                                                    clinic.id
                                                ),
                                                color: "bg-pink-500",
                                            },
                                        ].map((action, index) => (
                                            <Link
                                                key={action.name}
                                                href={action.href}
                                                className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-300 border border-transparent hover:border-slate-200 group"
                                            >
                                                <div
                                                    className={`p-3 rounded-xl shadow-lg ${action.color} group-hover:scale-110 transition-transform duration-300`}
                                                >
                                                    <action.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
                                                    {action.name}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300" />
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                                <CardHeader className="pb-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg">
                                    <CardTitle className="text-lg font-semibold text-slate-800">
                                        Recent Activity
                                    </CardTitle>
                                    <p className="text-sm text-slate-600">
                                        Latest updates and activities
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity
                                            ?.slice(0, 6)
                                            .map((activity, index) => {
                                                const Icon = getStatusIcon(
                                                    activity.status
                                                );
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                                                    >
                                                        <div className="p-2 bg-slate-100 rounded-lg">
                                                            <Icon className="w-4 h-4 text-slate-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-slate-800">
                                                                {activity.title}
                                                            </p>
                                                            <p className="text-sm text-slate-600">
                                                                {
                                                                    activity.description
                                                                }
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            className={getStatusColor(
                                                                activity.status
                                                            )}
                                                        >
                                                            {activity.status}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
