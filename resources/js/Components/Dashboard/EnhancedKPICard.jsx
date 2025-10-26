import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    Users,
    Heart,
    Activity,
    Clock,
    Star,
    Zap,
    Target,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

const EnhancedKPICard = ({
    title,
    value,
    previousValue,
    trend,
    trendDirection = "up",
    icon,
    type = "default",
    loading = false,
    onClick,
    className = "",
    subtitle,
    progress,
    unit = "",
    format = "number",
    compact = false,
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const controls = useAnimation();

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
        shadow: "shadow-lg hover:shadow-xl",
    };

    // Animate counter
    useEffect(() => {
        if (loading) return;

        const duration = 1500; // 1.5 seconds
        const steps = 50;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value, loading]);

    // Format value based on type
    const formatValue = (val) => {
        if (format === "currency") {
            return `₱${val.toLocaleString()}`;
        } else if (format === "percentage") {
            return `${val}%`;
        } else if (format === "decimal") {
            return val.toFixed(1);
        } else {
            return val.toLocaleString();
        }
    };

    // Calculate trend percentage
    const trendPercentage = previousValue
        ? Math.abs(((value - previousValue) / previousValue) * 100)
        : 0;

    const getIcon = () => {
        if (icon) return icon;

        switch (type) {
            case "revenue":
                return <DollarSign className="h-5 w-5" />;
            case "appointments":
                return <Calendar className="h-5 w-5" />;
            case "patients":
                return <Users className="h-5 w-5" />;
            case "satisfaction":
                return <Heart className="h-5 w-5" />;
            case "efficiency":
                return <Activity className="h-5 w-5" />;
            case "time":
                return <Clock className="h-5 w-5" />;
            case "rating":
                return <Star className="h-5 w-5" />;
            case "performance":
                return <Zap className="h-5 w-5" />;
            case "target":
                return <Target className="h-5 w-5" />;
            case "analytics":
                return <BarChart3 className="h-5 w-5" />;
            default:
                return <Activity className="h-5 w-5" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
        >
            <Card
                className={`relative overflow-hidden border-0 ${colorScheme.shadow} transition-all duration-300 cursor-pointer group border border-blue-100/50 ${className}`}
                onClick={onClick}
            >
                {/* Enhanced Background Pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full -translate-y-12 translate-x-12 opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full translate-y-8 -translate-x-8 opacity-5 group-hover:opacity-15 transition-all duration-700"></div>

                <CardContent className={`relative ${compact ? "p-4" : "p-5"}`}>
                    <div className="flex flex-col items-center gap-3 text-center">
                        {/* Icon */}
                        <motion.div
                            className={`w-12 h-12 bg-gradient-to-br ${colorScheme.primary} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0`}
                            whileHover={{ rotate: 5 }}
                        >
                            <div className="text-white">{getIcon()}</div>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 w-full">
                            {/* Title */}
                            <h3
                                className={`text-xs font-medium text-gray-600 mb-1 leading-tight`}
                            >
                                {title}
                            </h3>

                            {/* Value */}
                            <motion.div
                                className={`text-xl font-bold text-gray-900 mb-1 leading-tight truncate`}
                                key={displayValue}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {loading ? (
                                    <div className="animate-pulse bg-blue-200 h-6 w-16 rounded" />
                                ) : (
                                    <>
                                        {formatValue(displayValue)}
                                        {unit && (
                                            <span className="text-sm ml-1">
                                                {unit}
                                            </span>
                                        )}
                                    </>
                                )}
                            </motion.div>

                            {/* Subtitle with Status Indicator */}
                            {subtitle && (
                                <div className="flex items-center justify-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] text-blue-600 font-medium truncate">
                                        {subtitle}
                                    </span>
                                </div>
                            )}

                            {/* Trend Badge - centered below subtitle */}
                            {trend && (
                                <div className="mt-1 flex justify-center">
                                    <Badge
                                        className={`${
                                            trendDirection === "up"
                                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                : "bg-red-100 text-red-700 border-red-200"
                                        } text-[10px] font-medium px-1.5 py-0.5 border`}
                                    >
                                        {trendDirection === "up" ? (
                                            <ArrowUpRight className="h-2.5 w-2.5 mr-0.5" />
                                        ) : (
                                            <ArrowDownRight className="h-2.5 w-2.5 mr-0.5" />
                                        )}
                                        {trendPercentage.toFixed(1)}%
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                    />
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default EnhancedKPICard;
