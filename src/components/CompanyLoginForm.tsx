"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { loginSchema } from "@/lib/validations/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full h-14 mt-8 rounded-xl font-bold text-[15px] text-white overflow-hidden group transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-sky-500 group-hover:brightness-110 transition-all duration-300"></div>
      <div className="relative flex items-center justify-center gap-2 h-full">
        {pending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Memverifikasi...</span>
          </>
        ) : (
          <>
            <span>Masuk ke Dasbor</span>
            <ArrowRight className="w-5 h-5 opacity-90 group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </div>
    </button>
  );
}

export default function CompanyLoginForm({
  loginAction,
  error,
}: {
  loginAction: (formData: FormData) => Promise<void>;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string) || "";
    const password = (formData.get("password") as string) || "";

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      e.preventDefault();
      setClientError(validation.error.issues[0].message);
    }
  };

  const activeError = clientError || error;

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans selection:bg-primary/30">
      {/* LEFT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 lg:px-20 xl:px-28 relative min-h-screen">
        {/* Back to Home */}
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          Kembali
        </Link>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            LokerTimika
          </span>
        </div>

        <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-10">
            <h1 className="text-3xl sm:text-[2.5rem] font-extrabold tracking-tight text-slate-900 leading-tight mb-3">
              Selamat datang{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                kembali
              </span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Masuk untuk mengelola lowongan kerja dan merekrut talenta
              terbaik di Mimika.
            </p>
          </div>

          {activeError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-3 animate-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-red-600" />
              </div>
              {activeError}
            </div>
          )}

          <form action={loginAction} onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="company-email"
                className="text-[13px] font-bold text-slate-700 uppercase tracking-wider"
              >
                Email Perusahaan
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="company-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nama@perusahaan.com"
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="company-password"
                className="text-[13px] font-bold text-slate-700 uppercase tracking-wider"
              >
                Kata Sandi
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors duration-300">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="company-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 text-[15px] text-slate-900 placeholder:text-slate-400 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <SubmitButton />
          </form>

          {/* Footer info */}
          <div className="mt-10 flex flex-col items-center gap-2 text-center">
            <p className="text-sm font-medium text-slate-500">
              Belum memiliki akun perusahaan?{" "}
              <Link href="/perusahaan/daftar" className="text-primary font-bold hover:underline underline-offset-4">
                Daftar sekarang
              </Link>
            </p>
            <p className="text-xs font-medium text-slate-400">
              © {new Date().getFullYear()} LokerTimika. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - BRANDING / VISUAL (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-primary/30 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-sky-500/20 blur-3xl"></div>
        </div>

        {/* Dotted pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Floating Glass Card */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-xl">
              <Briefcase className="w-7 h-7 text-sky-300" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              Loker<span className="text-sky-300">Timika</span>
            </span>
          </div>

          <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
              Rekrut talenta{" "}
              <span className="text-sky-300">
                terbaik
              </span>
              <br />
              untuk perusahaan Anda.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Kelola lowongan, pantau pelamar, dan temukan karyawan terbaik untuk tempat usaha dan perusahaan Anda di Timika.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Pasang Lowongan Cepat
              </div>
              <div className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Akses Terenkripsi
              </div>
              <div className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Jangkau Ribuan Kandidat
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/40 to-transparent rounded-full blur-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}