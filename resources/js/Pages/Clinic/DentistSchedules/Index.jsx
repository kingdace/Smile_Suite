import { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Plus,
    Calendar,
    CalendarClock,
    List,
    Clock,
    User,
    Settings,
    Copy,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    AlertTriangle,
} from "lucide-react";

const WORKING_DAYS = [
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
    { value: 0, label: "Sunday" },
];

const SCHEDULE_TEMPLATES = [
    {
        id: "standard_week",
        name: "Standard Week (Mon-Fri)",
        description: "9 AM - 5 PM, Monday to Friday",
        schedule: [
            { day: 1, start: "09:00", end: "17:00" },
            { day: 2, start: "09:00", end: "17:00" },
            { day: 3, start: "09:00", end: "17:00" },
            { day: 4, start: "09:00", end: "17:00" },
            { day: 5, start: "09:00", end: "17:00" },
        ],
    },
    {
        id: "extended_hours",
        name: "Extended Hours (Mon-Sat)",
        description: "8 AM - 6 PM, Monday to Saturday",
        schedule: [
            { day: 1, start: "08:00", end: "18:00" },
            { day: 2, start: "08:00", end: "18:00" },
            { day: 3, start: "08:00", end: "18:00" },
            { day: 4, start: "08:00", end: "18:00" },
            { day: 5, start: "08:00", end: "18:00" },
            { day: 6, start: "09:00", end: "14:00" },
        ],
    },
];

