import React from 'react';
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
    Activity
} from 'lucide-react';

export default function ReportTabs({ 
    activeTab, 
    onTabChange, 
    tabs = [],
    className = '' 
}) {
    const defaultTabs = [
        {
            key: 'overview',
            label: 'Overview',
            icon: BarChart3,
            description: 'Key metrics and analytics'
        },
        {
            key: 'patients',
            label: 'Patients',
            icon: Users,
            description: 'Patient demographics and activity',
            badge: '1,234'
        },
        {
            key: 'appointments',
            label: 'Appointments',
            icon: Calendar,
            description: 'Scheduling and attendance trends',
            badge: '89'
        },
        {
            key: 'revenue',
            label: 'Revenue',
            icon: DollarSign,
            description: 'Financial performance and payments',
            badge: '₱45.2K'
        },
        {
            key: 'treatments',
            label: 'Treatments',
            icon: Stethoscope,
            description: 'Treatment outcomes and procedures',
            badge: '156'
        },
        {
            key: 'inventory',
            label: 'Inventory',
            icon: Package,
            description: 'Stock levels and usage',
            badge: '23 low'
        }
    ];

    const tabsToRender = tabs.length > 0 ? tabs : defaultTabs;

    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabsToRender.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={`
                                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                                transition-all duration-200 hover:border-gray-300
                                ${isActive 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            <Icon className={`
                                -ml-0.5 mr-2 h-5 w-5 transition-colors duration-200
                                ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                            `} />
                            
                            <span className="flex items-center gap-2">
                                {tab.label}
                                {tab.badge && (
                                    <Badge 
                                        variant={isActive ? 'default' : 'secondary'} 
                                        className="text-xs"
                                    >
                                        {tab.badge}
                                    </Badge>
                                )}
                            </span>
                        </button>
                    );
                })}
            </nav>
            
            {/* Tab descriptions */}
            <div className="mt-2 mb-4">
                {tabsToRender.map((tab) => {
                    if (activeTab !== tab.key || !tab.description) return null;
                    
                    return (
                        <p key={tab.key} className="text-sm text-gray-600">
                            {tab.description}
                        </p>
                    );
                })}
            </div>
        </div>
    );
}
