import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LokerTimika - Portal Lowongan Kerja Timika & Mimika',
    short_name: 'LokerTimika',
    description: 'Portal lowongan kerja dan informasi karir terpercaya di Timika, Kabupaten Mimika, Papua Tengah.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F8FAFC',
    theme_color: '#026CA0',
    categories: ['business', 'employment', 'productivity'],
    icons: [
      {
        src: '/icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Cari Lowongan',
        short_name: 'Lowongan',
        description: 'Jelajahi lowongan kerja terbaru di Timika',
        url: '/jobs',
        icons: [{ src: '/icons/icon-192.svg', sizes: '192x192' }],
      },
      {
        name: 'Pasang Lowongan',
        short_name: 'Pasang Loker',
        description: 'Publikasikan lowongan pekerjaan perusahaan Anda',
        url: '/post',
        icons: [{ src: '/icons/icon-192.svg', sizes: '192x192' }],
      },
    ],
  };
}
