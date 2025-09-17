import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
    BarChart3, 
    LineChart as LineChartIcon, 
    PieChart as PieChartIcon, 
    Download, 
    Maximize2, 
    MoreVertical,
    RefreshCw,
    Settings,
    AlertTriangle
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function ChartContainer({ 
    title, 
    subtitle,
    children, 
    data = [],
    loading = false,
    error = null,
    chartType = 'bar',
    onChartTypeChange,
    onExport,
    onRefresh,
    className = '',
    actions = [],
    showTypeSelector = true,
    showActions = true
}) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const chartTypes = [
        { key: 'bar', label: 'Bar Chart', icon: BarChart3 },
        { key: 'line', label: 'Line Chart', icon: LineChartIcon },
        { key: 'pie', label: 'Pie Chart', icon: PieChartIcon },
    ];

    const handleExport = (format) => {
        if (onExport) {
            onExport(format, { title, data });
        }
    };

    const getDataSummary = () => {
        if (!data || data.length === 0) return 'No data';
        return `${data.length} data points`;
    };

    if (error) {
        return (
            <Card className={`border-red-200 ${className}`}>
                <CardContent className="p-6">
                    <div className="text-center py-8">
                        <div className="text-red-500 mb-2">
                            <AlertTriangle className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Failed to load chart
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={onRefresh} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 ${className} ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                            {title}
                            {loading && (
                                <RefreshCw className="w-4 h-4 ml-2 animate-spin inline" />
                            )}
                        </CardTitle>
                        {subtitle && (
                            <p className="text-sm text-gray-600">{subtitle}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                                {getDataSummary()}
                            </Badge>
                            {chartType && (
                                <Badge variant="outline" className="text-xs">
                                    {chartTypes.find(t => t.key === chartType)?.label || chartType}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {showActions && (
                        <div className="flex items-center gap-2">
                            {showTypeSelector && onChartTypeChange && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <BarChart3 className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {chartTypes.map((type) => (
                                            <DropdownMenuItem
                                                key={type.key}
                                                onClick={() => onChartTypeChange(type.key)}
                                                className="flex items-center gap-2"
                                            >
                                                <type.icon className="w-4 h-4" />
                                                {type.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    
                                    {onRefresh && (
                                        <DropdownMenuItem onClick={onRefresh}>
                                            <RefreshCw className="w-4 h-4 mr-2" />
                                            Refresh Data
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem onClick={() => setIsFullscreen(!isFullscreen)}>
                                        <Maximize2 className="w-4 h-4 mr-2" />
                                        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={() => handleExport('png')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export as PNG
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => handleExport('svg')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export as SVG
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Data (CSV)
                                    </DropdownMenuItem>

                                    {actions.map((action, index) => (
                                        <DropdownMenuItem key={index} onClick={action.onClick}>
                                            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                            {action.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className={`${isFullscreen ? 'h-full' : ''}`}>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">Loading chart data...</p>
                        </div>
                    </div>
                ) : data && data.length > 0 ? (
                    <div className={`${isFullscreen ? 'h-full' : 'h-64 md:h-80'}`}>
                        {children}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-gray-400 mb-4">
                                <BarChart3 className="w-12 h-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No data available
                            </h3>
                            <p className="text-gray-600 mb-4">
                                There's no data to display for the selected period.
                            </p>
                            {onRefresh && (
                                <Button onClick={onRefresh} variant="outline" size="sm">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Refresh
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>

            {isFullscreen && (
                <div className="absolute top-4 right-4">
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsFullscreen(false)}
                        className="bg-white"
                    >
                        Exit Fullscreen
                    </Button>
                </div>
            )}
        </Card>
    );
}
