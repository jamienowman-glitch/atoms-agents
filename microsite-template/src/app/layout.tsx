import type { Metadata } from "next";
import { Roboto, Roboto_Flex } from "next/font/google"; // Import Roboto_Flex
import "./globals.css";
import { PricingProvider } from "../context/PricingContext";
import { UtmTracker } from "../components/analytics/UtmTracker";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
  axes: ["opsz", "slnt", "wdth", "GRAD", "XTRA", "YOPQ", "YTAS", "YTDE", "YTFI", "YTLC", "YTUC"],
});

export const metadata: Metadata = {
  title: "Atoms Site",
  description: "Automated. Atomic. Agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoFlex.variable} antialiased`}
      >
        <PricingProvider>
          <UtmTracker />
          {children}
        </PricingProvider>
      </body>
    </html>
  );
}
