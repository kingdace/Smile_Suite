import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
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
    RefreshCw,
    Download,
    Eye,
    ArrowRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart as RechartsBarChart,
    Bar
} from 'recharts';

// Import only working components
import MetricCard from '@/Components/Reports/MetricCard';
import ExportButton from '@/Components/Reports/ExportButton';

export default function SimpleEnhancedReportsIndex({
    auth,
    clinic,
    metrics = {},
    monthlyRevenue = [],
    paymentMethods = [],
    topPatients = [],
    recentActivity = [],
    treatmentCategories = [],
    filters = {},
    appointmentStats = {},
    inventoryStats = {}
}) {
    const [loading, setLoading] = useState(false);

    // Format functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number || 0);
    };

    const handleRefresh = () => {
        setLoading(true);
        router.reload({ onFinish: () => setLoading(false) });
    };

    // Chart data preparation
    const revenueChartData = monthlyRevenue.map(item => ({
        month: item.month,
        revenue: item.revenue || item.total || 0
    }));

    const appointmentChartData = [
        { name: 'Completed', value: appointmentStats.completed || 0, color: '#10B981' },
        { name: 'Pending', value: appointmentStats.pending || 0, color: '#F59E0B' },
        { name: 'Cancelled', value: appointmentStats.cancelled || 0, color: '#EF4444' }
    ];

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Reports Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                                    Enhanced Reports Dashboard
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Comprehensive analytics and insights for {clinic.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <ExportButton
                                    exportRoute={`/clinic/${clinic.id}/reports/export/analytics`}
                                    filters={filters}
                                    clinic={clinic}
                                />
                                <Button onClick={handleRefresh} disabled={loading}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <MetricCard
                            title="Total Patients"
                            value={metrics.total_patients}
                            icon={Users}
                            trend="up"
                            trendValue={12}
                            color="blue"
                        />
                        <MetricCard
                            title="This Month Revenue"
                            value={metrics.total_revenue}
                            icon={DollarSign}
                            trend="up"
                            trendValue={8.5}
                            color="green"
                            format="currency"
                        />
                        <MetricCard
                            title="Appointments"
                            value={metrics.total_appointments}
                            icon={Calendar}
                            trend="down"
                            trendValue={3.2}
                            color="purple"
                        />
                        <MetricCard
                            title="Treatments"
                            value={metrics.total_treatments}
                            icon={Stethoscope}
                            trend="up"
                            trendValue={15.8}
                            color="orange"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Revenue Trends
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={revenueChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Line 
                                                type="monotone" 
                                                dataKey="revenue" 
                                                stroke="#3B82F6" 
                                                strokeWidth={3}
                                                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="w-5 h-5" />
                                    Appointment Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={appointmentChartData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {appointmentChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: 'Patient Reports', href: route('clinic.reports.patients', clinic.id), icon: Users, color: 'bg-blue-500' },
                                    { name: 'Revenue Reports', href: route('clinic.reports.revenue', clinic.id), icon: DollarSign, color: 'bg-green-500' },
                                    { name: 'Appointment Reports', href: route('clinic.reports.appointments', clinic.id), icon: Calendar, color: 'bg-purple-500' },
                                    { name: 'Treatment Reports', href: route('clinic.reports.treatments', clinic.id), icon: Stethoscope, color: 'bg-orange-500' },
                                    { name: 'Inventory Reports', href: route('clinic.reports.inventory', clinic.id), icon: Package, color: 'bg-indigo-500' }
                                ].map((action, index) => (
                                    <Link key={index} href={action.href}>
                                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-md ${action.color}`}>
                                                        <action.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{action.name}</h3>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                   
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
