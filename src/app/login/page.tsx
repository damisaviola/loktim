'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate highly optimized API Login Request
    const timer = setTimeout(() => {
      setStatus('success');
      
      const resetTimer = setTimeout(() => {
        setStatus('idle');
      }, 2500);
      
      return () => clearTimeout(resetTimer);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex w-full flex-1 h-full overflow-hidden bg-background">
      
      {/* 
        ========================================
        SISI KIRI: Visual Branding (Hanya Desktop)
        ========================================
      */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative bg-slate-950 text-slate-50 p-12 overflow-hidden selection:bg-indigo-500/30">
        
        {/* Latar Belakang Geometris Minimalis */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        {/* Header / Logo */}
        <div className="relative z-10 flex items-center gap-3 animate-fade-in-up">
          <Link href="/" className="flex items-center justify-center h-12 w-12 rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-lg">
            LT
          </Link>
          <span className="font-extrabold text-2xl tracking-tight">LokerTimika</span>
        </div>

        {/* Konten Utama Kiri */}
        <div className="relative z-10 max-w-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <Briefcase className="w-3.5 h-3.5" /> Portal Karir #1 Mimika
          </div>
          <h2 className="text-4xl xl:text-5xl font-black mb-6 leading-[1.2] tracking-tight">
            Mulai Perjalanan Karir Anda Bersama Kami.
          </h2>
          <p className="text-slate-400 text-base font-medium leading-relaxed">
            Bergabunglah dengan ribuan talenta terbaik dan temukan peluang pekerjaan impian di perusahaan terkemuka.
          </p>
        </div>

        {/* Footer Kiri */}
        <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-xs font-medium text-slate-500">
            © {new Date().getFullYear()} LokerTimika. Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </div>

      {/* 
        ========================================
        SISI KANAN: Form Login
        ========================================
      */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 relative bg-background overflow-y-auto">
        
        <div className="w-full max-w-sm mx-auto animate-fade-in-up">
          
          {/* Logo untuk Mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <Link href="/" className="flex items-center justify-center h-11 w-11 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-md">
              LT
            </Link>
            <span className="font-extrabold text-2xl tracking-tight text-foreground">LokerTimika</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
              Selamat Datang
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Silakan masuk ke akun Anda untuk melanjutkan.
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-xl bg-card border border-border/60 hover:bg-muted/60 text-sm font-semibold text-foreground transition-colors duration-200 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>
            <button 
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-xl bg-card border border-border/60 hover:bg-muted/60 text-sm font-semibold text-foreground transition-colors duration-200 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 shrink-0 fill-current" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-background px-3 text-muted-foreground font-semibold">Atau</span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-foreground">Alamat Email</label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-foreground transition-colors duration-200">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com" 
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border/80 focus:bg-background focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground text-sm transition-all text-foreground placeholder:text-muted-foreground shadow-sm"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-foreground">Kata Sandi</label>
                <Link href="#" className="text-[13px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  Lupa Sandi?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 group-focus-within:text-foreground transition-colors duration-200">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-card border border-border/80 focus:bg-background focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground text-sm transition-all text-foreground placeholder:text-muted-foreground shadow-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none p-1 rounded-md hover:bg-muted transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              disabled={status !== 'idle'}
              className="w-full h-11 mt-4 rounded-xl font-bold text-[15px] bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-400">Masuk Berhasil!</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4.5 h-4.5 opacity-80" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Registration Link */}
          <div className="mt-10 text-center">
            <p className="text-[13px] text-muted-foreground font-medium">
              Belum memiliki akun?{' '}
              <Link href="#" className="font-bold text-foreground hover:underline transition-all">
                Daftar sekarang
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
