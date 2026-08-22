import Link from "next/link";
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  HelpCircle, 
  Headphones, 
  Ban, 
  BadgeCheck, 
  Briefcase, 
  Scale, 
  MessageCircle,
  AlertOctagon,
  Store
} from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ketentuan & Panduan Pasang Lowongan - LokerTimika',
  description: 'Syarat, ketentuan, panduan etika rekrutmen, dan kebijakan keamanan untuk memasang lowongan pekerjaan di LokerTimika.',
};

export default function KetentuanPasangLoker() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="container mx-auto px-4 max-w-4xl pt-8 sm:pt-10">
        <Link 
          href="/jobs" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors group mb-6"
        >
          <div className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span>Kembali ke Daftar Lowongan</span>
        </Link>

        {/* Minimalist Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Pedoman Resmi &amp; Kebijakan Layanan</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Ketentuan Pemasangan Lowongan
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl">
            LokerTimika berkomitmen menjaga ruang informasi kerja yang aman, transparan, dan terpercaya bagi masyarakat Kabupaten Mimika dan sekitarnya. Mohon pelajari ketentuan berikut sebelum mempublikasikan lowongan.
          </p>

          {/* Quick Stats Badges */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              100% Gratis Pasang Loker
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
              <Clock className="w-4 h-4 text-primary" />
              Moderasi &lt; 24 Jam
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 font-medium text-rose-700">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Zero Tolerance Pungli
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
              <Store className="w-4 h-4 text-amber-600" />
              Perusahaan &amp; UMKM
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href="/panduan-pasang-loker"
              className="h-10 px-4 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Lihat Panduan Lengkap Pasang Loker (Step-by-Step)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Anchor Navigation */}
        <div className="mt-6 bg-white border border-slate-200/90 rounded-2xl p-2 shadow-xs flex items-center gap-1 overflow-x-auto text-xs font-semibold text-slate-600 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-slate-400 text-[11px] font-bold px-2 shrink-0 font-mono">Menu:</span>
          <a href="#dos-donts" className="px-3 py-1.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap">
            DOs &amp; DON&apos;Ts
          </a>
          <a href="#kriteria" className="px-3 py-1.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap">
            Kriteria Konten
          </a>
          <a href="#moderasi" className="px-3 py-1.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap">
            Alur Moderasi
          </a>
          <a href="#anti-pungli" className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors whitespace-nowrap font-bold">
            Larangan Pungli
          </a>
          <a href="#faq" className="px-3 py-1.5 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap">
            FAQ
          </a>
        </div>
      </div>

      {/* 2. MAIN CONTENT BODY */}
      <div className="container mx-auto px-4 max-w-4xl mt-8 space-y-10">

        {/* SECTION 1: DOs & DON'Ts */}
        <section id="dos-donts" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              1. Panduan Cepat: Boleh vs Dilarang
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Prinsip utama agar lowongan kerja Anda lolos kurasi dan segera dipublikasikan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* DOs Card */}
            <div className="bg-white border border-emerald-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-100 pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Wajib &amp; Dianjurkan (DOs)</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                  <span><strong>Identitas Usaha / Perusahaan Jelas:</strong> Cantumkan nama perusahaan, toko, kafe, atau instansi asli di wilayah Mimika.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                  <span><strong>Uraian Tugas &amp; Kualifikasi:</strong> Jelaskan tanggung jawab, batas pendidikan, dan keahlian secara realistis.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                  <span><strong>Kontak Resmi:</strong> Sediakan nomor WhatsApp penanggung jawab / perekrut yang aktif, email instansi, atau link form lamaran.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-emerald-600 mt-0.5">✓</span>
                  <span><strong>Transparansi Gaji:</strong> Menampilkan perkiraan nominal gaji menarik lebih banyak kandidat relevan.</span>
                </li>
              </ul>
            </div>

            {/* DON'Ts Card */}
            <div className="bg-white border border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm border-b border-rose-100 pb-3">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Dilarang Keras &amp; Ditolak (DON&apos;Ts)</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-rose-600 mt-0.5">✕</span>
                  <span><strong>Memungut Biaya Apapun:</strong> Dilarang meminta biaya pendaftaran, seragam, tes, atau tiket travel fiktif.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-rose-600 mt-0.5">✕</span>
                  <span><strong>Lowongan Palsu / Scam:</strong> Modus berkedok MLM, judi online, trading ilegal, atau kerja paruh waktu palsu.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-rose-600 mt-0.5">✕</span>
                  <span><strong>Diskriminasi &amp; Eksploitasi:</strong> Unsur SARA yang melanggar norma hukum ketenagakerjaan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-rose-600 mt-0.5">✕</span>
                  <span><strong>Kontak Fiktif / Perantara Liar:</strong> Menggunakan identitas palsu untuk mengelabui pelamar.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 2: KRITERIA KONTEN */}
        <section id="kriteria" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              2. Kriteria &amp; Kelayakan Konten Lowongan
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Standar baku informasi rekrutmen agar dapat ditayangkan di platform.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Building2 className="w-4 h-4 text-primary shrink-0" />
                  <span>Identitas &amp; Legalitas Usaha</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Pemasang loker wajib menyertakan nama badan usaha, PT, CV, toko, kafe, atau instansi yang nyata dan beroperasi di wilayah Mimika.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Briefcase className="w-4 h-4 text-primary shrink-0" />
                  <span>Deskripsi Tugas &amp; Kualifikasi</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Uraikan peran kerja (Job Description) secara ringkas dan tentukan syarat minimal seperti pendidikan formal dan rentang pengalaman kerja.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>Saluran Penerimaan Lamaran</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Mendukung saluran WhatsApp HRD, Email Resmi, atau Link Form Pendaftaran langsung tanpa perantara tidak resmi.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Scale className="w-4 h-4 text-primary shrink-0" />
                  <span>Etika &amp; Kerahasiaan Data Pelamar</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  Perekrut dilarang menyalahgunakan berkas pelamar (CV/KTP) untuk kepentingan di luar proses seleksi lowongan terkait.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 3: ALUR MODERASI */}
        <section id="moderasi" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              3. Alur Verifikasi &amp; Waktu Peninjauan
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Setiap lowongan ditinjau oleh tim kurator sebelum tayang secara publik.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-xs text-slate-900">Pengiriman Formulir</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Perekrut melengkapi data profil, rincian posisi, dan kontak pada halaman Pasang Lowongan.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-bold text-xs text-slate-900">Review Kurasi (&lt; 24 Jam)</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Admin memverifikasi keaslian kontak, memeriksa kejelasan isi, dan memastikan bebas indikasi pungli.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="font-bold text-xs text-slate-900">Lowongan Aktif</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Lowongan langsung tayang di portal pencarian LokerTimika dan siap dilamar kandidat.
                </p>
              </div>

            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span><strong>Jam Layanan Moderasi:</strong> Setiap hari (08.00 – 21.00 WIT). Lowongan masuk di luar jam layanan akan diproses pada pagi hari berikutnya.</span>
            </div>
          </div>
        </section>

        {/* SECTION 4: LARANGAN PUNGLI */}
        <section id="anti-pungli" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-600" />
              <span>4. Larangan Pungutan Biaya (Anti-Pungli)</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Komitmen perlindungan tanpa toleransi terhadap segala bentuk penipuan kerja.
            </p>
          </div>

          <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-5 sm:p-6 space-y-3.5 text-xs text-slate-800">
            <p className="leading-relaxed">
              LokerTimika <strong>TIDAK MENOLERANSI</strong> segala bentuk pemungutan biaya dalam proses rekrutmen. Modus yang dilarang keras meliputi:
            </p>

            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 font-medium">
              <li>Biaya administrasi pendaftaran atau biaya formulir berkas.</li>
              <li>Biaya seragam, ID card, atau biaya pelatihan kerja sebelum masuk.</li>
              <li>Biaya tiket travel, tiket pesawat, atau hotel dengan iming-iming penggantian (reimburse) fiktif.</li>
              <li>Biaya tes kesehatan di klinik tertentu yang tidak resmi.</li>
            </ul>

            <div className="pt-2 border-t border-rose-200/80 text-[11px] text-rose-800 font-semibold flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Pelanggaran yang terbukti akan langsung berakibat pemblokiran akun dan penghapusan lowongan secara permanen.</span>
            </div>
          </div>
        </section>

        {/* SECTION 5: FAQ */}
        <section id="faq" className="scroll-mt-24 space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              5. Pertanyaan Umum (FAQ)
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Pertanyaan yang sering diajukan seputar publikasi lowongan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-primary font-bold">Q:</span> Berapa lama lowongan tayang?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-4">
                Lowongan tayang hingga tanggal batas lamaran (deadline) yang ditentukan, atau otomatis ditutup setelah 30 hari.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-primary font-bold">Q:</span> Mengapa lowongan saya ditolak?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-4">
                Penyebab umum meliputi data yang tidak lengkap, kontak yang tidak dapat dihubungi saat kurasi, atau adanya indikasi biaya pendaftaran.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-primary font-bold">Q:</span> Apakah UMKM &amp; Toko boleh memasang loker?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-4">
                Sangat boleh. LokerTimika terbuka dan 100% gratis untuk seluruh pelaku UMKM, kafe, toko, bengkel, hingga perusahaan besar di Mimika.
              </p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-1.5">
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span className="text-primary font-bold">Q:</span> Bagaimana cara menutup lowongan yang sudah terisi?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-4">
                Gunakan tautan kelola lowongan (magic link) yang dikirim saat memasang lowongan, atau melalui Dasbor akun perusahaan.
              </p>
            </div>
          </div>
        </section>

        {/* 6. MINIMALIST BOTTOM CTA */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Siap Memasang Lowongan Kerja?
            </h3>
            <p className="text-xs text-slate-500 max-w-md">
              Publikasikan info lowongan pekerjaan Anda secara gratis dan jangkau ribuan pencari kerja di wilayah Timika.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Link href="/post" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer">
                <span>Pasang Lowongan Gratis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-all cursor-pointer">
                Pusat Bantuan
              </button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
