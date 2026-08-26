import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Footer } from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { MainLayoutWrapper } from "@/components/MainLayoutWrapper";
import { Toaster } from "sonner";
import PWAInstaller from "@/components/PWAInstaller";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lokertimika.vercel.app";

export const viewport: Viewport = {
  themeColor: "#026CA0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Loker Timika - Info Lowongan Kerja Timika & Mimika Terbaru",
    template: "%s | Loker Timika"
  },
  description: "Portal informasi lowongan kerja (loker) di Timika, Mimika, Freeport, & Papua Tengah terpercaya. Temukan loker terbaru untuk berbagai profesi & lulusan.",
  keywords: [
    "loker timika", 
    "lowongan kerja timika", 
    "loker timika terbaru", 
    "loker mimika", 
    "loker freeport timika", 
    "lowongan kerja papua tengah", 
    "info loker timika hari ini", 
    "loker papua", 
    "lokertimika"
  ],
  authors: [{ name: "LokerTimika", url: siteUrl }],
  creator: "LokerTimika",
  publisher: "LokerTimika",
  manifest: "/manifest.json",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    title: "Loker Timika - Info Lowongan Kerja Timika & Mimika Terbaru",
    description: "Portal informasi lowongan kerja (loker) di Timika, Mimika, Freeport, & Papua Tengah terpercaya. Temukan loker terbaru untuk berbagai profesi.",
    url: siteUrl,
    siteName: "LokerTimika",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/icons/icon-512.svg",
        width: 512,
        height: 512,
        alt: "LokerTimika - Portal Lowongan Kerja Timika",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loker Timika - Info Lowongan Kerja Timika & Mimika Terbaru",
    description: "Portal informasi lowongan kerja (loker) di Timika, Mimika, Freeport, & Papua Tengah terpercaya.",
    images: ["/icons/icon-512.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "LokerTimika",
    "alternateName": ["Loker Timika", "Lowongan Kerja Timika", "Portal Loker Timika"],
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/jobs?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LokerTimika",
    "url": siteUrl,
    "logo": `${siteUrl}/icons/icon-512.svg`,
    "description": "Portal informasi lowongan kerja terpercaya di Timika, Mimika, dan Papua Tengah.",
    "sameAs": [siteUrl],
  };

  return (
    <html lang="id" className={`h-full antialiased ${plusJakartaSans.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('dark'); try { localStorage.removeItem('theme'); } catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}