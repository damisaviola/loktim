import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { MainLayoutWrapper } from "@/components/MainLayoutWrapper";
import { Toaster } from "sonner";
import PWAInstaller from "@/components/PWAInstaller";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const viewport: Viewport = {
  themeColor: "#026CA0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "LokerTimika - Info Lowongan Kerja Timika & Mimika Terbaru",
    template: "%s | LokerTimika"
  },
  description: "Portal informasi lowongan kerja terpercaya di Timika, Mimika, dan Papua. Temukan loker terbaru untuk berbagai profesi.",
  keywords: ["loker timika", "lowongan kerja timika", "loker mimika", "lowongan freeport", "kerja papua", "info loker timika terbaru"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LokerTimika",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    shortcut: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg",
  },
  verification: {
    google: "ktKsxXxVRmpMCR0IKU45bCQcRgkz2KFy1cGJP3B-O48",
  },
  openGraph: {
    title: "LokerTimika - Info Lowongan Kerja Timika & Mimika Terbaru",
    description: "Portal informasi lowongan kerja terpercaya di Timika, Mimika, dan Papua. Temukan loker terbaru untuk berbagai profesi.",
    locale: "id_ID",
    siteName: "LokerTimika",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full antialiased ${plusJakartaSans.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('dark'); try { localStorage.removeItem('theme'); } catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary" suppressHydrationWarning>
        <NextTopLoader color="#026CA0" showSpinner={false} />
        <Toaster position="top-center" richColors closeButton expand={false} />
        <SiteHeader />
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
        <Footer />
        <PWAInstaller />
      </body>
    </html>
  );
}