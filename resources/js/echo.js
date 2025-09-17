import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configure Pusher
window.Pusher = Pusher;

// Create Echo instance
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusherapp.com`,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    
    // Authentication
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
    },
    
    // Authorization endpoint
    authEndpoint: '/broadcasting/auth',
    
    // Connection options
    enableStats: false,
    enableLogging: import.meta.env.DEV,
});

// Connection event handlers
window.Echo.connector.pusher.connection.bind('connected', () => {
    console.log('Echo: Connected to Pusher');
});

window.Echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('Echo: Disconnected from Pusher');
});

window.Echo.connector.pusher.connection.bind('error', (error) => {
    console.error('Echo: Connection error', error);
});

// Reconnection logic
window.Echo.connector.pusher.connection.bind('unavailable', () => {
    console.warn('Echo: Connection unavailable, attempting to reconnect...');
    
    // Attempt to reconnect after a delay
    setTimeout(() => {
        if (window.Echo.connector.pusher.connection.state === 'unavailable') {
            window.Echo.connector.pusher.connect();
        }
    }, 5000);
});

// Export Echo instance for use in components
export default window.Echo;
