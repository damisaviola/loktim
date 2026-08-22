"use client";

import Link from "next/link";
import { 
  Briefcase, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  FileText, 
  UserCheck, 
  Send, 
  Clock, 
  BadgeCheck, 
  HelpCircle,
  Sparkles,
  PhoneCall,
  Check
} from "lucide-react";

export default function PanduanPasangLokerPage() {
  const formSteps = [
    {
      stepNumber: "1",
      stepTitle: "Langkah 1: Profil Usaha / Perusahaan & Kontak",
      icon: <Building2 className="w-5 h-5 text-primary" />,
      description: "Isi data identitas tempat usaha Anda dan kontak penanggung jawab.",
      fields: [
        {
          name: "Email Perusahaan / Usaha",
          required: true,
          desc: "Gunakan email aktif untuk menerima konfirmasi dan mengelola lowongan."
        },
        {
          name: "Nama Usaha / Toko / Perusahaan",
          required: true,
          desc: "Tuliskan nama toko, kafe, UMKM, atau perusahaan Anda di Timika."
        },
        {
          name: "Lokasi Kantor / Tempat Usaha",
          required: true,
          desc: "Pilih atau ketik area usaha (contoh: Timika Kota, Kuala Kencana, SP 2, Jl. Budi Utomo)."
        },
        {
          name: "Logo atau Foto Usaha (Opsional)",
          required: false,
          desc: "Unggah logo atau foto tempat usaha (format JPG/PNG) agar lowongan lebih dipercaya."
        },
        {
          name: "Nama & No. WhatsApp Penanggung Jawab",
          required: true,
          desc: "Kontak pengelola/HRD untuk keperluan koordinasi dan verifikasi moderasi."
        }
      ]
    },
    {
      stepNumber: "2",
      stepTitle: "Langkah 2: Rincian Lowongan & Posisi Kerja",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      description: "Tentukan posisi pekerjaan yang sedang Anda buka untuk pelamar.",
      fields: [
        {
          name: "Judul Posisi Pekerjaan",
          required: true,
          desc: "Tulis nama posisi yang jelas (contoh: Kasir Toko, Barista, Staff Gudang, Driver LV)."
        },
        {
          name: "Kategori Bidang Pekerjaan",
          required: true,
          desc: "Pilih kategori yang sesuai (Ritel/Toko, F&B/Resto, Tambang, Otomotif, dll)."
        },
        {
          name: "Lokasi Penempatan Kerja",
          required: true,
          desc: "Area kerja tempat pelamar akan bertugas di wilayah Kabupaten Mimika."
        },
        {
          name: "Tipe Pekerjaan",
          required: true,
          desc: "Pilih jenis waktu kerja: Penuh Waktu (Full-time), Paruh Waktu (Part-time), Magang, atau Harian."
        },
        {
          name: "Kisaran Gaji / Upah (Opsional)",
          required: false,
          desc: "Masukkan estimasi gaji min & maks per bulan (membantu menarik lebih banyak pelamar)."
        },
        {
          name: "Batas Waktu Lamaran (Opsional)",
          required: false,
          desc: "Tanggal penutupan penerimaan berkas lamaran."
        }
      ]
    },
    {
      stepNumber: "3",
      stepTitle: "Langkah 3: Kualifikasi & Cara Melamar",
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      description: "Tuliskan kriteria syarat pelamar dan ke mana lamaran harus dikirimkan.",
      fields: [
        {
          name: "Kriteria Minimal Pelamar",
          required: true,
          desc: "Pilih tingkat pendidikan (Semua/SMA/SMK/D3/S1), minimal pengalaman, jenis kelamin, dan usia."
        },
        {
          name: "Deskripsi Tugas & Pekerjaan",
          required: true,
          desc: "Uraikan poin-poin tanggung jawab atau kegiatan harian karyawan."
        },
        {
          name: "Persyaratan & Kualifikasi",
          required: true,
          desc: "Sebutkan syarat berkas (KTP/CV) dan keterampilan yang dibutuhkan."
        },
        {
          name: "Saluran Lamaran (WhatsApp / Email)",
          required: true,
          desc: "Masukkan nomor WhatsApp atau Email tujuan ke mana pelamar langsung mengirim lamaran."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 sm:pb-20">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl pt-6 sm:pt-10">
        <Link 
          href="/post" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors group mb-4 sm:mb-6"
        >
          <div className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span>Langsung ke Formulir Pasang Loker</span>
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] sm:text-xs font-bold font-mono">
            <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Panduan Formulir Lowongan</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Panduan Mengisi Formulir Lowongan
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Formulir pemasangan lowongan kerja di LokerTimika terbagi menjadi <strong>3 langkah sederhana</strong>. Ikuti panduan isian kolom berikut agar lowongan Anda cepat dipublikasikan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold text-[11px]">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Gratis
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200/80 font-medium text-[11px]">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Verifikasi &lt; 24 Jam
            </span>
          </div>
        </div>
      </div>

      {/* 2. FORM STEPS GUIDES */}
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl mt-6 sm:mt-8 space-y-6">

        {formSteps.map((step, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-4"
          >
            {/* Step Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                {step.icon}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {step.stepTitle}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Fields List */}
            <div className="space-y-3">
              {step.fields.map((field, fIdx) => (
                <div 
                  key={fIdx} 
                  className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {field.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      field.required 
                        ? "bg-rose-50 text-rose-700 border border-rose-200/60" 
                        : "bg-slate-200/60 text-slate-600"
                    }`}>
                      {field.required ? "Wajib" : "Opsional"}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed pl-3">
                    {field.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 3. SETELAH FORMULIR DIKIRIM */}
        <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Setelah Formulir Dikirim</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600 mt-0.5">✓</span>
              <span><strong>Simpan Nomor Tiket:</strong> Anda akan mendapatkan kode tiket untuk mengelola lowongan.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600 mt-0.5">✓</span>
              <span><strong>Pemeriksaan Tim Kurasi:</strong> Tim admin meninjau data Anda dalam waktu maksimal 1x24 jam kerja.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-600 mt-0.5">✓</span>
              <span><strong>Tayang Otomatis:</strong> Lowongan langsung tampil di daftar pencarian kerja LokerTimika dan siap menerima pelamar.</span>
            </li>
          </ul>
        </div>

        {/* 4. BOTTOM ACTION CTA */}
        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white text-center space-y-4 shadow-sm">
          <h3 className="text-lg sm:text-xl font-extrabold">
            Siap Memasang Lowongan Kerja?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Buka formulir sekarang dan mulai cari kandidat karyawan untuk usaha Anda di Timika.
          </p>
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/post"
              className="w-full sm:w-auto h-11 px-7 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buka Formulir Pasang Loker</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto h-11 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Pusat Bantuan / Kontak</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
