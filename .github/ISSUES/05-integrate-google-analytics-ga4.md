---
title: "[FEATURE] Integrate Google Analytics (GA4) Traffic & Event Tracking"
labels: "analytics, integration, seo"
assignees: ""
---

## 📌 Context & Motivation
Untuk memantau jumlah pengunjung harian, halaman lowongan terpopuler, dan perilaku pengguna secara *real-time*, platform **LokerTimika** mengintegrasikan **Google Analytics 4 (GA4)** dengan ID Pengukuran resmi `G-GKWE40DGPW`.

---

## 🎯 Tasks Completed
- [x] Buat komponen `GoogleAnalytics.tsx` menggunakan skrip Next.js `afterInteractive`.
- [x] Pasang `<GoogleAnalytics />` pada root layout (`src/app/layout.tsx`).
- [x] Konfigurasi variabel lingkungan `NEXT_PUBLIC_GA_MEASUREMENT_ID` dengan fallback ID `G-GKWE40DGPW`.
- [x] Perbarui `.env` dan `.env.example`.

---

## 🧪 Acceptance Criteria
1. Skrip GA4 dimuat secara asinkron tanpa mengganggu performa kecepatan muat halaman (*PageSpeed*).
2. Dasbor Google Analytics Realtime mencatat lalu lintas pengunjung aktif secara akurat.
3. Seluruh unit test (`npm run test`) tetap lulus 100%.
