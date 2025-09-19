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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isLoadingInfo, setIsLoadingInfo] = useState(false);
    const [dentistInfo, setDentistInfo] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [activeTab, setActiveTab] = useState("list");
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [unifiedScheduleInfo, setUnifiedScheduleInfo] = useState(null);
    const [isQuickSetup, setIsQuickSetup] = useState(false);
    const [selectedDays, setSelectedDays] = useState([]);
    const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

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
        allow_overlap: false,
        max_appointments_per_day: null,
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
                // Refresh data while preserving selected dentist
                router.reload({ only: ['schedules'] });
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
        if (!selectedDentist) {
            toast.error("Please select a dentist first before applying a template");
            return;
        }
        setSelectedTemplate(template);
        setIsTemplateDialogOpen(true);
    };

    const applyTemplate = () => {
        if (!selectedTemplate) {
            toast.error("Please select a template first");
            return;
        }
        
        if (!selectedDentist) {
            toast.error("Please select a dentist first");
            return;
        }

        const templateData = {
            template_key: selectedTemplate.id,
            dentist_ids: [parseInt(selectedDentist)],
        };

        setIsApplyingTemplate(true);
        
        // Use fetch instead of Inertia post for better error handling
        fetch(route("clinic.dentist-schedules.create-from-template", { clinic: clinic.id }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
            body: JSON.stringify(templateData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast.success(data.message || `Applied ${selectedTemplate.name} template successfully`);
                setIsTemplateDialogOpen(false);
                setSelectedTemplate(null);
                // Refresh data while preserving selected dentist
                router.reload({ only: ['schedules'] });
            } else {
                toast.error(data.message || "Failed to apply template");
            }
            setIsApplyingTemplate(false);
        })
        .catch(error => {
            console.error('Template application error:', error);
            toast.error("Failed to apply template. Please try again.");
            setIsApplyingTemplate(false);
        });
    };

    const handleSubmit = () => {
        console.log('🚀 handleSubmit called!');
        console.log('Current state:', { 
            isQuickSetup, 
            selectedDays, 
            editingSchedule, 
            isCreating, 
            isUpdating, 
            processing,
            data 
        });
        
        // Basic form validation
        if (!data.user_id) {
            toast.error("Please select a dentist");
            return;
        }
        
        // Validate days selection
        if (isQuickSetup && !editingSchedule) {
            if (selectedDays.length === 0) {
                toast.error("Please select at least one day");
                return;
            }
        } else {
            if (!data.day_of_week && data.day_of_week !== 0) {
                toast.error("Please select a day of the week");
                return;
            }
        }
        
        if (!data.start_time || !data.end_time) {
            toast.error("Please set both start and end times");
            return;
        }
        if (data.start_time >= data.end_time) {
            toast.error("End time must be after start time");
            return;
        }

        if (editingSchedule) {
            setIsUpdating(true);
            
            // Validate time format before sending
            if (!data.start_time || !data.end_time) {
                toast.error("Please set both start and end times");
                setIsUpdating(false);
                return;
            }
            
            // Transform data for update (exclude user_id since it shouldn't change)
            const transformedData = {
                day_of_week: parseInt(data.day_of_week),
                start_time: data.start_time,
                end_time: data.end_time,
                buffer_time: parseInt(data.buffer_time) || 15,
                slot_duration: parseInt(data.slot_duration) || 30,
                is_available: Boolean(data.is_available),
                schedule_type: data.schedule_type || "weekly",
                notes: data.notes || "",
                allow_overlap: Boolean(data.allow_overlap),
                max_appointments_per_day: data.max_appointments_per_day ? parseInt(data.max_appointments_per_day) : null,
            };
            
            console.log('Update data being sent:', transformedData);
            
            // Use fetch method like CREATE
            fetch(route("clinic.dentist-schedules.update", {
                clinic: clinic.id,
                schedule: editingSchedule.id,
            }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    ...transformedData,
                    _method: 'PUT'
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(JSON.stringify(errorData));
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    toast.success(data.message || "Schedule updated successfully");
                    reset();
                    setEditingSchedule(null);
                    setIsDialogOpen(false);
                    setIsUpdating(false);
                    // Refresh data while preserving selected dentist
                    router.reload({ only: ['schedules'] });
                } else {
                    toast.error(data.message || "Failed to update schedule");
                    setIsUpdating(false);
                }
            })
            .catch(error => {
                console.error('Update error:', error);
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.errors) {
                        // Show specific validation errors
                        Object.values(errorData.errors).flat().forEach(errorMsg => {
                            toast.error(errorMsg);
                        });
                    } else {
                        toast.error(errorData.message || "Failed to update schedule");
                    }
                } catch {
                    toast.error("Failed to update schedule. Please try again.");
                }
                setIsUpdating(false);
            });
        } else {
            setIsCreating(true);
            
            // Handle Quick Setup (multiple days)
            if (isQuickSetup && selectedDays.length > 0) {
                console.log('Starting Quick Setup for days:', selectedDays);
                console.log('Base data:', data);
                
                const promises = selectedDays.map(dayValue => {
                    // Transform data for each day (same as single day)
                    const scheduleData = {
                        ...data,
                        user_id: parseInt(data.user_id),
                        day_of_week: parseInt(dayValue),
                        buffer_time: parseInt(data.buffer_time) || 15,
                        slot_duration: parseInt(data.slot_duration) || 30,
                        is_available: Boolean(data.is_available),
                        allow_overlap: Boolean(data.allow_overlap),
                        max_appointments_per_day: data.max_appointments_per_day ? parseInt(data.max_appointments_per_day) : null,
                    };
                    
                    console.log(`Creating schedule for day ${dayValue}:`, scheduleData);
                    
                    return fetch(route("clinic.dentist-schedules.store", { clinic: clinic.id }), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                        body: JSON.stringify(scheduleData)
                    }).then(response => {
                        console.log(`Response for day ${dayValue}:`, response.status);
                        return response.json();
                    }).catch(error => {
                        console.error(`Error for day ${dayValue}:`, error);
                        return { success: false, message: `Failed to create schedule for day ${dayValue}` };
                    });
                });
                
                console.log('All promises created, waiting for results...');
                
                Promise.all(promises)
                    .then(results => {
                        console.log('All results received:', results);
                        
                        const successful = results.filter(r => r.success);
                        const failed = results.filter(r => !r.success);
                        
                        console.log(`Successful: ${successful.length}, Failed: ${failed.length}`);
                        
                        if (successful.length > 0) {
                            toast.success(`Successfully created ${successful.length} schedule(s)`);
                        }
                        
                        if (failed.length > 0) {
                            failed.forEach(result => {
                                toast.error(result.message || "Failed to create schedule");
                            });
                        }
                        
                        if (successful.length > 0) {
                            reset();
                            setIsDialogOpen(false);
                            setSelectedDays([]);
                            setIsQuickSetup(false);
                            // Refresh data while preserving selected dentist
                            router.reload({ only: ['schedules'] });
                        }
                        
                        setIsCreating(false);
                    })
                    .catch(error => {
                        console.error('Bulk create error:', error);
                        toast.error("Failed to create schedules. Please try again.");
                        setIsCreating(false);
                    });
            } else {
                // Handle single day creation
                const storeUrl = route("clinic.dentist-schedules.store", { clinic: clinic.id });
                
                // Transform data to ensure correct types
                const transformedData = {
                    ...data,
                    user_id: parseInt(data.user_id),
                    day_of_week: parseInt(data.day_of_week),
                    buffer_time: parseInt(data.buffer_time) || 15,
                    slot_duration: parseInt(data.slot_duration) || 30,
                    is_available: Boolean(data.is_available),
                    allow_overlap: Boolean(data.allow_overlap),
                    max_appointments_per_day: data.max_appointments_per_day ? parseInt(data.max_appointments_per_day) : null,
                };
                
                // Use fetch method like the working template application
                fetch(storeUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify(transformedData)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        toast.success(data.message || "Schedule created successfully");
                        reset();
                        setIsDialogOpen(false);
                        setIsCreating(false);
                        // Refresh data while preserving selected dentist
                        router.reload({ only: ['schedules'] });
                    } else {
                        toast.error(data.message || "Failed to create schedule");
                        setIsCreating(false);
                    }
                })
                .catch(error => {
                    console.error('Create error:', error);
                    toast.error("Failed to create schedule. Please try again.");
                    setIsCreating(false);
                });
            }
        }
    };

    const handleEdit = (schedule) => {
        console.log('Schedule data for editing:', schedule);
        setEditingSchedule(schedule);
        
        // Ensure time format is correct
        const startTime = schedule.start_time ? 
            (schedule.start_time.includes('T') ? 
                schedule.start_time.split('T')[1].substring(0, 5) : 
                schedule.start_time.substring(0, 5)) : "";
        
        const endTime = schedule.end_time ? 
            (schedule.end_time.includes('T') ? 
                schedule.end_time.split('T')[1].substring(0, 5) : 
                schedule.end_time.substring(0, 5)) : "";
        
        console.log('Formatted times:', { startTime, endTime });
        
        setData({
            user_id: schedule.user_id.toString(),
            day_of_week: schedule.day_of_week?.toString() || "",
            start_time: startTime,
            end_time: endTime,
            buffer_time: schedule.buffer_time || 15,
            slot_duration: schedule.slot_duration || 30,
            is_available: schedule.is_available,
            schedule_type: schedule.schedule_type || "weekly",
            notes: schedule.notes || "",
            allow_overlap: schedule.allow_overlap || false,
            max_appointments_per_day: schedule.max_appointments_per_day || null,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (schedule) => {
        if (confirm("Are you sure you want to delete this schedule? This action cannot be undone.")) {
            setIsDeleting(schedule.id);
            
            // Use fetch method like CREATE and UPDATE
            fetch(route("clinic.dentist-schedules.destroy", {
                clinic: clinic.id,
                schedule: schedule.id,
            }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    _method: 'DELETE'
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    toast.success(data.message || "Schedule deleted successfully");
                    setIsDeleting(null);
                    // Refresh data while preserving selected dentist
                    router.reload({ only: ['schedules'] });
                } else {
                    toast.error(data.message || "Failed to delete schedule");
                    setIsDeleting(null);
                }
            })
            .catch(error => {
                console.error('Delete error:', error);
                toast.error("Failed to delete schedule. Please try again.");
                setIsDeleting(null);
            });
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

            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-150 to-cyan-100 rounded-t-lg mx-0 pt-4 shadow-2xl border border-blue-200/50 border-t border-t-blue-200">
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
                                    onClick={() => {
                                        console.log('🆕 Add Schedule button clicked - clearing editingSchedule');
                                        setEditingSchedule(null);
                                        reset();
                                        setIsDialogOpen(true);
                                    }}
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
                                                            onClick={() => {
                                                                console.log('🆕 Add Schedule button clicked (dentist view) - clearing editingSchedule');
                                                                setEditingSchedule(null);
                                                                reset();
                                                                setIsDialogOpen(true);
                                                            }}
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
                                                                onClick={() => {
                                                                    console.log('🆕 Add Schedule button clicked (empty state) - clearing editingSchedule');
                                                                    setEditingSchedule(null);
                                                                    reset();
                                                                    setIsDialogOpen(true);
                                                                }}
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
                                                                        className={`w-full ${selectedDentist 
                                                                            ? "bg-indigo-600 hover:bg-indigo-700" 
                                                                            : "bg-gray-400 hover:bg-gray-500"
                                                                        }`}
                                                                        size="sm"
                                                                        disabled={!selectedDentist}
                                                                    >
                                                                        <Settings className="h-4 w-4 mr-2" />
                                                                        Apply Template
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Apply Schedule Template</DialogTitle>
                        <DialogDescription>
                            {!selectedDentist && (
                                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-800 text-sm">
                                        ⚠️ Please select a dentist first before applying a template.
                                    </p>
                                </div>
                            )}
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
                                    disabled={!selectedDentist || isApplyingTemplate}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {isApplyingTemplate
                                        ? "Applying Template..."
                                        : "Apply Template"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Schedule Form Dialog */}
            <Dialog 
                open={isDialogOpen} 
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        console.log('🚪 Dialog closed - clearing editingSchedule');
                        setEditingSchedule(null);
                        reset();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingSchedule
                                ? "Edit Schedule"
                                : "Create Schedule"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingSchedule
                                ? "Update the schedule details for the selected dentist."
                                : isQuickSetup
                                ? "Create schedules for multiple days with the same settings."
                                : "Create a new schedule entry for the selected dentist."}
                        </DialogDescription>
                        {!editingSchedule && (
                            <div className="flex items-center space-x-2 mt-3 p-3 bg-blue-50 rounded-lg">
                                <Switch
                                    checked={isQuickSetup}
                                    onCheckedChange={(checked) => {
                                        setIsQuickSetup(checked);
                                        if (!checked) {
                                            setSelectedDays([]);
                                        }
                                    }}
                                />
                                <Label className="text-sm font-medium text-blue-700">
                                    Quick Setup - Create for multiple days
                                </Label>
                            </div>
                        )}
                    </DialogHeader>
                    <div className="space-y-6 py-2">
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

                        {isQuickSetup && !editingSchedule ? (
                            <div className="space-y-2">
                                <Label>Select Days</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {WORKING_DAYS.map((day) => (
                                        <div key={day.value} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`day-${day.value}`}
                                                checked={selectedDays.includes(day.value)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedDays([...selectedDays, day.value]);
                                                    } else {
                                                        setSelectedDays(selectedDays.filter(d => d !== day.value));
                                                    }
                                                }}
                                                className="rounded border-gray-300"
                                            />
                                            <Label htmlFor={`day-${day.value}`} className="text-sm">
                                                {day.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Select multiple days to create schedules with the same settings
                                </p>
                            </div>
                        ) : (
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
                        )}

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

                        {/* Advanced Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Buffer Time (minutes)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="60"
                                    value={data.buffer_time}
                                    onChange={(e) =>
                                        setData("buffer_time", parseInt(e.target.value) || 15)
                                    }
                                    placeholder="15"
                                />
                                <p className="text-xs text-gray-500">Time between appointments</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Slot Duration (minutes)</Label>
                                <Input
                                    type="number"
                                    min="15"
                                    max="240"
                                    value={data.slot_duration}
                                    onChange={(e) =>
                                        setData("slot_duration", parseInt(e.target.value) || 30)
                                    }
                                    placeholder="30"
                                />
                                <p className="text-xs text-gray-500">Default appointment length</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Maximum Appointments Per Day (optional)</Label>
                            <Input
                                type="number"
                                min="1"
                                max="50"
                                value={data.max_appointments_per_day || ""}
                                onChange={(e) =>
                                    setData("max_appointments_per_day", e.target.value ? parseInt(e.target.value) : null)
                                }
                                placeholder="Leave empty for no limit"
                            />
                            <p className="text-xs text-gray-500">Limit the number of appointments for this day</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes (optional)</Label>
                            <Input
                                type="text"
                                value={data.notes || ""}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Add any special notes for this schedule"
                                maxLength="1000"
                            />
                            <p className="text-xs text-gray-500">Special instructions or notes</p>
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

                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={data.allow_overlap || false}
                                onCheckedChange={(checked) =>
                                    setData("allow_overlap", checked)
                                }
                            />
                            <Label>Allow overlapping appointments</Label>
                            <p className="text-xs text-gray-500 ml-2">(Advanced: allows double-booking)</p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false);
                                    reset();
                                    setEditingSchedule(null);
                                    setIsQuickSetup(false);
                                    setSelectedDays([]);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={processing || isCreating || isUpdating}
                            >
                                {isCreating
                                    ? (isQuickSetup && selectedDays.length > 1 ? `Creating ${selectedDays.length} Schedules...` : "Creating...")
                                    : isUpdating
                                    ? "Updating..."
                                    : processing
                                    ? "Saving..."
                                    : editingSchedule
                                    ? "Update Schedule"
                                    : (isQuickSetup && selectedDays.length > 1 ? `Create ${selectedDays.length} Schedules` : "Create Schedule")}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
