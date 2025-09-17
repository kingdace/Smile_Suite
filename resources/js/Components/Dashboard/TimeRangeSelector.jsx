import React from 'react';
import { Button } from '@/Components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Calendar, ChevronDown, Clock } from 'lucide-react';

const TimeRangeSelector = ({ 
    value, 
    onChange, 
    availableRanges = ['today', 'week', 'month', 'quarter', 'year'],
    loading = false 
}) => {
    const rangeLabels = {
        today: 'Today',
        week: 'This Week',
        month: 'This Month',
        quarter: 'This Quarter',
        year: 'This Year'
    };

    const rangeIcons = {
        today: <Clock className="h-4 w-4" />,
        week: <Calendar className="h-4 w-4" />,
        month: <Calendar className="h-4 w-4" />,
        quarter: <Calendar className="h-4 w-4" />,
        year: <Calendar className="h-4 w-4" />
    };

    return (
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-white">
                {rangeIcons[value] || <Calendar className="h-4 w-4" />}
                <span>Time Range:</span>
            </div>
            
            <Select 
                value={value} 
                onValueChange={onChange}
                disabled={loading}
            >
                <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Select range" />
                    {loading && (
                        <div className="ml-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </SelectTrigger>
                <SelectContent>
                    {availableRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                            <div className="flex items-center space-x-2">
                                {rangeIcons[range]}
                                <span>{rangeLabels[range]}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default TimeRangeSelector;
