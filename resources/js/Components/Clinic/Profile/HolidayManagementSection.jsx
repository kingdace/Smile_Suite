import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Calendar, Plus, Trash2, Edit } from "lucide-react";

export default function HolidayManagementSection({
    initialHolidays = [],
    errors = {},
}) {
    const [holidays, setHolidays] = useState(initialHolidays);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        is_recurring: false,
        description: "",
    });

    const handleAddHoliday = () => {
        if (!formData.name || !formData.date) return;

        const newHoliday = {
            id: Date.now(), // Temporary ID for new holidays
            ...formData,
            is_active: true,
        };

        setHolidays([...holidays, newHoliday]);
        setFormData({
            name: "",
            date: "",
            is_recurring: false,
            description: "",
        });
        setShowAddForm(false);
    };

    const handleEditHoliday = (holiday) => {
        setEditingHoliday(holiday);
        setFormData({
            name: holiday.name,
            date: holiday.date,
            is_recurring: holiday.is_recurring,
            description: holiday.description || "",
        });
        setShowAddForm(true);
    };

    const handleUpdateHoliday = () => {
        if (!formData.name || !formData.date) return;

        setHolidays(
            holidays.map((holiday) =>
                holiday.id === editingHoliday.id
                    ? { ...holiday, ...formData }
                    : holiday
            )
        );

        setFormData({
            name: "",
            date: "",
            is_recurring: false,
            description: "",
        });
        setShowAddForm(false);
        setEditingHoliday(null);
    };

    const handleDeleteHoliday = (holidayId) => {
        setHolidays(holidays.filter((holiday) => holiday.id !== holidayId));
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            date: "",
            is_recurring: false,
            description: "",
        });
        setShowAddForm(false);
        setEditingHoliday(null);
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Holiday Management
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-4">
                            {editingHoliday
                                ? "Edit Holiday"
                                : "Add New Holiday"}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label
                                    htmlFor="holiday_name"
                                    className="text-sm font-medium"
                                >
                                    Holiday Name *
                                </Label>
                                <Input
                                    id="holiday_name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Christmas Day"
                                    required
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="holiday_date"
                                    className="text-sm font-medium"
                                >
                                    Date *
                                </Label>
                                <Input
                                    id="holiday_date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            date: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label
                                    htmlFor="holiday_description"
                                    className="text-sm font-medium"
                                >
                                    Description
                                </Label>
                                <Textarea
                                    id="holiday_description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={2}
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_recurring}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                is_recurring: e.target.checked,
                                            })
                                        }
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium">
                                        Recurring holiday (every year)
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button
                                type="button"
                                onClick={
                                    editingHoliday
                                        ? handleUpdateHoliday
                                        : handleAddHoliday
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {editingHoliday
                                    ? "Update Holiday"
                                    : "Add Holiday"}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCancel}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Add Button */}
                {!showAddForm && (
                    <Button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="w-full md:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Holiday
                    </Button>
                )}

                {/* Holidays List */}
                {holidays.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">
                            Current Holidays
                        </h4>
                        {holidays.map((holiday) => (
                            <div
                                key={holiday.id}
                                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h5 className="font-medium text-gray-900">
                                            {holiday.name}
                                        </h5>
                                        {holiday.is_recurring && (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                Recurring
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {new Date(
                                            holiday.date
                                        ).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    {holiday.description && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            {holiday.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            handleEditHoliday(holiday)
                                        }
                                        size="sm"
                                        variant="outline"
                                        className="h-8 w-8 p-0"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteHoliday(holiday.id)
                                        }
                                        size="sm"
                                        variant="destructive"
                                        className="h-8 w-8 p-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {holidays.length === 0 && !showAddForm && (
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No holidays configured yet.</p>
                        <p className="text-sm">
                            Add holidays to prevent appointments on those dates.
                        </p>
                    </div>
                )}

                {errors.holidays && (
                    <div className="text-red-500 text-sm">
                        {errors.holidays}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

