import Link from "next/link";
import { TrustBanner } from "@/components/TrustBanner";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { Search, Briefcase, ChevronRight, Zap, ShieldCheck, Trophy, Sparkles, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-slate-50/50">
      
      {/* Modern Immersive Hero Section */}
      <div className="relative mt-4 sm:mt-6 w-[calc(100%-2rem)] lg:w-full max-w-[1128px] mx-auto bg-slate-900 rounded-[2.5rem] mb-16 overflow-hidden border border-slate-800 shadow-2xl pt-16 pb-20 sm:pt-24 sm:pb-32 px-6 sm:px-10 text-center">
        
        {/* Animated Glowing Orbs Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-4xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-sm font-medium text-blue-200 animate-fade-slide-up stagger-1 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Platform Karir #1 di Mimika & Papua</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] animate-fade-slide-up stagger-2">
            Temukan Karir Impian <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-300 drop-shadow-lg">
              Lebih Cepat & Mudah
            </span>
          </h1>
          
          <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl animate-fade-slide-up stagger-3">
            Akses langsung ke ribuan lowongan pekerjaan terbaik dari perusahaan terkemuka di Timika, dari pertambangan hingga ritel.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-slide-up stagger-4 w-full sm:w-auto">
            <Link href="/jobs" className="w-full sm:w-auto">
              <button className="h-14 px-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer font-bold w-full">
                <Search className="w-5 h-5" />
                Lihat Loker
              </button>
            </Link>
            <Link href="/post" className="w-full sm:w-auto">
              <button className="h-14 px-8 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer font-bold w-full backdrop-blur-md">
                <Briefcase className="w-5 h-5" />
                Pasang Loker
              </button>
            </Link>
          </div>
          
        </div>
      </div>

      <TrustBanner />

      {/* Modern Bento-Box Features Section */}
      <section className="w-full max-w-[1128px] mx-auto px-4 py-16 mb-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Satu Platform, <span className="text-primary">Beribu Peluang</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Kami menghadirkan pengalaman mencari kerja yang modern, cepat, dan aman khusus untuk masyarakat Timika dan sekitarnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-auto md:auto-rows-[280px]">
          {/* Large Feature 1 */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 md:p-10 flex flex-col h-full justify-between">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Akses Instan & Cepat</h3>
                <p className="text-slate-600 font-medium text-lg max-w-md">Tidak perlu registrasi rumit. Temukan lowongan dan langsung lamar pekerjaan impian Anda dalam hitungan menit.</p>
              </div>
            </div>
            {/* Decorative abstract shape */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"></div>
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-1 group relative overflow-hidden rounded-[2rem] bg-slate-900 text-white border border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8 flex flex-col h-full justify-between">
              <div className="w-14 h-14 bg-white/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:rotate-12 transition-transform duration-500">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">100% Terverifikasi</h3>
                <p className="text-slate-300 font-medium">Bebas penipuan. Setiap perusahaan kami kurasi secara ketat.</p>
              </div>
            </div>
          </div>

          {/* Small Feature 2 */}
          <div className="md:col-span-1 group relative overflow-hidden rounded-[2rem] bg-amber-50 border border-amber-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative p-8 flex flex-col h-full justify-between">
              <div className="w-14 h-14 bg-amber-200/50 text-amber-700 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:-rotate-12 transition-transform duration-500">
                <Trophy className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Kualitas Terbaik</h3>
                <p className="text-amber-900/70 font-medium">Mitra dari puluhan perusahaan terkemuka di Papua.</p>
              </div>
            </div>
          </div>

          {/* Large Feature 2 */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex items-center justify-between p-8 md:p-10">
            <div className="max-w-sm z-10 relative">
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Pasang Lowongan Anda</h3>
              <p className="text-slate-600 font-medium text-lg mb-6">Mencari kandidat terbaik? Bergabunglah sebagai mitra kami dan jangkau ribuan talenta di Timika.</p>
              <Link href="/post">
                <button className="h-12 px-6 rounded-full bg-slate-900 hover:bg-primary text-white flex items-center justify-center gap-2 transition-colors font-bold shadow-md">
                  <Briefcase className="w-5 h-5" />
                  Mulai Merekrut
                </button>
              </Link>
            </div>
            {/* Visual element */}
            <div className="absolute right-0 bottom-0 h-full w-1/2 bg-gradient-to-l from-slate-100 to-transparent hidden md:block"></div>
          </div>
        </div>
      </section>

      <NewsletterCTA />

    </main>
  );
}
