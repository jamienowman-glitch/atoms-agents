import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./harnesses/**/*.{js,ts,jsx,tsx}",
        "./canvas/**/*.{js,ts,jsx,tsx}",
        "./canvases/multi21/_atoms/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
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
