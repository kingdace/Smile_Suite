import axios from "axios";
window.axios = axios;

// Configure axios defaults
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true; // Important for CSRF and cookies

/**
 * Configure axios to automatically send CSRF token
 * Laravel expects the token from either:
 * 1. The XSRF-TOKEN cookie (automatically sent by axios)
 * 2. The X-CSRF-TOKEN header (for custom requests)
 */
// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
if (csrfToken) {
    // Set CSRF token in axios defaults for all POST/PUT/DELETE/PATCH requests
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
}

// Create a helper function to get fresh CSRF token
window.getCsrfToken = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute("content") : null;
};

// Add response interceptor to handle 419 CSRF errors gracefully
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 419 CSRF token mismatch errors
        if (error.response?.status === 419) {
            console.warn("CSRF token mismatch (419). This usually means:");
            console.warn(
                "1. Your session has expired - please refresh the page"
            );
            console.warn(
                "2. The CSRF token in the page doesn't match the server token"
            );

            // Show user-friendly error message
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Session expired. Please refresh the page and try again.";

            // Don't try to auto-fix this - user needs to refresh the page
            // The meta tag will have a fresh token after page reload
            console.error("CSRF Error Details:", {
                url: error.config?.url,
                message: errorMessage,
            });
        }

        return Promise.reject(error);
    }
);
