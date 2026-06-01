import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, ShieldAlert, KeyRound, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 max-w-[800px] py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      <div className="bg-card rounded-2xl border border-border/60 p-6 sm:p-10 shadow-lg">
        
        {/* Header */}
        <div className="border-b border-border/60 pb-6 mb-8 text-center sm:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">Kebijakan Privasi LokerTimika</h1>
          <p className="text-sm text-muted-foreground">Terakhir diperbarui: 31 Mei 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p className="leading-relaxed">
            Selamat datang di LokerTimika. Kami sangat menghargai kepercayaan Anda dan berkomitmen untuk melindungi informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda ketika Anda menggunakan situs web kami.
          </p>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary shrink-0" />
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p className="leading-relaxed">
              Kami mengumpulkan informasi dari Anda ketika Anda mendaftar di situs kami, membuat profil pencari kerja, mengunggah CV/resume, memasang lowongan kerja, atau menghubungi kami secara langsung. Informasi tersebut meliputi:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li><strong>Data Pribadi:</strong> Nama, alamat email, nomor telepon, alamat tinggal, riwayat pendidikan, dan riwayat pekerjaan.</li>
              <li><strong>Informasi Perusahaan:</strong> Nama perusahaan, logo, deskripsi, alamat kantor, dan kontak HRD (untuk pemasang loker).</li>
              <li><strong>Data Penggunaan:</strong> Alamat IP, jenis peramban (browser), halaman yang Anda kunjungi, dan waktu akses Anda.</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
              2. Cara Kami Menggunakan Informasi Anda
            </h2>
            <p className="leading-relaxed">
              Informasi yang kami kumpulkan digunakan untuk berbagai tujuan operasional, termasuk:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Memproses pendaftaran akun dan mencocokkan profil pencari kerja dengan lowongan yang sesuai.</li>
              <li>Memungkinkan perusahaan menghubungi Anda terkait lamaran pekerjaan yang Anda kirimkan.</li>
              <li>Meningkatkan fungsionalitas, keamanan, dan desain website kami agar lebih nyaman digunakan.</li>
              <li>Mengirimkan notifikasi berkala, email konfirmasi, dan pembaruan informasi lowongan kerja yang relevan.</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary shrink-0" />
              3. Keamanan Data
            </h2>
            <p className="leading-relaxed">
              Kami menerapkan berbagai langkah keamanan teknis dan organisasi untuk menjaga kerahasiaan dan keamanan informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Data kata sandi disimpan dengan enkripsi satu arah yang aman. Namun, perlu diingat bahwa metode transmisi data melalui internet atau penyimpanan elektronik tidak 100% aman sepenuhnya.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              4. Hubungi Kami
            </h2>
            <p className="leading-relaxed">
              Apabila Anda memiliki pertanyaan, keberatan, atau ingin meminta penghapusan informasi pribadi Anda dari sistem kami, jangan ragu untuk menghubungi kami melalui halaman <Link href="/contact" className="text-primary hover:underline font-semibold">Hubungi Kami</Link> atau mengirim email langsung ke:
            </p>
            <p className="bg-secondary/40 p-4 rounded-xl text-foreground text-xs font-semibold inline-block">
              support@lokertimika.com
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
