import "../styles/global.css";
import "../styles/custom.css";
import { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Chanim",
  description: "Chanim - AI powered infographic generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">

        <body className={inter.className}>{children}</body>

    </html>
  );
}
