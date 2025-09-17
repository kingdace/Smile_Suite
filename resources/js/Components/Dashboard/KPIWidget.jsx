import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Calendar, 
    Star, 
    Users,
    Activity,
    Clock
} from 'lucide-react';

const KPIWidget = ({
    title,
    value,
    trend,
    trendDirection = 'up',
    comparisonText,
    type = 'default',
    loading = false,
    onClick,
    className = ''
}) => {
    const getIcon = () => {
        switch (type) {
            case 'revenue':
                return <DollarSign className="h-5 w-5" />;
            case 'appointments':
                return <Calendar className="h-5 w-5" />;
            case 'satisfaction':
                return <Star className="h-5 w-5" />;
            case 'patients':
                return <Users className="h-5 w-5" />;
            case 'efficiency':
                return <Activity className="h-5 w-5" />;
            case 'time':
                return <Clock className="h-5 w-5" />;
            default:
                return <Activity className="h-5 w-5" />;
        }
    };

    const getColorClasses = () => {
        switch (type) {
            case 'revenue':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'appointments':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'satisfaction':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'patients':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'efficiency':
                return 'text-indigo-600 bg-indigo-50 border-indigo-200';
            case 'time':
                return 'text-orange-600 bg-orange-50 border-orange-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getTrendColor = () => {
        if (trendDirection === 'up') {
            return 'text-green-600';
        } else if (trendDirection === 'down') {
            return 'text-red-600';
        }
        return 'text-gray-600';
    };

    const formatValue = (val) => {
        if (loading) return '...';
        if (typeof val === 'number') {
            if (type === 'revenue') {
                return `$${val.toLocaleString()}`;
            }
            if (type === 'satisfaction') {
                return `${val}/5`;
            }
            if (type === 'time') {
                return `${val} min`;
            }
            return val.toLocaleString();
        }
        return val;
    };

    return (
        <Card 
            className={`transition-all duration-200 hover:shadow-md ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                    {title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${getColorClasses()}`}>
                    {getIcon()}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                        {loading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                        ) : (
                            formatValue(value)
                        )}
                    </div>
                    
                    {(trend !== undefined && trend !== null) && (
                        <div className="flex items-center space-x-1">
                            {trendDirection === 'up' ? (
                                <TrendingUp className={`h-4 w-4 ${getTrendColor()}`} />
                            ) : trendDirection === 'down' ? (
                                <TrendingDown className={`h-4 w-4 ${getTrendColor()}`} />
                            ) : null}
                            <span className={`text-sm font-medium ${getTrendColor()}`}>
                                {Math.abs(trend)}%
                            </span>
                            {comparisonText && (
                                <span className="text-sm text-gray-500">
                                    {comparisonText}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {!trend && comparisonText && (
                        <p className="text-sm text-gray-500">
                            {comparisonText}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default KPIWidget;
