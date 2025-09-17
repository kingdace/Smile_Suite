import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { router } from '@inertiajs/react';

const InteractiveChart = ({
    title,
    data = [],
    type = 'area',
    dataKey,
    xAxisKey = 'date',
    color = '#3b82f6',
    height = 300,
    loading = false,
    onDataPointClick,
    showLegend = false,
    className = ''
}) => {
    const colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
    ];

    const handleDataPointClick = (data, index) => {
        if (onDataPointClick) {
            onDataPointClick(data, index);
        } else {
            // Default behavior - navigate to reports with filters
            const params = new URLSearchParams();
            if (data.date) {
                params.append('date', data.date);
            }
            if (data.name) {
                params.append('filter', data.name);
            }
            
            // Navigate to reports page with filters
            router.visit(`/clinic/${window.location.pathname.split('/')[2]}/reports?${params.toString()}`);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.name}: ${entry.value}`}
                        </p>
                    ))}
                    <p className="text-xs text-gray-500 mt-1">Click to view details</p>
                </div>
            );
        }
        return null;
    };

    const renderChart = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse space-y-2 w-full">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <p className="text-sm">No data available</p>
                        <p className="text-xs mt-1">Data will appear here when available</p>
                    </div>
                </div>
            );
        }

        const commonProps = {
            data,
            margin: { top: 5, right: 30, left: 20, bottom: 5 }
        };

        switch (type) {
            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey={xAxisKey} 
                            stroke="#666"
                            fontSize={12}
                        />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.1}
                            strokeWidth={2}
                            onClick={handleDataPointClick}
                            style={{ cursor: 'pointer' }}
                        />
                    </AreaChart>
                );

            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                            dataKey={xAxisKey} 
                            stroke="#666"
                            fontSize={12}
                        />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                        <Bar
                            dataKey={dataKey}
                            fill={color}
                            onClick={handleDataPointClick}
                            style={{ cursor: 'pointer' }}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey={dataKey}
                            onClick={handleDataPointClick}
                            style={{ cursor: 'pointer' }}
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={colors[index % colors.length]} 
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend />}
                    </PieChart>
                );

            default:
                return <div>Unsupported chart type</div>;
        }
    };

    return (
        <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ height: `${height}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default InteractiveChart;
