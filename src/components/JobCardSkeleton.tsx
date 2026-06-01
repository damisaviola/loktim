import { Skeleton } from "./ui/Skeleton";

export function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 sm:p-5 mb-4 shadow-sm flex flex-row items-start gap-3.5 sm:gap-5 relative">
      <div className="shrink-0">
        <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg" />
      </div>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex justify-between items-start gap-2">
          <Skeleton className="h-5 sm:h-6 w-[70%] max-w-[400px]" />
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 mb-3">
          <Skeleton className="h-4 w-[40%] max-w-[200px]" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-28 rounded-md" />
        </div>
      </div>
    </div>
  );
}
