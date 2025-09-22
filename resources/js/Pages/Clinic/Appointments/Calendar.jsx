import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek,
    addDays,
    subDays,
} from "date-fns";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    User,
    Stethoscope,
    Plus,
    Eye,
    Edit,
    Trash2,
    Filter,
    Search,
    Grid3X3,
    List,
    CalendarDays,
    ArrowLeft,
    ArrowRight,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Calendar({ auth, clinic, appointments, filters }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState("month"); // 'month' or 'week'
    const [selectedDate, setSelectedDate] = useState(null);
    const [filteredAppointments, setFilteredAppointments] = useState(
        appointments?.data || []
    );
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [statusFilter, setStatusFilter] = useState(filters?.status || "");
    const [dentistFilter, setDentistFilter] = useState(filters?.dentist || "");

    // Get unique dentists for filter
    const dentists = [
        ...new Set(
            appointments?.data
                ?.map((apt) => apt.assigned_dentist?.id)
                .filter(Boolean)
        ),
    ];

    // Get unique statuses for filter
    const statuses = [
        ...new Set(
            appointments?.data?.map((apt) => apt.status?.name).filter(Boolean)
        ),
    ];

    const getStatusColor = (statusName) => {
        const colors = {
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
            Completed: "bg-green-100 text-green-800 border-green-300",
            Cancelled: "bg-red-100 text-red-800 border-red-300",
            "No Show": "bg-gray-100 text-gray-800 border-gray-300",
        };
        return (
            colors[statusName] || "bg-gray-100 text-gray-800 border-gray-300"
        );
    };

    const getTypeColor = (typeName) => {
        const colors = {
            "Walk-in": "bg-purple-100 text-purple-800 border-purple-300",
            "Phone Call": "bg-indigo-100 text-indigo-800 border-indigo-300",
            "Online Booking": "bg-cyan-100 text-cyan-800 border-cyan-300",
            "Follow-up": "bg-orange-100 text-orange-800 border-orange-300",
            Emergency: "bg-red-100 text-red-800 border-red-300",
        };
        return colors[typeName] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    // Filter appointments based on search and filters
    useEffect(() => {
        let filtered = appointments?.data || [];

        if (searchTerm) {
            filtered = filtered.filter(
                (apt) =>
                    apt.patient?.first_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    apt.patient?.last_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    apt.patient?.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(
                (apt) => apt.status?.name === statusFilter
            );
        }

        if (dentistFilter) {
            filtered = filtered.filter(
                (apt) => apt.assigned_dentist?.id === parseInt(dentistFilter)
            );
        }

        setFilteredAppointments(filtered);
    }, [appointments, searchTerm, statusFilter, dentistFilter]);

    // Get appointments for a specific date
    const getAppointmentsForDate = (date) => {
        return filteredAppointments.filter((apt) =>
            isSameDay(new Date(apt.scheduled_at), date)
        );
    };

    // Get calendar days
    const getCalendarDays = () => {
        if (viewMode === "month") {
            const start = startOfMonth(currentDate);
            const end = endOfMonth(currentDate);
            const startDate = startOfWeek(start);
            const endDate = endOfWeek(end);

            return eachDayOfInterval({ start: startDate, end: endDate });
        } else {
            // Week view
            const start = startOfWeek(currentDate);
            const end = endOfWeek(currentDate);
            return eachDayOfInterval({ start, end });
        }
    };

    const navigateMonth = (direction) => {
        setCurrentDate((prev) =>
            direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
        );
    };

    const navigateWeek = (direction) => {
        setCurrentDate((prev) =>
            direction === "next" ? addDays(prev, 7) : subDays(prev, 7)
        );
    };

    const navigate = (direction) => {
        if (viewMode === "month") {
            navigateMonth(direction);
        } else {
            navigateWeek(direction);
        }
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const renderCalendarHeader = () => (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                    {viewMode === "month"
                        ? format(currentDate, "MMMM yyyy")
                        : `${format(
                              startOfWeek(currentDate),
                              "MMM d"
                          )} - ${format(
                              endOfWeek(currentDate),
                              "MMM d, yyyy"
                          )}`}
                </h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("prev")}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                        Today
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("next")}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("month")}
                    >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Month
                    </Button>
                    <Button
                        variant={viewMode === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("week")}
                    >
                        <List className="h-4 w-4 mr-2" />
                        Week
                    </Button>
                </div>

                <Link
                    href={route(
                        "clinic.appointments.create-simplified",
                        clinic.id
                    )}
                >
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Appointment
                    </Button>
                </Link>
            </div>
        </div>
    );

    const renderFilters = () => (
        <Card className="mb-6">
            <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    <select
                        value={dentistFilter}
                        onChange={(e) => setDentistFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Dentists</option>
                        {dentists.map((dentistId) => {
                            const dentist = appointments?.data?.find(
                                (apt) => apt.assigned_dentist?.id === dentistId
                            )?.assigned_dentist;
                            return dentist ? (
                                <option key={dentistId} value={dentistId}>
                                    {dentist.name}
                                </option>
                            ) : null;
                        })}
                    </select>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("");
                            setDentistFilter("");
                        }}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    const renderCalendarGrid = () => {
        const days = getCalendarDays();
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return (
            <Card>
                <CardContent className="p-0">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 border-b">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="p-4 text-center font-semibold text-gray-600 bg-gray-50"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7">
                        {days.map((day, index) => {
                            const dayAppointments = getAppointmentsForDate(day);
                            const isCurrentMonth =
                                viewMode === "month"
                                    ? isSameMonth(day, currentDate)
                                    : true;
                            const isCurrentDay = isToday(day);
                            const isSelected =
                                selectedDate && isSameDay(day, selectedDate);

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[120px] p-2 border-r border-b cursor-pointer transition-colors ${
                                        !isCurrentMonth
                                            ? "bg-gray-50 text-gray-400"
                                            : "bg-white hover:bg-gray-50"
                                    } ${isCurrentDay ? "bg-blue-50" : ""} ${
                                        isSelected ? "bg-blue-100" : ""
                                    }`}
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <div
                                        className={`text-sm font-medium mb-2 ${
                                            isCurrentDay ? "text-blue-600" : ""
                                        }`}
                                    >
                                        {format(day, "d")}
                                    </div>

                                    <div className="space-y-1">
                                        {dayAppointments
                                            .slice(0, 3)
                                            .map((appointment) => (
                                                <div
                                                    key={appointment.id}
                                                    className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                                                    title={`${
                                                        appointment.patient
                                                            ?.first_name
                                                    } ${
                                                        appointment.patient
                                                            ?.last_name
                                                    } - ${format(
                                                        new Date(
                                                            appointment.scheduled_at
                                                        ),
                                                        "h:mm a"
                                                    )}`}
                                                >
                                                    <div className="font-medium truncate">
                                                        {
                                                            appointment.patient
                                                                ?.first_name
                                                        }{" "}
                                                        {
                                                            appointment.patient
                                                                ?.last_name
                                                        }
                                                    </div>
                                                    <div className="text-blue-600">
                                                        {format(
                                                            new Date(
                                                                appointment.scheduled_at
                                                            ),
                                                            "h:mm a"
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        {dayAppointments.length > 3 && (
                                            <div className="text-xs text-gray-500 text-center">
                                                +{dayAppointments.length - 3}{" "}
                                                more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderSelectedDateAppointments = () => {
        if (!selectedDate) return null;

        const dayAppointments = getAppointmentsForDate(selectedDate);

        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Appointments for{" "}
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                        <Badge variant="secondary">
                            {dayAppointments.length} appointment(s)
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {dayAppointments.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No appointments scheduled for this date</p>
                            <Link
                                href={route(
                                    "clinic.appointments.create-simplified",
                                    clinic.id
                                )}
                            >
                                <Button className="mt-4">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dayAppointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">
                                                {format(
                                                    new Date(
                                                        appointment.scheduled_at
                                                    ),
                                                    "h:mm a"
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">
                                                {
                                                    appointment.patient
                                                        ?.first_name
                                                }{" "}
                                                {appointment.patient?.last_name}
                                            </span>
                                        </div>

                                        {appointment.assigned_dentist && (
                                            <div className="flex items-center gap-2">
                                                <Stethoscope className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {
                                                        appointment
                                                            .assigned_dentist
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={getStatusColor(
                                                appointment.status?.name
                                            )}
                                        >
                                            {appointment.status?.name}
                                        </Badge>
                                        <Badge
                                            className={getTypeColor(
                                                appointment.type?.name
                                            )}
                                        >
                                            {appointment.type?.name}
                                        </Badge>

                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={route(
                                                    "clinic.appointments.show",
                                                    [clinic.id, appointment.id]
                                                )}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link
                                                href={route(
                                                    "clinic.appointments.edit",
                                                    [clinic.id, appointment.id]
                                                )}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Appointment Calendar
                </h2>
            }
        >
            <Head title="Appointment Calendar" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href={route(
                                    "clinic.appointments.index",
                                    clinic.id
                                )}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to List View
                            </Link>
                        </div>
                    </div>

                    {renderCalendarHeader()}
                    {renderFilters()}
                    {renderCalendarGrid()}
                    {renderSelectedDateAppointments()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
