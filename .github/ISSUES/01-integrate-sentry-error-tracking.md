---
title: "[FEATURE] Integrate Sentry Error Tracking & Performance Monitoring"
labels: "enhancement, devops, production"
assignees: ""
---

## 📌 Context & Motivation
Aplikasi **LokerTimika** sudah berhasil di-deploy ke lingkungan *production*. Untuk memastikan kestabilan aplikasi, mendeteksi error secara *real-time*, dan memantau performa Server Actions & API Routes, kita perlu memasang **Sentry Error Tracking**.

---

## 🎯 Tasks Completed
- [x] Install package `@sentry/nextjs` (`^10.70.0`).
- [x] Konfigurasi DSN & Environment Variables (`NEXT_PUBLIC_SENTRY_DSN` di `.env` dan `.env.example`).
- [x] Buat file konfigurasi Sentry:
  - `sentry.client.config.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
  - `src/instrumentation.ts`
- [x] Bungkus `next.config.ts` menggunakan `withSentryConfig`.
- [x] Integrasikan error boundary global pada `src/app/global-error.tsx` menggunakan `Sentry.captureException`.
- [x] Pastikan kompilasi & build Next.js lulus tanpa error (`npm run build`).

---

## 🧪 Acceptance Criteria
1. Setiap unhandled exception di Client maupun Server Component terkirim ke dashboard Sentry.
2. Error notifikasi terintegrasi.
3. Seluruh unit tests lulus (`55/55`) dan build Next.js sukses tanpa merusak performa.

