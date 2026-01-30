import type { Metadata } from "next";
import localFont from "next/font/local";
import "../lib/fonts/roboto-presets"; // Ensure fonts load if needed
import "./globals.css";

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
            <body className="antialiased bg-neutral-50 dark:bg-neutral-950">
                {children}
            </body>
        </html>
    );
}
