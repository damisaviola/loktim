import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panduan Memasang Lowongan Kerja - LokerTimika',
  description: 'Panduan lengkap langkah demi langkah memasang lowongan pekerjaan di LokerTimika secara gratis, cepat, dan efektif bagi pelaku usaha, UMKM, dan perusahaan di Kabupaten Mimika.',
  keywords: [
    'panduan pasang loker timika',
    'cara pasang lowongan kerja timika',
    'pasang loker gratis mimika',
    'rekrut karyawan timika',
    'loker timika gratis',
    'panduan rekruter loker timika'
  ],
  openGraph: {
    title: 'Panduan Memasang Lowongan Kerja - LokerTimika',
    description: 'Panduan lengkap langkah demi langkah memasang lowongan pekerjaan di LokerTimika secara gratis dan mudah.',
    url: 'https://lokertimika.com/panduan-pasang-loker',
    siteName: 'LokerTimika',
    type: 'website',
  },
};

export default function PanduanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
