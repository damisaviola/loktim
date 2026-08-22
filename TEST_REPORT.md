# 📋 Laporan Hasil Pengujian Unit (Unit Test Report)
**Platform Portal Lowongan Kerja Timika (LokerTimika)**  
**Standar Pengujian:** Industri (Automated Unit Testing & Security Validation)  
**Tanggal Pengujian:** 22 Agustus 2026  
**Status Pengujian:** 🟢 **100% Lolos (PASS)**

---

## 1. Ringkasan Eksekutif (Executive Summary)

Pengujian unit otomatis telah dijalankan di seluruh modul inti platform **LokerTimika**. Pengujian mencakup validasi data, mekanisme otentikasi, sanitasi keamanan siber (anti-XSS & enkripsi password), sistem pembatasan laju permintaan (*Rate Limiting*), modul manajemen pesan kontak, serta algoritma pencarian dan pemfilteran data lowongan kerja.

### 📊 Metrik Hasil Pengujian

| Metrik | Nilai | Keterangan |
| :--- | :---: | :--- |
| **Total Test Suites** | **34 Suites** | Terbagi dalam 5 berkas pengujian modular |
| **Total Unit Tests** | **55 Tests** | Seluruh skenario pengujian fungsional & edge case |
| **Tingkat Kelulusan (Pass Rate)** | **100% (55/55)** | Tidak ada pengujian yang gagal atau terlewat |
| **Tests Failed** | **0** | Nol kegagalan sistem |
| **Tests Skipped / Cancelled** | **0** | Seluruh pengujian tereksekusi penuh |
| **Total Waktu Eksekusi** | **~3.7 Detik** | Cepat, efisien, dan siap untuk integrasi CI/CD |

---

## 2. Lingkungan Pengujian (Test Environment)

- **Framework Runtime:** Node.js v20+ / Next.js 16.2 (Turbopack)
- **Test Runner:** Native Node Test Runner (`node:test`) + Native Assertion (`node:assert/strict`)
- **TypeScript Runner:** `tsx` v4.22+
- **Security & Crypto Engine:** `bcryptjs`, `isomorphic-dompurify`, `zod`
- **Perintah Pengujian:** `npm test`

---

## 3. Rincian Hasil Pengujian Berdasarkan Modul

### A. Validasi Skema & Primitif (`tests/unit/validations.test.ts`)
*Memastikan seluruh data masukan dari formulir publik maupun internal diproses secara aman, bersih, dan sesuai format.*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 1 | Normalisasi alamat email (trim spasi & otomatis lowercase) | 🟢 Lolos | 1.53 ms |
| 2 | Penolakan format email yang tidak valid | 🟢 Lolos | 0.95 ms |
| 3 | Validasi format nomor telepon Indonesia (+62, 08xx, strip, kurung) | 🟢 Lolos | 1.15 ms |
| 4 | Penolakan nomor telepon yang terlalu pendek atau mengandung alfabet | 🟢 Lolos | 0.87 ms |
| 5 | Validasi format nomor WhatsApp valid | 🟢 Lolos | 0.78 ms |
| 6 | Validasi URL HTTP & HTTPS terstandarisasi | 🟢 Lolos | 0.35 ms |
| 7 | Penolakan skema URL berbahaya (`javascript:`, `ftp:`) | 🟢 Lolos | 0.39 ms |
| 8 | Pemisahan pesan error Zod per-kolom (*field errors*) dan umum (*general errors*) | 🟢 Lolos | 1.44 ms |

---

