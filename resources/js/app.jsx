import "../css/app.css";
import "./bootstrap";
import "./echo";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { route } from "ziggy-js";

// Make route function available globally
window.route = route;

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

// Update CSRF token in meta tag and axios when Inertia page loads
const updateCsrfToken = () => {
    // Get the CSRF token from Inertia props if available
    if (window.getCsrfToken && typeof window.getCsrfToken === "function") {
        const token = window.getCsrfToken();
        if (token) {
            // Update axios defaults
            if (window.axios?.defaults) {
                window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
            }
        }
    }
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Update CSRF token before rendering
        updateCsrfToken();

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

// Update CSRF token after Inertia navigation
window.addEventListener("beforeunload", () => {
    updateCsrfToken();
});
