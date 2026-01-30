import type { Metadata } from "next";
import { Roboto, Roboto_Flex } from "next/font/google";
import "./globals.css";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { generateOrganizationSchema } from "@/lib/seo/schema";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Atoms Site",
  description: "Automated. Atomic. Agents.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "Atoms Site",
    description: "Automated. Atomic. Agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = generateOrganizationSchema();

  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoFlex.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
