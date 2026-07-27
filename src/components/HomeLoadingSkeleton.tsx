import { JobCardSkeleton } from '@/components/JobCardSkeleton';
import { Skeleton } from '@/components/ui/Skeleton';

export function HomeLoadingSkeleton() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">

      {/* Modern Hero Search Bento Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        
        {/* Left Hero Headline Card Skeleton */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs min-h-[220px] relative overflow-hidden">
          <div className="space-y-3">
            <Skeleton className="h-6 w-36 bg-white/20 rounded-full" />
            <Skeleton className="h-8 sm:h-10 w-3/4 bg-white/30 rounded-xl" />
            <Skeleton className="h-4 w-1/2 bg-white/20 rounded" />
          </div>

          <div className="pt-6 flex items-center gap-6 border-t border-white/10">
            <div className="space-y-1">
              <Skeleton className="h-7 w-16 bg-white/30 rounded" />
              <Skeleton className="h-3 w-20 bg-white/20 rounded" />
            </div>
            <div className="w-px h-8 bg-white/15"></div>
            <div className="space-y-1">
              <Skeleton className="h-7 w-16 bg-white/30 rounded" />
              <Skeleton className="h-3 w-20 bg-white/20 rounded" />
            </div>
          </div>
        </div>

        {/* Right Search & Quick Filters Card Skeleton */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 sm:p-7 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <Skeleton className="h-12 flex-1 rounded-2xl" />
              <Skeleton className="h-12 w-full sm:w-28 rounded-2xl shrink-0" />
            </div>

            {/* Popular Search Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-14 rounded" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-7 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </div>
      </div>

      {/* Rekomendasi Section Skeleton */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center px-1">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <div className="hidden sm:flex items-center gap-1.5">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
        </div>

        <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`rec-skel-${i}`} className="w-[85vw] sm:w-[350px] shrink-0 flex">
              <JobCardSkeleton className="w-full flex-col !flex-col mb-0 h-full border-slate-200/90" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid Layout Skeleton */}
      <div className="flex flex-col lg:flex-row gap-6 pt-2">

        {/* Left Sidebar Filter Skeleton */}
        <div className="hidden lg:flex flex-col w-[260px] shrink-0">
          <div className="bg-white border border-slate-200/80 shadow-xs rounded-3xl p-5 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-20 rounded" />
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-xl" />
              ))}
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4">
              <Skeleton className="h-3.5 w-24 rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-3/4 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed Skeleton */}
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex items-center justify-between px-1">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <JobCardSkeleton key={`feed-skel-${i}`} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

