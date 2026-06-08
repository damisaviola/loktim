'use client';

import { JobCard } from '@/components/JobCard';
import { Job } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function SavedClient({ initialJobs }: { initialJobs: Job[] }) {
  const { bookmarkedIds, isLoaded } = useBookmarks();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 lg:px-0 max-w-[1128px] py-8 min-h-[70vh]">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8"></div>
        <div className="flex flex-col gap-4 max-w-3xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 bg-muted/40 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Mengurutkan loker tersimpan agar yang terbaru (atau baru ditambahkan) ada di atas.
  // Untuk kesederhanaan, kita hanya filter dari initialJobs.
  const savedJobs = initialJobs.filter(job => bookmarkedIds.includes(job.id));

  return (
    <div className="container mx-auto px-4 lg:px-0 py-8 min-h-[70vh]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Bookmark className="w-7 h-7 text-primary" />
            Loker Tersimpan
          </h1>
          <p className="text-muted-foreground mt-2">Daftar lowongan kerja yang telah Anda simpan di perangkat ini.</p>
        </div>

        {savedJobs.length > 0 ? (
          <div className="flex flex-col">
            {savedJobs.map(job => (
              // Kita TIDAK mengoper onClick agar kartu berfungsi sebagai Link navigasi biasa ke halaman detail
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="py-16 px-6 flex flex-col items-center justify-center text-center bg-card/50 rounded-2xl border border-border/60 border-dashed my-4">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mb-5 text-blue-500">
              <Bookmark className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Belum ada loker tersimpan</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              Anda belum menyimpan lowongan kerja apapun. Klik ikon Simpan pada kartu lowongan untuk membacanya nanti.
            </p>
            <Link href="/">
              <button className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors">
                Cari Lowongan
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
