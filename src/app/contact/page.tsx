'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Bug, Send, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      
      {/* Minimal Navbar / Header Area */}
      <div className="w-full pt-10 px-6 sm:px-12 max-w-4xl mx-auto flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </div>
          Kembali
        </Link>
        <div className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-sm tracking-widest uppercase text-slate-500">Laporan Bug</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto px-6 pt-16 pb-24">
        
        {isSubmitted ? (
          <div className="py-20 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Laporan Diterima</h2>
            <p className="text-muted-foreground mb-10 text-base max-w-sm leading-relaxed">
              Terima kasih telah meluangkan waktu. Tim teknis kami akan segera menganalisis dan memperbaiki kendala ini.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              variant="outline"
              className="h-12 px-8 rounded-full font-semibold border-slate-200 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
            >
              Laporkan Bug Lainnya
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter">
                Sistem tidak berjalan semestinya?
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Detailkan kendala yang Anda hadapi. Kami akan menanganinya secepat mungkin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Name Input */}
                <div className="space-y-3">
                  <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 px-1">
                    Nama Pelapor
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="John Doe"
                    className="w-full h-14 px-5 bg-white border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl focus:outline-none text-base text-slate-800 font-medium placeholder:text-slate-400 transition-all shadow-sm hover:border-indigo-200"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-3">
                  <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 px-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="john@example.com"
                    className="w-full h-14 px-5 bg-white border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl focus:outline-none text-base text-slate-800 font-medium placeholder:text-slate-400 transition-all shadow-sm hover:border-indigo-200"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-3">
                <label htmlFor="subject" className="text-[11px] font-bold uppercase tracking-widest text-slate-500 px-1">
                  Area Masalah
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="subject"
                    required
                    placeholder="Contoh: Gagal mengunggah logo perusahaan"
                    className="w-full h-14 pl-14 pr-5 bg-white border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl focus:outline-none text-base text-slate-800 font-medium placeholder:text-slate-400 transition-all shadow-sm hover:border-indigo-200"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Detail Kendala
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Opsional tapi disarankan</span>
                </div>
                <textarea
                  id="message"
                  required
                  rows={6}
                  placeholder="Ceritakan langkah-langkah yang Anda lakukan sebelum error muncul..."
                  className="w-full px-5 py-4 bg-white border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-3xl focus:outline-none text-base text-slate-800 font-medium placeholder:text-slate-400 transition-all resize-y min-h-[160px] shadow-sm hover:border-indigo-200"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              {/* Submit Area */}
              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full sm:w-auto h-14 px-10 rounded-full font-bold text-base flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all duration-300"
                >
                  {isLoading ? 'Mengirim Laporan...' : (
                    <>
                      Kirim Laporan
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
