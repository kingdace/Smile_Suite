import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { useToast } from "@/Components/ui/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Calendar, Plus, Trash2, Edit } from "lucide-react";

export default function HolidayManagementSection({
    clinicId,
    initialHolidays = [],
    errors = {},
    showSuccess: showSuccessProp,
    showError: showErrorProp,
}) {
    const [holidays, setHolidays] = useState(initialHolidays);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [showDeleteId, setShowDeleteId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        is_recurring: false,
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const { showSuccess: showSuccessHook, showError: showErrorHook } =
        useToast();
    const showSuccess = showSuccessProp || showSuccessHook;
    const showError = showErrorProp || showErrorHook;

    // Derived statistics and displays
    const totalCount = holidays.length;
    const recurringCount = holidays.filter((h) => h.is_recurring).length;
    const inactiveCount = holidays.filter((h) => h.is_active === false).length;
    const nextUpcoming = (() => {
        const today = new Date();
        const future = holidays
            .filter((h) => h.is_active !== false)
            .map((h) => ({ ...h, _date: new Date(h.date) }))
            .filter((h) => !isNaN(h._date))
            .filter((h) => h._date >= new Date(today.toDateString()))
            .sort((a, b) => a._date - b._date)[0];
        if (!future) return null;
        try {
            return new Date(future.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (e) {
            return future.date;
        }
    })();

    const handleAddHoliday = async () => {
        if (!formData.name || !formData.date || !clinicId) return;
        setLoading(true);
        try {
            await router.post(
                route("clinic.holidays.store", clinicId),
                formData,
                {
                    preserveState: true,
                    onSuccess: (page) => {
                        // Optimistic: append last created from response if available
                        const response = page?.props?.flash?.holiday || null;
                        setHolidays((prev) => [
                            ...prev,
                            response || {
                                id: Date.now(),
                                ...formData,
                                is_active: true,
                            },
                        ]);
                        showSuccess(
                            "Holiday added",
                            "The holiday has been saved."
                        );
                        setFormData({
                            name: "",
                            date: "",
                            is_recurring: false,
                            description: "",
                        });
                        setShowAddForm(false);
                    },
                    onError: () =>
                        showError("Failed", "Could not add holiday."),
                    onFinish: () => setLoading(false),
                }
            );
        } catch (e) {
            setLoading(false);
        }
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

    const handleUpdateHoliday = async () => {
        if (!formData.name || !formData.date || !clinicId || !editingHoliday)
            return;
        setLoading(true);
        try {
            await router.put(
                route("clinic.holidays.update", [clinicId, editingHoliday.id]),
                formData,
                {
                    preserveState: true,
                    onSuccess: () => {
                        setHolidays((prev) =>
                            prev.map((h) =>
                                h.id === editingHoliday.id
                                    ? { ...h, ...formData }
                                    : h
                            )
                        );
                        showSuccess(
                            "Holiday updated",
                            "Changes have been saved."
                        );
                        setFormData({
                            name: "",
                            date: "",
                            is_recurring: false,
                            description: "",
                        });
                        setShowAddForm(false);
                        setEditingHoliday(null);
                    },
                    onError: () =>
                        showError("Failed", "Could not update holiday."),
                    onFinish: () => setLoading(false),
                }
            );
        } catch (e) {
            setLoading(false);
        }
    };

    const handleDeleteHoliday = async (holidayId) => {
        if (!clinicId || !holidayId) return;
        setLoading(true);
        try {
            await router.delete(
                route("clinic.holidays.destroy", [clinicId, holidayId]),
                {
                    preserveState: true,
                    onSuccess: () => {
                        setHolidays((prev) =>
                            prev.filter((h) => h.id !== holidayId)
                        );
                        showSuccess(
                            "Holiday deleted",
                            "The holiday was removed."
                        );
                        setShowDeleteId(null);
                    },
                    onError: () =>
                        showError("Failed", "Could not delete holiday."),
                    onFinish: () => setLoading(false),
                }
            );
        } catch (e) {
            setLoading(false);
        }
    };

    const openDeleteConfirmation = (holidayId) => setShowDeleteId(holidayId);
    const closeDeleteConfirmation = () => setShowDeleteId(null);

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
        <div className="space-y-6">
            <div className="space-y-6">
                {/* Header and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            Holidays
                            {totalCount > 0 && (
                                <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    {totalCount} total
                                </span>
                            )}
                        </h4>
                        {totalCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                                    Recurring: {recurringCount}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200">
                                    Inactive: {inactiveCount}
                                </span>
                                {nextUpcoming && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        Next: {nextUpcoming}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {!showAddForm && (
                        <Button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="md:w-auto"
                            disabled={loading}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Holiday
                        </Button>
                    )}
                </div>
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

                {/* Old inline Add button removed in favor of header action */}

                {/* Holidays List */}
                {holidays.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-800">
                                Current Holidays
                            </h4>
                            <span className="text-xs text-gray-500">
                                {holidays.length}{" "}
                                {holidays.length === 1 ? "entry" : "entries"}
                            </span>
                        </div>
                        {holidays.map((holiday) => {
                            const formatted = new Date(
                                holiday.date
                            ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            });
                            return (
                                <div
                                    key={holiday.id}
                                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h5 className="font-semibold text-gray-900 truncate">
                                                {holiday.name}
                                            </h5>
                                            {holiday.is_recurring && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                    Recurs yearly
                                                </span>
                                            )}
                                            {holiday.is_active === false && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatted}
                                        </div>
                                        {holiday.description && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {holiday.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleEditHoliday(holiday)
                                            }
                                            size="sm"
                                            variant="outline"
                                            className="h-8 px-2"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                openDeleteConfirmation(
                                                    holiday.id
                                                )
                                            }
                                            size="sm"
                                            variant="destructive"
                                            className="h-8 px-2"
                                            disabled={loading}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {holidays.length === 0 && !showAddForm && (
                    <div className="flex flex-col items-center justify-center text-center py-16 rounded-xl border border-dashed border-gray-200 bg-gradient-to-b from-white to-gray-50">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Calendar className="h-8 w-8 text-gray-400" />
                        </div>
                        <h4 className="text-gray-800 font-semibold mb-1">
                            No holidays configured yet
                        </h4>
                        <p className="text-sm text-gray-600 max-w-md mb-6">
                            Add holidays to automatically block bookings on
                            those dates for this clinic. You can set one-time or
                            recurring holidays.
                        </p>
                        <Button
                            type="button"
                            onClick={() => setShowAddForm(true)}
                            className="px-5"
                            disabled={loading}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Holiday
                        </Button>
                    </div>
                )}

                {errors.holidays && (
                    <div className="text-red-500 text-sm">
                        {errors.holidays}
                    </div>
                )}
            </div>
            {/* Delete Confirmation Modal */}
            {showDeleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Delete Holiday
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this holiday? This
                            action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                onClick={closeDeleteConfirmation}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() =>
                                    handleDeleteHoliday(showDeleteId)
                                }
                                variant="destructive"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
