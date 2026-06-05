import { Skeleton } from "./ui/Skeleton";

export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-card border border-border/60 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-5 overflow-hidden relative ${className || 'mb-4'}`}>
      
      {/* Mobile Top Row (Logo + Title) & Desktop Logo */}
      <div className="flex gap-3.5 sm:block items-start shrink-0">
        <div className="shrink-0">
          <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg" />
        </div>
        
        {/* Mobile Title & Company */}
        <div className="sm:hidden flex-1 min-w-0 pr-12">
          <Skeleton className="h-5 w-[80%] mb-2" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full flex flex-col relative z-10">
        
        {/* Desktop Title & Company */}
        <div className="hidden sm:block pr-12">
          <Skeleton className="h-6 w-[70%] max-w-[400px] mb-2.5" />
          <Skeleton className="h-4 w-[40%] max-w-[200px] mb-3" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-28 hidden sm:block" />
        </div>

        {/* Localized Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4 mb-4">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20 sm:w-24 mt-2 sm:mt-0" />
        </div>
      </div>
    </div>
  );
}
