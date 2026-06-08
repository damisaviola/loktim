'use client';

import Link from "next/link";
import Image from "next/image";
import { Job } from "@/types";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Badge } from "./ui/Badge";
import { Building2, Bookmark, GraduationCap, Award, MapPin, Users, CalendarRange, Briefcase, Banknote, Sparkles } from "lucide-react";

export function JobCard({ job, onClick, className }: { job: Job; onClick?: (job: Job) => void; className?: string }) {
  const { toggleBookmark, isBookmarked, isLoaded } = useBookmarks();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(job);
    }
  };
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min) return null;
    const formatNumber = (num: number) => {
      return `Rp ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
    };
    if (max && min !== max) return `${formatNumber(min)} - ${formatNumber(max)}`;
    return formatNumber(min);
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  
  const isPremium = job.isPremium;
  const cardClasses = isPremium 
    ? `bg-card border-2 border-blue-400/80 dark:border-blue-700/50 shadow-blue-100/50 dark:shadow-none`
    : `bg-card border border-border/60`;

  return (
    <div className={`${cardClasses} rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all group relative flex flex-col sm:flex-row gap-3 sm:gap-5 ${className || 'mb-4'} overflow-hidden`}>
      
      {isPremium && (
        <div className="absolute top-0 right-0 z-10">
          <div 
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-2 rounded-bl-xl shadow-sm border-l border-b border-blue-400/30 flex items-center justify-center"
            title="Lowongan Promosi"
          >
            <Sparkles className="w-4 h-4 fill-white/20" />
          </div>
        </div>
      )}

      {/* Mobile Top Row (Logo + Title) & Desktop Logo */}
      <div className="flex gap-3.5 sm:block items-start shrink-0">
        <Link href={`/job/${job.id}`} onClick={handleClick} className="shrink-0 relative z-10">
          <div className={`relative w-12 h-12 sm:w-16 sm:h-16 bg-white border ${isPremium ? 'border-blue-200' : 'border-border/50'} flex items-center justify-center overflow-hidden rounded-lg shadow-sm`}>
            {(job.imageUrl || job.company?.logoUrl) ? (
              <Image src={(job.imageUrl || job.company?.logoUrl) as string} alt={job.company?.name || "Logo"} fill sizes="(max-width: 640px) 48px, 64px" className="object-contain p-1" />
            ) : (
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            )}
          </div>
        </Link>
        
        {/* Mobile Title & Company */}
        <div className="sm:hidden flex-1 min-w-0 pr-12">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/job/${job.id}`} onClick={handleClick} className="min-w-0 flex-1 relative z-10">
              <h3 className="text-base font-bold text-primary group-hover:underline truncate leading-snug">
                {job.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground mt-0.5">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{job.company?.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full flex flex-col relative z-10">
        
        {/* Desktop Title & Company */}
        <div className="hidden sm:block pr-12">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/job/${job.id}`} onClick={handleClick} className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-primary group-hover:underline truncate leading-snug">
                {job.title}
              </h3>
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground mt-1.5 mb-2.5">
            <Building2 className="w-4 h-4 shrink-0 text-muted-foreground" />
            <span className="hover:underline cursor-pointer">{job.company?.name}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-0">
          {job.company?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{job.company.location}</span>
            </div>
          )}
          {job.education && job.education !== 'Semua' && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span>Min. {job.education}</span>
              </div>
            </>
          )}
          {job.experience && job.experience !== 'Semua' && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>{job.experience}</span>
              </div>
            </>
          )}
          {job.gender && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>{job.gender}</span>
              </div>
            </>
          )}
          {job.ageRange && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1">
                <CalendarRange className="w-3.5 h-3.5 shrink-0" />
                <span>{job.ageRange} tahun</span>
              </div>
            </>
          )}
          <span className="text-muted-foreground/50">•</span>
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[#057642] font-semibold">{job.type}</span>
          </div>
          {salary && (
            <>
              <span className="text-muted-foreground/50 hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-[#057642] font-semibold bg-[#e6f4ea] px-2 py-0.5 rounded-md text-xs sm:text-sm">
                <Banknote className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
                <span>{salary}</span>
              </div>
            </>
          )}
        </div>

        {/* Localized Badges for authentic, non-AI look */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
          {job.contacts?.whatsapp && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
              Kontak Langsung (WA)
            </span>
          )}
          {job.contacts?.email && !job.contacts?.whatsapp && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1d4ed8] bg-[#eff6ff] border border-[#bfdbfe] px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
              Kirim Email HRD
            </span>
          )}
          {job.title.toLowerCase().includes('mechanic') && (
            <span className="text-[11px] font-bold text-[#b45309] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-full">
              Tambang (Freeport Roster)
            </span>
          )}
          {job.title.toLowerCase().includes('barista') && (
            <span className="text-[11px] font-bold text-[#78350f] bg-[#fff7ed] border border-[#ffedd5] px-2.5 py-0.5 rounded-full">
              Kuliner / Cafe
            </span>
          )}
          {job.title.toLowerCase().includes('gudang') && (
            <span className="text-[11px] font-bold text-[#374151] bg-[#f3f4f6] border border-[#e5e7eb] px-2.5 py-0.5 rounded-full">
              Ritel & Logistik
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-4 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground" suppressHydrationWarning>{formatTimeAgo(job.postedAt)}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline mx-1">•</span>
            <span className="text-xs text-[#057642] font-semibold hidden sm:inline">Jadilah pelamar pertama</span>
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
            {isLoaded && (
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(job.id); }}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                title={isBookmarked(job.id) ? "Hapus dari tersimpan" : "Simpan loker ini"}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked(job.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                <span className="hidden sm:inline">{isBookmarked(job.id) ? 'Tersimpan' : 'Simpan'}</span>
              </button>
            )}
            <Link href={`/job/${job.id}`}>
              <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors text-center cursor-pointer">
                Lihat Detail
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
