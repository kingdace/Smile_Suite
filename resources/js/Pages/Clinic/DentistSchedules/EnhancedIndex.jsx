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
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Plus,
    Calendar,
    List,
    Clock,
    User,
    Settings,
    Copy,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
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

export default function EnhancedIndex({ auth, clinic, schedules, dentists }) {
    const [selectedDentist, setSelectedDentist] = useState(null);
    const [activeTab, setActiveTab] = useState("list");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

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
        return (
            WORKING_DAYS.find((day) => day.value === dayNumber)?.label ||
            "Unknown"
        );
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
            <Head title="Enhanced Schedule Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Enhanced Schedule Management
                                </h1>
                                <p className="text-gray-600 mt-2">
                                    Manage dentist schedules and templates
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={() =>
                                        setIsTemplateDialogOpen(true)
                                    }
                                    variant="outline"
                                >
                                    Templates
                                </Button>
                                <Button onClick={() => setIsDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Schedule
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Dentist Selection */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Select Dentist</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
                                        className="flex flex-col items-center gap-1 h-auto py-3"
                                    >
                                        <User className="h-4 w-4" />
                                        <span className="text-xs font-medium">
                                            {dentist.name}
                                        </span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

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
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Schedules for{" "}
                                                {
                                                    dentists.find(
                                                        (d) =>
                                                            d.id.toString() ===
                                                            selectedDentist
                                                    )?.name
                                                }
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {dentistSchedules.length ===
                                                0 ? (
                                                    <div className="text-center py-8">
                                                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                        <p className="text-gray-500">
                                                            No schedules found
                                                        </p>
                                                        <Button
                                                            onClick={() =>
                                                                setIsDialogOpen(
                                                                    true
                                                                )
                                                            }
                                                            className="mt-4"
                                                        >
                                                            Add First Schedule
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    dentistSchedules.map(
                                                        (schedule) => (
                                                            <div
                                                                key={
                                                                    schedule.id
                                                                }
                                                                className="flex items-center justify-between p-4 border rounded-lg"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    {getStatusIcon(
                                                                        schedule.is_available
                                                                    )}
                                                                    <div>
                                                                        <h3 className="font-medium">
                                                                            {getDayName(
                                                                                schedule.day_of_week
                                                                            )}
                                                                        </h3>
                                                                        <p className="text-sm text-gray-500">
                                                                            {
                                                                                schedule.start_time
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                schedule.end_time
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge
                                                                        variant={
                                                                            schedule.is_available
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {schedule.is_available
                                                                            ? "Available"
                                                                            : "Unavailable"}
                                                                    </Badge>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                schedule
                                                                            )
                                                                        }
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                schedule
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardContent className="text-center py-8">
                                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">
                                                Please select a dentist to view
                                                schedules
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
                                        <CardTitle>
                                            Schedule Templates
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {SCHEDULE_TEMPLATES.map(
                                                (template) => (
                                                    <Card
                                                        key={template.id}
                                                        className="hover:shadow-md transition-shadow"
                                                    >
                                                        <CardContent className="p-4">
                                                            <h3 className="font-medium mb-1">
                                                                {template.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mb-3">
                                                                {
                                                                    template.description
                                                                }
                                                            </p>
                                                            <div className="space-y-1 mb-4">
                                                                {template.schedule.map(
                                                                    (
                                                                        day,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="text-xs text-gray-600"
                                                                        >
                                                                            {getDayName(
                                                                                day.day
                                                                            )}
                                                                            :{" "}
                                                                            {
                                                                                day.start
                                                                            }{" "}
                                                                            -{" "}
                                                                            {
                                                                                day.end
                                                                            }
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            <Button
                                                                onClick={() =>
                                                                    handleTemplateSelect(
                                                                        template
                                                                    )
                                                                }
                                                                className="w-full"
                                                                size="sm"
                                                            >
                                                                Use Template
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                )
                                            )}
                                        </div>
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Apply Template</DialogTitle>
                    </DialogHeader>
                    {selectedTemplate && (
                        <div className="space-y-4">
                            <p>
                                Apply <strong>{selectedTemplate.name}</strong>{" "}
                                to{" "}
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
                                    "selected dentist"
                                )}
                                ?
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setIsTemplateDialogOpen(false)
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={applyTemplate}
                                    disabled={!selectedDentist || processing}
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
