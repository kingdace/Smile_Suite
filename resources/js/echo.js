import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Configure Pusher
window.Pusher = Pusher;

// Get Pusher config from meta tag or environment variables
const getPusherKey = () => {
    // Try to get from meta tag first (injected by Laravel)
    const metaKey = document
        .querySelector('meta[name="pusher-key"]')
        ?.getAttribute("content");
    if (metaKey) return metaKey;

    // Fallback to environment variable
    return import.meta.env.VITE_PUSHER_APP_KEY;
};

const getPusherCluster = () => {
    const metaCluster = document
        .querySelector('meta[name="pusher-cluster"]')
        ?.getAttribute("content");
    if (metaCluster) return metaCluster;
    return import.meta.env.VITE_PUSHER_APP_CLUSTER ?? "mt1";
};

const pusherKey = getPusherKey();
const pusherCluster = getPusherCluster();

// Only initialize Echo if Pusher key is available
if (!pusherKey) {
    console.warn("Pusher key not found. Real-time features will be disabled.");
    // Create a dummy Echo instance to prevent errors
    window.Echo = {
        channel: () => ({ listen: () => ({}) }),
        private: () => ({ listen: () => ({}) }),
        join: () => ({ listen: () => ({}) }),
        leave: () => {},
        disconnect: () => {},
    };
} else {
    // Create Echo instance
    window.Echo = new Echo({
        broadcaster: "pusher",
        key: pusherKey,
        cluster: pusherCluster,
        wsHost: import.meta.env.VITE_PUSHER_HOST
            ? import.meta.env.VITE_PUSHER_HOST
            : `ws-${pusherCluster}.pusherapp.com`,
        wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
        wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? "https") === "https",
        enabledTransports: ["ws", "wss"],

        // Authentication
        auth: {
            headers: {
                "X-CSRF-TOKEN": document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content"),
            },
        },

        // Authorization endpoint
        authEndpoint: "/broadcasting/auth",

        // Connection options
        enableStats: false,
        enableLogging: import.meta.env.DEV,
    });
}

// Connection event handlers (only if real Echo instance exists)
if (window.Echo && window.Echo.connector && window.Echo.connector.pusher) {
    window.Echo.connector.pusher.connection.bind("connected", () => {
        console.log("Echo: Connected to Pusher");
    });

    window.Echo.connector.pusher.connection.bind("disconnected", () => {
        console.log("Echo: Disconnected from Pusher");
    });

    window.Echo.connector.pusher.connection.bind("error", (error) => {
        console.error("Echo: Connection error", error);
    });

    // Reconnection logic
    window.Echo.connector.pusher.connection.bind("unavailable", () => {
        console.warn(
            "Echo: Connection unavailable, attempting to reconnect..."
        );

        // Attempt to reconnect after a delay
        setTimeout(() => {
            if (
                window.Echo.connector.pusher.connection.state === "unavailable"
            ) {
                window.Echo.connector.pusher.connect();
            }
        }, 5000);
    });
}

// Export Echo instance for use in components
export default window.Echo;