### B. Otentikasi & Akun (`tests/unit/validations.test.ts`)
*Memastikan login admin, pendaftaran perusahaan, dan login mitra bisnis terlindungi dari input cacat.*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 9 | Validasi kredensial login mitra perusahaan | 🟢 Lolos | 0.32 ms |
| 10 | Penolakan login jika email salah atau password kurang dari batas minimum | 🟢 Lolos | 0.24 ms |
| 11 | Validasi kredensial login portal admin | 🟢 Lolos | 0.65 ms |
| 12 | Penolakan login admin jika username < 3 karakter | 🟢 Lolos | 0.27 ms |
| 13 | Validasi lengkap registrasi perusahaan baru | 🟢 Lolos | 2.17 ms |
| 14 | Penolakan registrasi jika *Password* dan *Konfirmasi Password* tidak cocok | 🟢 Lolos | 0.30 ms |
| 15 | Penolakan registrasi dengan password lemah (< 6 karakter) | 🟢 Lolos | 0.21 ms |
| 16 | Validasi otentikasi login perusahaan terdaftar | 🟢 Lolos | 0.30 ms |

---

### C. Formulir Publik, Kontak & Pelaporan (`tests/unit/validations.test.ts`)
*Menguji keandalan formulir kontak bantuan, laporan loker mencurigakan, dan langganan newsletter.*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 17 | Validasi pengiriman formulir kontak dengan data lengkap | 🟢 Lolos | 0.19 ms |
| 18 | Validasi pengiriman kontak tanpa nomor WA/organisasi opsional | 🟢 Lolos | 0.10 ms |
| 19 | Penolakan isi pesan kontak yang terlalu pendek | 🟢 Lolos | 0.15 ms |
| 20 | Validasi pengiriman laporan lowongan bermasalah | 🟢 Lolos | 0.36 ms |
| 21 | Penolakan laporan loker dengan alasan kosong | 🟢 Lolos | 0.13 ms |
| 22 | Validasi pendaftaran langganan newsletter lowongan | 🟢 Lolos | 0.21 ms |

---

### D. Wizard Pasang Lowongan 3 Tahap (`tests/unit/validations.test.ts`)
*Menguji aturan bisnis pembuatan lowongan (Step 1: Info Usaha, Step 2: Detail Gaji & Deadline, Step 3: Kualifikasi).*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 23 | Validasi struktur data utuh pasang lowongan (*Full Create Job Schema*) | 🟢 Lolos | 1.83 ms |
| 24 | Penolakan saat batas gaji maksimum lebih kecil dari gaji minimum | 🟢 Lolos | 0.83 ms |
| 25 | Penolakan tanggal batas lamaran (*deadline*) yang sudah lampau | 🟢 Lolos | 0.98 ms |
| 26 | Validasi terisolasi Step 1 (Profil Perusahaan / Usaha) | 🟢 Lolos | 1.02 ms |
| 27 | Validasi terisolasi Step 2 (Judul, Lokasi, Kategori, Gaji) | 🟢 Lolos | 0.59 ms |
| 28 | Validasi terisolasi Step 3 (Persyaratan, Kontak & Persetujuan Ketentuan) | 🟢 Lolos | 0.43 ms |

---

### E. Sistem Rate Limiting & Anti-Abuse (`tests/unit/rate-limit.test.ts`)
*Mencegah spam form, serangan brute-force login, dan flooding request.*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 29 | Mengizinkan permintaan selama masih di bawah kuota limit | 🟢 Lolos | 1.96 ms |
| 30 | Memblokir permintaan saat melebihi batas kuota dengan pesan estimasi waktu | 🟢 Lolos | 0.33 ms |
| 31 | Isolasi limit antar-aksi berbeda pada IP yang sama | 🟢 Lolos | 0.14 ms |
| 32 | Isolasi limit antar-IP berbeda pada aksi yang sama | 🟢 Lolos | 0.16 ms |

---

### F. Manajemen Kontak & Tiket Bantuan (`tests/unit/contact.test.ts`)
*Menguji logika pembuatan tiket, tautan pesan otomatis, dan pencarian pesan.*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 33 | Pembuatan nomor tiket terformat konsisten `MSG-XXXXXX` (6 digit acak unik) | 🟢 Lolos | 0.92 ms |
| 34 | Konversi nomor HP awal `08xx` menjadi kode negara `628xx` untuk WhatsApp | 🟢 Lolos | 1.13 ms |
| 35 | Penanganan nomor WhatsApp dengan awalan `+62` atau spasi | 🟢 Lolos | 0.25 ms |
| 36 | Pembuatan tautan email (*mailto*) dengan subjek tiket otomatis | 🟢 Lolos | 0.27 ms |
| 37 | Sanitasi payload input kontak dari tag berbahaya (`<script>`, `onerror`, `javascript:`) | 🟢 Lolos | 13.78 ms |
| 38 | Penyaringan status pesan kontak (*unread*, *read*, *replied*, *archived*) | 🟢 Lolos | 0.21 ms |
| 39 | Pencarian multikolom pesan (*tiket, nama, email, subjek, isi pesan*) | 🟢 Lolos | 0.11 ms |

