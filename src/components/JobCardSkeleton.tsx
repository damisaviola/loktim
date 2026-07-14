import { Skeleton } from "./ui/Skeleton";

export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-white border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 ${className || ''}`}>
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shrink-0" />

          <div className="flex-1 min-w-0 pt-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-5 sm:h-6 w-[80%] max-w-[250px]" />
          </div>
        </div>

        {/* Bookmark Button */}
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      </div>

      {/* Bento Stats Grid */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
        <Skeleton className="h-9 w-full sm:w-28 rounded-xl" />
        <Skeleton className="h-9 w-full sm:w-24 rounded-xl" />
        <Skeleton className="h-9 w-full sm:w-32 rounded-xl col-span-2 sm:col-span-1" />
        <Skeleton className="h-9 w-full sm:w-28 rounded-xl hidden sm:block" />
      </div>

      {/* Tags and Footer */}
      <div className="mt-auto pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-12 rounded-md" />
          <Skeleton className="h-6 w-12 rounded-md" />
          <Skeleton className="h-4 w-16 ml-1" />
        </div>

        <Skeleton className="h-10 w-full sm:w-24 rounded-xl shrink-0 mt-2 sm:mt-0" />
      </div>
    </div>
  );
}
