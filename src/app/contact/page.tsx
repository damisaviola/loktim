'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, MessageSquare, Send } from 'lucide-react';
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
    <div className="container mx-auto px-4 max-w-[800px] py-8">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      <div className="bg-card rounded-2xl border border-border/60 p-6 sm:p-10 shadow-lg">
        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-500">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 text-foreground">Pesan Berhasil Terkirim</h2>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base max-w-md">
              Terima kasih telah menghubungi LokerTimika. Tim kami telah menerima pesan Anda dan akan segera merespons melalui email yang Anda berikan.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              variant="outline"
              className="h-12 px-8 font-bold rounded-full border-border hover:bg-secondary transition-colors"
            >
              Kirim Pesan Lainnya
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="border-b border-border/60 pb-6 mb-8 text-center sm:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">Hubungi Kami</h1>
              <p className="text-sm text-muted-foreground">
                Apabila Anda memiliki pertanyaan, penawaran kerja sama, atau memerlukan bantuan teknis terkait layanan kami, silakan isi formulir di bawah ini.
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-foreground px-1">Nama Lengkap / Instansi</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Masukkan nama lengkap atau nama perusahaan"
                    className="w-full h-12 px-4 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold text-foreground px-1">Alamat Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="Alamat email aktif untuk balasan"
                    className="w-full h-12 px-4 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold text-foreground px-1">Subjek Pesan</label>
                <input
                  type="text"
                  id="subject"
                  required
                  placeholder="Contoh: Permintaan pemasangan iklan lowongan"
                  className="w-full h-12 px-4 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              {/* Message Textarea */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-foreground px-1">Isi Pesan</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Tuliskan pertanyaan atau rincian pesan Anda secara lengkap..."
                  className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl focus:outline-none text-sm text-foreground font-medium placeholder:text-muted-foreground transition-all resize-y min-h-[120px]"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-4 gap-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground font-medium px-1">
                  * Semua kolom wajib diisi
                </span>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full sm:w-auto h-12 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  {isLoading ? 'Mengirim...' : (
                    <>
                      Kirim Pesan
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
      </div>
    </div>
  );
}
