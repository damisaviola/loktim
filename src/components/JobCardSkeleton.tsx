import { Skeleton } from "./ui/Skeleton";

export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-white border border-slate-200/70 shadow-xs rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 ${className || ''}`}>
      
      {/* Top Section */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shrink-0" />

          <div className="flex-1 min-w-0 pt-0.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-28 rounded" />
              <Skeleton className="h-3.5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-5 sm:h-6 w-3/4 max-w-[280px] rounded-lg" />
          </div>
        </div>

        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
      </div>

      {/* Metadata Chips Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Skeleton className="h-7 w-24 rounded-lg" />
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-7 w-28 rounded-lg" />
        <Skeleton className="h-7 w-24 rounded-lg hidden sm:block" />
      </div>

      {/* Footer Row */}
      <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-9 w-20 rounded-xl shrink-0" />
      </div>
    </div>
  );
}

