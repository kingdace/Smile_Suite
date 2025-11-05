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
    Stethoscope,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "lodash";
import axios from "axios";
import { Badge } from "@/Components/ui/badge";

export default function TreatmentSelector({
    clinic,
    selectedTreatment,
    onTreatmentSelect,
    error,
    disabled = false,
}) {
    const [treatments, setTreatments] = useState([]);
    const [treatmentInput, setTreatmentInput] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount || 0);
    };

    const debouncedSearch = useCallback(
        debounce((value) => {
            setIsLoading(true);
            const searchUrl = route("clinic.treatments.search", {
                clinic: clinic.id,
                search: value,
            });

            axios
                .get(searchUrl)
                .then((response) => {
                    setTreatments(response.data);
                })
                .catch((error) => {
                    console.error("Error in treatment search:", error);
                    setTreatments([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 300),
        [clinic.id]
    );

    useEffect(() => {
        if (open && treatments.length === 0 && treatmentInput === "") {
            debouncedSearch("");
        }
    }, [open, treatments.length, treatmentInput, debouncedSearch]);

    const handleTreatmentInputChange = (value) => {
        setTreatmentInput(value);
        debouncedSearch(value);
    };

    const handleTreatmentSelect = (treatment) => {
        onTreatmentSelect(treatment);
        if (treatment) {
            const displayText = `${treatment.name}${treatment.patient?.name ? ` - ${treatment.patient.name}` : ""}${treatment.total_cost ? ` (${formatCurrency(treatment.total_cost)})` : ""}`;
            setTreatmentInput(displayText);
        } else {
            setTreatmentInput("");
        }
        setOpen(false);
    };

    const getDisplayText = () => {
        if (selectedTreatment) {
            return `${selectedTreatment.name}${selectedTreatment.patient?.name ? ` - ${selectedTreatment.patient.name}` : ""}${selectedTreatment.total_cost ? ` (${formatCurrency(selectedTreatment.total_cost)})` : ""}`;
        }
        return "Search for a treatment...";
    };

    return (
        <div>
            <label className="text-base font-medium text-gray-700 mb-3 block">
                Treatment
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
                                placeholder="Search by treatment name, patient, dentist, service..."
                                value={treatmentInput}
                                onValueChange={handleTreatmentInputChange}
                                className="border-0 focus:ring-0"
                            />
                            {isLoading && (
                                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                            )}
                        </div>
                        <CommandList>
                            <CommandEmpty>
                                {isLoading
                                    ? "Loading treatments..."
                                    : "No treatments found."}
                            </CommandEmpty>
                            <CommandGroup>
                                {/* Option to clear selection */}
                                <CommandItem
                                    value="clear_selection"
                                    onSelect={() => {
                                        onTreatmentSelect(null);
                                        setTreatmentInput("");
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <Stethoscope className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-500">
                                                No Treatment
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Clear selection
                                            </div>
                                        </div>
                                    </div>
                                </CommandItem>
                                {treatments.map((treatment) => (
                                    <CommandItem
                                        key={treatment.id}
                                        value={`${treatment.name || "Unknown"} ${treatment.patient?.name || ""} ${treatment.service?.name || ""}`}
                                        onSelect={() =>
                                            handleTreatmentSelect(treatment)
                                        }
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <Stethoscope className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">
                                                    {treatment.name || "Unknown Treatment"}
                                                </div>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    {treatment.patient?.name && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="truncate">
                                                                Patient: {treatment.patient.name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        {treatment.service?.name && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                {treatment.service.name}
                                                            </span>
                                                        )}
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                            {treatment.status || "No Status"}
                                                        </span>
                                                        {treatment.total_cost && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {formatCurrency(treatment.total_cost)}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Check
                                                className={cn(
                                                    "ml-auto h-4 w-4 flex-shrink-0",
                                                    selectedTreatment?.id === treatment.id
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
