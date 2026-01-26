import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        colors: {
            black: '#000000',
            white: '#ffffff',
        },
        extend: {
            fontFamily: {
                roboto: ['var(--font-roboto)'],
            },
        },
    },
    plugins: [],
};
export default config;
