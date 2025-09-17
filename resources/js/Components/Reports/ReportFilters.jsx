import React, { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import DateRangePicker from './DateRangePicker';

export default function ReportFilters({ 
    filters = {}, 
    onFiltersChange, 
    onReset,
    onRefresh,
    availableFilters = {},
    loading = false,
    className = ''
}) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleDateChange = (dateFrom, dateTo) => {
        const newFilters = { ...localFilters, date_from: dateFrom, date_to: dateTo };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const clearFilter = (key) => {
        const newFilters = { ...localFilters };
        delete newFilters[key];
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const getActiveFiltersCount = () => {
        return Object.keys(localFilters).filter(key => 
            localFilters[key] && localFilters[key] !== ''
        ).length;
    };

    const renderFilterBadges = () => {
        const activeFilters = Object.entries(localFilters).filter(([key, value]) => 
            value && value !== ''
        );

        if (activeFilters.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map(([key, value]) => (
                    <Badge 
                        key={key} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                    >
                        <span className="capitalize">
                            {key.replace('_', ' ')}: {value}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => clearFilter(key)}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    </Badge>
                ))}
            </div>
        );
    };

    return (
        <Card className={`border-0 shadow-sm ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Filter className="w-5 h-5" />
                        Filters
                        {getActiveFiltersCount() > 0 && (
                            <Badge variant="default" className="ml-2">
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {renderFilterBadges()}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Filter */}
                    <div>
                        <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="search"
                                placeholder="Search..."
                                value={localFilters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div>
                        <Label className="text-sm font-medium">Date Range</Label>
                        <div className="mt-1">
                            <DateRangePicker
                                dateFrom={localFilters.date_from}
                                dateTo={localFilters.date_to}
                                onDateChange={handleDateChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    {availableFilters.statuses && (
                        <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Select 
                                value={localFilters.status || 'all'} 
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All statuses</SelectItem>
                                    {availableFilters.statuses?.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Category Filter */}
                    {availableFilters.categories && (
                        <div>
                            <Label className="text-sm font-medium">Category</Label>
                            <Select 
                                value={localFilters.category || 'all'} 
                                onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {availableFilters.categories?.map((category) => (
                                        <SelectItem key={category.value} value={category.value}>
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Expanded Filters */}
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Payment Method Filter */}
                            {availableFilters.paymentMethods && (
                                <div>
                                    <Label className="text-sm font-medium">Payment Method</Label>
                                    <Select 
                                        value={localFilters.payment_method || 'all'} 
                                        onValueChange={(value) => handleFilterChange('payment_method', value === 'all' ? '' : value)}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="All methods" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All methods</SelectItem>
                                            {availableFilters.paymentMethods?.map((method) => (
                                                <SelectItem key={method.value} value={method.value}>
                                                    {method.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Amount Range */}
                            <div>
                                <Label className="text-sm font-medium">Min Amount</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={localFilters.min_amount || ''}
                                    onChange={(e) => handleFilterChange('min_amount', e.target.value)}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Max Amount</Label>
                                <Input
                                    type="number"
                                    placeholder="999999.99"
                                    value={localFilters.max_amount || ''}
                                    onChange={(e) => handleFilterChange('max_amount', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <Button 
                        variant="outline" 
                        onClick={onReset}
                        disabled={getActiveFiltersCount() === 0}
                    >
                        Clear All
                    </Button>
                    <Button onClick={() => onFiltersChange(localFilters)}>
                        Apply Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
