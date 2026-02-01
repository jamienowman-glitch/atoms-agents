import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google"; // User mandated Variable Font
import "../lib/fonts/roboto-presets"; // Ensure fonts load if needed
import "./globals.css";

// Configure Roboto Flex with all axes requested
const robotoFlex = Roboto_Flex({
    subsets: ["latin"],
    variable: "--font-roboto-flex",
    axes: ["slnt", "wdth", "GRAD", "opsz"]
});

export const metadata: Metadata = {
    title: "Atoms UI",
    description: "Atoms UI Scaffold",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased bg-neutral-50 dark:bg-neutral-950 ${robotoFlex.className}`}>
                {children}
            </body>
        </html>
    );
}
