'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, ArrowLeft, CheckCircle2, MessageSquare } from 'lucide-react';
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
    <div className="container mx-auto px-4 max-w-[640px] py-12 sm:py-20">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12 group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Kembali ke Beranda
      </Link>

      {/* Main Form Content (No Card) */}
      <div className="w-full">
        {isSubmitted ? (
          <div className="py-12 animate-in fade-in duration-500">
            <h2 className="text-3xl font-normal mb-4 text-foreground">Pesan terkirim</h2>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              Terima kasih telah menghubungi kami. Kami telah menerima pesan Anda dan akan segera merespons ke email yang Anda berikan.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              variant="outline"
              className="h-10 px-6 font-medium"
            >
              Kirim tanggapan lain
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div className="pb-6 border-b border-border/40">
              <h1 className="text-4xl font-normal text-foreground tracking-tight mb-3">Hubungi Kami</h1>
              <p className="text-muted-foreground text-base">
                Silakan isi formulir di bawah ini untuk pertanyaan, kemitraan, atau bantuan teknis.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {/* Floating Label Input - Name */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  required
                  className="block px-3 pb-3 pt-4 w-full text-base text-foreground bg-transparent rounded-md border border-border/80 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer transition-colors"
                  placeholder=" "
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
                <label
                  htmlFor="name"
                  className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
                >
                  Nama Lengkap
                </label>
              </div>

              {/* Floating Label Input - Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  className="block px-3 pb-3 pt-4 w-full text-base text-foreground bg-transparent rounded-md border border-border/80 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer transition-colors"
                  placeholder=" "
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
                >
                  Alamat Email
                </label>
              </div>

              {/* Floating Label Input - Subject */}
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  required
                  className="block px-3 pb-3 pt-4 w-full text-base text-foreground bg-transparent rounded-md border border-border/80 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer transition-colors"
                  placeholder=" "
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
                <label
                  htmlFor="subject"
                  className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
                >
                  Subjek
                </label>
              </div>

              {/* Floating Label Textarea - Message */}
              <div className="relative">
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="block px-3 pb-3 pt-4 w-full text-base text-foreground bg-transparent rounded-md border border-border/80 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer transition-colors resize-y min-h-[120px]"
                  placeholder=" "
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
                <label
                  htmlFor="message"
                  className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 cursor-text"
                >
                  Isi Pesan
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-xs text-muted-foreground">
                * Semua kolom wajib diisi
              </span>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="h-10 px-6 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-none transition-colors"
              >
                {isLoading ? 'Mengirim...' : 'Kirim'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
