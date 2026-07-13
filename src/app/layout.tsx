import type { Metadata } from "next";
import { Playfair_Display, Fraunces } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarqueeBanner from "@/components/MarqueeBanner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NexaSoul × Srujana | Frontend X Full Stack Weekly Blitz",
  description:
    "NexaSoul technical club presents Srujana — weekly online events for Frontend & Full Stack developers. Week 1: Trivia Quiz Blitz!",
  icons: { icon: "/nexasoul-jlogo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <MarqueeBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