export default function Index({ auth, clinic, schedules, dentists }) {
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [activeTab, setActiveTab] = useState("list");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [unifiedScheduleInfo, setUnifiedScheduleInfo] = useState(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        buffer_time: 15,
        slot_duration: 30,
        is_available: true,
        schedule_type: "weekly",
        notes: "",
    });

    const dentistSchedules = selectedDentist
        ? schedules[selectedDentist] || []
        : [];

    const handleDentistSelect = (dentistId) => {
        setSelectedDentist(dentistId);
        const dentist = dentists.find((d) => d.id.toString() === dentistId);
        if (dentist) {
            toast.success(`Viewing schedules for ${dentist.name}`);
            loadUnifiedScheduleInfo(dentistId);
        }
    };

    const loadUnifiedScheduleInfo = async (dentistId) => {
        setIsLoadingInfo(true);
        try {
            const response = await fetch(
                route("clinic.dentist-schedules.unified-info", {
                    clinic: clinic.id,
                    dentist_id: dentistId,
                })
            );
            const data = await response.json();
            if (data.success) {
                setUnifiedScheduleInfo(data.info);
            }
        } catch (error) {
            console.error("Error loading unified schedule info:", error);
        } finally {
            setIsLoadingInfo(false);
        }
    };

    const handleSyncProfileToSchedule = async () => {
        if (!selectedDentist) return;

        try {
            const response = await fetch(
                route("clinic.dentist-schedules.sync-profile", {
                    clinic: clinic.id,
                }),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                    body: JSON.stringify({
                        dentist_id: selectedDentist,
                    }),
                }
            );

            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                // Reload the page to show updated schedules
                window.location.reload();
            } else {
                toast.error(
                    data.message || "Failed to sync profile to schedule"
                );
            }
        } catch (error) {
            console.error("Error syncing profile to schedule:", error);
            toast.error("Failed to sync profile to schedule");
        }
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setIsTemplateDialogOpen(true);
    };

    const applyTemplate = () => {
        if (!selectedTemplate || !selectedDentist) return;

        const templateData = {
            template_key: selectedTemplate.id,
            dentist_ids: [selectedDentist],
        };

        post(
            route("clinic.dentist-schedules.create-from-template", {
                clinic: clinic.id,
            }),
            {
                data: templateData,
                onSuccess: () => {
                    toast.success(
                        `Applied ${selectedTemplate.name} template successfully`
                    );
                    setIsTemplateDialogOpen(false);
                    setSelectedTemplate(null);
                },
                onError: (errors) => {
                    Object.values(errors).forEach((error) =>
                        toast.error(error)
                    );
                },
            }
        );
    };

    const handleSubmit = () => {
        if (editingSchedule) {
            put(
                route("clinic.dentist-schedules.update", {
                    clinic: clinic.id,
                    schedule: editingSchedule.id,
                }),
                {
                    onSuccess: () => {
                        toast.success("Schedule updated successfully");
                        reset();
                        setEditingSchedule(null);
                        setIsDialogOpen(false);
                    },
                    onError: (errors) => {
                        Object.values(errors).forEach((error) =>
                            toast.error(error)
                        );
                    },
                }
            );
        } else {
            post(
                route("clinic.dentist-schedules.store", { clinic: clinic.id }),
                {
                    onSuccess: () => {
                        toast.success("Schedule created successfully");
                        reset();
                        setIsDialogOpen(false);
                    },
                    onError: (errors) => {
                        Object.values(errors).forEach((error) =>
                            toast.error(error)
                        );
                    },
                }
            );
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setData({
            user_id: schedule.user_id.toString(),
            day_of_week: schedule.day_of_week?.toString() || "",
            start_time: schedule.start_time.substring(0, 5),
            end_time: schedule.end_time.substring(0, 5),
            buffer_time: schedule.buffer_time || 15,
            slot_duration: schedule.slot_duration || 30,
            is_available: schedule.is_available,
            schedule_type: schedule.schedule_type || "weekly",
            notes: schedule.notes || "",
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (schedule) => {
        if (confirm("Are you sure you want to delete this schedule?")) {
            router.delete(
                route("clinic.dentist-schedules.destroy", {
                    clinic: clinic.id,
                    schedule: schedule.id,
                }),
                {
                    onSuccess: () => {
                        toast.success("Schedule deleted successfully");
                    },
                    onError: () => {
                        toast.error("Failed to delete schedule");
                    },
                }
            );
        }
    };

    const getDayName = (dayNumber) => {
        // Convert to number if it's a string
        const dayNum = parseInt(dayNumber);
        const foundDay = WORKING_DAYS.find((day) => day.value === dayNum);
        return foundDay?.label || "Unknown";
    };

    const formatTime = (timeString) => {
        // Handle both datetime strings and time strings
        if (timeString.includes("T")) {
            // It's a datetime string, extract just the time
            return timeString.split("T")[1].substring(0, 5);
        }
        // It's already a time string, return as is
        return timeString.substring(0, 5);
    };

    const getStatusIcon = (isAvailable) => {
        return isAvailable ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
            <XCircle className="h-4 w-4 text-red-500" />
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Dentist Schedule Management" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Enhanced Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg">
                                    <CalendarClock className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900">
                                        Dentist Schedule Management
                                    </h1>
                                    <p className="text-gray-600 mt-2 text-lg">
                                        Manage dentist availability and time
                                        slots
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() => {
                                        setSelectedTemplate(null); // Reset template selection
                                        setIsTemplateDialogOpen(true);
                                    }}
                                    variant="outline"
                                    className="px-6 py-3 bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm"
                                >
                                    <Settings className="h-4 w-4 mr-2" />
                                    Templates
                                </Button>
                                <Button
                                    onClick={() => setIsDialogOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add Schedule
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Dentist Selection */}
                    <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <User className="h-6 w-6 text-indigo-600" />
                                Select Dentist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {dentists.map((dentist) => (
                                    <Button
                                        key={dentist.id}
                                        variant={
                                            selectedDentist ===
                                            dentist.id.toString()
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            handleDentistSelect(
                                                dentist.id.toString()
                                            )
                                        }
                                        className={`flex flex-col items-center gap-3 h-auto py-6 px-4 transition-all duration-300 ${
                                            selectedDentist ===
                                            dentist.id.toString()
                                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105"
                                                : "bg-white border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50"
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded-full ${
                                                selectedDentist ===
                                                dentist.id.toString()
                                                    ? "bg-white/20"
                                                    : "bg-indigo-100"
                                            }`}
                                        >
                                            <User
                                                className={`h-5 w-5 ${
                                                    selectedDentist ===
                                                    dentist.id.toString()
                                                        ? "text-white"
                                                        : "text-indigo-600"
                                                }`}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <span className="font-semibold text-sm">
                                                {dentist.name}
                                            </span>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    selectedDentist ===
                                                    dentist.id.toString()
                                                        ? "text-white/80"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {dentist.email}
                                            </p>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Unified Schedule Information */}
                    {selectedDentist && unifiedScheduleInfo && (
                        <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <Settings className="h-5 w-5 text-blue-600" />
                                    Schedule System Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div
                                            className={`p-2 rounded-full ${
                                                unifiedScheduleInfo.has_advanced_schedules
                                                    ? "bg-green-100"
                                                    : "bg-yellow-100"
                                            }`}
                                        >
                                            <Calendar
                                                className={`h-4 w-4 ${
                                                    unifiedScheduleInfo.has_advanced_schedules
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                Advanced Schedules
                                            </p>
                                            <p
                                                className={`text-xs ${
                                                    unifiedScheduleInfo.has_advanced_schedules
                                                        ? "text-green-600"
                                                        : "text-yellow-600"
                                                }`}
                                            >
                                                {unifiedScheduleInfo.has_advanced_schedules
                                                    ? "Active"
                                                    : "Not configured"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div
                                            className={`p-2 rounded-full ${
                                                unifiedScheduleInfo.has_profile_hours
                                                    ? "bg-blue-100"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            <User
                                                className={`h-4 w-4 ${
                                                    unifiedScheduleInfo.has_profile_hours
                                                        ? "text-blue-600"
                                                        : "text-gray-400"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                Profile Hours
                                            </p>
                                            <p
                                                className={`text-xs ${
                                                    unifiedScheduleInfo.has_profile_hours
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {unifiedScheduleInfo.has_profile_hours
                                                    ? "Configured"
                                                    : "Not set"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                                        <div
                                            className={`p-2 rounded-full ${
                                                unifiedScheduleInfo.is_active
                                                    ? "bg-green-100"
                                                    : "bg-red-100"
                                            }`}
                                        >
                                            <CheckCircle
                                                className={`h-4 w-4 ${
                                                    unifiedScheduleInfo.is_active
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">
                                                Account Status
                                            </p>
                                            <p
                                                className={`text-xs ${
                                                    unifiedScheduleInfo.is_active
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {unifiedScheduleInfo.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Sync Action */}
                                {unifiedScheduleInfo.has_profile_hours &&
                                    !unifiedScheduleInfo.has_advanced_schedules && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                                    <div>
                                                        <p className="font-medium text-yellow-800">
                                                            Profile Hours
                                                            Available
                                                        </p>
                                                        <p className="text-sm text-yellow-700">
                                                            This dentist has
                                                            working hours set in
                                                            their profile but no
                                                            advanced schedules
                                                            configured.
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={
                                                        handleSyncProfileToSchedule
                                                    }
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                                    size="sm"
                                                >
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Sync to Advanced Schedule
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                {/* Current Schedule Source */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <strong>
                                            Current Schedule Source:
                                        </strong>{" "}
                                        {unifiedScheduleInfo.schedule_source ===
                                        "advanced"
                                            ? "Advanced Schedule Management"
                                            : "Profile Working Hours"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Content */}
                    <Tabs>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                                active={activeTab === "list"}
                                onClick={() => setActiveTab("list")}
                            >
                                List View
                            </TabsTrigger>
                            <TabsTrigger
                                active={activeTab === "templates"}
                                onClick={() => setActiveTab("templates")}
                            >
                                Templates
                            </TabsTrigger>
                        </TabsList>

                        {activeTab === "list" && (
                            <TabsContent className="space-y-4">
                                {selectedDentist ? (
                                    <div className="space-y-6">
                                        {/* Enhanced Schedule Display */}
                                        <Card className="border-0 shadow-lg">
                                            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="flex items-center gap-3 text-xl">
                                                        <Calendar className="h-6 w-6 text-indigo-600" />
                                                        Advanced Schedules for{" "}
                                                        <span className="text-indigo-600">
                                                            {
                                                                dentists.find(
                                                                    (d) =>
                                                                        d.id.toString() ===
                                                                        selectedDentist
                                                                )?.name
                                                            }
                                                        </span>
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            onClick={() =>
                                                                setIsDialogOpen(
                                                                    true
                                                                )
                                                            }
                                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                                        >
                                                            <Plus className="h-4 w-4 mr-2" />
                                                            Add Schedule
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                {dentistSchedules.length ===
                                                0 ? (
                                                    <div className="text-center py-12">
                                                        <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                            <Clock className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                            No Advanced
                                                            Schedules
                                                        </h3>
                                                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                            This dentist doesn't
                                                            have any advanced
                                                            schedules configured
                                                            yet. You can add
                                                            schedules manually
                                                            or sync from their
                                                            profile.
                                                        </p>
                                                        <div className="flex items-center justify-center gap-3">
                                                            <Button
                                                                onClick={() =>
                                                                    setIsDialogOpen(
                                                                        true
                                                                    )
                                                                }
                                                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Add Schedule
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        {/* Schedule Source Info */}
                                                        {unifiedScheduleInfo?.schedule_source ===
                                                            "advanced" && (
                                                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                <div className="flex items-center gap-2">
                                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                                    <span className="text-sm text-green-700 font-medium">
                                                                        Using
                                                                        Advanced
                                                                        Schedule
                                                                        Management
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Enhanced Schedule Cards */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {dentistSchedules.map(
                                                                (schedule) => (
                                                                    <div
                                                                        key={
                                                                            schedule.id
                                                                        }
                                                                        className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                                                                            schedule.is_available
                                                                                ? "border-green-200 bg-green-50"
                                                                                : "border-red-200 bg-red-50"
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-start justify-between mb-3">
                                                                            <div className="flex items-center gap-3">
                                                                                {getStatusIcon(
                                                                                    schedule.is_available
                                                                                )}
                                                                                <div>
                                                                                    <h3 className="font-semibold text-gray-900">
                                                                                        {getDayName(
                                                                                            schedule.day_of_week
                                                                                        )}
                                                                                    </h3>
                                                                                    <p className="text-sm text-gray-600">
                                                                                        {schedule.schedule_type ===
                                                                                        "weekly"
                                                                                            ? "Weekly Schedule"
                                                                                            : "Exception"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <Badge
                                                                                variant={
                                                                                    schedule.is_available
                                                                                        ? "default"
                                                                                        : "secondary"
                                                                                }
                                                                                className={
                                                                                    schedule.is_available
                                                                                        ? "bg-green-100 text-green-800"
                                                                                        : "bg-red-100 text-red-800"
                                                                                }
                                                                            >
                                                                                {schedule.is_available
                                                                                    ? "Available"
                                                                                    : "Unavailable"}
                                                                            </Badge>
                                                                        </div>

                                                                        <div className="space-y-2 mb-4">
                                                                            <div className="flex items-center gap-2 text-sm">
                                                                                <Clock className="h-4 w-4 text-gray-500" />
                                                                                <span className="font-medium text-gray-700">
                                                                                    {formatTime(
                                                                                        schedule.start_time
                                                                                    )}{" "}
                                                                                    -{" "}
                                                                                    {formatTime(
                                                                                        schedule.end_time
                                                                                    )}
                                                                                </span>
                                                                            </div>

                                                                            {schedule.buffer_time && (
                                                                                <div className="flex items-center gap-2 text-sm">
                                                                                    <Settings className="h-4 w-4 text-gray-500" />
                                                                                    <span className="text-gray-600">
                                                                                        Buffer:{" "}
                                                                                        {
                                                                                            schedule.buffer_time
                                                                                        }{" "}
                                                                                        min
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {schedule.slot_duration && (
                                                                                <div className="flex items-center gap-2 text-sm">
                                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                                    <span className="text-gray-600">
                                                                                        Slot
                                                                                        Duration:{" "}
                                                                                        {
                                                                                            schedule.slot_duration
                                                                                        }{" "}
                                                                                        min
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {schedule.notes && (
                                                                                <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                                                                                    <strong>
                                                                                        Notes:
                                                                                    </strong>{" "}
                                                                                    {
                                                                                        schedule.notes
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleEdit(
                                                                                        schedule
                                                                                    )
                                                                                }
                                                                                className="flex-1"
                                                                            >
                                                                                <Edit className="h-4 w-4 mr-1" />
                                                                                Edit
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        schedule
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>

                                        {/* Profile Hours Comparison */}
                                        {unifiedScheduleInfo?.has_profile_hours && (
                                            <Card className="border-0 shadow-lg bg-blue-50">
                                                <CardHeader>
                                                    <CardTitle className="flex items-center gap-3 text-lg text-blue-800">
                                                        <User className="h-5 w-5" />
                                                        Profile Working Hours
                                                        (Reference)
                                                    </CardTitle>
                                                    <p className="text-sm text-blue-600">
                                                        These are the hours set
                                                        in the dentist's profile
                                                    </p>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {Object.entries(
                                                            unifiedScheduleInfo.profile_working_hours
                                                        ).map(
                                                            ([day, hours]) => (
                                                                <div
                                                                    key={day}
                                                                    className={`p-3 rounded-lg border ${
                                                                        hours
                                                                            ? "bg-white border-blue-200"
                                                                            : "bg-gray-100 border-gray-200"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="font-medium text-sm capitalize text-gray-700">
                                                                            {
                                                                                day
                                                                            }
                                                                        </span>
                                                                        {hours ? (
                                                                            <span className="text-xs text-blue-600 font-medium">
                                                                                {
                                                                                    hours.start
                                                                                }{" "}
                                                                                -{" "}
                                                                                {
                                                                                    hours.end
                                                                                }
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-xs text-gray-500">
                                                                                Off
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                ) : (
                                    <Card>
                                        <CardContent className="text-center py-12">
                                            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                                <User className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                Select a Dentist
                                            </h3>
                                            <p className="text-gray-500">
                                                Choose a dentist from the list
                                                above to view their schedules
                                            </p>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>
                        )}

                        {activeTab === "templates" && (
                            <TabsContent className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="h-5 w-5 text-indigo-600" />
                                            Schedule Templates
                                        </CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Pre-configured schedule templates
                                            for quick setup. Select a template
                                            to apply to a dentist's schedule.
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        {!selectedDentist ? (
                                            <div className="text-center py-8">
                                                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                    <User className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                    Select a Dentist First
                                                </h3>
                                                <p className="text-gray-500 mb-4">
                                                    Choose a dentist from the
                                                    list above to apply
                                                    templates to their schedule.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                        <span className="font-medium text-blue-900">
                                                            Applying to:{" "}
                                                            {
                                                                dentists.find(
                                                                    (d) =>
                                                                        d.id.toString() ===
                                                                        selectedDentist
                                                                )?.name
                                                            }
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-blue-700">
                                                        Select a template below
                                                        to quickly set up this
                                                        dentist's schedule.
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {SCHEDULE_TEMPLATES.map(
                                                        (template) => (
                                                            <Card
                                                                key={
                                                                    template.id
                                                                }
                                                                className="hover:shadow-md transition-shadow border-2 hover:border-indigo-200"
                                                            >
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <div>
                                                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                                                {
                                                                                    template.name
                                                                                }
                                                                            </h3>
                                                                            <p className="text-sm text-gray-600">
                                                                                {
                                                                                    template.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div className="p-2 bg-indigo-100 rounded-full">
                                                                            <Calendar className="h-4 w-4 text-indigo-600" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2 mb-4">
                                                                        <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                                                                            Schedule
                                                                            Details:
                                                                        </h4>
                                                                        <div className="space-y-1">
                                                                            {template.schedule.map(
                                                                                (
                                                                                    day,
                                                                                    index
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="text-xs text-gray-600 flex items-center gap-2"
                                                                                    >
                                                                                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                                                                        <span className="font-medium">
                                                                                            {getDayName(
                                                                                                day.day
                                                                                            )}

                                                                                            :
                                                                                        </span>
                                                                                        <span>
                                                                                            {
                                                                                                day.start
                                                                                            }{" "}
                                                                                            -{" "}
                                                                                            {
                                                                                                day.end
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <Button
                                                                        onClick={() =>
                                                                            handleTemplateSelect(
                                                                                template
                                                                            )
                                                                        }
                                                                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                                                                        size="sm"
                                                                    >
                                                                        <Settings className="h-4 w-4 mr-2" />
                                                                        Apply
                                                                        Template
                                                                    </Button>
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}
                    </Tabs>
                </div>
            </div>

            {/* Template Dialog */}
            <Dialog
                open={isTemplateDialogOpen}
                onOpenChange={setIsTemplateDialogOpen}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Apply Schedule Template</DialogTitle>
                        <DialogDescription>
                            {selectedTemplate ? (
                                <>
                                    Apply the{" "}
                                    <strong>{selectedTemplate.name}</strong>{" "}
                                    template to{" "}
                                    {selectedDentist ? (
                                        <strong>
                                            {
                                                dentists.find(
                                                    (d) =>
                                                        d.id.toString() ===
                                                        selectedDentist
                                                )?.name
                                            }
                                        </strong>
                                    ) : (
                                        "the selected dentist"
                                    )}
                                    . This will create schedules for all days
                                    defined in the template.
                                </>
                            ) : (
                                "Select a template to apply to the dentist's schedule."
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {!selectedTemplate ? (
                        // Template Selection Interface
                        <div className="space-y-4">
                            {!selectedDentist ? (
                                <div className="text-center py-8">
                                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                        <User className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                        Select a Dentist First
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        Please select a dentist from the main
                                        page before applying templates.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setIsTemplateDialogOpen(false)
                                        }
                                    >
                                        Close
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-blue-600" />
                                            <span className="font-medium text-blue-900">
                                                Applying to:{" "}
                                                {
                                                    dentists.find(
                                                        (d) =>
                                                            d.id.toString() ===
                                                            selectedDentist
                                                    )?.name
                                                }
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-700">
                                            Choose a template below to quickly
                                            set up this dentist's schedule.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {SCHEDULE_TEMPLATES.map((template) => (
                                            <Card
                                                key={template.id}
                                                className="hover:shadow-md transition-shadow border-2 hover:border-indigo-200 cursor-pointer"
                                                onClick={() =>
                                                    setSelectedTemplate(
                                                        template
                                                    )
                                                }
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                                {template.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    template.description
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="p-2 bg-indigo-100 rounded-full">
                                                            <Calendar className="h-4 w-4 text-indigo-600" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mb-4">
                                                        <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                                                            Schedule Details:
                                                        </h4>
                                                        <div className="space-y-1">
                                                            {template.schedule.map(
                                                                (
                                                                    day,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="text-xs text-gray-600 flex items-center gap-2"
                                                                    >
                                                                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                                                        <span className="font-medium">
                                                                            {getDayName(
                                                                                day.day
                                                                            )}
                                                                            :
                                                                        </span>
                                                                        <span>
                                                                            {
                                                                                day.start
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                day.end
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTemplate(
                                                                template
                                                            );
                                                        }}
                                                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                                                        size="sm"
                                                    >
                                                        <Settings className="h-4 w-4 mr-2" />
                                                        Select This Template
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsTemplateDialogOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        // Template Confirmation Interface
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-medium text-sm text-gray-900 mb-2">
                                    Template Details:
                                </h4>
                                <div className="space-y-1">
                                    {selectedTemplate.schedule.map(
                                        (day, index) => (
                                            <div
                                                key={index}
                                                className="text-sm text-gray-600"
                                            >
                                                {getDayName(day.day)}:{" "}
                                                {day.start} - {day.end}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedTemplate(null);
                                    }}
                                >
                                    Back to Templates
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsTemplateDialogOpen(false);
                                        setSelectedTemplate(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={applyTemplate}
                                    disabled={!selectedDentist || processing}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {processing
                                        ? "Applying..."
                                        : "Apply Template"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Schedule Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingSchedule
                                ? "Edit Schedule"
                                : "Create Schedule"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSchedule
                                ? "Update the schedule details for the selected dentist."
                                : "Create a new schedule entry for the selected dentist."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Dentist</Label>
                            <Select
                                value={data.user_id}
                                onValueChange={(value) =>
                                    setData("user_id", value)
                                }
                                disabled={editingSchedule !== null}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select dentist" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dentists.map((dentist) => (
                                        <SelectItem
                                            key={dentist.id}
                                            value={dentist.id.toString()}
                                        >
                                            {dentist.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Day of Week</Label>
                            <Select
                                value={data.day_of_week}
                                onValueChange={(value) =>
                                    setData("day_of_week", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                    {WORKING_DAYS.map((day) => (
                                        <SelectItem
                                            key={day.value}
                                            value={day.value.toString()}
                                        >
                                            {day.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Time</Label>
                                <Input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) =>
                                        setData("start_time", e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Time</Label>
                                <Input
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) =>
                                        setData("end_time", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={data.is_available}
                                onCheckedChange={(checked) =>
                                    setData("is_available", checked)
                                }
                            />
                            <Label>Available for appointments</Label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    reset();
                                    setEditingSchedule(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={processing}
                            >
                                {processing
                                    ? "Saving..."
                                    : editingSchedule
                                    ? "Update"
                                    : "Create"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
