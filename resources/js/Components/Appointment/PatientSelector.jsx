import { useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
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
import { Check, ChevronsUpDown, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import axios from "axios";

export default function PatientSelector({
    clinic,
    selectedPatient,
    onPatientSelect,
    error,
    disabled = false,
}) {
    const [patients, setPatients] = useState([]);
    const [patientInput, setPatientInput] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedSearch = useCallback(
        debounce((value) => {
            setIsLoading(true);
            const searchUrl = route("clinic.patients.search", {
                clinic: clinic.id,
                search: value,
            });

            axios
                .get(searchUrl)
                .then((response) => {
                    setPatients(response.data);
                })
                .catch((error) => {
                    console.error("Error in patient search:", error);
                    setPatients([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 300),
        [clinic.id]
    );

    useEffect(() => {
        if (open && patients.length === 0 && patientInput === "") {
            debouncedSearch("");
        }
    }, [open, patients.length, patientInput, debouncedSearch]);

    const handlePatientInputChange = (value) => {
        setPatientInput(value);
        debouncedSearch(value);
    };

    const handlePatientSelect = (patient) => {
        onPatientSelect(patient);
        setPatientInput(`${patient.first_name} ${patient.last_name}`);
        setOpen(false);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
                Select Patient
            </label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between",
                            error && "border-red-500",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={disabled}
                    >
                        {selectedPatient
                            ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
                            : "Search for a patient..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <CommandInput
                                placeholder="Search patients..."
                                value={patientInput}
                                onValueChange={handlePatientInputChange}
                                className="border-0 focus:ring-0"
                            />
                        </div>
                        <CommandList>
                            <CommandEmpty>
                                {isLoading
                                    ? "Loading..."
                                    : "No patients found."}
                            </CommandEmpty>
                            <CommandGroup>
                                {patients.map((patient) => (
                                    <CommandItem
                                        key={patient.id}
                                        value={`${patient.first_name} ${patient.last_name}`}
                                        onSelect={() =>
                                            handlePatientSelect(patient)
                                        }
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <User className="h-4 w-4" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {patient.first_name}{" "}
                                                    {patient.last_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {patient.email} •{" "}
                                                    {patient.phone_number}
                                                </div>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    selectedPatient?.id ===
                                                        patient.id
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

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
