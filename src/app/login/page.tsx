'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';


export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row bg-background w-full h-[100dvh] overflow-hidden">
      
      {/* Left side: Branding & Features (Hidden on mobile & small tablets) */}
      <div className="hidden lg:flex w-1/2 bg-secondary/20 dark:bg-secondary/10 relative flex-col justify-between p-12 xl:p-16 border-r border-border overflow-hidden">
        
        {/* Modern Dot Pattern Background */}
        <div className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px', color: 'var(--foreground)' }} />
        
        <div className="relative z-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-2xl shadow-md">
              LT
            </div>
            <span className="font-extrabold text-3xl tracking-tight text-foreground">LokerTimika</span>
          </Link>
        </div>

        <div className="relative z-20 flex-1 flex flex-col justify-center max-w-lg mt-12 mb-8">
          <h2 className="text-4xl xl:text-5xl font-extrabold mb-6 leading-tight text-foreground tracking-tight">
            Temukan talenta terbaik, atau jadilah salah satunya.
          </h2>
          
          <div className="space-y-8 mt-10">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Ribuan Lowongan Tersedia</h3>
                <p className="text-muted-foreground text-base mt-1.5 leading-relaxed">Dari startup lokal hingga perusahaan multinasional raksasa di Mimika.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Proses Lamaran Instan</h3>
                <p className="text-muted-foreground text-base mt-1.5 leading-relaxed">Lamar pekerjaan impian Anda secara langsung hanya dengan satu klik praktis.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 text-sm text-muted-foreground font-medium">
          © {new Date().getFullYear()} LokerTimika. Hak cipta dilindungi undang-undang.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 relative bg-card overflow-hidden">
        <Link href="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-primary">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold text-xl shadow-sm">
            LT
          </div>
        </Link>

        <div className="w-full max-w-md space-y-6 my-auto pt-12 lg:pt-0">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Selamat Datang Kembali</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full font-medium h-11 rounded-xl flex items-center justify-center gap-3 border-border hover:bg-secondary text-sm transition-colors text-foreground">
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Lanjutkan dengan Google
            </Button>
            <Button variant="outline" className="w-full font-medium h-11 rounded-xl flex items-center justify-center gap-3 border-border hover:bg-secondary text-foreground text-sm transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Lanjutkan dengan GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-card px-4 text-muted-foreground font-semibold">Atau masuk dengan email</span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <input 
                type="email" 
                placeholder="nama@email.com" 
                className="w-full h-11 border border-input rounded-xl px-4 bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors hover:border-muted-foreground/50"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">Kata Sandi</label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">Lupa sandi?</Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full h-11 border border-input rounded-xl px-4 bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors hover:border-muted-foreground/50"
              />
            </div>
            <Button className="w-full h-11 rounded-xl font-bold text-sm mt-2 shadow-sm hover:shadow-md transition-all">
              Masuk
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground pt-2">
            Belum punya akun? <Link href="#" className="font-semibold text-primary hover:underline">Daftar sekarang</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
