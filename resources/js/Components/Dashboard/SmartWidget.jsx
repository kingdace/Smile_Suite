import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    Calendar,
    Users,
    Clock,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Star,
    Heart,
    Zap,
    Activity,
    Bell,
    ChevronRight,
    MoreVertical,
    Eye,
    EyeOff,
    RefreshCw,
    Settings,
    ArrowUpRight,
} from "lucide-react";

const SmartWidget = ({
    title,
    subtitle,
    type = "default",
    data = [],
    loading = false,
    compact = false,
    interactive = true,
    onRefresh,
    onSettings,
    onViewAll,
    className = "",
    children,
}) => {
    const [isExpanded] = useState(true);
    // Subtle Blue Color Scheme
    const colorScheme = {
        primary: "from-blue-500 to-blue-600",
        secondary: "from-blue-50 to-blue-100",
        accent: "from-blue-400 to-blue-500",
        text: "text-blue-900",
        textLight: "text-blue-700",
        textMuted: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        icon: "text-blue-600",
        progress: "bg-blue-500",
        cardBg: "bg-white",
        headerBg: "from-blue-500 to-blue-600",
    };

    // Widget type configurations
    const widgetTypes = {
        appointments: {
            icon: <Calendar className="h-4 w-4" />,
            bgGradient: "from-blue-500 to-blue-600",
        },
        patients: {
            icon: <Users className="h-4 w-4" />,
            bgGradient: "from-blue-500 to-blue-600",
        },
        alerts: {
            icon: <Bell className="h-4 w-4" />,
            bgGradient: "from-blue-500 to-blue-600",
        },
        performance: {
            icon: <Activity className="h-4 w-4" />,
            bgGradient: "from-blue-500 to-blue-600",
        },
        satisfaction: {
            icon: <Heart className="h-4 w-4" />,
            bgGradient: "from-blue-500 to-blue-600",
        },
        efficiency: {
            icon: <Zap className="h-4 w-4" />,
            bgGradient: "from-blue-500 to-blue-600",
        },
    };

    const widgetConfig = widgetTypes[type] || widgetTypes.appointments;

    const renderDataItem = (item, index) => {
        if (type === "appointments") {
            return (
                <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-blue-100"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {item.patient?.first_name?.charAt(0) || "P"}
                        </div>
                        <div>
                            <p className="font-medium text-blue-900 text-sm">
                                {item.patient?.first_name}{" "}
                                {item.patient?.last_name}
                            </p>
                            <p className="text-xs text-blue-600">
                                {item.appointment_type?.name || "General"}
                            </p>
                            {new Date(item.scheduled_at).toDateString() !==
                                new Date().toDateString() && (
                                <p className="text-xs text-blue-500 mt-0.5">
                                    {new Date(
                                        item.scheduled_at
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-blue-900">
                            {new Date(item.scheduled_at).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                            )}
                        </p>
                        <Badge
                            className={`text-xs ${
                                item.appointment_status_id === 2
                                    ? "bg-emerald-100 text-emerald-700"
                                    : item.appointment_status_id === 1
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {item.appointment_status_id === 2
                                ? "Confirmed"
                                : item.appointment_status_id === 1
                                ? "Pending"
                                : "Unknown"}
                        </Badge>
                    </div>
                </motion.div>
            );
        }

        if (type === "patients") {
            return (
                <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-blue-100"
                >
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                            {item.first_name?.charAt(0) || "P"}
                        </div>
                        <div>
                            <p className="font-medium text-blue-900 text-sm">
                                {item.first_name} {item.last_name}
                            </p>
                            <p className="text-xs text-blue-600">
                                {new Date(item.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                        New
                    </Badge>
                </motion.div>
            );
        }

        if (type === "alerts") {
            return (
                <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-blue-100"
                >
                    <div className="flex items-center space-x-3">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                item.type === "warning"
                                    ? "bg-amber-500"
                                    : item.type === "error"
                                    ? "bg-red-500"
                                    : "bg-emerald-500"
                            }`}
                        >
                            {item.type === "warning" ? (
                                <AlertTriangle className="h-4 w-4 text-white" />
                            ) : item.type === "error" ? (
                                <AlertTriangle className="h-4 w-4 text-white" />
                            ) : (
                                <CheckCircle className="h-4 w-4 text-white" />
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-blue-900 text-sm">
                                {item.title}
                            </p>
                            <p className="text-xs text-blue-600">
                                {item.message}
                            </p>
                        </div>
                    </div>
                    <Badge
                        className={`text-xs ${
                            item.type === "warning"
                                ? "bg-amber-100 text-amber-700"
                                : item.type === "error"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                        {item.type}
                    </Badge>
                </motion.div>
            );
        }

        return (
            <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-blue-50/50 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-blue-100"
            >
                {JSON.stringify(item)}
            </motion.div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={className}
        >
            <Card
                className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${colorScheme.cardBg} overflow-hidden`}
            >
                {/* Header */}
                <CardHeader
                    className={`bg-gradient-to-r ${
                        widgetConfig.bgGradient
                    } text-white ${compact ? "py-2" : "py-3"}`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg border border-white/30">
                                {widgetConfig.icon}
                            </div>
                            <div>
                                <CardTitle
                                    className={`${
                                        compact ? "text-sm" : "text-base"
                                    } font-bold text-white leading-tight`}
                                >
                                    {title}
                                </CardTitle>
                                {subtitle && (
                                    <p className="text-white/80 text-xs font-medium leading-tight">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            {/* Settings Button */}
                            {onSettings && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onSettings}
                                    className="text-white hover:bg-white/20 border-white/30 h-7 w-7 p-0"
                                >
                                    <Settings className="h-3 w-3" />
                                </Button>
                            )}

                            {/* View All Button */}
                            {onViewAll && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onViewAll}
                                    className="border-white/50 text-white hover:bg-white/30 backdrop-blur-sm bg-white/10 h-7 px-2 text-xs"
                                >
                                    View All
                                    <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent className={`${compact ? "p-3" : "p-4"}`}>
                    {loading ? (
                        <div className="space-y-2">
                            {Array.from(
                                { length: type === "appointments" ? 5 : 4 },
                                (_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="flex items-center justify-between p-3 bg-blue-50/30 rounded-lg border border-blue-100/50">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-200/50 rounded-full"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-blue-200/50 rounded w-24"></div>
                                                    <div className="h-3 bg-blue-200/30 rounded w-16"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-4 bg-blue-200/50 rounded w-12"></div>
                                                <div className="h-5 bg-blue-200/30 rounded w-16"></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : children ? (
                        children
                    ) : (
                        <div className="space-y-2">
                            {/* Show 5 items for appointments, 4 for others */}
                            {Array.from(
                                { length: type === "appointments" ? 5 : 4 },
                                (_, index) => {
                                    const item = data && data[index];

                                    if (item) {
                                        return renderDataItem(item, index);
                                    } else {
                                        // Optimized skeleton placeholder for empty slots
                                        return (
                                            <motion.div
                                                key={`skeleton-${index}`}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                }}
                                                className="flex items-center justify-center p-2.5 bg-blue-50/20 rounded-lg border border-blue-100/30"
                                            >
                                                <div className="flex items-center space-x-2.5">
                                                    <div className="w-6 h-6 bg-blue-200/40 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-blue-300/60 rounded-full"></div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-xs text-blue-500 font-medium leading-tight">
                                                            No data yet
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    }
                                }
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default SmartWidget;
