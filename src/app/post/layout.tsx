import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pasang Lowongan Kerja Gratis",
  description: "Pasang iklan lowongan kerja di Timika, Mimika, dan sekitarnya secara gratis. Jangkau ribuan pencari kerja berbakat di Papua Tengah.",
  openGraph: {
    title: "Pasang Lowongan Kerja Gratis - LokerTimika",
    description: "Pasang iklan lowongan kerja di Timika, Mimika, dan sekitarnya secara gratis. Jangkau ribuan pencari kerja berbakat di Papua Tengah.",
    siteName: "LokerTimika",
  },
};

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
