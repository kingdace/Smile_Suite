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

// Add response interceptor to handle 419 CSRF errors
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 419 CSRF token mismatch errors
        if (
            error.response?.status === 419 &&
            error.config &&
            !error.config._retry
        ) {
            // Mark this request as retried to prevent infinite loops
            error.config._retry = true;

            try {
                // Fetch a fresh CSRF token from Laravel
                const response = await axios.get("/sanctum/csrf-cookie", {
                    withCredentials: true,
                });

                // Update meta tag with new token if available
                const metaTag = document.querySelector(
                    'meta[name="csrf-token"]'
                );
                const newToken = metaTag?.getAttribute("content");

                if (newToken) {
                    updateCsrfToken(newToken);
                }

                // Retry the original request
                return axios.request(error.config);
            } catch (refreshError) {
                console.error("Failed to refresh CSRF token:", refreshError);
                // If refresh fails, reject with original error
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

// Helper function to update CSRF token
function updateCsrfToken(token) {
    // Update meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        metaTag.setAttribute("content", token);
    }

    // Update axios defaults
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
}
