import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { 
    TrendingUp, 
    TrendingDown, 
    Users, 
    Calendar, 
    DollarSign, 
    Package,
    Activity,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight,
    BarChart3
} from 'lucide-react';

export default function ReportSummary({ 
    title = "Report Summary",
    data = {},
    insights = [],
    recommendations = [],
    period = "This Month",
    onViewDetails,
    className = ""
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount || 0);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US').format(number || 0);
    };

    const getInsightIcon = (type) => {
        switch (type) {
            case 'positive':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'negative':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            default:
                return <Activity className="w-5 h-5 text-blue-600" />;
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'positive':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'negative':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Summary Header */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                                {title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Performance overview for {period}
                            </p>
                        </div>
                        <Badge variant="outline" className="text-sm">
                            {period}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="text-center">
                                <p className="text-2xl font-bold text-gray-900">
                                    {typeof value === 'number' && key.includes('revenue') 
                                        ? formatCurrency(value)
                                        : formatNumber(value)
                                    }
                                </p>
                                <p className="text-sm text-gray-600 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Key Insights */}
            {insights.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Key Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {insights.map((insight, index) => (
                                <div 
                                    key={index} 
                                    className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        {getInsightIcon(insight.type)}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 mb-1">
                                                {insight.title}
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                                {insight.description}
                                            </p>
                                            {insight.value && (
                                                <div className="mt-2">
                                                    <Badge 
                                                        variant={insight.type === 'positive' ? 'default' : 'secondary'}
                                                        className="text-xs"
                                                    >
                                                        {insight.value}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Recommendations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                                        <ArrowRight className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm">
                                            {recommendation.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {recommendation.description}
                                        </p>
                                        {recommendation.action && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="mt-2 h-8 px-3 text-xs"
                                                onClick={recommendation.action.onClick}
                                            >
                                                {recommendation.action.label}
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Button */}
            {onViewDetails && (
                <div className="text-center">
                    <Button onClick={onViewDetails} size="lg" className="px-8">
                        View Detailed Report
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}
        </div>
    );
}
