import Link from "next/link";
import { Job } from "@/types";
import { Badge } from "./ui/Badge";
import { Building2, Bookmark, GraduationCap, Award, MapPin, Users, CalendarRange, Briefcase, Banknote } from "lucide-react";

export function JobCard({ job, onClick }: { job: Job; onClick?: (job: Job) => void }) {
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

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 mb-4 shadow-sm hover:shadow-md transition-all group relative flex flex-col sm:flex-row gap-3 sm:gap-5">
      
      {/* Mobile Top Row (Logo + Title) & Desktop Logo */}
      <div className="flex gap-3.5 sm:block items-start shrink-0">
        <Link href={`/job/${job.id}`} onClick={handleClick} className="shrink-0">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-border/50 flex items-center justify-center overflow-hidden rounded-lg shadow-sm">
            {job.company?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-contain p-1" />
            ) : (
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            )}
          </div>
        </Link>
        
        {/* Mobile Title & Company */}
        <div className="sm:hidden flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/job/${job.id}`} onClick={handleClick} className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-primary group-hover:underline truncate leading-snug">
                {job.title}
              </h3>
            </Link>
            <button className="text-muted-foreground hover:bg-secondary p-1 -mr-1 -mt-1 rounded-full transition-colors shrink-0" title="Simpan">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-foreground mt-0.5">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{job.company?.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full">
        
        {/* Desktop Title & Company */}
        <div className="hidden sm:block">
          <div className="flex justify-between items-start gap-2">
            <Link href={`/job/${job.id}`} onClick={handleClick} className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-primary group-hover:underline truncate leading-snug">
                {job.title}
              </h3>
            </Link>
            <button className="text-muted-foreground hover:bg-secondary p-2 -mr-2 -mt-2 rounded-full transition-colors shrink-0" title="Simpan">
              <Bookmark className="w-5 h-5" />
            </button>
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
                <span>{job.ageRange}</span>
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
        <div className="flex flex-wrap items-center gap-2 mt-3">
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

        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-2">
            {job.isPremium && <Badge variant="premium">Dipromosikan</Badge>}
            <span className="text-xs text-muted-foreground" suppressHydrationWarning>{formatTimeAgo(job.postedAt)}</span>
            <span className="text-xs text-muted-foreground hidden sm:inline mx-1">•</span>
            <span className="text-xs text-[#057642] font-semibold hidden sm:inline">Jadilah pelamar pertama</span>
          </div>
          <Link href={`/job/${job.id}`}>
            <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors w-full sm:w-auto text-center mt-2 sm:mt-0">
              Lihat Detail
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
