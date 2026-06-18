import { Skeleton } from "./ui/Skeleton";

export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row gap-3 sm:gap-5 overflow-hidden relative ${className || ''}`}>
      
      {/* Mobile Top Row (Logo + Title) & Desktop Logo */}
      <div className="flex gap-3.5 sm:block items-start shrink-0">
        <div className="shrink-0">
          <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl" />
        </div>
        
        {/* Mobile Title & Company */}
        <div className="sm:hidden flex-1 min-w-0 pr-12">
          <Skeleton className="h-5 w-[80%] mb-2" />
          <div className="flex items-center gap-1.5 mt-0.5">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full flex flex-col relative z-10">
        
        {/* Desktop Title & Company */}
        <div className="hidden sm:block pr-12">
          <Skeleton className="h-6 w-[70%] max-w-[400px] mb-2" />
          <div className="flex items-center gap-1.5 mt-1.5 mb-2.5">
            <Skeleton className="w-4 h-4 rounded-full shrink-0" />
            <Skeleton className="h-4 w-[40%] max-w-[200px]" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-1 sm:mt-0">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-4 w-20 sm:w-24" />
          </div>
          <span className="text-muted-foreground/30">•</span>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-4 w-24 sm:w-32" />
          </div>
          <span className="text-muted-foreground/30">•</span>
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-4 w-16 sm:w-20" />
          </div>
        </div>

        {/* Localized Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-4">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24" />
            <span className="text-muted-foreground/30 hidden sm:inline mx-1">•</span>
            <Skeleton className="h-3 w-32 hidden sm:inline" />
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
            <Skeleton className="h-4 w-16 hidden sm:block" />
            <Skeleton className="h-4 w-20 sm:w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
