import './globals.css';
import type { Metadata } from 'next';
import { Roboto_Flex } from 'next/font/google';

const roboto = Roboto_Flex({
  subsets: ['latin'],
  axes: ['wdth', 'slnt', 'GRAD', 'XTRA', 'YOPQ', 'YTAS', 'YTDE', 'YTFI', 'YTLC', 'YTUC']
});

export const metadata: Metadata = {
  title: 'Northstar Console',
  description: 'God Mode',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
