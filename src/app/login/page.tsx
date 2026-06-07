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
  ChevronLeft
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 selection:bg-indigo-500/30 font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md text-sm font-medium group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-[420px] p-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/20 mb-6 relative">
            <div className="absolute inset-0 rounded-2xl border border-white/20"></div>
            <ShieldCheck className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Secure Portal
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Sistem Manajemen LokerTimika
          </p>
        </div>

        {/* The Glassmorphism Card */}
        <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 shadow-2xl overflow-hidden">
          
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"></div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center animate-in slide-in-from-top-2">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Field */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-semibold text-slate-300 uppercase tracking-wider">
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                  <User className="w-4.5 h-4.5" />
                </div>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin" 
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-900/50 border border-white/10 focus:bg-slate-900/80 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-sm text-white placeholder:text-slate-600 transition-all duration-300 shadow-inner"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <label className="text-[13px] font-semibold text-slate-300 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-slate-900/50 border border-white/10 focus:bg-slate-900/80 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-sm text-white placeholder:text-slate-600 transition-all duration-300 shadow-inner"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer focus:outline-none p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={status !== 'idle'}
              className="relative w-full h-12 mt-6 rounded-xl font-bold text-[15px] text-white overflow-hidden group transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600 group-hover:scale-[1.02] transition-transform duration-300"></div>
              <div className="relative flex items-center justify-center gap-2 h-full">
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Otentikasi...</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Akses Diberikan</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Sistem</span>
                    <ArrowRight className="w-4.5 h-4.5 opacity-90 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>
          
        </div>
        
        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-xs font-medium text-slate-500">
            Akses dibatasi hanya untuk administrator sistem.<br/>
            Segala aktivitas dicatat dan dipantau.
          </p>
        </div>

      </div>
    </div>
  );
}
