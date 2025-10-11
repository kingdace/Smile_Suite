import React, { useState, useRef, useEffect } from "react";
import {
    MessageCircle,
    X,
    Send,
    Smile,
    Bot,
    User,
    Phone,
    Calendar,
    MapPin,
    Clock,
    Loader2,
    Heart,
    Stethoscope,
    Info,
    CreditCard,
    HelpCircle,
} from "lucide-react";

// Custom SmileyDy Video Component
const SmileyDyIcon = ({ className = "w-6 h-6", isOpen = false }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            // Ensure video plays and loops infinitely
            const playVideo = () => {
                video.play().catch((e) => console.log("Video play failed:", e));
            };

            // Play immediately when loaded
            playVideo();

            // Handle any interruptions
            const handleEnded = () => {
                video.currentTime = 0;
                playVideo();
            };

            const handlePause = () => {
                playVideo();
            };

            video.addEventListener("ended", handleEnded);
            video.addEventListener("pause", handlePause);

            return () => {
                video.removeEventListener("ended", handleEnded);
                video.removeEventListener("pause", handlePause);
            };
        }
    }, []);

    return (
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700">
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={(e) => e.target.play()}
                onEnded={(e) => {
                    e.target.currentTime = 0;
                    e.target.play();
                }}
                onError={(e) => console.log("Video error:", e)}
                onCanPlay={(e) => e.target.play()}
                style={{
                    imageRendering: "crisp-edges",
                    WebkitImageRendering: "crisp-edges",
                    imageRendering: "pixelated",
                }}
            >
                <source src="/icons/smiley-video.mp4" type="video/mp4" />
                <source src="/icons/smiley-video.webm" type="video/webm" />
                {/* Fallback image if video fails to load */}
                <img
                    src="/icons/smiley.png"
                    alt="SmileyDy - Dental AI Assistant"
                    className="w-full h-full object-contain"
                    style={{
                        imageRendering: "crisp-edges",
                        WebkitImageRendering: "crisp-edges",
                    }}
                />
            </video>
        </div>
    );
};

// Alternative: Animated GIF Component (if you prefer GIF)
const SmileyDyGifIcon = ({ className = "w-6 h-6" }) => (
    <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700">
        <img
            src="/icons/smiley-animated.gif"
            alt="SmileyDy - Dental AI Assistant"
            className="w-full h-full object-contain"
        />
    </div>
);

