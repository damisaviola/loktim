import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "LokerTimika - Info Lowongan Kerja Timika & Mimika Terbaru",
    template: "%s | LokerTimika"
  },
  description: "Portal informasi lowongan kerja terpercaya di Timika, Mimika, dan Papua. Temukan loker terbaru untuk berbagai profesi.",
  keywords: ["loker timika", "lowongan kerja timika", "loker mimika", "lowongan freeport", "kerja papua", "info loker timika terbaru"],
  openGraph: {
    title: "LokerTimika - Info Lowongan Kerja Timika & Mimika Terbaru",
    description: "Portal informasi lowongan kerja terpercaya di Timika, Mimika, dan Papua. Temukan loker terbaru untuk berbagai profesi.",
    locale: "id_ID",
    siteName: "LokerTimika",
  },
};

import { MainLayoutWrapper } from "@/components/MainLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full antialiased ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary" suppressHydrationWarning>
        <NextTopLoader color="#0066cc" showSpinner={false} />
        <SiteHeader />
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
        <Footer />
      </body>
    </html>
  );
}