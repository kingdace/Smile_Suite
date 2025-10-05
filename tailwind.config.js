const defaultTheme = require("tailwindcss/defaultTheme");
const forms = require("@tailwindcss/forms");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: [
                    "InterVariable",
                    "Inter",
                    "Figtree",
                    ...defaultTheme.fontFamily.sans,
                ],
                inter: [
                    "InterVariable",
                    "Inter",
                    ...defaultTheme.fontFamily.sans,
                ],
            },
            keyframes: {
                "accordion-down": {
                    from: {
                        height: 0,
                    },
                    to: {
                        height: "var(--radix-accordion-content-height)",
                    },
                },
                "accordion-up": {
                    from: {
                        height: "var(--radix-accordion-content-height)",
                    },
                    to: {
                        height: 0,
                    },
                },
                shimmer: {
                    "0%": {
                        transform: "translateX(-100%)",
                    },
                    "100%": {
                        transform: "translateX(100%)",
                    },
                },
                "fade-in": {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(10px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },
                "slide-in-up": {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(20px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },
                "slide-in-down": {
                    "0%": {
                        opacity: 0,
                        transform: "translateY(-20px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateY(0)",
                    },
                },
                "slide-in-left": {
                    "0%": {
                        opacity: 0,
                        transform: "translateX(-20px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateX(0)",
                    },
                },
                "slide-in-right": {
                    "0%": {
                        opacity: 0,
                        transform: "translateX(20px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateX(0)",
                    },
                },
                "scale-in": {
                    "0%": {
                        opacity: 0,
                        transform: "scale(0.9)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "scale(1)",
                    },
                },
                "bounce-in": {
                    "0%": {
                        opacity: 0,
                        transform: "scale(0.3)",
                    },
                    "50%": {
                        opacity: 1,
                        transform: "scale(1.05)",
                    },
                    "70%": {
                        transform: "scale(0.9)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "scale(1)",
                    },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                shimmer: "shimmer 2s infinite",
                "fade-in": "fade-in 0.5s ease-out",
                "slide-in-up": "slide-in-up 0.5s ease-out",
                "slide-in-down": "slide-in-down 0.5s ease-out",
                "slide-in-left": "slide-in-left 0.5s ease-out",
                "slide-in-right": "slide-in-right 0.5s ease-out",
                "scale-in": "scale-in 0.3s ease-out",
                "bounce-in": "bounce-in 0.6s ease-out",
            },
        },
    },

    plugins: [
        forms,
        require("tailwindcss-animate"),
        require("@tailwindcss/line-clamp"),
    ],
};
