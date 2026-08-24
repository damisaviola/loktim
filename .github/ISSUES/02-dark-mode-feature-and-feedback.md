---
title: "[FEATURE] Dark Mode Implementation & UI Contrast Refinements"
labels: "enhancement, ui/ux, frontend"
assignees: ""
---

## 📌 Context & Motivation
Untuk meningkatkan kenyamanan pengguna saat mengakses LokerTimika di malam hari atau dalam kondisi redup cahaya, telah diimplementasikan fondasi **Dark Mode** berbasis `next-themes` dan variabel warna Tailwind CSS v4.

---

## 🎯 Scope & Completed Tasks
- [x] Tambahkan `ThemeProvider` dari `next-themes` pada `RootLayout` (`src/app/layout.tsx`).
- [x] Tambahkan variabel warna CSS `.dark` di `src/app/globals.css`.
- [x] Buat komponen `ThemeToggle` di `src/components/ThemeToggle.tsx` (Support mode Light / Dark / System).
- [x] Pasang `ThemeToggle` di `Navbar.tsx` untuk navigasi desktop dan mobile.

---

## 🔍 Tasks / Follow-ups for UI Refinements
- [ ] Audit kontras warna pada halaman detail lowongan (`/job/[id]`).
- [ ] Penyesuaian background elemen card pada mode gelap (`bg-slate-900` & `border-slate-800`).
- [ ] Pastikan modal dialog (seperti `ApplyModal` & `ReportJobModal`) tampil nyaman di mode gelap.
- [ ] Uji coba otomatis persistensi tema setelah *page refresh*.

---

## 💬 Feedback & Discussion
Silakan tinggalkan komentar jika menemukan elemen UI yang kurang kontras atau memiliki saran warna alternatif untuk Dark Mode.
