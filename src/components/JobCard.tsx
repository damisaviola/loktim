"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Job } from "@/types";
import { useBookmarks } from "@/hooks/useBookmarks";
import { 
  Building2, 
  Bookmark, 
  MapPin, 
  Briefcase, 
  Banknote, 
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
  ShieldCheck
} from "lucide-react";

export const JobCard = memo(function JobCard({ 
  job, 
  className 
}: { 
  job: Job; 
  className?: string;
  onClick?: (job: Job) => void;
  isSelected?: boolean;
}) {
  const { toggleBookmark, isBookmarked, isLoaded } = useBookmarks();

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 3600) return `${Math.max(1, Math.floor(diffInSeconds / 60))} menit lalu`;
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
  const isNew = job.postedAt && (new Date().getTime() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24) <= 3;

  return (
    <Link
      href={`/job/${job.id}`}
      className={`group relative bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-4 ${
        isPremium ? 'border-amber-300/80 bg-gradient-to-b from-amber-50/20 to-white' : ''
      } ${className || ''}`}
    >
      {/* Header: Logo, Company & Bookmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          
          {/* Logo Avatar */}
          <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-200">
            {(job.imageUrl || job.company?.logoUrl) ? (
              <Image 
                src={(job.imageUrl || job.company?.logoUrl) as string} 
                alt={job.company?.name || "Logo"} 
                fill 
                sizes="48px" 
                loading="lazy"
                className="object-contain p-1.5" 
              />
            ) : (
              <Building2 className="w-5 h-5 text-slate-400" />
            )}
          </div>

          {/* Titles */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 truncate max-w-[160px]">
                {job.company?.name || 'Perusahaan di Timika'}
              </span>

              {isPremium && (
                <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  <Sparkles className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  <span>Prioritas</span>
                </span>
              )}

              {isNew && !isPremium && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  Baru
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {job.title}
            </h3>
          </div>
        </div>

        {/* Bookmark Button */}
        {isLoaded && (
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              toggleBookmark(job.id); 
            }}
            className={`p-2 rounded-xl transition-all duration-200 shrink-0 cursor-pointer border ${
              isBookmarked(job.id) 
                ? 'text-primary bg-primary/10 border-primary/20' 
                : 'text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200/60'
            }`}
            title={isBookmarked(job.id) ? "Hapus dari tersimpan" : "Simpan lowongan"}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked(job.id) ? 'fill-current' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Metadata Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 font-medium text-[11px]">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate max-w-[120px]">{job.location || job.company?.location || 'Timika'}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 font-medium text-[11px]">
          <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
          <span>{job.type}</span>
        </span>

        {job.education && job.education !== 'Semua' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 font-medium text-[11px]">
            <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{job.education}</span>
          </span>
        )}

        {salary && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-[11px] font-mono border border-emerald-200/70">
            <Banknote className="w-3 h-3 text-emerald-600 shrink-0" />
            <span>{salary}</span>
          </span>
        )}
      </div>

      {/* Footer Timestamp & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1 font-medium text-[11px]">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span suppressHydrationWarning>{formatTimeAgo(job.postedAt)}</span>
        </div>

        <div className="inline-flex items-center gap-1 font-bold text-primary group-hover:translate-x-1 transition-transform text-xs">
          <span>Lihat Lowongan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
});
