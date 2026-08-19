"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { 
  ShieldCheck, 
  Zap, 
  Building2, 
  ArrowRight, 
  MapPin, 
  Clock, 
  Search, 
  Sparkles, 
  BadgeCheck, 
  HardHat, 
  Truck, 
  Briefcase, 
  Cpu, 
  Store, 
  HeartPulse, 
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Check,
  X,
  Flame,
  ArrowUpRight,
  Send,
  Users,
  Compass,
  Laptop
} from "lucide-react";
import { NewsletterCTA } from "@/components/NewsletterCTA";

const quickKeywords = [
  { label: "Mekanik Alat Berat", icon: "⛏️" },
  { label: "Driver LV & Bus", icon: "🚛" },
  { label: "Admin Gudang", icon: "📦" },
  { label: "Safety Officer (HSE)", icon: "🦺" },
  { label: "Barista / Service", icon: "☕" },
  { label: "Operator Excavator", icon: "🚜" },
];

const trendingCategories = [
  {
    icon: HardHat,
    title: "Mining & Heavy Equipment",
    count: "120+ Loker",
    badge: "🔥 HOT HIRING",
    desc: "Mekanik, operator dump truck, surveyor, welder, teknisi alat berat.",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    tag: "Pertambangan",
  },
  {
    icon: Truck,
    title: "Logistik, Transport & Supply",
    count: "85+ Loker",
    badge: "⚡ CEPAT KERJA",
    desc: "Driver LV/bus, staf gudang, checker, inventaris, dispatcher portsite.",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    tag: "Driver",
  },
  {
    icon: Briefcase,
    title: "Finance, HRD & Administrasi",
    count: "60+ Loker",
    badge: "✨ POPULER",
    desc: "Staf keuangan, HR recruitment, kasir korporat, data entry, sekretaris.",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    tag: "Admin",
  },
  {
    icon: Cpu,
    title: "Teknik, Listrik & Maintenance",
    count: "50+ Loker",
    badge: "🛠️ SKILLED",
    desc: "Electrician, maintenance mekanikal, civil drafter, IT & networking.",
    color: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    tag: "Teknik",
  },
  {
    icon: Store,
    title: "Ritel, F&B & Hospitality",
    count: "70+ Loker",
    badge: "🍔 FRESH GRADUATE",
    desc: "Barista, kasir supermarket, cook, waiter/waitress, staf toko.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    tag: "Kasir",
  },
  {
    icon: HeartPulse,
    title: "Kesehatan, Medis & HSE K3",
    count: "40+ Loker",
    badge: "🩺 PRIORITAS",
    desc: "Safety officer K3, dokter, perawat lapangan, environmental specialist.",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    tag: "Safety",
  },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/40 text-slate-900 selection:bg-primary/20 selection:text-primary">
      
      {/* 1. GEN-Z MINIMALIST HERO */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
        {/* Ambient Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
        
        {/* Soft Glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/10 via-blue-500/10 to-teal-400/10 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Live Status Pill */}
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-800 text-xs font-bold shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-600">[LIVE]</span>
                  <span>500+ Lowongan Aktif di Mimika</span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-extrabold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>100% Bebas Pungli</span>
                  </span>
                </div>
              </Reveal>

              {/* Bold Punchy Headline */}
              <Reveal delay={80}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.02]">
                  Cari Kerja <br className="hidden sm:inline" />
                  <span className="font-serif italic font-normal text-primary">Sat-Set</span>
                  {" & Terpercaya."}
                </h1>
              </Reveal>

              {/* Punchy Subtitle */}
              <Reveal delay={160}>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Kirim lamaran kerja langsung ke WhatsApp HRD atau Email resmi perusahaan tanpa prosedur berbelit dan bebas dari pungutan liar.
                </p>
              </Reveal>

              {/* Search Bar - Modern Gen-Z Pill Container */}
              <Reveal delay={240}>
                <div className="space-y-3 max-w-xl mx-auto lg:mx-0">
                  <form 
                    onSubmit={handleSearch}
                    className="bg-white p-2 rounded-2xl sm:rounded-full border border-slate-300/80 shadow-md shadow-slate-200/50 flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
                  >
                    <div className="relative flex-1 w-full flex items-center pl-3">
                      <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Posisi, keahlian, atau nama perusahaan..."
                        className="w-full h-11 bg-transparent text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto h-11 px-6 rounded-xl sm:rounded-full bg-slate-950 hover:bg-primary text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm"
                    >
                      <span>Cari Loker</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Keyword Pills with Emoji Tags */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 text-xs text-slate-500 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Trending:</span>
                    {quickKeywords.map((kw) => (
                      <button
                        key={kw.label}
                        type="button"
                        onClick={() => {
                          setSearchQuery(kw.label);
                          router.push(`/jobs?q=${encodeURIComponent(kw.label)}`);
                        }}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 text-slate-700 text-[11px] font-semibold transition-all hover:scale-105 cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <span>{kw.icon}</span>
                        <span>{kw.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Social Proof Avatars & Metric */}
              <Reveal delay={300}>
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">PT</div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">PS</div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">TU</div>
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-500 text-white font-bold flex items-center justify-center text-[10px]">FI</div>
                  </div>
                  <div>
                    <span className="text-slate-900 font-extrabold">12.400+</span>
                    {" pelamar & "}
                    <span className="text-slate-900 font-extrabold">150+</span>
                    {" perusahaan aktif di Timika"}
                  </div>
                </div>
              </Reveal>

            </div>

            {/* Right Column: Gen-Z Dynamic Bento Card Showcase */}
            <div className="lg:col-span-5 relative">
              <Reveal delay={200}>
                <div className="relative mx-auto max-w-md w-full">
                  
                  {/* Floating HR Chat Notification (Gen-Z Touch) */}
                  <div className="absolute -top-6 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-xl z-20 animate-bounce duration-1000 max-w-[260px]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                        WA
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">HRD Freeport Contractor</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      &quot;Halo! Berkas Anda cocok, yuk jadwalkan interview besok.&quot;
                    </p>
                  </div>

                  {/* Main Job Card */}
                  <div className="relative bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xl shadow-slate-200/60 space-y-5">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white flex items-center justify-center font-extrabold text-sm shadow-md shrink-0 border border-slate-700">
                          PT
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                              🔥 URGENT
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">Diposting 2 jam lalu</span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 truncate">
                            Mekanik Alat Berat (Heavy Equipment)
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold truncate mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>PT Freeport Contractor Services</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">
                        Full-time
                      </span>
                      <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-lg">
                        SMA / SMK
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded text-[10px]">
                        WA Direct
                      </span>
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 font-bold px-2 py-0.5 rounded text-[10px]">
                        Email
                      </span>
                    </div>

                    {/* Micro Info Bento */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Lokasi</div>
                          <div className="font-bold text-slate-800 truncate">Kuala Kencana, Timika</div>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Status</div>
                          <div className="font-bold text-emerald-600 truncate">Aktif Rekrutmen</div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Kisaran Gaji</div>
                        <div className="text-base font-extrabold text-emerald-700 tracking-tight font-mono">
                          Rp 8.000.000 - 15.000.000
                        </div>
                      </div>
                      <Link href="/jobs">
                        <button className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-primary text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer">
                          <span>Lamar Sekarang</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                    </div>

                  </div>

                  {/* Floating Anti-Pungli Stamp Badge */}
                  <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-lg shadow-slate-200/80 flex items-center gap-3 animate-float">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                      <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-900 flex items-center gap-1">
                        100% Anti-Pungli <span className="text-emerald-600">✓</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Dilarang Memungut Biaya Apapun</div>
                    </div>
                  </div>

                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRENDING CATEGORIES BENTO GRID */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <Reveal>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 font-mono">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Kategori Populer</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Peluang Karir Terbanyak Minggu Ini
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Pilih spesialisasi yang sesuai dengan keahlian atau jurusan Anda.
              </p>
            </Reveal>

            <Reveal delay={150}>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-primary hover:underline group"
              >
                <span>Lihat Semua Lowongan</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingCategories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Reveal key={index} delay={index * 60}>
                  <Link
                    href={`/jobs?category=${encodeURIComponent(cat.tag)}`}
                    className="group h-full bg-white border border-slate-200/80 hover:border-slate-400 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${cat.color} group-hover:scale-105 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black tracking-wider uppercase font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {cat.badge}
                        </span>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                          {cat.title}
                        </h3>
                      </div>

                      <div className="text-[11px] font-mono font-bold text-primary mb-2">
                        {cat.count}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">
                      <span>Cek Posisi Tersedia</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. COMPARISON BENTO: CARA KUNO VS LOKERTIMIKA */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-auto max-w-6xl my-6 p-6 sm:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-12">
          
          <div className="max-w-2xl text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase font-mono">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Kenapa Beralih ke LokerTimika?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Tinggalkan Cara Lama, <br />
              <span className="text-sky-300">Lamar Kerja Tanpa Ribet.</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Kami menyederhanakan seluruh alur rekrutmen agar Anda tidak perlu lagi buang waktu dan biaya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cara Kuno */}
            <div className="bg-slate-850/70 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="text-rose-400 font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <X className="w-4 h-4" />
                <span>Cara Lama yang Melelahkan</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Fotokopi berkas fisik bertumpuk dan keliling kantor tanpa kepastian.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Rentan penipuan lowongan kerja berbayar (pungli seragam/tiket travel fiktif).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Menunggu respons berminggu-minggu tanpa kejelasan kontak HRD.</span>
                </li>
              </ul>
            </div>

            {/* Cara LokerTimika */}
            <div className="bg-blue-950/40 border border-blue-500/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-lg shadow-blue-950/50">
              <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Standar LokerTimika (Gen-Z Way)</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Kirim lamaran 1-klik via <strong>WhatsApp Direct</strong> atau Email Resmi perusahaan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>100% Gratis &amp; Terkurasi</strong> — jaminan perlindungan dari segala jenis pungutan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Transparansi estimasi gaji dan kualifikasi sebelum Anda melamar.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 5. 3 LANGKAH SAT-SET */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="max-w-xl mx-auto text-center mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3 Langkah Cepat</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Mulai Karir Baru dalam 3 Menit
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs space-y-3">
              <div className="font-mono text-2xl font-black text-primary">01</div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Temukan Lowongan</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Filter lowongan berdasarkan spesialisasi, batas pendidikan, lokasi, atau kisaran gaji idaman.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs space-y-3">
              <div className="font-mono text-2xl font-black text-emerald-600">02</div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Pilih Metode Lamaran</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Klik tombol WhatsApp Direct untuk chat langsung ke PIC atau kirimkan CV via Email Perusahaan.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs space-y-3">
              <div className="font-mono text-2xl font-black text-purple-600">03</div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">Interview &amp; Diterima</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Jadwalkan wawancara kerja secara resmi tanpa perantara biaya dan mulai langkah karir Anda.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. RECRUITER HIGH-IMPACT BANNER */}
      <section className="py-8 pb-16 sm:pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="rounded-3xl bg-slate-950 p-8 sm:p-14 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-mono font-bold uppercase">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Untuk HRD & Pengusaha</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Butuh Rekrut Tim Lebih Cepat?
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Pasang lowongan kerja perusahaan Anda secara gratis. Jangkau belasan ribu kandidat terverifikasi di wilayah Mimika dan Papua Tengah.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">
                ✓ 100% Gratis • ✓ Moderasi &lt; 24 Jam • ✓ Dashboard Kelola Loker
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <Link href="/post" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer">
                  <span>Pasang Loker Gratis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/ketentuan-pasang-loker" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>Ketentuan Layanan</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER CTA */}
      <NewsletterCTA />
    </main>
  );
}
