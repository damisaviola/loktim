import Link from "next/link";
import { TrustBanner } from "@/components/TrustBanner";
import { Search, Zap, ShieldCheck, Trophy, ArrowRight, Sparkles, MapPin, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-52 -left-40 w-[480px] h-[480px] rounded-full bg-blue-50 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-24 sm:pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Platform Karir #1 di Mimika &amp; Papua
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.1]">
              Temukan Karir{" "}
              <span className="text-primary">Impian Anda.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Akses langsung ke ribuan lowongan pekerjaan terbaik dari perusahaan
              terkemuka di Timika, dari pertambangan hingga ritel, dengan platform
              yang cepat dan terpercaya.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/jobs" className="w-full sm:w-auto">
                <button className="h-12 px-7 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-semibold text-sm flex items-center justify-center gap-2 w-full cursor-pointer">
                  <Search className="w-4 h-4" />
                  Cari Lowongan
                </button>
              </Link>
              <Link href="/post" className="w-full sm:w-auto">
                <button className="h-12 px-7 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors font-semibold text-sm flex items-center justify-center gap-2 w-full cursor-pointer">
                  Pasang Loker
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Minimal Job Card Visual */}
          <div className="flex-1 w-full max-w-md lg:max-w-none relative">
            <div className="relative mx-auto max-w-md">
              {/* Job card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 p-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    PT
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">Mekanik Alat Berat</p>
                    <p className="text-xs text-slate-400">PT Freeport Indonesia</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-500">
                    Teknik &amp; Engineering
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-500">
                    Full-time
                  </span>
                </div>

                <div className="mt-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Kuala Kencana, Timika
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Batas lamaran 30 Agustus 2026
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">Rp 8 - 15 jt</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Aktif
                  </span>
                </div>
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-5 -left-3 sm:-left-6 rounded-xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Perusahaan</p>
                  <p className="text-sm font-bold text-slate-900">Terverifikasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <div className="border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-14">
          <p className="text-center text-sm font-medium text-slate-400 uppercase tracking-widest mb-8">
            Dipercaya oleh ribuan profesional
          </p>
          <TrustBanner />
        </div>
      </div>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            Satu Platform untuk Karir Anda
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed">
            Dirancang untuk mempertemukan talenta terbaik dengan perusahaan
            terkemuka di Papua secara cepat dan aman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 transition-shadow hover:shadow-lg hover:shadow-slate-200/50">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950 mb-2.5">Cepat &amp; Mudah</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Tanpa registrasi berbelit. Temukan lowongan, unggah CV, dan langsung
              lamar pekerjaan impian Anda dalam hitungan detik.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 transition-shadow hover:shadow-lg hover:shadow-slate-200/50">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950 mb-2.5">100% Terverifikasi</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Setiap perusahaan dan loker melewati kurasi manual ketat untuk
              memastikan lingkungan yang aman dan bebas penipuan.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 transition-shadow hover:shadow-lg hover:shadow-slate-200/50">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950 mb-2.5">Peluang Terbaik</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Bermitra eksklusif dengan puluhan perusahaan terkemuka, memberikan
              Anda akses prioritas ke peluang karir terbaik.
            </p>
          </div>
        </div>
      </section>

      {/* Recruiter CTA Section */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -top-32 right-0 w-[400px] h-[400px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-28 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Rekrut Talenta Terbaik.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
              Bergabunglah dengan ekosistem karir paling canggih di Papua. Jangkau
              ribuan kandidat terverifikasi dengan platform rekrutmen kami.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/post">
              <button className="h-12 px-8 rounded-xl bg-white text-slate-950 hover:bg-slate-100 transition-colors font-semibold text-sm flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer">
                Mulai Merekrut Sekarang
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}