"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Job } from "@/types";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Building2, Bookmark, GraduationCap, Award, MapPin, Briefcase, Banknote, Sparkles, ChevronRight, Clock } from "lucide-react";

export const JobCard = memo(function JobCard({ job, onClick, className }: { job: Job; onClick?: (job: Job) => void; className?: string }) {
  const { toggleBookmark, isBookmarked, isLoaded } = useBookmarks();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(job);
    }
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 3600) return `${Math.max(1, Math.floor(diffInSeconds / 60))} mnt lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 86400 * 30) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min) return null;
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        const val = (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1);
        return `Rp ${val} Jt`;
      }
      return `Rp ${num.toLocaleString('id-ID')}`;
    };
    if (max && min !== max) return `${formatNumber(min)} - ${formatNumber(max)}`;
    return formatNumber(min);
  };

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const isPremium = job.isPremium;
  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
  const isNew = job.postedAt && (new Date().getTime() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24) <= 3;
  const isHot = job.salaryMin && job.salaryMin >= 5000000;

  const cardClasses = isPremium
    ? `bg-white border border-primary/30 shadow-[0_2px_12px_rgba(2,108,160,0.06)] hover:shadow-[0_8px_24px_rgba(2,108,160,0.12)] hover:border-primary/50`
    : `bg-white border border-slate-200/70 shadow-xs hover:shadow-md hover:border-slate-300/90`;

  return (
    <div className={`${cardClasses} rounded-2xl p-4 sm:p-5 transition-all duration-300 group flex flex-col justify-between gap-4 ${className || ''}`}>
      
      {/* Top Section: Logo, Title & Bookmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <Link href={`/job/${job.id}`} onClick={handleClick} className="shrink-0 block">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-2xs">
              {(job.imageUrl || job.company?.logoUrl) ? (
                <Image 
                  src={(job.imageUrl || job.company?.logoUrl) as string} 
                  alt={job.company?.name || "Logo"} 
                  fill 
                  sizes="(max-width: 640px) 48px, 56px" 
                  loading="lazy"
                  className="object-contain p-2" 
                />
              ) : (
                <Building2 className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Link
                href={`/perusahaan/${job.companyId || job.company?.id || ''}`}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors truncate max-w-[180px] block"
                onClick={(e) => e.stopPropagation()}
              >
                {job.company?.name || 'Perusahaan'}
              </Link>
              {isPremium && (
                <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold shrink-0">
                  <Sparkles className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Promosi
                </span>
              )}
              {!isPremium && isHot && (
                <span className="bg-orange-50 text-orange-700 border border-orange-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold shrink-0">
                  🔥 Hot
                </span>
              )}
              {isNew && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold shrink-0">
                  Baru
                </span>
              )}
            </div>

            <Link href={`/job/${job.id}`} onClick={handleClick} className="min-w-0 block">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                {job.title}
              </h3>
            </Link>
          </div>
        </div>

        {/* Bookmark Button */}
        {isLoaded && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(job.id); }}
            className={`shrink-0 p-2 rounded-xl transition-all border ${
              isBookmarked(job.id) 
                ? 'bg-primary/10 border-primary/20 text-primary' 
                : 'bg-slate-50/80 border-slate-200/60 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}
            title={isBookmarked(job.id) ? "Hapus dari tersimpan" : "Simpan loker ini"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked(job.id) ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Middle Section: Metadata Chips Grid */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
        {(job.location || job.company?.location) && (
          <div className="bg-slate-50 border border-slate-100/90 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-medium text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate max-w-[120px]">{job.location || job.company?.location}</span>
          </div>
        )}
        <div className="bg-slate-50 border border-slate-100/90 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-medium text-slate-700">
          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{job.type}</span>
        </div>
        {salary && (
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-bold text-emerald-700">
            <Banknote className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{salary}</span>
          </div>
        )}
        {job.experience && job.experience !== 'Semua' && (
          <div className="bg-slate-50 border border-slate-100/90 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-medium text-slate-700">
            <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.experience}</span>
          </div>
        )}
        {job.education && job.education !== 'Semua' && (
          <div className="bg-slate-50 border border-slate-100/90 rounded-lg px-2.5 py-1 flex items-center gap-1.5 font-medium text-slate-700">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{job.education}</span>
          </div>
        )}
      </div>

      {/* Bottom Footer: Time ago, channels & Action CTA */}
      <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span suppressHydrationWarning>{formatTimeAgo(job.postedAt)}</span>
          </div>

          {isExpired && (
            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Ditutup
            </span>
          )}

          {!isExpired && job.contacts?.whatsapp && (
            <span className="hidden sm:inline-block bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
              WA Direct
            </span>
          )}
        </div>

        <Link href={`/job/${job.id}`} onClick={handleClick} className="shrink-0">
          <button className="h-9 px-4 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-all shadow-2xs hover:shadow cursor-pointer">
            Detail <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
});

