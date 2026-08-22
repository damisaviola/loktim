import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - LokerTimika",
  description: "Kebijakan privasi dan perlindungan data di platform LokerTimika.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 py-8 sm:py-14">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Tombol Kembali */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Kontainer Utama */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          
          {/* Header Sederhana */}
          <div className="border-b border-slate-100 pb-6 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              LokerTimika
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Kebijakan Privasi
            </h1>
            <p className="text-xs text-slate-500">
              Terakhir diperbarui: 22 Agustus 2026
            </p>
          </div>

          {/* Isi Konten Rapi & Terbaca */}
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
            
            {/* 1. Pendahuluan */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">1. Pendahuluan</h2>
              <p>
                LokerTimika adalah platform informasi lowongan kerja di Kabupaten Mimika. Kami berkomitmen untuk menjaga transparansi dan menghormati privasi setiap pencari kerja serta tempat usaha yang menggunakan layanan kami.
              </p>
            </section>

            {/* 2. Privasi Pencari Kerja */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">2. Privasi Pencari Kerja</h2>
              <p>
                Pencari kerja dapat mengakses dan mencari lowongan secara bebas tanpa perlu mendaftar akun.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>Tanpa Akun:</strong> Kami tidak mewajibkan pencari kerja untuk membuat akun atau mengunggah berkas CV ke server kami.</li>
                <li><strong>Lamaran Langsung:</strong> Pengiriman lamaran dilakukan langsung dari pelamar ke kontak resmi yang disediakan pemasang loker (WhatsApp, Email, atau tautan formulir perusahaan).</li>
                <li><strong>Lowongan Tersimpan:</strong> Fitur bookmark lowongan disimpan secara lokal di memori peramban (LocalStorage) perangkat Anda sendiri.</li>
              </ul>
            </section>

            {/* 3. Data Pemasang Lowongan */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">3. Data Pemasang Lowongan</h2>
              <p>
                Bagi pemilik usaha atau perwakilan perusahaan yang memasang lowongan, data yang kami kumpulkan meliputi:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Nama tempat usaha/perusahaan, logo, dan deskripsi singkat.</li>
                <li>Lokasi penempatan kerja di wilayah Mimika.</li>
                <li>Kontak rekrutmen resmi (WhatsApp / Email / Link Website) yang secara sukarela Anda cantumkan untuk menerima lamaran.</li>
                <li>Kata sandi akun pengelola yang diamankan menggunakan enkripsi satu arah.</li>
              </ul>
            </section>

            {/* 4. Penggunaan Data & Anti-Spam */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">4. Penggunaan &amp; Keamanan Data</h2>
              <p>
                Data yang diberikan hanya digunakan untuk keperluan verifikasi keaslian lowongan kerja, menghubungkan pencari kerja lokal, serta mencegah penipuan atau pemungutan biaya liar.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Kami <strong>tidak pernah menjual atau menyewakan data pribadi</strong> Anda kepada pihak ketiga.</li>
                <li>Seluruh komunikasi data dienkripsi menggunakan protokol aman HTTPS/SSL.</li>
                <li>Kami menerapkan pembatasan laju permintaan (*rate limiting*) berbasis IP untuk mencegah spam pada formulir publik.</li>
              </ul>
            </section>

            {/* 5. Cookies & Penyimpanan */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">5. Cookies</h2>
              <p>
                Kami hanya menggunakan cookies esensial untuk menjaga sesi login akun pengelola dan mengingat preferensi tampilan. Kami tidak menggunakan cookies pelacak pihak ketiga (*third-party tracking cookies*).
              </p>
            </section>

            {/* 6. Perubahan & Kontak */}
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">6. Bantuan &amp; Perubahan Data</h2>
              <p>
                Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini atau ingin mengajukan permohonan penutupan lowongan yang sudah terisi, silakan hubungi kami melalui formulir kontak.
              </p>
            </section>

          </div>

          {/* Kotak Kontak Sederhana */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 p-4 rounded-xl">
            <div className="text-xs text-slate-500">
              Punya pertanyaan seputar privasi atau data lowongan?
            </div>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              Pusat Bantuan &amp; Kontak
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
