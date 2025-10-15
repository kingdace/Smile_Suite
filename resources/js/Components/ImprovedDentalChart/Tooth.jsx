import { cn } from "@/lib/utils";

const Tooth = ({
    number,
    isSelected,
    onSelect,
    type = "molar",
    rotation = 0,
    position,
    readOnly = false,
}) => {
    const getToothPath = () => {
        switch (type) {
            case "incisor":
                return "M20 2C14 2 10 6 10 10C10 13 9 17 10 22C11 27 13 34 20 34C27 34 29 27 30 22C31 17 30 13 30 10C30 6 26 2 20 2Z";
            case "canine":
                return "M20 2C13 2 9 6 9 11C9 15 8 19 10 24C12 29 15 34 20 34C25 34 28 29 30 24C32 19 31 15 31 11C31 6 27 2 20 2Z";
            case "premolar":
                return "M20 2C12 2 8 6 8 12C8 16 8 20 10 25C12 30 15 34 20 34C25 34 28 30 30 25C32 20 32 16 32 12C32 6 28 2 20 2Z";
            case "molar":
                return "M20 2C11 2 6 6 6 12C6 18 6 22 8 27C10 32 14 34 20 34C26 34 30 32 32 27C34 22 34 18 34 12C34 6 29 2 20 2Z M14 8C14 7 16 6 20 6C24 6 26 7 26 8";
            default:
                // Fallback to molar shape if type is undefined or invalid
                return "M20 2C11 2 6 6 6 12C6 18 6 22 8 27C10 32 14 34 20 34C26 34 30 32 32 27C34 22 34 18 34 12C34 6 29 2 20 2Z M14 8C14 7 16 6 20 6C24 6 26 7 26 8";
        }
    };

    const getToothColors = () => {
        if (isSelected) {
            return {
                fill: "fill-blue-500",
                stroke: "stroke-blue-600",
                hover: "fill-blue-600 stroke-blue-700",
            };
        }

        // Professional dental chart colors - all white with subtle border variations
        switch (type) {
            case "incisor":
                return {
                    fill: "fill-white",
                    stroke: "stroke-gray-300",
                    hover: "fill-gray-50 stroke-gray-400",
                };
            case "canine":
                return {
                    fill: "fill-white",
                    stroke: "stroke-gray-400",
                    hover: "fill-gray-50 stroke-gray-500",
                };
            case "premolar":
                return {
                    fill: "fill-white",
                    stroke: "stroke-gray-500",
                    hover: "fill-gray-50 stroke-gray-600",
                };
            case "molar":
                return {
                    fill: "fill-white",
                    stroke: "stroke-gray-600",
                    hover: "fill-gray-50 stroke-gray-700",
                };
            default:
                return {
                    fill: "fill-white",
                    stroke: "stroke-gray-300",
                    hover: "fill-gray-50 stroke-gray-400",
                };
        }
    };

    return (
        <button
            onClick={() => !readOnly && onSelect(number)}
            style={{
                position: "absolute",
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            }}
            className={cn(
                "group transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg",
                readOnly
                    ? "cursor-default"
                    : "hover:scale-110 hover:z-20 cursor-pointer"
            )}
            aria-label={`Tooth ${number}`}
            disabled={readOnly}
        >
            <div className="flex flex-col items-center gap-1">
                {/* Tooth SVG */}
                <div
                    className={cn(
                        "relative transition-all duration-300",
                        "drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)]",
                        "group-hover:drop-shadow-[0_2px_8px_rgba(0,120,180,0.2)]",
                        isSelected &&
                            "drop-shadow-[0_3px_10px_rgba(0,120,180,0.4)]"
                    )}
                >
                    <svg
                        width="36"
                        height="40"
                        viewBox="0 0 40 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-all duration-300"
                    >
                        <path
                            d={getToothPath()}
                            className={cn(
                                "transition-all duration-300",
                                isSelected
                                    ? getToothColors().fill +
                                          " " +
                                          getToothColors().stroke
                                    : getToothColors().fill +
                                          " " +
                                          getToothColors().stroke +
                                          " group-hover:" +
                                          getToothColors().hover
                            )}
                            strokeWidth="1.5"
                        />
                        {/* Root line */}
                        <line
                            x1="20"
                            y1="20"
                            x2="20"
                            y2="32"
                            className={cn(
                                "transition-all duration-300",
                                isSelected
                                    ? "stroke-white/20"
                                    : "stroke-gray-300/30"
                            )}
                            strokeWidth="0.5"
                        />
                    </svg>

                    {/* Selection indicator */}
                    {isSelected && (
                        <div className="absolute inset-0 rounded-lg bg-blue-500/10 animate-pulse" />
                    )}
                </div>

                {/* Tooth number */}
                <span
                    className={cn(
                        "text-[10px] font-semibold transition-colors duration-300 whitespace-nowrap px-1.5 py-0.5 rounded border",
                        isSelected
                            ? "bg-blue-500 text-white border-blue-600"
                            : "text-gray-700 bg-white border-gray-300 group-hover:bg-gray-50 group-hover:border-gray-400"
                    )}
                >
                    {number}
                </span>
            </div>
        </button>
    );
};

export default Tooth;
