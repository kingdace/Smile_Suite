import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Calendar,
    Users,
    DollarSign,
    Heart,
    TrendingUp,
    TrendingDown,
    Activity,
    Clock,
    Star,
    Zap,
    Target,
    BarChart3,
    PieChart,
    LineChart,
    Settings,
    RefreshCw,
    Bell,
    ChevronRight,
    MoreVertical,
    Eye,
    EyeOff,
    Maximize2,
    Minimize2,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Filter,
    Download,
    Share2,
    CreditCard,
} from "lucide-react";
import EnhancedKPICard from "./EnhancedKPICard";
import AdvancedChart from "./AdvancedChart";
import SmartWidget from "./SmartWidget";

const EnhancedDashboardLayout = ({
    clinic,
    stats,
    todayAppointments,
    upcomingAppointments,
    recentPatients,
    lowStockItems,
    revenueMetrics,
    appointmentMetrics,
    satisfactionMetrics,
    staffPerformanceMetrics,
    chartData,
    patientDemographics,
    treatmentSuccess,
    peakHours,
    timeRange = "week",
    onTimeRangeChange,
    loading = false,
    className = "",
}) => {
    const [isCompact, setIsCompact] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [visibleWidgets, setVisibleWidgets] = useState({
        kpis: true,
        charts: true,
        appointments: true,
        patients: true,
        alerts: true,
        analytics: true,
    });

    // Sample data for demonstration
    const sampleChartData = [
        {
            id: "revenue",
            data: [
                { x: "Mon", y: 12000 },
                { x: "Tue", y: 15000 },
                { x: "Wed", y: 18000 },
                { x: "Thu", y: 22000 },
                { x: "Fri", y: 19000 },
                { x: "Sat", y: 14000 },
                { x: "Sun", y: 10000 },
            ],
        },
        {
            id: "appointments",
            data: [
                { x: "Mon", y: 12 },
                { x: "Tue", y: 19 },
                { x: "Wed", y: 15 },
                { x: "Thu", y: 23 },
                { x: "Fri", y: 18 },
                { x: "Sat", y: 8 },
                { x: "Sun", y: 5 },
            ],
        },
    ];

    const samplePieData = [
        { id: "Consultation", value: 35, color: "#3B82F6" },
        { id: "Cleaning", value: 25, color: "#1D4ED8" },
        { id: "Extraction", value: 20, color: "#1E40AF" },
        { id: "Root Canal", value: 15, color: "#1E3A8A" },
        { id: "Other", value: 5, color: "#1E3A8A" },
    ];

    const handleRefresh = async () => {
        setRefreshing(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const toggleWidget = (widget) => {
        setVisibleWidgets((prev) => ({
            ...prev,
            [widget]: !prev[widget],
        }));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 ${className}`}
        >
            {/* Enhanced Header */}
            <motion.div variants={itemVariants} className="pt-4 pb-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <motion.div
                                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30"
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Activity className="h-7 w-7 text-white" />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                                            {clinic?.name || "Clinic Dashboard"}
                                        </h1>
                                        <p className="text-white/80 text-sm font-medium">
                                            Advanced Analytics & Real-time
                                            Insights
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    {/* Time Range Selector */}
                                    <div className="flex items-center space-x-2">
                                        {["today", "week", "month", "year"].map(
                                            (range) => (
                                                <Button
                                                    key={range}
                                                    variant="outline"
                                                    size="sm"
                                                    className={`border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10 ${
                                                        timeRange === range
                                                            ? "bg-white/20 border-white/70"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        onTimeRangeChange &&
                                                        onTimeRangeChange(range)
                                                    }
                                                >
                                                    {range
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        range.slice(1)}
                                                </Button>
                                            )
                                        )}
                                    </div>

                                    {/* Control Buttons */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsCompact(!isCompact)}
                                        className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                    >
                                        {isCompact ? (
                                            <Maximize2 className="h-4 w-4" />
                                        ) : (
                                            <Minimize2 className="h-4 w-4" />
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRefresh}
                                        disabled={refreshing}
                                        className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10"
                                    >
                                        <RefreshCw
                                            className={`h-4 w-4 ${
                                                refreshing ? "animate-spin" : ""
                                            }`}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {/* KPI Cards Section */}
                <AnimatePresence>
                    {visibleWidgets.kpis && (
                        <motion.div
                            variants={itemVariants}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <EnhancedKPICard
                                    title="Today's Appointments"
                                    value={todayAppointments?.length || 0}
                                    previousValue={
                                        appointmentMetrics?.previous_appointments ||
                                        0
                                    }
                                    trend={true}
                                    trendDirection={
                                        appointmentMetrics?.trend_direction ||
                                        "up"
                                    }
                                    type="appointments"
                                    icon={<Calendar className="h-5 w-5" />}
                                    subtitle="Active appointments"
                                    loading={loading}
                                    compact={isCompact}
                                />

                                <EnhancedKPICard
                                    title="Total Patients"
                                    value={stats?.total_patients || 0}
                                    previousValue={
                                        stats?.previous_patients || 0
                                    }
                                    trend={true}
                                    trendDirection="up"
                                    type="patients"
                                    icon={<Users className="h-5 w-5" />}
                                    subtitle="Registered patients"
                                    loading={loading}
                                    compact={isCompact}
                                />

                                <EnhancedKPICard
                                    title="Revenue"
                                    value={revenueMetrics?.current_revenue || 0}
                                    previousValue={
                                        revenueMetrics?.previous_revenue || 0
                                    }
                                    trend={true}
                                    trendDirection={
                                        revenueMetrics?.trend_direction || "up"
                                    }
                                    type="revenue"
                                    icon={<DollarSign className="h-5 w-5" />}
                                    subtitle={`${timeRange} period`}
                                    format="currency"
                                    loading={loading}
                                    compact={isCompact}
                                />

                                <EnhancedKPICard
                                    title="Satisfaction"
                                    value={
                                        satisfactionMetrics?.average_rating || 0
                                    }
                                    previousValue={
                                        satisfactionMetrics?.previous_rating ||
                                        0
                                    }
                                    trend={true}
                                    trendDirection={
                                        satisfactionMetrics?.trend_direction ||
                                        "up"
                                    }
                                    type="satisfaction"
                                    icon={<Heart className="h-5 w-5" />}
                                    subtitle="Average rating"
                                    format="decimal"
                                    unit="/5"
                                    loading={loading}
                                    compact={isCompact}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Grid - Balanced Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                    {/* Left Column - Charts (2/3 width) */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Revenue Chart */}
                        <AnimatePresence>
                            {visibleWidgets.charts && (
                                <motion.div
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <AdvancedChart
                                        data={
                                            chartData &&
                                            chartData.revenue_chart &&
                                            Array.isArray(
                                                chartData.revenue_chart
                                            )
                                                ? chartData.revenue_chart
                                                : sampleChartData
                                        }
                                        type="line"
                                        title="Revenue Trends"
                                        subtitle={`Revenue over ${timeRange}`}
                                        height={280}
                                        compact={isCompact}
                                        className="mb-6"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Service Distribution */}
                        <AnimatePresence>
                            {visibleWidgets.charts && (
                                <motion.div
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <AdvancedChart
                                        data={
                                            chartData &&
                                            chartData.service_distribution &&
                                            Array.isArray(
                                                chartData.service_distribution
                                            )
                                                ? chartData.service_distribution
                                                : samplePieData
                                        }
                                        type="pie"
                                        title="Service Distribution"
                                        subtitle="Popular services this month"
                                        height={280}
                                        compact={isCompact}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Monthly Appointment Trends */}
                        <AnimatePresence>
                            {visibleWidgets.charts && (
                                <motion.div
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <AdvancedChart
                                        data={
                                            chartData &&
                                            chartData.appointment_chart &&
                                            Array.isArray(
                                                chartData.appointment_chart
                                            )
                                                ? chartData.appointment_chart
                                                : [
                                                      {
                                                          id: "appointments",
                                                          data: [
                                                              {
                                                                  x: "Jan",
                                                                  y: 45,
                                                              },
                                                              {
                                                                  x: "Feb",
                                                                  y: 52,
                                                              },
                                                              {
                                                                  x: "Mar",
                                                                  y: 48,
                                                              },
                                                              {
                                                                  x: "Apr",
                                                                  y: 61,
                                                              },
                                                              {
                                                                  x: "May",
                                                                  y: 55,
                                                              },
                                                              {
                                                                  x: "Jun",
                                                                  y: 67,
                                                              },
                                                              {
                                                                  x: "Jul",
                                                                  y: 72,
                                                              },
                                                              {
                                                                  x: "Aug",
                                                                  y: 68,
                                                              },
                                                              {
                                                                  x: "Sep",
                                                                  y: 75,
                                                              },
                                                              {
                                                                  x: "Oct",
                                                                  y: 82,
                                                              },
                                                              {
                                                                  x: "Nov",
                                                                  y: 78,
                                                              },
                                                              {
                                                                  x: "Dec",
                                                                  y: 85,
                                                              },
                                                          ],
                                                      },
                                                  ]
                                        }
                                        type="line"
                                        title="Monthly Appointment Trends"
                                        subtitle="Appointment volume over the year"
                                        height={280}
                                        compact={isCompact}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Column - Widgets (1/3 width) */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Today's Appointments */}
                        <AnimatePresence>
                            {visibleWidgets.appointments && (
                                <motion.div
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <SmartWidget
                                        title={
                                            todayAppointments?.length > 0 &&
                                            todayAppointments[0]?.scheduled_at
                                                ? new Date(
                                                      todayAppointments[0].scheduled_at
                                                  ).toDateString() ===
                                                  new Date().toDateString()
                                                    ? "Today's Schedule"
                                                    : "Upcoming Schedules"
                                                : "Today's Schedule"
                                        }
                                        subtitle={
                                            todayAppointments?.length > 0 &&
                                            todayAppointments[0]?.scheduled_at
                                                ? new Date(
                                                      todayAppointments[0].scheduled_at
                                                  ).toDateString() ===
                                                  new Date().toDateString()
                                                    ? "Today's appointments"
                                                    : "Next scheduled appointments"
                                                : "Upcoming appointments"
                                        }
                                        type="appointments"
                                        data={todayAppointments}
                                        compact={isCompact}
                                        loading={loading}
                                        onViewAll={() =>
                                            console.log("View all appointments")
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Recent Patients */}
                        <AnimatePresence>
                            {visibleWidgets.patients && (
                                <motion.div
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <SmartWidget
                                        title="Recent Patients"
                                        subtitle="Latest registrations"
                                        type="patients"
                                        data={recentPatients}
                                        compact={isCompact}
                                        loading={loading}
                                        onViewAll={() =>
                                            console.log("View all patients")
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Alerts & Notifications */}
                        <AnimatePresence>
                            {visibleWidgets.alerts && (
                                <motion.div
                                    variants={itemVariants}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <SmartWidget
                                        title="Alerts & Notifications"
                                        subtitle="Items requiring attention"
                                        type="alerts"
                                        data={lowStockItems?.map((item) => ({
                                            id: item.id,
                                            title: "Low Stock Alert",
                                            message: `${item.name} is running low`,
                                            type: "warning",
                                        }))}
                                        compact={isCompact}
                                        loading={loading}
                                        onViewAll={() =>
                                            console.log("View all alerts")
                                        }
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Detailed Analytics Grid */}
                <AnimatePresence>
                    {visibleWidgets.analytics && (
                        <motion.div
                            variants={itemVariants}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Patient Demographics */}
                                <Card className="border-0 shadow-lg bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-blue-900 leading-tight">
                                                    Patient Demographics
                                                </h3>
                                                <p className="text-xs text-blue-600 mt-0.5 leading-tight">
                                                    Age distribution analysis
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Users className="h-4 w-4 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-blue-700">
                                                    Age 0-18
                                                </span>
                                                <span className="text-sm font-medium text-blue-900">
                                                    {patientDemographics
                                                        ?.age_0_18
                                                        ?.percentage || 0}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            patientDemographics
                                                                ?.age_0_18
                                                                ?.percentage ||
                                                            0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-blue-700">
                                                    Age 19-35
                                                </span>
                                                <span className="text-sm font-medium text-blue-900">
                                                    {patientDemographics
                                                        ?.age_19_35
                                                        ?.percentage || 0}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            patientDemographics
                                                                ?.age_19_35
                                                                ?.percentage ||
                                                            0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-blue-700">
                                                    Age 36-50
                                                </span>
                                                <span className="text-sm font-medium text-blue-900">
                                                    {patientDemographics
                                                        ?.age_36_50
                                                        ?.percentage || 0}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            patientDemographics
                                                                ?.age_36_50
                                                                ?.percentage ||
                                                            0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-blue-700">
                                                    Age 51-65
                                                </span>
                                                <span className="text-sm font-medium text-blue-900">
                                                    {patientDemographics
                                                        ?.age_51_65
                                                        ?.percentage || 0}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            patientDemographics
                                                                ?.age_51_65
                                                                ?.percentage ||
                                                            0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-blue-700">
                                                    Age 65+
                                                </span>
                                                <span className="text-sm font-medium text-blue-900">
                                                    {patientDemographics
                                                        ?.age_65_plus
                                                        ?.percentage || 0}
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-blue-100 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${
                                                            patientDemographics
                                                                ?.age_65_plus
                                                                ?.percentage ||
                                                            0
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Treatment Success Rate */}
                                <Card className="border-0 shadow-lg bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-blue-900 leading-tight">
                                                    Treatment Success
                                                </h3>
                                                <p className="text-xs text-blue-600 mt-0.5 leading-tight">
                                                    Success rate & statistics
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                <Heart className="h-4 w-4 text-emerald-600" />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                                                {treatmentSuccess?.success_rate ||
                                                    0}
                                                %
                                            </div>
                                            <div className="text-sm text-blue-600 mb-4">
                                                Success Rate
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-blue-700">
                                                        Completed
                                                    </span>
                                                    <span className="text-emerald-600 font-medium">
                                                        {treatmentSuccess?.completed_appointments ||
                                                            0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-blue-700">
                                                        Total
                                                    </span>
                                                    <span className="text-blue-600 font-medium">
                                                        {treatmentSuccess?.total_appointments ||
                                                            0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-blue-700">
                                                        Cancelled
                                                    </span>
                                                    <span className="text-red-600 font-medium">
                                                        {treatmentSuccess?.cancelled_appointments ||
                                                            0}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-blue-700">
                                                        No Show
                                                    </span>
                                                    <span className="text-orange-600 font-medium">
                                                        {treatmentSuccess?.no_show_appointments ||
                                                            0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Peak Hours Analysis */}
                                <Card className="border-0 shadow-lg bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-blue-900 leading-tight">
                                                    Peak Hours
                                                </h3>
                                                <p className="text-xs text-blue-600 mt-0.5 leading-tight">
                                                    Busy time analysis
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                                <Clock className="h-4 w-4 text-amber-600" />
                                            </div>
                                        </div>
                                        <div className="text-center mb-4">
                                            <div className="text-2xl font-bold text-amber-600 mb-1">
                                                {peakHours?.peak_hour_formatted ||
                                                    "9:00-10:00"}
                                            </div>
                                            <div className="text-xs text-blue-600">
                                                Peak Time
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {peakHours?.top_hours
                                                ?.slice(0, 4)
                                                .map((hour, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-sm text-blue-700">
                                                            {hour.time}
                                                        </span>
                                                        <Badge
                                                            className={
                                                                index === 0
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : index ===
                                                                      1
                                                                    ? "bg-blue-100 text-blue-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }
                                                        >
                                                            {hour.count}{" "}
                                                            appointments
                                                        </Badge>
                                                    </div>
                                                )) || (
                                                <div className="text-center text-blue-500 text-sm">
                                                    No appointment data
                                                    available
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Staff Performance */}
                                <Card className="border-0 shadow-lg bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-sm font-semibold text-blue-900 leading-tight">
                                                    Staff Performance
                                                </h3>
                                                <p className="text-xs text-blue-600 mt-0.5 leading-tight">
                                                    Doctor ratings & reviews
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                                <Star className="h-4 w-4 text-yellow-600" />
                                            </div>
                                        </div>
                                        <div className="text-center mb-4">
                                            <div className="text-2xl font-bold text-yellow-600 mb-1">
                                                {staffPerformanceMetrics?.overall_average_rating ||
                                                    0}
                                            </div>
                                            <div className="text-xs text-blue-600">
                                                Average Rating (
                                                {staffPerformanceMetrics?.total_doctor_reviews ||
                                                    0}{" "}
                                                reviews)
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {staffPerformanceMetrics
                                                ?.staff_performance?.length >
                                            0 ? (
                                                staffPerformanceMetrics.staff_performance
                                                    .slice(0, 4)
                                                    .map((doctor, index) => (
                                                        <div
                                                            key={doctor.id}
                                                            className="flex items-center justify-between"
                                                        >
                                                            <span className="text-sm text-blue-700">
                                                                {doctor.name}
                                                            </span>
                                                            <div className="flex items-center">
                                                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                                                <span className="text-sm text-yellow-600 ml-1 font-medium">
                                                                    {
                                                                        doctor.average_rating
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-gray-500 ml-1">
                                                                    (
                                                                    {
                                                                        doctor.review_count
                                                                    }
                                                                    )
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="text-center text-gray-500 text-sm py-4">
                                                    No doctor reviews yet
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Financial Overview Section */}
                <AnimatePresence>
                    {visibleWidgets.analytics && (
                        <motion.div
                            variants={itemVariants}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-8"
                        >
                            {/* Cards removed as requested */}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Widget Controls */}
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center space-x-2 p-3 bg-white/80 rounded-xl backdrop-blur-sm border border-blue-100 shadow-sm"
                >
                    <span className="text-xs font-semibold text-blue-600 mr-2">
                        Controls:
                    </span>
                    {Object.entries(visibleWidgets).map(([key, visible]) => (
                        <Button
                            key={key}
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleWidget(key)}
                            className={`h-8 px-3 text-xs font-medium transition-all duration-200 ${
                                visible
                                    ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600"
                                    : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                        >
                            {visible ? (
                                <Eye className="h-3 w-3 mr-1.5" />
                            ) : (
                                <EyeOff className="h-3 w-3 mr-1.5" />
                            )}
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Button>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EnhancedDashboardLayout;
