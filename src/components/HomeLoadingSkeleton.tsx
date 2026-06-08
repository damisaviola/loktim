import { JobCardSkeleton } from '@/components/JobCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, Settings2 } from 'lucide-react';

export function HomeLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 lg:px-0 max-w-[1128px]">
      
      {/* Premium Search Banner Skeleton */}
      <div className="mt-4 sm:mt-6 w-full bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#312e81] rounded-2xl mb-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="p-6 sm:p-10 relative z-10 flex flex-col space-y-5">
          <div className="space-y-3">
            <Skeleton className="h-8 sm:h-10 w-[80%] max-w-[400px] bg-white/20 rounded-lg" />
            <Skeleton className="h-5 sm:h-6 w-[90%] max-w-[600px] bg-white/10 rounded-md" />
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white/10 backdrop-blur-md p-2 rounded-2xl sm:rounded-full border border-white/20 shadow-inner">
            <div className="relative flex-1">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <div className="w-full h-12 sm:h-14"></div>
            </div>
            <div className="flex gap-2 shrink-0">
              <div className="flex-1 sm:flex-none h-12 sm:h-14 px-6 sm:w-28 rounded-xl sm:rounded-full bg-white/30 flex items-center justify-center"></div>
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-full shrink-0 bg-white/20 flex items-center justify-center"></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Skeleton className="h-4 w-16 bg-white/20" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      {/* Rekomendasi Section Skeleton */}
      <div className="mb-10 w-full overflow-hidden">
        <div className="flex justify-between items-end mb-4 px-1">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex items-stretch gap-4 sm:gap-5 overflow-hidden pb-4 pt-1 px-1 -mx-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`rec-skel-${i}`} className="w-[85vw] sm:w-[350px] shrink-0 flex">
              <JobCardSkeleton className="w-full flex-col !flex-col mb-0 h-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Category Filter - Mobile Skeleton */}
        <div className="w-full overflow-hidden pb-2 lg:hidden">
          <div className="flex gap-2 min-w-max">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`cat-skel-${i}`} className="h-9 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Main Content - Feed Skeleton */}
        <div className="w-full lg:w-3/4 flex-1">
          <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 px-1">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-7 w-24 rounded-full" />
          </div>

          <div className="flex flex-col">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={`feed-skel-${i}`} />
            ))}
          </div>
        </div>

        {/* Right Sidebar - Desktop Categories Skeleton */}
        <div className="hidden lg:flex flex-col w-1/4 shrink-0">
          <div className="sticky top-24 bg-card rounded-2xl border border-border/60 p-5 shadow-sm">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={`side-skel-${i}`} className="h-10 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
