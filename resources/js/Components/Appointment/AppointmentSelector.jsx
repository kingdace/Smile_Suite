import { useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Check,
    ChevronsUpDown,
    Search,
    Calendar,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import axios from "axios";
import { format } from "date-fns";

export default function AppointmentSelector({
    clinic,
    selectedAppointment,
    onAppointmentSelect,
    error,
    disabled = false,
}) {
    const [appointments, setAppointments] = useState([]);
    const [appointmentInput, setAppointmentInput] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedSearch = useCallback(
        debounce((value) => {
            setIsLoading(true);
            const searchUrl = route("clinic.appointments.search", {
                clinic: clinic.id,
                search: value,
            });

            axios
                .get(searchUrl)
                .then((response) => {
                    setAppointments(response.data);
                })
                .catch((error) => {
                    console.error("Error in appointment search:", error);
                    setAppointments([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 300),
        [clinic.id]
    );

    useEffect(() => {
        if (open && appointments.length === 0 && appointmentInput === "") {
            debouncedSearch("");
        }
    }, [open, appointments.length, appointmentInput, debouncedSearch]);

    const handleAppointmentInputChange = (value) => {
        setAppointmentInput(value);
        debouncedSearch(value);
    };

    const handleAppointmentSelect = (appointment) => {
        onAppointmentSelect(appointment);
        const displayText = appointment?.scheduled_at
            ? `${format(new Date(appointment.scheduled_at), "PPP")} - ${
                  appointment.patient?.name || "Unknown"
              } (${appointment.type || "No Type"})`
            : "No appointment selected";
        setAppointmentInput(displayText);
        setOpen(false);
    };

    const getDisplayText = () => {
        if (selectedAppointment) {
            return selectedAppointment?.scheduled_at
                ? `${format(
                      new Date(selectedAppointment.scheduled_at),
                      "PPP"
                  )} - ${selectedAppointment.patient?.name || "Unknown"} (${
                      selectedAppointment.type || "No Type"
                  })`
                : "Selected appointment";
        }
        return "Search for an appointment...";
    };

    return (
        <div>
            <label className="text-base font-medium text-gray-700 mb-3 block">
                Related Appointment
            </label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between h-14 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base",
                            error && "border-red-500",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={disabled}
                    >
                        <span className="truncate">{getDisplayText()}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-full p-0"
                    align="start"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                >
                    <Command>
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <CommandInput
                                placeholder="Search by patient name, date, type, status, dentist..."
                                value={appointmentInput}
                                onValueChange={handleAppointmentInputChange}
                                className="border-0 focus:ring-0"
                            />
                            {isLoading && (
                                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                            )}
                        </div>
                        <CommandList>
                            <CommandEmpty>
                                {isLoading
                                    ? "Loading appointments..."
                                    : "No appointments found."}
                            </CommandEmpty>
                            <CommandGroup>
                                {/* Option to clear selection */}
                                <CommandItem
                                    value="clear_selection"
                                    onSelect={() => {
                                        setSelectedAppointment(null);
                                        onAppointmentSelect(null);
                                        setAppointmentInput("");
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-500">
                                                No Appointment
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Clear selection
                                            </div>
                                        </div>
                                    </div>
                                </CommandItem>
                                {appointments.map((appointment) => (
                                    <CommandItem
                                        key={appointment.id}
                                        value={`${
                                            appointment.patient?.name ||
                                            "Unknown"
                                        } ${appointment.type || ""} ${
                                            appointment.scheduled_at || ""
                                        }`}
                                        onSelect={() =>
                                            handleAppointmentSelect(appointment)
                                        }
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">
                                                    {appointment.patient
                                                        ?.name ||
                                                        "Unknown Patient"}
                                                </div>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    {appointment.scheduled_at && (
                                                        <div className="flex items-center gap-2">
                                                            <span>
                                                                {format(
                                                                    new Date(
                                                                        appointment.scheduled_at
                                                                    ),
                                                                    "PPP p"
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            {appointment.type ||
                                                                "No Type"}
                                                        </span>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                            {appointment.status ||
                                                                "No Status"}
                                                        </span>
                                                        {appointment.dentist
                                                            ?.name && (
                                                            <span className="text-xs text-gray-500">
                                                                Dr.{" "}
                                                                {
                                                                    appointment
                                                                        .dentist
                                                                        .name
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4 flex-shrink-0",
                                                    selectedAppointment?.id ===
                                                        appointment.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}
        </div>
    );
}
