import React from 'react';

export const metadata = {
  title: 'Atoms UI Canvas',
  description: 'Draft harness preview'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