---

### G. Algoritma Pencarian, Filter & Paginasi Lowongan (`tests/unit/jobs-filtering.test.ts`)
*Menguji keakuratan pencarian, pengurutan, format gaji, dan paginasi data lowongan.*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 40 | Format nominal rentang gaji (contoh: *Rp 8.000.000 - Rp 12.000.000*) | 🟢 Lolos | 28.78 ms |
| 41 | Format nominal gaji minimum saja (contoh: *Mulai Rp 5.000.000*) | 🟢 Lolos | 0.62 ms |
| 42 | Tampilan status gaji negosiasi (*"Negosiasi"*) | 🟢 Lolos | 3.28 ms |
| 43 | Tampilan status gaji tidak dicantumkan (*"Dirahasiakan"*) | 🟢 Lolos | 0.71 ms |
| 44 | Pencarian lowongan berdasarkan judul posisi | 🟢 Lolos | 0.64 ms |
| 45 | Pencarian lowongan berdasarkan nama perusahaan | 🟢 Lolos | 0.45 ms |
| 46 | Pencarian lowongan berdasarkan nama lokasi penempatan | 🟢 Lolos | 0.39 ms |
| 47 | Pemfilteran lowongan berdasarkan status publikasi | 🟢 Lolos | 0.40 ms |
| 48 | Penggabungan multikriteria filter (*Status + Kategori + Tipe Kerja*) | 🟢 Lolos | 0.71 ms |
| 49 | Pengurutan lowongan berdasarkan tanggal terbit terbaru (*Newest*) | 🟢 Lolos | 0.78 ms |
| 50 | Pengurutan lowongan secara alfabetis judul posisi (*A-Z*) | 🟢 Lolos | 2.87 ms |
| 51 | Pemotongan data per halaman untuk sistem paginasi (*Pagination Slicing*) | 🟢 Lolos | 0.46 ms |

---

### H. Standar Kriptografi & Sanitasi Keamanan Siber (`tests/unit/security.test.ts`)
*Memastikan perlindungan data sensitif dan pertahanan dari eksploitasi injeksi web.*

| No | Skenario Pengujian | Status | Waktu |
| :-: | :--- | :-: | :-: |
| 52 | Hashing password dengan *salted bcrypt* (format `$2a$` / `$2b$`) dan verifikasi kecocokan | 🟢 Lolos | 151.35 ms |
| 53 | Penolakan mutlak verifikasi password yang salah terhadap hash tersimpan | 🟢 Lolos | 131.93 ms |
| 54 | Pembersihan total terhadap script injection, event inline (`onload`, `onmouseover`), dan iframe | 🟢 Lolos | 17.36 ms |
| 55 | Mempertahankan format teks aman yang sah (*bold*, *italic*, *paragraph*) tanpa merusak konten | 🟢 Lolos | 3.16 ms |

---

## 4. Kesimpulan & Rekomendasi

1. **Kualitas Kode (Code Quality):** Seluruh logika bisnis, sanitasi input, validasi skema, dan alur otentikasi bekerja dengan andal sesuai spesifikasi.
2. **Kesiapan Rilis (Production Readiness):** Tidak ditemukan celah validasi (*validation bypass*) atau kerentanan XSS dasar pada modul yang diuji.
3. **Automasi Berkelanjutan:** Skrip pengujian `npm test` telah terpasang pada `package.json` dan siap diintegrasikan ke alur *Continuous Integration (CI)* seperti GitHub Actions.
