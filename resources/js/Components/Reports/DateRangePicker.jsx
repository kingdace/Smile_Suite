import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Calendar, ChevronDown, Clock, Filter } from 'lucide-react';
import { Badge } from '@/Components/ui/badge';

export default function DateRangePicker({ 
    dateFrom, 
    dateTo, 
    onDateChange, 
    className = '',
    presets = true 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [tempDateFrom, setTempDateFrom] = useState(dateFrom || '');
    const [tempDateTo, setTempDateTo] = useState(dateTo || '');

    const handleApply = () => {
        onDateChange(tempDateFrom, tempDateTo);
        setIsOpen(false);
    };

    const handlePreset = (preset) => {
        const today = new Date();
        let from, to;

        switch (preset) {
            case 'today':
                from = to = today.toISOString().split('T')[0];
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                from = to = yesterday.toISOString().split('T')[0];
                break;
            case 'last7days':
                from = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            case 'last30days':
                from = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            case 'thisMonth':
                from = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            case 'lastMonth':
                const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                from = lastMonth.toISOString().split('T')[0];
                to = lastMonthEnd.toISOString().split('T')[0];
                break;
            case 'thisYear':
                from = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                to = today.toISOString().split('T')[0];
                break;
            default:
                return;
        }

        setTempDateFrom(from);
        setTempDateTo(to);
        onDateChange(from, to);
        setIsOpen(false);
    };

    const formatDateRange = () => {
        if (!dateFrom && !dateTo) return 'Select date range';
        if (dateFrom === dateTo) return new Date(dateFrom).toLocaleDateString();
        return `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()}`;
    };

    const presetOptions = [
        { key: 'today', label: 'Today' },
        { key: 'yesterday', label: 'Yesterday' },
        { key: 'last7days', label: 'Last 7 days' },
        { key: 'last30days', label: 'Last 30 days' },
        { key: 'thisMonth', label: 'This month' },
        { key: 'lastMonth', label: 'Last month' },
        { key: 'thisYear', label: 'This year' },
    ];

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button 
                    variant="outline" 
                    className={`justify-between min-w-[200px] ${className}`}
                >
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="truncate">{formatDateRange()}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
                <div className="p-4 border-b">
                    <h4 className="font-medium text-sm text-gray-900 mb-3">Select Date Range</h4>
                    
                    {presets && (
                        <div className="mb-4">
                            <Label className="text-xs text-gray-600 mb-2 block">Quick Select</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {presetOptions.map((preset) => (
                                    <Button
                                        key={preset.key}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handlePreset(preset.key)}
                                        className="justify-start text-xs h-8"
                                    >
                                        {preset.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="date-from" className="text-xs text-gray-600">From</Label>
                            <Input
                                id="date-from"
                                type="date"
                                value={tempDateFrom}
                                onChange={(e) => setTempDateFrom(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="date-to" className="text-xs text-gray-600">To</Label>
                            <Input
                                id="date-to"
                                type="date"
                                value={tempDateTo}
                                onChange={(e) => setTempDateTo(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="p-3 bg-gray-50 flex justify-between">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                            setTempDateFrom('');
                            setTempDateTo('');
                            onDateChange('', '');
                            setIsOpen(false);
                        }}
                    >
                        Clear
                    </Button>
                    <Button 
                        size="sm"
                        onClick={handleApply}
                        disabled={!tempDateFrom || !tempDateTo}
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