const SmileyDy = ({ position = "left" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "bot",
            content:
                "Hi! I'm SmileyDy 😊 How can I help you find the perfect dental clinic today?",
            timestamp: new Date(),
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickActions = [
        { icon: Calendar, text: "Book Appointment", action: "book" },
        { icon: MapPin, text: "Find Clinics", action: "find" },
        { icon: Stethoscope, text: "Dental Services", action: "services" },
        { icon: Info, text: "Platform Info", action: "platform" },
        { icon: User, text: "Patient Portal", action: "patient" },
        { icon: CreditCard, text: "Payment Methods", action: "payment" },
        { icon: Phone, text: "Contact Info", action: "contact" },
        { icon: HelpCircle, text: "Help & Support", action: "help" },
    ];

    const handleQuickAction = (action) => {
        let message = "";
        switch (action) {
            case "book":
                message = "how do I book an appointment?";
                break;
            case "find":
                message = "find clinics near me";
                break;
            case "services":
                message = "what dental services are available?";
                break;
            case "platform":
                message = "tell me about Smile Suite platform";
                break;
            case "patient":
                message = "how does patient registration work?";
                break;
            case "payment":
                message = "what payment methods do you accept?";
                break;
            case "contact":
                message = "how can I contact a clinic?";
                break;
            case "help":
                message = "I need help with something";
                break;
        }

        // Add the message to chat and send it directly
        addMessage("user", message);

        // Send the message to the API (without setting input field)
        sendMessageToAPI(message);
    };

    const sendMessageToAPI = async (message) => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            addMessage("bot", data.response);
        } catch (error) {
            console.error("Chatbot error:", error);
            addMessage(
                "bot",
                "Sorry, I'm having trouble right now. Please try again or contact us directly!"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const addMessage = (type, content) => {
        const newMessage = {
            id: Date.now(),
            type,
            content,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage("");
        addMessage("user", userMessage);

        // Send the message to the API
        sendMessageToAPI(userMessage);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button - Mobile Optimized */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-4 sm:bottom-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 group transform hover:scale-105 active:scale-95 flex items-center justify-center ${
                    position === "right"
                        ? "right-4 sm:right-6"
                        : "left-4 sm:left-6"
                } ${isOpen ? "rotate-90" : ""}`}
                style={{
                    boxShadow: "0 8px 32px rgba(6, 182, 212, 0.4)",
                    borderRadius: "50%",
                    aspectRatio: "1/1",
                    imageRendering: "crisp-edges",
                    WebkitImageRendering: "crisp-edges",
                }}
            >
                {isOpen ? (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg animate-pulse">
                        <X className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg group-hover:rotate-90 transition-transform duration-300" />
                    </div>
                ) : (
                    <SmileyDyIcon
                        className="w-8 h-8 sm:w-10 sm:h-10 mx-auto group-hover:scale-110 transition-transform duration-300"
                        isOpen={isOpen}
                    />
                )}
            </button>

            {/* Floating Interactive Text - Centered with Chatbot */}
            {!isOpen && (
                <div
                    className={`fixed bottom-20 z-40 flex items-center hidden sm:flex ${
                        position === "right" ? "right-2" : "left-2"
                    }`}
                >
                    <div className="bg-white/95 backdrop-blur-sm rounded-md px-2 py-1.5 shadow-lg border border-cyan-100">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                            <p className="text-xs font-medium text-gray-700">
                                Need help? 😊
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Window - Mobile Optimized */}
            {isOpen && (
                <div
                    className={`fixed bottom-20 sm:bottom-24 w-auto sm:w-80 h-[24rem] sm:h-[28rem] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-100 z-40 flex flex-col overflow-hidden backdrop-blur-sm ${
                        position === "right"
                            ? "right-2 sm:right-6 sm:left-auto"
                            : "left-2 right-2 sm:left-6 sm:right-auto"
                    }`}
                >
                    {/* Header - Ultra Compact */}
                    <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 p-1.5 sm:p-2 text-white">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                <SmileyDyIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-xs sm:text-sm truncate">
                                    SmileyDy
                                </h3>
                                <p className="text-blue-100 text-xs truncate">
                                    Dental assistant
                                </p>
                            </div>
                            <div className="ml-auto">
                                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Messages - Mobile Optimized */}
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 sm:space-y-2 bg-gray-50/50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.type === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[90%] sm:max-w-[85%] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${
                                        message.type === "user"
                                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-md shadow-sm"
                                            : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        {message.type === "bot" && (
                                            <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <SmileyDyIcon className="w-4 h-4" />
                                            </div>
                                        )}
                                        {message.type === "user" && (
                                            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                                            {message.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                                            <SmileyDyIcon className="w-4 h-4" />
                                        </div>
                                        <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                                        <span className="text-sm text-gray-600">
                                            SmileyDy is typing...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions Toggle Menu - Ultra Compact */}
                    <div className="px-2 sm:px-3 py-1.5 sm:py-2 border-t border-gray-100 bg-white">
                        {/* Toggle Button - Compact */}
                        <button
                            onClick={() =>
                                setShowQuickActions(!showQuickActions)
                            }
                            className="w-full flex items-center justify-center gap-1.5 p-1.5 sm:p-2 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 text-cyan-700 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm border border-cyan-100 active:scale-95"
                        >
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 bg-cyan-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        +
                                    </span>
                                </div>
                                <span className="font-medium text-xs">
                                    Quick Actions
                                </span>
                            </div>
                            <div
                                className={`transform transition-transform duration-200 ${
                                    showQuickActions ? "rotate-45" : ""
                                }`}
                            >
                                <div className="w-3 h-3 bg-cyan-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                        +
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* Quick Actions Grid - Ultra Compact */}
                        {showQuickActions && (
                            <div className="mt-2 grid grid-cols-4 gap-1 sm:gap-1.5 animate-in slide-in-from-top-2 duration-200">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            handleQuickAction(action.action);
                                            setShowQuickActions(false);
                                        }}
                                        className="flex flex-col items-center gap-1 p-1.5 sm:p-2 text-xs bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 text-cyan-700 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm border border-cyan-100 active:scale-95"
                                    >
                                        <action.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span className="font-medium text-xs leading-tight text-center">
                                            {action.text}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input - Ultra Compact */}
                    <div className="p-1.5 sm:p-2 border-t border-gray-100 bg-white">
                        <div className="flex gap-1 sm:gap-1.5">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                                placeholder="Ask SmileyDy anything..."
                                className="flex-1 p-1.5 sm:p-2 border border-gray-200 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-xs sm:text-sm bg-gray-50 focus:bg-white transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md sm:rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                            >
                                <Send className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SmileyDy;
