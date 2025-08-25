import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Circle, Square, X, Eye, Info } from "lucide-react";

export default function DentalChart({
    selectedTeeth = [],
    onTeethChange,
    className = "",
}) {
    const [hoveredTooth, setHoveredTooth] = useState(null);
    const [showLegend, setShowLegend] = useState(false);

    // Dental chart configuration with realistic tooth types
    const upperTeeth = [
        { number: 1, name: "Right Third Molar", type: "molar", quadrant: "UR" },
        {
            number: 2,
            name: "Right Second Molar",
            type: "molar",
            quadrant: "UR",
        },
        { number: 3, name: "Right First Molar", type: "molar", quadrant: "UR" },
        {
            number: 4,
            name: "Right Second Premolar",
            type: "premolar",
            quadrant: "UR",
        },
        {
            number: 5,
            name: "Right First Premolar",
            type: "premolar",
            quadrant: "UR",
        },
        { number: 6, name: "Right Canine", type: "canine", quadrant: "UR" },
        {
            number: 7,
            name: "Right Lateral Incisor",
            type: "incisor",
            quadrant: "UR",
        },
        {
            number: 8,
            name: "Right Central Incisor",
            type: "incisor",
            quadrant: "UR",
        },
        {
            number: 9,
            name: "Left Central Incisor",
            type: "incisor",
            quadrant: "UL",
        },
        {
            number: 10,
            name: "Left Lateral Incisor",
            type: "incisor",
            quadrant: "UL",
        },
        { number: 11, name: "Left Canine", type: "canine", quadrant: "UL" },
        {
            number: 12,
            name: "Left First Premolar",
            type: "premolar",
            quadrant: "UL",
        },
        {
            number: 13,
            name: "Left Second Premolar",
            type: "premolar",
            quadrant: "UL",
        },
        { number: 14, name: "Left First Molar", type: "molar", quadrant: "UL" },
        {
            number: 15,
            name: "Left Second Molar",
            type: "molar",
            quadrant: "UL",
        },
        { number: 16, name: "Left Third Molar", type: "molar", quadrant: "UL" },
    ];

    const lowerTeeth = [
        { number: 17, name: "Left Third Molar", type: "molar", quadrant: "LL" },
        {
            number: 18,
            name: "Left Second Molar",
            type: "molar",
            quadrant: "LL",
        },
        { number: 19, name: "Left First Molar", type: "molar", quadrant: "LL" },
        {
            number: 20,
            name: "Left Second Premolar",
            type: "premolar",
            quadrant: "LL",
        },
        {
            number: 21,
            name: "Left First Premolar",
            type: "premolar",
            quadrant: "LL",
        },
        { number: 22, name: "Left Canine", type: "canine", quadrant: "LL" },
        {
            number: 23,
            name: "Left Lateral Incisor",
            type: "incisor",
            quadrant: "LL",
        },
        {
            number: 24,
            name: "Left Central Incisor",
            type: "incisor",
            quadrant: "LL",
        },
        {
            number: 25,
            name: "Right Central Incisor",
            type: "incisor",
            quadrant: "LR",
        },
        {
            number: 26,
            name: "Right Lateral Incisor",
            type: "incisor",
            quadrant: "LR",
        },
        { number: 27, name: "Right Canine", type: "canine", quadrant: "LR" },
        {
            number: 28,
            name: "Right First Premolar",
            type: "premolar",
            quadrant: "LR",
        },
        {
            number: 29,
            name: "Right Second Premolar",
            type: "premolar",
            quadrant: "LR",
        },
        {
            number: 30,
            name: "Right First Molar",
            type: "molar",
            quadrant: "LR",
        },
        {
            number: 31,
            name: "Right Second Molar",
            type: "molar",
            quadrant: "LR",
        },
        {
            number: 32,
            name: "Right Third Molar",
            type: "molar",
            quadrant: "LR",
        },
    ];

    const handleToothClick = (toothNumber) => {
        const newSelectedTeeth = selectedTeeth.includes(toothNumber)
            ? selectedTeeth.filter((t) => t !== toothNumber)
            : [...selectedTeeth, toothNumber];

        onTeethChange(newSelectedTeeth);
    };

    const isToothSelected = (toothNumber) =>
        selectedTeeth.includes(toothNumber);

    // Enhanced SVG tooth shapes with realistic anatomy
    const getToothSVG = (type, isSelected, isHovered) => {
        const baseClasses = "transition-all duration-200 cursor-pointer";
        const selectedClasses = isSelected
            ? "fill-blue-500 stroke-blue-600 stroke-2 shadow-lg"
            : "fill-white stroke-gray-400 stroke-1";
        const hoverClasses =
            isHovered && !isSelected
                ? "fill-blue-50 stroke-blue-400 stroke-2 shadow-md"
                : "";

        switch (type) {
            case "molar":
                return (
                    <svg
                        width="32"
                        height="36"
                        viewBox="0 0 32 36"
                        className={`${baseClasses} ${selectedClasses} ${hoverClasses}`}
                    >
                        {/* Main tooth body with realistic shape */}
                        <path
                            d="M4 8C4 6.89543 4.89543 6 6 6H26C27.1046 6 28 6.89543 28 8V26C28 27.1046 27.1046 28 26 28H6C4.89543 28 4 27.1046 4 26V8Z"
                            fill={isSelected ? "#DBEAFE" : "#FFFFFF"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth={isSelected ? "2" : "1"}
                        />

                        {/* Occlusal surface with realistic cusps */}
                        <path
                            d="M6 8L8 6L12 6L16 8L20 6L24 6L26 8L26 12L24 14L20 12L16 14L12 12L8 14L6 12V8Z"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />

                        {/* Central fossa */}
                        <ellipse
                            cx="16"
                            cy="10"
                            rx="3"
                            ry="2"
                            fill={isSelected ? "#93C5FD" : "#E5E7EB"}
                        />

                        {/* Cusps - more realistic positioning */}
                        <circle
                            cx="10"
                            cy="8"
                            r="1.5"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />
                        <circle
                            cx="22"
                            cy="8"
                            r="1.5"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />
                        <circle
                            cx="8"
                            cy="12"
                            r="1.5"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />
                        <circle
                            cx="24"
                            cy="12"
                            r="1.5"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />

                        {/* Marginal ridges */}
                        <path
                            d="M6 8H26"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />
                        <path
                            d="M6 24H26"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />

                        {/* Root with realistic shape */}
                        <path
                            d="M8 28C8 28 10 32 12 34C14 32 16 34 18 32C20 34 22 32 24 28"
                            fill={isSelected ? "#DBEAFE" : "#F9FAFB"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth="1"
                        />
                        <path
                            d="M10 30L12 34L14 30"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                        <path
                            d="M18 30L20 34L22 30"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                    </svg>
                );
            case "premolar":
                return (
                    <svg
                        width="28"
                        height="36"
                        viewBox="0 0 28 36"
                        className={`${baseClasses} ${selectedClasses} ${hoverClasses}`}
                    >
                        {/* Main tooth body with realistic shape */}
                        <path
                            d="M3 8C3 6.89543 3.89543 6 5 6H23C24.1046 6 25 6.89543 25 8V26C25 27.1046 24.1046 28 23 28H5C3.89543 28 3 27.1046 3 26V8Z"
                            fill={isSelected ? "#DBEAFE" : "#FFFFFF"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth={isSelected ? "2" : "1"}
                        />

                        {/* Occlusal surface with realistic cusps */}
                        <path
                            d="M5 8L7 6L11 6L14 8L17 6L21 6L23 8L23 12L21 14L17 12L14 14L11 12L7 14L5 12V8Z"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />

                        {/* Central fossa */}
                        <ellipse
                            cx="14"
                            cy="10"
                            rx="2.5"
                            ry="1.5"
                            fill={isSelected ? "#93C5FD" : "#E5E7EB"}
                        />

                        {/* Cusps - more realistic positioning */}
                        <circle
                            cx="9"
                            cy="8"
                            r="1.2"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />
                        <circle
                            cx="19"
                            cy="8"
                            r="1.2"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />
                        <circle
                            cx="7"
                            cy="12"
                            r="1.2"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />
                        <circle
                            cx="21"
                            cy="12"
                            r="1.2"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                        />

                        {/* Marginal ridges */}
                        <path
                            d="M5 8H23"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />
                        <path
                            d="M5 24H23"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />

                        {/* Root with realistic shape */}
                        <path
                            d="M7 28C7 28 9 32 11 34C13 32 15 34 17 32C19 34 21 32 23 28"
                            fill={isSelected ? "#DBEAFE" : "#F9FAFB"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth="1"
                        />
                        <path
                            d="M9 30L11 34L13 30"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                        <path
                            d="M17 30L19 34L21 30"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                    </svg>
                );
            case "canine":
                return (
                    <svg
                        width="24"
                        height="36"
                        viewBox="0 0 24 36"
                        className={`${baseClasses} ${selectedClasses} ${hoverClasses}`}
                    >
                        {/* Main tooth body with realistic shape */}
                        <path
                            d="M4 8C4 6.89543 4.89543 6 6 6H18C19.1046 6 20 6.89543 20 8V26C20 27.1046 19.1046 28 18 28H6C4.89543 28 4 27.1046 4 26V8Z"
                            fill={isSelected ? "#DBEAFE" : "#FFFFFF"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth={isSelected ? "2" : "1"}
                        />

                        {/* Occlusal surface with pointed cusp */}
                        <path
                            d="M6 8L10 4L14 4L18 8L18 12L14 16L10 16L6 12V8Z"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />

                        {/* Main cusp */}
                        <path
                            d="M10 4L12 2L14 4"
                            fill={isSelected ? "#93C5FD" : "#D1D5DB"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />

                        {/* Central ridge */}
                        <path
                            d="M11 8H13V22H11V8Z"
                            fill={isSelected ? "#93C5FD" : "#E5E7EB"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />

                        {/* Marginal ridges */}
                        <path
                            d="M4 8H20"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />
                        <path
                            d="M4 24H20"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />

                        {/* Root with realistic shape */}
                        <path
                            d="M6 28C6 28 8 32 10 34C12 32 14 34 16 32C18 34 20 32 20 28"
                            fill={isSelected ? "#DBEAFE" : "#F9FAFB"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth="1"
                        />
                        <path
                            d="M8 30L10 34L12 30"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                        <path
                            d="M16 30L18 34L20 30"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                    </svg>
                );
            case "incisor":
                return (
                    <svg
                        width="20"
                        height="36"
                        viewBox="0 0 20 36"
                        className={`${baseClasses} ${selectedClasses} ${hoverClasses}`}
                    >
                        {/* Main tooth body with realistic shape */}
                        <path
                            d="M2 8C2 6.89543 2.89543 6 4 6H16C17.1046 6 18 6.89543 18 8V24C18 25.1046 17.1046 26 16 26H4C2.89543 26 2 25.1046 2 24V8Z"
                            fill={isSelected ? "#DBEAFE" : "#FFFFFF"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth={isSelected ? "2" : "1"}
                        />

                        {/* Occlusal surface with incisal edge */}
                        <path
                            d="M4 8L6 6L10 6L14 6L16 8L16 10L14 12L10 12L6 10L4 8Z"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />

                        {/* Incisal edge detail */}
                        <path
                            d="M6 6L10 6L14 6"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />

                        {/* Central ridge */}
                        <path
                            d="M9 10H11V22H9V10Z"
                            fill={isSelected ? "#93C5FD" : "#E5E7EB"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />

                        {/* Marginal ridges */}
                        <path
                            d="M2 8H18"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />
                        <path
                            d="M2 22H18"
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="1"
                            fill="none"
                        />

                        {/* Root with realistic shape */}
                        <path
                            d="M4 26C4 26 6 30 8 32C10 30 12 32 14 30C16 32 18 30 18 26"
                            fill={isSelected ? "#DBEAFE" : "#F9FAFB"}
                            stroke={isSelected ? "#3B82F6" : "#D1D5DB"}
                            strokeWidth="1"
                        />
                        <path
                            d="M6 28L8 32L10 28"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                        <path
                            d="M14 28L16 32L18 28"
                            fill={isSelected ? "#BFDBFE" : "#F3F4F6"}
                            stroke={isSelected ? "#2563EB" : "#9CA3AF"}
                            strokeWidth="0.5"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className={`${baseClasses} ${selectedClasses} ${hoverClasses}`}
                    >
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                );
        }
    };

    const ToothButton = ({ tooth, isUpper = true }) => (
        <div className="relative group">
            <div
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isToothSelected(tooth.number)
                        ? "bg-blue-100 border-2 border-blue-500 shadow-lg scale-110 ring-2 ring-blue-200"
                        : "hover:bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:scale-105"
                }`}
                onClick={() => handleToothClick(tooth.number)}
                onMouseEnter={() => setHoveredTooth(tooth)}
                onMouseLeave={() => setHoveredTooth(null)}
            >
                <div className="relative w-6 h-6 flex items-center justify-center">
                    {getToothSVG(
                        tooth.type,
                        isToothSelected(tooth.number),
                        hoveredTooth?.number === tooth.number
                    )}
                </div>
                <span
                    className={`text-xs font-bold ${
                        isToothSelected(tooth.number)
                            ? "text-blue-600"
                            : "text-gray-600"
                    }`}
                >
                    {tooth.number}
                </span>
            </div>

            {/* Tooltip */}
            {hoveredTooth?.number === tooth.number && (
                <div className="absolute z-20 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap -top-16 left-1/2 transform -translate-x-1/2">
                    <div className="font-medium">{tooth.name}</div>
                    <div className="text-xs text-gray-300 capitalize">
                        {tooth.type} • Quadrant {tooth.quadrant}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
        </div>
    );

    const getQuadrantColor = (quadrant) => {
        switch (quadrant) {
            case "UR":
                return "bg-red-100 text-red-800 border-red-200";
            case "UL":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "LL":
                return "bg-green-100 text-green-800 border-green-200";
            case "LR":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className={className}>
            <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-100">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 text-blue-800 font-bold">
                            <Circle className="h-5 w-5" />
                            Dental Chart - Tooth Selection
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowLegend(!showLegend)}
                            className="flex items-center gap-2 bg-white hover:bg-blue-50"
                        >
                            <Info className="h-4 w-4" />
                            {showLegend ? "Hide" : "Show"} Legend
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                    {/* Legend */}
                    {showLegend && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 space-y-3 border border-gray-200">
                            <h4 className="font-bold text-gray-800 text-base">
                                Dental Chart Legend
                            </h4>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                                    <div className="w-6 h-6 relative">
                                        {getToothSVG("molar", false, false)}
                                    </div>
                                    <span className="text-xs font-medium">
                                        Molars (1-3, 14-16, 17-19, 30-32)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                                    <div className="w-6 h-6 relative">
                                        {getToothSVG("premolar", false, false)}
                                    </div>
                                    <span className="text-xs font-medium">
                                        Premolars (4-5, 12-13, 20-21, 28-29)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                                    <div className="w-6 h-6 relative">
                                        {getToothSVG("canine", false, false)}
                                    </div>
                                    <span className="text-xs font-medium">
                                        Canines (6, 11, 22, 27)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm">
                                    <div className="w-6 h-6 relative">
                                        {getToothSVG("incisor", false, false)}
                                    </div>
                                    <span className="text-xs font-medium">
                                        Incisors (7-10, 23-26)
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quadrant Labels */}
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="space-y-2">
                            <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 text-xs font-medium">
                                Upper Right (UR)
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-xs font-medium">
                                Upper Left (UL)
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-xs font-medium">
                                Lower Left (LL)
                            </Badge>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 text-xs font-medium">
                                Lower Right (LR)
                            </Badge>
                        </div>
                    </div>

                    {/* Upper Teeth */}
                    <div className="space-y-2">
                        <h4 className="text-base font-bold text-gray-800 text-center border-b border-gray-200 pb-2">
                            Upper Teeth (Maxillary)
                        </h4>
                        <div className="flex justify-center gap-1">
                            {upperTeeth.map((tooth) => (
                                <ToothButton
                                    key={tooth.number}
                                    tooth={tooth}
                                    isUpper={true}
                                />
                            ))}
                        </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Lower Teeth */}
                    <div className="space-y-2">
                        <h4 className="text-base font-bold text-gray-800 text-center border-b border-gray-200 pb-2">
                            Lower Teeth (Mandibular)
                        </h4>
                        <div className="flex justify-center gap-1">
                            {lowerTeeth.map((tooth) => (
                                <ToothButton
                                    key={tooth.number}
                                    tooth={tooth}
                                    isUpper={false}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Selected Teeth Summary */}
                    {selectedTeeth.length > 0 && (
                        <div className="space-y-3">
                            <Separator className="my-3" />
                            <h4 className="text-base font-bold text-gray-800">
                                Selected Teeth ({selectedTeeth.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                {selectedTeeth
                                    .sort((a, b) => a - b)
                                    .map((toothNumber) => {
                                        const tooth = [
                                            ...upperTeeth,
                                            ...lowerTeeth,
                                        ].find((t) => t.number === toothNumber);
                                        return (
                                            <div
                                                key={toothNumber}
                                                className={`p-2 rounded-lg border shadow-sm ${getQuadrantColor(
                                                    tooth?.quadrant
                                                )}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 relative">
                                                        {getToothSVG(
                                                            tooth?.type ||
                                                                "molar",
                                                            true,
                                                            false
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-xs">
                                                            #{toothNumber}
                                                        </div>
                                                        <div className="text-xs opacity-80">
                                                            {tooth?.name}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 hover:bg-red-100"
                                                        onClick={() =>
                                                            handleToothClick(
                                                                toothNumber
                                                            )
                                                        }
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="text-center text-xs text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-200">
                        <p className="font-semibold mb-1 text-blue-800">
                            How to use:
                        </p>
                        <p className="mb-1">
                            Click teeth to select/deselect • Numbers follow
                            universal dental notation
                        </p>
                        <p className="text-xs text-blue-600">
                            Professional SVG tooth shapes with realistic anatomy
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
