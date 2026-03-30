import type { Metadata } from "next";
import { Cairo, DM_Sans } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: 'MELY•IMA — عبايات نسائية عصرية',
  description: 'تسوقي أجمل تشكيلات العبايات النسائية العصرية من MELY•IMA',
  keywords: 'عبايات, موضة جزائرية, عباية عصرية',
  openGraph: {
    title: 'MELY•IMA — عبايات نسائية عصرية',
    description: 'تسوقي أجمل تشكيلات العبايات النسائية العصرية من MELY•IMA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
