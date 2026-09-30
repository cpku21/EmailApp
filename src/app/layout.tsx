import type { Metadata } from 'next';
import localFont from 'next/font/local';

import l from '@/lib/en';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: l.metadata.title,
  description: l.metadata.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} min-h-screen bg-slate-50 text-slate-950 antialiased [font-family:var(--font-geist-sans)]`}
      >
        {children}
      </body>
    </html>
  );
}
