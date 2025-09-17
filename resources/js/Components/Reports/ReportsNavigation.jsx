import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent } from '@/Components/ui/card';
import { 
    BarChart3, 
    Users, 
    Calendar, 
    DollarSign, 
    Stethoscope, 
    Package,
    ArrowRight,
    TrendingUp,
    Activity,
    Eye,
    Download
} from 'lucide-react';

export default function ReportsNavigation({ clinic, currentPage = '', stats = {} }) {
    const reportPages = [
        {
            key: 'overview',
            title: 'Analytics Dashboard',
            description: 'Comprehensive overview with key metrics and insights',
            icon: BarChart3,
            href: route('clinic.reports.index', clinic.id),
            color: 'bg-gradient-to-br from-blue-500 to-blue-600',
            stats: `${stats.total_patients || 0} patients`,
            features: ['Real-time metrics', 'Interactive charts', 'Smart insights']
        },
        {
            key: 'patients',
            title: 'Patient Reports',
            description: 'Patient demographics, activity patterns, and engagement',
            icon: Users,
            href: route('clinic.reports.patients', clinic.id),
            color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            stats: `${stats.active_patients || 0} active`,
            features: ['Demographics', 'Visit history', 'Revenue contribution']
        },
        {
            key: 'appointments',
            title: 'Appointment Analytics',
            description: 'Scheduling trends, attendance rates, and efficiency metrics',
            icon: Calendar,
            href: route('clinic.reports.appointments', clinic.id),
            color: 'bg-gradient-to-br from-purple-500 to-purple-600',
            stats: `${stats.total_appointments || 0} total`,
            features: ['Scheduling patterns', 'No-show analysis', 'Efficiency metrics']
        },
        {
            key: 'revenue',
            title: 'Financial Reports',
            description: 'Revenue analysis, payment tracking, and financial insights',
            icon: DollarSign,
            href: route('clinic.reports.revenue', clinic.id),
            color: 'bg-gradient-to-br from-green-500 to-green-600',
            stats: `₱${(stats.total_revenue || 0).toLocaleString()}`,
            features: ['Revenue trends', 'Payment analysis', 'Growth tracking']
        },
        {
            key: 'treatments',
            title: 'Treatment Analytics',
            description: 'Procedure outcomes, success rates, and treatment patterns',
            icon: Stethoscope,
            href: route('clinic.reports.treatments', clinic.id),
            color: 'bg-gradient-to-br from-orange-500 to-orange-600',
            stats: `${stats.total_treatments || 0} treatments`,
            features: ['Success rates', 'Duration analysis', 'Outcome tracking']
        },
        {
            key: 'inventory',
            title: 'Inventory Reports',
            description: 'Stock levels, usage patterns, and supply optimization',
            icon: Package,
            href: route('clinic.reports.inventory', clinic.id),
            color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
            stats: `${stats.inventory_items || 0} items`,
            features: ['Stock levels', 'Usage patterns', 'Reorder alerts']
        }
    ];

    const isCurrentPage = (pageKey) => {
        if (pageKey === 'overview') {
            return currentPage === '' || currentPage === 'index' || currentPage === 'overview';
        }
        return currentPage === pageKey;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportPages.map((page) => {
                const Icon = page.icon;
                const isCurrent = isCurrentPage(page.key);
                
                return (
                    <Card 
                        key={page.key} 
                        className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                            isCurrent ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                        }`}
                    >
                        <div className={`h-2 ${page.color}`}></div>
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${page.color} shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-right">
                                    <Badge variant="secondary" className="text-xs">
                                        {page.stats}
                                    </Badge>
                                    {isCurrent && (
                                        <Badge className="ml-2 text-xs">
                                            Current
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {page.title}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {page.description}
                            </p>
                            
                            <div className="space-y-2 mb-4">
                                {page.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Link href={page.href} className="flex-1">
                                    <Button 
                                        className={`w-full justify-center ${
                                            isCurrent 
                                                ? 'bg-blue-600 hover:bg-blue-700' 
                                                : 'bg-gray-900 hover:bg-gray-800'
                                        }`}
                                        size="sm"
                                    >
                                        {isCurrent ? (
                                            <>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Current
                                            </>
                                        ) : (
                                            <>
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                                View Report
                                            </>
                                        )}
                                    </Button>
                                </Link>
                                
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="px-3"
                                    onClick={() => {
                                        // Export functionality - you can customize this
                                        window.open(`${page.href}/export?format=excel`, '_blank');
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
