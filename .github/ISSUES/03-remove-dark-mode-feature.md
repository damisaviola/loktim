---
title: "[REFACTOR] Remove Dark Mode Feature & Dark Mode Icon"
labels: "cleanup, ui/ux, refactor"
assignees: ""
---

## 📌 Context & Motivation
Atas permintaan produk, fitur **Dark Mode** (termasuk ikon toggle di Navbar, wrapper `ThemeProvider`, dan variabel CSS `.dark`) dihapus agar tampilan aplikasi **LokerTimika** tetap simpel, konsisten, dan berfokus pada mode terang (*Light Mode*) yang bersih.

---

## 🎯 Tasks Completed
- [x] Hapus file komponen `ThemeProvider.tsx` dan `ThemeToggle.tsx`.
- [x] Hapus wrapper `<ThemeProvider>` pada `src/app/layout.tsx`.
- [x] Hapus ikon pengalih tema (`ThemeToggle`) dari `src/components/Navbar.tsx`.
- [x] Hapus blok variabel CSS `.dark` & `@custom-variant dark` dari `src/app/globals.css`.
- [x] Pastikan seluruh komponen UI (JobCard, JobsClient, Job Detail, Footer) kembali bersih menggunakan skema mode terang (*Light Mode*).

---

## 🧪 Acceptance Criteria
1. Tidak ada tombol/ikon dark mode di header maupun menu mobile.
2. Tampilan aplikasi konsisten dan bersih di mode terang tanpa *hydration mismatch*.
3. Seluruh unit test (`npm run test`) tetap lulus 100%.
