'use client';

import { useState, useMemo } from 'react';
import { JobCard } from '@/components/JobCard';
import { JobCardSkeleton } from '@/components/JobCardSkeleton';
import { Job } from '@/types';
import { useBookmarks } from '@/hooks/useBookmarks';
import { 
  Bookmark, 
  ArrowLeft, 
  Search, 
  Briefcase, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export function SavedClient({ initialJobs }: { initialJobs: Job[] }) {
  const { bookmarkedIds, isLoaded } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');

  const savedJobs = useMemo(() => {
    return initialJobs.filter(job => bookmarkedIds.includes(job.id));
  }, [initialJobs, bookmarkedIds]);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) return savedJobs;
    const q = searchQuery.toLowerCase();
    return savedJobs.filter(
      job => 
        job.title.toLowerCase().includes(q) ||
        (job.company?.name || '').toLowerCase().includes(q) ||
        (job.category || '').toLowerCase().includes(q) ||
        (job.location || '').toLowerCase().includes(q)
    );
  }, [savedJobs, searchQuery]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50/60 pb-20">
        <div className="container mx-auto px-4 max-w-5xl pt-8 sm:pt-10">
          <div className="h-6 w-36 bg-slate-200 rounded-lg animate-pulse mb-6"></div>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs mb-8 space-y-3">
            <div className="h-5 w-28 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse"></div>
            <div className="h-4 w-96 bg-slate-100 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      <div className="container mx-auto px-4 max-w-5xl pt-8 sm:pt-10 space-y-6">
        
        {/* 1. TOP BREADCRUMB */}
        <Link 
          href="/jobs" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-primary transition-colors group"
        >
          <div className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 group-hover:border-primary group-hover:text-primary transition-all shadow-2xs">
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span>Kembali ke Daftar Lowongan</span>
        </Link>

        {/* 2. MINIMALIST HEADER CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                <Bookmark className="w-3.5 h-3.5 text-primary fill-primary" />
                <span>Koleksi Simpanan</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Lowongan Kerja Tersimpan
              </h1>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                Daftar lowongan kerja yang telah Anda simpan di perangkat ini untuk dipelajari atau dilamar kemudian.
              </p>
            </div>

            {/* Counter Badge */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-extrabold font-mono">
                <Briefcase className="w-3.5 h-3.5" />
                {savedJobs.length} Lowongan Tersimpan
              </span>
            </div>
          </div>

          {/* Search bar within saved jobs (if any saved jobs) */}
          {savedJobs.length > 2 && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari lowongan tersimpan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50/70 focus:bg-white focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all font-medium"
                />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3. SAVED JOBS GRID OR EMPTY STATE */}
        {savedJobs.length > 0 ? (
          filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Tidak ada hasil pencarian
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tidak ada lowongan tersimpan yang cocok dengan kata kunci &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Tampilkan Semua Simpanan
              </button>
            </div>
          )
        ) : (
          /* EMPTY STATE */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 mx-auto flex items-center justify-center shadow-2xs">
              <Bookmark className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Belum Ada Lowongan Tersimpan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Anda belum menyimpan lowongan kerja apapun. Klik ikon bookmark pada kartu lowongan untuk menyimpannya dan melihatnya di sini kapan saja.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/jobs">
                <button className="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Jelajahi Lowongan Kerja</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
