import Link from "next/link";
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Building2, 
  FileText, 
  Users, 
  AlertOctagon, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Headphones, 
  ChevronRight, 
  Ban, 
  BadgeCheck, 
  Briefcase, 
  Scale, 
  Lock,
  Mail,
  MessageCircle,
  Eye
} from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ketentuan & Panduan Pasang Lowongan - LokerTimika',
  description: 'Syarat, ketentuan, panduan etika rekrutmen, dan kebijakan keamanan untuk memasang lowongan pekerjaan di LokerTimika.',
};

export default function KetentuanPasangLoker() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pb-24">
      {/* Top Header Glow & Breadcrumb */}
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
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 text-[11px] sm:text-xs font-bold tracking-wide uppercase mb-5 backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Pedoman Resmi &amp; Kebijakan Layanan
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-snug mb-4">
              Ketentuan &amp; Panduan <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-teal-300 bg-clip-text text-transparent">Pasang Lowongan</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal mb-8">
              LokerTimika berkomitmen menjaga ruang informasi kerja yang aman, transparan, dan terpercaya bagi masyarakat Kabupaten Mimika dan sekitarnya. Mohon pelajari ketentuan berikut sebelum mempublikasikan lowongan.
            </p>

            {/* Quick Highlights Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <BadgeCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">100% Bebas Biaya</div>
                  <div className="text-[11px] text-slate-400">Pemasangan loker gratis</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Moderasi Cepat</div>
                  <div className="text-[11px] text-slate-400">Review maks. 1x24 jam</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 backdrop-blur-xs">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Zero Tolerance Pungli</div>
                  <div className="text-[11px] text-slate-400">Proteksi ketat pelamar</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Anchor Navigation Bar */}
        <div className="mt-8 bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-600 no-scrollbar">
          <span className="text-slate-400 uppercase text-[10px] tracking-wider font-bold px-2 shrink-0">Lompat ke:</span>
          <a href="#panduan-cepat" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            DOs &amp; DON&apos;Ts
          </a>
          <a href="#kriteria-konten" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Kriteria Konten
          </a>
          <a href="#alur-moderasi" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Alur Moderasi
          </a>
          <a href="#larangan-keras" className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors whitespace-nowrap font-bold">
            Larangan Pungli
          </a>
          <a href="#faq" className="px-3 py-1.5 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap">
            Tanya Jawab (FAQ)
          </a>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="container mx-auto px-4 max-w-5xl mt-10 space-y-12 sm:space-y-16">

        {/* SECTION 1: DOs & DON'Ts Comparison */}
        <section id="panduan-cepat" className="scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-primary" />
              Panduan Cepat: Boleh vs Tidak Boleh
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Ringkasan prinsip dasar agar lowongan kerja Anda lolos kurasi dan segera dipublikasikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DOs Card */}
            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-emerald-800 font-extrabold text-base sm:text-lg mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  Yang Wajib &amp; Sangat Dianjurkan (DOs)
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                    <span><strong>Nama Perusahaan &amp; Lokasi Jelas:</strong> Cantumkan nama usaha asli beserta alamat operasional di wilayah Mimika / Papua Tengah.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                    <span><strong>Rincian Tugas &amp; Kualifikasi:</strong> Jelaskan tanggung jawab kerja, jenjang pendidikan, keahlian, dan batas usia secara realistis.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                    <span><strong>Kontak HRD Resmi:</strong> Sediakan nomor WhatsApp aktif, alamat email resmi, atau tautan portal pendaftaran langsung.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                    <span><strong>Transparansi Gaji &amp; Benefit:</strong> Mencantumkan kisaran gaji sangat disarankan agar memikat kandidat berkualitas.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200/60 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> Lowongan yang lengkap akan disetujui lebih cepat oleh admin.
              </div>
            </div>

            {/* DON'Ts Card */}
            <div className="bg-rose-50/40 border border-rose-200/80 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-rose-800 font-extrabold text-base sm:text-lg mb-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <XCircle className="w-5 h-5" />
                  </div>
                  Yang Dilarang Keras &amp; Ditolak (DON&apos;Ts)
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                    <span><strong>Memungut Biaya Apapun (PUNGLI):</strong> Meminta uang registrasi, seragam, tes psikotes berbayar, atau tiket travel fiktif.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                    <span><strong>Lowongan Palsu / Penipuan (Scam):</strong> Lowongan berkedok MLM, judi online, trading ilegal, atau tawaran kerja paruh waktu fiktif.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                    <span><strong>Unsur SARA &amp; Eksploitasi:</strong> Diskriminasi yang melanggar hukum, pelecehan, atau eksploitasi tenaga kerja.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✕</span>
                    <span><strong>Data Kontak Fiktif / Perantara Liar:</strong> Menggunakan nomor tanpa kejelasan identitas atau mengelabui pelamar.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-200/60 text-xs text-rose-700 font-semibold flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 shrink-0" /> Pelanggaran berat berakibat pemblokiran akun dan sanksi hukum.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Kriteria Konten Detail (Bento Grid) */}
        <section id="kriteria-konten" className="scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-primary" />
              Syarat &amp; Kriteria Detail Konten Lowongan
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Standar baku penyusunan informasi rekrutmen di portal LokerTimika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Identitas */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-primary/40 transition-all space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">1. Identitas &amp; Legalitas Perusahaan</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pemasang loker wajib menyertakan nama perusahaan/instansi/toko yang valid. Penggunaan istilah <em>&quot;Perusahaan Dirahasiakan&quot;</em> hanya diperkenankan untuk agensi rekrutmen resmi (Headhunter) dengan verifikasi dokumen terlebih dahulu.
              </p>
            </div>

            {/* Card 2: Uraian Tugas */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-primary/40 transition-all space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">2. Deskripsi Pekerjaan &amp; Syarat Kualifikasi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Uraikan lingkup pekerjaan (Job Description) secara lugas. Tentukan kualifikasi minimal seperti pendidikan formal (SMA/SMK, D3, S1), rentang pengalaman kerja, keahlian khusus, dan penempatan kerja yang pasti.
              </p>
            </div>

            {/* Card 3: Saluran Lamaran */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-primary/40 transition-all space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">3. Metode &amp; Saluran Lamaran (Multi-Channel)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sistem kami mendukung 3 metode utama: <strong>WhatsApp Direct</strong>, <strong>Email Perusahaan</strong>, dan <strong>Formulir / Website Resmi</strong>. Anda dapat mengaktifkan lebih dari satu metode agar mempermudah calon pelamar mengirim CV.
              </p>
            </div>

            {/* Card 4: Etika Rekrutmen */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs hover:border-primary/40 transition-all space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-2xs">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">4. Etika Rekrutmen &amp; Perlindungan Data</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Perusahaan dilarang menyalahgunakan data pribadi pelamar (KTP, CV, nomor telepon) untuk kepentingan di luar proses rekrutmen atau memindahtangankan data kepada pihak ketiga tanpa izin pelamar.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: Alur Moderasi & SLA */}
        <section id="alur-moderasi" className="scroll-mt-24 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold mb-3">
              <Clock className="w-3.5 h-3.5" /> Standar Pelayanan Moderasi
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Alur &amp; Waktu Peninjauan (Review)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Setiap lowongan yang diajukan akan melalui verifikasi tim kurator sebelum terbit secara publik.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-primary text-white font-extrabold text-sm flex items-center justify-center shadow-2xs">
                1
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Pengiriman Formulir</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Perusahaan melengkapi form lowongan dan memverifikasi proteksi bot Cloudflare Turnstile.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-extrabold text-sm flex items-center justify-center shadow-2xs">
                2
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Verifikasi Admin (Maks 1x24 Jam)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tim admin mengecek keabsahan perusahaan, kontak PIC, dan memastikan tidak ada indikasi pungli/penipuan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow-2xs">
                3
              </div>
              <h3 className="font-extrabold text-sm text-slate-900">Publikasi &amp; Notifikasi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lowongan langsung aktif di portal pencarian dan notifikasi otomatis dikirimkan ke email perusahaan.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Hari Kerja Moderasi:</strong> Senin – Sabtu (08.00 – 21.00 WIT). Lowongan yang masuk di luar jam kerja atau hari libur nasional akan diproses pada hari kerja berikutnya.
            </div>
          </div>
        </section>

        {/* SECTION 4: Larangan Keras & Anti-Pungli (Critical Alert) */}
        <section id="larangan-keras" className="scroll-mt-24">
          <div className="rounded-3xl bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 p-6 sm:p-10 text-white border border-rose-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold uppercase">
                <Ban className="w-4 h-4 text-rose-400" />
                Ketentuan Mutlak (Zero Tolerance)
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Pemberitahuan Khusus: Larangan Keras Pungutan Biaya (Pungli)!
              </h2>

              <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
                LokerTimika didirikan atas dasar kepedulian sosial untuk membantu masyarakat Mimika mendapatkan pekerjaan yang layak. Kami <strong>MENGUTUK KERAS</strong> dan <strong>TIDAK MENOLERANSI</strong> segala bentuk pemungutan biaya kepada calon pelamar dalam proses rekrutmen.
              </p>

              <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs text-slate-200">
                <div className="font-bold text-white flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400" /> Modus yang Sering Ditemui &amp; Dilarang Keras:
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li>Biaya administrasi pendaftaran atau biaya formulir lamaran.</li>
                  <li>Biaya penggantian seragam, ID card, atau training sebelum mulai bekerja.</li>
                  <li>Biaya reservasi tiket pesawat/travel atau hotel dengan iming-iming penggantian (reimburse) fiktif.</li>
                  <li>Biaya tes kesehatan/psikotes di klinik yang ditunjuk secara tidak wajar.</li>
                </ul>
              </div>

              <p className="text-xs text-rose-200/90 leading-relaxed font-medium">
                Apabila ada laporan terbukti mengenai pemungutan biaya atau penipuan, tim kami akan <strong>seketika menghapus lowongan, memblokir permanen nomor telepon dan akun perusahaan</strong>, serta menyerahkan data rekam jejak kepada pihak berwajib jika dibutuhkan.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: Edit, Revisi & Penutupan Lowongan */}
        <section id="revisi-loker" className="scroll-mt-24 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Perubahan Data &amp; Penutupan Lowongan</h2>
              <p className="text-xs sm:text-sm text-slate-500">Panduan mengelola lowongan yang telah aktif terbit.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600 pt-2">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-primary" /> Melalui Dashboard Perusahaan
              </div>
              <p className="leading-relaxed">
                Perusahaan terdaftar dapat langsung mengubah batas lamaran (deadline), memperbarui status lowongan menjadi &quot;Ditutup&quot;, atau melihat analitik views melalui halaman Dashboard.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-purple-600" /> Bantuan Admin / Helpdesk
              </div>
              <p className="leading-relaxed">
                Untuk perubahan krusial (seperti nama posisi atau badan usaha), silakan hubungi tim Customer Support kami melalui halaman Kontak dengan menyertakan tautan lowongan yang dimaksud.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6: FAQ Accordion / Cards */}
        <section id="faq" className="scroll-mt-24 space-y-4">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-primary" />
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Jawaban cepat seputar kebijakan dan pemasangan loker di LokerTimika.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="text-primary font-black">Q:</span> Berapa lama lowongan akan tayang?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                Lowongan akan tayang hingga batas tanggal lamaran (deadline) yang Anda tentukan, atau otomatis berstatus selesai setelah 30 hari kalender jika tidak ditentukan.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="text-primary font-black">Q:</span> Mengapa lowongan saya ditolak?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                Alasan penolakan umumnya meliputi informasi yang kurang lengkap, kontak tidak aktif saat diverifikasi, atau terindikasi melanggar norma dan larangan biaya.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="text-primary font-black">Q:</span> Apakah bisa memasang lowongan di luar Mimika?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                Kami memprioritaskan penempatan kerja di wilayah Kabupaten Mimika dan Papua Tengah. Untuk penempatan luar kota/remote, wajib mencantumkan keterangan domisili yang jelas.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span className="text-primary font-black">Q:</span> Apakah data kontak HRD saya aman?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                Data kontak (WhatsApp / Email) hanya ditampilkan di halaman lowongan untuk keperluan lamaran kerja dan dilindungi oleh Kebijakan Privasi kami.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="mt-16 rounded-3xl bg-radial from-slate-900 via-slate-850 to-slate-950 p-8 sm:p-12 text-white border border-slate-800 shadow-xl relative overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Siap Merekrut Talenta Terbaik di Mimika?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Mari bersama ciptakan iklim rekrutmen yang bersih, aman, dan profesional untuk kemajuan tenaga kerja lokal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
              <Link href="/post" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20 cursor-pointer">
                  Pasang Lowongan Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <Headphones className="w-4 h-4" />
                  Hubungi Bantuan
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
