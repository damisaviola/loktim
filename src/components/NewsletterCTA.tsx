"use client";

import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Berhasil berlangganan!", {
        description: "Kami akan mengirimkan info loker terbaru ke email Anda.",
      });
      setEmail("");
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[1128px] mb-24">
      <div className="w-full bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-900/20 p-8 sm:p-12 md:p-16 border border-slate-800">
        
        {/* Animated Glow Background */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-blue-300 mb-4 backdrop-blur-sm">
              <Sparkles className="w-3 h-3" /> No Spam, Only Opportunities
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Selangkah Lebih Dekat <br className="hidden md:block" /> Dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Karir Impian</span>
            </h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-md">
              Dapatkan notifikasi eksklusif untuk lowongan kerja terbaru di Timika langsung ke inbox email Anda.
            </p>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[1.75rem] blur opacity-20 hover:opacity-40 transition duration-1000"></div>
              <div className="relative flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-xl p-2 rounded-3xl border border-white/20 shadow-xl">
                <input 
                  type="email" 
                  placeholder="Masukkan alamat email Anda..." 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-400 px-6 py-4 outline-none font-medium focus:ring-0 min-w-0"
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-bold shadow-lg shadow-white/5 hover:bg-blue-50 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:scale-100 whitespace-nowrap"
                >
                  {isLoading ? "Memproses..." : (
                    <>
                      <span>Berlangganan</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
            <p className="text-slate-400 text-sm mt-4 text-center md:text-left font-medium">
              Lebih dari 10.000 pencari kerja telah bergabung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
