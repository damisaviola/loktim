import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertTriangle, Info, Clock, ShieldCheck, HelpCircle, Edit, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ketentuan Pemasangan Lowongan - LokTim',
  description: 'Syarat, ketentuan, dan panduan untuk memasang lowongan pekerjaan di LokTim.',
};

export default function KetentuanPasangLoker() {
  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[700px] py-12 sm:py-20">
      
      {/* Header */}
      <header className="mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase mb-6">
          <Info className="w-3.5 h-3.5" /> Panduan Pengguna
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          Ketentuan Pasang <span className="text-blue-600">Lowongan</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Platform kami didedikasikan untuk menyediakan informasi lowongan kerja yang valid, aman, dan tepercaya bagi masyarakat Mimika. Mohon baca dengan saksama ketentuan berikut sebelum Anda mempublikasikan lowongan.
        </p>
      </header>

      <div className="space-y-12 sm:space-y-16">
        
        {/* Section 1: Benefit */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Keuntungan Pasang Loker</h2>
          </div>
          <div className="pl-11">
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed"><strong className="text-foreground">100% Gratis</strong> tanpa biaya pendaftaran, biaya admin, atau potongan apapun.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Jangkauan luas ke ribuan pencari kerja aktif, khususnya di wilayah Mimika.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Proses pemasangan yang cepat dan responsif dengan form yang mudah digunakan.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: Review */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Proses Peninjauan (Review)</h2>
          </div>
          <div className="pl-11">
            <p className="text-muted-foreground leading-relaxed mb-5">
              Untuk menjaga kualitas dan keamanan bagi para pencari kerja, setiap lowongan yang masuk akan melewati proses moderasi oleh tim admin kami.
            </p>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Lowongan akan direview maksimal <strong className="text-foreground">1x24 jam</strong> pada hari kerja.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Lowongan yang telah disetujui akan langsung tayang di halaman utama.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Tim kami berhak <strong className="text-foreground">menolak atau menghapus</strong> lowongan jika terindikasi penipuan (scam) atau melanggar norma yang berlaku.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Syarat Konten */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Syarat Konten Lowongan</h2>
          </div>
          <div className="pl-11">
            <p className="text-muted-foreground leading-relaxed mb-6">
              Agar lowongan Anda cepat disetujui dan menarik kandidat yang tepat, pastikan Anda memenuhi kriteria berikut saat mengisi form:
            </p>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-sm shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Identitas Perusahaan Jelas</h3>
                  <p className="text-muted-foreground leading-relaxed">Cantumkan nama perusahaan asli. Hindari menggunakan nama samaran atau "Perusahaan Dirahasiakan" tanpa alasan yang kuat.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-sm shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Deskripsi & Syarat Detail</h3>
                  <p className="text-muted-foreground leading-relaxed">Tuliskan tanggung jawab pekerjaan dan syarat kandidat (pendidikan, umur, pengalaman) dengan detail dan sejelas-jelasnya.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-sm shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Kontak Valid</h3>
                  <p className="text-muted-foreground leading-relaxed">Sertakan email HRD atau WhatsApp perusahaan yang aktif. Jangan cantumkan kontak pribadi yang tidak terkait dengan rekrutmen.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center font-bold text-sm shrink-0">4</div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Bebas Unsur SARA & Penipuan</h3>
                  <p className="text-muted-foreground leading-relaxed">Dilarang memasang lowongan fiktif, MLM tanpa penjelasan detail, lowongan penipuan (scam), atau unsur SARA.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Edit */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Edit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Pengubahan / Edit Lowongan</h2>
          </div>
          <div className="pl-11">
            <p className="text-muted-foreground leading-relaxed mb-5">
              Jika terdapat kesalahan penulisan atau Anda ingin mengubah detail (seperti batas lamaran, gaji, atau deskripsi) pada lowongan yang sudah terkirim:
            </p>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Anda dapat menghubungi <strong className="text-foreground">Admin / Support</strong> kami melalui kontak resmi yang tertera di website.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Sertakan informasi <strong className="text-foreground">Nama Perusahaan</strong> dan <strong className="text-foreground">Posisi</strong> yang ingin diedit, beserta bagian mana yang ingin diubah.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">Permintaan perubahan akan diproses secepatnya oleh tim kami.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 5: Larangan Keras */}
        <section className="mt-8 border-l-4 border-red-500 pl-6 py-2">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" />
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Larangan Keras!</h2>
          </div>
          <div className="pl-10">
            <p className="text-foreground leading-relaxed font-medium">
              Platform kami sangat melarang keras pemungutan biaya <strong className="text-red-600 dark:text-red-400 font-bold">(pungli/biaya pendaftaran)</strong> kepada calon pelamar dengan alasan apapun (biaya seragam, training, administrasi, dll). 
            </p>
            <p className="text-foreground leading-relaxed mt-2">
              Jika perusahaan Anda terbukti melakukan hal ini, kami akan langsung memblokir akun dan nama perusahaan Anda dari platform kami secara permanen.
            </p>
          </div>
        </section>

      </div>

      {/* Footer CTA */}
      <div className="mt-20 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">Siap merekrut tim terbaik?</h3>
          <p className="text-muted-foreground">Mari ciptakan ekosistem kerja yang aman di Mimika.</p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Link href="/post" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto font-bold px-8 h-12 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center gap-2">
              Lanjut Pasang Lowongan <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
