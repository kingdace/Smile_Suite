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
    ArrowRight,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Settings,
    Filter,
    Search
} from 'lucide-react';
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
    ComposedChart
} from 'recharts';

// Import our new components
import MetricCard from '@/Components/Reports/MetricCard';
import ChartContainer from '@/Components/Reports/ChartContainer';
import ReportTabs from '@/Components/Reports/ReportTabs';
import ReportFilters from '@/Components/Reports/ReportFilters';
import DateRangePicker from '@/Components/Reports/DateRangePicker';
import ExportButton from '@/Components/Reports/ExportButton';

export default function EnhancedReportsIndex({
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
    const [activeTab, setActiveTab] = useState('overview');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [loading, setLoading] = useState(false);
    const [chartTypes, setChartTypes] = useState({
        revenue: 'line',
        appointments: 'bar',
        treatments: 'pie'
    });

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

    // Handle filters change
    const handleFiltersChange = (newFilters) => {
        setLoading(true);
        router.get(route('clinic.reports.index', clinic.id), newFilters, {
            preserveState: true,
            onFinish: () => setLoading(false)
        });
    };

    const handleDateChange = (from, to) => {
        setDateFrom(from);
        setDateTo(to);
        handleFiltersChange({ ...filters, date_from: from, date_to: to });
    };

    const handleRefresh = () => {
        setLoading(true);
        router.reload({ onFinish: () => setLoading(false) });
    };

    // Chart data preparation
    const revenueChartData = monthlyRevenue.map(item => ({
        month: item.month,
        revenue: item.revenue || item.total || 0,
        target: (item.revenue || item.total || 0) * 1.1 // 10% target increase
    }));

    const appointmentChartData = [
        { name: 'Completed', value: appointmentStats.completed || 0, color: '#10B981' },
        { name: 'Pending', value: appointmentStats.pending || 0, color: '#F59E0B' },
        { name: 'Cancelled', value: appointmentStats.cancelled || 0, color: '#EF4444' }
    ];

    const treatmentChartData = treatmentCategories.map((category, index) => ({
        name: category.name || `Category ${index + 1}`,
        value: category.count || 0,
        color: `hsl(${index * 45}, 70%, 50%)`
    }));

    // Available filters for the filter component
    const availableFilters = {
        statuses: [
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' }
        ],
        categories: [
            { value: 'consultation', label: 'Consultation' },
            { value: 'treatment', label: 'Treatment' },
            { value: 'surgery', label: 'Surgery' }
        ],
        paymentMethods: [
            { value: 'cash', label: 'Cash' },
            { value: 'card', label: 'Card' },
            { value: 'bank_transfer', label: 'Bank Transfer' }
        ]
    };

    const renderOverviewTab = () => (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Patients"
                    value={metrics.total_patients}
                    icon={Users}
                    trend="up"
                    trendValue={12}
                    color="blue"
                    onClick={() => setActiveTab('patients')}
                />
                <MetricCard
                    title="This Month Revenue"
                    value={metrics.total_revenue}
                    icon={DollarSign}
                    trend="up"
                    trendValue={8.5}
                    color="green"
                    format="currency"
                    onClick={() => setActiveTab('revenue')}
                />
                <MetricCard
                    title="Appointments"
                    value={metrics.total_appointments}
                    icon={Calendar}
                    trend="down"
                    trendValue={3.2}
                    color="purple"
                    onClick={() => setActiveTab('appointments')}
                />
                <MetricCard
                    title="Treatments"
                    value={metrics.total_treatments}
                    icon={Stethoscope}
                    trend="up"
                    trendValue={15.8}
                    color="orange"
                    onClick={() => setActiveTab('treatments')}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer
                    title="Revenue Trends"
                    subtitle="Monthly revenue over time"
                    data={revenueChartData}
                    chartType={chartTypes.revenue}
                    onChartTypeChange={(type) => setChartTypes(prev => ({ ...prev, revenue: type }))}
                    loading={loading}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        {chartTypes.revenue === 'line' ? (
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
                                <Line 
                                    type="monotone" 
                                    dataKey="target" 
                                    stroke="#10B981" 
                                    strokeDasharray="5 5"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        ) : chartTypes.revenue === 'bar' ? (
                            <RechartsBarChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Bar dataKey="revenue" fill="#3B82F6" />
                            </RechartsBarChart>
                        ) : (
                            <AreaChart data={revenueChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#3B82F6" 
                                    fill="#3B82F6" 
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer
                    title="Appointment Status"
                    subtitle="Current appointment distribution"
                    data={appointmentChartData}
                    chartType="pie"
                    loading={loading}
                >
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
                </ChartContainer>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { name: 'Patient Reports', href: route('clinic.reports.patients', clinic.id), icon: Users, color: 'bg-blue-500' },
                                { name: 'Revenue Reports', href: route('clinic.reports.revenue', clinic.id), icon: DollarSign, color: 'bg-green-500' },
                                { name: 'Appointment Reports', href: route('clinic.reports.appointments', clinic.id), icon: Calendar, color: 'bg-purple-500' },
                                { name: 'Treatment Reports', href: route('clinic.reports.treatments', clinic.id), icon: Stethoscope, color: 'bg-orange-500' },
                                { name: 'Inventory Reports', href: route('clinic.reports.inventory', clinic.id), icon: Package, color: 'bg-indigo-500' }
                            ].map((action, index) => (
                                <Link key={index} href={action.href}>
                                    <Button variant="ghost" className="w-full justify-start">
                                        <div className={`p-2 rounded-md ${action.color} mr-3`}>
                                            <action.icon className="w-4 h-4 text-white" />
                                        </div>
                                        {action.name}
                                        <ArrowRight className="w-4 h-4 ml-auto" />
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.slice(0, 5).map((activity, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                                        <div className={`p-2 rounded-full ${
                                            activity.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                            {activity.type === 'payment' ? (
                                                <DollarSign className={`w-4 h-4 ${
                                                    activity.type === 'payment' ? 'text-green-600' : 'text-blue-600'
                                                }`} />
                                            ) : (
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{activity.title}</p>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                        </div>
                                        <div className="text-right">
                                            {activity.amount && (
                                                <p className="font-medium text-sm">{formatCurrency(activity.amount)}</p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                {activity.date ? new Date(activity.date).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Reports Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                                    Reports Dashboard
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Comprehensive analytics and insights for {clinic.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <DateRangePicker
                                    dateFrom={dateFrom}
                                    dateTo={dateTo}
                                    onDateChange={handleDateChange}
                                />
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
                    {/* Filters */}
                    <div className="mb-8">
                        <ReportFilters
                            filters={filters}
                            onFiltersChange={handleFiltersChange}
                            onReset={() => handleFiltersChange({})}
                            onRefresh={handleRefresh}
                            availableFilters={availableFilters}
                            loading={loading}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="mb-8">
                        <ReportTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    {/* Tab Content */}
                    <div className="space-y-8">
                        {activeTab === 'overview' && renderOverviewTab()}
                        
                        {activeTab !== 'overview' && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Settings className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Detailed {activeTab} analysis and insights
                                </p>
                                <Link href={route(`clinic.reports.${activeTab}`, clinic.id)}>
                                    <Button>
                                        View Detailed {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
