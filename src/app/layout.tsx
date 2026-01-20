import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LO Publications - Premium Book Publishing",
  description: "Turn your manuscript into a published masterpiece with expert guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-brand-white text-brand-black antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}