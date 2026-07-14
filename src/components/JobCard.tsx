'use client';

import Link from "next/link";
import Image from "next/image";
import { Job } from "@/types";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Badge } from "./ui/Badge";
import { Building2, Bookmark, GraduationCap, Award, MapPin, Users, CalendarRange, Briefcase, Banknote, Sparkles, ChevronRight, Clock } from "lucide-react";

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

    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}mnt`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}j`;
    return `${Math.floor(diffInSeconds / 86400)}h`;
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min) return null;
    const formatNumber = (num: number) => {
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
    ? `bg-white border-2 border-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-primary/40`
    : `bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:border-slate-300`;

  return (
    <div className={`${cardClasses} rounded-[24px] p-5 sm:p-6 transition-all duration-300 group flex flex-col gap-4 sm:gap-5 ${className || ''}`}>
      
      {/* Top Header: Logo, Title, Bookmark */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Link href={`/job/${job.id}`} onClick={handleClick} className="shrink-0 relative z-10 block">
            <div className={`relative w-14 h-14 sm:w-16 sm:h-16 bg-white border border-slate-100 flex items-center justify-center overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-sm`}>
              {(job.imageUrl || job.company?.logoUrl) ? (
                <Image src={(job.imageUrl || job.company?.logoUrl) as string} alt={job.company?.name || "Logo"} fill sizes="64px" className="object-contain p-2.5" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-300" />
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0 pt-0.5">
            <Link href={`/job/${job.id}`} onClick={handleClick} className="min-w-0 block relative z-10 mb-1.5">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight pr-8">
                {job.title}
              </h3>
            </Link>
            <div className="flex flex-wrap items-center gap-1.5">
              <Link
                href={`/perusahaan/${job.companyId || job.company?.id || ''}`}
                className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors truncate max-w-[90%] block"
                onClick={(e) => e.stopPropagation()}
              >
                {job.company?.name}
              </Link>
              {isPremium && (
                <div className="bg-primary text-white px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold shrink-0">
                  <Sparkles className="w-3 h-3" /> Promosi
                </div>
              )}
              {!isPremium && isHot && (
                <div className="bg-orange-500 text-white px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold shrink-0">
                  🔥 Hots
                </div>
              )}
              {isNew && (
                <div className="bg-emerald-500 text-white px-1.5 py-0.5 rounded-md flex items-center gap-1 text-[10px] font-bold shrink-0">
                  ✨ Baru
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bookmark Button */}
        {isLoaded && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(job.id); }}
            className={`shrink-0 p-2.5 rounded-xl transition-colors border ${isBookmarked(job.id) ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
            title={isBookmarked(job.id) ? "Hapus dari tersimpan" : "Simpan loker ini"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked(job.id) ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        {job.company?.location && (
          <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-100">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 truncate">{job.company.location}</span>
          </div>
        )}
        <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-100">
          <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-700 truncate">{job.type}</span>
        </div>
        {salary && (
          <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-100 col-span-2 sm:col-span-1">
            <Banknote className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 truncate">{salary}</span>
          </div>
        )}
        {job.experience && job.experience !== 'Semua' && (
          <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-100">
            <Award className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 truncate">{job.experience}</span>
          </div>
        )}
        {job.education && job.education !== 'Semua' && (
          <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-100">
            <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 truncate">{job.education}</span>
          </div>
        )}
      </div>

      {/* Tags and Footer */}
      <div className="mt-auto pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {isExpired ? (
             <div className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
               Ditutup
             </div>
          ) : (
            <>
              {job.contacts?.whatsapp && (
                <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  WA
                </div>
              )}
              {job.contacts?.email && (
                <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Email
                </div>
              )}
            </>
          )}
          
          <div className="flex items-center gap-1.5 text-slate-400 text-xs ml-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span suppressHydrationWarning>{formatTimeAgo(job.postedAt)}</span>
          </div>
        </div>

        <Link href={`/job/${job.id}`} className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <button className="w-full sm:w-auto h-10 px-5 bg-primary hover:bg-primary/90 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
            Lamar <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
