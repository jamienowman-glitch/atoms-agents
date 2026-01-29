import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "../../harnesses/**/*.{js,ts,jsx,tsx,mdx}",
        "../../canvases/**/*.{js,ts,jsx,tsx,mdx}",
        "../../ui-atoms/**/*.{js,ts,jsx,tsx,mdx}",
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
