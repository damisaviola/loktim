import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "LokerTimika - Info Lowongan Kerja Timika & Mimika Terbaru",
    template: "%s | LokerTimika"
  },
  description: "Portal informasi lowongan kerja terpercaya di Timika, Mimika, dan Papua. Temukan loker terbaru untuk berbagai profesi, dari perusahaan lokal hingga multinasional.",
  keywords: ["loker timika", "lowongan kerja timika", "loker mimika", "lowongan freeport", "kerja papua", "info loker timika terbaru"],
  openGraph: {
    title: "LokerTimika - Info Lowongan Kerja Timika & Mimika Terbaru",
    description: "Portal informasi lowongan kerja terpercaya di Timika, Mimika, dan Papua. Temukan loker terbaru untuk berbagai profesi.",
    type: "website",
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
    <html lang="id" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}