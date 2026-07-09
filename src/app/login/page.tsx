'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
  Briefcase
} from 'lucide-react';
import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStatus('loading');
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const res = await loginAction(formData);
      if (res.success) {
        setStatus('success');
        setTimeout(() => {
          router.push('/admin');
        }, 1000);
      } else {
        setStatus('idle');
        setErrorMsg(res.error || 'Autentikasi gagal. Periksa kredensial Anda.');
      }
    } catch (err) {
      setStatus('idle');
      setErrorMsg('Gagal terhubung ke server otorisasi.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans selection:bg-primary/30">
      
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative min-h-screen">
        
        {/* Back to Home Button - Absolute on top left */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          Kembali
        </Link>

        <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">LokerTimika</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              Masuk ke Portal
            </h1>
            <p className="text-slate-500 font-medium">
              Silakan masukkan kredensial admin Anda untuk mengelola lowongan.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3 animate-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-red-600" />
              </div>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin" 
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                  Kata Sandi
                </label>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full h-14 pl-12 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={status !== 'idle'}
              className="relative w-full h-14 mt-8 rounded-xl font-bold text-[15px] text-white overflow-hidden group transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              <div className="absolute inset-0 bg-primary group-hover:brightness-110 transition-all duration-300"></div>
              <div className="relative flex items-center justify-center gap-2 h-full">
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Akses Diberikan</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="w-5 h-5 opacity-90 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>
          
          {/* Footer info */}
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              © {new Date().getFullYear()} LokerTimika. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - BRANDING / VISUAL (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center p-12 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-black blur-3xl"></div>
        </div>

        {/* Abstract Pattern overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>

        {/* Floating Glass Card (Visual Centerpiece) */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">Admin<span className="text-white/70">Panel</span></span>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
              Pusat Kendali<br/>LokerTimika
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Kelola lowongan pekerjaan, tinjau perusahaan, dan pastikan ekosistem rekrutmen di Mimika berjalan dengan aman, transparan, dan profesional.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Moderasi Cepat
              </div>
              <div className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Akses Terenkripsi
              </div>
              <div className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Sistem Otomatis
              </div>
            </div>
          </div>
          
          {/* Simple decoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/20 to-white/0 rounded-full blur-2xl animate-pulse"></div>
        </div>
      </div>
      
    </div>
  );
}
