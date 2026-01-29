import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./atoms-ui/harnesses/**/*.{js,ts,jsx,tsx}",
        "./atoms-ui/canvas/**/*.{js,ts,jsx,tsx}",
        "./atoms-ui/ui-atoms/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
export default config;
