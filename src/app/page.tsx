import Link from "next/link";
import { TrustBanner } from "@/components/TrustBanner";
import { Search, Briefcase, Zap, ShieldCheck, Trophy, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-white text-slate-900 selection:bg-slate-200 selection:text-slate-900 overflow-hidden">
      
      {/* Enterprise Hero Section: Split Layout */}
      <section className="w-full bg-white relative flex justify-center border-b border-slate-100">
        {/* Subtle Background Pattern for Enterprise feel */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        <div className="w-full max-w-[1200px] px-6 sm:px-8 lg:px-12 pt-20 pb-24 sm:pt-32 sm:pb-32 lg:pt-40 lg:pb-40 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-slate-600 text-xs sm:text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Platform Karir #1 di Mimika & Papua</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-slate-950 leading-[1.05]">
              Temukan Karir <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
                Impian Anda.
              </span>
            </h1>
            
            <p className="mt-8 text-lg sm:text-xl text-slate-500 max-w-xl leading-relaxed font-normal">
              Akses langsung ke ribuan lowongan pekerjaan terbaik dari perusahaan terkemuka di Timika, dari pertambangan hingga ritel, dengan platform paling modern.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
              <Link href="/jobs" className="w-full sm:w-auto">
                <button className="h-12 px-7 rounded-lg bg-slate-950 text-white hover:bg-slate-900 shadow-xl shadow-slate-950/20 transition-all font-semibold text-sm flex items-center justify-center gap-2 w-full">
                  <Search className="w-4 h-4" />
                  Cari Lowongan
                </button>
              </Link>
              <Link href="/post" className="w-full sm:w-auto">
                <button className="h-12 px-7 rounded-lg bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-sm transition-all font-semibold text-sm flex items-center justify-center gap-2 w-full group">
                  Pasang Loker
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-600 transition-transform" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Abstract Graphic (Tailwind CSS UI) */}
          <div className="w-full lg:w-[45%] relative hidden md:flex justify-center lg:justify-end">
            <div className="w-full max-w-md aspect-square relative">
              {/* Decorative Enterprise Elements */}
              <div className="absolute top-10 right-10 w-64 h-64 bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl rotate-3"></div>
              <div className="absolute top-16 right-16 w-64 h-64 bg-white rounded-3xl border border-slate-200 shadow-xl -rotate-2 flex flex-col p-6 justify-between">
                 <div className="w-10 h-10 rounded-full bg-slate-100 mb-4"></div>
                 <div className="space-y-3">
                   <div className="h-3 w-3/4 bg-slate-100 rounded-full"></div>
                   <div className="h-3 w-1/2 bg-slate-100 rounded-full"></div>
                   <div className="h-3 w-5/6 bg-slate-50 rounded-full"></div>
                 </div>
                 <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                   <div className="w-16 h-8 rounded-md bg-slate-900"></div>
                   <div className="w-8 h-8 rounded-full border border-slate-200"></div>
                 </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 left-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center gap-4 z-20">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Terverifikasi</p>
                  <p className="text-sm font-bold text-slate-900">100% Aman</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Metrics Section */}
      <div className="w-full border-b border-slate-100 py-12 flex justify-center bg-white relative z-20">
        <div className="w-full max-w-[1200px] px-6 sm:px-8 lg:px-12">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Dipercaya oleh ribuan profesional</p>
          <TrustBanner />
        </div>
      </div>

      {/* Enterprise Features Section: Asymmetrical Grid */}
      <section className="w-full bg-white flex justify-center py-24 sm:py-32 border-b border-slate-100">
        <div className="w-full max-w-[1200px] px-6 sm:px-8 lg:px-12">
          
          <div className="mb-20 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-950 mb-6 leading-tight">
              Satu Platform, <br className="hidden sm:block" />
              Standard Enterprise.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Infrastruktur karir kelas dunia yang dirancang khusus untuk mempertemukan talenta terbaik dengan perusahaan terkemuka di Papua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-y md:border-y-0 border-slate-200">
            {/* Feature 1 */}
            <div className="py-12 md:py-8 md:pr-12 flex flex-col">
              <div className="w-12 h-12 bg-white border shadow-sm border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-8">
                <Zap className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Kecepatan Tinggi</h3>
              <p className="text-slate-500 text-base leading-relaxed">
                Tanpa registrasi berbelit. Temukan lowongan, unggah CV, dan langsung lamar pekerjaan impian Anda dalam hitungan detik.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="py-12 md:py-8 md:px-12 flex flex-col">
              <div className="w-12 h-12 bg-white border shadow-sm border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-8">
                <ShieldCheck className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Keamanan Enterprise</h3>
              <p className="text-slate-500 text-base leading-relaxed">
                Setiap perusahaan dan loker melewati kurasi manual ketat kami untuk memastikan lingkungan yang 100% bebas penipuan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="py-12 md:py-8 md:pl-12 flex flex-col">
              <div className="w-12 h-12 bg-white border shadow-sm border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-8">
                <Trophy className="w-5 h-5 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Kualitas Premium</h3>
              <p className="text-slate-500 text-base leading-relaxed">
                Kami bermitra eksklusif dengan puluhan perusahaan terkemuka, memberikan Anda akses prioritas ke peluang terbaik.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* Recruiter Dark CTA Section */}
      <section className="w-full bg-slate-950 flex justify-center py-24 sm:py-32">
        <div className="w-full max-w-[1200px] px-6 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-12">
           <div className="max-w-2xl text-left">
             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
               Rekrut Talenta Terbaik.
             </h2>
             <p className="text-slate-400 text-lg sm:text-xl leading-relaxed">
               Bergabunglah dengan ekosistem karir paling canggih di Papua. Jangkau ribuan kandidat terverifikasi dengan platform rekrutmen kami.
             </p>
           </div>
           <div className="w-full lg:w-auto flex-shrink-0">
             <Link href="/post">
               <button className="h-14 px-8 rounded-xl bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 transition-all font-bold text-base flex items-center justify-center gap-3 w-full sm:w-auto shadow-2xl">
                 <Briefcase className="w-5 h-5" />
                 Mulai Merekrut Sekarang
               </button>
             </Link>
           </div>
        </div>
      </section>

    </main>
  );
}
