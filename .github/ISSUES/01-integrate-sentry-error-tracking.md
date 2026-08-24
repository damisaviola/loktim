---
title: "[FEATURE] Integrate Sentry Error Tracking & Performance Monitoring"
labels: "enhancement, devops, production"
assignees: ""
---

## 📌 Context & Motivation
Aplikasi **LokerTimika** sudah berhasil di-deploy ke lingkungan *production*. Untuk memastikan kestabilan aplikasi, mendeteksi error secara *real-time*, dan memantau performa Server Actions & API Routes, kita perlu memasang **Sentry Error Tracking**.

---

## 🎯 Objectives & Requirements
- [ ] Install package `@sentry/nextjs` via Sentry Wizard CLI (`npx @sentry/wizard@latest -i nextjs`).
- [ ] Konfigurasi DSN & Environment Variables:
  - `NEXT_PUBLIC_SENTRY_DSN`
  - `SENTRY_AUTH_TOKEN` (pada CI/CD / platform hosting seperti Vercel).
- [ ] Buat file konfigurasi Sentry:
  - `sentry.client.config.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
- [ ] Bungkus `next.config.ts` menggunakan `withSentryConfig`.
- [ ] Pastikan Source Maps diunggah secara otomatis saat build tanpa membocorkan kredensial.
- [ ] Verifikasi penangkapan error uji coba (`Sentry.captureException`).

---

## 🧪 Acceptance Criteria
1. Setiap unhandled exception di Client maupun Server Component terkirim ke dashboard Sentry.
2. Error notifikasi terintegrasi (email / Discord / Slack).
3. Tidak ada penuaan performa signifikan pada waktu muat halaman awal.
