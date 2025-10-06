import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import {
    BarChart,
    LineChart,
    PieChart,
    TrendingUp,
    Activity,
    Target,
    Calendar,
    Zap,
    BarChart3,
    PieChart as PieChartIcon,
    RefreshCw,
    Maximize2,
} from "lucide-react";

const AdvancedChart = ({
    data,
    type = "line",
    title,
    subtitle,
    height = 280,
    showLegend = true,
    showTooltip = true,
    interactive = true,
    className = "",
    onDataPointClick,
    customColors = [],
    compact = false,
    ...chartProps
}) => {
    const [activeChart, setActiveChart] = useState(type);

    // Validate and sanitize data
    const validatedData = useMemo(() => {
        if (!data || !Array.isArray(data)) {
            // Return default empty data structure based on chart type
            if (type === "pie") {
                return [{ id: "No Data", value: 1, color: "#E5E7EB" }];
            } else {
                return [{ id: "No Data", data: [{ x: "No Data", y: 0 }] }];
            }
        }

        // Ensure data has the correct structure
        return data.map((item) => {
            if (type === "pie") {
                return {
                    id: item.id || "Unknown",
                    value: typeof item.value === "number" ? item.value : 0,
                    color: item.color || "#3B82F6",
                };
            } else {
                return {
                    id: item.id || "Unknown",
                    data: Array.isArray(item.data)
                        ? item.data.map((point) => ({
                              x: point.x || "Unknown",
                              y: typeof point.y === "number" ? point.y : 0,
                          }))
                        : [{ x: "No Data", y: 0 }],
                };
            }
        });
    }, [data, type]);

    // Subtle Blue Color Scheme
    const colorScheme = {
        primary: "#3B82F6",
        secondary: "#1D4ED8",
        accent: "#60A5FA",
        light: "#DBEAFE",
        gradient: ["#3B82F6", "#1D4ED8", "#1E40AF", "#1E3A8A", "#1E3A8A"],
        background: "from-blue-50 to-blue-100",
        text: "text-blue-900",
        textLight: "text-blue-700",
        border: "border-blue-200",
        cardBg: "bg-white",
    };

    const colors =
        customColors.length > 0 ? customColors : colorScheme.gradient;

    // Chart type configurations
    const chartTypes = {
        line: {
            icon: <LineChart className="h-4 w-4" />,
            component: ResponsiveLine,
            name: "Line Chart",
        },
        bar: {
            icon: <BarChart className="h-4 w-4" />,
            component: ResponsiveBar,
            name: "Bar Chart",
        },
        pie: {
            icon: <PieChartIcon className="h-4 w-4" />,
            component: ResponsivePie,
            name: "Pie Chart",
        },
    };

    const currentChart = chartTypes[activeChart];
    const ChartComponent = currentChart?.component;

    // Default chart configurations
    const getDefaultConfig = (chartType) => {
        const baseConfig = {
            colors: colors,
            margin: { top: 20, right: 20, bottom: 40, left: 40 },
            animate: true,
            motionConfig: "gentle",
            theme: {
                background: "transparent",
                text: {
                    fontSize: 11,
                    fill: "#1E40AF",
                    fontFamily: "Inter, sans-serif",
                },
                axis: {
                    domain: {
                        line: {
                            stroke: "#E0E7FF",
                            strokeWidth: 1,
                        },
                    },
                    legend: {
                        text: {
                            fontSize: 11,
                            fill: "#1E40AF",
                        },
                    },
                    ticks: {
                        line: {
                            stroke: "#E0E7FF",
                            strokeWidth: 1,
                        },
                        text: {
                            fontSize: 10,
                            fill: "#64748B",
                        },
                    },
                },
                grid: {
                    line: {
                        stroke: "#F1F5F9",
                        strokeWidth: 1,
                    },
                },
                tooltip: {
                    container: {
                        background: "white",
                        color: "#1E40AF",
                        fontSize: 12,
                        borderRadius: 8,
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #E0E7FF",
                    },
                },
            },
        };

        switch (chartType) {
            case "line":
                return {
                    ...baseConfig,
                    enablePoints: true,
                    pointSize: 4,
                    pointBorderWidth: 2,
                    pointBorderColor: { from: "serieColor" },
                    pointLabelYOffset: -12,
                    useMesh: true,
                    enableSlices: "x",
                    lineWidth: 2,
                    sliceTooltip: ({ slice }) => (
                        <div className="bg-white p-3 rounded-lg shadow-lg border border-blue-200">
                            <div className="text-sm font-medium mb-2 text-blue-900">
                                {slice.points[0]?.data.x}
                            </div>
                            {slice.points.map((point, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 text-xs"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: point.serieColor,
                                        }}
                                    />
                                    <span className="text-blue-700">
                                        {point.serieId}: {point.data.y}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ),
                };
            case "bar":
                return {
                    ...baseConfig,
                    enableLabel: true,
                    labelSkipWidth: 12,
                    labelSkipHeight: 12,
                    labelTextColor: {
                        from: "color",
                        modifiers: [["darker", 1.6]],
                    },
                    borderRadius: 3,
                    borderWidth: 0,
                };
            case "pie":
                return {
                    ...baseConfig,
                    innerRadius: 0.6,
                    padAngle: 0.5,
                    cornerRadius: 2,
                    borderWidth: 1,
                    borderColor: {
                        from: "color",
                        modifiers: [["darker", 0.6]],
                    },
                    radialLabelsSkipAngle: 10,
                    radialLabelsTextXOffset: 6,
                    radialLabelsTextColor: "#1E40AF",
                    radialLabelsLinkOffset: 0,
                    radialLabelsLinkDiagonalLength: 16,
                    radialLabelsLinkHorizontalLength: 24,
                    radialLabelsLinkStrokeWidth: 2,
                    radialLabelsLinkColor: { from: "color" },
                    sliceLabelsSkipAngle: 10,
                    sliceLabelsTextColor: "#1E40AF",
                };
            default:
                return baseConfig;
        }
    };

    const chartConfig = useMemo(
        () => ({
            ...getDefaultConfig(activeChart),
            ...chartProps,
        }),
        [activeChart, chartProps, colors, colorScheme]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={className}
        >
            <Card
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${colorScheme.cardBg}`}
            >
                <CardHeader className={`${compact ? "pb-2" : "pb-3"}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle
                                className={`${
                                    compact ? "text-sm" : "text-base"
                                } font-semibold ${
                                    colorScheme.text
                                } leading-tight`}
                            >
                                {title}
                            </CardTitle>
                            {subtitle && (
                                <p
                                    className={`text-xs ${colorScheme.textLight} mt-0.5 leading-tight`}
                                >
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Chart Controls */}
                        <div className="flex items-center gap-2">
                            <Badge
                                className={`${colorScheme.border} ${colorScheme.textLight} bg-blue-50`}
                            >
                                {currentChart.icon}
                                <span className="ml-1 text-xs">
                                    {currentChart.name}
                                </span>
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className={`pt-0 ${compact ? "p-4" : "p-5"}`}>
                    <div style={{ height: `${height}px` }} className="relative">
                        {ChartComponent && (
                            <ChartComponent
                                data={validatedData}
                                {...chartConfig}
                                onClick={onDataPointClick}
                            />
                        )}

                        {/* Loading Overlay */}
                        {!data && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {/* No Data Message */}
                        {data &&
                            (!Array.isArray(data) || data.length === 0) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center text-blue-600">
                                        <div className="text-sm font-medium">
                                            No Data Available
                                        </div>
                                        <div className="text-xs text-blue-500 mt-1">
                                            Data will appear when available
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AdvancedChart;
