import "../css/app.css";
import "./bootstrap";
import "./echo";

import { createInertiaApp } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { route } from "ziggy-js";

// Make route function available globally
window.route = route;

const appName = import.meta.env.VITE_APP_NAME || "Smile Suite";

// Update CSRF token in meta tag and axios when token changes
const updateCsrfToken = (token) => {
    if (!token) return;

    // Update meta tag
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        metaTag.setAttribute("content", token);
    }

    // Update axios defaults
    if (window.axios?.defaults) {
        window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token;
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

        // Update CSRF token from props if available
        if (props.csrf_token) {
            updateCsrfToken(props.csrf_token);
        }

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

// Listen for Inertia page updates to refresh CSRF token
router.on("success", (event) => {
    // When page props are updated, check for new CSRF token
    if (event.detail.page?.props?.csrf_token) {
        updateCsrfToken(event.detail.page.props.csrf_token);
    }
});
