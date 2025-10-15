import { useState, useEffect } from "react";
import Tooth from "./Tooth";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";

// Define tooth types for each position (Universal Numbering System)
const toothTypes = {
    // Upper arch (1-16)
    1: "molar",
    2: "molar",
    3: "molar",
    4: "premolar",
    5: "premolar",
    6: "canine",
    7: "incisor",
    8: "incisor",
    9: "incisor",
    10: "incisor",
    11: "canine",
    12: "premolar",
    13: "premolar",
    14: "molar",
    15: "molar",
    16: "molar",

    // Lower arch (17-32)
    17: "molar",
    18: "molar",
    19: "molar",
    20: "premolar",
    21: "premolar",
    22: "canine",
    23: "incisor",
    24: "incisor",
    25: "incisor",
    26: "incisor",
    27: "canine",
    28: "premolar",
    29: "premolar",
    30: "molar",
    31: "molar",
    32: "molar",
};

// Calculate position along an elliptical arc for upper teeth
const getUpperToothPosition = (index, total) => {
    const centerX = 325;
    const centerY = 190;
    const radiusX = 195;
    const radiusY = 105;

    // Angle from -145 to -35 degrees (top arch)
    const startAngle = -145;
    const endAngle = -35;
    const angleRange = endAngle - startAngle;
    const angle =
        (startAngle + (angleRange * index) / (total - 1)) * (Math.PI / 180);

    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);

    // Calculate rotation so tooth faces center
    const rotation = (angle * 180) / Math.PI + 90;

    return { x, y, rotation };
};

// Calculate position along an elliptical arc for lower teeth
const getLowerToothPosition = (index, total) => {
    const centerX = 325;
    const centerY = 390;
    const radiusX = 195;
    const radiusY = 105;

    // Angle from 35 to 145 degrees (bottom arch)
    const startAngle = 35;
    const endAngle = 145;
    const angleRange = endAngle - startAngle;
    const angle =
        (startAngle + (angleRange * index) / (total - 1)) * (Math.PI / 180);

    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);

    // Calculate rotation so tooth faces center
    const rotation = (angle * 180) / Math.PI - 90;

    return { x, y, rotation };
};

