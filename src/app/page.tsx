import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ShieldCheck, Zap, Building2, ArrowRight, MapPin, Clock, Search } from "lucide-react";

const stats = [
  { value: "500+", label: "Lowongan Aktif" },
  { value: "150+", label: "Perusahaan Terverifikasi" },
  { value: "10K+", label: "Pencari Kerja" },
  { value: "100%", label: "Bebas Penipuan" },
];

const features = [
  {
    icon: Zap,
    accent: "bg-primary/10 text-primary",
    title: "Cepat & Mudah",
    desc: "Tanpa registrasi berbelit. Temukan lowongan, unggah CV, dan langsung lamar pekerjaan impian Anda dalam hitungan detik.",
  },
  {
    icon: ShieldCheck,
    accent: "bg-emerald-50 text-emerald-600",
    title: "100% Terverifikasi",
    desc: "Setiap perusahaan dan loker melewati kurasi manual ketat untuk memastikan lingkungan yang aman dan bebas penipuan.",
  },
  {
    icon: Building2,
    accent: "bg-sky-50 text-sky-600",
    title: "Peluang Terbaik",
    desc: "Bermitra eksklusif dengan puluhan perusahaan terkemuka, memberikan Anda akses prioritas ke peluang karir terbaik.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-background to-background" />
        <div
          aria-hidden="true"
          className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-2 lg:gap-12 lg:pb-24">
          {/* Copy */}
          <Reveal className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              Platform Karir #1 di Mimika &amp; Papua
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Temukan Karir{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                Impian Anda.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg lg:mx-0">
              Akses langsung ke ribuan lowongan pekerjaan terbaik dari perusahaan
              terkemuka di Timika, dari pertambangan hingga ritel — cepat, aman,
              dan terpercaya.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Link
                href="/jobs"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-primary/90 sm:w-auto"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Cari Lowongan
              </Link>
              <Link
                href="/post"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
              >
                Pasang Loker
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>

          {/* Job Card Visual */}
          <Reveal delay={150} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
              <div className="h-1.5 bg-gradient-to-r from-primary to-sky-500" />

              <div className="p-6">
                {/* Header: logo + title/company + status */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-sm font-bold text-white shadow-sm shadow-primary/20">
                    PT
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">Mekanik Alat Berat</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">PT Freeport Indonesia</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </span>
                    Aktif
                  </span>
                </div>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500">
                    Teknik &amp; Engineering
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-500">
                    Full-time
                  </span>
                </div>

                {/* Info grid */}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Lokasi</p>
                      <p className="truncate text-xs font-semibold text-slate-700">Kuala Kencana, Timika</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <Clock className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Batas lamaran</p>
                      <p className="truncate text-xs font-semibold text-slate-700">30 Agustus 2026</p>
                    </div>
                  </div>
                </div>

                {/* Footer: salary + apply */}
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-lg font-extrabold tracking-tight text-slate-950">Rp 8 - 15 jt</p>
                    <p className="text-[11px] font-medium text-slate-400">per bulan</p>
                  </div>
                  <span className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary/10 px-4 text-xs font-semibold text-primary">
                    Lamar Sekarang
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </div>

            {/* Floating verified badge */}
            <div className="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm shadow-slate-200/60 sm:-left-6 animate-float">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">Perusahaan</p>
                <p className="text-sm font-bold text-slate-900">Terverifikasi</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 py-12 sm:px-8 md:grid-cols-4 lg:px-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 100} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs font-medium text-slate-500 sm:text-sm">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Satu Platform untuk Karir Anda
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
            Dirancang untuk mempertemukan talenta terbaik dengan perusahaan
            terkemuka di Papua secara cepat dan aman.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 120}>
              <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60">
                <div
                  className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${feature.accent}`}
                >
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-slate-950">{feature.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-500">{feature.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Recruiter CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 sm:pb-28 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center sm:px-16 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Rekrut Talenta Terbaik.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                Bergabunglah dengan ekosistem karir paling canggih di Papua. Jangkau
                ribuan kandidat terverifikasi dengan platform rekrutmen kami.
              </p>
              <div className="mt-8">
                <Link
                  href="/post"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-slate-950 transition-all duration-300 hover:bg-slate-100"
                >
                  Mulai Merekrut Sekarang
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">
                Gratis untuk perusahaan terverifikasi · Tanpa biaya tersembunyi
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
