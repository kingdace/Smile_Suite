import { useState, useEffect, useMemo } from "react";
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
import { toast } from "sonner";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/Components/ui/dialog";
import {
    Plus,
    Calendar as CalendarIcon,
    List,
    Clock,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_WORKING_HOURS = {
    morning: { start: "08:00", end: "11:00" },
    afternoon: { start: "13:00", end: "17:00" },
};

const WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday

const DAYS_OF_WEEK = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
];

const EXCEPTION_TYPES = [
    { value: "holiday", label: "Holiday" },
    { value: "vacation", label: "Vacation" },
    { value: "training", label: "Training" },
    { value: "personal", label: "Personal Leave" },
    { value: "sick", label: "Sick Leave" },
];

export default function Index({ auth, clinic, schedules, dentists }) {
    // Log all props to understand what we're receiving
    console.log("Component Props:", {
        auth,
        clinic,
        schedules,
        dentists,
    });

    // Log the structure of schedules if it exists
    if (schedules) {
        console.log("Schedules structure:", {
            isArray: Array.isArray(schedules),
            isObject: typeof schedules === "object",
            keys: Object.keys(schedules),
            sample: Object.entries(schedules)[0],
        });
    }

    // Log the structure of dentists if it exists
    if (dentists) {
        console.log("Dentists structure:", {
            isArray: Array.isArray(dentists),
            length: dentists.length,
            sample: dentists[0],
        });
    }

    const [selectedDentist, setSelectedDentist] = useState(null);
    const [isException, setIsException] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [view, setView] = useState("calendar"); // "calendar" or "list"
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        user_id: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        buffer_time: 15,
        is_available: true,
        date: "",
        exception_type: "",
    });

    const handleQuickSetup = (dentistId) => {
        const dentist = dentists.find(
            (d) => String(d.id) === String(dentistId)
        );
        if (!dentist) return;

        // Create schedules for each working day
        const schedules = WORKING_DAYS.map((day) => [
            {
                user_id: dentistId,
                day_of_week: day,
                start_time: DEFAULT_WORKING_HOURS.morning.start,
                end_time: DEFAULT_WORKING_HOURS.morning.end,
                buffer_time: 15,
                is_available: true,
                date: null,
                exception_type: null,
            },
            {
                user_id: dentistId,
                day_of_week: day,
                start_time: DEFAULT_WORKING_HOURS.afternoon.start,
                end_time: DEFAULT_WORKING_HOURS.afternoon.end,
                buffer_time: 15,
                is_available: true,
                date: null,
                exception_type: null,
            },
        ]).flat();

        // Submit each schedule
        schedules.forEach((schedule) => {
            post(
                route("clinic.dentist-schedules.store", { clinic: clinic.id }),
                {
                    data: schedule,
                    onSuccess: () => {
                        toast.success(
                            `Schedule created for ${dentist.name} on ${
                                DAYS_OF_WEEK.find(
                                    (d) => d.value === schedule.day_of_week
                                )?.label
                            }`
                        );
                    },
                    onError: (errors) => {
                        Object.values(errors).forEach((error) =>
                            toast.error(error)
                        );
                    },
                }
            );
        });
    };

    // Initialize selectedDentist based on data.user_id when dentists or data.user_id changes
    useEffect(() => {
        if (data.user_id && dentists.length > 0) {
            const foundDentist = dentists.find(
                (d) => String(d.id) === String(data.user_id)
            );
            if (foundDentist) {
                setSelectedDentist(foundDentist);
            }
        } else {
            setSelectedDentist(null);
        }
    }, [data.user_id, dentists]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            user_id: data.user_id,
            start_time: data.start_time,
            end_time: data.end_time,
            buffer_time: data.buffer_time,
            is_available: data.is_available,
        };

        if (isException) {
            submitData.date = data.date;
            submitData.exception_type = data.exception_type;
            submitData.day_of_week = null;
        } else {
            submitData.day_of_week = data.day_of_week;
            submitData.date = null;
            submitData.exception_type = null;
        }

        if (editingSchedule) {
            put(
                route("clinic.dentist-schedules.update", {
                    clinic: clinic.id,
                    schedule: editingSchedule.id,
                }),
                submitData,
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
                    data: submitData,
                    onSuccess: () => {
                        toast.success("Schedule saved successfully");
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
        setIsException(schedule.date !== null);
        setData({
            user_id: String(schedule.user_id),
            day_of_week:
                schedule.day_of_week !== null
                    ? String(schedule.day_of_week)
                    : "",
            start_time: schedule.start_time.substring(0, 5),
            end_time: schedule.end_time.substring(0, 5),
            buffer_time: 15,
            is_available: schedule.is_available,
            date: schedule.date || "",
            exception_type: schedule.exception_type || "",
        });
        setIsDialogOpen(true);
    };

    const handleCancelEdit = () => {
        setEditingSchedule(null);
        setIsException(false);
        reset();
        setIsDialogOpen(false);
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
                    onError: (error) => {
                        toast.error("Failed to delete schedule");
                        console.error(error);
                    },
                }
            );
        }
    };

    const getSchedulesForDate = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        return Object.values(schedules)
            .flat()
            .filter(
                (schedule) =>
                    schedule.date === formattedDate ||
                    (schedule.day_of_week !== null &&
                        schedule.day_of_week === date.getDay())
            );
    };

    const fullCalendarEvents = useMemo(() => {
        const events = [];

        // Log the raw data for debugging
        console.log("Raw schedules:", schedules);
        console.log("Raw dentists:", dentists);

        // Convert schedules object to array and process each schedule
        Object.entries(schedules).forEach(([userId, userSchedules]) => {
            // Find the dentist for this user ID
            const dentist = dentists.find(
                (d) => String(d.id) === String(userId)
            );
            console.log(
                `Processing schedules for dentist ${dentist?.name || userId}:`,
                userSchedules
            );

            userSchedules.forEach((schedule) => {
                const startTime = schedule.start_time;
                const endTime = schedule.end_time;
                const title = dentist
                    ? `${dentist.name} (${startTime} - ${endTime})`
                    : `Dentist ID: ${userId} (${startTime} - ${endTime})`;

                if (schedule.date) {
                    // Exception schedule
                    events.push({
                        id: schedule.id,
                        title,
                        start: `${schedule.date}T${startTime}`,
                        end: `${schedule.date}T${endTime}`,
                        allDay: false,
                        extendedProps: {
                            schedule,
                            dentist: dentist || {
                                id: userId,
                                name: `Dentist ${userId}`,
                            },
                        },
                    });
                } else {
                    // Recurring schedule
                    const dayOfWeek = parseInt(schedule.day_of_week);
                    const today = new Date();
                    const daysUntilNext = (dayOfWeek - today.getDay() + 7) % 7;
                    const nextDate = new Date(today);
                    nextDate.setDate(today.getDate() + daysUntilNext);

                    events.push({
                        id: schedule.id,
                        title,
                        start: `${
                            nextDate.toISOString().split("T")[0]
                        }T${startTime}`,
                        end: `${
                            nextDate.toISOString().split("T")[0]
                        }T${endTime}`,
                        allDay: false,
                        extendedProps: {
                            schedule,
                            dentist: dentist || {
                                id: userId,
                                name: `Dentist ${userId}`,
                            },
                        },
                    });
                }
            });
        });

        console.log("Generated FullCalendar events:", events);
        return events;
    }, [schedules, dentists]);

    console.log("FullCalendar events:", fullCalendarEvents);

    const renderCalendarView = () => (
        <div className="w-full">
            <style>{`
                .fc {
                    max-width: 100%;
                    background: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
                }
                .fc .fc-toolbar {
                    padding: 1rem;
                    margin-bottom: 0 !important;
                    border-bottom: 1px solid #e5e7eb;
                }
                .fc .fc-toolbar-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #1f2937;
                }
                .fc .fc-button-primary {
                    background-color: #6366f1;
                    border-color: #6366f1;
                    color: white;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem;
                    border-radius: 0.375rem;
                    transition: all 0.2s;
                }
                .fc .fc-button-primary:hover {
                    background-color: #4f46e5;
                    border-color: #4f46e5;
                    transform: translateY(-1px);
                }
                .fc .fc-button-active {
                    background-color: #4f46e5;
                    border-color: #4f46e5;
                    box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
                }
                .fc-daygrid-day-frame {
                    min-height: 150px;
                    padding: 0.5rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.375rem;
                    margin: 2px;
                    transition: all 0.2s;
                }
                .fc-daygrid-day-frame:hover {
                    background-color: #f9fafb;
                }
                .fc-day-today .fc-daygrid-day-frame {
                    background-color: #eff6ff;
                    border-color: #93c5fd;
                }
                .fc-event {
                    border: none;
                    margin-bottom: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .fc-event:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
            `}</style>
            <div className="w-full">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    events={fullCalendarEvents}
                    height="auto"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,listButton",
                    }}
                    customButtons={{
                        listButton: {
                            text: "List View",
                            click: () => setView("list"),
                            className: `fc-button fc-button-primary ${
                                view === "list" ? "fc-button-active" : ""
                            }`,
                        },
                    }}
                    eventContent={(arg) => {
                        const schedule = arg.event.extendedProps.schedule;
                        const dentist = dentists.find(
                            (d) => String(d.id) === String(schedule.user_id)
                        );
                        const exceptionType = EXCEPTION_TYPES.find(
                            (t) => t.value === schedule.exception_type
                        )?.label;

                        return (
                            <div className="bg-blue-50 border border-blue-200 rounded-md px-2 py-1.5 text-xs overflow-hidden leading-tight flex flex-col items-start w-full hover:bg-blue-100 transition-colors">
                                <span className="font-semibold text-blue-900">
                                    {dentist?.name}
                                </span>
                                <span className="text-blue-700 font-medium">
                                    {moment(
                                        schedule.start_time,
                                        "HH:mm:ss"
                                    ).format("HH:mm")}{" "}
                                    -{" "}
                                    {moment(
                                        schedule.end_time,
                                        "HH:mm:ss"
                                    ).format("HH:mm")}
                                </span>
                                {exceptionType && (
                                    <span className="text-blue-600 text-[10px] mt-0.5">
                                        {exceptionType}
                                    </span>
                                )}
                            </div>
                        );
                    }}
                    eventClick={(info) => {
                        handleEdit(info.event.extendedProps.schedule);
                    }}
                    dateClick={(info) => {
                        setIsException(false);
                        setData((prevData) => ({
                            ...prevData,
                            date: moment(info.date).format("YYYY-MM-DD"),
                            user_id: "",
                            start_time: "",
                            end_time: "",
                            day_of_week: moment(info.date).day().toString(),
                            exception_type: "",
                        }));
                        setEditingSchedule(null);
                        setIsDialogOpen(true);
                    }}
                />
            </div>
        </div>
    );

    const renderListView = () => (
        <div className="space-y-4">
            {Object.entries(schedules).map(([dentistId, dentistSchedules]) => {
                const dentist = dentists.find(
                    (d) => String(d.id) === dentistId
                );
                if (!dentist) return null;

                const regularSchedules = dentistSchedules.filter(
                    (s) => s.day_of_week !== null
                );
                const exceptionSchedules = dentistSchedules.filter(
                    (s) => s.date !== null
                );

                return (
                    <Card key={dentistId} className="p-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {dentist.name}
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedDentist(dentist);
                                        setData("user_id", String(dentist.id));
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Schedule
                                </Button>
                            </div>

                            {regularSchedules.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">
                                        Regular Schedule
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {regularSchedules.map((schedule) => (
                                            <Card
                                                key={schedule.id}
                                                className="p-3"
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-medium">
                                                        {
                                                            DAYS_OF_WEEK.find(
                                                                (d) =>
                                                                    d.value ===
                                                                    schedule.day_of_week
                                                            )?.label
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {schedule.start_time} -{" "}
                                                        {schedule.end_time}
                                                    </div>
                                                    <div className="flex space-x-2 mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    schedule
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    schedule
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {exceptionSchedules.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="font-medium">Exceptions</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {exceptionSchedules.map((schedule) => (
                                            <Card
                                                key={schedule.id}
                                                className="p-3"
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-medium">
                                                        {moment(
                                                            schedule.date
                                                        ).format(
                                                            "MMMM D, YYYY"
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {schedule.start_time} -{" "}
                                                        {schedule.end_time}
                                                    </div>
                                                    <div className="text-sm text-blue-600">
                                                        {
                                                            EXCEPTION_TYPES.find(
                                                                (t) =>
                                                                    t.value ===
                                                                    schedule.exception_type
                                                            )?.label
                                                        }
                                                    </div>
                                                    <div className="flex space-x-2 mt-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    schedule
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    schedule
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                );
            })}
        </div>
    );

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dentist Schedules
                </h2>
            }
        >
            <Head title="Dentist Schedules" />

            <div className="py-12">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Manage Dentist Schedules</CardTitle>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant={
                                                view === "calendar"
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() => setView("calendar")}
                                        >
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            Calendar
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Select onValueChange={handleQuickSetup}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Quick Setup" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dentists.map((dentist) => (
                                                <SelectItem
                                                    key={dentist.id}
                                                    value={String(dentist.id)}
                                                >
                                                    Set {dentist.name}'s
                                                    Schedule
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Dialog
                                        open={isDialogOpen}
                                        onOpenChange={setIsDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Exception
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[800px]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {editingSchedule
                                                        ? "Edit Schedule"
                                                        : "Add New Schedule"}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Manage your dentist's
                                                    regular working hours or add
                                                    exceptions for specific
                                                    dates.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form
                                                onSubmit={handleSubmit}
                                                className="space-y-6"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="user_id">
                                                                Dentist
                                                            </Label>
                                                            <Select
                                                                value={
                                                                    data.user_id
                                                                }
                                                                onValueChange={(
                                                                    value
                                                                ) =>
                                                                    setData(
                                                                        "user_id",
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a dentist" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dentists.map(
                                                                        (
                                                                            dentist
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    dentist.id
                                                                                }
                                                                                value={String(
                                                                                    dentist.id
                                                                                )}
                                                                            >
                                                                                {
                                                                                    dentist.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            {errors.user_id && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {
                                                                        errors.user_id
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                id="is_exception"
                                                                checked={
                                                                    isException
                                                                }
                                                                onCheckedChange={
                                                                    setIsException
                                                                }
                                                            />
                                                            <Label htmlFor="is_exception">
                                                                This is an
                                                                exception
                                                                (holiday,
                                                                vacation, etc.)
                                                            </Label>
                                                        </div>

                                                        {isException ? (
                                                            <>
                                                                <div>
                                                                    <Label htmlFor="date">
                                                                        Date
                                                                    </Label>
                                                                    <Input
                                                                        type="date"
                                                                        id="date"
                                                                        value={
                                                                            data.date
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "date",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                    {errors.date && (
                                                                        <p className="text-sm text-red-500 mt-1">
                                                                            {
                                                                                errors.date
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <Label htmlFor="exception_type">
                                                                        Exception
                                                                        Type
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            data.exception_type
                                                                        }
                                                                        onValueChange={(
                                                                            value
                                                                        ) =>
                                                                            setData(
                                                                                "exception_type",
                                                                                value
                                                                            )
                                                                        }
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select type" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {EXCEPTION_TYPES.map(
                                                                                (
                                                                                    type
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            type.value
                                                                                        }
                                                                                        value={
                                                                                            type.value
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            type.label
                                                                                        }
                                                                                    </SelectItem>
                                                                                )
                                                                            )}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {errors.exception_type && (
                                                                        <p className="text-sm text-red-500 mt-1">
                                                                            {
                                                                                errors.exception_type
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div>
                                                                <Label htmlFor="day_of_week">
                                                                    Day of Week
                                                                </Label>
                                                                <Select
                                                                    value={
                                                                        data.day_of_week
                                                                    }
                                                                    onValueChange={(
                                                                        value
                                                                    ) =>
                                                                        setData(
                                                                            "day_of_week",
                                                                            value
                                                                        )
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select day" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {DAYS_OF_WEEK.map(
                                                                            (
                                                                                day
                                                                            ) => (
                                                                                <SelectItem
                                                                                    key={
                                                                                        day.value
                                                                                    }
                                                                                    value={String(
                                                                                        day.value
                                                                                    )}
                                                                                >
                                                                                    {
                                                                                        day.label
                                                                                    }
                                                                                </SelectItem>
                                                                            )
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>
                                                                {errors.day_of_week && (
                                                                    <p className="text-sm text-red-500 mt-1">
                                                                        {
                                                                            errors.day_of_week
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="start_time">
                                                                Start Time
                                                            </Label>
                                                            <Input
                                                                type="time"
                                                                id="start_time"
                                                                value={
                                                                    data.start_time
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "start_time",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            {errors.start_time && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {
                                                                        errors.start_time
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="end_time">
                                                                End Time
                                                            </Label>
                                                            <Input
                                                                type="time"
                                                                id="end_time"
                                                                value={
                                                                    data.end_time
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "end_time",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            {errors.end_time && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {
                                                                        errors.end_time
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label htmlFor="buffer_time">
                                                                Buffer Time
                                                                (minutes)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                id="buffer_time"
                                                                value={
                                                                    data.buffer_time
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        "buffer_time",
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    )
                                                                }
                                                                min="0"
                                                                max="60"
                                                            />
                                                            {errors.buffer_time && (
                                                                <p className="text-sm text-red-500 mt-1">
                                                                    {
                                                                        errors.buffer_time
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                id="is_available"
                                                                checked={
                                                                    data.is_available
                                                                }
                                                                onCheckedChange={(
                                                                    checked
                                                                ) =>
                                                                    setData(
                                                                        "is_available",
                                                                        checked
                                                                    )
                                                                }
                                                            />
                                                            <Label htmlFor="is_available">
                                                                Available for
                                                                appointments
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        {editingSchedule
                                                            ? "Update"
                                                            : "Save"}{" "}
                                                        Schedule
                                                    </Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {view === "calendar"
                                ? renderCalendarView()
                                : renderListView()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
