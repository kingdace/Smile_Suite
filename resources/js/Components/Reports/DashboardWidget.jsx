import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
    MoreVertical, 
    Maximize2, 
    Minimize2, 
    RefreshCw, 
    Settings,
    Download,
    Eye,
    TrendingUp,
    TrendingDown,
    Minus,
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

export default function DashboardWidget({ 
    title,
    subtitle,
    value,
    previousValue,
    icon: Icon,
    color = 'blue',
    format = 'number',
    loading = false,
    error = null,
    trend,
    trendValue,
    children,
    actions = [],
    onRefresh,
    onExpand,
    onSettings,
    className = '',
    size = 'default' // 'small', 'default', 'large'
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatValue = (val) => {
        if (loading) return '...';
        if (error) return 'Error';
        
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'PHP'
                }).format(val || 0);
            case 'percentage':
                return `${val || 0}%`;
            case 'decimal':
                return (val || 0).toFixed(2);
            default:
                return new Intl.NumberFormat('en-US').format(val || 0);
        }
    };

    const calculateTrend = () => {
        if (!previousValue || !value) return null;
        const change = ((value - previousValue) / previousValue) * 100;
        return {
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
            value: Math.abs(change).toFixed(1)
        };
    };

    const autoTrend = trend || calculateTrend();

    const getTrendIcon = () => {
        if (!autoTrend) return Minus;
        switch (autoTrend.direction) {
            case 'up': return TrendingUp;
            case 'down': return TrendingDown;
            default: return Minus;
        }
    };

    const getTrendColor = () => {
        if (!autoTrend) return 'text-gray-500';
        switch (autoTrend.direction) {
            case 'up': return 'text-green-600';
            case 'down': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-600',
            border: 'border-blue-100',
            accent: 'bg-blue-600'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-600',
            border: 'border-green-100',
            accent: 'bg-green-600'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'text-purple-600',
            border: 'border-purple-100',
            accent: 'bg-purple-600'
        },
        orange: {
            bg: 'bg-orange-50',
            icon: 'text-orange-600',
            border: 'border-orange-100',
            accent: 'bg-orange-600'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            border: 'border-red-100',
            accent: 'bg-red-600'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    const sizeClasses = {
        small: 'col-span-1',
        default: 'col-span-1 md:col-span-2',
        large: 'col-span-1 md:col-span-2 lg:col-span-3'
    };

    if (error) {
        return (
            <Card className={`border-red-200 bg-red-50 ${className}`}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        <div>
                            <h3 className="font-medium text-red-900">{title}</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 ${colors.border} ${className} ${sizeClasses[size]}`}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-sm font-medium text-gray-600 mb-1">
                            {title}
                        </CardTitle>
                        {subtitle && (
                            <p className="text-xs text-gray-500">{subtitle}</p>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {Icon && (
                            <div className={`p-2 rounded-lg ${colors.bg}`}>
                                <Icon className={`w-5 h-5 ${colors.icon}`} />
                            </div>
                        )}
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Widget Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                
                                {onRefresh && (
                                    <DropdownMenuItem onClick={onRefresh}>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh
                                    </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                                    {isExpanded ? (
                                        <>
                                            <Minimize2 className="w-4 h-4 mr-2" />
                                            Collapse
                                        </>
                                    ) : (
                                        <>
                                            <Maximize2 className="w-4 h-4 mr-2" />
                                            Expand
                                        </>
                                    )}
                                </DropdownMenuItem>
                                
                                {onSettings && (
                                    <DropdownMenuItem onClick={onSettings}>
                                        <Settings className="w-4 h-4 mr-2" />
                                        Settings
                                    </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                
                                {actions.map((action, index) => (
                                    <DropdownMenuItem key={index} onClick={action.onClick}>
                                        {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                        {action.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {/* Main Value */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                            {formatValue(value)}
                        </span>
                        
                        {loading && (
                            <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                        )}
                    </div>
                    
                    {/* Trend Indicator */}
                    {autoTrend && (
                        <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                                {React.createElement(getTrendIcon(), { className: 'w-4 h-4' })}
                                <span className="text-sm font-medium">
                                    {trendValue || autoTrend.value}%
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">vs last period</span>
                        </div>
                    )}
                    
                    {/* Custom Content */}
                    {children && (
                        <div className={`${isExpanded ? 'block' : 'hidden'} mt-4`}>
                            {children}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
