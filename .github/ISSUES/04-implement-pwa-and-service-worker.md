---
title: "[FEATURE] Implement Progressive Web App (PWA) & Service Worker Caching"
labels: "feature, pwa, mobile, ux"
assignees: ""
---

## 📌 Context & Motivation
Untuk memberikan pengalaman pengguna (*user experience*) selayaknya aplikasi native di HP Android maupun iPhone, platform **LokerTimika** kini dilengkapi dengan kapabilitas **Progressive Web App (PWA)** dan **Service Worker Offline Caching**.

---

## 🎯 Tasks Completed
- [x] Buat skema Web App Manifest (`src/app/manifest.ts` & `public/manifest.json`) dengan konfigurasi `standalone`, warna tema `#026CA0`, dan shortcut menu.
- [x] Buat aset ikon vector PWA (`icon.svg`, `icon-192.svg`, `icon-512.svg`, `maskable-icon.svg`).
- [x] Buat skrip Service Worker (`public/sw.js`) untuk caching aset statis (_next/static, images, icons) dan strategi offline fallback.
- [x] Buat komponen Client `PWAInstaller.tsx` untuk pendaftaran Service Worker otomatis dan penanganan *native install prompt*.
- [x] Tambahkan pemicu tombol PWA manual pada Footer.

---

## 🧪 Acceptance Criteria
1. Pengguna dapat memasang (*install*) aplikasi LokerTimika ke Layar Utama (*Home Screen*) HP.
2. Aplikasi dapat dibuka dalam mode `standalone` tanpa bar browser.
3. Halaman yang telah di-cache dapat diakses dengan cepat meskipun jaringan lambat.
