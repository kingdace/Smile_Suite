import React from "react";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Calendar, ChevronDown, Clock } from "lucide-react";

const TimeRangeSelector = ({
    value,
    onChange,
    availableRanges = [],
    loading = false,
}) => {
    // If no available ranges provided, generate current year and next year
    const defaultRanges =
        availableRanges.length > 0
            ? availableRanges
            : [
                  new Date().getFullYear().toString(),
                  (new Date().getFullYear() + 1).toString(),
              ];

    return (
        <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-white">
                <Calendar className="h-4 w-4" />
                <span>Year:</span>
            </div>

            <Select value={value} onValueChange={onChange} disabled={loading}>
                <SelectTrigger className="w-[120px] h-9">
                    <SelectValue placeholder="Select year" />
                    {loading && (
                        <div className="ml-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        </div>
                    )}
                </SelectTrigger>
                <SelectContent>
                    {defaultRanges.map((year) => (
                        <SelectItem key={year} value={year}>
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{year}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default TimeRangeSelector;
