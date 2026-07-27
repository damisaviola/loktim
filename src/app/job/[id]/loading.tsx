import { Skeleton } from "@/components/ui/Skeleton";

export default function JobDetailLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-3 sm:py-8 space-y-5 sm:space-y-6 mb-28 sm:mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Main Content Column Skeleton */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          
          {/* Header Card Skeleton */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs relative">
            <div className="h-24 sm:h-36 bg-gradient-to-r from-slate-900 to-slate-800 relative">
              <div className="absolute -top-8 sm:-top-10 left-4 sm:left-8 w-16 h-16 sm:w-24 sm:h-24 bg-white border-2 sm:border-4 border-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md">
                <Skeleton className="w-full h-full" />
              </div>
            </div>

            <div className="px-4 sm:px-8 pb-6 sm:pb-8 pt-10 sm:pt-16 space-y-3 sm:space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
                <Skeleton className="h-7 sm:h-9 w-3/4 max-w-[420px] rounded-xl" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-36 rounded-lg" />
                <Skeleton className="h-6 w-28 rounded-lg" />
              </div>

              {/* 6 Symmetrical Bento Grid Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100/80 flex items-center gap-2.5 sm:gap-3 h-full">
                    <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-2.5 w-12 rounded" />
                      <Skeleton className="h-3.5 w-20 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop CTA Skeleton */}
              <div className="hidden sm:flex flex-row gap-3 pt-2">
                <Skeleton className="h-11 flex-1 rounded-2xl" />
                <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
                <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
              </div>
            </div>
          </div>

          {/* Description Card Skeleton */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-xs">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </div>

          {/* Mobile Company Card Skeleton */}
          <div className="lg:hidden bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
            <Skeleton className="h-4 w-32 rounded" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>

        </div>

        {/* Sidebar Column Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Desktop Company Card Skeleton */}
          <div className="hidden lg:block bg-white border border-slate-200/80 rounded-3xl p-6 space-y-5 shadow-xs">
            <Skeleton className="h-4 w-36 rounded" />
            <div className="flex items-center gap-3.5">
              <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-2xl" />
          </div>

          {/* Related Jobs Skeleton */}
          <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            <Skeleton className="h-4 w-36 rounded" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                    <Skeleton className="h-2.5 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Mobile Sticky Bottom Action Bar Skeleton */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200/80 p-3 flex flex-row gap-2 z-50">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
        <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
      </div>

    </div>
  );
}

