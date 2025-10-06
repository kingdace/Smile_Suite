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
                className={`relative overflow-hidden border-0 ${colorScheme.shadow} transition-all duration-300 cursor-pointer group ${colorScheme.cardBg} ${className}`}
                onClick={onClick}
            >
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-blue-100/20 opacity-50" />

                {/* Animated Background Elements */}
                <motion.div
                    className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-blue-500/10 rounded-full"
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                <CardContent className={`relative ${compact ? "p-4" : "p-5"}`}>
                    <div className="flex items-center justify-between mb-3">
                        {/* Icon */}
                        <motion.div
                            className={`w-10 h-10 bg-gradient-to-br ${colorScheme.primary} rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}
                            whileHover={{ rotate: 5 }}
                        >
                            <div className="text-white">{getIcon()}</div>
                        </motion.div>

                        {/* Trend Badge */}
                        {trend && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Badge
                                    className={`${
                                        trendDirection === "up"
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                    } text-xs font-medium shadow-sm`}
                                >
                                    {trendDirection === "up" ? (
                                        <ArrowUpRight className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-3 w-3 mr-1" />
                                    )}
                                    {trendPercentage.toFixed(1)}%
                                </Badge>
                            </motion.div>
                        )}
                    </div>

                    {/* Title */}
                    <h3
                        className={`text-sm font-medium ${colorScheme.textLight} mb-1`}
                    >
                        {title}
                    </h3>

                    {/* Value */}
                    <motion.div
                        className={`${
                            compact ? "text-xl" : "text-2xl"
                        } font-bold ${colorScheme.text} mb-1`}
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
                                    <span className="text-lg ml-1">{unit}</span>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Subtitle */}
                    {subtitle && (
                        <p className={`text-xs ${colorScheme.textMuted} mb-2`}>
                            {subtitle}
                        </p>
                    )}

                    {/* Progress Bar */}
                    {progress !== undefined && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className={colorScheme.textMuted}>
                                    Progress
                                </span>
                                <span
                                    className={`font-medium ${colorScheme.textLight}`}
                                >
                                    {progress}%
                                </span>
                            </div>
                            <Progress
                                value={progress}
                                className="h-1.5 bg-blue-100"
                            />
                        </div>
                    )}

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