const ImprovedDentalChart = ({
    selectedTeeth: externalSelectedTeeth,
    onTeethChange,
    readOnly = false,
}) => {
    const [internalSelectedTeeth, setInternalSelectedTeeth] = useState([]);

    // Use external selectedTeeth if provided, otherwise use internal state
    const selectedTeeth =
        externalSelectedTeeth !== undefined
            ? externalSelectedTeeth
            : internalSelectedTeeth;

    // Debug: Log when selectedTeeth changes
    useEffect(() => {
        // console.log('DentalChart: selectedTeeth changed:', selectedTeeth);
    }, [selectedTeeth, externalSelectedTeeth, internalSelectedTeeth]);

    // Force re-render when external state changes
    useEffect(() => {
        if (externalSelectedTeeth !== undefined) {
            // console.log('DentalChart: External state updated, forcing re-render');
        }
    }, [externalSelectedTeeth]);

    const handleToothSelect = (number) => {
        if (readOnly) return;

        if (onTeethChange) {
            // Use external callback if provided - just pass the tooth number
            // The parent component (modal) will handle the state management
            onTeethChange(number);
        } else {
            // Use internal state if no external callback
            setInternalSelectedTeeth((prev) => {
                const newArray = [...prev];
                const index = newArray.indexOf(number);
                if (index > -1) {
                    newArray.splice(index, 1);
                } else {
                    newArray.push(number);
                }
                return newArray;
            });
        }
    };

    const clearSelection = () => {
        if (readOnly) return;

        if (onTeethChange) {
            // For external callback, we need to clear all selected teeth
            selectedTeeth.forEach((tooth) => onTeethChange(tooth));
        } else {
            setInternalSelectedTeeth([]);
        }
    };

    const selectAll = () => {
        if (readOnly) return;

        if (onTeethChange) {
            // For external callback, we need to select all unselected teeth
            for (let i = 1; i <= 32; i++) {
                if (!selectedTeeth.includes(i)) {
                    onTeethChange(i);
                }
            }
        } else {
            setInternalSelectedTeeth(
                Array.from({ length: 32 }, (_, i) => i + 1)
            );
        }
    };

    // Upper arch teeth (right to left: 1-16)
    const upperTeeth = Array.from({ length: 16 }, (_, i) => i + 1);

    // Lower arch teeth (right to left: 32-17)
    const lowerTeeth = Array.from({ length: 16 }, (_, i) => 32 - i);

    return (
        <div className="w-full max-w-5xl mx-auto p-3 md:p-4 space-y-3">
            {/* Compact Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-3">
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
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Dental Chart
                        </h1>
                        <p className="text-xs text-gray-500">
                            Universal Numbering System
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={clearSelection}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={selectAll}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                    >
                        Select All
                    </Button>
                    <Badge
                        variant="secondary"
                        className="text-xs px-2 py-1 h-8 flex items-center"
                    >
                        {selectedTeeth.length}/32 selected
                    </Badge>
                </div>
            </div>

            {/* Dental Chart - Realistic Mouth View */}
            <Card className="p-4 md:p-8 bg-gradient-to-b from-white to-blue-50/20 shadow-xl border-2">
                <div
                    className="relative w-full mx-auto"
                    style={{ maxWidth: "650px", height: "580px" }}
                >
                    {/* Mouth/Gum SVG */}
                    <svg
                        className="absolute inset-0 pointer-events-none"
                        width="100%"
                        height="100%"
                        viewBox="0 0 650 580"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <filter
                                id="gumShadow"
                                x="-50%"
                                y="-50%"
                                width="200%"
                                height="200%"
                            >
                                <feGaussianBlur
                                    in="SourceAlpha"
                                    stdDeviation="3"
                                />
                                <feOffset dx="0" dy="2" result="offsetblur" />
                                <feComponentTransfer>
                                    <feFuncA type="linear" slope="0.3" />
                                </feComponentTransfer>
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <radialGradient id="gumGradient" cx="50%" cy="50%">
                                <stop
                                    offset="0%"
                                    stopColor="hsl(350, 45%, 75%)"
                                    stopOpacity="0.9"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="hsl(350, 50%, 65%)"
                                    stopOpacity="0.95"
                                />
                            </radialGradient>
                        </defs>

                        {/* Upper Gum - Horseshoe Shape */}
                        <path
                            d="M 80 200
                               Q 80 80, 180 60
                               Q 280 45, 325 45
                               Q 370 45, 470 60
                               Q 570 80, 570 200
                               Q 570 220, 550 230
                               Q 480 250, 400 255
                               Q 325 258, 250 255
                               Q 170 250, 100 230
                               Q 80 220, 80 200
                               Z"
                            fill="url(#gumGradient)"
                            filter="url(#gumShadow)"
                            stroke="hsl(350, 40%, 60%)"
                            strokeWidth="1.5"
                            opacity="0.95"
                        />

                        {/* Upper Gum Inner (palate) */}
                        <path
                            d="M 130 190
                               Q 130 110, 200 95
                               Q 260 85, 325 85
                               Q 390 85, 450 95
                               Q 520 110, 520 190
                               Q 515 205, 490 215
                               Q 430 230, 380 232
                               Q 325 233, 270 232
                               Q 220 230, 160 215
                               Q 135 205, 130 190
                               Z"
                            fill="hsl(200, 35%, 96%)"
                            opacity="0.7"
                        />

                        {/* Lower Gum - Horseshoe Shape */}
                        <path
                            d="M 80 380
                               Q 80 500, 180 520
                               Q 280 535, 325 535
                               Q 370 535, 470 520
                               Q 570 500, 570 380
                               Q 570 360, 550 350
                               Q 480 330, 400 325
                               Q 325 322, 250 325
                               Q 170 330, 100 350
                               Q 80 360, 80 380
                               Z"
                            fill="url(#gumGradient)"
                            filter="url(#gumShadow)"
                            stroke="hsl(350, 40%, 60%)"
                            strokeWidth="1.5"
                            opacity="0.95"
                        />

                        {/* Lower Gum Inner */}
                        <path
                            d="M 130 390
                               Q 130 470, 200 485
                               Q 260 495, 325 495
                               Q 390 495, 450 485
                               Q 520 470, 520 390
                               Q 515 375, 490 365
                               Q 430 350, 380 348
                               Q 325 347, 270 348
                               Q 220 350, 160 365
                               Q 135 375, 130 390
                               Z"
                            fill="hsl(200, 35%, 96%)"
                            opacity="0.7"
                        />

                        {/* Center separation (opening between teeth) */}
                        <rect
                            x="315"
                            y="255"
                            width="20"
                            height="70"
                            fill="hsl(0, 0%, 100%)"
                            opacity="0.3"
                            rx="2"
                        />
                    </svg>

                    {/* Upper Teeth */}
                    {upperTeeth.map((num, index) => {
                        const position = getUpperToothPosition(
                            index,
                            upperTeeth.length
                        );
                        return (
                            <Tooth
                                key={num}
                                number={num}
                                type={toothTypes[num]}
                                isSelected={selectedTeeth.includes(num)}
                                onSelect={handleToothSelect}
                                position={position}
                                rotation={position.rotation}
                                readOnly={readOnly}
                            />
                        );
                    })}

                    {/* Lower Teeth */}
                    {lowerTeeth.map((num, index) => {
                        const position = getLowerToothPosition(
                            index,
                            lowerTeeth.length
                        );
                        return (
                            <Tooth
                                key={num}
                                number={num}
                                type={toothTypes[num]}
                                isSelected={selectedTeeth.includes(num)}
                                onSelect={handleToothSelect}
                                position={position}
                                rotation={position.rotation}
                                readOnly={readOnly}
                            />
                        );
                    })}

                    {/* Arch Labels */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                        Upper Arch
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                        Lower Arch
                    </div>
                </div>
            </Card>

            {/* Selected Teeth Info */}
            {selectedTeeth.size > 0 && (
                <Card className="p-4 bg-blue-50 border-blue-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm text-gray-900">
                            Selected Teeth
                        </h3>
                        <Button
                            onClick={clearSelection}
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                        >
                            Clear
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {Array.from(selectedTeeth)
                            .sort((a, b) => a - b)
                            .map((num) => (
                                <Badge
                                    key={num}
                                    variant="default"
                                    className="text-xs px-2 py-0.5 cursor-pointer hover:bg-blue-600 transition-colors"
                                    onClick={() => handleToothSelect(num)}
                                >
                                    #{num}
                                </Badge>
                            ))}
                    </div>
                </Card>
            )}

            {/* Tooth Type Legend */}
            <Card className="p-4 bg-white border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Tooth Types
                    </h3>
                    <span className="text-xs text-gray-500">
                        Click teeth to select
                    </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded flex-shrink-0" />
                        <div>
                            <span className="text-gray-800 font-medium block">
                                Incisors
                            </span>
                            <span className="text-gray-500 text-xs">
                                7-10, 23-26
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-4 h-4 bg-white border-2 border-gray-400 rounded flex-shrink-0" />
                        <div>
                            <span className="text-gray-800 font-medium block">
                                Canines
                            </span>
                            <span className="text-gray-500 text-xs">
                                6, 11, 22, 27
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-4 h-4 bg-white border-2 border-gray-500 rounded flex-shrink-0" />
                        <div>
                            <span className="text-gray-800 font-medium block">
                                Premolars
                            </span>
                            <span className="text-gray-500 text-xs">
                                4-5, 12-13, 20-21, 28-29
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="w-4 h-4 bg-white border-2 border-gray-600 rounded flex-shrink-0" />
                        <div>
                            <span className="text-gray-800 font-medium block">
                                Molars
                            </span>
                            <span className="text-gray-500 text-xs">
                                1-3, 14-16, 17-19, 30-32
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 bg-blue-500 rounded flex-shrink-0" />
                        <span className="text-gray-600">
                            Selected teeth appear in blue
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ImprovedDentalChart;
