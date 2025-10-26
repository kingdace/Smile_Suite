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
            } else if (type === "bar") {
                return [{ x: "No Data", y: 0 }];
            } else {
                return [{ id: "No Data", data: [{ x: "No Data", y: 0 }] }];
            }
        }

        // Ensure data has the correct structure
        if (type === "bar") {
            // For bar charts, flatten the data structure
            const flattenedData = [];
            data.forEach((series) => {
                if (Array.isArray(series.data)) {
                    series.data.forEach((point) => {
                        flattenedData.push({
                            x: point.x || "Unknown",
                            y: typeof point.y === "number" ? point.y : 0,
                        });
                    });
                }
            });
            return flattenedData.length > 0
                ? flattenedData
                : [{ x: "No Data", y: 0 }];
        } else if (type === "pie") {
            return data.map((item) => ({
                id: item.id || "Unknown",
                value: typeof item.value === "number" ? item.value : 0,
                color: item.color || "#3B82F6",
            }));
        } else {
            // For line charts, keep the original structure
            return data.map((item) => ({
                id: item.id || "Unknown",
                data: Array.isArray(item.data)
                    ? item.data.map((point) => ({
                          x: point.x || "Unknown",
                          y: typeof point.y === "number" ? point.y : 0,
                      }))
                    : [{ x: "No Data", y: 0 }],
            }));
        }
    }, [data, type]);

    // Dynamic Color Scheme based on chart type
    const getColorScheme = () => {
        const schemes = {
            revenue: {
                primary: "#10B981",
                secondary: "#059669",
                accent: "#34D399",
                light: "#D1FAE5",
                gradient: [
                    "#10B981",
                    "#059669",
                    "#047857",
                    "#065F46",
                    "#064E3B",
                ],
                background: "from-emerald-50 to-emerald-100",
                text: "text-emerald-900",
                textLight: "text-emerald-700",
                border: "border-emerald-200",
                cardBg: "bg-white",
            },
            service: {
                primary: "#8B5CF6",
                secondary: "#7C3AED",
                accent: "#A78BFA",
                light: "#EDE9FE",
                gradient: [
                    "#8B5CF6",
                    "#7C3AED",
                    "#6D28D9",
                    "#5B21B6",
                    "#4C1D95",
                ],
                background: "from-purple-50 to-purple-100",
                text: "text-purple-900",
                textLight: "text-purple-700",
                border: "border-purple-200",
                cardBg: "bg-white",
            },
            appointments: {
                primary: "#3B82F6",
                secondary: "#1D4ED8",
                accent: "#60A5FA",
                light: "#DBEAFE",
                gradient: [
                    "#3B82F6",
                    "#1D4ED8",
                    "#1E40AF",
                    "#1E3A8A",
                    "#1E3A8A",
                ],
                background: "from-blue-50 to-blue-100",
                text: "text-blue-900",
                textLight: "text-blue-700",
                border: "border-blue-200",
                cardBg: "bg-white",
            },
            default: {
                primary: "#3B82F6",
                secondary: "#1D4ED8",
                accent: "#60A5FA",
                light: "#DBEAFE",
                gradient: [
                    "#3B82F6",
                    "#1D4ED8",
                    "#1E40AF",
                    "#1E3A8A",
                    "#1E3A8A",
                ],
                background: "from-blue-50 to-blue-100",
                text: "text-blue-900",
                textLight: "text-blue-700",
                border: "border-blue-200",
                cardBg: "bg-white",
            },
        };

        // Determine scheme based on title
        const titleLower = title?.toLowerCase() || "";
        if (titleLower.includes("revenue")) {
            return schemes.revenue;
        } else if (
            titleLower.includes("service") ||
            titleLower.includes("distribution")
        ) {
            return schemes.service;
        } else if (titleLower.includes("appointment")) {
            return schemes.appointments;
        }
        return schemes.default;
    };

    const colorScheme = getColorScheme();

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
                        <div
                            className={`bg-white p-3 rounded-lg shadow-lg border ${colorScheme.border}`}
                        >
                            <div
                                className={`text-sm font-medium mb-2 ${colorScheme.text}`}
                            >
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
                                    <span className={colorScheme.textLight}>
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
                    keys: ["y"], // Use 'y' as the value key
                    indexBy: "x", // Use 'x' as the index key
                    minValue: 0,
                    padding: 0.1, // Add padding between bars
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
                    // Arc labels (numbers inside slices)
                    enableArcLabels: true,
                    arcLabelsSkipAngle: 10,
                    arcLabelsTextColor: "#FFFFFF",
                    arcLabelsRadiusOffset: 0.4,
                    // Radial labels (labels outside)
                    radialLabelsSkipAngle: 10,
                    radialLabelsTextXOffset: 6,
                    radialLabelsTextColor: "#FFFFFF",
                    radialLabelsLinkOffset: 0,
                    radialLabelsLinkDiagonalLength: 16,
                    radialLabelsLinkHorizontalLength: 24,
                    radialLabelsLinkStrokeWidth: 2,
                    radialLabelsLinkColor: { from: "color" },
                    // Legacy slice labels (for compatibility)
                    sliceLabelsSkipAngle: 10,
                    sliceLabelsTextColor: "#FFFFFF",
                };
            default:
                return baseConfig;
        }
    };

    // Calculate dynamic values for bar charts
    const barChartMaxValue = useMemo(() => {
        if (
            activeChart === "bar" &&
            validatedData &&
            Array.isArray(validatedData)
        ) {
            const maxValue = Math.max(...validatedData.map((d) => d.y || 0), 0);
            return maxValue > 0 ? maxValue : null;
        }
        return null;
    }, [activeChart, validatedData]);

    const chartConfig = useMemo(() => {
        const baseConfig = getDefaultConfig(activeChart);

        // Add dynamic bar chart configurations if needed
        if (activeChart === "bar" && barChartMaxValue !== null) {
            // Determine if this is Revenue chart (has peso symbol) or Appointments chart (numbers only)
            const isRevenueChart = title?.toLowerCase().includes("revenue");

            return {
                ...baseConfig,
                // Add more padding to the top for better visualization
                maxValue: barChartMaxValue * 1.3,
                // Add minimum height to ensure bars are tall enough for labels
                // Use 20% of max value to ensure even the smallest bars are very visible
                minValue: barChartMaxValue > 0 ? -barChartMaxValue * 0.2 : 0,
                // Enable labels with conditional formatting
                label: (d) => {
                    if (isRevenueChart) {
                        // For Revenue: show peso symbol
                        return d.value > 1000
                            ? `₱${(d.value / 1000).toFixed(1)}k`
                            : `₱${d.value.toFixed(0)}`;
                    } else {
                        // For Appointments: show numbers only
                        return d.value.toString();
                    }
                },
                // Show labels on all bars regardless of size
                labelSkipWidth: 0,
                labelSkipHeight: 0,
                // Add border to ensure bars are visible even when very small
                borderWidth: 1,
                borderColor: colors[0],
                // Add custom label positioning
                labelTextColor: "white",
                labelPosition: "insideTop",
                // Add padding to prevent clipping
                valueScale: { type: "linear", min: "auto", max: "auto" },
            };
        }

        return {
            ...baseConfig,
            ...chartProps,
        };
    }, [activeChart, chartProps, colors, colorScheme, barChartMaxValue, title]);

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
                                className={`${colorScheme.border} ${colorScheme.textLight} bg-gradient-to-r ${colorScheme.background}`}
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
                                <div
                                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                                    style={{ borderColor: colorScheme.primary }}
                                ></div>
                            </div>
                        )}

                        {/* No Data Message */}
                        {data &&
                            (!Array.isArray(data) || data.length === 0) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className={`text-center ${colorScheme.textMuted}`}
                                    >
                                        <div className="text-sm font-medium">
                                            No Data Available
                                        </div>
                                        <div
                                            className={`text-xs ${colorScheme.textLight} mt-1`}
                                        >
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
