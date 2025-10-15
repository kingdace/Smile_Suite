import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import ImprovedDentalChart from "@/Components/ImprovedDentalChart/DentalChart";
import { X, Save, RotateCcw } from "lucide-react";

const DentalChartModal = ({
    isOpen,
    onClose,
    selectedTeeth = [],
    onSave,
    title = "Select Teeth",
    description = "Choose the teeth involved in this treatment",
    readOnly = false,
}) => {
    const [localSelectedTeeth, setLocalSelectedTeeth] = useState([]);

    // Initialize local state when modal opens
    useEffect(() => {
        if (isOpen) {
            setLocalSelectedTeeth(selectedTeeth.map(Number));
        }
    }, [isOpen]); // Only depend on isOpen, not selectedTeeth

    const handleToothSelect = (toothNumber) => {
        if (readOnly) return;

        setLocalSelectedTeeth((prev) => {
            const newArray = [...prev];
            const index = newArray.indexOf(toothNumber);
            if (index > -1) {
                newArray.splice(index, 1);
            } else {
                newArray.push(toothNumber);
            }
            return newArray;
        });
    };

    const handleClear = () => {
        if (readOnly) return;
        setLocalSelectedTeeth([]);
    };

    const handleSelectAll = () => {
        if (readOnly) return;
        setLocalSelectedTeeth(Array.from({ length: 32 }, (_, i) => i + 1));
    };

    const handleSave = () => {
        const teethArray = [...localSelectedTeeth].sort((a, b) => a - b);
        onSave(teethArray);
        onClose();
    };

    const handleCancel = () => {
        // Reset to original selection
        setLocalSelectedTeeth(selectedTeeth.map(Number));
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 mt-1">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Selection Summary */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-sm">
                                {localSelectedTeeth.length}/32 selected
                            </Badge>
                            {localSelectedTeeth.length > 0 && (
                                <span className="text-sm text-gray-600">
                                    Teeth:{" "}
                                    {[...localSelectedTeeth]
                                        .sort((a, b) => a - b)
                                        .join(", ")}
                                </span>
                            )}
                        </div>
                        {!readOnly && (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleClear}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-xs"
                                >
                                    <RotateCcw className="w-3 h-3 mr-1" />
                                    Clear
                                </Button>
                                <Button
                                    onClick={handleSelectAll}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-3 text-xs"
                                >
                                    Select All
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Dental Chart */}
                    <div className="border rounded-lg overflow-hidden">
                        <ImprovedDentalChart
                            selectedTeeth={localSelectedTeeth}
                            onTeethChange={handleToothSelect}
                            readOnly={readOnly}
                        />
                    </div>
                </div>

                <DialogFooter className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {readOnly
                            ? "View-only mode"
                            : "Click teeth to select/deselect"}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                        >
                            {readOnly ? "Close" : "Cancel"}
                        </Button>
                        {!readOnly && (
                            <Button
                                onClick={handleSave}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Selection
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DentalChartModal;
