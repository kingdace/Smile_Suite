import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
            }
        }
    },
    server: {
        host: "10.188.96.70",
        port: 5173,
        hmr: {
            host: "10.188.96.70", // Default to localhost for normal dev
        },
        cors: true,
        strictPort: true,
        watch: {
            usePolling: true,
        },
    },
});

