import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. Roboto Flex (The Workhorse)
// Supports: GRAD, XOPQ, XTRA, YOPQ, YTAS, YTDE, YTFI, YTLC, YTUC, opsz, slnt, wdth, wght
const robotoFlex = localFont({
  src: "../public/fonts/RobotoFlex-VariableFont_GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght.ttf",
  variable: "--font-roboto-flex",
  display: "swap",
});

// 2. Roboto Serif
// Supports: GRAD, opsz, wdth, wght
const robotoSerif = localFont({
  src: [
    {
      path: "../public/fonts/RobotoSerif-VariableFont_GRAD,opsz,wdth,wght.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/RobotoSerif-Italic-VariableFont_GRAD,opsz,wdth,wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-roboto-serif",
  display: "swap",
});

// 3. Roboto Slab
// Supports: wght only (Variable)
const robotoSlab = localFont({
  src: "../public/fonts/RobotoSlab-VariableFont_wght.ttf",
  variable: "--font-roboto-slab",
  display: "swap",
});

// 4. Roboto Mono
// Supports: wght only (Variable)
const robotoMono = localFont({
  src: [
    {
      path: "../public/fonts/RobotoMono-VariableFont_wght.ttf",
      style: "normal",
    },
    {
      path: "../public/fonts/RobotoMono-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Multi 2¹ Designer",
  description: "Pre-factory UI for Multi 2¹ component",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${robotoFlex.variable} ${robotoSerif.variable} ${robotoSlab.variable} ${robotoMono.variable} antialiased font-sans overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
