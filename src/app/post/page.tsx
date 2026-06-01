'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export default function QuickPost() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-20 max-w-2xl text-center">
        <div className="bg-card rounded-lg border border-border p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Loker Berhasil Diposting!</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-8">
            Lowongan kerja Anda sekarang aktif dan dapat dilihat oleh ribuan kandidat potensial.
          </p>
          <Button onClick={() => window.location.href = '/'} className="w-full sm:w-auto font-bold rounded-full px-8">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-card border border-border shadow-sm rounded-sm">
        <div className="px-6 py-8 sm:px-10 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Pasang Lowongan Kerja</h1>
          <p className="text-sm text-muted-foreground mt-1">Lengkapi informasi di bawah ini untuk mempublikasikan lowongan Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 space-y-10">
          
          {/* Section 1: Informasi Perusahaan */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Informasi Perusahaan</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nama Perusahaan <span className="text-destructive">*</span></label>
              <input required type="text" className="w-full h-10 border border-input rounded-sm px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors hover:border-muted-foreground/50" placeholder="Contoh: PT Sukses Makmur" />
              <p className="text-xs text-muted-foreground">Gunakan nama entitas resmi atau merek dagang bisnis Anda.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Kontak <span className="text-destructive">*</span></label>
                <input required type="email" className="w-full h-10 border border-input rounded-sm px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors hover:border-muted-foreground/50" placeholder="hr@perusahaan.com" />
                <p className="text-xs text-muted-foreground">Email tempat Anda akan menerima CV dan lamaran.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">WhatsApp <span className="text-muted-foreground font-normal">(Opsional)</span></label>
                <input type="tel" className="w-full h-10 border border-input rounded-sm px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors hover:border-muted-foreground/50" placeholder="Contoh: 081234567890" />
                <p className="text-xs text-muted-foreground">Nomor aktif yang bisa dihubungi kandidat via WhatsApp.</p>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section 2: Detail Pekerjaan */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Detail Pekerjaan</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Judul Pekerjaan <span className="text-destructive">*</span></label>
                <input required type="text" className="w-full h-10 border border-input rounded-sm px-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors hover:border-muted-foreground/50" placeholder="Contoh: Software Engineer" />
                <p className="text-xs text-muted-foreground">Sebutkan peran yang spesifik dan mudah dipahami.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tipe Pekerjaan <span className="text-destructive">*</span></label>
                <select required className="w-full h-10 border border-input rounded-sm px-3 bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none transition-colors hover:border-muted-foreground/50">
                  <option value="" disabled defaultValue="">Pilih tipe pekerjaan</option>
                  <option value="Full-time">Penuh Waktu (Full-time)</option>
                  <option value="Part-time">Paruh Waktu (Part-time)</option>
                  <option value="Contract">Kontrak</option>
                  <option value="Internship">Magang</option>
                  <option value="Freelance">Lepas (Freelance)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimal Pendidikan <span className="text-destructive">*</span></label>
                <select required className="w-full h-10 border border-input rounded-sm px-3 bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none transition-colors hover:border-muted-foreground/50">
                  <option value="Semua">Semua Jenjang / Tidak Spesifik</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D3">Diploma (D3)</option>
                  <option value="S1">Sarjana (S1)</option>
                  <option value="S2">Magister (S2)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Pengalaman <span className="text-destructive">*</span></label>
                <select required className="w-full h-10 border border-input rounded-sm px-3 bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm appearance-none transition-colors hover:border-muted-foreground/50">
                  <option value="Semua">Tidak Spesifik</option>
                  <option value="Tanpa Pengalaman">Tanpa Pengalaman (Fresh Graduate)</option>
                  <option value="1-3 Tahun">1 - 3 Tahun</option>
                  <option value="3-5 Tahun">3 - 5 Tahun</option>
                  <option value="> 5 Tahun">Lebih dari 5 Tahun</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-border" />

          {/* Section 3: Kualifikasi */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Deskripsi & Kualifikasi</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Deskripsi Pekerjaan <span className="text-destructive">*</span></label>
              <textarea required rows={5} className="w-full border border-input rounded-sm p-3 bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-y transition-colors hover:border-muted-foreground/50" placeholder="Jelaskan peran, tanggung jawab, dan lingkungan kerja..."></textarea>
              <p className="text-xs text-muted-foreground">Tulis secara ringkas dan informatif mengenai rutinitas harian posisi ini.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Persyaratan Tambahan <span className="text-muted-foreground font-normal">(Opsional)</span></label>
              <textarea rows={4} className="w-full border border-input rounded-sm p-3 bg-card focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-y transition-colors hover:border-muted-foreground/50" placeholder="Sebutkan kualifikasi spesifik atau keahlian teknis..."></textarea>
              <p className="text-xs text-muted-foreground">Misalnya: Menguasai React.js, Bahasa Inggris aktif, Memiliki SIM C.</p>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto font-medium rounded-sm px-6 h-10">
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto font-medium rounded-sm px-8 h-10">
              {isSubmitting ? 'Memproses...' : 'Posting Lowongan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
