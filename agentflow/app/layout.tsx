import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";

const roboto = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  axes: ["wdth"], // Ensure width axis is available
});

export const metadata: Metadata = {
  title: "Multi 2¹ Designer",
  description: "Pre-factory UI for Multi 2¹ component",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
