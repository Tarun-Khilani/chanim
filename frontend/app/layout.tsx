import "../styles/global.css";
import "../styles/custom.css";
import { Metadata } from "next";
import { Inter, Roboto, Montserrat, Open_Sans, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const openSans = Open_Sans({ subsets: ['latin'] });
const poppins = Poppins({ weight: ['400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Chanim",
  description: "Chanim - AI powered infographic generator",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
