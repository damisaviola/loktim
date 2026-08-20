import { Skeleton } from "./ui/Skeleton";

export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-2xs ${className || ''}`}>
      
      {/* Top Section: Avatar, Company, Title & Bookmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          
          {/* Logo Avatar Skeleton */}
          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />

          {/* Title & Company Skeleton */}
          <div className="flex-1 min-w-0 space-y-1.5 pt-0.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-24 sm:w-32 rounded-md" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>
            <Skeleton className="h-5 w-4/5 max-w-[240px] rounded-md" />
          </div>
        </div>

        {/* Bookmark Button Skeleton */}
        <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
      </div>

      {/* Metadata Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-lg" />
        <Skeleton className="h-6 w-18 rounded-lg" />
        <Skeleton className="h-6 w-24 rounded-lg" />
      </div>

      {/* Footer Row: Timestamp & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
          <Skeleton className="h-3.5 w-16 rounded-md" />
        </div>
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="w-3.5 h-3.5 rounded shrink-0" />
        </div>
      </div>

    </div>
  );
}

