import React from 'react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    trendLabel = 'vs last period',
    color = 'blue',
    format = 'number',
    loading = false,
    onClick,
    className = ''
}) {
    const formatValue = (val) => {
        if (loading) return '...';
        if (format === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP'
            }).format(val || 0);
        }
        if (format === 'percentage') {
            return `${val || 0}%`;
        }
        return new Intl.NumberFormat('en-US').format(val || 0);
    };

    const getTrendIcon = () => {
        if (!trend) return Minus;
        return trend === 'up' ? TrendingUp : TrendingDown;
    };

    const getTrendColor = () => {
        if (!trend) return 'text-gray-500';
        return trend === 'up' ? 'text-green-600' : 'text-red-600';
    };

    const getTrendBadgeColor = () => {
        if (!trend) return 'secondary';
        return trend === 'up' ? 'default' : 'destructive';
    };

    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            icon: 'text-blue-600',
            border: 'border-blue-100'
        },
        green: {
            bg: 'bg-green-50',
            icon: 'text-green-600',
            border: 'border-green-100'
        },
        purple: {
            bg: 'bg-purple-50',
            icon: 'text-purple-600',
            border: 'border-purple-100'
        },
        orange: {
            bg: 'bg-orange-50',
            icon: 'text-orange-600',
            border: 'border-orange-100'
        },
        red: {
            bg: 'bg-red-50',
            icon: 'text-red-600',
            border: 'border-red-100'
        },
        indigo: {
            bg: 'bg-indigo-50',
            icon: 'text-indigo-600',
            border: 'border-indigo-100'
        }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <Card 
            className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${colors.border} ${className}`}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            {title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                            {formatValue(value)}
                        </p>
                        
                        {(trend || trendValue) && (
                            <div className="flex items-center gap-2">
                                <Badge 
                                    variant={getTrendBadgeColor()} 
                                    className="flex items-center gap-1 text-xs"
                                >
                                    {React.createElement(getTrendIcon(), { 
                                        className: `w-3 h-3 ${getTrendColor()}` 
                                    })}
                                    {trendValue && `${Math.abs(trendValue)}%`}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    {trendLabel}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className={`p-3 rounded-full ${colors.bg}`}>
                        {Icon && (
                            <Icon className={`w-6 h-6 ${colors.icon}`} />
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
