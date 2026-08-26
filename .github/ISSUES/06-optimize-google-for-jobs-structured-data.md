---
title: "[SEO] Optimize Google for Jobs Rich Snippets (JobPosting Schema)"
labels: "seo, google-jobs, metadata"
assignees: ""
---

## 📌 Context & Motivation
Agar seluruh lowongan kerja yang tayang di **LokerTimika** dapat otomatis terindeks dan muncul pada kotak pencarian **Google for Jobs (Lowongan Pekerjaan Google)**, struktur data halaman detail lowongan disesuaikan dengan pedoman resmi Schema.org.

---

## 🎯 Tasks Completed
- [x] Perbarui JSON-LD `JobPosting` schema pada `src/app/job/[id]/page.tsx`.
- [x] Tambahkan pemetaan tipe kerja resmi Google (`FULL_TIME`, `PART_TIME`, `CONTRACTOR`, `INTERN`, `OTHER`).
- [x] Tambahkan atribut `validThrough` otomatis (30 hari dari tanggal posting jika tanpa deadline) dan atribut `directApply: true`.
- [x] Tambahkan lokasi terstruktur `addressLocality` ("Timika / Kuala Kencana"), `addressRegion` ("Papua Tengah"), dan `postalCode` ("99910").
- [x] Hubungkan dengan `sitemap.ts` dan `robots.ts` untuk pengindeksan Googlebot.

---

## 🧪 Acceptance Criteria
1. Pengujian halaman detail lowongan pada *Google Rich Results Test* menghasilkan status valid.
2. Lowongan kerja otomatis terdeteksi oleh Google Search Console & Googlebot.
