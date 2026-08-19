import Link from "next/link";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Eye, 
  KeyRound, 
  FileText, 
  Users, 
  Building2, 
  Cookie, 
  Trash2, 
  UserCheck, 
  Mail, 
  MessageCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  Database,
  Scale,
  Headphones
} from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi & Perlindungan Data - LokerTimika',
  description: 'Kebijakan privasi dan standar perlindungan data pribadi pencari kerja dan perusahaan di LokerTimika sesuai UU Perlindungan Data Pribadi (UU PDP).',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="container mx-auto px-4 max-w-5xl pt-8 sm:pt-12">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-primary transition-colors group mb-6"
        >
          <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all shadow-2xs">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-radial from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-12 text-white overflow-hidden shadow-xl shadow-slate-950/10 border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 text-[11px] sm:text-xs font-bold tracking-wide uppercase mb-5 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Standar Perlindungan Data (UU PDP)
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug mb-4">
              Kebijakan Privasi &amp; <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">Perlindungan Data</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal mb-8">
              LokerTimika sangat menghargai privasi dan kepercayaan Anda. Kami berkomitmen untuk menjaga keamanan data pribadi seluruh pencari kerja dan mitra perusahaan sesuai peraturan perundang-undangan Republik Indonesia.
            </p>

            {/* Quick Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Enkripsi Kuat</div>
                  <div className="text-[11px] text-slate-400">Proteksi data kredensial</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Bebas Jual-Beli Data</div>
                  <div className="text-[11px] text-slate-400">100% data tidak dijual</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Kendali Pengguna</div>
                  <div className="text-[11px] text-slate-400">Hak hapus &amp; edit data</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Anchor Navigation Bar */}
        <div className="mt-8 bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-600 no-scrollbar">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold px-2 shrink-0">Lompat ke:</span>
          <a href="#data-dikumpulkan" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Data yang Dikumpulkan
          </a>
          <a href="#tujuan-penggunaan" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Penggunaan Data
          </a>
          <a href="#keamanan-enkripsi" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Keamanan &amp; Enkripsi
          </a>
          <a href="#hak-pengguna" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Hak Kendali Anda
          </a>
          <a href="#cookies" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Cookies
          </a>
          <a href="#kontak-privasi" className="px-3 py-1.5 rounded-xl text-primary hover:bg-blue-50 transition-colors whitespace-nowrap font-bold">
            Kontak DPO
          </a>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 max-w-5xl mt-10 space-y-12 sm:space-y-16">

        {/* SECTION 1: Data yang Kami Kumpulkan */}
        <section id="data-dikumpulkan" className="scroll-mt-24">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider mb-2 bg-blue-50 text-blue-700">
              <Eye className="w-3.5 h-3.5" /> Bagian 1
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Informasi yang Kami Kumpulkan
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Kami mengumpulkan informasi penting yang relevan untuk memfasilitasi proses penemuan karir dan verifikasi lowongan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Pencari Kerja */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-primary/40 transition-all space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">A. Data Pencari Kerja</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Identitas Kontak:</strong> Nama, alamat email, dan nomor WhatsApp saat mengajukan lamaran.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Riwayat Preferensi:</strong> Daftar lowongan pekerjaan yang Anda simpan (Bookmark).</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Perusahaan */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-primary/40 transition-all space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">B. Data Mitra Perusahaan</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Profil Usaha:</strong> Nama perusahaan, logo, deskripsi profil, dan lokasi kantor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span><strong>Kontak HRD/PIC:</strong> Email rekrutmen, nomor WhatsApp HRD, dan URL portal karir resmi.</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Teknis & Log */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-primary/40 transition-all space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">C. Data Teknis &amp; Keamanan</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Log Akses:</strong> Alamat IP, peramban (browser), sistem operasi, dan waktu kunjungan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span><strong>Verifikasi Bot:</strong> Token verifikasi keamanan Cloudflare Turnstile anti-spam.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: Tujuan Penggunaan Data */}
        <section id="tujuan-penggunaan" className="scroll-mt-24 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider mb-2 bg-emerald-50 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" /> Bagian 2
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Cara Kami Menggunakan Informasi Anda
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Data yang dikumpulkan semata-mata dimanfaatkan untuk kepentingan operasional platform dan keamanan komunitas kerja di Mimika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100/90 flex gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-2xs">
                1
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">Menghubungkan Pelamar dengan Perusahaan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Memungkinkan kandidat mengirim berkas lamaran langsung via WhatsApp HRD, Email Resmi, atau formulir pendaftaran.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100/90 flex gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-2xs">
                2
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">Kurasi &amp; Moderasi Keamanan Loker</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Memvalidasi identitas pemasang lowongan guna mencegah penipuan, lowongan fiktif, atau pemungutan biaya liar (pungli).
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100/90 flex gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-2xs">
                3
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">Notifikasi &amp; Pembaruan Status</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mengirimkan pemberitahuan persetujuan loker, penolakan dengan catatan revisi, atau konfirmasi laporan kendala.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100/90 flex gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-2xs">
                4
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">Peningkatan Kualitas Platform</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menganalisis tren pencarian kerja di Mimika secara agregat (anonim) guna meningkatkan relevansi fitur dan kecepatan sistem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Keamanan Data & Enkripsi */}
        <section id="keamanan-enkripsi" className="scroll-mt-24">
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-10 text-white border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold uppercase">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Infrastruktur Keamanan
              </div>

              <div className="max-w-2xl space-y-2">
                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Protokol Keamanan &amp; Enkripsi Data
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Kami menerapkan prinsip <em>Privacy by Design</em> dengan standar keamanan berlapis untuk melindungi data Anda dari akses tanpa izin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-2">
                  <KeyRound className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold text-sm text-white">Enkripsi Satu Arah</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Kata sandi akun dienkripsi menggunakan hashing kriptografi satu arah (Bcrypt) dan tidak dapat dibaca oleh staf kami.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-2">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-sm text-white">SSL / TLS 1.3</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Seluruh lalu lintas transmisi data antara browser Anda dan server kami dienkripsi penuh menggunakan sertifikat SSL 256-bit.
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 space-y-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  <h3 className="font-bold text-sm text-white">Akses Terisolasi (RLS)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Basis data dilindungi oleh Row Level Security (RLS) untuk menjamin pemisahan kepemilikan data antar entitas bisnis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Hak Pengguna Sesuai UU PDP */}
        <section id="hak-pengguna" className="scroll-mt-24 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Hak Pengendalian Data Anda (UU PDP No. 27/2022)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">Anda memegang kendali penuh atas data pribadi yang tersimpan di platform kami.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hak Akses &amp; Pembaruan Data
              </div>
              <p className="leading-relaxed text-xs">
                Anda berhak melihat, memperbarui profil, atau mengubah informasi kontak perusahaan Anda kapan saja melalui Dashboard.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" /> Hak Penghapusan (Right to Erasure)
              </div>
              <p className="leading-relaxed text-xs">
                Anda dapat mengajukan permohonan penghapusan akun dan seluruh riwayat lowongan kerja secara permanen dari server kami.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: Cookies & Pelacakan */}
        <section id="cookies" className="scroll-mt-24 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Kebijakan Cookies &amp; Local Storage</h2>
              <p className="text-xs sm:text-sm text-slate-500">Bagaimana kami menggunakan cookie peramban untuk kenyamanan navigasi.</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            LokerTimika menggunakan <em>Cookies</em> dan <em>Local Storage</em> esensial semata-mata untuk:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
            <li>Menyimpan sesi otentikasi login aman bagi akun perusahaan dan admin.</li>
            <li>Menyimpan preferensi daftar lowongan pekerjaan tersimpan (Saved Jobs) di perangkat Anda.</li>
            <li>Mengingat preferensi tampilan (Dark / Light mode).</li>
          </ul>
          <p className="text-xs text-slate-500 italic">
            Kami tidak menggunakan cookies pihak ketiga yang melacak aktivitas penjelajahan Anda di luar situs web LokerTimika.
          </p>
        </section>

        {/* SECTION 6: Kontak Tim Privasi & DPO */}
        <section id="kontak-privasi" className="scroll-mt-24 rounded-3xl bg-blue-50/70 border border-blue-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs">
              <Mail className="w-4 h-4" /> Petugas Perlindungan Data (DPO)
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Punya Pertanyaan atau Permintaan Terkait Privasi Data?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tim Data Protection Officer (DPO) kami siap melayani permintaan akses, perbaikan, atau penghapusan data Anda.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              href="mailto:support@lokertimika.com?subject=Permintaan%20Terkait%20Privasi%20Data"
              className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Mail className="w-4 h-4" /> Email DPO
            </a>
            <Link
              href="/contact"
              className="h-11 px-5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <Headphones className="w-4 h-4" /> Form Bantuan
            </Link>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
          <p>Terakhir diperbarui: 18 Agustus 2026 • Versi Kebijakan 2.1</p>
          <div className="flex items-center gap-4">
            <Link href="/ketentuan-pasang-loker" className="text-primary hover:underline">
              Ketentuan Layanan
            </Link>
            <span>•</span>
            <Link href="/contact" className="text-primary hover:underline">
              Pusat Bantuan &amp; Kontak
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
