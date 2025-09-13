import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Clock, Copy } from "lucide-react";
import { useOperatingHours } from "@/hooks/useOperatingHours";

export default function OperatingHoursSection({
    initialOperatingHours = {},
    errors = {},
    onOperatingHoursChange,
}) {
    const {
        operatingDays,
        quickDays,
        quickOpen,
        quickClose,
        validationErrors,
        setQuickDays,
        setQuickOpen,
        setQuickClose,
        handleOperatingDayChange,
        handleQuickApply,
        handleCopyPreviousDay,
        handleSetAll,
        DAYS_OF_WEEK,
    } = useOperatingHours(initialOperatingHours);

    // Update form data whenever operating hours change
    useEffect(() => {
        if (onOperatingHoursChange) {
            const formattedHours = Object.fromEntries(
                Object.entries(operatingDays).map(
                    ([day, { open, close, closed }]) =>
                        closed ? [day, null] : [day, [open, close]]
                )
            );
            onOperatingHoursChange(formattedHours);
        }
    }, [operatingDays]); // Removed onOperatingHoursChange from dependencies

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Operating Hours
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Quick Setup Section */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-3">
                        Quick Setup
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-blue-700">
                            Select days:
                        </span>
                        {DAYS_OF_WEEK.map((day) => (
                            <label
                                key={day.id}
                                className="flex items-center gap-1 text-xs font-medium cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={quickDays.includes(day.id)}
                                    onChange={(e) =>
                                        setQuickDays((qd) =>
                                            e.target.checked
                                                ? [...qd, day.id]
                                                : qd.filter((d) => d !== day.id)
                                        )
                                    }
                                    className="rounded"
                                />
                                {day.label.slice(0, 3)}
                            </label>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                        <input
                            type="time"
                            value={quickOpen}
                            onChange={(e) => setQuickOpen(e.target.value)}
                            className="border border-blue-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Open"
                        />
                        <span className="text-blue-600">-</span>
                        <input
                            type="time"
                            value={quickClose}
                            onChange={(e) => setQuickClose(e.target.value)}
                            className="border border-blue-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Close"
                        />
                        <Button
                            type="button"
                            onClick={handleQuickApply}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Apply to Selected
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSetAll}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Set All
                        </Button>
                    </div>
                </div>

                {/* Operating Hours List */}
                <div className="space-y-2">
                    {DAYS_OF_WEEK.map((day, idx) => (
                        <div
                            key={day.id}
                            className="flex flex-wrap md:flex-nowrap items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 gap-2 hover:bg-blue-50 transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={!operatingDays[day.id].closed}
                                onChange={(e) =>
                                    handleOperatingDayChange(
                                        day.id,
                                        "closed",
                                        !e.target.checked
                                    )
                                }
                                className="rounded scale-110"
                            />
                            <span className="font-semibold text-sm w-20 min-w-[80px]">
                                {day.label}
                            </span>

                            {operatingDays[day.id].closed ? (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                    Closed
                                </span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="time"
                                        value={operatingDays[day.id].open}
                                        onChange={(e) =>
                                            handleOperatingDayChange(
                                                day.id,
                                                "open",
                                                e.target.value
                                            )
                                        }
                                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input
                                        type="time"
                                        value={operatingDays[day.id].close}
                                        onChange={(e) =>
                                            handleOperatingDayChange(
                                                day.id,
                                                "close",
                                                e.target.value
                                            )
                                        }
                                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            )}

                            {idx > 0 && (
                                <Button
                                    type="button"
                                    onClick={() => handleCopyPreviousDay(idx)}
                                    size="sm"
                                    variant="outline"
                                    className="ml-auto p-1 h-8 w-8"
                                    title="Copy previous day's hours"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}

                            {validationErrors[day.id] && (
                                <span className="text-red-500 text-xs font-medium">
                                    {validationErrors[day.id]}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-xs text-gray-500 mt-3">
                    💡 Use Quick Setup to select multiple days and set the same
                    hours for all of them.
                </div>

                {errors.operating_hours && (
                    <div className="text-red-500 text-sm mt-2">
                        {errors.operating_hours}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
